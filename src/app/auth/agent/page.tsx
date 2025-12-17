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

            router.push('/portal')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 font-sans overflow-hidden">
            {/* Background Image (Luxury Lounge/Hotel) - using img to avoid external domain config for now */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-blue-950/40 z-10 mix-blend-multiply" /> {/* Tint */}
                <div className="absolute inset-0 bg-black/30 z-10" /> {/* Darken */}
                <img
                    src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop"
                    alt="Luxury Background"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative z-20 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Column: Copy & Value Props */}
                <div className="text-white space-y-8 animate-in slide-in-from-left-8 duration-700">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 backdrop-blur-md text-amber-300 text-sm font-semibold tracking-wide">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            {content.urgency}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-2xl">
                            {content.title}
                        </h1>
                        <p className="text-xl text-blue-100 font-light max-w-xl leading-relaxed">
                            {content.subtitle}
                        </p>
                    </div>

                    {/* Value Props */}
                    <div className="space-y-6 bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                        {content.valueProps.map((prop, idx) => (
                            <div key={idx} className="flex items-start gap-4 group">
                                <div className="p-3 bg-white/10 rounded-xl group-hover:bg-amber-500/20 transition-colors">
                                    {prop.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">{prop.title}</h3>
                                    <p className="text-blue-200 text-sm">{prop.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Glassmorphism Login Card */}
                <div className="w-full max-w-md mx-auto animate-in slide-in-from-right-8 duration-700 delay-200">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden relative">
                        {/* Glow Effect */}
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rotate-45 pointer-events-none" />

                        <div className="p-8 md:p-10 relative z-10">
                            <div className="mb-8 text-center">
                                <h3 className="text-2xl font-bold text-white mb-2">Member Sign In</h3>
                                <p className="text-blue-200 text-sm">Access your Founding Member dashboard</p>
                            </div>

                            {error && (
                                <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-sm backdrop-blur-sm flex items-center gap-2">
                                    <FaLock className="text-xs" /> {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-2 ml-1">{content.email}</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-white/30 transition-all font-medium"
                                        placeholder="Enter your email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-2 ml-1">{content.password}</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-white/30 transition-all font-medium"
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
                                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-900/20 transition-all transform hover:-translate-y-0.5"
                                >
                                    {loading ? content.loggingIn : content.signIn}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <p className="text-center text-blue-200 text-sm mb-4">Don't have an account yet?</p>
                                <Link
                                    href="/register-agent"
                                    className="group flex items-center justify-center gap-2 w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all"
                                >
                                    {content.registerCta}
                                    <FaArrowRight className="text-amber-400 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Security Badge / Trust */}
                    <p className="text-center text-blue-300/60 text-xs mt-6 flex items-center justify-center gap-2">
                        <FaLock /> Secured by ArkAlliance Encryption
                    </p>
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
