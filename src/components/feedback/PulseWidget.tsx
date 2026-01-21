'use client'
import { useState, useEffect } from 'react'
import { FaHeart } from 'react-icons/fa'

export default function PulseWidget() {
    const [state, setState] = useState<'rating' | 'thankyou' | 'minimized' | 'hidden'>('rating')

    useEffect(() => {
        const hasSubmitted = localStorage.getItem('pulse_feedback_submitted')
        if (hasSubmitted) {
            setState('hidden')
        }
    }, [])

    const emojis = [
        { icon: '😢', label: 'Sad' },
        { icon: '😕', label: 'Confused' },
        { icon: '😐', label: 'Neutral' },
        { icon: '🙂', label: 'Happy' },
        { icon: '😍', label: 'Loving' },
    ]

    const handleRate = async (score: number) => {
        if (state !== 'rating') return
        setState('thankyou')

        try {
            await fetch('/api/v1/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source: 'Dashboard_Pulse',
                    metric_score: score,
                    comment: ''
                })
            })
            localStorage.setItem('pulse_feedback_submitted', 'true')
        } catch (e) {
            console.error('Pulse feedback failed', e)
        }

        setTimeout(() => setState('hidden'), 2000)
    }

    if (state === 'hidden') return null

    if (state === 'minimized') {
        return (
            <button
                onClick={() => setState('rating')}
                className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#121826]/80 backdrop-blur-xl border border-amber-500/50 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-110 transition-transform z-[90] animate-fade-in"
            >
                <FaHeart />
            </button>
        )
    }

    return (
        <div className={`fixed bottom-6 right-6 w-72 bg-[#121826]/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-[90] transition-all duration-300 ${state === 'thankyou' ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)]' : ''}`}>
            {state === 'rating' ? (
                <>
                    <h3 className="text-white text-sm font-bold mb-3 font-sans">How is your experience today?</h3>
                    <div className="flex justify-between items-center">
                        {emojis.map((e, i) => (
                            <button
                                key={i}
                                onClick={() => handleRate(i + 1)}
                                className="text-2xl hover:scale-125 transition-transform p-1 filter drop-shadow-[0_0_5px_rgba(245,158,11,0.3)] grayscale hover:grayscale-0 outline-none"
                                title={e.label}
                            >
                                {e.icon}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-2 animate-fade-in">
                    <div className="text-amber-400 font-bold mb-1">Thank you, Partner!</div>
                    <div className="text-white/50 text-xs">Your feedback helps us grow.</div>
                </div>
            )}
        </div>
    )
}
