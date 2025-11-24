'use client'

import { useWizard } from './WizardContext'
import { COUNTRY_DATA } from './constants'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useState } from 'react'

export default function Step2Legal() {
    const { formData, updateFormData, setStep } = useWizard()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        updateFormData({ [name]: value })
    }

    const handlePhoneChange = (value: string | undefined) => {
        updateFormData({ phone_number: value || '' })
    }

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.company_reg_no || !formData.contact_email || !formData.phone_number) {
            alert('Please fill in all required fields.')
            return
        }

        if (formData.phone_number && !isValidPhoneNumber(formData.phone_number)) {
            alert('Please enter a valid phone number for the selected country.')
            return
        }

        setStep(3)
    }

    const countryName = formData.country_code ? COUNTRY_DATA[formData.country_code]?.name : 'Unknown'

    return (
        <form onSubmit={handleNext} className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Legal & Verification</h2>

                <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                    <p className="text-xs text-gray-400">Registration Country:</p>
                    <p className="text-base font-medium text-white">{countryName} ({formData.country_code})</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-300">Registration Number (SSM/Biz Reg) *</label>
                        <input
                            type="text"
                            name="company_reg_no"
                            value={formData.company_reg_no}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">License Number (e.g. MOTAC)</label>
                        <input
                            type="text"
                            name="license_no"
                            value={formData.license_no}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300">Tax ID / VAT Number</label>
                    <input
                        type="text"
                        name="tax_id"
                        value={formData.tax_id}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-300">Official Email (Correspondence) *</label>
                        <input
                            type="email"
                            name="contact_email"
                            value={formData.contact_email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">Support Phone (Hotline) *</label>
                        <div className="mt-1 text-black phone-input-container">
                            <PhoneInput
                                international
                                defaultCountry={formData.country_code as any}
                                value={formData.phone_number}
                                onChange={handlePhoneChange}
                                className="flex h-9 w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                                numberInputProps={{
                                    className: "bg-transparent border-none text-white focus:ring-0 text-xs w-full ml-2 placeholder-gray-500"
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-md border border-gray-600 px-6 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none"
                >
                    Previous
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-teal-600 px-6 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                    Next: Business Profile
                </button>
            </div>

            <style jsx global>{`
        .PhoneInputCountry {
            margin-right: 0.5rem;
        }
        .PhoneInputCountrySelect {
            background-color: #1f2937;
            color: white;
        }
        .PhoneInputInput {
            background-color: transparent;
            color: white;
            border: none;
        }
        .PhoneInputInput:focus {
            outline: none;
        }
      `}</style>
        </form>
    )
}
