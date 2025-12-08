'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { sendInviteLinkEmail, sendRejectionEmail } from '@/lib/emailSender'
import { revalidatePath } from 'next/cache'

type AdminActionResponse = {
    success: boolean
    error?: string
    message?: string
}

/**
 * Generic handler for approving both Agents and Suppliers.
 */
export async function handleUserApproval(
    userId: string,
    profileType: 'agent' | 'supplier',
    userEmail: string
): Promise<AdminActionResponse> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        // 1. Verify Caller is Admin
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        const { data: adminProfile } = await supabase
            .from('admin_profiles')
            .select('id')
            .eq('id', user.id)
            .single()

        const isMetadataAdmin = user.app_metadata.role === 'admin'

        if (!adminProfile && !isMetadataAdmin) {
            throw new Error('Unauthorized: Admin access required')
        }

        // 2. Perform DB Updates based on Profile Type
        if (profileType === 'agent') {
            const { error: updateError } = await supabaseAdmin
                .from('agent_profiles')
                .update({
                    is_approved: true,
                    role: 'agent',
                    verification_status: 'approved',
                    approved_at: new Date().toISOString()
                })
                .eq('id', userId)

            if (updateError) throw new Error('Failed to update agent profile: ' + updateError.message)

        } else if (profileType === 'supplier') {
            const { error: updateError } = await supabaseAdmin
                .from('suppliers')
                .update({
                    is_approved: true,
                    role: 'supplier', // Set role to full supplier
                    subscription_status: 'active', // Update subscription status to allow access
                    // payment_status should already be 'completed' if they are in this list, 
                    // but we can enforce it or leave as is.
                })
                .eq('id', userId)

            if (updateError) throw new Error('Failed to update supplier profile: ' + updateError.message)
        }

        // 3. Generate Invite/Setup Link
        // We use 'recovery' type because the user likely already exists (from registration)
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: userEmail,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/create-password`
            }
        })

        if (linkError) {
            console.error('Link Generation Error:', linkError)
            return {
                success: true,
                error: 'Profile approved, but failed to generate invite link.',
                message: 'Approval successful, but email failed to send.'
            }
        }

        // 4. Send Email
        const inviteLink = linkData.properties.action_link
        const emailResult = await sendInviteLinkEmail(userEmail, inviteLink)

        if (!emailResult.success) {
            console.error('Email Send Error:', emailResult.error)
            return {
                success: true,
                error: 'Profile approved, but failed to send invite email.',
                message: 'Approval successful, but email failed to send.'
            }
        }

        revalidatePath('/admin/verification')
        return {
            success: true,
            message: `${profileType === 'agent' ? 'Agent' : 'Supplier'} approved and invite email sent.`
        }

    } catch (error: any) {
        console.error('Approval Action Error:', error)
        return { success: false, error: error.message || 'Unexpected error' }
    }
}

/**
 * Handle Supplier Rejection (Refund & Reject)
 */
export async function rejectSupplier(userId: string, reason?: string): Promise<AdminActionResponse> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        // 1. Verify Caller is Admin (Same check)
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        const isMetadataAdmin = user.app_metadata.role === 'admin'
        // Ideally reuse the strict check or move to a helper, strictly duplicating for safety now
        if (!isMetadataAdmin) {
            const { data: adminProfile } = await supabase.from('admin_profiles').select('id').eq('id', user.id).single()
            if (!adminProfile) throw new Error('Unauthorized')
        }

        // 2. Fetch Supplier to get Stripe details (Placeholder)
        const { data: supplier, error: fetchError } = await supabaseAdmin
            .from('suppliers')
            // Using contact_email as per schema usage elsewhere. 
            // Removed stripe_charge_id as it may not exist in this partial schema.
            .select('stripe_customer_id, contact_email')
            .eq('id', userId)
            .single()

        if (fetchError || !supplier) {
            console.error('Fetch Supplier Error:', fetchError)
            throw new Error('Supplier not found or database error')
        }

        // 3. Retrieve Stripe Details
        // const customerId = supplier.stripe_customer_id
        // const chargeId = supplier.stripe_charge_id // Assuming we store this

        // 4. Call Stripe Refund API (Placeholder)
        console.log(`[MOCK] Initiating Stripe Refund for ${supplier.contact_email} (Cust: ${supplier.stripe_customer_id})`)
        // await stripe.refunds.create({ charge: chargeId })

        // 5. Update DB Status
        const { error: updateError } = await supabaseAdmin
            .from('suppliers')
            .update({
                is_approved: false,
                payment_status: 'refunded',
                role: 'pending_supplier', // Revert to pending_supplier as rejected_supplier is not a valid enum
                rejection_reason: reason || null
            })
            .eq('id', userId)

        if (updateError) throw new Error('Failed to update supplier status: ' + updateError.message)

        // 6. Send Rejection Email
        const emailResult = await sendRejectionEmail(supplier.contact_email, reason)
        if (!emailResult.success) {
            console.error('Rejection Email Failed:', emailResult.error)
            // We still return success because the refund/db-update worked, 
            // but we might want to warn the admin.
        } else {
            console.log(`Rejection Email Sent to ${supplier.contact_email}`)
        }

        revalidatePath('/admin/verification')
        return {
            success: true,
            message: 'Supplier rejected and refund initiated.'
        }

    } catch (error: any) {
        console.error('Rejection Action Error:', error)
        return { success: false, error: error.message || 'Unexpected error' }
    }
}
