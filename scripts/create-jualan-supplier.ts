
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createJualanSupplier() {
    const email = 'supplier100@voyage.com'
    const password = 'Password123!'

    console.log(`Creating/Checking supplier with email: ${email}`)

    // 1. Check if user exists first
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    let userId = null;
    const existingUser = users.find(u => u.email === email)

    if (existingUser) {
        console.log(`User already exists: ${existingUser.id}`)
        userId = existingUser.id
    } else {
        // 2. Create Auth User
        const { data: user, error: userError } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: { role: 'supplier' }
        })

        if (userError || !user.user) {
            console.error('Error creating auth user:', userError)
            return
        }
        console.log(`Auth user created: ${user.user.id}`)
        userId = user.user.id
    }

    // 3. Create Supplier Record
    const { data, error } = await supabase
        .from('suppliers')
        .upsert({
            id: userId,
            company_name: 'Jualan 100',
            contact_email: email,
            website_url: 'https://jualan100.com',
            country_code: 'MY',
            base_currency: 'MYR',
            address_line_1: '100 Jualan St',
            city: 'Kuala Lumpur',
            postcode: '50450',
            timezone: 'Asia/Kuala_Lumpur',
            payment_status: 'paid',
            subscription_status: 'active',
            is_approved: true,
            supplier_type: 'Hotel'
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating supplier record:', error)
        return
    }

    console.log('Supplier "Jualan 100" created successfully!')
    console.log('Email:', email)
    console.log('Password (temporary):', password)
}

createJualanSupplier()
