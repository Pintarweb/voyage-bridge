'use server'

/**
 * Placeholder Server Action for Stripe Checkout
 * This will eventually communicate with Stripe to create a checkout session.
 */
export async function createCheckoutSession(priceId: string, userId: string) {
    console.log('[Mock Stripe Checkout] Request:', { priceId, userId })

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock Success
    // Also update the database to simulate payment success for the dashboard flow

    // We need to import inside the function to avoid circular deps or context issues
    const { createAdminClient } = await import('@/utils/supabase/admin')
    const { sendPaymentConfirmationEmail } = await import('@/lib/emailSender')
    const supabaseAdmin = createAdminClient()

    const { data: supplier } = await supabaseAdmin
        .from('suppliers')
        .update({
            payment_status: 'completed',
            stripe_customer_id: 'cus_test_' + userId,
        })
        .eq('id', userId)
        .select('company_name, contact_email')
        .single()

    if (supplier?.contact_email) {
        console.log('[Mock Stripe Checkout] Sending payment confirmation email to:', supplier.contact_email)
        await sendPaymentConfirmationEmail(supplier.contact_email, supplier.company_name || 'Supplier')
    } else {
        console.warn('[Mock Stripe Checkout] Could not find supplier or contact_email to send confirmation. Supplier Data:', supplier)
    }

    return {
        success: true,
        message: 'Mock checkout session created. Ready to proceed to Stripe.',
        sessionId: 'cs_test_mock_session_' + crypto.randomUUID()
    }
}
