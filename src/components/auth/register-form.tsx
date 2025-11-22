'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function RegisterForm() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const companyName = formData.get('companyName') as string
        const website = formData.get('website') as string

        try {
            // 1. Sign up the user
            // We pass company_name and website_url in metadata so the database trigger can pick them up
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        company_name: companyName,
                        website_url: website,
                    },
                },
            })

            if (authError) throw authError
            if (!authData.user) throw new Error('Registration failed')

            // 2. Redirect to payment success (placeholder)
            // The 'suppliers' table entry is created automatically by a Postgres Trigger
            router.push('/supplier/payment-success')
        } catch (err: any) {
            console.error('Registration error:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-300">
                    Company Name
                </label>
                <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-300">
                    Website URL
                </label>
                <input
                    id="website"
                    name="website"
                    type="url"
                    required
                    placeholder="https://example.com"
                    className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                />
            </div>

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Registering...' : 'Register as Supplier'}
                </button>
            </div>
        </form>
    )
}
