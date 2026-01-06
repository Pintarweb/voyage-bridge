'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function PasswordResetPage() {
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false)

    // Form State
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [formError, setFormError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        let timeoutId: NodeJS.Timeout

        // Check for hash parameters immediately to know if we should expect a recovery flow
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const hasAccessToken = hashParams.get('access_token')
        const type = hashParams.get('type')
        const isRecoveryFlow = hasAccessToken && type === 'recovery'

        console.log('Mount Check:', { isRecoveryFlow, hash: window.location.hash })

        // Setup the listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth Event:', event, session?.user?.email)

            if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && isRecoveryFlow)) {
                // Success!
                if (timeoutId) clearTimeout(timeoutId)

                // If there's a session, we're good
                if (session) {
                    console.log('Session established via event:', event)
                    setShowForm(true)
                    setLoading(false)
                    setAlreadyLoggedIn(false)
                }
            }
        })

        // Logic to handle initial state
        const checkSession = async () => {
            if (isRecoveryFlow) {
                // Manually attempt to set the session using the tokens from the URL
                if (hasAccessToken) {
                    console.log('Attempting manual session establishment with token')
                    const { error } = await supabase.auth.setSession({
                        access_token: hasAccessToken,
                        refresh_token: hashParams.get('refresh_token') || '',
                    })

                    if (error) {
                        console.error('Manual session establishment failed:', error)
                    } else {
                        console.log('Manual session establishment successful')
                        const { data: { session } } = await supabase.auth.getSession()
                        if (session) {
                            setShowForm(true)
                            setLoading(false)
                            return
                        }
                    }
                }

                // Set a safety timeout to stop the loading spinner eventually
                timeoutId = setTimeout(async () => {
                    console.warn('Recovery timeout reached - checking session one last time')
                    const { data: { session } } = await supabase.auth.getSession()
                    if (session) {
                        setShowForm(true)
                        setLoading(false)
                    } else {
                        console.error('Failed to establish recovery session after timeout')
                        setLoading(false)
                        setShowForm(false)
                    }
                }, 4000) // 4 seconds wait time

            } else {
                // Not a recovery flow - check normal session
                const { data: { session } } = await supabase.auth.getSession()
                if (session) {
                    setLoading(false)
                    setAlreadyLoggedIn(true)
                } else {
                    setLoading(false)
                    setShowForm(false)
                }
            }
        }

        checkSession()

        return () => {
            if (timeoutId) clearTimeout(timeoutId)
            subscription.unsubscribe()
        }
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
                setSuccessMessage('Password successfully set! Redirecting to dashboard...')
                // Wait briefly then redirect
                setTimeout(() => {
                    router.push('/agent-portal') // Agent dashboard
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
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-gray-600 animate-pulse">Verifying reset link...</div>
            </div>
        )
    }

    if (alreadyLoggedIn && !showForm) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Already Logged In</h2>
                    <p className="text-gray-600 mb-6">
                        You are already signed into an active session. If you need to reset your password, please use the settings page or logout and request a new link.
                    </p>
                    <button
                        onClick={() => router.push('/agent-portal')}
                        className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    if (!showForm) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Invalid or Expired Link</h2>
                    <p className="text-gray-600 mb-6">
                        This password reset link appears to be invalid or has expired.
                    </p>
                    <button
                        onClick={() => router.push('/auth/agent')}
                        className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Set New Password</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Please secure your account with a new password.
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm text-black"
                                placeholder="Min. 6 characters"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm text-black"
                                placeholder="Re-enter password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Setting Password...' : 'Set Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
