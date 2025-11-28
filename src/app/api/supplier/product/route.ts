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
            product_name, // Renamed from title
            product_category,
            description,
            website_url,
            country_code, // Renamed from country, now ISO code
            city,
            photo_url_1,
        } = body

        // 2. Validate required fields
        if (!product_name || !country_code || !city) {
            return NextResponse.json(
                { error: 'Missing required fields (Name, Country, City)' },
                { status: 400 }
            )
        }

        // 3. Insert product
        const { data, error } = await supabase
            .from('products')
            .insert({
                supplier_id: user.id,
                product_name,
                product_category,
                description,
                website_url,
                country_code,
                city,
                photo_url_1,
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
