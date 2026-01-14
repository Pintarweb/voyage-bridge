import { createClient } from '@/utils/supabase/server'
import PortalSidebar from '@/components/portal/PortalSidebar'
import MissionControlView from '@/components/portal/MissionControlView'

export default async function MissionSupportPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch Wishlist Items
    const { data: wishlist } = await supabase
        .from('feature_wishlist')
        .select('*')
        .order('upvote_count', { ascending: false })

    // Fetch User Votes
    const { data: userVotes } = await supabase
        .from('feature_upvotes')
        .select('feature_id')
        .eq('user_id', user.id)

    const votedIds = new Set(userVotes?.map((v: any) => v.feature_id) || [])

    const enhancedWishlist = wishlist?.map(item => ({
        ...item,
        hasVoted: votedIds.has(item.feature_id)
    })) || []

    return (
        <div className="flex flex-col lg:flex-row min-h-screen pt-16 bg-transparent">
            <PortalSidebar />

            <main className="flex-1 lg:ml-20 xl:ml-64 relative overflow-y-auto h-[calc(100vh-64px)]">
                <MissionControlView initialWishlist={enhancedWishlist} />
            </main>
        </div>
    )
}
