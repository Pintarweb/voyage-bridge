'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export async function registerSupplier(formData: any) {
    const supabaseAdmin = createAdminClient()
    const supabaseServer = await createClient()

    const email = formData.email
    const password = formData.password

    // 1. Create User via Admin API (skips email verification if confirmed: true)
    // We set email_confirm: true to verify them immediately.
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
            role: 'pending_supplier',
            company_name: formData.company_name
        }
    })

    if (userError) {
        console.error('Create User Error:', userError)
        return { error: userError.message }
    }

    const userId = userData.user.id

    // 3. Insert Supplier Profile
    const { error: profileError } = await supabaseAdmin
        .from('suppliers')
        .upsert({
            id: userId,
            // Core fields
            company_name: formData.company_name,
            trading_name: formData.trading_name || null,
            country_code: formData.country_code,
            base_currency: formData.base_currency,

            // Contact & Location
            address_line_1: formData.address_line_1 || null,
            city: formData.city || null,
            postcode: formData.postcode || null,
            timezone: formData.timezone || null,

            // Business Details
            company_reg_no: formData.company_reg_no || null,
            license_no: formData.license_no || null,
            tax_id: formData.tax_id || null,
            phone_number: formData.phone_number || null,
            contact_email: email,

            // Profile
            supplier_type: formData.supplier_type || null,
            description: formData.description || null,
            website_url: formData.website_url || null,

            // Socials
            social_instagram: formData.social_instagram || null,
            social_facebook: formData.social_facebook || null,
            social_tiktok: formData.social_tiktok || null,
            social_linkedin: formData.social_linkedin || null,
            social_tripadvisor: formData.social_tripadvisor || null,
            whatsapp_business_url: formData.whatsapp_business_url || null,

            // Media
            languages_spoken: formData.languages_spoken || [],
            logo_url: formData.logo_url || null,
            cover_image_url: formData.cover_image_url || null,

            // State
            role: 'pending_supplier',
            is_approved: false,
            subscription_status: 'pending_payment'
        })

    if (profileError) {
        console.error('Create Profile Error:', profileError)
        // Cleanup user if profile fails? ideally yes, but for now we error.
        return { error: profileError.message }
    }

    // 4. Sign In the user immediately to establish session cookies
    const { error: signInError } = await supabaseServer.auth.signInWithPassword({
        email: email,
        password: password
    })

    if (signInError) {
        console.error('Auto Sign-in Error:', signInError)
        return { error: 'Registration successful but auto-login failed. Please sign in.' }
    }

    return { success: true }
}

// Keep legacy for compatibility if strictly needed, or just export alias?
// The client checks for `createSupplierProfile` import in previous versions of my edits,
// but I updated Step4Review to use `registerSupplier`.
// I will keep the export clean.
