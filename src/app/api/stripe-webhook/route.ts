import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
    const body = await req.text()
    const headerPayload = await headers()
    const signature = headerPayload.get('stripe-signature')

    console.log('[Stripe Webhook] Received request')

    if (!signature) {
        console.error('[Stripe Webhook] No signature found')
        return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('[Stripe Webhook] Missing STRIPE_WEBHOOK_SECRET')
        return NextResponse.json({ error: 'Server config error' }, { status: 500 })
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

    console.log(`[Stripe Webhook] Event Type: ${event.type}`)

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        console.log(`[Stripe Webhook] Processing Session for User: ${userId}`)

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