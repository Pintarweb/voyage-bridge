import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'
import { sendPaymentConfirmationEmail } from '@/lib/emailSender'

/**
 * DEBUG ONLY: Allows manual triggering of payment fulfillment logic in development.
 */
export async function POST(req: Request) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
    }

    try {
        const supabase = createAdminClient()

        // 1. Get the latest pending supplier who signed in recently
        const { data: supplier, error } = await supabase
            .from('suppliers')
            .select('id, contact_email, company_name')
            .eq('payment_status', 'pending_payment')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error || !supplier) {
            return NextResponse.json({ error: 'No pending supplier found to fulfill' }, { status: 404 })
        }

        // 2. Fulfill
        await supabase
            .from('suppliers')
            .update({
                payment_status: 'completed',
                subscription_status: 'active'
            })
            .eq('id', supplier.id)

        // 3. Send Email
        console.log(`[Debug Hook] 📧 Fulfilling payment for ${supplier.contact_email}`)
        await sendPaymentConfirmationEmail(supplier.contact_email, supplier.company_name || 'Supplier')

        return NextResponse.json({ success: true, user: supplier.contact_email })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
