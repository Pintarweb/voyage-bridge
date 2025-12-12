
import { createAdminClient } from '../src/utils/supabase/admin'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function createTestSupplier() {
    const supabase = createAdminClient()
    const email = `test.supplier.${Date.now()}@example.com`

    console.log(`Creating test supplier with email: ${email}`)

    const { data: user, error: userError } = await supabase.auth.admin.createUser({
        email: email,
        password: 'Password123!',
        email_confirm: true,
        user_metadata: { role: 'supplier' }
    })

    if (userError || !user.user) {
        console.error('Error creating auth user:', userError)
        return
    }

    console.log(`Auth user created: ${user.user.id}`)

    const { data, error } = await supabase
        .from('suppliers')
        .upsert({
            id: user.user.id,
            company_name: 'Test Supplier Co',
            contact_email: email,
            website_url: 'https://example.com',
            country_code: 'US',
            base_currency: 'USD',
            address_line_1: '123 Test St',
            city: 'Test City',
            postcode: '12345',
            timezone: 'UTC',
            payment_status: 'pending',
            subscription_status: 'inactive',
            // Add other required fields if necessary based on your schema
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating supplier:', error)
        return
    }

    console.log('Supplier created successfully!')
    console.log('User ID:', data.id)
    console.log('Email:', data.contact_email)
}

createTestSupplier()
