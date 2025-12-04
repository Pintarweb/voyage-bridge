
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

async function testSupplierAccess() {
    console.log('Testing access to suppliers table...')

    const { data, error } = await supabase
        .from('suppliers')
        .select('id, company_name')
        .limit(1)

    if (error) {
        console.error('Error accessing suppliers table:', error)
    } else {
        console.log('Successfully accessed suppliers table. Data:', data)
    }
}

testSupplierAccess()
