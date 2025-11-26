'use client'

import { useState, useEffect } from 'react'
import { useWizard } from './WizardContext'
import { COUNTRY_DATA, CURRENCIES } from './constants'
import TimezoneSelect, { ITimezone } from 'react-timezone-select'
import CountrySelect from '@/components/ui/CountrySelect'
import CurrencySelect from '@/components/ui/CurrencySelect'

export default function Step1Identity() {
    const { formData, updateFormData, setStep } = useWizard()
    const [mounted, setMounted] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        setMounted(true)
    }, [])

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.email) newErrors.email = 'Email is required'
        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }
        if (!formData.company_name) newErrors.company_name = 'Company Name is required'
        if (!formData.country_code) newErrors.country_code = 'Country is required'
        if (!formData.base_currency) newErrors.base_currency = 'Currency is required'
        if (!formData.address_line_1) newErrors.address_line_1 = 'Address is required'
        if (!formData.city) newErrors.city = 'City is required'
        if (!formData.postcode) newErrors.postcode = 'Postcode is required'
        if (!formData.timezone) newErrors.timezone = 'Timezone is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        updateFormData({ [name]: value })

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleCountryChange = (value: string) => {
        const country = COUNTRY_DATA[value]
        if (country) {
            updateFormData({
                country_code: value,
                base_currency: country.currency,
                timezone: country.timezone
            })
            // Clear related errors
            setErrors(prev => ({
                ...prev,
                country_code: '',
                base_currency: '',
                timezone: ''
            }))
        } else {
            // Fallback if country data not found (e.g. searching all countries)
            updateFormData({ country_code: value })
            if (errors.country_code) setErrors(prev => ({ ...prev, country_code: '' }))
        }
    }

    const handleCurrencyChange = (value: string) => {
        updateFormData({ base_currency: value })
        if (errors.base_currency) {
            setErrors(prev => ({ ...prev, base_currency: '' }))
        }
    }

    const handleTimezoneChange = (tz: ITimezone) => {
        const val = typeof tz === 'string' ? tz : tz.value
        updateFormData({ timezone: val })
        if (errors.timezone) {
            setErrors(prev => ({ ...prev, timezone: '' }))
        }
    }

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        if (validate()) {
            setStep(2)
        }
    }

    return (
        <form onSubmit={handleNext} className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Identity & Location</h2>

                {/* Auth Fields */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-300">Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                            className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">Password *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            className={`mt-1 block w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-300">Company Legal Name *</label>
                        <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full rounded-md border ${errors.company_name ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                        />
                        {errors.company_name && <p className="mt-1 text-xs text-red-500">{errors.company_name}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">Trading Name (Optional)</label>
                        <input
                            type="text"
                            name="trading_name"
                            value={formData.trading_name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-300">Country *</label>
                        <CountrySelect
                            value={formData.country_code}
                            onChange={handleCountryChange}
                            theme="dark"
                            className={errors.country_code ? 'border-red-500' : ''}
                        />
                        {errors.country_code && <p className="mt-1 text-xs text-red-500">{errors.country_code}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">Base Currency *</label>
                        <CurrencySelect
                            value={formData.base_currency}
                            onChange={handleCurrencyChange}
                            currencies={CURRENCIES}
                            theme="dark"
                            className={errors.base_currency ? 'border-red-500' : ''}
                        />
                        {errors.base_currency && <p className="mt-1 text-xs text-red-500">{errors.base_currency}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300">Address Line 1 *</label>
                    <input
                        type="text"
                        name="address_line_1"
                        value={formData.address_line_1}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full rounded-md border ${errors.address_line_1 ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                    />
                    {errors.address_line_1 && <p className="mt-1 text-xs text-red-500">{errors.address_line_1}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-300">City *</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full rounded-md border ${errors.city ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                        />
                        {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">Postcode *</label>
                        <input
                            type="text"
                            name="postcode"
                            value={formData.postcode}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full rounded-md border ${errors.postcode ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                        />
                        {errors.postcode && <p className="mt-1 text-xs text-red-500">{errors.postcode}</p>}
                    </div>
                </div>

                {/* Timezone moved to its own spacious row */}
                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Timezone *</label>
                    <div className="text-black text-xs">
                        {mounted && (
                            <TimezoneSelect
                                value={formData.timezone}
                                onChange={handleTimezoneChange}
                                className="text-xs"
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        backgroundColor: '#1f2937', // gray-800
                                        borderColor: errors.timezone ? '#ef4444' : '#4b5563', // red-500 or gray-600
                                        color: 'white',
                                        minHeight: '38px',
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        color: 'white',
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        backgroundColor: '#1f2937',
                                        color: 'white',
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isFocused ? '#374151' : '#1f2937',
                                        color: 'white',
                                    }),
                                    input: (provided) => ({
                                        ...provided,
                                        color: 'white',
                                    }),
                                }}
                            />
                        )}
                    </div>
                    {errors.timezone && <p className="mt-1 text-xs text-red-500">{errors.timezone}</p>}
                </div>

            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="rounded-md bg-teal-600 px-6 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                    Next: Legal & Verification
                </button>
            </div>
        </form>
    )
}
