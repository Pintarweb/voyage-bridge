'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FaCheckCircle, FaGlobe, FaShieldAlt, FaChartLine, FaLock, FaMapMarkerAlt } from 'react-icons/fa'


// --- Constants ---
const BASE_FEE = 30
const ADD_ON_FEE = 20
const MIN_SLOTS = 1

// Placeholder IDs - In production these should be environment variables
const BASE_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_EARLY_BIRD_PROMO || "price_1Sd9sTCOxzNHMrVaPeQ9Bz7e"
const ADD_ON_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_ADDITIONAL_SLOT || "price_1Sd9uICOxzNHMrVagUBvShn7"

export default function SupplierSubscriptionPage() {
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [isAuthorized, setIsAuthorized] = useState(false)

    // User Data
    const [userId, setUserId] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)

    // Calculator State
    const [totalSlots, setTotalSlots] = useState<number>(1)
    const [termsAccepted, setTermsAccepted] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    // --- Authentication & Authorization ---
    useEffect(() => {
        const checkAccess = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError || !session) {
                    console.warn('No active session, redirecting to home.')
                    router.push('/')
                    return
                }

                setUserId(session.user.id)
                setUserEmail(session.user.email || null)

                const { data: profile, error: profileError } = await supabase
                    .from('suppliers')
                    .select('role')
                    .eq('id', session.user.id)
                    .single()

                if (profileError || !profile) {
                    router.push('/agent-portal')
                    return
                }

                if (profile.role !== 'pending_supplier') {
                    router.push('/agent-portal')
                    return
                }

                setIsAuthorized(true)
            } catch (err) {
                console.error('Guard error:', err)
                router.push('/')
            } finally {
                setLoading(false)
            }
        }

        checkAccess()
    }, [router, supabase])

    // --- Calculator Logic ---
    const { monthlyCommitment, addOnQuantity } = useMemo(() => {
        const slots = Math.max(MIN_SLOTS, totalSlots)
        // Formula: $30 + ($20 * (slots - 1))
        // Base covers 1 slot. Extra slots are add-ons.
        const extraSlots = slots - 1
        const cost = BASE_FEE + (ADD_ON_FEE * extraSlots)

        return {
            monthlyCommitment: cost,
            addOnQuantity: extraSlots
        }
    }, [totalSlots])

    // --- Handle Submit ---
    const handleSubmit = async () => {
        if (!userId || !userEmail) return
        setSubmitting(true)

        try {
            const payload = {
                userId: userId, // Using real user ID
                userEmail: userEmail, // Using real email
                basePriceId: BASE_PRICE_ID,
                addOnPriceId: ADD_ON_PRICE_ID,
                totalSlotsQuantity: totalSlots
            }

            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session')
            }

            if (data.url) {
                // Redirect to Stripe
                window.location.assign(data.url)
            } else {
                alert('Error: No checkout URL returned.')
            }
        } catch (error: any) {
            console.error('Checkout error:', error)
            alert(error.message || 'An unexpected error occurred.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                </div>
            </div>
        )
    }

    if (!isAuthorized) return null

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-slate-950/70 z-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-slate-950/90 z-20" />
                <div className="absolute top-0 right-[-10%] w-[60%] h-[60%] bg-amber-600/10 blur-[150px] z-20 pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] z-20 pointer-events-none" />

                <img
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                    alt="Global Business Background"
                    className="w-full h-full object-cover opacity-50 grayscale-[20%]"
                />
            </div>
            {/* Promo Image */}


            <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="max-w-5xl mx-auto mb-6 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 relative z-10">
                    {/* Promo Sticker */}
                    <div className="flex-shrink-0 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                            <Image
                                src="/early-bird-promo.jpg"
                                alt="70% Off Early Bird Special - Was $100, Now $30"
                                width={330}
                                height={330}
                                className="relative w-72 sm:w-80 h-auto object-contain drop-shadow-2xl rounded-full border-4 border-white/10 group-hover:scale-105 transition-transform duration-300"
                                priority
                            />
                        </div>
                    </div>

                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight drop-shadow-lg">
                            Escape Costly Intermediaries: <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Secure Your Global Access</span> <br />
                            & 70% Off Today.
                        </h1>
                    </div>
                </div>

                <div className="text-center max-w-4xl mx-auto mb-16 relative z-10">
                    <p className="text-xl sm:text-2xl text-slate-300 font-medium border-b border-white/5 pb-8 inline-block">
                        Pay <span className="text-amber-400 font-bold">$0 Today</span>. Your Predictable Monthly Subscription Starts After 30 Days.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">

                    {/* Benefits Section */}
                    <div className="space-y-8 lg:pr-8">
                        <div>
                            <p className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-3">Core Benefits: The ArkAlliance Advantage</p>
                            <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-6">
                                Why Choose ArkAlliance? <span className="text-slate-400">Direct Access & Full Control</span>
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <BenefitItem
                                icon={<FaGlobe className="w-6 h-6 text-amber-500" />}
                                title="Direct Global Exposure"
                                description="Gain immediate access to a vast network of travel agents worldwide. Bypass commission-heavy models and complex distribution channels."
                            />
                            <BenefitItem
                                icon={<FaShieldAlt className="w-6 h-6 text-slate-400" />}
                                title="Predictable and Cost-Effective Distribution"
                                description="Our low, flat subscription fee allows you to manage your margins better in a tight market environment."
                            />
                            <BenefitItem
                                icon={<FaChartLine className="w-6 h-6 text-amber-500" />}
                                title="Full Control Over Your Business Terms"
                                description="Retain complete authority to set your own rates, policies, and availability. Update everything directly without third-party delay."
                            />
                            <BenefitItem
                                icon={<FaMapMarkerAlt className="w-6 h-6 text-slate-400" />}
                                title="Centralized Directory"
                                description="Your offerings are organized by region and category, making it easier for agents to find you."
                            />
                        </div>

                        <div className="mt-8 p-6 bg-slate-900/50 rounded-2xl border border-white/10 shadow-inner backdrop-blur-sm">
                            <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <FaLock className="w-3 h-3 text-amber-500" />
                                Secure Payment Processing
                            </h4>
                            <div className="flex flex-wrap gap-4 items-center mb-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                                <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                                    <Image src="/visa-logo.png" alt="Visa" width={60} height={40} className="h-6 w-auto object-contain invert" />
                                </div>
                                <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                                    <Image src="/mastercard-logo.png" alt="Mastercard" width={60} height={40} className="h-6 w-auto object-contain invert" />
                                </div>
                                <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                                    <Image src="/amex-logo.png" alt="American Express" width={60} height={40} className="h-6 w-auto object-contain invert" />
                                </div>
                                <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                                    <Image src="/stripe-logo.png" alt="Stripe" width={60} height={40} className="h-6 w-auto object-contain invert" />
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium">
                                Your payment information is encrypted and processed securely by Stripe.
                            </p>
                        </div>
                    </div>

                    {/* Calculator Card */}
                    <div className="bg-slate-950/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_0_60px_rgba(245,158,11,0.1)] relative overflow-hidden group hover:border-amber-500/30 transition-all duration-500">
                        {/* 1px Silver-Gold Border Effect */}
                        <div className="absolute inset-0 border border-amber-500/10 rounded-3xl pointer-events-none group-hover:border-amber-500/20 transition-all duration-500" />

                        {/* Gradient Orb Effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 blur-[100px] -mr-32 -mt-32 rounded-full pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="mb-8 border-b border-white/10 pb-6">
                                <h3 className="text-2xl font-bold flex items-center gap-3 mb-2 text-white">
                                    <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-[10px] px-2 py-1 rounded-md text-white font-black uppercase tracking-widest shadow-lg">Calculator</span>
                                    Subscription Plan
                                </h3>
                                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold bg-amber-400/10 px-3 py-1.5 rounded-full inline-flex border border-amber-400/20">
                                    <FaLock className="w-3 h-3" />
                                    <span>Guarantee: 1-year lock base price of $30/mth</span>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Input Section */}
                                <div>
                                    <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Select your desired total inventory slots</p>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setTotalSlots(prev => Math.max(MIN_SLOTS, prev - 1))}
                                            className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 hover:border-amber-500/50 hover:bg-slate-800 flex items-center justify-center text-2xl font-bold transition-all text-white shadow-lg"
                                        >
                                            -
                                        </button>
                                        <div className="flex-1 relative">
                                            <input
                                                type="number"
                                                id="slots"
                                                min={MIN_SLOTS}
                                                value={totalSlots}
                                                onChange={(e) => setTotalSlots(Math.max(MIN_SLOTS, parseInt(e.target.value) || MIN_SLOTS))}
                                                className="w-full text-center bg-slate-900/50 border border-white/10 rounded-2xl py-3.5 text-3xl font-black text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none shadow-inner"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 uppercase">Slots</span>
                                        </div>
                                        <button
                                            onClick={() => setTotalSlots(prev => prev + 1)}
                                            className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 hover:border-amber-500/50 hover:bg-slate-800 flex items-center justify-center text-2xl font-bold transition-all text-white shadow-lg"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-3 text-center">
                                        Minimum {MIN_SLOTS} slot required. Includes base fee.
                                    </p>

                                    <div className="mt-6 bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex gap-4">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <FaCheckCircle className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <span className="font-bold text-amber-400 block mb-1 uppercase text-[10px] tracking-wide">What is an Additional Slot?</span>
                                            Each slot represents <strong>one published product</strong> on our marketplace.
                                            The base plan includes 1 slot. Add more to list multiple tour packages or hotel locations.
                                        </p>
                                    </div>
                                </div>

                                {/* Breakdown */}
                                <div className="bg-slate-950/60 rounded-2xl p-6 space-y-4 text-sm border border-white/5">
                                    <div className="flex justify-between text-slate-400">
                                        <span>Base Fee (1 Slot)</span>
                                        <span className="font-mono text-white">${BASE_FEE}</span>
                                    </div>
                                    {addOnQuantity > 0 && (
                                        <div className="flex justify-between text-slate-400">
                                            <span>Add-ons ({addOnQuantity} x ${ADD_ON_FEE})</span>
                                            <span className="font-mono text-white">+${addOnQuantity * ADD_ON_FEE}</span>
                                        </div>
                                    )}
                                    <div className="h-px bg-white/10 my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-200 uppercase text-xs tracking-wide">Monthly Commitment</span>
                                        <span className="text-4xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">${monthlyCommitment}</span>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer" onClick={() => setTermsAccepted(!termsAccepted)}>
                                        <div className="flex items-center h-5 mt-0.5">
                                            <input
                                                id="terms"
                                                name="terms"
                                                type="checkbox"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                className="h-5 w-5 rounded border-white/20 bg-slate-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-950 cursor-pointer"
                                            />
                                        </div>
                                        <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer select-none leading-relaxed">
                                            I agree to the <span className="text-white hover:underline">Terms & Conditions</span> and authorize ArkAlliance to begin billing me the calculated monthly fee after my free trial ends.
                                        </label>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting || !termsAccepted}
                                        className="w-full py-5 px-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-lg font-black uppercase tracking-wide rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3 group/btn"
                                    >
                                        {submitting ? (
                                            <span className="animate-pulse">Processing...</span>
                                        ) : (
                                            <>
                                                Start Free Trial & Pay $0 Today
                                                <FaCheckCircle className="text-white/90 group-hover/btn:scale-110 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                    Trial period lasts 30 days • Cancel anytime
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BenefitItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex items-start gap-5 group">
            <div className="flex-shrink-0 p-4 bg-slate-900 rounded-xl border border-white/5 group-hover:border-amber-500/30 group-hover:bg-slate-800 transition-all duration-300 shadow-lg">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    )
}
