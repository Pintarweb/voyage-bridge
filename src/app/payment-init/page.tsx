'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'


export default function PaymentInitPage() {
    const [loading, setLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [processingPlan, setProcessingPlan] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkAccess = async () => {
            try {
                // Check 1: Active Session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError || !session) {
                    console.warn('No active session, redirecting to home.')
                    router.push('/')
                    return
                }

                const currentUserId = session.user.id
                setUserId(currentUserId)

                // Check 2: Profile Status & Role
                const { data: profile, error: profileError } = await supabase
                    .from('suppliers')
                    .select('role')
                    .eq('id', currentUserId)
                    .single()

                if (profileError || !profile) {
                    console.error('Profile check failed:', profileError)
                    // Fallback to portal or home? Portal might show empty state.
                    router.push('/portal')
                    return
                }

                // Check 3: Correct Role
                if (profile.role !== 'pending_supplier') {
                    console.warn(`User role is ${profile.role}, not pending_supplier. Redirecting.`)
                    router.push('/portal')
                    return
                }

                // Authorized
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

    const handlePlanSelect = async (priceId: string) => {
        if (!userId) return

        setProcessingPlan(priceId)
        setMessage(null)

        try {
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session')
            }

            if (data.url) {
                // Redirect to Stripe
                window.location.href = data.url
            } else {
                setMessage('Error: No checkout URL returned.')
            }
        } catch (error: any) {
            console.error('Checkout error:', error)
            setMessage(error.message || 'An unexpected error occurred.')
        } finally {
            setProcessingPlan(null)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                    <p>Verifying secure session...</p>
                </div>
            </div>
        )
    }

    if (!isAuthorized) {
        return null // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Choose Your Plan
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-400">
                        Select the subscription that fits your business needs to complete your registration.
                    </p>
                </div>

                {message && (
                    <div className="max-w-md mx-auto mb-8 bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-lg text-center">
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Standard Plan */}
                    <PricingCard
                        title="Standard"
                        price="$29"
                        features={['Basic Listing', 'Direct Messaging', 'Analytics Dashboard']}
                        priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD || 'price_standard_placeholder'}
                        loading={processingPlan === (process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD || 'price_standard_placeholder')}
                        onSelect={handlePlanSelect}
                    />

                    {/* Pro Plan */}
                    <PricingCard
                        title="Pro"
                        price="$79"
                        features={['Priority Listing', 'Advanced Analytics', 'Unlimited Products', 'Featured Badge']}
                        priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || 'price_pro_placeholder'}
                        highlighted
                        loading={processingPlan === (process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || 'price_pro_placeholder')}
                        onSelect={handlePlanSelect}
                    />

                    {/* Premium Plan */}
                    <PricingCard
                        title="Premium"
                        price="$199"
                        features={['Top Tier Placement', 'Dedicated Support', 'API Access', 'White-label Reports', 'Global Reach']}
                        priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM || 'price_premium_placeholder'}
                        loading={processingPlan === (process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM || 'price_premium_placeholder')}
                        onSelect={handlePlanSelect}
                    />
                </div>
            </div>
        </div>
    )
}

function PricingCard({
    title,
    price,
    features,
    priceId,
    highlighted = false,
    loading = false,
    onSelect
}: {
    title: string,
    price: string,
    features: string[],
    priceId: string,
    highlighted?: boolean,
    loading?: boolean,
    onSelect: (id: string) => void
}) {
    return (
        <div className={`relative flex flex-col rounded-2xl border ${highlighted
            ? 'border-orange-500 shadow-xl shadow-orange-500/20 bg-gray-800 scale-105 z-10'
            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
            } p-8 transition-all`}>
            {highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-xs font-bold text-white uppercase tracking-wide">
                    Most Popular
                </div>
            )}
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="mt-4 flex items-baseline text-white">
                <span className="text-5xl font-extrabold tracking-tight">{price}</span>
                <span className="ml-1 text-xl font-semibold text-gray-400">/month</span>
            </p>
            <ul className="mt-6 space-y-4 flex-1">
                {features.map((feature, index) => (
                    <li key={index} className="flex">
                        <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="ml-3 text-gray-300">{feature}</span>
                    </li>
                ))}
            </ul>
            <button
                onClick={() => onSelect(priceId)}
                disabled={loading}
                className={`mt-8 w-full py-3 px-6 rounded-lg font-bold text-white shadow-md transition-all ${highlighted
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {loading ? 'Processing...' : 'Choose Plan'}
            </button>
        </div>
    )
}
