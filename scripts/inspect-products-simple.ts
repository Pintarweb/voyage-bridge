
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function inspectTable() {
    console.log('Inspecting products table...')
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1)

    if (error) {
        console.error('Error fetching one product:', error)
    } else {
        if (data && data.length > 0) {
            console.log('Product keys:', Object.keys(data[0]))
        } else {
            console.log('No products found, cannot infer keys.')
        }
    }
}

inspectTable()
