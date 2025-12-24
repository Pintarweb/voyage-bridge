'use client'
import { useState, useEffect } from 'react'

interface MicroSurveyToastProps {
    visible: boolean
    onClose: () => void
}

export default function MicroSurveyToast({ visible, onClose }: MicroSurveyToastProps) {
    const [rating, setRating] = useState<number | null>(null)
    const [feedback, setFeedback] = useState('')
    const [submitted, setSubmitted] = useState(false)

    if (!visible) return null

    const handleRating = (num: number) => {
        setRating(num)
        if (num > 5) {
            // Auto submit high ratings after brief delay
            setTimeout(async () => {
                await submitFeedback(num, '')
                setSubmitted(true)
                setTimeout(onClose, 2000)
            }, 500)
        }
    }

    const submitFeedback = async (score: number, comment: string) => {
        try {
            await fetch('/api/v1/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source: 'Post_Action_Survey',
                    metric_score: score,
                    comment: comment
                })
            })
        } catch (e) {
            console.error('Survey feedback failed', e)
        }
    }

    const handleSubmit = async () => {
        if (rating !== null) {
            await submitFeedback(rating, feedback)
        }
        setSubmitted(true)
        setTimeout(onClose, 2000)
    }

    if (submitted) {
        return (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#121826]/90 backdrop-blur-xl border border-green-500/50 text-green-400 px-6 py-4 rounded-xl shadow-2xl z-[100] animate-fade-in flex items-center gap-2">
                <span>✨ Feedback received. Thanks!</span>
            </div>
        )
    }

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#121826]/90 backdrop-blur-xl border border-cyan-500/30 w-full max-w-md rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[100] animate-slide-down">
            <h3 className="text-white text-sm font-bold mb-1">Listing complete!</h3>
            <p className="text-white/50 text-xs mb-4">How easy was the process?</p>

            <div className="flex justify-between gap-1 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    let colorClass = 'border-white/10 text-white/50 hover:border-white/50 hover:text-white'
                    if (rating === num) {
                        if (num <= 3) colorClass = 'border-red-500 bg-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                        else if (num <= 7) colorClass = 'border-blue-500 bg-blue-500/20 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                        else colorClass = 'border-amber-500 bg-amber-500/20 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    }

                    return (
                        <button
                            key={num}
                            onClick={() => handleRating(num)}
                            className={`w-8 h-8 rounded-lg border text-xs font-bold transition-all ${colorClass}`}
                        >
                            {num}
                        </button>
                    )
                })}
            </div>

            {rating !== null && rating <= 5 && (
                <div className="animate-fade-in">
                    <input
                        type="text"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Tell us one thing we can fix..."
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-red-500/50 outline-none mb-2 placeholder-white/20"
                    />
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg py-2 text-xs font-bold hover:bg-red-500/30 transition-colors"
                    >
                        Send Feedback
                    </button>
                </div>
            )}
        </div>
    )
}
