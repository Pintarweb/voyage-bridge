import Stripe from 'stripe'
import { createAdminClient } from '@/utils/supabase/admin'
import { sendPaymentConfirmationEmail } from '@/lib/emailSender'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    appInfo: {
        name: 'ArkAlliance',
        version: '0.1.0'
    }
})

export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    let userId = session.metadata?.userId || session.metadata?.supabase_user_id
    console.log(`[Stripe Logic] Processing Session for User: ${userId}`)

    if (!userId) {
        console.warn('[Stripe Logic] No userId found in session metadata. Attempting fallback lookup by email.')

        const email = session.customer_details?.email
        if (email) {
            const supabase = createAdminClient()
            const { data: supplier } = await supabase
                .from('suppliers')
                .select('id')
                .eq('contact_email', email)
                .single()

            if (supplier) {
                userId = supplier.id
                console.log(`[Stripe Logic] Found user via email lookup: ${userId}`)
            }
        }
    }

    if (!userId) {
        console.error('[Stripe Logic] Failed to identify user from session.')
        return { success: false, error: 'No userId found' }
    }

    const supabase = createAdminClient()

    // Update supplier status and return data for email
    const totalSlots = session.metadata?.totalSlots ? parseInt(session.metadata.totalSlots) : undefined

    const updateData: any = {
        payment_status: 'completed',
        subscription_status: 'active',
    }

    // Capture subscription details if available
    if (session.subscription) {
        if (typeof session.subscription === 'string') {
            updateData.subscription_id = session.subscription
            // We can't get date unless we expand or fetch, but usually checkout session expansion is tricky here without fetching.
            // Let's fetch the subscription to be sure we get the period end.
            try {
                const sub = await stripe.subscriptions.retrieve(session.subscription)
                console.log('[Stripe Logic] Retrieved Full Subscription Object:', JSON.stringify(sub, null, 2))

                if ((sub as any).current_period_end) {
                    updateData.current_period_end = new Date((sub as any).current_period_end * 1000).toISOString()
                } else {
                    console.warn('[Stripe Logic] sub.current_period_end is missing! Using 30 days from now as fallback.')
                    updateData.current_period_end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                }

                // 2. Trial End
                // @ts-ignore
                if (sub.trial_end) {
                    // @ts-ignore
                    updateData.trial_end = new Date(sub.trial_end * 1000).toISOString()
                    console.log(`[Stripe Logic] Extracted trial_end: ${updateData.trial_end}`)
                } else {
                    console.log('[Stripe Logic] No trial_end found in subscription object')
                }
            } catch (e: any) {
                console.error('[Stripe Logic] Failed to fetch subscription details:', e.message)
            }
        } else {
            // Expanded object logic (rarely hit in default webhook config)
            updateData.subscription_id = session.subscription.id
            // @ts-ignore
            if (session.subscription.current_period_end) {
                // @ts-ignore
                updateData.current_period_end = new Date(session.subscription.current_period_end * 1000).toISOString()
            }
            // @ts-ignore
            if (session.subscription.trial_end) {
                // @ts-ignore
                updateData.trial_end = new Date(session.subscription.trial_end * 1000).toISOString()
            }
        }
    }

    if (totalSlots) {
        updateData.total_slots = totalSlots
    }

    console.log('[Stripe Logic] Final Update Data for Checkout Completion:', JSON.stringify(updateData, null, 2))

    const { error, data } = await supabase
        .from('suppliers')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single()

    if (error) {
        console.error('[Stripe Logic] Error updating supplier:', error)
        return { success: false, error: error.message }
    }

    console.log('[Stripe Logic] Supplier updated successfully')

    // Send Confirmation Email
    const recipientEmail = session.customer_details?.email
    const recipientName = session.customer_details?.name || data?.company_name || 'Supplier'

    if (recipientEmail) {
        console.log(`[Stripe Logic] Sending payment confirmation email to ${recipientEmail}`)
        try {
            await sendPaymentConfirmationEmail(recipientEmail, recipientName)
        } catch (emailError) {
            console.error('[Stripe Logic] Failed to send email:', emailError)
            // We don't fail the whole process if email fails, but we log it
        }
    } else {
        console.warn('[Stripe Logic] No email found in session.customer_details, skipping email.')
    }

    return { success: true }
}

export async function handleSubscriptionChange(subscription: Stripe.Subscription, explicitUserId?: string) {
    const supabase = createAdminClient()
    let userId = explicitUserId || subscription.metadata?.supabase_user_id

    // Fallback: If not in subscription metadata, fetch customer
    if (!userId && typeof subscription.customer === 'string') {
        try {
            const customer = await stripe.customers.retrieve(subscription.customer) as Stripe.Customer
            userId = customer.metadata?.supabase_user_id
        } catch (err) {
            console.error('[Stripe Logic] Error fetching customer:', err)
        }
    }

    if (!userId) {
        console.error('[Stripe Logic] No supabase_user_id found for subscription update')
        return { success: false, error: 'User ID not found' }
    }

    console.log(`[Stripe Logic] Processing Subscription Update for User: ${userId}`)

    console.log(`[Stripe Logic] Processing Subscription Update for User: ${userId}`)

    // Refresh subscription to ensure we have all fields (sometimes update response is partial or older API version behavior)
    let freshSub = subscription
    try {
        freshSub = await stripe.subscriptions.retrieve(subscription.id, { expand: ['customer'] })
    } catch (e) {
        console.error('[Stripe Logic] Failed to refresh subscription, using original object', e)
    }

    // Calculate total slots
    let totalSlots = 0
    if (freshSub.items && freshSub.items.data) {
        freshSub.items.data.forEach(item => {
            totalSlots += item.quantity || 0
        })
    }

    // Determine status
    // Map Stripe status to our internal status
    // active, trialing -> active
    // past_due, unpaid, canceled, incomplete, incomplete_expired -> inactive/canceled
    let status = 'active'
    if (['canceled', 'unpaid', 'past_due', 'incomplete_expired'].includes(freshSub.status)) {
        status = 'canceled'
    } else if (freshSub.status === 'trialing') {
        status = 'active' // Treat trial as active for access
    }

    const isPaused = freshSub.pause_collection?.behavior === 'void'

    // Debug logging for date issue
    console.log('[Stripe Logic] Subscription Date Data:')
    console.log(`- current_period_start: ${(freshSub as any).current_period_start}`)
    console.log(`- current_period_end:   ${(freshSub as any).current_period_end}`)

    // Use current_period_end directly from subscription object (it exists on Stripe.Subscription)
    let periodEnd = (freshSub as any).current_period_end

    // Fallback order: trial_end -> cancel_at -> now
    if (!periodEnd) {
        console.warn('[Stripe Logic] current_period_end is missing. Checking fallbacks.')
        if ((freshSub as any).trial_end) {
            periodEnd = (freshSub as any).trial_end
            console.log(`[Stripe Logic] Using trial_end: ${periodEnd}`)
        } else if (freshSub.cancel_at) {
            periodEnd = freshSub.cancel_at
            console.log(`[Stripe Logic] Using cancel_at: ${periodEnd}`)
        } else {
            console.warn('[Stripe Logic] No date found, using Date.now()')
            periodEnd = Math.floor(Date.now() / 1000)
        }
    }
    const currentPeriodEnd = new Date(periodEnd * 1000).toISOString()

    // Update Access
    const updateData: any = {
        subscription_id: freshSub.id,
        subscription_status: status,
        total_slots: totalSlots,
        is_paused: isPaused,
        current_period_end: currentPeriodEnd
    }

    // Capture trial_end if present (crucial for trial subscriptions)
    if ((freshSub as Stripe.Subscription).trial_end) {
        updateData.trial_end = new Date((freshSub as Stripe.Subscription).trial_end! * 1000).toISOString()
        console.log(`[Stripe Logic] Captured trial_end for update: ${updateData.trial_end}`)
    }

    console.log(`[Stripe Logic] Prepared Update Data for User ${userId}:`, JSON.stringify(updateData, null, 2))

    const { data: currentSupplier } = await supabase
        .from('suppliers')
        .select('payment_status')
        .eq('id', userId)
        .single()

    // Fallback: If checkout webhook failed, ensure payment_status is completed for active subs
    let shouldSendEmail = false
    if (status === 'active') {
        if (currentSupplier && currentSupplier.payment_status !== 'completed') {
            console.warn('[Stripe Logic] Found active subscription with incomplete payment_status. Applying fallback fix.')
            updateData.payment_status = 'completed'
            shouldSendEmail = true
        }
    }

    const { error } = await supabase
        .from('suppliers')
        .update(updateData)
        .eq('id', userId)

    if (error) {
        console.error('[Stripe Logic] Error updating supplier subscription:', error)
        return { success: false, error: error.message }
    }

    if (shouldSendEmail) {
        const customer = freshSub.customer as unknown as Stripe.Customer
        if (customer && customer.email) {
            console.log(`[Stripe Logic] Sending fallback confirmation email to ${customer.email}`)
            try {
                await sendPaymentConfirmationEmail(customer.email, customer.name || 'Supplier')
            } catch (emailError) {
                console.error('[Stripe Logic] Failed to send fallback email:', emailError)
            }
        }
    }

    console.log(`[Stripe Logic] Successfully updated supplier ${userId}: Status=${status}, Slots=${totalSlots}`)
    return { success: true }
}
