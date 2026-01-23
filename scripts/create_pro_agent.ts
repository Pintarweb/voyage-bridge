
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function createProUser() {
    console.log('Creating professional user...')

    // 1. Create User
    const email = 'sarah.jenkins@elite-travels.com'
    const password = 'Password123!'
    const name = 'Sarah Jenkins'
    const agencyName = 'Elite Global Travels'

    // Check if exists
    const { data: users } = await supabase.auth.admin.listUsers()
    const existing = users.users.find(u => u.email === email)

    let userId = existing?.id

    if (!existing) {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'agent', full_name: name }
        })

        if (authError) {
            console.error('Error creating user:', authError)
            return
        }
        userId = authData.user.id
        console.log('Auth user created.')
    } else {
        console.log('User already exists, updating profile...')
    }

    if (userId) {
        // 2. Create/Update Profile
        const { error: profileError } = await supabase
            .from('agent_profiles')
            .upsert({
                id: userId,
                email: email,
                agency_name: agencyName,
                first_name: 'Sarah',
                last_name: 'Jenkins',
                verification_status: 'approved',
                country_code: 'US' // United States
            })

        if (profileError) {
            console.error('Error creating profile:', profileError)
        } else {
            console.log('Professional profile created/updated.')
        }
    }
}

createProUser()
