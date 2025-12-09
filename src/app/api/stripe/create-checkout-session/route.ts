import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
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

        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('Missing STRIPE_SECRET_KEY')
            return NextResponse.json({ error: 'Server misconfiguration: Missing Stripe Key' }, { status: 500 })
        }

        const { priceId } = await request.json()

        console.log(`[Stripe Checkout] Received Price ID: ${priceId}`)

        if (!priceId) {
            return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
        }

        if (priceId.includes('placeholder')) {
            console.error('Invalid Price ID (Placeholder detected)')
            return NextResponse.json({
                error: 'Invalid Price ID configuration',
                details: 'The Price ID is a placeholder. Please check your .env.local file and restart the server.'
            }, { status: 400 })
        }

        // Initialize Admin Client for DB operations to bypass potential RLS issues on reading profile data
        const supabaseAdmin = createAdminClient()

        console.log(`[Stripe Checkout] Lookup for User ID: ${user.id}`)

        // 1. Get supplier
        const { data: supplier, error: fetchError } = await supabaseAdmin
            .from('suppliers')
            .select('stripe_customer_id, company_name')
            .eq('id', user.id)
            .single()

        console.log('[Stripe Checkout] Supplier Fetch Result:', { supplier, fetchError })

        if (fetchError || !supplier) {
            console.error('Error fetching supplier:', fetchError)
            return NextResponse.json({
                error: 'Supplier profile not found',
                details: fetchError ? JSON.stringify(fetchError) : 'No supplier data returned',
                userId: user.id
            }, { status: 404 })
        }

        let customerId = supplier.stripe_customer_id

        if (!customerId) {
            console.log('[Stripe Checkout] Creating new Stripe Customer')
            const customer = await stripe.customers.create({
                email: user.email,
                name: supplier.company_name,
                metadata: {
                    supabase_user_id: user.id
                }
            })
            customerId = customer.id
            console.log(`[Stripe Checkout] Created Customer: ${customerId}`)

            await supabaseAdmin
                .from('suppliers')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id)
        }

        console.log('[Stripe Checkout] Creating Checkout Session')
        // 2. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            client_reference_id: user.id, // Explicitly set client reference ID
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