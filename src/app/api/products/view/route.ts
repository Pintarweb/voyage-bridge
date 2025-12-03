import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { product_id } = await request.json()

    console.log('View API called for product:', product_id)

    if (!product_id) {
        console.log('View API error: product_id missing')
        return NextResponse.json({ error: 'product_id is required' }, { status: 400 })
    }

    // Increment view count using the RPC function
    const { error } = await supabase.rpc('increment_view_count', { product_id })

    if (error) {
        console.error('Error incrementing view count:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
