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
                    votes: item.hasVoted ? item.votes - 2 : item.votes + 2,
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
        <div className="w-full space-y-8 animate-fade-in">
            {/* Submission Box */}
            <div className="bg-slate-950/50 backdrop-blur-md border border-white/10 p-2 rounded-2xl flex items-center shadow-2xl transition-all focus-within:border-amber-500/50 focus-within:shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <input
                    type="text"
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    placeholder="I wish ArkAlliance could..."
                    className="flex-1 bg-transparent border-none text-white px-6 py-4 text-lg focus:outline-none placeholder-slate-500 font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold px-8 py-4 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center gap-2 m-1 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                >
                    {submitting ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                    <span className="hidden sm:inline">Submit Idea</span>
                    <span className="inline sm:hidden">Add</span>
                </button>
            </div>

            {/* The List */}
            <div className="grid grid-cols-1 gap-4">
                {items.sort((a, b) => b.votes - a.votes).map((item) => (
                    <div key={item.id} className="group bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 hover:border-white/10 rounded-2xl p-5 flex items-start sm:items-center gap-6 transition-all duration-300">
                        <button
                            onClick={() => handleVote(item.id, item.hasVoted)}
                            className={`flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl border transition-all duration-300 flex-shrink-0 ${item.hasVoted
                                ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                : 'bg-slate-950/50 border-white/5 text-slate-500 hover:border-amber-500/50 hover:text-amber-500 hover:scale-105'
                                }`}
                        >
                            <FaChevronUp className={`text-lg sm:text-xl mb-1 transition-transform ${item.hasVoted ? 'scale-125' : ''}`} />
                            <span className="text-xs sm:text-sm font-bold">{item.votes}</span>
                        </button>

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-amber-100 transition-colors">{item.title}</h3>
                                    {item.description && item.description !== 'No description' && (
                                        <p className="text-slate-400 text-sm mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                                    )}
                                </div>
                                <span className={`self-start sm:self-auto text-[10px] uppercase font-bold px-2 py-1 rounded border whitespace-nowrap ${item.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                    item.status === 'in_progress' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                                        item.status === 'planned' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                                            'bg-slate-800/50 border-white/10 text-slate-500'
                                    }`}>
                                    {item.status.replace('_', ' ')}
                                </span>
                            </div>

                            {item.hasVoted && (
                                <div className="hidden sm:flex items-center gap-2 mt-2">
                                    <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
                                        <FaCheck className="text-[10px]" /> Voted
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
