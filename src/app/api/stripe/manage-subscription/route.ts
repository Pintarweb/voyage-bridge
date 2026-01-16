import { createAdminClient } from '@/utils/supabase/admin'
import { stripe, handleSubscriptionChange } from '@/lib/stripe'
import { sendSubscriptionUpdateEmail } from '@/lib/emailSender'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// We duplicate these here for simplicity on the server side
const BASE_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_EARLY_BIRD_PROMO || "price_1Sd9sTCOxzNHMrVaPeQ9Bz7e"
const ADD_ON_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_ADDITIONAL_SLOT || "price_1Sd9uICOxzNHMrVagUBvShn7"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { userId, action, newSlotCount } = body

        if (!userId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        console.log(`[Subscription API] User: ${userId}, Action: ${action}, Slots: ${newSlotCount}`)

        const supabase = createAdminClient()
        const { data: supplier, error } = await supabase
            .from('suppliers')
            .select('stripe_customer_id, subscription_id, company_name')
            .eq('id', userId)
            .maybeSingle()

        if (error) {
            console.error('[Subscription API] Supabase error fetching supplier:', error)
            return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
        }

        let subscriptionId = supplier?.subscription_id

        // Fallback: If no subscription_id in DB, try to find one via Stripe Customer ID
        if (!subscriptionId && supplier?.stripe_customer_id) {
            const subs = await stripe.subscriptions.list({
                customer: supplier.stripe_customer_id,
                status: 'all',
                limit: 1
            })
            if (subs.data.length > 0) {
                subscriptionId = subs.data[0].id

                // Optional: Update DB to save this ID for next time
                supabase.from('suppliers').update({ subscription_id: subscriptionId }).eq('id', userId).then(() => { })
            }
        }

        if (!subscriptionId) {
            return NextResponse.json({ error: 'Subscription not found. Please verify you have an active plan.' }, { status: 404 })
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId, { expand: ['customer'] })
        const customer = subscription.customer as Stripe.Customer
        const customerEmail = customer.email
        const companyName = supplier?.company_name || customer.name

        if (action === 'update_slots') {
            if (typeof newSlotCount !== 'number' || newSlotCount < 1) {
                return NextResponse.json({ error: 'Invalid slot count' }, { status: 400 })
            }

            const addOnQuantity = newSlotCount - 1
            const itemsToUpdate: any[] = []

            // Find existing items
            let baseItem = subscription.items.data.find(item => item.price.id === BASE_PRICE_ID)
            let addOnItem = subscription.items.data.find(item => item.price.id === ADD_ON_PRICE_ID)

            if (!baseItem) {
                console.warn('[Subscription API] Base item not found matching constant.')
            }

            // 2. Handle Add-on Item
            if (addOnQuantity > 0) {
                if (addOnItem) {
                    // Update existing add-on
                    itemsToUpdate.push({ id: addOnItem.id, quantity: addOnQuantity })
                } else {
                    // Add new add-on item
                    itemsToUpdate.push({ price: ADD_ON_PRICE_ID, quantity: addOnQuantity })
                }
            } else {
                // Quantity is 0, remove add-on if it exists
                if (addOnItem) {
                    itemsToUpdate.push({ id: addOnItem.id, deleted: true })
                }
            }

            if (itemsToUpdate.length > 0) {
                const updatedSub = await stripe.subscriptions.update(subscriptionId, {
                    items: itemsToUpdate,
                    proration_behavior: 'always_invoice', // Charge immediately for upgrades
                })

                // Sync to DB immediately
                await handleSubscriptionChange(updatedSub, userId)

                // Send Email
                if (customerEmail) {
                    await sendSubscriptionUpdateEmail(customerEmail, 'plan_change', {
                        newSlotCount: newSlotCount,
                        companyName: companyName
                    })
                }
            }

            return NextResponse.json({ success: true })

        } else if (action === 'pause') {
            const updatedSub = await stripe.subscriptions.update(subscriptionId, {
                pause_collection: { behavior: 'void' },
            })
            await handleSubscriptionChange(updatedSub, userId)

            if (customerEmail) {
                const periodEnd = (updatedSub as any).current_period_end || (updatedSub as any).trial_end || (updatedSub as any).cancel_at || Math.floor(Date.now() / 1000)
                const endDate = new Date(periodEnd * 1000).toISOString()

                await sendSubscriptionUpdateEmail(customerEmail, 'pause', {
                    endDate: endDate,
                    companyName: companyName
                })
            }

            return NextResponse.json({ success: true, status: 'paused' })

        } else if (action === 'resume') {
            const updatedSub = await stripe.subscriptions.update(subscriptionId, {
                pause_collection: '', // Unset pause_collection
            })
            await handleSubscriptionChange(updatedSub, userId)

            if (customerEmail) {
                await sendSubscriptionUpdateEmail(customerEmail, 'resume', {
                    companyName: companyName
                })
            }

            return NextResponse.json({ success: true, status: 'active' })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

    } catch (err: any) {
        console.error('Subscription API Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
