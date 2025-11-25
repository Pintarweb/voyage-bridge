import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Missing credentials' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(5)

    return NextResponse.json({
        count,
        countError,
        products,
        productsError,
        env: {
            url: !!supabaseUrl,
            key: !!supabaseKey,
            isServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        }
    })
}
