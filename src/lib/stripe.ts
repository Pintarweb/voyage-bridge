import Stripe from 'stripe'
import { createAdminClient } from '@/utils/supabase/admin'
import { sendPaymentConfirmationEmail } from '@/lib/emailSender'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    appInfo: {
        name: 'Voyage Bridge',
        version: '0.1.0'
    }
})

export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId || session.metadata?.supabase_user_id
    console.log(`[Stripe Logic] Processing Session for User: ${userId}`)

    if (!userId) {
        console.error('[Stripe Logic] No userId found in session metadata')
        return { success: false, error: 'No userId found' }
    }

    const supabase = createAdminClient()

    // Update supplier status and return data for email
    const { error, data } = await supabase
        .from('suppliers')
        .update({
            payment_status: 'completed',
            subscription_status: 'active',
        })
        .eq('id', userId)
        .select()
        .single()

    if (error) {
        console.error('[Stripe Logic] Error updating supplier:', error)
        return { success: false, error: error.message }
    }

    console.log('[Stripe Logic] Supplier updated successfully')

    // Send Confirmation Email
    const recipientEmail = session.customer_details?.email
    const recipientName = session.customer_details?.name || data?.company_name || 'Supplier'

    if (recipientEmail) {
        console.log(`[Stripe Logic] Sending payment confirmation email to ${recipientEmail}`)
        try {
            await sendPaymentConfirmationEmail(recipientEmail, recipientName)
        } catch (emailError) {
            console.error('[Stripe Logic] Failed to send email:', emailError)
            // We don't fail the whole process if email fails, but we log it
        }
    } else {
        console.warn('[Stripe Logic] No email found in session.customer_details, skipping email.')
    }

    return { success: true }
}
