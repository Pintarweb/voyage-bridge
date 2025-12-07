import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixSuperadmin() {
    const email = 'superadmin@gmail.com'

    console.log(`Fixing superadmin account: ${email}`)

    // Get user ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
        console.error('Error listing users:', listError)
        return
    }

    const user = users.find(u => u.email === email)

    if (!user) {
        console.error('Superadmin user not found:', email)
        return
    }

    console.log('Found user:', user.id)

    // Update agent_profiles to set proper admin status
    const { error: updateError } = await supabase
        .from('agent_profiles')
        .update({
            role: 'admin',
            is_approved: true,
            verification_status: 'approved',
            approved_at: new Date().toISOString()
        })
        .eq('id', user.id)

    if (updateError) {
        console.error('Error updating agent_profiles:', updateError)
        return
    }

    console.log('✅ Superadmin account fixed!')
    console.log('   - role: admin')
    console.log('   - is_approved: true')
    console.log('   - verification_status: approved')
}

fixSuperadmin()
