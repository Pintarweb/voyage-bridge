
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

async function checkColumns() {
    console.log('Checking agent_profiles columns...')
    const { data: agents, error: agentError } = await supabase
        .from('agent_profiles')
        .select('id, verification_status')
        .limit(1)

    if (agentError) {
        console.log('Error checking agent_profiles:', agentError.message)
    } else {
        console.log('agent_profiles has verification_status. Sample:', agents)
    }

    console.log('Checking suppliers columns...')
    const { data: suppliers, error: supplierError } = await supabase
        .from('suppliers')
        .select('id, subscription_status')
        .limit(1)

    if (supplierError) {
        console.log('Error checking suppliers:', supplierError.message)
    } else {
        console.log('suppliers has subscription_status. Sample:', suppliers)
    }
}

checkColumns()
