
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkAgentProfiles() {
    console.log('Checking agent_profiles table...')

    const { data, error } = await supabase
        .from('agent_profiles')
        .select('id')
        .limit(1)

    if (error) {
        console.error('Error accessing agent_profiles:', error)
    } else {
        console.log('Successfully accessed agent_profiles. Data:', data)
    }
}

checkAgentProfiles()
