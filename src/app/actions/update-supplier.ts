'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSupplierProfile(formData: {
    phone_number?: string
    address_line_1?: string
    city?: string
    postcode?: string
    website_url?: string
    whatsapp_business_url?: string
    description?: string
    languages_spoken?: string[] // Assuming array of strings
    social_instagram?: string
    social_facebook?: string
    social_tiktok?: string
    social_linkedin?: string
    social_tripadvisor?: string
}) {
    const supabase = await createClient()

    // 1. Authenticate User
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    // 2. Validate Data (Basic sanitization if needed)
    // Supabase will enforce types, but we can check limits here if needed.

    // 3. Update Supplier Record (Only editable fields)
    const { error: updateError } = await supabase
        .from('suppliers')
        .update({
            phone_number: formData.phone_number || null,
            address_line_1: formData.address_line_1 || null,
            city: formData.city || null,
            postcode: formData.postcode || null,
            website_url: formData.website_url || null,
            whatsapp_business_url: formData.whatsapp_business_url || null,
            description: formData.description || null,
            social_instagram: formData.social_instagram || null,
            social_facebook: formData.social_facebook || null,
            social_tiktok: formData.social_tiktok || null,
            social_linkedin: formData.social_linkedin || null,
            social_tripadvisor: formData.social_tripadvisor || null,
            languages_spoken: formData.languages_spoken || [],
        })
        .eq('id', user.id)

    if (updateError) {
        console.error('Update Profile Error:', updateError)
        return { error: 'Failed to update profile. Please try again.' }
    }

    // 4. Revalidate
    revalidatePath('/supplier/dashboard')
    revalidatePath('/supplier/dashboard/profile')

    return { success: true }
}
