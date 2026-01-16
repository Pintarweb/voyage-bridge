
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSuppliers() {
    const { data: suppliers, error } = await supabase
        .from('suppliers')
        .select('id, company_name, is_approved, payment_status')

    if (error) {
        console.error('Error:', error)
        return
    }

    console.log('Suppliers:', JSON.stringify(suppliers, null, 2))
}

checkSuppliers()
