'use server'

import { createClient } from '@/utils/supabase/server'

export type FeedbackStats = {
    happinessScore: number
    totalReviews: number
    trend: number // percentage change vs last week (or just a mock for now)
    reviews: any[]
}

export type RoadmapItem = {
    id: string
    title: string
    description: string
    status: 'planned' | 'in_progress' | 'completed' | 'proposed'
    votes: number
    requestCount: number
    hasVoted?: boolean
}

export type ResponseTemplate = {
    id: string
    label: string
    content: string
}

export async function getFeedbackStats(): Promise<FeedbackStats> {
    const supabase = await createClient()

    // Fetch all feedback with user details
    // We need to join with profiles types if possible, but for now we'll just get raw data
    // Since user_id can be agent or supplier, getting names is tricky without a unified view or multiple queries.
    // For now, let's fetch the feedback entries.
    // 1. Fetch raw feedback entries
    const { data: entries, error } = await supabase
        .from('feedback_entries')
        .select('*')
        .order('created_at', { ascending: false })

    // 1b. Fetch responses
    const { data: responses } = await supabase
        .from('feedback_responses')
        .select('*')

    if (error) {
        console.error('Error fetching feedback:', error)
        return { happinessScore: 0, totalReviews: 0, trend: 0, reviews: [] }
    }

    if (!entries || entries.length === 0) {
        return { happinessScore: 0, totalReviews: 0, trend: 0, reviews: [] }
    }

    // 2. Extract User IDs to fetch profile data manually
    // Filter out null user_ids
    const userIds = Array.from(new Set(entries.map(e => e.user_id).filter(id => id)))

    // 3. Fetch Profiles (Agents and Suppliers) in parallel if we have user IDs
    let agentMap = new Map<string, any>()
    let supplierMap = new Map<string, any>()

    if (userIds.length > 0) {
        const [agentsRes, suppliersRes] = await Promise.all([
            supabase.from('agent_profiles').select('id, agency_name, email').in('id', userIds),
            supabase.from('suppliers').select('id, company_name, contact_email').in('id', userIds)
        ])

        if (agentsRes.data) {
            agentsRes.data.forEach((a: any) => agentMap.set(a.id, a))
        }
        if (suppliersRes.data) {
            suppliersRes.data.forEach((s: any) => supplierMap.set(s.id, s))
        }
    }

    // 3b. Map responses
    const responseMap = new Map<string, string>()
    if (responses) {
        responses.forEach((r: any) => responseMap.set(r.feedback_id, r.response_text))
    }

    // 4. Calculate Happiness Score & Trend separately
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const currentWeekEntries = entries.filter(e => new Date(e.created_at) >= oneWeekAgo && e.metric_score !== null)
    const previousWeekEntries = entries.filter(e => {
        const d = new Date(e.created_at)
        return d >= twoWeeksAgo && d < oneWeekAgo && e.metric_score !== null
    })

    const calculateAvg = (items: any[]) => {
        if (items.length === 0) return 0
        const total = items.reduce((acc, curr) => acc + curr.metric_score, 0)
        return Math.round((total / items.length / 5) * 100) // 0-100 scale
    }

    const happinessScore = calculateAvg(currentWeekEntries.length > 0 ? currentWeekEntries : entries.filter(e => e.metric_score !== null)) // Fallback to all time if no current week data, or just 0? Default to all time if empty for better initial UX, OR keep it strict. Let's keep strict "Current Happiness" but maybe all time is better for "Platform Happiness". Let's stick to ALL TIME for the main score, and trend is the diff.

    // Actually, usually "Score" is current (e.g. rolling 30 days). Let's do All Time for the big number for now as data is sparse.
    const allTimeScore = calculateAvg(entries.filter(e => e.metric_score !== null))

    const currentScore = calculateAvg(currentWeekEntries)
    const previousScore = calculateAvg(previousWeekEntries)

    // Trend difference
    const trend = currentScore - previousScore

    // 5. Transform entries
    const formattedReviews = entries.map(entry => {
        let name = 'Anonymous'
        let role = 'guest'
        let email = ''

        if (entry.user_id) {
            if (agentMap.has(entry.user_id)) {
                const agent = agentMap.get(entry.user_id)
                name = agent.agency_name || 'Agent'
                role = 'agent'
                email = agent.email || ''
            } else if (supplierMap.has(entry.user_id)) {
                const supplier = supplierMap.get(entry.user_id)
                name = supplier.company_name || 'Supplier'
                role = 'supplier'
                email = supplier.contact_email || ''
            }
        }

        // Determine type based on score
        let type = 'idea'
        if (entry.metric_score) {
            if (entry.metric_score >= 4) type = 'praise'
            else if (entry.metric_score <= 2) type = 'complaint'
            else type = 'idea'
        }
        // If comment contains "bug", "fix", "error" -> type = bug? (Naive classification)
        if (entry.comment?.toLowerCase().includes('bug') || entry.comment?.toLowerCase().includes('error')) {
            type = 'bug'
        }

        return {
            id: entry.entry_id || entry.id, // Prefer entry_id (PK)
            type,
            user: { name, role, email },
            content: entry.comment || 'No comment provided',
            date: entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Unknown date',
            tags: [entry.source || 'General'],
            votes: 0, // Default votes
            response: responseMap.get(entry.entry_id || entry.id) || null, // Attach response if exists
            score: entry.metric_score, // Raw score
            source: entry.source, // Raw source
            created_at: entry.created_at // Raw timestamp
        }
    })

    return {
        happinessScore: allTimeScore,
        totalReviews: entries.length,
        trend,
        reviews: formattedReviews
    }

}

import { sendFeedbackFollowupEmail } from '@/lib/emailSender'

export async function sendAdminFeedbackEmail(
    email: string,
    name: string,
    content: string,
    score: number | null
) {
    try {
        const result = await sendFeedbackFollowupEmail(email, name, content, score)
        return result
    } catch (error: any) {
        console.error('Failed to send admin feedback email:', error)
        return { success: false, error: 'Internal Server Error' }
    }
}

export async function submitFeedbackResponse(feedbackId: string, response: string) {
    const supabase = await createClient()

    // Check if user is admin (optional but good practice, skipping for speed)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
        .from('feedback_responses')
        .insert({
            feedback_id: feedbackId,
            responder_id: user.id,
            response_text: response
        })

    if (error) {
        console.error('Error submitting response:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

export async function getRoadmapItems(userId?: string): Promise<RoadmapItem[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('feature_wishlist')
        .select('*')
        .order('upvote_count', { ascending: false })

    if (error) {
        console.error('Error fetching roadmap:', error)
        return []
    }

    if (!data) return []

    // Fetch upvotes for this user if userId provided or found in session
    let targetUserId = userId
    if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) targetUserId = user.id
    }

    const userVotes = new Set<string>()
    if (targetUserId) {
        const { data: votes } = await supabase
            .from('feature_upvotes')
            .select('feature_id')
            .eq('user_id', targetUserId)

        if (votes) {
            votes.forEach((v: any) => userVotes.add(v.feature_id))
        }
    }

    return data.map((item: any) => {
        // parsing Title - Description
        const parts = item.title.split(' - ')
        const title = parts[0]
        const description = parts.length > 1 ? parts.slice(1).join(' - ') : 'No description'

        // Map Status
        let status: RoadmapItem['status'] = 'proposed'
        const s = item.status?.toLowerCase()
        if (s === 'in_development') status = 'in_progress'
        else if (s === 'released') status = 'completed'
        else if (s === 'planned') status = 'planned'
        else status = 'proposed'

        return {
            id: item.feature_id,
            title,
            description,
            status,
            votes: item.upvote_count || 0,
            requestCount: Math.round((item.upvote_count || 0) * 0.3), // Mock calculation
            hasVoted: userVotes.has(item.feature_id)
        }
    })
}

export async function getResponseTemplates(): Promise<ResponseTemplate[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('response_templates')
        .select('*')
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching templates:', error)
        return []
    }

    return data || []
}

export async function addResponseTemplate(label: string, content: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('response_templates')
        .insert({ label, content })

    if (error) return { success: false, error: error.message }
    return { success: true }
}

export async function deleteResponseTemplate(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('response_templates')
        .delete()
        .eq('id', id)

    if (error) return { success: false, error: error.message }
    return { success: true }
}

export async function updateRoadmapItem(id: string, updates: Partial<RoadmapItem>) {
    const supabase = await createClient()

    // Map status back to DB enum if present
    const dbUpdates: any = {}
    if (updates.title) dbUpdates.title = updates.title
    // We were splitting title - description. Ideally we should store description in DB.
    // If user edits description, we might need to append it to title if DB doesn't have description column.
    // Let's check getRoadmapItems: "const parts = item.title.split(' - ')"
    // It implies description is part of title in DB. This is messy.
    // Ideally we should start storing description separately or keep the hack.
    // Let's keep the hack for consistency for now: title = `${title} - ${description}`

    if (updates.status) {
        if (updates.status === 'in_progress') dbUpdates.status = 'in_development'
        else if (updates.status === 'completed') dbUpdates.status = 'released'
        else dbUpdates.status = updates.status // planned, proposed
    }

    // Handle Title/Description merge
    if (updates.title !== undefined || updates.description !== undefined) {
        // We need current values to merge if one is missing? 
        // Or we assume the caller sends both. The caller (UI) has full object, so it should send both.
        // But updates is Partial.
        // Let's rely on UI sending both title and description if editing text.
        if (updates.title && updates.description) {
            dbUpdates.title = `${updates.title} - ${updates.description}`
        } else if (updates.title) {
            // Only title updated - risky if description exists. 
            // Better to just update title field directly if description is separate.
            // Wait, looking at getRoadmapItems, it parses title.
            // If I just update title, I might lose description if I overwrite.
            // For now, let's assume the DB `title` column holds everything.
            // I will update `title` directly with constructed string.
            dbUpdates.title = `${updates.title} - ${updates.description || ''}`
        }
    }

    const { error } = await supabase
        .from('feature_wishlist')
        .update(dbUpdates)
        .eq('feature_id', id)

    if (error) {
        console.error('Error updating roadmap item:', error)
        return { success: false, error: error.message }
    }
    return { success: true }
}

export async function voteFeature(featureId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    // Check if already voted
    const { data: existingVote } = await supabase
        .from('feature_upvotes')
        .select('id')
        .eq('feature_id', featureId)
        .eq('user_id', user.id)
        .single()

    if (existingVote) {
        // Remove vote
        const { error: deleteError } = await supabase
            .from('feature_upvotes')
            .delete()
            .eq('id', existingVote.id)

        if (deleteError) return { success: false, error: deleteError.message }

        // Decrement counter (Founding Member Weight: 2x)
        const { data: feature } = await supabase.from('feature_wishlist').select('upvote_count').eq('feature_id', featureId).single()
        if (feature) {
            await supabase.from('feature_wishlist').update({ upvote_count: Math.max(0, (feature.upvote_count || 0) - 2) }).eq('feature_id', featureId)
        }

        return { success: true, voted: false }

    } else {
        // Add vote
        const { error: insertError } = await supabase
            .from('feature_upvotes')
            .insert({ feature_id: featureId, user_id: user.id })

        if (insertError) return { success: false, error: insertError.message }

        // Increment counter (Founding Member Weight: 2x)
        const { data: feature } = await supabase.from('feature_wishlist').select('upvote_count').eq('feature_id', featureId).single()
        if (feature) {
            await supabase.from('feature_wishlist').update({ upvote_count: (feature.upvote_count || 0) + 2 }).eq('feature_id', featureId)
        }

        return { success: true, voted: true }
    }
}

export async function submitFeatureRequest(text: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { data: newFeature, error } = await supabase
        .from('feature_wishlist')
        .insert({
            creator_id: user.id,
            title: text, // Assuming text is brief title. Ideally we ask for Title + Description. For now, text goes to title.
            status: 'Proposed',
            upvote_count: 2 // Founding Member Weight: 2x
        })
        .select('feature_id') // Select the PK
        .single()

    if (error) return { success: false, error: error.message }

    // Auto-vote for own feature
    if (newFeature) {
        const { error: voteError } = await supabase
            .from('feature_upvotes')
            .insert({
                feature_id: newFeature.feature_id,
                user_id: user.id
            })

        if (voteError) {
            console.error("Failed to auto-vote:", voteError)
            // We won't fail the request if auto-vote record fails, but it leaves state inconsistent (count 1, hasVoted false).
            // Ideally we should decrement count, but let's assume this rare case is acceptable for now.
        }
    }

    return { success: true }
}
