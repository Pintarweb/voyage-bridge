'use client'

import { Suspense, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { useRoleRedirect } from '@/hooks/useRoleRedirect'
import { FaGem, FaBolt, FaLightbulb, FaArrowRight, FaLock } from 'react-icons/fa'

function AgentAuthContent() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()
    const { language } = useLanguage()
    const { checkAndRedirect } = useRoleRedirect()

    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    // Content Text (Focused on English as per prompt, falling back to English for others for the new copy)
    const content = {
        title: 'The Future of Your Travel Business Starts Here.',
        subtitle: 'Join the ArkAlliance Early Bird program. Lock in founding member benefits before the window closes.',
        urgency: 'Phase 1 intake limited. Secure your agency’s founding spot today.',
        email: 'Email Address',
        password: 'Password',
        signIn: 'Sign In',
        loggingIn: 'Verifying Access...',
        registerCta: 'Request Access / Register',
        valueProps: [
            {
                icon: <FaGem className="text-amber-400 text-xl" />,
                title: 'Founding Rates',
                desc: 'Free access to all offers for founding members.'
            },
            {
                icon: <FaBolt className="text-amber-400 text-xl" />,
                title: 'Priority Access',
                desc: 'First to view new Hotel, Transport, and Land inventory.'
            },
            {
                icon: <FaLightbulb className="text-amber-400 text-xl" />,
                title: 'Feature Input',
                desc: 'Help shape the upcoming Airline module roadmap.'
            }
        ]
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            })

            if (error) throw error

            const wasRedirected = await checkAndRedirect(data.user.id)
            if (wasRedirected) return

            // Verify user is actually an agent
            const { data: agentProfile, error: agentError } = await supabase
                .from('agent_profiles')
                .select('id')
                .eq('id', data.user.id)
                .single()

            if (agentError || !agentProfile) {
                await supabase.auth.signOut()
                throw new Error('No agent account found. Please check your credentials or register.')
            }

            router.refresh()
            router.push('/portal')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 font-sans overflow-hidden bg-slate-950">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                {/* Main Visual: Hotel Interior */}
                <div className="absolute inset-0 bg-slate-950/60 z-10 mix-blend-multiply" /> {/* Dark Cinematic Tint */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-transparent to-slate-950/80 z-20" /> {/* Lighting Gradient */}

                {/* Amber Light Leak (Left) */}
                <div className="absolute top-0 left-[-10%] w-[50%] h-full bg-amber-600/10 blur-[150px] z-20 pointer-events-none" />

                <img
                    src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop"
                    alt="Luxury Interior"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Social Proof Widget (Top Right) */}
            <div className="absolute top-6 right-6 z-30 hidden md:block animate-in slide-in-from-top-4 duration-700 delay-500">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-full shadow-xl">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-slate-200">Phase 1: <span className="text-white font-bold">84% Full</span>. Secure your agency founding spot.</span>
                </div>
            </div>

            <div className="relative z-20 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Column: Copy & Value Props */}
                <div className="text-white space-y-10 animate-in slide-in-from-left-8 duration-700">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-2xl text-white">
                            {content.title}
                        </h1>
                        <p className="text-xl text-slate-200 font-medium max-w-xl leading-relaxed drop-shadow-md">
                            {content.subtitle}
                        </p>
                    </div>

                    {/* Interactive Value Grid */}
                    <div className="grid gap-4">
                        {content.valueProps.map((prop, idx) => (
                            <div key={idx} className="group p-5 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-amber-500/50 rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,184,0,0.1)] cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-950/50 rounded-lg text-amber-400 text-xl border border-white/5 group-hover:text-amber-300 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                        {prop.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">{prop.title}</h3>
                                        <p className="text-slate-300 text-sm group-hover:text-slate-100 transition-colors">{prop.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Crystal Glass Login Module */}
                <div className="w-full max-w-md mx-auto animate-in slide-in-from-right-8 duration-700 delay-200">
                    <div className="bg-slate-950/20 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden relative ring-1 ring-white/5">
                        {/* 1px Silver-Gold Border Effect (simulated via ring/border) */}
                        <div className="absolute inset-0 border border-amber-500/10 rounded-2xl pointer-events-none" />

                        <div className="p-8 md:p-10 relative z-10">
                            <div className="mb-8 text-center">
                                <h3 className="text-2xl font-bold text-white mb-2">Member Sign In</h3>
                                <p className="text-slate-300 text-sm">Access your Founding Member dashboard</p>
                            </div>

                            {error && (
                                <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg text-sm backdrop-blur-sm flex items-center gap-2">
                                    <FaLock className="text-xs" /> {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">{content.email}</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-all font-medium hover:bg-slate-950/70"
                                        placeholder="Enter your email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">{content.password}</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500 transition-all font-medium hover:bg-slate-950/70"
                                        placeholder="••••••••"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline transition-colors"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold text-lg rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-0.5"
                                >
                                    {loading ? content.loggingIn : content.signIn}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <p className="text-center text-slate-400 text-sm mb-4">Don&apos;t have an account yet?</p>
                                <Link
                                    href="/register-agent"
                                    className="group flex items-center justify-center gap-2 w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-semibold transition-all hover:border-white/20"
                                >
                                    {content.registerCta}
                                    <FaArrowRight className="text-amber-400 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {/* Bank-Grade Security Badge */}
                            <div className="mt-6 pt-4 flex items-center justify-center gap-2 text-[10px] text-amber-500/60 uppercase tracking-widest font-bold">
                                <FaLock className="text-amber-500" /> Bank-Grade Encryption Active
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AgentAuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-amber-500">Loading...</div>}>
            <AgentAuthContent />
        </Suspense>
    )
}
