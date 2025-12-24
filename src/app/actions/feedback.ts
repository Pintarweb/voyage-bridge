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
            supabase.from('agent_profiles').select('id, agency_name').in('id', userIds),
            supabase.from('suppliers').select('id, company_name').in('id', userIds)
        ])

        if (agentsRes.data) {
            agentsRes.data.forEach((a: any) => agentMap.set(a.id, a))
        }
        if (suppliersRes.data) {
            suppliersRes.data.forEach((s: any) => supplierMap.set(s.id, s))
        }
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

        if (entry.user_id) {
            if (agentMap.has(entry.user_id)) {
                name = agentMap.get(entry.user_id).agency_name || 'Agent'
                role = 'agent'
            } else if (supplierMap.has(entry.user_id)) {
                name = supplierMap.get(entry.user_id).company_name || 'Supplier'
                role = 'supplier'
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
            user: { name, role },
            content: entry.comment || 'No comment provided',
            date: entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Unknown date',
            tags: [entry.source || 'General'],
            votes: 0 // Default votes
        }
    })

    return {
        happinessScore: allTimeScore,
        totalReviews: entries.length,
        trend,
        reviews: formattedReviews
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

export async function getRoadmapItems(): Promise<RoadmapItem[]> {
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
            requestCount: Math.round((item.upvote_count || 0) * 0.3) // Mock calculation
        }
    })
}
