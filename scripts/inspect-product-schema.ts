
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase env vars')
    process.exit(1)
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function inspectSchema() {
    // There isn't a direct "describe table" in supabase-js client usually, 
    // but we can insert a dummy row and fail to see columns, or select one.
    // Actually, just listing keys of a selected row is easiest if one exists.

    // Attempt to verify columns by selecting one row
    const { data, error } = await supabase.from('products').select('*').limit(1)

    if (error) {
        console.error('Error selecting:', error)
        return
    }

    if (data && data.length > 0) {
        console.log('--- Existing Product Keys ---')
        console.log(Object.keys(data[0]).sort())
    } else {
        console.log('No products found to infer schema from keys. Please check migrations manually if needed, or I can try to insert a dummy object to see errors.')
    }
}

inspectSchema()
