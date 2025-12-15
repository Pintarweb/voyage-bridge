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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700 m-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {step === 'input' ? 'Modify Plan' : 'Confirm Changes'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <FaTimes />
                    </button>
                </div>

                {step === 'input' ? (
                    /* Step 1: Input */
                    <div className="mb-6">
                        <div className="mb-6 text-center">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Total Slots
                            </label>
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => setSlots(Math.max(1, slots - 1))}
                                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    -
                                </button>
                                <span className="text-3xl font-bold w-16 text-center text-gray-900 dark:text-white">{slots}</span>
                                <button
                                    onClick={() => setSlots(slots + 1)}
                                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Current Monthly Cost</span>
                                <span className="text-base font-semibold text-gray-900 dark:text-white">${oldPrice}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">New Monthly Cost</span>
                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">${newPrice}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Step 2: Confirmation */
                    <div className="mb-6 space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Slots</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {currentSlots} <span className="text-gray-400 mx-1">→</span> {slots}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Monthly Fee</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        ${oldPrice} <span className="text-gray-400 mx-1">→</span> ${newPrice}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                <p className="text-sm text-blue-800 dark:text-blue-200 leading-snug">
                                    {diff > 0
                                        ? "Since you are adding slots, you will be charged a prorated amount for the remainder of this billing cycle immediately."
                                        : "Since you are reducing slots, the new lower fee will be reflected starting from your next billing cycle."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    {step === 'input' ? (
                        <>
                            <button
                                onClick={onClose}
                                className="flex-1 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={diff === 0}
                                className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Review Changes
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setStep('input')}
                                className="flex-1 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700 m-4">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaExclamationTriangle className="text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {step === 'warning' ? 'Pause Subscription?' : 'Confirm Pause'}
                    </h3>

                    {step === 'warning' ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Are you sure you want to pause your subscription? This will temporarily hide your products from the marketplace.
                        </p>
                    ) : (
                        <div className="text-left text-sm text-gray-600 dark:text-gray-300 space-y-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                            <p className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
                                Please review the consequences:
                            </p>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Your account will be paused at the <strong>end of your billing cycle</strong>.</li>
                                <li>Your products will be hidden from the marketplace.</li>
                                <li>You can re-activate your account anytime.</li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    {step === 'warning' ? (
                        <>
                            <button
                                onClick={onClose}
                                className="flex-1 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setStep('confirm')}
                                className="flex-1 py-2 rounded-xl bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center"
                            >
                                Next
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setStep('warning')}
                                className="flex-1 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handlePause}
                                disabled={loading}
                                className="flex-1 py-2 rounded-xl bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center justify-center"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700 m-4">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaPlay className="text-xl pl-1" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Resume Subscription?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your products will be visible again, and billing will resume immediately.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleResume}
                        disabled={loading}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700 m-4">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaTimes className="text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Cancel Subscription?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        We're sorry to see you go. This action will redirect you to our billing portal to finalize cancellation.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Keep It
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                        Proceed to Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
