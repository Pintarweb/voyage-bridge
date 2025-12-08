
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Use ANON key to verify public access

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkStats() {
    console.log('Checking landing stats (public access)...')
    const { data, error } = await supabase.rpc('get_landing_stats')

    if (error) {
        console.error('Error fetching stats:', error)
    } else {
        console.log('Stats:', data)
    }
}

checkStats()
