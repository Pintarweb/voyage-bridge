'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaLock } from 'react-icons/fa'
import Image from 'next/image'

function ForgotPasswordContent() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const supabase = createClient()
    const searchParams = useSearchParams()

    // Determine user type (default to agent for backward compatibility)
    const type = searchParams.get('type') || 'agent'
    const backLink = type === 'supplier' ? '/auth/supplier' : '/auth/agent'
    const backText = type === 'supplier' ? 'Return to Supplier Portal' : 'Return to Agent Login'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
            const redirectUrl = `${siteUrl}/auth/callback?next=/auth/reset-password`

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            })

            if (error) {
                console.error(error)
                if (error.status === 429) {
                    setError('Too many requests. Please wait a moment.')
                } else {
                    // For security, checking exists is bad practice generally, but following previous logic:
                    setSuccess(true)
                }
            } else {
                setSuccess(true)
            }
        } catch (err) {
            console.error(err)
            setError('An unexpected system error occurred.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans text-white selection:bg-amber-500/30">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/80 z-10" />
                <div className="absolute inset-0 bg-slate-950/50 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop"
                    alt="City Command"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>

            <div className="w-full max-w-md relative z-20">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-[0_0_30px_rgba(245,158,11,0.15)] mb-6 group hover:scale-105 transition-transform duration-500">
                        <Image
                            src="/ark-logo-icon.jpg"
                            alt="ArkAlliance"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain drop-shadow-lg"
                        />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                        Account Recovery
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">
                        Securely restore access to your command center.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                    {/* Subtle Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                    {success ? (
                        <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                                <FaCheckCircle className="text-3xl text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Check Your Inbox</h3>
                            <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                                We've sent a secure reset link to <span className="text-white font-semibold">{email}</span>. Please verify it to continue.
                            </p>

                            <Link
                                href={backLink}
                                className="inline-flex items-center justify-center w-full py-3.5 rounded-xl text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-200 group"
                            >
                                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> {backText}
                            </Link>

                            <p className="mt-6 text-xs text-slate-500">
                                Didn't receive the email? <button onClick={() => setSuccess(false)} className="text-amber-400 hover:text-amber-300 font-bold transition-colors">Try again</button>
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center flex items-center justify-center gap-2">
                                    <FaLock className="text-xs" /> {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">
                                    Email Address
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-slate-500 group-focus-within/input:text-amber-400 transition-colors" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm font-medium hover:border-white/20"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative overflow-hidden group/btn py-4 rounded-xl font-bold text-slate-900 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 group-hover/btn:animate-gradient-x" />
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                <span className="relative flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                                            Initializing Protocol...
                                        </>
                                    ) : (
                                        <>Send Recovery Link <FaArrowLeft className="rotate-180" /></>
                                    )}
                                </span>
                            </button>

                            <div className="text-center pt-2">
                                <Link
                                    href={backLink}
                                    className="text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2 group/back"
                                >
                                    <FaArrowLeft className="group-hover/back:-translate-x-1 transition-transform" /> {backText}
                                </Link>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer Safe Text */}
                <p className="text-center text-[10px] text-slate-600 mt-8 font-medium">
                    Protected by ArkAlliance Secure Auth Protocol v2.1
                </p>
            </div>
        </div>
    )
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500"><span className="animate-pulse font-bold">Loading secure interface...</span></div>}>
            <ForgotPasswordContent />
        </Suspense>
    )
}
