
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

async function listSuppliers() {
    console.log('Listing all visible suppliers...')

    const { data, error } = await supabase
        .from('suppliers')
        .select('*')

    if (error) {
        console.error('Error fetching suppliers:', error)
    } else {
        console.log('Total suppliers found:', data?.length)
        console.log('Suppliers:', data)
    }
}

listSuppliers()
