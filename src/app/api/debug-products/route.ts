import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Missing credentials' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Query information_schema to get column names
    const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'products')
        .eq('table_schema', 'public')

    return NextResponse.json({
        columns,
        columnsError,
        env: {
            url: !!supabaseUrl,
            key: !!supabaseKey,
            isServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        }
    })
}
