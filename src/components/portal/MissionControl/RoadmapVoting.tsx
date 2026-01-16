'use client'

import React, { useState } from 'react'
import { FaVoteYea, FaChevronUp } from 'react-icons/fa'
import { voteFeature } from '@/app/actions/feedback'

interface WishlistItem {
    feature_id: string
    title: string
    upvote_count: number
    status: string
    hasVoted?: boolean
}

interface RoadmapVotingProps {
    initialWishlist: WishlistItem[]
}

const RoadmapVoting: React.FC<RoadmapVotingProps> = ({ initialWishlist }) => {
    const [wishlist, setWishlist] = useState(initialWishlist)

    const handleVote = async (id: string, currentHasVoted?: boolean) => {
        // Optimistic Update
        setWishlist(prev => prev.map(item => {
            if (item.feature_id === id) {
                return {
                    ...item,
                    upvote_count: (item.upvote_count || 0) + (currentHasVoted ? -2 : 2),
                    hasVoted: !currentHasVoted
                }
            }
            return item
        }))

        try {
            const res = await voteFeature(id)
            if (!res.success) {
                // Revert if failed
                setWishlist(prev => prev.map(item => {
                    if (item.feature_id === id) {
                        return {
                            ...item,
                            upvote_count: (item.upvote_count || 0) + (currentHasVoted ? 2 : -2),
                            hasVoted: currentHasVoted
                        }
                    }
                    return item
                }))
                console.error('Vote failed', res.error)
            }
        } catch (error) {
            console.error('Vote failed', error)
        }
    }

    return (
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 relative h-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <FaVoteYea className="text-purple-500" /> Mission Roadmap
                    </h2>
                    <p className="text-slate-300 text-xs mt-1">Vote on future ArkAlliance capabilities.</p>
                </div>
            </div>

            <div className="space-y-4">
                {wishlist.length === 0 && (
                    <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl">
                        <p className="text-slate-500">No active roadmap items.</p>
                    </div>
                )}

                {wishlist.map(item => (
                    <div key={item.feature_id} className="flex items-start gap-4 p-4 bg-slate-900 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <button
                            onClick={() => handleVote(item.feature_id, item.hasVoted)}
                            className={`flex flex-col items-center justify-center min-w-[3rem] h-[3rem] rounded-lg border transition-all ${item.hasVoted
                                ? 'bg-amber-500 border-amber-400 text-slate-900 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                                : 'bg-slate-800 border-white/10 hover:bg-slate-700 hover:text-amber-400'
                                }`}
                        >
                            <FaChevronUp className={`text-xs mb-0.5 transition-transform ${item.hasVoted ? 'scale-125' : ''}`} />
                            <span className="font-bold text-sm">{item.upvote_count}</span>
                        </button>
                        <div>
                            <h3 className="font-bold text-white text-lg">{item.title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${item.status === 'In_Development' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' :
                                    item.status === 'Released' ? 'text-green-400 border-green-500/20 bg-green-500/10' :
                                        'text-slate-400 border-white/10 bg-white/5'
                                    }`}>
                                    {item.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-transparent rounded-2xl border border-purple-500/20">
                <p className="text-sm text-purple-200 leading-relaxed">
                    <strong className="text-white">Founding Member Privilege:</strong> Your votes carry a 2x multiplier on roadmap prioritization.
                </p>
            </div>
        </div>
    )
}

export default RoadmapVoting
