'use client'
import { useState, useEffect } from 'react'
import { FaChevronUp, FaPlus, FaCheck, FaSpinner } from 'react-icons/fa'
import { getRoadmapItems, voteFeature, submitFeatureRequest, type RoadmapItem } from '@/app/actions/feedback'

export default function FeatureWishlist() {
    const [request, setRequest] = useState('')
    const [items, setItems] = useState<RoadmapItem[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadItems()
    }, [])

    const loadItems = async () => {
        setLoading(true)
        const data = await getRoadmapItems()
        setItems(data)
        setLoading(false)
    }

    const handleVote = async (id: string, hasVoted?: boolean) => {
        // Optimistic update
        setItems(items.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    votes: item.hasVoted ? item.votes - 1 : item.votes + 1,
                    hasVoted: !item.hasVoted
                }
            }
            return item
        }))

        // Server action
        const res = await voteFeature(id)
        if (!res.success) {
            // Revert on error
            console.error('Vote failed:', res.error)
            loadItems() // Refresh to be safe
        }
    }

    const handleSubmit = async () => {
        if (!request.trim()) return
        setSubmitting(true)
        const res = await submitFeatureRequest(request)
        if (res.success) {
            setRequest('')
            await loadItems() // Refresh list
        } else {
            alert('Failed to submit request: ' + res.error)
        }
        setSubmitting(false)
    }

    if (loading && items.length === 0) {
        return <div className="text-white/40 text-center py-10 flex flex-col items-center gap-2"><FaSpinner className="animate-spin text-2xl" /> Loading roadmap...</div>
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Submission Box */}
            <div className="bg-[#121826]/80 backdrop-blur-xl border border-amber-500/30 p-1 rounded-2xl flex items-center shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                <input
                    type="text"
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    placeholder="I wish ArkAlliance could..."
                    className="flex-1 bg-transparent border-none text-white px-6 py-4 text-lg focus:outline-none placeholder-white/30"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-8 py-4 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-2 m-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? <FaSpinner className="animate-spin" /> : <FaPlus />} Submit
                </button>
            </div>

            {/* The List */}
            <div className="grid grid-cols-1 gap-4">
                {items.sort((a, b) => b.votes - a.votes).map((item) => (
                    <div key={item.id} className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 flex items-center gap-6 transition-all">
                        <button
                            onClick={() => handleVote(item.id, item.hasVoted)}
                            className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border transition-all duration-300 ${item.hasVoted
                                ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                : 'bg-black/20 border-white/10 text-white/30 hover:border-amber-500/50 hover:text-amber-500/80'
                                }`}
                        >
                            <FaChevronUp className={`text-xl mb-1 transition-transform ${item.hasVoted ? 'scale-125' : ''}`} />
                            <span className="text-sm font-bold">{item.votes}</span>
                        </button>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-white font-medium text-lg leading-relaxed">{item.title}</h3>
                                    {item.description && item.description !== 'No description' && (
                                        <p className="text-white/40 text-sm mt-1">{item.description}</p>
                                    )}
                                </div>
                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${item.status === 'completed' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                                    item.status === 'in_progress' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                                        item.status === 'planned' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                                            'bg-white/5 border-white/10 text-white/30'
                                    }`}>
                                    {item.status.replace('_', ' ')}
                                </span>
                            </div>

                            {item.hasVoted && (
                                <span className="text-xs text-amber-500/50 font-bold flex items-center gap-1 mt-2">
                                    <FaCheck /> Voted
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
