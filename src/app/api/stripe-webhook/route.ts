import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendPaymentConfirmationEmail } from '@/lib/emailSender'

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

            // Update supplier status and return data for email
            const { error, data } = await supabase
                .from('suppliers')
                .update({
                    payment_status: 'completed',
                })
                .eq('id', userId)
                .select()
                .single()

            if (error) {
                console.error('[Stripe Webhook] Error updating supplier:', error)
                return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
            }
            console.log('[Stripe Webhook] Supplier updated successfully')

            // Send Confirmation Email
            const recipientEmail = session.customer_details?.email
            const recipientName = session.customer_details?.name || data?.company_name || 'Supplier'

            if (recipientEmail) {
                console.log(`[Stripe Webhook] Sending payment confirmation email to ${recipientEmail}`)
                await sendPaymentConfirmationEmail(recipientEmail, recipientName)
            } else {
                console.warn('[Stripe Webhook] No email found in session.customer_details, skipping email.')
            }
        }
    }

    return NextResponse.json({ received: true })
}