import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSuppliersTable() {
    console.log('Checking suppliers table structure...\n')

    // Try to get table info
    const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .limit(1)

    if (error) {
        console.error('Error querying suppliers:', error)
    } else {
        console.log('Sample supplier record:', data)
        if (data && data.length > 0) {
            console.log('\nColumns in suppliers table:', Object.keys(data[0]))
        }
    }

    // Check if we can query the function
    console.log('\n\nChecking handle_new_user function...')
    const { data: funcData, error: funcError } = await supabase.rpc('handle_new_user')

    if (funcError) {
        console.log('Function check result:', funcError.message)
    }
}

checkSuppliersTable()
