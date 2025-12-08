
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service key to bypass RLS

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAgents() {
    console.log('Checking recent agent profiles...')
    const { data, error } = await supabase
        .from('agent_profiles')
        .select('id, email, verification_status, role, is_approved, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    if (error) {
        console.error('Error:', error)
    } else {
        console.table(data)
    }
}




async function checkCounts() {
    console.log('Checking counts (Admin/Service Role)...')
    const { count: supplierCount, data: suppliers, error } = await supabase.from('suppliers').select('*', { count: 'exact' })
    if (error) console.error('Error fetching suppliers:', error)

    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
    const { count: agentCount } = await supabase.from('agent_profiles').select('*', { count: 'exact', head: true })

    console.log({ supplierCount, productCount, agentCount })

    // Fix stale data: Update approved supplier to active
    const approvedSupplier = suppliers?.find(s => s.is_approved && s.subscription_status !== 'active')
    if (approvedSupplier) {
        console.log(`Updating supplier ${approvedSupplier.id} to active...`)
        const { error: updateError } = await supabase
            .from('suppliers')
            .update({ subscription_status: 'active' })
            .eq('id', approvedSupplier.id)

        if (updateError) console.error('Error updating supplier:', updateError)
        else console.log('Supplier updated.')
    }
}

checkCounts()
