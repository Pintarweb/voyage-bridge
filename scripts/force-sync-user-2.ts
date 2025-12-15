
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import path from 'path'

// Load env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.STRIPE_SECRET_KEY) {
    console.error('Missing environment variables')
    process.exit(1)
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function syncUser(userId: string) {
    console.log(`Syncing user: ${userId}`)

    // 1. Get stripe_customer_id
    const { data: supplier, error } = await supabase.from('suppliers').select('stripe_customer_id, subscription_id').eq('id', userId).single()

    if (error || !supplier) {
        console.error('Supplier not found', error)
        return
    }

    let subId = supplier.subscription_id
    if (!subId && supplier.stripe_customer_id) {
        // fetch from stripe
        console.log(`Looking up subscription for customer ${supplier.stripe_customer_id}`)
        const subs = await stripe.subscriptions.list({ customer: supplier.stripe_customer_id, limit: 1 })
        if (subs.data.length > 0) {
            subId = subs.data[0].id
        }
    }

    if (!subId) {
        console.error('No subscription found for user')
        return
    }

    console.log(`Found Subscription ID: ${subId}`)

    const subscription = await stripe.subscriptions.retrieve(subId, { expand: ['customer'] })

    let totalSlots = 0
    subscription.items.data.forEach(item => {
        totalSlots += item.quantity || 0
    })

    let status = 'active'
    if (['canceled', 'unpaid', 'past_due', 'incomplete_expired'].includes(subscription.status)) {
        status = 'canceled'
    }

    const isPaused = subscription.pause_collection?.behavior === 'void'
    let periodEnd = subscription.current_period_end
    if (!periodEnd) {
        periodEnd = subscription.cancel_at || Math.floor(Date.now() / 1000)
    }

    console.log(`Stripe Data -> Status: ${status}, Slots: ${totalSlots}, Paused: ${isPaused}, End: ${new Date(periodEnd * 1000).toISOString()}`)

    // Update DB
    const updateData = {
        subscription_id: subId,
        subscription_status: status,
        total_slots: totalSlots,
        is_paused: isPaused,
        current_period_end: new Date(periodEnd * 1000).toISOString(),
        payment_status: 'completed'
    }

    const { error: updateError } = await supabase.from('suppliers').update(updateData).eq('id', userId)

    if (updateError) {
        console.error('Failed to update DB', updateError)
    } else {
        console.log('Successfully updated DB!')
    }
}

// User ID from logs: 27586e1b-e724-4371-bd5a-673601c7a54f
syncUser('27586e1b-e724-4371-bd5a-673601c7a54f')
