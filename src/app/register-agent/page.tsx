'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import PhoneInput, { Country } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import CountrySelect from '@/components/ui/CountrySelect'
import './agent-registration.css'

const CITY_TO_COUNTRY: Record<string, string> = {
    // North America
    'new york': 'US', 'los angeles': 'US', 'chicago': 'US', 'houston': 'US', 'miami': 'US', 'san francisco': 'US',
    'toronto': 'CA', 'vancouver': 'CA', 'montreal': 'CA', 'mexico city': 'MX',
    // Europe
    'london': 'GB', 'manchester': 'GB', 'birmingham': 'GB',
    'paris': 'FR', 'lyon': 'FR', 'marseille': 'FR',
    'berlin': 'DE', 'munich': 'DE', 'hamburg': 'DE', 'frankfurt': 'DE',
    'rome': 'IT', 'milan': 'IT', 'naples': 'IT',
    'madrid': 'ES', 'barcelona': 'ES',
    'amsterdam': 'NL', 'rotterdam': 'NL',
    'brussels': 'BE', 'vienna': 'AT', 'zurich': 'CH', 'geneva': 'CH',
    'dublin': 'IE', 'lisbon': 'PT', 'athens': 'GR', 'stockholm': 'SE', 'oslo': 'NO', 'copenhagen': 'DK', 'helsinki': 'FI',
    'warsaw': 'PL', 'prague': 'CZ', 'budapest': 'HU', 'istanbul': 'TR', 'moscow': 'RU',
    // Asia
    'dubai': 'AE', 'abu dhabi': 'AE',
    'singapore': 'SG',
    'tokyo': 'JP', 'osaka': 'JP',
    'seoul': 'KR',
    'beijing': 'CN', 'shanghai': 'CN', 'hong kong': 'HK',
    'mumbai': 'IN', 'delhi': 'IN', 'bangalore': 'IN',
    'bangkok': 'TH', 'jakarta': 'ID', 'kuala lumpur': 'MY', 'manila': 'PH', 'ho chi minh city': 'VN',
    // Oceania
    'sydney': 'AU', 'melbourne': 'AU', 'brisbane': 'AU', 'perth': 'AU',
    'auckland': 'NZ',
    // South America
    'sao paulo': 'BR', 'rio de janeiro': 'BR',
    'buenos aires': 'AR', 'santiago': 'CL', 'bogota': 'CO', 'lima': 'PE',
    // Africa
    'cairo': 'EG', 'johannesburg': 'ZA', 'cape town': 'ZA', 'lagos': 'NG', 'nairobi': 'KE'
}

export default function AgentRegistration() {
    const [formData, setFormData] = useState({
        email: '',
        agency_name: '',
        license_number: '',
        website_url: '',
        city: '',
        country_code: '',
        address: '',
        phone_number: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()

    // Auto-suggest country based on city
    useEffect(() => {
        if (formData.city) {
            const cityLower = formData.city.toLowerCase().trim()
            const suggestedCountry = CITY_TO_COUNTRY[cityLower]
            if (suggestedCountry && formData.country_code !== suggestedCountry) {
                setFormData(prev => ({ ...prev, country_code: suggestedCountry }))
            }
        }
    }, [formData.city, formData.country_code])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleCountryChange = (value: string) => {
        setFormData(prev => ({ ...prev, country_code: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // 1. Sign Up - Passwordless (Email Only)
            // Metadata is still passed to trigger the handle_new_user function
            const metadataToSend = {
                role: 'pending_agent', // Explicitly setting role
                agency_name: formData.agency_name,
                license_number: formData.license_number,
                website_url: formData.website_url,
                city: formData.city,
                country_code: formData.country_code,
                address: formData.address,
                phone_number: formData.phone_number
            }

            console.log('=== AGENT REGISTRATION DEBUG ===')
            console.log('Form Data:', formData)
            console.log('Metadata being sent:', metadataToSend)

            // Supabase Passwordless Sign Up / Sign In (Magic Link)
            // We use signInWithOtp which handles creating the user if they don't exist
            // and sending the magic link.
            const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
                email: formData.email,
                options: {
                    data: metadataToSend, // This metadata is only applied if the user is created (new signup)
                    emailRedirectTo: `${window.location.origin}/approval-pending`,
                    shouldCreateUser: true
                }
            })

            console.log('SignInWithOtp response:', { authData, authError })

            if (authError) throw authError
            // Note: authData.user is usually null for OTP/MagicLink until they click the link, 
            // but the process was successful if no error.

            // 2. Redirect immediately to approval pending
            router.push('/approval-pending')

        } catch (err: any) {
            console.error('Registration error:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl border border-gray-800">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Agent Registration
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Join our exclusive network of travel professionals.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <div className="space-y-4">
                        {/* Auth Fields */}
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Email address"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            onChange={handleChange}
                        />
                        {/* Password field removed */}

                        {/* Agency Details */}
                        <input
                            type="text"
                            name="agency_name"
                            required
                            placeholder="Agency Name"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="license_number"
                            required
                            placeholder="License Number (Required)"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            onChange={handleChange}
                        />
                        <input
                            type="url"
                            name="website_url"
                            placeholder="Website URL"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            onChange={handleChange}
                        />

                        {/* Location */}
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="city"
                                required
                                placeholder="City"
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                onChange={handleChange}
                            />
                            <CountrySelect
                                value={formData.country_code}
                                onChange={handleCountryChange}
                            />
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2">
                            <PhoneInput
                                key={formData.country_code}
                                placeholder="Enter phone number"
                                value={formData.phone_number}
                                onChange={(value) => setFormData({ ...formData, phone_number: value as string })}
                                defaultCountry={formData.country_code as Country}
                                className="bg-transparent phone-input-dark"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Register Agency'}
                    </button>
                </form>
            </div>
        </div>
    )
}
