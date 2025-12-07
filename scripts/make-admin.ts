
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const email = process.argv[2] || 'superadmin@gmail.com'

async function makeAdmin() {
    console.log(`Promoting ${email} to admin...`)

    let userId = ''
    let user = null

    // 1. Find or Create User
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
        console.error('Error listing users:', error)
        return
    }

    user = users.find(u => u.email === email) as any

    if (!user) {
        console.log(`User ${email} not found. Creating user...`)
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: email,
            password: 'password123', // Default password for new admin
            email_confirm: true,
            app_metadata: { role: 'admin' },
            user_metadata: { role: 'admin' }
        })

        if (createError) {
            console.error('Error creating user:', createError)
            return
        }

        if (!newUser.user) {
            console.error('User creation returned null user')
            return
        }

        user = newUser.user
        console.log(`Created new admin user: ${email} with password: password123`)
    }

    userId = user.id
    console.log(`Found user ${email} with ID: ${userId}`)

    // 2. Update User Metadata
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        {
            app_metadata: { ...user.app_metadata, role: 'admin' },
            user_metadata: { ...user.user_metadata, role: 'admin' }
        }
    )

    if (updateError) {
        console.error('Error updating user:', updateError)
        return
    }

    // 3. Ensure Admin Profile exists in agent_profiles (as per constraint)
    console.log('Ensuring admin profile exists in agent_profiles...')
    const { error: profileError } = await supabase
        .from('agent_profiles')
        .upsert({
            id: userId,
            email: email,
            agency_name: 'Admin Account',
            license_number: 'ADMIN-LICENSE-001', // Required string
            city: 'Admin City', // Likely required
            country_code: 'US', // Likely required based on registration form
            role: 'admin',
            is_approved: true,
            verification_status: 'approved'
        })

    if (profileError) {
        console.error('Error creating admin profile:', profileError)
        // Check if error is due to role enum mismatch (if migration not applied)
        if (profileError.message?.includes('invalid input value for enum')) {
            console.warn('Warning: Role "admin" might not exist in enum yet. Trying "agent" as fallback just to safeguard profile existence.')
            await supabase.from('agent_profiles').upsert({
                id: userId,
                email: email,
                agency_name: 'Admin Account',
                role: 'agent', // Fallback
                is_approved: true,
                verification_status: 'approved'
            })
        }
    } else {
        console.log('Admin profile created/updated in agent_profiles')
    }

    console.log('Successfully promoted user to admin!')
    console.log('New Metadata:', updatedUser.user.app_metadata)
}

makeAdmin()
