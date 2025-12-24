'use client'
import { useState, useEffect } from 'react'

export default function ExitIntentModal({ disabled = false }: { disabled?: boolean }) {
    const [isVisible, setIsVisible] = useState(false)
    const [hasTriggered, setHasTriggered] = useState(false)
    const [isArmed, setIsArmed] = useState(false)

    // Arm the trigger after a delay to prevent immediate activation
    useEffect(() => {
        if (disabled) return
        const timer = setTimeout(() => setIsArmed(true), 2000)
        return () => clearTimeout(timer)
    }, [disabled])

    useEffect(() => {
        if (disabled) return
        const handleMouseLeave = (e: MouseEvent) => {
            if (hasTriggered || !isArmed) return
            // Ensure mouse actually left the window (clientY <= 0 generally means top exit)
            // And relatedTarget is null means it didn't just go into a child element
            if (e.clientY <= 0 && !e.relatedTarget) {
                setIsVisible(true)
                setHasTriggered(true)
            }
        }

        document.addEventListener('mouseleave', handleMouseLeave)
        return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }, [hasTriggered, isArmed])

    const handleReason = async (reason: string) => {
        try {
            await fetch('/api/v1/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source: 'Exit_Intent',
                    metric_score: 0, // No score for exit intent, just reason
                    comment: reason
                })
            })
        } catch (e) {
            console.error('Exit intent feedback failed', e)
        }
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop with dimming */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={() => setIsVisible(false)}
            ></div>

            {/* Modal */}
            <div className="relative bg-[#121826] border border-white/10 rounded-3xl p-8 max-w-lg w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-scale-up overflow-hidden">
                {/* Decorative glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/10 rounded-full blur-[50px] pointer-events-none"></div>

                <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Wait! Before you go...</h2>
                <p className="text-white/60 mb-8 leading-relaxed max-w-md mx-auto relative z-10">
                    Was the registration too long? Too complex? Or just not the right time?
                    Tell us why, and help us improve for the next Founding Member.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 relative z-10">
                    {['Too complex', 'Just browsing', 'Other'].map((reason) => (
                        <button
                            key={reason}
                            onClick={() => handleReason(reason)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white/80 py-3 px-2 rounded-xl text-sm font-medium transition-all"
                        >
                            {reason}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(245,158,11,0.3)] relative z-10"
                >
                    Wait, I'll finish now
                </button>
            </div>
        </div>
    )
}
