import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { supplier_id } = await request.json()

        if (!supplier_id) {
            return NextResponse.json({ error: 'Missing supplier_id' }, { status: 400 })
        }

        // Check if already saved
        const { data: existing } = await supabase
            .from('saved_suppliers')
            .select('id')
            .eq('user_id', user.id)
            .eq('supplier_id', supplier_id)
            .single()

        if (existing) {
            return NextResponse.json({ message: 'Already saved' }, { status: 200 })
        }

        const { error } = await supabase
            .from('saved_suppliers')
            .insert({
                user_id: user.id,
                supplier_id: supplier_id
            })

        if (error) throw error

        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error: any) {
        // If table doesn't exist, this might fail. We assume migration handles table creation.
        console.error('Error saving supplier:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(request: Request) {
    const supabase = await createClient()
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
        .from('saved_suppliers')
        .select(`
            *,
            supplier:suppliers (
                id,
                company_name,
                contact_email,
                website_url,
                logo_url,
                city,
                country_code,
                supplier_type
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching saved suppliers:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform to flatten structure if needed, or return as is
    return NextResponse.json({ saved_suppliers: data })
}
