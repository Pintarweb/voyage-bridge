
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAgents() {
    const { data: agents, error } = await supabase
        .from('agent_profiles')
        .select('id, agency_name, is_approved, role, verification_status')

    if (error) {
        console.error('Error:', error)
        return
    }

    console.log('Agents:', JSON.stringify(agents, null, 2))
}

checkAgents()
