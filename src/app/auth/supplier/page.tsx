'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaCheckCircle, FaLock, FaChartLine, FaArrowRight, FaGem } from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'
import ExitIntentModal from '@/components/feedback/ExitIntentModal'

function ROICalculator() {
    const [price, setPrice] = useState(350)
    const [volume, setVolume] = useState(15)
    const router = useRouter()

    const revenue = price * volume * 0.90 // 10% comm
    const cost = 30
    const singleBookingRevenue = price * 0.90
    const timesCovered = (singleBookingRevenue / cost).toFixed(1)

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

    return (
        <div className="w-full bg-slate-950/40 backdrop-blur-md border border-amber-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden group mt-2">
            <div className="absolute inset-0 border border-amber-500/20 rounded-2xl pointer-events-none"></div>

            <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
                <FaChartLine /> ROI Calculator
            </h3>

            <div className="space-y-5">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-300">
                        <span>Avg. Room/Package Rate</span>
                        <span className="text-white font-bold">{formatCurrency(price)}</span>
                    </div>
                    <input
                        type="range"
                        min="50"
                        max="2000"
                        step="50"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full h-2 bg-slate-900/50 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-300">
                        <span>Est. Monthly Bookings</span>
                        <span className="text-white font-bold">{volume}</span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="100"
                        step="1"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-full h-2 bg-slate-900/50 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                </div>

                <div className="pt-4 border-t border-white/10 space-y-1">
                    <div className="flex justify-between items-end">
                        <span className="text-sm text-slate-300">Potential Monthly Revenue</span>
                        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 drop-shadow-sm">
                            {formatCurrency(revenue)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Your Fixed Early Bird Investment</span>
                        <span className="text-white font-bold">$30/mo</span>
                    </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    <p className="text-xs text-amber-200 leading-relaxed">
                        <span className="font-bold">💡 Reality Check:</span> With just <span className="text-white font-bold">ONE booking</span>, your entire month’s fee is paid for <span className="text-white font-bold">{timesCovered}x</span> over. Everything else is pure profit.
                    </p>
                </div>

                <div className="text-center pt-2">
                    <button onClick={() => router.push('/auth/register')} className="text-xs text-white underline decoration-amber-500 decoration-2 underline-offset-4 hover:text-amber-400 transition-colors font-bold cursor-pointer">
                        Stop leaving money on the table — Start Trial
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function SupplierAuthPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isNavigating, setIsNavigating] = useState(false)
    const router = useRouter()
    const { language } = useLanguage()
    const supabase = createClient()

    // 1. Auto-redirect if already logged in
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                // If they have a session, send them towards the dashboard. 
                // Middleware will catch them and send them to /approval-pending if needed.
                router.push('/supplier/dashboard')
            }
        }
        checkSession()
    }, [router, supabase])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setIsNavigating(true)
        setError('')

        try {
            // Login Flow
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            if (authError) throw authError

            // Check supplier status
            const { data: supplier, error: supplierError } = await supabase
                .from('suppliers')
                .select('id')
                .eq('id', authData.user.id)
                .single()

            if (supplierError || !supplier) {
                await supabase.auth.signOut()
                throw new Error('No supplier account found. Please register for a trial.')
            }

            router.push('/supplier/dashboard')

        } catch (err: any) {
            setError(err.message)
            setIsNavigating(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 font-sans overflow-hidden bg-slate-950">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                {/* Main Visual: Business/Luxury Travel Theme */}
                <div className="absolute inset-0 bg-slate-950/60 z-10 mix-blend-multiply" /> {/* Dark Cinematic Tint */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-transparent to-slate-950/80 z-20" /> {/* Lighting Gradient */}

                {/* Amber Light Leak (Left) */}
                <div className="absolute top-0 left-[-10%] w-[50%] h-full bg-amber-600/10 blur-[150px] z-20 pointer-events-none" />

                <img
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                    alt="Global Business Travel"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Nav */}
            <nav className="absolute top-6 right-6 z-30 animate-in slide-in-from-top-4 duration-700 delay-500">
                <Link href="/auth/agent" className="flex items-center gap-3 px-4 py-2 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-full shadow-xl text-sm text-slate-300 hover:text-white transition-colors group">
                    Looking for Agent Portal? <span className="text-amber-400 font-bold group-hover:underline">Switch here</span>
                </Link>
            </nav>

            <div className="relative z-20 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Column: Copy & Value Props */}
                <div className="text-white space-y-10 animate-in slide-in-from-left-8 duration-700 lg:pl-8">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                            Official Partner Program
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-2xl text-white">
                            Global Distribution. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Zero Friction.</span>
                        </h1>
                        <p className="text-xl text-slate-200 font-medium max-w-xl leading-relaxed drop-shadow-md">
                            Stop chasing bookings. Let 5,000+ verified global travel agents sell your products for you.
                        </p>
                    </div>

                    <ROICalculator />

                    {/* Social Proof Text */}
                    <div className="pt-4">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                            Trusted by global hotel chains & regional transport leaders
                        </p>
                    </div>
                </div>

                {/* Right Column: Crystal Glass Form */}
                <div id="auth-form" className="w-full max-w-md mx-auto animate-in slide-in-from-right-8 duration-700 delay-200">
                    <div className="bg-slate-950/20 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden relative ring-1 ring-white/5">
                        {/* 1px Silver-Gold Border Effect */}
                        <div className="absolute inset-0 border border-amber-500/10 rounded-2xl pointer-events-none" />

                        <div className="p-8 md:p-10 relative z-10">

                            <div className="mb-8 text-center">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Supplier Sign In
                                </h3>
                                <p className="text-slate-300 text-sm">
                                    Access your dashboard
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg text-sm backdrop-blur-sm flex items-center gap-2">
                                    <FaLock className="text-xs" /> {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Professional Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-slate-500 transition-all font-medium hover:bg-slate-950/70"
                                        placeholder="partner@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-slate-500 transition-all font-medium hover:bg-slate-950/70"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Link href="/auth/forgot-password?type=supplier" className="text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline transition-colors">
                                        Forgot Password?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold text-lg rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-0.5"
                                >
                                    {loading ? 'Verifying...' : 'Sign In'}
                                </button>
                            </form>

                            <div className="mt-8 relative group cursor-pointer" onClick={() => router.push('/auth/register')}>
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                                <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 p-1 rounded-xl shadow-2xl transform group-hover:-translate-y-1 transition-all duration-300">
                                    <div className="bg-slate-950 rounded-[10px] p-5 relative overflow-hidden">
                                        {/* Ticket Stub Design Elements */}
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <FaGem className="text-6xl text-white" />
                                        </div>
                                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-950 rounded-r-full border-r border-amber-500/50"></div>
                                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-950 rounded-l-full border-l border-amber-500/50"></div>

                                        <div className="text-center space-y-2">
                                            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border border-amber-500/30">
                                                <FaGem /> Exclusive Offer
                                            </div>
                                            <div>
                                                <div className="text-white font-bold text-lg leading-tight">
                                                    Founding Member Status
                                                </div>
                                                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 my-1">
                                                    70% OFF
                                                </div>
                                                <div className="text-slate-400 text-xs font-medium">
                                                    + 30-Day Risk-Free Trial
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <button className="w-full py-2 bg-white text-slate-950 font-bold text-sm rounded hover:bg-slate-200 transition-colors uppercase tracking-wider flex items-center justify-center gap-2">
                                                    Claim Your Spot <FaArrowRight />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-slate-500 pt-1">
                                                Limited availability. Offer ends soon.
                                            </p>
                                        </div>
                                    </div>
                                    {/* Dashed Line Overlay */}
                                    <div className="absolute top-1/2 left-4 right-4 h-[1px] border-t-2 border-dashed border-black/20 mix-blend-overlay pointer-events-none"></div>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="mt-6 pt-4 flex items-center justify-center gap-2 text-[10px] text-amber-500/60 uppercase tracking-widest font-bold">
                                <FaLock className="text-amber-500" /> Bank-Grade Encryption Active
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {!isNavigating && <ExitIntentModal />}
        </div>
    )
}
