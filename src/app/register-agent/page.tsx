'use client'
// Force Refreshed: 2026-01-14T10:15:00

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PhoneInput, { Country } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import CountrySelect from '@/components/ui/CountrySelect'
import './agent-registration.css'
import { registerAgent } from '@/app/actions/register-agent'
import { FaCheck, FaLock, FaArrowRight, FaInfoCircle, FaUser, FaBuilding } from 'react-icons/fa'

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
        first_name: '',
        last_name: '',
        email: '',
        agency_name: '',
        license_number: '',
        website_url: '',
        city: '',
        country_code: '',
        address: 'N/A', // Defaulting as specific address field wasn't requested in prompt, but needed for backend types maybe? keeping it hidden or just merging
        phone_number: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    // Ticker number
    const [queueCount] = useState(142)

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

        const maxRetries = 3
        let attempt = 0
        let success = false

        while (attempt < maxRetries && !success) {
            try {
                attempt++

                // 1. Sign Up - Silent Registration (Via Server Action)
                const result = await registerAgent({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    agency_name: formData.agency_name,
                    license_number: formData.license_number,
                    website_url: formData.website_url,
                    city: formData.city,
                    country_code: formData.country_code,
                    address: formData.address,
                    phone_number: formData.phone_number
                })

                if (!result.success) {
                    if (result.error === 'Failed to fetch') throw new TypeError('Failed to fetch')
                    throw new Error(result.error)
                }

                success = true
                router.push('/approval-pending')

            } catch (err: any) {
                const isNetworkError = err instanceof TypeError && err.message === 'Failed to fetch'

                if (isNetworkError && attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    continue
                }

                if (attempt === maxRetries || !isNetworkError) {
                    let msg = err.message
                    if (isNetworkError) msg = 'Network error: Failed to reach server. Please try again.'
                    setError(msg)
                }
            } finally {
                if (attempt === maxRetries || success) {
                    setLoading(false)
                }
            }
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 font-sans overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-blue-950/40 z-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-black/30 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop"
                    alt="Luxury Background"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative z-20 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start py-8">

                {/* Left Column: Perks & Info */}
                <div className="text-white space-y-8 animate-in slide-in-from-left-8 duration-700 lg:sticky lg:top-24">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 backdrop-blur-md text-amber-300 text-sm font-semibold tracking-wide">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            Phase 1 Application
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-2xl">
                            Step 1: Secure Your Founding Agency Spot.
                        </h1>
                        <p className="text-xl text-blue-100 font-light max-w-xl leading-relaxed">
                            Join the ArkAlliance network today to lock in your early bird advantages.
                        </p>
                    </div>

                    {/* Perks List */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-white mb-2">Early Bird Perks</h3>
                        <ul className="space-y-3">
                            {[
                                'Free access to all exclusive offers',
                                'Beta Access to the Airline Module',
                                'Priority Support Response',
                                'Founding Member Badge & Status'
                            ].map((perk, i) => (
                                <li key={i} className="flex items-center gap-3 text-blue-100">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                                        <FaCheck className="text-xs" />
                                    </div>
                                    {perk}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Registration Form */}
                <div className="w-full max-w-xl mx-auto animate-in slide-in-from-right-8 duration-700 delay-200">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden relative">
                        {/* Glow Effect */}
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rotate-45 pointer-events-none" />

                        <div className="p-8 relative z-10">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white">Application Form</h2>
                                <p className="text-blue-200 text-sm">Fill in your details to reserve your spot.</p>
                            </div>

                            {error && (
                                <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-sm backdrop-blur-sm flex items-center gap-2">
                                    <FaInfoCircle /> {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Section 1: Personal Details */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider pb-2 border-b border-white/10">
                                        <FaUser /> Section 1: Personal Details
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium !text-white mb-1">First Name</label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                required
                                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-white/30 transition-all"
                                                placeholder="Jane"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium !text-white mb-1">Last Name</label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                required
                                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-white/30 transition-all"
                                                placeholder="doe"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium !text-white mb-1">Professional Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-white/30 transition-all"
                                                placeholder="name@agency.com"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium !text-white mb-1">Direct Phone</label>
                                            <div className="bg-black/20 border border-white/10 rounded-xl px-2 py-1 focus-within:ring-2 focus-within:ring-amber-500">
                                                <PhoneInput
                                                    placeholder="Enter phone number"
                                                    value={formData.phone_number}
                                                    onChange={(value) => setFormData({ ...formData, phone_number: value as string })}
                                                    defaultCountry={formData.country_code as Country}
                                                    className="bg-transparent phone-input-dark custom-phone-input"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Agency Details */}
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider pb-2 border-b border-white/10">
                                        <FaBuilding /> Section 2: Agency Details
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium !text-white mb-1">Agency Name</label>
                                            <input
                                                type="text"
                                                name="agency_name"
                                                required
                                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-white/30 transition-all"
                                                placeholder="Travel Agency Ltd."
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium !text-white mb-1">IATA/Registration Number <span className="text-white/40 font-normal">(Optional)</span></label>
                                            <input
                                                type="text"
                                                name="license_number"
                                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-white/30 transition-all"
                                                placeholder="e.g. 12345678"
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* City & Country */}
                                        <div>
                                            <label className="block text-xs font-medium !text-white mb-1">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-white/30 transition-all"
                                                placeholder="City"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium !text-white mb-1">Country</label>
                                            <div className="country-select-wrapper-dark">
                                                <CountrySelect
                                                    value={formData.country_code}
                                                    onChange={handleCountryChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 hidden">
                                            {/* Hidden required field filler */}
                                            <input type="text" name="address" value="N/A" readOnly />
                                        </div>
                                    </div>
                                </div>

                                {/* Scarcity Ticker */}
                                <div className="text-center py-2">
                                    <p className="text-xs text-amber-400 font-bold bg-amber-950/40 border border-amber-500/20 px-4 py-2 rounded-lg inline-flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                        Current Queue: {queueCount} agencies pending review. Spots allocated first-come, first-served.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-amber-900/20 transition-all transform hover:-translate-y-0.5"
                                >
                                    {loading ? 'Securing Spot...' : 'Secure My Founding Access'}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                <Link
                                    href="/auth/agent"
                                    className="text-sm text-blue-200 hover:text-white transition-colors"
                                >
                                    Already have an account? <span className="text-amber-400 font-medium">Sign In</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-blue-300/60 text-xs mt-6 flex items-center justify-center gap-2">
                        <FaLock /> Secured & Encrypted Registration
                    </p>
                </div>
            </div>

            <style jsx global>{`
                .phone-input-dark input {
                    background: transparent !important;
                    color: white !important;
                    border: none !important;
                }
                .phone-input-dark .PhoneInputCountrySelect {
                    background: #1e293b;
                    color: white;
                }
                 .country-select-wrapper-dark select {
                    background-color: rgba(0,0,0,0.2) !important;
                    color: white !important;
                    border-color: rgba(255,255,255,0.1) !important;
                    border-radius: 0.75rem !important;
                    padding: 0.75rem 1rem !important;
                    width: 100%;
                }
            `}</style>
        </div>
    )
}
