import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    // Service role key to bypass RLS
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    // Mock Roadmap Items
    const mockRoadmap = [
        { title: 'Bulk Inventory Import', description: 'Allow suppliers to upload products via CSV/Excel.', status: 'In_Development', upvote_count: 145 },
        { title: 'Multi-currency Support', description: 'Display prices in user local currency.', status: 'Planned', upvote_count: 89 },
        { title: 'Direct Messaging', description: 'Chat between agents and suppliers.', status: 'Released', upvote_count: 210 },
        { title: 'AI Itinerary Builder', description: 'Auto-generate itineraries based on preference.', status: 'Proposed', upvote_count: 55 },
    ]

    // Get a user ID for creator_id
    const { data: { users } } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 })
    const userId = users && users.length > 0 ? users[0].id : null

    if (!userId) {
        return NextResponse.json({ error: "No user found to assign creator_id" }, { status: 400 })
    }

    const entries = mockRoadmap.map(m => ({
        creator_id: userId,
        title: m.title,
        status: m.status, // Matches enum: Proposed, Planned, In_Development, Released
        upvote_count: m.upvote_count,
        // Description is not in table schema from previous file check?
        // Wait, schema check: feature_wishlist (feature_id, creator_id, title, upvote_count, status, created_at)
        // It DOES NOT have description!
        // I should probably add description column or just put it in title?
        // Let's check schema again.
    }))

    // Wait, let's look at schema content I viewed earlier.
    // create table if not exists feature_wishlist (
    //   feature_id uuid primary key default gen_random_uuid(),
    //   creator_id uuid references auth.users(id) on delete cascade not null,
    //   title text not null,
    //   upvote_count integer default 0,
    //   status wishlist_status default 'Proposed',
    //   created_at timestamptz default now()
    // );
    // NO DESCRIPTION COLUMN.

    // I will append description to title for now: "Title - Description" 
    // OR just use title.

    const finalEntries = mockRoadmap.map(m => ({
        creator_id: userId,
        title: `${m.title} - ${m.description}`,
        status: m.status,
        upvote_count: m.upvote_count
    }))

    // Clear existing entries to prevent duplicates
    await supabase.from('feature_wishlist').delete().neq('feature_id', '00000000-0000-0000-0000-000000000000') // Efficient delete all

    const { data, error } = await supabase
        .from('feature_wishlist')
        .insert(finalEntries)
        .select()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 200 })
    }

    return NextResponse.json({ success: true, count: data.length, inserted: data })
}
