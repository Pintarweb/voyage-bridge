import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
    const body = await req.text()
    const headerPayload = await headers()
    const signature = headerPayload.get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        )
    } catch (error: any) {
        console.error(`Webhook signature verification failed.`, error.message)
        return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id

        if (userId) {
            const supabase = createAdminClient()

            // Update supplier status
            const { error } = await supabase
                .from('suppliers')
                .update({
                    payment_status: 'completed',
                    // We could also map priceId to a plan name here if needed
                })
                .eq('id', userId)

            if (error) {
                console.error('Error updating supplier:', error)
                return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
            }
        }
    }

    return NextResponse.json({ received: true })
}