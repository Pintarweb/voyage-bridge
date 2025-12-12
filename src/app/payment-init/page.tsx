'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { FaCheckCircle, FaGlobe, FaShieldAlt, FaChartLine } from 'react-icons/fa'

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
                    router.push('/portal')
                    return
                }

                if (profile.role !== 'pending_supplier') {
                    router.push('/portal')
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
        <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white">
            <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-6">
                        Escape Costly Intermediaries: <br className="hidden sm:block" />
                        Secure Your Global Access & 70% Off Today.
                    </h1>
                    <p className="text-xl text-gray-300 font-medium">
                        Pay $0 Today. Your Predictable Monthly Subscription Starts After 30 Days.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Benefits Section */}
                    <div className="space-y-8 lg:pr-8">
                        <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-4">
                            Why Suppliers Choose ArkAlliance
                        </h2>

                        <div className="space-y-6">
                            <BenefitItem
                                icon={<FaGlobe className="w-6 h-6 text-blue-400" />}
                                title="Direct Global Exposure"
                                description="Connect directly with buyers worldwide without the middleman markup."
                            />
                            <BenefitItem
                                icon={<FaShieldAlt className="w-6 h-6 text-emerald-400" />}
                                title="Predictable Costs"
                                description="No hidden fees or commissions. Just a flat monthly subscription based on your capacity."
                            />
                            <BenefitItem
                                icon={<FaChartLine className="w-6 h-6 text-purple-400" />}
                                title="Full Control"
                                description="Manage your inventory, pricing, and relationships on your own terms."
                            />
                        </div>

                        {/* Visual Context Placeholder */}
                        {/* Image Placement: A dashboard screenshot or network visualization would go here to reinforce the 'Global Access' value proposition. */}
                        <div className="mt-8 p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 flex items-center justify-center h-48 sm:h-64 text-gray-500">
                            <div className="text-center">
                                <p className="mb-2 text-sm uppercase tracking-wide">Dashboard Preview</p>
                                <FaChartLine className="w-12 h-12 mx-auto opacity-20" />
                            </div>
                        </div>
                    </div>

                    {/* Calculator Card */}
                    <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl relative overflow-hidden">
                        {/* Gradient Orb Effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl -mr-32 -mt-32 rounded-full pointer-events-none"></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="bg-blue-600 text-xs px-2 py-1 rounded text-white font-bold uppercase tracking-wide">Calculator</span>
                                Subscription Plan
                            </h3>

                            <div className="space-y-8">
                                {/* Input Section */}
                                <div>
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
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
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
