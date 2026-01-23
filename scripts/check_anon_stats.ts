
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkAnonStats() {
    console.log('Fetching stats as public (anon) user...')

    const { data, error } = await supabase.rpc('get_landing_stats')

    if (error) {
        console.error('Error fetching stats:', error)
    } else {
        console.log('Stats received:', data)
    }
}

checkAnonStats()
