'use server'

import { createAdminClient } from '@/utils/supabase/admin'

type AgentRegistrationData = {
    email: string
    agency_name: string
    license_number: string
    website_url: string
    city: string
    country_code: string
    address: string
    phone_number: string
}

export async function registerAgent(data: AgentRegistrationData) {
    const supabaseAdmin = createAdminClient()

    try {
        // 1. Create User Silently (email_confirm: true suppresses "Confirm Email", but invalidates need for verification flow)
        // Since we want them to "wait for approval", we don't want them logging in yet.
        // But without a password, they can't login anyway.
        // And without sending a Magic Link, they can't login.
        // So they are effectively locked out until we Invite them or they request a password reset (which sends email).

        const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
            email: data.email,
            email_confirm: true, // Auto-verify email so they don't get the "Confirm your email" automatic mail
            user_metadata: {
                role: 'pending_agent',
                agency_name: data.agency_name,
                license_number: data.license_number,
                website_url: data.website_url,
                city: data.city,
                country_code: data.country_code,
                address: data.address,
                phone_number: data.phone_number,
                has_agreed_tc: true // Assumed true from form submission
            }
        })

        if (error) {
            console.error('Admin Create User Error:', error)
            // Handle "User already registered" specifically if needed
            if (error.message.includes('already registered')) {
                return { success: false, error: 'User already exists. Please login.' }
            }
            return { success: false, error: error.message }
        }

        return { success: true }

    } catch (error: any) {
        console.error('Server Action Error:', error)
        return { success: false, error: error.message || 'An unexpected error occurred' }
    }
}
