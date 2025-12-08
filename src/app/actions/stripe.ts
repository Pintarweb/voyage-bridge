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

    // We need to import createAdminClient inside the function to avoid circular deps or context issues
    const { createAdminClient } = await import('@/utils/supabase/admin')
    const supabaseAdmin = createAdminClient()

    await supabaseAdmin
        .from('suppliers')
        .update({
            payment_status: 'completed',
            stripe_customer_id: 'cus_test_' + userId,
            // Keep role as 'pending_supplier' and is_approved as false until admin approves
        })
        .eq('id', userId)

    return {
        success: true,
        message: 'Mock checkout session created. Ready to proceed to Stripe.',
        sessionId: 'cs_test_mock_session_' + crypto.randomUUID()
    }
}
