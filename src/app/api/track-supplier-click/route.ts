import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    // 1. Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { supplier_id, product_id } = await request.json()

        if (!supplier_id) {
            return NextResponse.json({ error: 'supplier_id is required' }, { status: 400 })
        }

        // 2. Record click in database
        const { error: insertError } = await supabase
            .from('supplier_clicks')
            .insert({
                agent_id: user.id,
                supplier_id,
                product_id: product_id || null,
                referrer_page: request.headers.get('referer') || null,
                user_agent: request.headers.get('user-agent') || null
            })

        if (insertError) {
            console.error('Error inserting supplier click:', insertError)
        }

        // 3. Fire n8n webhook (async, don't wait for response)
        const webhookUrl = process.env.N8N_SUPPLIER_CLICK_WEBHOOK_URL
        if (webhookUrl) {
            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agent_id: user.id,
                    supplier_id,
                    product_id,
                    timestamp: new Date().toISOString(),
                    referrer: request.headers.get('referer')
                })
            }).catch((err) => {
                console.error('Error sending webhook:', err)
            })
        }

        // 4. Get supplier website URL
        const { data: supplier, error: supplierError } = await supabase
            .from('suppliers')
            .select('website_url')
            .eq('id', supplier_id)
            .single()

        if (supplierError || !supplier) {
            return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            redirect_url: supplier.website_url
        })

    } catch (error: any) {
        console.error('Error in track-supplier-click:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
