'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * This component handles local development fulfillment when returning from a "successful" payment.
 * In production, Stripe Webhooks handle this. But locally, we can trigger it manually if the user lands here.
 */
export default function DevPaymentFulfillment() {
    const searchParams = useSearchParams()
    const paymentStatus = searchParams.get('payment')
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        // Only run in development and if payment was successful
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (isDev && paymentStatus === 'success' && !isProcessing) {
            fulfillPayment()
        }
    }, [paymentStatus])

    const fulfillPayment = async () => {
        try {
            setIsProcessing(true)
            console.log('[Dev Fulfillment] 💳 Payment detected in URL. Triggering local mock fulfillment...')

            // We'll call a dedicated debug endpoint or just use the existing mock logic via a server action
            // For now, let's just log and suggest using the mock dashboard for full local testing.
            // But actually, let's try to hit the webhook endpoint directly with a mock payload!

            const response = await fetch('/api/debug/mock-webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'checkout.session.completed' })
            })

            if (response.ok) {
                console.log('[Dev Fulfillment] ✅ Mock fulfillment triggered successfully.')
            }
        } catch (err) {
            console.error('[Dev Fulfillment] ❌ Failed to trigger mock fulfillment:', err)
        }
    }

    return null
}
