'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

function generatePasscode(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

export async function approveUser(userId: string, role: 'agent' | 'supplier', email: string) {
    const supabase = createAdminClient()
    const passcode = generatePasscode()

    try {
        // 1. Update Password
        const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
            password: passcode,
        })

        if (authError) throw new Error(`Auth update failed: ${authError.message}`)

        // 2. Update Profile Status
        if (role === 'agent') {
            const { error: profileError } = await supabase
                .from('agent_profiles')
                .update({ verification_status: 'approved' })
                .eq('id', userId)
            if (profileError) throw new Error(`Profile update failed: ${profileError.message}`)
        } else {
            const { error: profileError } = await supabase
                .from('suppliers')
                .update({ subscription_status: 'active' }) // Assuming 'active' is approved
                .eq('id', userId)
            if (profileError) throw new Error(`Profile update failed: ${profileError.message}`)
        }

        // 3. Trigger Webhook
        // Replace with actual n8n webhook URL
        const webhookUrl = process.env.N8N_APPROVAL_WEBHOOK_URL
        if (webhookUrl) {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    passcode,
                    role,
                    type: 'approval'
                })
            })
        } else {
            console.warn('N8N_APPROVAL_WEBHOOK_URL not set')
        }

        revalidatePath('/admin/verification')
        return { success: true }
    } catch (error: any) {
        console.error('Approve user error:', error)
        return { success: false, error: error.message }
    }
}

export async function rejectUser(userId: string, role: 'agent' | 'supplier', email: string) {
    const supabase = createAdminClient()

    try {
        // 1. Update Profile Status
        if (role === 'agent') {
            const { error: profileError } = await supabase
                .from('agent_profiles')
                .update({ verification_status: 'rejected' })
                .eq('id', userId)
            if (profileError) throw new Error(`Profile update failed: ${profileError.message}`)
        } else {
            const { error: profileError } = await supabase
                .from('suppliers')
                .update({ subscription_status: 'rejected' })
                .eq('id', userId)
            if (profileError) throw new Error(`Profile update failed: ${profileError.message}`)
        }

        // 2. Trigger Webhook
        const webhookUrl = process.env.N8N_REJECTION_WEBHOOK_URL
        if (webhookUrl) {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    role,
                    type: 'rejection'
                })
            })
        }

        revalidatePath('/admin/verification')
        return { success: true }
    } catch (error: any) {
        console.error('Reject user error:', error)
        return { success: false, error: error.message }
    }
}
