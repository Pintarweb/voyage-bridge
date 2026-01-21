'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { sendInviteLinkEmail, sendRejectionEmail, sendSupplierWelcomeEmail } from '@/lib/emailSender'
import { revalidatePath } from 'next/cache'
import { stripe } from '@/lib/stripe'

type AdminActionResponse = {
    success: boolean
    error?: string
    message?: string
}

/**
 * Generic handler for approving both Agents and Suppliers.
 */
export async function handleUserApproval(
    userId: string,
    profileType: 'agent' | 'supplier',
    userEmail: string,
    verificationData?: {
        riskLevel: number;
        internalNotes: string;
        checklist: any;
    }
): Promise<AdminActionResponse> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        // 1. Verify Caller is Admin
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        const { data: adminProfile } = await supabase
            .from('admin_profiles')
            .select('id')
            .eq('id', user.id)
            .single()

        const isMetadataAdmin = user.app_metadata.role === 'admin'

        if (!adminProfile && !isMetadataAdmin) {
            throw new Error('Unauthorized: Admin access required')
        }

        // 2. Perform DB Updates based on Profile Type
        if (profileType === 'agent') {
            const { error: updateError } = await supabaseAdmin
                .from('agent_profiles')
                .update({
                    is_approved: true,
                    role: 'agent',
                    verification_status: 'approved',
                    approved_at: new Date().toISOString()
                })
                .eq('id', userId)

            if (updateError) throw new Error('Failed to update agent profile: ' + updateError.message)

        } else if (profileType === 'supplier') {
            const { error: updateError } = await supabaseAdmin
                .from('suppliers')
                .update({
                    is_approved: true,
                    role: 'supplier', // Set role to full supplier
                    subscription_status: 'active', // Update subscription status to allow access
                    // Add verification data if present
                    verification_notes: verificationData?.internalNotes || null,
                    risk_level: verificationData?.riskLevel || 1,
                    verification_checklist: verificationData?.checklist || {},
                    // payment_status should already be 'completed' if they are in this list, 
                    // but we can enforce it or leave as is.
                })
                .eq('id', userId)

            if (updateError) throw new Error('Failed to update supplier profile: ' + updateError.message)
        }

        // 3. Generate Invite/Setup Link
        // We use 'recovery' type because the user likely already exists (from registration)
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: userEmail,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/create-password`
            }
        })

        if (linkError) {
            console.error('Link Generation Error:', linkError)
            return {
                success: true,
                error: 'Profile approved, but failed to generate invite link.',
                message: 'Approval successful, but email failed to send.'
            }
        }

        // 4. Send Email
        const inviteLink = linkData.properties.action_link
        let emailResult;

        if (profileType === 'supplier') {
            emailResult = await sendSupplierWelcomeEmail(userEmail, inviteLink)
        } else {
            emailResult = await sendInviteLinkEmail(userEmail, inviteLink)
        }

        if (!emailResult.success) {
            console.error('Email Send Error:', emailResult.error)
            return {
                success: true,
                error: `Profile approved, but failed to send ${profileType} invite email.`,
                message: 'Approval successful, but email failed to send.'
            }
        }

        revalidatePath('/admin/verification')
        return {
            success: true,
            message: `${profileType === 'agent' ? 'Agent' : 'Supplier'} approved and invite email sent.`
        }

    } catch (error: any) {
        console.error('Approval Action Error:', error)
        return { success: false, error: error.message || 'Unexpected error' }
    }
}

/**
 * Handle Supplier Rejection (Refund & Reject)
 */
export async function rejectSupplier(userId: string, reason?: string): Promise<AdminActionResponse> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        // 1. Verify Caller is Admin (Same check)
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        const isMetadataAdmin = user.app_metadata.role === 'admin'
        // Ideally reuse the strict check or move to a helper, strictly duplicating for safety now
        if (!isMetadataAdmin) {
            const { data: adminProfile } = await supabase.from('admin_profiles').select('id').eq('id', user.id).single()
            if (!adminProfile) throw new Error('Unauthorized')
        }

        // 2. Fetch Supplier to get Stripe details (Placeholder)
        const { data: supplier, error: fetchError } = await supabaseAdmin
            .from('suppliers')
            // Using contact_email as per schema usage elsewhere. 
            // Removed stripe_charge_id as it may not exist in this partial schema.
            .select('stripe_customer_id, contact_email')
            .eq('id', userId)
            .single()

        if (fetchError || !supplier) {
            console.error('Fetch Supplier Error:', fetchError)
            throw new Error('Supplier not found or database error')
        }

        // 4. Call Stripe Refund API
        const customerId = supplier.stripe_customer_id

        if (customerId) {
            console.log(`[Admin] Processing Refund for Customer: ${customerId}`)
            try {
                // A. Cancel Active Subscriptions
                const subscriptions = await stripe.subscriptions.list({
                    customer: customerId,
                    status: 'active',
                    limit: 1
                })

                for (const sub of subscriptions.data) {
                    await stripe.subscriptions.cancel(sub.id)
                    console.log(`[Admin] Cancelled Subscription: ${sub.id}`)
                }

                // B. Refund Last Payment
                const paymentIntents = await stripe.paymentIntents.list({
                    customer: customerId,
                    limit: 1,
                })

                if (paymentIntents.data.length > 0) {
                    const pi = paymentIntents.data[0]
                    if (pi.status === 'succeeded' && pi.amount > 0) {
                        await stripe.refunds.create({
                            payment_intent: pi.id,
                            reason: 'requested_by_customer' // or 'duplicate' or 'fraudulent'
                        })
                        console.log(`[Admin] Refunded PaymentIntent: ${pi.id}`)
                    } else {
                        console.log(`[Admin] PaymentIntent ${pi.id} not eligible for refund (Status: ${pi.status})`)
                    }
                } else {
                    console.log('[Admin] No payment intents found to refund.')
                }

            } catch (stripeError: any) {
                console.error('Stripe Refund/Cancel Error:', stripeError)
                // We don't block rejection if refund fails, but we verify logs
            }
        } else {
            console.warn('[Admin] No Stripe Customer ID found for supplier. Skipping refund.')
        }

        // 5. Update DB Status
        const { error: updateError } = await supabaseAdmin
            .from('suppliers')
            .update({
                is_approved: false,
                payment_status: 'refunded',
                subscription_status: 'rejected',
                role: 'pending_supplier', // Revert to pending_supplier as rejected_supplier is not a valid enum
                rejection_reason: reason || null
            })
            .eq('id', userId)

        if (updateError) throw new Error('Failed to update supplier status: ' + updateError.message)

        // 6. Send Rejection Email
        const emailResult = await sendRejectionEmail(supplier.contact_email, reason)
        if (!emailResult.success) {
            console.error('Rejection Email Failed:', emailResult.error)
            // We still return success because the refund/db-update worked, 
            // but we might want to warn the admin.
        } else {
            console.log(`Rejection Email Sent to ${supplier.contact_email}`)
        }

        revalidatePath('/admin/verification')
        return {
            success: true,
            message: 'Supplier rejected and refund initiated.'
        }

    } catch (error: any) {
        console.error('Rejection Action Error:', error)
        return { success: false, error: error.message || 'Unexpected error' }
    }
}

/**
 * Handle User Management Actions (Freeze, Deactivate, Reset Password)
 */
export async function manageUserStatus(
    userId: string,
    action: 'freeze' | 'deactivate' | 'reset_password',
    userType: 'Agent' | 'Supplier'
): Promise<AdminActionResponse> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        // 1. Verify Caller is Admin
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        const isMetadataAdmin = user.app_metadata.role === 'admin'
        if (!isMetadataAdmin) {
            const { data: adminProfile } = await supabase.from('admin_profiles').select('id').eq('id', user.id).single()
            if (!adminProfile) throw new Error('Unauthorized')
        }

        // 2. Perform Action
        if (action === 'reset_password') {
            const table = userType === 'Agent' ? 'agent_profiles' : 'suppliers'
            const { data: userData, error: fetchError } = await supabase
                .from(table)
                .select(userType === 'Agent' ? 'email' : 'contact_email')
                .eq('id', userId)
                .single()

            if (fetchError || !userData) throw new Error('User not found')

            const email = userType === 'Agent' ? (userData as any).email : (userData as any).contact_email
            if (!email) throw new Error('User email not found')

            const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/update-password`
            })

            if (resetError) throw new Error('Failed to send reset email: ' + resetError.message)

            return { success: true, message: `Password reset email sent to ${email}` }
        }

        if (action === 'freeze' || action === 'deactivate') {
            const updates: any = { is_approved: false }
            if (userType === 'Agent') {
                updates.verification_status = action === 'deactivate' ? 'rejected' : 'pending'
            } else {
                updates.subscription_status = action === 'deactivate' ? 'canceled' : 'past_due'
            }

            const table = userType === 'Agent' ? 'agent_profiles' : 'suppliers'
            const { error: updateError } = await supabaseAdmin
                .from(table)
                .update(updates)
                .eq('id', userId)

            if (updateError) throw new Error(`Failed to ${action} user: ` + updateError.message)

            revalidatePath('/admin')
            return { success: true, message: `User ${action === 'freeze' ? 'frozen' : 'deactivated'} successfully.` }
        }

        return { success: false, error: 'Invalid action' }

    } catch (error: any) {
        console.error('Management Action Error:', error)
        return { success: false, error: error.message || 'Unexpected error' }
    }
}
