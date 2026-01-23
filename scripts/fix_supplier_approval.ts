
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixApproval() {
    console.log('Checking supplier approval status...')

    // Check current status
    const { data: suppliers, error } = await supabase
        .from('suppliers')
        .select('id, company_name, is_approved, subscription_status')
    //.ilike('contact_email', '%@voyagebridge.com%') // Filter removed to catch all demo data

    if (error) {
        console.error('Error fetching suppliers:', error)
        return
    }

    console.log(`Found ${suppliers.length} demo suppliers.`)
    const unapproved = suppliers.filter(s => s.is_approved !== true)
    console.log(`${unapproved.length} are NOT approved.`)

    if (unapproved.length > 0) {
        console.log('Approving all demo suppliers...')
        const ids = unapproved.map(s => s.id)

        const { error: updateError } = await supabase
            .from('suppliers')
            .update({ is_approved: true })
            .in('id', ids)

        if (updateError) {
            console.error('Error updating suppliers:', updateError)
        } else {
            console.log('Successfully approved suppliers.')
        }
    } else {
        console.log('All demo suppliers are already approved.')
    }
}

fixApproval()
