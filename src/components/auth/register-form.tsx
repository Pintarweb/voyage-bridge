'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

// Simplified lists for MVP
const COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'SG', name: 'Singapore' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'CN', name: 'China' },
    { code: 'JP', name: 'Japan' },
    { code: 'TH', name: 'Thailand' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'VN', name: 'Vietnam' },
]

const CURRENCIES = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'VND', name: 'Vietnamese Dong' },
]

const SUPPLIER_TYPES = [
    'Hotel',
    'Tour Operator',
    'Transport Provider',
    'Activity Provider',
    'DMC (Destination Management Company)',
    'Other',
]

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

        // Basic Fields
        const email = (formData.get('email') as string).trim()
        const password = (formData.get('password') as string).trim()
        const companyName = (formData.get('companyName') as string).trim()
        let website = (formData.get('website') as string).trim()

        // New International Fields
        const countryCode = formData.get('countryCode') as string
        const baseCurrency = formData.get('baseCurrency') as string
        const phone = (formData.get('phone') as string).trim()
        const companyRegNo = (formData.get('companyRegNo') as string).trim()
        const supplierType = formData.get('supplierType') as string

        // Relaxed URL validation: Prepend https:// if missing
        if (website && !/^https?:\/\//i.test(website)) {
            website = `https://${website}`
        }

        console.log('Attempting signup with:', {
            email: `"${email}"`,
            website,
            companyName,
            countryCode,
            baseCurrency
        })

        try {
            // 1. Sign up the user
            // Pass all new fields in metadata for the Trigger to pick up
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        company_name: companyName,
                        website_url: website,
                        country_code: countryCode,
                        base_currency: baseCurrency,
                        phone_number: phone,
                        company_reg_no: companyRegNo,
                        supplier_type: supplierType,
                    },
                },
            })

            if (authError) throw authError
            if (!authData.user) throw new Error('Registration failed')

            console.log('Registration successful:', {
                user: authData.user.id,
                session: authData.session
            })

            if (!authData.session) {
                alert('Registration successful! Please check your email to confirm your account before logging in.')
                return
            }

            // 2. Manual Insert Fallback (Updated with new fields)
            const { error: dbError } = await supabase
                .from('suppliers')
                .insert({
                    id: authData.user.id,
                    company_name: companyName,
                    website_url: website,
                    contact_email: email,
                    country_code: countryCode,
                    base_currency: baseCurrency,
                    phone_number: phone,
                    company_reg_no: companyRegNo,
                    supplier_type: supplierType,
                })
                .select()

            if (dbError) {
                if (dbError.code === '23505') { // unique_violation
                    console.log('Profile already created by trigger.')
                } else {
                    console.error('Manual insert failed:', dbError)
                }
            } else {
                console.log('Manual insert successful.')
            }

            // 3. Redirect to payment success
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

            {/* Company Name */}
            <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-300">
                    Company Name *
                </label>
                <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                />
            </div>

            {/* Supplier Type */}
            <div>
                <label htmlFor="supplierType" className="block text-sm font-medium text-gray-300">
                    Supplier Type *
                </label>
                <select
                    id="supplierType"
                    name="supplierType"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                >
                    <option value="">Select Type</option>
                    {SUPPLIER_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Website */}
            <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-300">
                    Website URL *
                </label>
                <input
                    id="website"
                    name="website"
                    type="text"
                    required
                    placeholder="example.com"
                    className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                />
            </div>

            {/* Country & Currency Row */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="countryCode" className="block text-sm font-medium text-gray-300">
                        Country *
                    </label>
                    <select
                        id="countryCode"
                        name="countryCode"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                    >
                        <option value="">Select Country</option>
                        {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="baseCurrency" className="block text-sm font-medium text-gray-300">
                        Currency *
                    </label>
                    <select
                        id="baseCurrency"
                        name="baseCurrency"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                    >
                        <option value="">Select Currency</option>
                        {CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Phone & Reg No Row */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 234 567 890"
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="companyRegNo" className="block text-sm font-medium text-gray-300">
                        Reg. Number
                    </label>
                    <input
                        id="companyRegNo"
                        name="companyRegNo"
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                    />
                </div>
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email address *
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

            {/* Password */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password *
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
                    className="w-full btn-primary btn-md"
                >
                    {loading ? 'Registering...' : 'Register as Supplier'}
                </button>
            </div>
        </form>
    )
}
