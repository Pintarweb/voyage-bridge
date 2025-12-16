import { stripe, handleCheckoutSessionCompleted, handleSubscriptionChange } from '@/lib/stripe'
import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'


export async function POST(req: Request) {
    try {
        const body = await req.text()
        const signature = req.headers.get('stripe-signature')

        console.log('[Stripe Webhook] Received request')
        console.log('[Stripe Webhook] Headers:', Object.fromEntries(req.headers.entries()))

        if (!signature) {
            console.error('[Stripe Webhook] No signature found in headers')
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
            const result = await handleCheckoutSessionCompleted(session)

            if (!result.success) {
                return NextResponse.json({ error: result.error }, { status: 500 })
            }
        } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object as Stripe.Subscription
            const result = await handleSubscriptionChange(subscription)

            if (!result.success) {
                return NextResponse.json({ error: result.error }, { status: 500 })
            }
        }

        return NextResponse.json({ received: true })

    } catch (err: any) {
        console.error('[Stripe Webhook] Critical Error:', err)
        return NextResponse.json({ error: `Critical Error: ${err.message}`, stack: err.stack }, { status: 500 })
    }
}