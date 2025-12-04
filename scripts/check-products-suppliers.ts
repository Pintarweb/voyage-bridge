
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

async function checkProducts() {
    console.log('Checking products and their supplier IDs...')

    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, product_name, supplier_id')
        .limit(5)

    if (productsError) {
        console.error('Error fetching products:', productsError)
        return
    }

    console.log('Products found:', products)

    if (products && products.length > 0) {
        const supplierIds = products.map(p => p.supplier_id).filter(id => id)
        console.log('Supplier IDs to check:', supplierIds)

        if (supplierIds.length > 0) {
            const { data: suppliers, error: suppliersError } = await supabase
                .from('suppliers')
                .select('id, company_name')
                .in('id', supplierIds)

            if (suppliersError) {
                console.error('Error fetching suppliers:', suppliersError)
            } else {
                console.log('Suppliers found matching product IDs:', suppliers)
            }
        } else {
            console.log('No supplier IDs found in products.')
        }
    }
}

checkProducts()
