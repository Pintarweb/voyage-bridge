'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import TourismBackground from '@/components/ui/TourismBackground'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL
                ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
                : 'http://localhost:3000/auth/reset-password'

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            })

            if (error) {
                // Rate limit error or other API issues
                console.error(error)
                // We typically shouldn't expose specific errors for privacy, but rate limits are good to know
                if (error.status === 429) {
                    setError('Too many requests. Please try again later.')
                } else {
                    // Fallback generic error or generic success to prevent enumeration
                    setSuccess(true)
                    return
                }
            } else {
                setSuccess(true)
            }
        } catch (err) {
            console.error(err)
            setError('An unexpected error occurred.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-grow relative flex items-center justify-center px-4 py-12 min-h-screen">
            <TourismBackground />

            <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/20 p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Forgot Password</h2>
                    <p className="text-sm text-slate-500 mt-2">
                        Enter your email address to receive a password reset link.
                    </p>
                </div>

                {success ? (
                    <div className="text-center">
                        <div className="rounded-md bg-green-50 p-4 mb-6 text-green-800">
                            <p className="font-medium">Check your inbox</p>
                            <p className="mt-2 text-sm">
                                If an account exists for {email}, a password reset link has been sent.
                            </p>
                        </div>
                        <Link
                            href="/auth/agent"
                            className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div className="text-center mt-4">
                            <Link
                                href="/auth/agent"
                                className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
