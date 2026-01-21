'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FaLock, FaCheckCircle, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa'

function ResetPasswordContent() {
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [formError, setFormError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkSession = async () => {
            // The callback route should have exchanged the code and set the session cookie
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setShowForm(true)
            } else {
                // Double check if maybe onAuthStateChange picks it up (sometimes slight delay)
                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                    if (session) {
                        setShowForm(true)
                        setLoading(false)
                    }
                })

                // If still no session after a short wait, show error
                setTimeout(() => {
                    if (!showForm) setLoading(false)
                }, 2000)

                return () => subscription.unsubscribe()
            }
            setLoading(false)
        }

        checkSession()
    }, [showForm]) // Added showForm dependency to avoid stale closure issues if re-triggering

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')
        setSuccessMessage('')
        setIsSubmitting(true)

        // Client-side validation
        if (password !== confirmPassword) {
            setFormError('Passwords do not match.')
            setIsSubmitting(false)
            return
        }

        if (password.length < 6) {
            setFormError('Password must be at least 6 characters.')
            setIsSubmitting(false)
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({ password: password })

            if (error) {
                setFormError(error.message)
            } else {
                setSuccessMessage('Credentials updated successfully. Redirecting you to the portal...')
                // Wait briefly then redirect
                setTimeout(() => {
                    router.push('/auth/supplier') // Default redirect, can be adjusted based on role later if needed
                }, 2000)
            }
        } catch (err: any) {
            setFormError('An unexpected error occurred.')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                <div className="text-amber-500 animate-pulse font-bold tracking-widest">VERIFYING SECURITY LINK...</div>
            </div>
        )
    }

    if (!showForm) {
        return (
            <div className="w-full max-w-md relative z-20 animate-in fade-in zoom-in duration-500">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 shadow-2xl text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                        <FaExclamationTriangle className="text-3xl text-red-500" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3">Link Expired or Invalid</h2>
                    <p className="text-white text-sm mb-8 leading-relaxed">
                        This secure link is no longer active. Please request a new recovery link.
                    </p>

                    <Link
                        href="/auth/forgot-password"
                        className="block w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all duration-200 shadow-lg mb-3"
                    >
                        Request New Link
                    </Link>
                    <Link
                        href="/"
                        className="block w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all duration-200"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md relative z-20">
            {/* Brand Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center mb-6 group hover:scale-105 transition-transform duration-500">
                    <Image
                        src="/ark-logo-icon.jpg"
                        alt="ArkAlliance"
                        width={80}
                        height={80}
                        className="w-20 h-20 object-contain drop-shadow-2xl"
                    />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                    Set New Password
                </h1>
                <p className="text-white text-sm font-medium">
                    Create a strong password to secure your account.
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                {/* Subtle Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                {successMessage ? (
                    <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                            <FaCheckCircle className="text-3xl text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Password Updated</h3>
                        <p className="text-white text-sm mb-4 leading-relaxed">
                            {successMessage}
                        </p>
                        <div className="w-full bg-slate-800/50 rounded-full h-1 mt-6 overflow-hidden">
                            <div className="h-full bg-green-500 animate-progress-indeterminate"></div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {formError && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center flex items-center justify-center gap-2 animate-pulse">
                                <FaExclamationTriangle className="text-xs" /> {formError}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-xs font-bold !text-white uppercase tracking-wider ml-1">
                                New Password
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                    <FaLock className="w-4 h-4 text-slate-500 group-focus-within/input:text-amber-400 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full !pl-12 pr-4 py-3.5 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm font-medium hover:border-white/20"
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-xs font-bold !text-white uppercase tracking-wider ml-1">
                                Confirm Password
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                    <FaLock className="w-4 h-4 text-slate-500 group-focus-within/input:text-amber-400 transition-colors" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full !pl-12 pr-4 py-3.5 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm font-medium hover:border-white/20"
                                    placeholder="Re-enter password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full relative overflow-hidden group/btn py-4 rounded-xl font-bold text-slate-900 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 group-hover/btn:animate-gradient-x" />
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            <span className="relative flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                                        Updating Credentials...
                                    </>
                                ) : (
                                    <>Update Credentials <FaArrowRight className="-rotate-45" /></>
                                )}
                            </span>
                        </button>
                    </form>
                )}
            </div>

            {/* Footer Safe Text */}
            {/* Footer Safe Text */}
            <p className="text-center text-xs text-slate-300/80 mt-8 font-medium drop-shadow-md">
                Protected by ArkAlliance Secure Auth Protocol v2.1
            </p>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans text-white selection:bg-amber-500/30">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-slate-950/60 z-10" />
                <div className="absolute inset-0 bg-slate-950/20 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop"
                    alt="City Command"
                    className="w-full h-full object-cover opacity-75"
                />
            </div>

            <Suspense fallback={
                <div className="flex flex-col items-center justify-center space-y-4 relative z-20">
                    <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                    <div className="text-amber-500 animate-pulse font-bold tracking-widest">LOADING INTERFACE...</div>
                </div>
            }>
                <ResetPasswordContent />
            </Suspense>
        </div>
    )
}
