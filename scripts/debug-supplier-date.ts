
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkSupplier() {
    const { data, error } = await supabase
        .from('suppliers')
        .select('id, is_paused, current_period_end')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (error) console.error(error)
    else console.log(JSON.stringify(data, null, 2))
}

checkSupplier()
