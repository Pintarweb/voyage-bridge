import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    try {
        const body = await request.json()
        const {
            data: { user },
            error: authError
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { error } = await supabase
            .from('product_requests')
            .insert({
                user_id: user.id,
                destination: body.destination,
                category: body.request_type, // Mapping 'request_type' to 'category'
                budget: body.budget,
                details: body.details
            })

        if (error) throw error

        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error: any) {
        console.error('Error submitting request:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
