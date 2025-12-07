'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

type ApproveAgentResponse = {
    success: boolean
    error?: string
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

        // 3. Generate Password Setup Link (The "Invite")
        // Use generateLink instead of resetPasswordForEmail because the user has never set a password
        const origin = (await headers()).get('origin')
        const redirectUrl = `${origin}/auth/reset-password`

        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: agentEmail,
            options: {
                redirectTo: redirectUrl
            }
        })

        if (linkError) {
            console.error('Link Generation Error:', linkError)
            return { success: true, error: 'Agent approved, but failed to generate invite link.' }
        }

        console.log('Generated recovery link for agent:', agentEmail)
        console.log('Recovery link:', linkData.properties.action_link)

        // TODO: Send this link via email using your email service
        // For now, log it so admin can manually send it
        console.log('IMPORTANT: Send this link to the agent:', linkData.properties.action_link)

        return { success: true }

    } catch (error: any) {
        console.error('Approve Agent Server Action Error:', error)
        return { success: false, error: error.message || 'Unexpected error' }
    }
}
