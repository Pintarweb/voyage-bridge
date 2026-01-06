import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    try {
        const { feature_id } = await request.json()

        const {
            data: { user },
            error: authError
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 1. Check if already voted
        const { data: existingVote } = await supabase
            .from('feature_votes')
            .select('user_id')
            .eq('feature_id', feature_id)
            .eq('user_id', user.id)
            .single()

        if (existingVote) {
            return NextResponse.json({ error: 'Already voted' }, { status: 400 })
        }

        // 2. Determine Weight (Founding Member = Agent = +2)
        const { data: agentProfile } = await supabase
            .from('agent_profiles')
            .select('id')
            .eq('id', user.id)
            .single()

        const weight = agentProfile ? 2 : 1

        // 3. Insert Vote
        const { error: voteError } = await supabase
            .from('feature_votes')
            .insert({
                feature_id,
                user_id: user.id,
                weight
            })

        if (voteError) {
            if (voteError.code === '23505') { // Unique violation
                return NextResponse.json({ error: 'Already voted' }, { status: 400 })
            }
            throw voteError
        }

        // 4. Update Wishlist Count
        const { data: feature } = await supabase
            .from('feature_wishlist')
            .select('upvote_count')
            .eq('feature_id', feature_id)
            .single()

        if (feature) {
            const { error: updateError } = await supabase
                .from('feature_wishlist')
                .update({ upvote_count: (feature.upvote_count || 0) + weight })
                .eq('feature_id', feature_id)

            if (updateError) throw updateError
        }

        return NextResponse.json({ success: true, weight }, { status: 200 })

    } catch (error: any) {
        console.error('Error voting:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
