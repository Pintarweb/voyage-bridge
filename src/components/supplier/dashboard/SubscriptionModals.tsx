'use client'

import React, { useState } from 'react'
import { FaTimes, FaCheck, FaExclamationTriangle, FaPlay } from 'react-icons/fa'

interface ChangeSlotsModalProps {
    isOpen: boolean
    onClose: () => void
    currentSlots: number
    onUpdate: (newSlots: number) => Promise<void>
}

export function ChangeSlotsModal({ isOpen, onClose, currentSlots, onUpdate }: ChangeSlotsModalProps) {
    const [slots, setSlots] = useState(currentSlots)
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<'input' | 'confirm'>('input')

    // Reset state when opening/closing
    React.useEffect(() => {
        if (isOpen) {
            setSlots(currentSlots)
            setStep('input')
        }
    }, [isOpen, currentSlots])

    if (!isOpen) return null

    const baseFee = 30
    const addOnFee = 20
    const oldPrice = baseFee + (Math.max(0, currentSlots - 1) * addOnFee)
    const newPrice = baseFee + (Math.max(0, slots - 1) * addOnFee)
    const diff = slots - currentSlots

    const handleNext = () => {
        setStep('confirm')
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await onUpdate(slots)
            onClose()
        } catch (e) {
            console.error(e)
            alert('Failed to update subscription')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="bg-slate-950/90 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 m-4 animate-scale-in">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                        {step === 'input' ? 'Modify Plan' : 'Confirm Changes'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full">
                        <FaTimes />
                    </button>
                </div>

                {step === 'input' ? (
                    /* Step 1: Input */
                    <div className="mb-8">
                        <div className="mb-8 text-center bg-black/20 rounded-2xl p-6 border border-white/5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                                Total Product Slots
                            </label>
                            <div className="flex items-center justify-center gap-6">
                                <button
                                    onClick={() => setSlots(Math.max(1, slots - 1))}
                                    className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl font-bold text-white hover:bg-slate-700 hover:border-amber-500/50 hover:text-amber-400 transition-all shadow-lg active:scale-95"
                                >
                                    -
                                </button>
                                <span className="text-4xl font-bold w-20 text-center text-white">{slots}</span>
                                <button
                                    onClick={() => setSlots(slots + 1)}
                                    className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl font-bold text-white hover:bg-slate-700 hover:border-amber-500/50 hover:text-amber-400 transition-all shadow-lg active:scale-95"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="p-5 bg-slate-900/50 rounded-2xl border border-white/10 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-400 font-medium">Current Monthly Cost</span>
                                <span className="text-base font-bold text-white opacity-60">${oldPrice}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-white/10 pt-3">
                                <span className="text-sm font-bold text-white">New Monthly Cost</span>
                                <span className="text-2xl font-bold text-amber-400">${newPrice}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Step 2: Confirmation */
                    <div className="mb-8 space-y-6">
                        <div className="p-5 bg-slate-900/50 rounded-2xl border border-white/10">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Slots</p>
                                    <p className="text-lg font-bold text-white">
                                        {currentSlots} <span className="text-amber-500/50 mx-1">→</span> {slots}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Monthly Fee</p>
                                    <p className="text-lg font-bold text-white">
                                        ${oldPrice} <span className="text-amber-500/50 mx-1">→</span> ${newPrice}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                                <p className="text-sm text-blue-300 leading-relaxed font-medium">
                                    {diff > 0
                                        ? "Prorated charges for additional slots will be applied immediately."
                                        : "Lower fee will be reflected starting from your next billing cycle."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    {step === 'input' ? (
                        <>
                            <button
                                onClick={onClose}
                                className="flex-1 py-3.5 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 hover:text-white transition-all uppercase tracking-wider text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={diff === 0}
                                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs"
                            >
                                Review Changes
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setStep('input')}
                                className="flex-1 py-3.5 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 hover:text-white transition-all uppercase tracking-wider text-xs"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 flex items-center justify-center uppercase tracking-wider text-xs"
                            >
                                {loading ? 'Processing...' : 'Confirm Update'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

interface PauseModalProps {
    isOpen: boolean
    onClose: () => void
    onPause: () => Promise<void>
}

export function PauseModal({ isOpen, onClose, onPause }: PauseModalProps) {
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<'warning' | 'confirm'>('warning')

    // Reset step on open
    React.useEffect(() => {
        if (isOpen) setStep('warning')
    }, [isOpen])

    if (!isOpen) return null

    const handlePause = async () => {
        setLoading(true)
        try {
            await onPause()
            onClose()
        } catch (e) {
            console.error(e)
            alert('Failed to pause subscription')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="bg-slate-950/90 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 m-4 animate-scale-in">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
                        <FaExclamationTriangle className="text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                        {step === 'warning' ? 'Pause Subscription?' : 'Confirm Pause'}
                    </h3>

                    {step === 'warning' ? (
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Are you sure you want to pause your subscription? This will temporarily hide your products from the marketplace.
                        </p>
                    ) : (
                        <div className="text-left text-sm text-slate-300 space-y-3 bg-slate-900/50 p-5 rounded-xl border border-white/10">
                            <p className="font-bold text-white border-b border-white/10 pb-2 mb-2">
                                Please review the consequences:
                            </p>
                            <ul className="list-disc pl-4 space-y-1 text-slate-400">
                                <li>Your account will be paused at the <strong>end of your billing cycle</strong>.</li>
                                <li>Your products will be hidden from the marketplace.</li>
                                <li>You can re-activate your account anytime.</li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    {step === 'warning' ? (
                        <>
                            <button
                                onClick={onClose}
                                className="flex-1 py-3.5 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 hover:text-white transition-all uppercase tracking-wider text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setStep('confirm')}
                                className="flex-1 py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center justify-center uppercase tracking-wider text-xs"
                            >
                                Next
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setStep('warning')}
                                className="flex-1 py-3.5 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 hover:text-white transition-all uppercase tracking-wider text-xs"
                            >
                                Back
                            </button>
                            <button
                                onClick={handlePause}
                                disabled={loading}
                                className="flex-1 py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] disabled:opacity-50 flex items-center justify-center uppercase tracking-wider text-xs"
                            >
                                {loading ? 'Processing...' : 'Confirm Pause'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

interface ResumeModalProps {
    isOpen: boolean
    onClose: () => void
    onResume: () => Promise<void>
}

export function ResumeModal({ isOpen, onClose, onResume }: ResumeModalProps) {
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleResume = async () => {
        setLoading(true)
        try {
            await onResume()
            onClose()
        } catch (e) {
            console.error(e)
            alert('Failed to resume subscription')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="bg-slate-950/90 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 m-4 animate-scale-in">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
                        <FaPlay className="text-2xl pl-1" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Resume Subscription?</h3>
                    <p className="text-sm text-slate-400">
                        Your products will be visible again, and billing will resume immediately.
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 hover:text-white transition-all uppercase tracking-wider text-xs"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleResume}
                        disabled={loading}
                        className="flex-1 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50 flex items-center justify-center uppercase tracking-wider text-xs"
                    >
                        {loading ? 'Resuming...' : 'Confirm Resume'}
                    </button>
                </div>
            </div>
        </div>
    )
}

interface CancelSubscriptionModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void // Just redirects
}

export function CancelSubscriptionModal({ isOpen, onClose, onConfirm }: CancelSubscriptionModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="bg-slate-950/90 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 m-4 animate-scale-in">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_25px_rgba(239,68,68,0.15)]">
                        <FaTimes className="text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Cancel Subscription?</h3>
                    <p className="text-sm text-slate-400 mb-2">
                        We're sorry to see you go.
                    </p>
                    <p className="text-xs text-slate-500">
                        This action will redirect you to our billing portal to finalize cancellation.
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 hover:text-white transition-all uppercase tracking-wider text-xs"
                    >
                        Keep It
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] flex items-center justify-center uppercase tracking-wider text-xs"
                    >
                        Proceed to Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
