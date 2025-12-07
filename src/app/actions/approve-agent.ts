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

        // 3. Trigger Password Reset Email (The "Invite")
        // This allows them to set their password for the first time.

        // Note: resetPasswordForEmail sends the standard Supabase "Reset Password" template.
        // We ensure the redirect URL points to a page handling password reset.
        const origin = (await headers()).get('origin')
        const redirectUrl = `${origin}/auth/reset-password` // Ensure this route exists or is handled by Supabase default UI

        const { error: emailError } = await supabaseAdmin.auth.resetPasswordForEmail(agentEmail, {
            redirectTo: redirectUrl
        })

        if (emailError) {
            console.error('Email Trigger Error:', emailError)
            // We return success: true because the approval worked, but warn about email.
            // Or we could return a specific warning state.
            return { success: true, error: 'Agent approved, but failed to send invite email.' }
        }

        return { success: true }

    } catch (error: any) {
        console.error('Approve Agent Server Action Error:', error)
        return { success: false, error: error.message || 'Unexpected error' }
    }
}
