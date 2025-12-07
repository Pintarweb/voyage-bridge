'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

type RejectAgentResponse = {
    success: boolean
    error?: string
}

export async function rejectAgent(agentId: string, reason: string): Promise<RejectAgentResponse> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        // 1. Verify Caller is Admin
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        // Double check admin role from DB or metadata
        const { data: adminProfile } = await supabase
            .from('admin_profiles')
            .select('id')
            .eq('id', user.id)
            .single()

        const isMetadataAdmin = user.app_metadata.role === 'admin'

        if (!adminProfile && !isMetadataAdmin) {
            throw new Error('Unauthorized: Admin access required')
        }

        // 2. Update Status and Role, and add rejection details
        const { error: updateError } = await supabaseAdmin
            .from('agent_profiles')
            .update({
                verification_status: 'rejected',
                role: 'pending_agent',
                is_approved: false,
                rejection_reason: reason,
                rejected_at: new Date().toISOString()
            })
            .eq('id', agentId)

        if (updateError) {
            console.error('Error updating agent profile:', updateError)
            return {
                success: false,
                error: 'Failed to update agent profile status.'
            }
        }

        return { success: true }

    } catch (error: any) {
        console.error('Unexpected error in rejectAgent:', error)
        return {
            success: false,
            error: error.message || 'An unexpected error occurred.'
        }
    }
}
