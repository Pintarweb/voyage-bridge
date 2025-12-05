import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAgents() {
    console.log('Checking agent_profiles table...')

    const { data, error } = await supabase
        .from('agent_profiles')
        .select('*')

    if (error) {
        console.error('Error fetching agents:', error)
        return
    }

    console.log(`Found ${data.length} agents:`)
    data.forEach(agent => {
        console.log(`- ID: ${agent.id}`)
        console.log(`  Email: ${agent.email}`)
        console.log(`  Agency Name: ${agent.agency_name}`)
        console.log(`  Status: ${agent.verification_status}`)
        console.log('---')
    })
}

checkAgents()
