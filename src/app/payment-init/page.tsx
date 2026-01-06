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
        <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white relative">
            {/* Promo Image */}


            <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">

                {/* Header Section */}
                {/* Header Section */}
                {/* Header Section */}
                <div className="max-w-5xl mx-auto mb-6 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
                    {/* Promo Sticker */}
                    <div className="flex-shrink-0 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Image
                            src="/early-bird-promo.jpg"
                            alt="70% Off Early Bird Special - Was $100, Now $30"
                            width={330}
                            height={330}
                            className="w-72 sm:w-80 h-auto object-contain drop-shadow-2xl rounded-full border-4 border-white/10"
                            priority
                        />
                    </div>

                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2 leading-tight">
                            Escape Costly Intermediaries: <br className="hidden sm:block" />
                            Secure Your Global Access & 70% Off Today.
                        </h1>
                    </div>
                </div>

                <div className="text-center max-w-4xl mx-auto mb-16">
                    <p className="text-xl sm:text-2xl text-gray-300 font-medium">
                        Pay $0 Today. Your Predictable Monthly Subscription Starts After 30 Days.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Benefits Section */}
                    <div className="space-y-8 lg:pr-8">
                        <div>
                            <p className="text-blue-400 font-semibold tracking-wide uppercase text-sm mb-2">Core Benefits: The ArkAlliance Advantage</p>
                            <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-4">
                                Why Choose ArkAlliance? Direct Access & Full Control
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <BenefitItem
                                icon={<FaGlobe className="w-6 h-6 text-blue-400" />}
                                title="Direct Global Exposure"
                                description="Gain immediate access to a vast network of travel agents worldwide. Bypass commission-heavy models and complex distribution channels."
                            />
                            <BenefitItem
                                icon={<FaShieldAlt className="w-6 h-6 text-emerald-400" />}
                                title="Predictable and Cost-Effective Distribution"
                                description="Our low, flat subscription fee allows you to manage your margins better in a tight market environment."
                            />
                            <BenefitItem
                                icon={<FaChartLine className="w-6 h-6 text-purple-400" />}
                                title="Full Control Over Your Business Terms"
                                description="Retain complete authority to set your own rates, policies, and availability. Update everything directly without third-party delay."
                            />
                            <BenefitItem
                                icon={<FaMapMarkerAlt className="w-6 h-6 text-pink-400" />}
                                title="Centralized Directory"
                                description="Your offerings are organized by region and category, making it easier for agents to find you."
                            />
                        </div>

                        <div className="mt-8 p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 shadow-inner">
                            <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Secure Payment Processing</h4>
                            <div className="flex flex-wrap gap-4 items-center mb-4">
                                <div className="bg-white p-1 rounded-md">
                                    <Image src="/visa-logo.png" alt="Visa" width={60} height={40} className="h-8 w-auto object-contain" />
                                </div>
                                <div className="bg-white p-1 rounded-md">
                                    <Image src="/mastercard-logo.png" alt="Mastercard" width={60} height={40} className="h-8 w-auto object-contain" />
                                </div>
                                <div className="bg-white p-1 rounded-md">
                                    <Image src="/amex-logo.png" alt="American Express" width={60} height={40} className="h-8 w-auto object-contain" />
                                </div>
                                <div className="bg-white p-1 rounded-md">
                                    <Image src="/stripe-logo.png" alt="Stripe" width={60} height={40} className="h-8 w-auto object-contain" />
                                </div>
                            </div>
                            <p className="text-[11px] text-gray-500 font-medium flex items-center">
                                <FaLock className="w-3 h-3 mr-1.5 text-gray-400" />
                                Your payment information is encrypted and processed securely by Stripe.
                            </p>
                        </div>
                    </div>

                    {/* Calculator Card */}
                    <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl relative overflow-hidden">
                        {/* Gradient Orb Effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl -mr-32 -mt-32 rounded-full pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold flex items-center gap-2 mb-1">
                                    <span className="bg-blue-600 text-xs px-2 py-1 rounded text-white font-bold uppercase tracking-wide">Calculator</span>
                                    Subscription Plan
                                </h3>
                                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-1 rounded-md inline-block w-fit">
                                    <FaLock className="w-3 h-3" />
                                    <span>Guarantee: 1-year lock base price of $30/mth</span>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Input Section */}
                                <div>
                                    <p className="text-xs text-blue-300 mb-1 font-medium">Select your desired total inventory slots.</p>
                                    <label htmlFor="slots" className="block text-sm font-medium text-gray-400 mb-2">
                                        Total Number of Slots You Need
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setTotalSlots(prev => Math.max(MIN_SLOTS, prev - 1))}
                                            className="w-12 h-12 rounded-xl bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-xl font-bold transition-colors"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            id="slots"
                                            min={MIN_SLOTS}
                                            value={totalSlots}
                                            onChange={(e) => setTotalSlots(Math.max(MIN_SLOTS, parseInt(e.target.value) || MIN_SLOTS))}
                                            className="w-full text-center bg-gray-900 border border-gray-600 rounded-xl py-3 text-2xl font-bold text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                        <button
                                            onClick={() => setTotalSlots(prev => prev + 1)}
                                            className="w-12 h-12 rounded-xl bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-xl font-bold transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Minimum {MIN_SLOTS} slot required. Includes base fee.
                                    </p>

                                    <div className="mt-4 bg-blue-900/20 border border-blue-800/50 rounded-lg p-3 flex gap-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <FaCheckCircle className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <p className="text-xs text-gray-300 leading-relaxed">
                                            <span className="font-semibold text-blue-300 block mb-1">What is an Additional Slot?</span>
                                            Each slot represents <strong>one published product</strong> on our marketplace.
                                            The base plan includes 1 slot. Add more slots to list multiple tour packages, multiple hotel locations, or transportation services location coverage simultaneously.
                                        </p>
                                    </div>
                                </div>

                                {/* Breakdown */}
                                <div className="bg-gray-900/50 rounded-xl p-4 space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Base Fee (1 Slot)</span>
                                        <span>${BASE_FEE}</span>
                                    </div>
                                    {addOnQuantity > 0 && (
                                        <div className="flex justify-between text-gray-400">
                                            <span>Add-ons ({addOnQuantity} x ${ADD_ON_FEE})</span>
                                            <span>+${addOnQuantity * ADD_ON_FEE}</span>
                                        </div>
                                    )}
                                    <div className="h-px bg-gray-700 my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-300">Future Monthly Commitment</span>
                                        <span className="text-3xl font-bold text-emerald-400">${monthlyCommitment}</span>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="terms"
                                                name="terms"
                                                type="checkbox"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900 cursor-pointer"
                                            />
                                        </div>
                                        <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer select-none">
                                            I agree to the T&Cs and authorize ArkAlliance to begin billing me the calculated monthly fee after my free trial ends.
                                        </label>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting || !termsAccepted}
                                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-lg font-bold rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <span className="animate-pulse">Processing...</span>
                                        ) : (
                                            <>
                                                Start Free Trial & Pay $0 Today
                                                <FaCheckCircle className="text-white/80" />
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-center text-xs text-gray-500">
                                    Trial period lasts 30 days. You can cancel anytime.
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
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 bg-gray-800 rounded-lg">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    )
}
