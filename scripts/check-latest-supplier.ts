
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function checkLatest() {
    const { data, error } = await supabase
        .from('suppliers')
        .select('id, contact_email, created_at, payment_status, subscription_status')
        .order('created_at', { ascending: false })
        .limit(3)

    if (error) console.error(error)
    else console.table(data)
}

checkLatest()
