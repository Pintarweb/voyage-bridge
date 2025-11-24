'use client'

import { useWizard } from './WizardContext'
import { COUNTRY_DATA, CURRENCIES } from './constants'
import TimezoneSelect, { ITimezone } from 'react-timezone-select'

export default function Step1Identity() {
    const { formData, updateFormData, setStep } = useWizard()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        updateFormData({ [name]: value })

        // Country -> Currency & Timezone Logic
        if (name === 'country_code') {
            const country = COUNTRY_DATA[value]
            if (country) {
                updateFormData({
                    country_code: value,
                    base_currency: country.currency,
                    timezone: country.timezone
                })
            }
        }
    }

    const handleTimezoneChange = (tz: ITimezone) => {
        if (typeof tz === 'string') {
            updateFormData({ timezone: tz })
        } else {
            updateFormData({ timezone: tz.value })
        }
    }

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.company_name || !formData.country_code || !formData.base_currency || !formData.email || !formData.password || !formData.address_line_1 || !formData.city || !formData.postcode || !formData.timezone) {
            alert('Please fill in all required fields.')
            return
        }
        setStep(2)
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
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
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
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
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
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
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
                        <select
                            name="country_code"
                            value={formData.country_code}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                            <option value="">Select Country</option>
                            {Object.entries(COUNTRY_DATA).map(([code, data]) => (
                                <option key={code} value={code}>{data.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">Base Currency *</label>
                        <select
                            name="base_currency"
                            value={formData.base_currency}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                            <option value="">Select Currency</option>
                            {CURRENCIES.map((c) => (
                                <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                            ))}
                        </select>
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
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
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
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">Postcode *</label>
                        <input
                            type="text"
                            name="postcode"
                            value={formData.postcode}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                </div>

                {/* Timezone moved to its own spacious row */}
                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Timezone *</label>
                    <div className="text-black text-xs">
                        <TimezoneSelect
                            value={formData.timezone}
                            onChange={handleTimezoneChange}
                            className="text-xs"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#1f2937', // gray-800
                                    borderColor: '#4b5563', // gray-600
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
                    </div>
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
