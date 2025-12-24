'use client'
import { useState } from 'react'
import { FaChevronUp, FaPlus, FaCheck } from 'react-icons/fa'

interface WishlistItem {
    id: string
    text: string
    votes: number
    hasVoted: boolean
}

export default function FeatureWishlist() {
    const [request, setRequest] = useState('')
    const [items, setItems] = useState<WishlistItem[]>([
        { id: '1', text: 'Dark mode for invoice PDF downloads', votes: 42, hasVoted: false },
        { id: '2', text: 'Integration with Google Calendar for bookings', votes: 128, hasVoted: true },
        { id: '3', text: 'Ability to clone existing product listings', votes: 85, hasVoted: false },
    ])

    const handleVote = (id: string) => {
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
    }

    const handleSubmit = () => {
        if (!request.trim()) return
        const newItem: WishlistItem = {
            id: Date.now().toString(),
            text: request,
            votes: 1,
            hasVoted: true
        }
        setItems([newItem, ...items])
        setRequest('')
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
                />
                <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-8 py-4 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-2 m-1"
                >
                    <FaPlus /> Submit
                </button>
            </div>

            {/* The List */}
            <div className="grid grid-cols-1 gap-4">
                {items.sort((a, b) => b.votes - a.votes).map((item) => (
                    <div key={item.id} className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 flex items-center gap-6 transition-all">
                        <button
                            onClick={() => handleVote(item.id)}
                            className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border transition-all duration-300 ${item.hasVoted
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                    : 'bg-black/20 border-white/10 text-white/30 hover:border-amber-500/50 hover:text-amber-500/80'
                                }`}
                        >
                            <FaChevronUp className={`text-xl mb-1 transition-transform ${item.hasVoted ? 'scale-125' : ''}`} />
                            <span className="text-sm font-bold">{item.votes}</span>
                        </button>

                        <div className="flex-1">
                            <h3 className="text-white font-medium text-lg leading-relaxed">{item.text}</h3>
                            {item.hasVoted && (
                                <span className="text-xs text-amber-500/50 font-bold flex items-center gap-1 mt-1">
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
