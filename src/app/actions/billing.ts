'use server'

import { createClient } from '@/utils/supabase/server'
import { stripe } from '@/lib/stripe'

export async function getBillingStats() {
    const supabase = await createClient()

    // 1. Fetch all suppliers with subscription data
    const { data: suppliers, error } = await supabase
        .from('suppliers')
        .select('id, company_name, subscription_status, total_slots, created_at, stripe_customer_id')

    if (error) {
        console.error('Error fetching billing stats:', error)
        return {
            mrr: 0,
            activeSubscriptions: 0,
            trialingSubscriptions: 0,
            totalRevenue: 0,
            subscriptions: []
        }
    }

    // 2. Base Fee and Slot Fee (from BillingTab logic)
    const baseFee = 30
    const slotFee = 20

    let mrr = 0
    let activeSubs = 0
    let trialingSubs = 0

    const subscriptions = suppliers.map(s => {
        const additionalSlots = Math.max(0, (s.total_slots || 1) - 1)
        const monthlyTotal = s.subscription_status === 'active' || s.subscription_status === 'trialing'
            ? baseFee + (additionalSlots * slotFee)
            : 0

        if (s.subscription_status === 'active') {
            mrr += monthlyTotal
            activeSubs++
        } else if (s.subscription_status === 'trialing') {
            trialingSubs++
        }

        return {
            id: s.id,
            companyName: s.company_name,
            status: s.subscription_status,
            slots: s.total_slots || 1,
            monthlyFee: monthlyTotal,
            createdAt: s.created_at
        }
    })

    // 3. (Optional) Fetch Recent Charges from Stripe for Total Revenue
    // For now, let's mock total revenue or leave as 0 if we don't have a payments table.
    // Real-time Stripe fetch might be slow for a summary, but let's try a quick list if needed.

    return {
        mrr,
        activeSubscriptions: activeSubs,
        trialingSubscriptions: trialingSubs,
        totalRevenue: mrr * 12, // Simple projection for now
        subscriptions: subscriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
}
