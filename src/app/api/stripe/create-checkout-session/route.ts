import { createAdminClient } from '@/utils/supabase/admin'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { userId, userEmail, basePriceId, addOnPriceId, totalSlotsQuantity } = body

        if (!userId || !userEmail || !basePriceId || !addOnPriceId || !totalSlotsQuantity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Validate Price IDs (Basic check for placeholder/test mode)
        if (basePriceId.includes('placeholder') || addOnPriceId.includes('placeholder')) {
            console.warn('Using placeholder Price IDs. Stripe Session creation might fail if not replaced with real IDs.')
        }

        const supabase = createAdminClient()

        // 1. Get or Create Customer
        let customerId: string | undefined

        const { data: supplier, error: supplierError } = await supabase
            .from('suppliers')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single()

        if (supplier?.stripe_customer_id) {
            customerId = supplier.stripe_customer_id
        } else {
            const customer = await stripe.customers.create({
                email: userEmail,
                metadata: {
                    supabase_user_id: userId,
                },
            })
            customerId = customer.id

            await supabase
                .from('suppliers')
                .update({ stripe_customer_id: customerId })
                .eq('id', userId)
        }

        // 2. Construct Line Items
        const line_items = [
            {
                price: basePriceId,
                quantity: 1,
            },
        ]

        const addOnQty = Math.max(0, totalSlotsQuantity - 1)
        if (addOnQty > 0) {
            line_items.push({
                price: addOnPriceId,
                quantity: addOnQty,
            })
        }

        // 3. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            client_reference_id: userId,
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: line_items,
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/approval-pending?payment=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-init?payment=cancelled`,
            metadata: {
                userId: userId,
                totalSlots: totalSlotsQuantity
            },
            subscription_data: {
                trial_period_days: 30,
                description: `ArkAlliance Subscription (${totalSlotsQuantity} Slots)`,
                metadata: {
                    supabase_user_id: userId
                }
            },
        })

        return NextResponse.json({ url: session.url })

    } catch (err: any) {
        console.error('Stripe API Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}