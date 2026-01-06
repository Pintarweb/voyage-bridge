'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import TourismBackground from '@/components/ui/TourismBackground'

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [formError, setFormError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkSession = async () => {
            // The callback route should have exchanged the code and set the session cookie
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setShowForm(true)
            } else {
                // Double check if maybe onAuthStateChange picks it up (sometimes slight delay)
                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                    if (session) {
                        setShowForm(true)
                        setLoading(false)
                    }
                })

                // If still no session after a short wait, show error
                setTimeout(() => {
                    if (!showForm) setLoading(false)
                }, 2000)

                return () => subscription.unsubscribe()
            }
            setLoading(false)
        }

        checkSession()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')
        setSuccessMessage('')
        setIsSubmitting(true)

        // Client-side validation
        if (password !== confirmPassword) {
            setFormError('Passwords do not match.')
            setIsSubmitting(false)
            return
        }

        if (password.length < 6) {
            setFormError('Password must be at least 6 characters.')
            setIsSubmitting(false)
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({ password: password })

            if (error) {
                setFormError(error.message)
            } else {
                setSuccessMessage('Password updated successfully! Redirecting...')
                // Wait briefly then redirect
                setTimeout(() => {
                    router.push('/agent-portal')
                }, 2000)
            }
        } catch (err: any) {
            setFormError('An unexpected error occurred.')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex-grow relative flex items-center justify-center px-4 py-12 min-h-screen">
                <TourismBackground />
                <div className="relative z-10 text-white animate-pulse text-xl font-semibold">
                    Verifying secure link...
                </div>
            </div>
        )
    }

    if (!showForm) {
        return (
            <div className="flex-grow relative flex items-center justify-center px-4 py-12 min-h-screen">
                <TourismBackground />
                <div className="relative z-10 max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Invalid or Expired Link</h2>
                    <p className="text-gray-600 mb-6">
                        This password reset link appears to be invalid or has expired.
                    </p>
                    <button
                        onClick={() => router.push('/auth/agent')}
                        className="w-full bg-slate-800 text-white py-2 px-4 rounded hover:bg-slate-900 transition"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-grow relative flex items-center justify-center px-4 py-12 min-h-screen">
            <TourismBackground />

            <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/20 p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
                    <p className="text-sm text-slate-500 mt-2">
                        Enter your new password below.
                    </p>
                </div>

                {successMessage ? (
                    <div className="rounded-md bg-green-50 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <span className="text-green-400">✅</span>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">Success</h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>{successMessage}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {formError && (
                            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                                {formError}
                            </div>
                        )}

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                                placeholder="Min. 6 characters"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                                placeholder="Re-enter password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
