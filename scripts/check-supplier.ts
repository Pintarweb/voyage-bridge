
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing environment variables')
    process.exit(1)
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function checkUser(userId: string) {
    console.log(`Checking user: ${userId}`)
    const { data: supplier, error } = await supabase
        .from('suppliers')
        .select('id, stripe_customer_id, subscription_id, subscription_status')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Error fetching supplier:', error)
    } else {
        console.log('Supplier Record:', supplier)
    }
}

// User ID from previous logs
checkUser('d6ed0e77-8f74-467c-b510-29be7cb1fb89')
