'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PaymentPage() {
    const router = useRouter()

    useEffect(() => {
        // Simulate payment processing
        const timer = setTimeout(() => {
            router.push('/supplier/dashboard')
        }, 3000)

        return () => clearTimeout(timer)
    }, [router])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-teal-500">Payment Gateway</h1>
                <p className="text-xl text-gray-300">Processing your subscription...</p>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-4">(This is a placeholder. Redirecting to dashboard in 3s)</p>
            </div>
        </div>
    )
}
