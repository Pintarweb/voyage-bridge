import { createClient } from '@/utils/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { priceId } = await request.json()

        if (!priceId) {
            return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
        }

        // 1. Get or create Stripe customer
        const { data: supplier } = await supabase
            .from('suppliers')
            .select('stripe_customer_id, company_name, email')
            .eq('id', user.id)
            .single()

        if (!supplier) {
            return NextResponse.json({ error: 'Supplier profile not found' }, { status: 404 })
        }

        let customerId = supplier.stripe_customer_id

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: supplier.email || user.email,
                name: supplier.company_name,
                metadata: {
                    supabase_user_id: user.id
                }
            })
            customerId = customer.id

            await supabase
                .from('suppliers')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id)
        }

        // 2. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/portal?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-init`,
            metadata: {
                supabase_user_id: user.id
            }
        })

        return NextResponse.json({ url: session.url })

    } catch (error) {
        console.error('Stripe API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}