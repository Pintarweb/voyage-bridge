import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    try {
        const body = await request.json()
        const { source, metric_score, comment } = body

        // 1. Validate User (Optional for Exit Intent)
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        // If not authenticated and NOT exit intent, block
        if ((authError || !user) && source !== 'Exit_Intent') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Insert into Feedback_Entries using ADMIN client to bypass RLS
        const { data, error } = await adminSupabase
            .from('feedback_entries')
            .insert({
                user_id: user?.id || null,
                source,
                metric_score,
                comment
            })
            .select()

        if (error) throw error

        // 3. Automation Trigger: Check for High Priority Alert
        // If "Founding Member" (mock logic for now, checking score 1-2)
        // In a real scenario, we'd check user role/subscription tier here.
        if (metric_score && metric_score <= 2) {
            // In a real system, this would trigger a notification service, email, or Slack alert.
            // For this implementation, the Admin Board will query for these "High Frustration" entries.
            console.log('High Priority Alert Triggered for User:', user?.id)
        }

        return NextResponse.json({ success: true, data }, { status: 201 })

    } catch (error: any) {
        console.error('Feedback API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
