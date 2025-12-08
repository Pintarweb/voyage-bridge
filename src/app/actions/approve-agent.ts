'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { sendInviteLinkEmail } from '@/lib/emailSender'

type ApproveAgentResponse = {
    success: boolean
    error?: string
    message?: string
}

export async function approveAgent(agentId: string, agentEmail: string): Promise<ApproveAgentResponse> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        // 1. Verify Caller is Admin
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        // Double check admin role from DB
        const { data: adminProfile } = await supabase
            .from('admin_profiles')
            .select('id')
            .eq('id', user.id)
            .single()

        // Also check metadata as backup/fail-safe
        const isMetadataAdmin = user.app_metadata.role === 'admin'

        if (!adminProfile && !isMetadataAdmin) {
            throw new Error('Unauthorized: Admin access required')
        }

        // 2. Update Agent Profile (Approve)
        const { error: updateError } = await supabaseAdmin
            .from('agent_profiles')
            .update({
                is_approved: true,
                role: 'agent',
                verification_status: 'approved',
                approved_at: new Date().toISOString()
            })
            .eq('id', agentId)

        if (updateError) {
            console.error('Database Update Error:', updateError)
            return { success: false, error: 'Failed to update agent profile' }
        }

        // 3. Generate Password Setup Link
        // Use 'recovery' type because user already exists (created during registration)
        // 'invite' type only works for users that don't exist yet
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: agentEmail,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/create-password`
            }
        })

        if (linkError) {
            console.error('Link Generation Error:', linkError)
            return {
                success: true,
                error: 'Agent approved, but failed to generate invite link.',
                message: 'Approval successful, but email failed to send.'
            }
        }

        const inviteLink = linkData.properties.action_link

        // 4. Send Invite Email
        const emailResult = await sendInviteLinkEmail(agentEmail, inviteLink)

        if (!emailResult.success) {
            console.error('Email Send Error:', emailResult.error)
            return {
                success: true,
                error: 'Agent approved, but failed to send invite email.',
                message: 'Approval successful, but email failed to send.'
            }
        }

        console.log('Agent approved and invite email sent to:', agentEmail)

        return {
            success: true,
            message: 'Agent approved and invite email sent successfully.'
        }

    } catch (error: any) {
        console.error('Approve Agent Server Action Error:', error)
        return { success: false, error: error.message || 'Unexpected error' }
    }
}
