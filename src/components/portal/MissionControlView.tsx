'use client'

import { useState } from 'react'
import { FaSatelliteDish } from 'react-icons/fa'
import RequestIntelForm from './MissionControl/RequestIntelForm'
import MissionLog from './MissionControl/MissionLog'
import RoadmapVoting from './MissionControl/RoadmapVoting'

type WishlistItem = {
    feature_id: string
    title: string
    upvote_count: number
    status: string
    hasVoted?: boolean
}

export default function MissionControlView({ initialWishlist }: { initialWishlist: WishlistItem[] }) {
    const [refreshLogTrigger, setRefreshLogTrigger] = useState(0)

    const handleRequestSuccess = () => {
        setRefreshLogTrigger(prev => prev + 1)
    }

    return (
        <div className="max-w-7xl mx-auto p-8 text-white">
            <div className="mb-12">
                <h1 className="text-4xl font-black mb-4 flex items-center gap-4">
                    <FaSatelliteDish className="text-amber-500" />
                    Mission Support Center
                </h1>
                <p className="text-slate-200 text-lg max-w-2xl shadow-black/50 drop-shadow-sm">
                    Your direct line to ArkAlliance command. Request specific supply, vote on the roadmap, or get urgent operational support.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* LEFT COLUMN: Request Intel & Mission Log */}
                <div className="space-y-12">
                    <RequestIntelForm onSuccess={handleRequestSuccess} />
                    <MissionLog refreshTrigger={refreshLogTrigger} />
                </div>

                {/* RIGHT COLUMN: Roadmap Voting */}
                <div className="h-full">
                    <RoadmapVoting initialWishlist={initialWishlist} />
                </div>
            </div>
        </div>
    )
}
