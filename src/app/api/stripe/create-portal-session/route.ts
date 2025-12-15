
import { createAdminClient } from '@/utils/supabase/admin'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { userId } = body

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
        }

        const supabase = createAdminClient()
        const { data: supplier, error } = await supabase
            .from('suppliers')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single()

        if (error || !supplier?.stripe_customer_id) {
            return NextResponse.json({ error: 'Supplier or Stripe Customer ID not found' }, { status: 404 })
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: supplier.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/supplier/dashboard`,
        })

        return NextResponse.json({ url: session.url })

    } catch (err: any) {
        console.error('Stripe Portal Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
