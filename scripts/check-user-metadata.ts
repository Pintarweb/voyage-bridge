import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables')
    console.log('Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function checkUserMetadata() {
    console.log('Checking user metadata for agent111@gmail.com...\n')

    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
        console.error('Error:', error)
        return
    }

    const agent = users?.find(u => u.email === 'agent111@gmail.com')

    if (agent) {
        console.log('User found!')
        console.log('User ID:', agent.id)
        console.log('Email:', agent.email)
        console.log('\nuser_metadata:', JSON.stringify(agent.user_metadata, null, 2))
    } else {
        console.log('User not found')
    }
}

checkUserMetadata()
