import { createAdminClient } from '@/utils/supabase/admin'
import { stripe, handleSubscriptionChange } from '@/lib/stripe'
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
            .select('stripe_customer_id, subscription_id')
            .eq('id', userId)
            .maybeSingle()

        if (error) {
            console.error('[Subscription API] Supabase error fetching supplier:', error)
            console.error('[Subscription API] Queried userId:', userId)
            return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
        }

        let subscriptionId = supplier?.subscription_id

        // Fallback: If no subscription_id in DB, try to find one via Stripe Customer ID
        if (!subscriptionId && supplier?.stripe_customer_id) {
            console.log(`[Subscription API] No subscription_id in DB, searching Stripe for customer: ${supplier.stripe_customer_id}`)
            const subs = await stripe.subscriptions.list({
                customer: supplier.stripe_customer_id,
                status: 'active',
                limit: 1
            })
            if (subs.data.length > 0) {
                subscriptionId = subs.data[0].id
                console.log(`[Subscription API] Found active subscription: ${subscriptionId}`)

                // Optional: Update DB to save this ID for next time
                supabase.from('suppliers').update({ subscription_id: subscriptionId }).eq('id', userId).then(() => { })
            }
        }

        if (!subscriptionId) {
            return NextResponse.json({ error: 'Subscription not found. Please verify you have an active plan.' }, { status: 404 })
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        if (action === 'update_slots') {
            if (typeof newSlotCount !== 'number' || newSlotCount < 1) {
                return NextResponse.json({ error: 'Invalid slot count' }, { status: 400 })
            }

            const addOnQuantity = newSlotCount - 1
            const itemsToUpdate: any[] = []

            // Find existing items
            let baseItem = subscription.items.data.find(item => item.price.id === BASE_PRICE_ID)
            let addOnItem = subscription.items.data.find(item => item.price.id === ADD_ON_PRICE_ID)

            // 1. Maintain Base Item (Ensure it exists and has qty 1)
            // If for some reason base item is missing or wrong quantity, we fix it.
            // But usually we just leave it alone if it's correct.
            /* 
               NOTE: If the user subscribed with a different price ID initially, this logic might need adjustment.
               For now we assume the standard setup.
            */
            if (!baseItem) {
                // If base item is missing, we might be in a weird state or using a different price. 
                // We'll proceed with add-on logic primarily.
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
            }

            return NextResponse.json({ success: true })

        } else if (action === 'pause') {
            const updatedSub = await stripe.subscriptions.update(subscriptionId, {
                pause_collection: { behavior: 'void' },
            })
            await handleSubscriptionChange(updatedSub, userId)
            return NextResponse.json({ success: true, status: 'paused' })

        } else if (action === 'resume') {
            const updatedSub = await stripe.subscriptions.update(subscriptionId, {
                pause_collection: '', // Unset pause_collection
            })
            await handleSubscriptionChange(updatedSub, userId)
            return NextResponse.json({ success: true, status: 'active' })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

    } catch (err: any) {
        console.error('Subscription API Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
