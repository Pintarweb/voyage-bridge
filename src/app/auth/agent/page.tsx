'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import PhoneInput, { Country } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import CountrySelect from '@/components/ui/CountrySelect'
import { FaInfoCircle, FaCheckCircle } from 'react-icons/fa'
import './auth.css'

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

export default function AgentAuthPage() {
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(
        searchParams.get('tab') === 'register' ? 'register' : 'login'
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()

    // Login State
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    // Register State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        agency_name: '',
        license_number: '',
        website_url: '',
        city: '',
        country_code: '',
        address: '',
        phone_number: '',
        has_agreed_tc: false
    })

    // Auto-suggest country & Prefetch Portal
    useEffect(() => {
        router.prefetch('/portal')

        if (formData.city) {
            const cityLower = formData.city.toLowerCase().trim()
            const suggestedCountry = CITY_TO_COUNTRY[cityLower]
            if (suggestedCountry && formData.country_code !== suggestedCountry) {
                setFormData(prev => ({ ...prev, country_code: suggestedCountry }))
            }
        }
    }, [formData.city, formData.country_code, router])

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setFormData({ ...formData, [e.target.name]: value })
    }

    const handleCountryChange = (value: string) => {
        setFormData(prev => ({ ...prev, country_code: value }))
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword
            })
            if (error) throw error
            router.push('/portal')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.has_agreed_tc) {
            setError('You must agree to the Terms & Conditions.')
            return
        }
        setLoading(true)
        setError('')

        try {
            // 1. Sign Up
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: { role: 'agent' }
                }
            })

            if (authError) throw authError
            if (!authData.user) throw new Error('Registration failed')

            // 2. Create Profile
            const { error: profileError } = await supabase
                .from('agent_profiles')
                .insert({
                    id: authData.user.id,
                    agency_name: formData.agency_name,
                    license_number: formData.license_number,
                    website_url: formData.website_url,
                    city: formData.city,
                    country_code: formData.country_code,
                    address: formData.address,
                    phone_number: formData.phone_number,
                    verification_status: 'pending',
                    has_agreed_tc: formData.has_agreed_tc,
                    email: formData.email
                })

            if (profileError) throw profileError

            router.push('/approval-pending')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Agent Portal</h2>
                    <p className="text-sm text-gray-500 mt-1">Access exclusive inventory</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'login' ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => {
                            setActiveTab('login')
                            setError('')
                        }}
                    >
                        Login
                    </button>
                    <button
                        className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'register' ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => {
                            setActiveTab('register')
                            setError('')
                        }}
                    >
                        Register
                    </button>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {activeTab === 'login' ? (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-4">
                            {/* Trust Statement */}
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start space-x-3 mb-4">
                                <FaCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-blue-800">
                                    <strong>Secure Network.</strong> Your license is used for verification purposes only.
                                </p>
                            </div>

                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Email address"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                onChange={handleRegisterChange}
                            />
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="Password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                onChange={handleRegisterChange}
                            />
                            <input
                                type="text"
                                name="agency_name"
                                required
                                placeholder="Agency Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                onChange={handleRegisterChange}
                            />

                            {/* License with Tooltip */}
                            <div className="relative">
                                <input
                                    type="text"
                                    name="license_number"
                                    required
                                    placeholder="License Number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400 pr-10"
                                    onChange={handleRegisterChange}
                                />
                                <div className="absolute right-3 top-2.5 text-gray-400 cursor-help tooltip-container">
                                    <FaInfoCircle />
                                    <span className="tooltip-text">Accepted: IATA, MOTAC, or Local Government License</span>
                                </div>
                            </div>

                            <input
                                type="url"
                                name="website_url"
                                placeholder="Website URL"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                onChange={handleRegisterChange}
                            />

                            <input
                                type="text"
                                name="address"
                                required
                                placeholder="Address"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                onChange={handleRegisterChange}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    placeholder="City"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                    onChange={handleRegisterChange}
                                />
                                <CountrySelect
                                    value={formData.country_code}
                                    onChange={handleCountryChange}
                                    className="text-gray-900"
                                    theme="light"
                                />
                            </div>

                            <div className="border border-gray-300 rounded-lg px-3 py-2">
                                <PhoneInput
                                    key={formData.country_code}
                                    placeholder="Enter phone number"
                                    value={formData.phone_number}
                                    onChange={(value) => setFormData({ ...formData, phone_number: value as string })}
                                    defaultCountry={formData.country_code as Country}
                                    className="bg-transparent phone-input-light"
                                />
                            </div>

                            {/* T&C Checkbox */}
                            <div className="flex items-center mt-4">
                                <input
                                    id="tc-agree"
                                    name="has_agreed_tc"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                    onChange={handleRegisterChange}
                                />
                                <label htmlFor="tc-agree" className="ml-2 block text-sm text-gray-700">
                                    I agree to the <a href="#" className="text-teal-600 hover:underline">Terms & Conditions</a>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 mt-4"
                            >
                                {loading ? 'Creating Account...' : 'Register Agency'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
