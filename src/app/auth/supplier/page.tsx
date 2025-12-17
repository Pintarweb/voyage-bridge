'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaGlobe, FaCheckCircle, FaLock, FaBuilding, FaArrowRight, FaPlane, FaStar, FaChartLine } from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'

function ROICalculator() {
    const [price, setPrice] = useState(350)
    const [volume, setVolume] = useState(15)

    const revenue = price * volume * 0.90 // 10% comm
    const cost = 30
    const singleBookingRevenue = price * 0.90
    const timesCovered = (singleBookingRevenue / cost).toFixed(1)

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

    return (
        <div className="w-full bg-blue-950/40 backdrop-blur-md border border-amber-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden group mt-2">
            <div className="absolute inset-0 border border-amber-500/20 rounded-2xl pointer-events-none"></div>

            <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
                <FaChartLine /> ROI Calculator
            </h3>

            <div className="space-y-5">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-blue-200">
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
                        className="w-full h-2 bg-blue-900/50 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-blue-200">
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
                        className="w-full h-2 bg-blue-900/50 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                </div>

                <div className="pt-4 border-t border-white/10 space-y-1">
                    <div className="flex justify-between items-end">
                        <span className="text-sm text-blue-200">Potential Monthly Revenue</span>
                        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 drop-shadow-sm">
                            {formatCurrency(revenue)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-blue-300">Your Fixed Early Bird Investment</span>
                        <span className="text-white font-bold">$30/mo</span>
                    </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    <p className="text-xs text-amber-200 leading-relaxed">
                        <span className="font-bold">💡 Reality Check:</span> With just <span className="text-white font-bold">ONE booking</span>, your entire month’s fee is paid for <span className="text-white font-bold">{timesCovered}x</span> over. Everything else is pure profit.
                    </p>
                </div>

                <div className="text-center pt-2">
                    <button onClick={() => document.getElementById('auth-form')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs text-white underline decoration-amber-500 decoration-2 underline-offset-4 hover:text-amber-400 transition-colors font-bold cursor-pointer">
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
    const [isLogin, setIsLogin] = useState(false) // Default to Register/Trial to max conversion
    const router = useRouter()
    const supabase = createClient()
    const { language } = useLanguage()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (isLogin) {
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
            } else {
                // Registration / Trial Flow
                router.push(`/auth/register?email=${encodeURIComponent(email)}`)
            }

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative flex flex-col font-sans text-white bg-blue-950 overflow-hidden">

            {/* Nav */}
            <nav className="relative z-20 px-6 py-4 flex justify-end items-center w-full max-w-7xl mx-auto">
                <Link href="/auth/agent" className="text-sm text-blue-200 hover:text-white transition-colors flex items-center gap-2 group">
                    Looking for the Agent Portal? <span className="underline decoration-amber-400/50 underline-offset-4 group-hover:text-amber-400 decoration-2">Switch here</span>
                </Link>
            </nav>

            {/* Background Map/Video Placeholder */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Lighter overlay for brighter background */}
                <div className="absolute inset-0 bg-blue-950/10 z-10" />
                <style jsx global>{`
                  @keyframes pan-slow {
                    0% { transform: scale(1.1) translate(0, 0); }
                    100% { transform: scale(1.25) translate(-2%, -2%); }
                  }
                  .animate-pan-slow {
                    animation: pan-slow 40s ease-in-out infinite alternate;
                  }
                  /* Autofill Transparency Fix */
                  input:-webkit-autofill,
                  input:-webkit-autofill:hover, 
                  input:-webkit-autofill:focus, 
                  input:-webkit-autofill:active {
                      -webkit-box-shadow: 0 0 0 30px rgba(23, 37, 84, 0.8) inset !important;
                      -webkit-text-fill-color: white !important;
                      caret-color: white !important;
                      transition: background-color 5000s ease-in-out 0s;
                  }
                `}</style>
                <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                    alt="Global Trade Network"
                    className="w-full h-full object-cover animate-pan-slow"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-20 flex-grow flex items-center justify-center px-4 py-8">
                {/* 
                   Card Style: 
                   - bg-black/10: Very light tint for maximum transparency/glass effect
                   - backdrop-blur-md: Frosted look
                */}
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-2xl rounded-3xl overflow-hidden border border-white/20 bg-black/10 backdrop-blur-md">

                    {/* Left Column: Value Prop & FOMO */}
                    <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-8 bg-gradient-to-br from-black/20 to-transparent relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

                        <div className="space-y-4 relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                                <FaStar className="animate-spin-slow" /> Official Partner Program
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-xl">
                                Global Distribution. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Zero Friction.</span>
                            </h1>
                            <p className="text-lg text-white/90 leading-relaxed max-w-md drop-shadow-md font-medium">
                                Stop chasing bookings. Let 5,000+ verified global travel agents sell your products for you. Minimum investment, maximum exposure.
                            </p>
                        </div>

                        <ROICalculator />
                    </div>

                    {/* Right Column: Form */}
                    <div id="auth-form" className="p-8 md:p-12 bg-white/5 backdrop-blur-md flex flex-col justify-center border-l border-white/10 relative">
                        {/* Toggle */}
                        <div className="absolute top-8 right-8 flex items-center gap-3 text-sm">
                            <span className="text-white/80">{isLogin ? "New here?" : "Already have an account?"}</span>
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-amber-400 font-bold hover:text-amber-300 transition-colors underline decoration-2 underline-offset-4"
                            >
                                {isLogin ? "Apply Now" : "Sign In"}
                            </button>
                        </div>

                        <div className="mt-8 md:mt-0">

                            {/* Killer Offer Badge - Re-inserted */}
                            {!isLogin && (
                                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-0.5 rounded-2xl shadow-lg shadow-amber-900/40 transform hover:scale-[1.02] transition-transform cursor-default mb-8">
                                    <div className="bg-blue-950/80 rounded-[14px] px-6 py-4 flex items-center justify-between gap-4 backdrop-blur-md">
                                        <div>
                                            <div className="text-xs text-amber-200 uppercase tracking-widest font-bold mb-1">Founding Member Offer</div>
                                            <div className="text-xl md:text-2xl font-black text-white italic">
                                                70% OFF <span className="text-amber-400">+</span> 30-DAY FREE TRIAL
                                            </div>
                                        </div>
                                        <div className="hidden sm:flex h-12 w-12 bg-amber-500 rounded-full items-center justify-center text-blue-900 font-bold text-xl shadow-inner">
                                            %
                                        </div>
                                    </div>
                                </div>
                            )}

                            <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                                {isLogin ? "Welcome Back." : "Secure Your Early Bird Slot."}
                            </h2>
                            <p className="text-white/80 text-sm mb-8 drop-shadow-sm">
                                {isLogin ? "Access your supplier dashboard." : "Join the world's fastest growing B2B travel network."}
                            </p>

                            {error && (
                                <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm backdrop-blur-sm flex items-center gap-2 animate-pulse">
                                    <FaLock className="text-xs" /> {error}
                                </div>
                            )}

                            <form onSubmit={handleAuth} className="space-y-5">
                                <div>
                                    <label
                                        className="block text-xs font-bold text-white uppercase tracking-wider mb-2 ml-1 drop-shadow-md"
                                        style={{ color: '#ffffff' }}
                                    >
                                        Professional Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 bg-blue-950/50 border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-white placeholder-blue-200/50 transition-all font-medium backdrop-blur-sm"
                                        placeholder="partner@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-xs font-bold text-white uppercase tracking-wider mb-2 ml-1 drop-shadow-md"
                                        style={{ color: '#ffffff' }}
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 bg-blue-950/50 border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-white placeholder-blue-200/50 transition-all font-medium backdrop-blur-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 ${isLogin
                                        ? 'bg-white text-blue-900 hover:bg-gray-100'
                                        : 'bg-gradient-to-r from-teal-500 to-teal-400 text-teal-950 hover:from-teal-400 hover:to-teal-300 shadow-teal-500/20'
                                        }`}
                                >
                                    {loading ? 'Processing...' : (isLogin ? 'Sign In to Dashboard' : 'START MY 30-DAY FREE TRIAL')}
                                </button>
                            </form>

                            {!isLogin && (
                                <p className="text-center text-xs text-white/70 mt-4 drop-shadow-sm">
                                    Founding Year discount applies to the first 500 suppliers only. <span className="text-amber-400 font-bold">142 slots remaining.</span>
                                </p>
                            )}

                            {isLogin && (
                                <div className="text-center mt-4">
                                    <Link href="/auth/forgot-password?type=supplier" className="text-xs text-white/70 hover:text-white transition-colors">
                                        Forgot Password?
                                    </Link>
                                </div>
                            )}

                            {/* Bullets - Re-inserted */}
                            {!isLogin && (
                                <ul className="space-y-4 pt-8 border-t border-white/10 mt-8">
                                    {[
                                        { title: 'Direct Connection', desc: 'Access 5,000+ elite agents.' },
                                        { title: 'Priority Listing', desc: 'Appear at the top.' },
                                        { title: 'No-Risk Entry', desc: 'Cancel anytime.' }
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-4 group">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex flex-col items-center justify-center group-hover:bg-emerald-500 group-hover:text-emerald-950 transition-colors shrink-0">
                                                <FaCheckCircle className="text-sm" />
                                            </div>
                                            <div className="text-base">
                                                <span className="font-bold text-white mr-2 drop-shadow-sm">{item.title}:</span>
                                                <span className="text-white/80 drop-shadow-sm">{item.desc}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Social Proof */}
                <div className="absolute bottom-0 w-full p-4 text-center">
                    <p className="text-xs text-blue-200/50 uppercase tracking-widest font-semibold">
                        Join the network already trusted by global hotel chains and leading regional transport providers
                    </p>
                </div>
            </div>
        </div>
    )
}
