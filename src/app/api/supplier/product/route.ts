import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    // 1. Check authentication
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const {
            title,
            description,
            website_url,
            photo_url_1,
            photo_url_2,
            photo_url_3,
            city,
            country,
            region,
            continent,
        } = body

        // 2. Validate required fields (basic validation)
        if (!title || !city || !country) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // 3. Insert product
        const { data, error } = await supabase
            .from('products')
            .insert({
                supplier_id: user.id,
                title,
                description,
                website_url,
                photo_url_1,
                photo_url_2,
                photo_url_3,
                city,
                country,
                region,
                continent,
            })
            .select()
            .single()

        if (error) {
            console.error('Error inserting product:', error)
            return NextResponse.json(
                { error: 'Failed to create product' },
                { status: 500 }
            )
        }

        return NextResponse.json({ product: data }, { status: 201 })
    } catch (err: any) {
        console.error('Unexpected error:', err)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
