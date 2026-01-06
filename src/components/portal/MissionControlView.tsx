'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
    FaSatelliteDish, FaRocket, FaVoteYea, FaWhatsapp,
    FaEnvelope, FaPaperPlane, FaCheck, FaSpinner, FaChevronUp
} from 'react-icons/fa'

type WishlistItem = {
    feature_id: string
    title: string
    upvote_count: number
    status: string
}

export default function MissionControlView({ initialWishlist }: { initialWishlist: WishlistItem[] }) {
    const [wishlist, setWishlist] = useState(initialWishlist)
    const [requestForm, setRequestForm] = useState({
        destination: '',
        request_type: 'Hotel', // Default
        budget: '',
        details: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [voting, setVoting] = useState<Record<string, boolean>>({})
    const [userRequests, setUserRequests] = useState<any[]>([])
    const [loadingRequests, setLoadingRequests] = useState(true)

    const fetchRequests = async () => {
        const supabase = createClient()
        const { data } = await supabase
            .from('product_requests')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setUserRequests(data)
        setLoadingRequests(false)
    }

    useEffect(() => {
        fetchRequests()
    }, [submitSuccess])

    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await fetch('/api/mission/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestForm)
            })
            setSubmitSuccess(true)
            setRequestForm({ destination: '', request_type: 'Hotel', budget: '', details: '' })
            setTimeout(() => setSubmitSuccess(false), 3000)
        } catch (error) {
            console.error('Failed to submit request', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleVote = async (id: string, currentCount: number) => {
        if (voting[id]) return
        setVoting(prev => ({ ...prev, [id]: true }))

        try {
            const res = await fetch('/api/mission/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feature_id: id })
            })

            const data = await res.json()

            if (!res.ok) {
                if (data.error === 'Already voted') {
                    alert('You have already voted on this mission.')
                } else {
                    console.error('Vote failed', data.error)
                }
                return
            }

            // Real update based on weight
            const weight = data.weight || 1
            setWishlist(prev => prev.map(item =>
                item.feature_id === id ? { ...item, upvote_count: (item.upvote_count || 0) + weight } : item
            ))

        } catch (error) {
            console.error('Vote failed', error)
        } finally {
            setVoting(prev => ({ ...prev, [id]: false }))
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-8 text-white">
            <div className="mb-12">
                <h1 className="text-4xl font-black mb-4 flex items-center gap-4">
                    <FaSatelliteDish className="text-amber-500" />
                    Mission Support Center
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Your direct line to ArkAlliance command. Request specific supply, vote on the roadmap, or get urgent operational support.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* LEFT COLUMN: Request Intel */}
                <div className="space-y-12">
                    <section className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <FaRocket className="text-amber-500" /> Request Intel
                            </h2>
                            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full border border-amber-500/20">
                                Sourcing Service
                            </span>
                        </div>

                        <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                            Can't find what you need? Tell us the destination and category. Our contracting team will hunt it down for you.
                        </p>

                        <form onSubmit={handleRequestSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Target Destination</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Bali, Ubud"
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                                        value={requestForm.destination}
                                        onChange={e => setRequestForm({ ...requestForm, destination: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                                    <select
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors appearance-none"
                                        value={requestForm.request_type}
                                        onChange={e => setRequestForm({ ...requestForm, request_type: e.target.value })}
                                    >
                                        <option>Hotel</option>
                                        <option>Transport</option>
                                        <option>Experience</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Client Budget / Specs</label>
                                <input
                                    type="text"
                                    placeholder="e.g. $500/night, 5 Star, Private Pool"
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                                    value={requestForm.budget}
                                    onChange={e => setRequestForm({ ...requestForm, budget: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Mission Details</label>
                                <textarea
                                    rows={3}
                                    placeholder="Any specific requirements..."
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                                    value={requestForm.details}
                                    onChange={e => setRequestForm({ ...requestForm, details: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || submitSuccess}
                                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${submitSuccess ? 'bg-green-500 text-white' : 'bg-white text-slate-900 hover:bg-amber-400'}`}
                            >
                                {isSubmitting ? <FaSpinner className="animate-spin mx-auto" /> : submitSuccess ? <span className="flex items-center justify-center gap-2"><FaCheck /> Request Transmitted</span> : <span className="flex items-center justify-center gap-2"><FaPaperPlane /> Initiate Request</span>}
                            </button>
                        </form>
                    </section>


                    {/* Mission Log (User Requests) */}
                    <section className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <FaSatelliteDish className="text-slate-600" /> Your Mission Log
                        </h3>
                        {loadingRequests ? (
                            <div className="text-white/30 text-xs animate-pulse">Scanning frequency...</div>
                        ) : userRequests.length > 0 ? (
                            <div className="space-y-3">
                                {userRequests.map(req => (
                                    <div key={req.id} className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-xl hover:border-white/10 transition-colors group">
                                        <div>
                                            <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{req.destination}</div>
                                            <div className="text-xs text-white/40">{req.category} • {req.budget || 'No budget spec'}</div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${req.status === 'pending' ? 'border-amber-500/20 text-amber-400 bg-amber-500/10' :
                                                req.status === 'completed' ? 'border-green-500/20 text-green-400 bg-green-500/10' :
                                                    'border-white/10 text-slate-400 bg-white/5'
                                            }`}>
                                            {req.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 border border-dashed border-white/10 rounded-xl text-center text-xs text-white/30">
                                No active requests initiated. Start a new mission above.
                            </div>
                        )}
                    </section>

                    {/* Direct Uplink */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Urgent Uplink</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all group w-full">
                                <FaWhatsapp className="text-green-500 text-2xl group-hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <p className="text-white font-bold text-sm">WhatsApp Priority</p>
                                    <p className="text-green-400 text-xs">Avg. Response: 5m</p>
                                </div>
                            </a>
                            <a href="mailto:operational@arkalliance.com" className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all group w-full">
                                <FaEnvelope className="text-blue-500 text-2xl group-hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <p className="text-white font-bold text-sm">Operations Email</p>
                                    <p className="text-blue-400 text-xs">24/7 Monitoring</p>
                                </div>
                            </a>
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN: Roadmap Voting */}
                <div className="bg-slate-950 border border-white/5 rounded-3xl p-8 relative">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <FaVoteYea className="text-purple-500" /> Mission Roadmap
                            </h2>
                            <p className="text-slate-500 text-xs mt-1">Vote on future ArkAlliance capabilities.</p>
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
                                    onClick={() => handleVote(item.feature_id, item.upvote_count)}
                                    className="flex flex-col items-center justify-center min-w-[3rem] h-[3rem] rounded-lg bg-slate-800 border border-white/10 hover:bg-amber-500 hover:text-slate-900 group transition-all"
                                >
                                    <FaChevronUp className="text-xs mb-0.5" />
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
            </div>
        </div>
    )
}
