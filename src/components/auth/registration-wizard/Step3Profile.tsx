'use client'

import { useWizard } from './WizardContext'
import { SUPPLIER_TYPES, LANGUAGES } from './constants'
import { useState } from 'react'
import { FaFacebook, FaInstagram, FaTiktok, FaLinkedin, FaTripadvisor, FaWhatsapp } from 'react-icons/fa'

export default function Step3Profile() {
    const { formData, updateFormData, setStep } = useWizard()
    const [otherType, setOtherType] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        updateFormData({ [name]: value })
    }

    const handleSupplierTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        if (value === 'Other') {
            updateFormData({ supplier_type: otherType || 'Other' })
        } else {
            updateFormData({ supplier_type: value })
        }
    }

    const handleOtherTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setOtherType(value)
        updateFormData({ supplier_type: value })
    }

    const handleLanguageToggle = (lang: string) => {
        const current = formData.languages_spoken || []
        if (current.includes(lang)) {
            updateFormData({ languages_spoken: current.filter(l => l !== lang) })
        } else {
            updateFormData({ languages_spoken: [...current, lang] })
        }
    }

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.supplier_type || !formData.website_url) {
            alert('Please fill in all required fields.')
            return
        }
        setStep(4)
    }

    return (
        <form onSubmit={handleNext} className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Business Profile</h2>

                <div>
                    <label className="block text-xs font-medium text-gray-300">Supplier Category *</label>
                    <select
                        name="supplier_type"
                        value={SUPPLIER_TYPES.includes(formData.supplier_type) ? formData.supplier_type : 'Other'}
                        onChange={handleSupplierTypeChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                        <option value="">Select Category</option>
                        {SUPPLIER_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    {(SUPPLIER_TYPES.includes(formData.supplier_type) ? formData.supplier_type === 'Other' : true) && (
                        <input
                            type="text"
                            placeholder="Please specify..."
                            value={otherType}
                            onChange={handleOtherTypeChange}
                            className="mt-2 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300">About Us (Description)</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300">Website URL *</label>
                    <input
                        type="url"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleChange}
                        required
                        placeholder="https://example.com"
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">Social Media & Contact Links</label>
                    <div className="space-y-3">
                        {/* Instagram */}
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-600 bg-gray-700 px-3 text-gray-400">
                                <FaInstagram className="h-4 w-4" />
                            </span>
                            <input
                                type="url"
                                name="social_instagram"
                                placeholder="Instagram URL"
                                value={formData.social_instagram}
                                onChange={handleChange}
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                            />
                        </div>

                        {/* Facebook */}
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-600 bg-gray-700 px-3 text-gray-400">
                                <FaFacebook className="h-4 w-4" />
                            </span>
                            <input
                                type="url"
                                name="social_facebook"
                                placeholder="Facebook URL"
                                value={formData.social_facebook}
                                onChange={handleChange}
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                            />
                        </div>

                        {/* TikTok */}
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-600 bg-gray-700 px-3 text-gray-400">
                                <FaTiktok className="h-4 w-4" />
                            </span>
                            <input
                                type="url"
                                name="social_tiktok"
                                placeholder="TikTok URL"
                                value={formData.social_tiktok}
                                onChange={handleChange}
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                            />
                        </div>

                        {/* LinkedIn */}
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-600 bg-gray-700 px-3 text-gray-400">
                                <FaLinkedin className="h-4 w-4" />
                            </span>
                            <input
                                type="url"
                                name="social_linkedin"
                                placeholder="LinkedIn URL"
                                value={formData.social_linkedin}
                                onChange={handleChange}
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                            />
                        </div>

                        {/* TripAdvisor */}
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-600 bg-gray-700 px-3 text-gray-400">
                                <FaTripadvisor className="h-4 w-4" />
                            </span>
                            <input
                                type="url"
                                name="social_tripadvisor"
                                placeholder="TripAdvisor URL"
                                value={formData.social_tripadvisor}
                                onChange={handleChange}
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                            />
                        </div>

                        {/* WhatsApp */}
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-600 bg-gray-700 px-3 text-gray-400">
                                <FaWhatsapp className="h-4 w-4" />
                            </span>
                            <input
                                type="url"
                                name="whatsapp_business_url"
                                placeholder="WhatsApp Business URL (https://wa.me/...)"
                                value={formData.whatsapp_business_url}
                                onChange={handleChange}
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">Languages Spoken</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {LANGUAGES.map((lang) => (
                            <div key={lang} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`lang-${lang}`}
                                    checked={formData.languages_spoken.includes(lang)}
                                    onChange={() => handleLanguageToggle(lang)}
                                    className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-teal-600 focus:ring-teal-500"
                                />
                                <label htmlFor={`lang-${lang}`} className="ml-2 text-xs text-gray-300">
                                    {lang}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* File Uploads - Placeholder for MVP */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-300">Logo URL</label>
                        <input
                            type="text"
                            name="logo_url"
                            value={formData.logo_url}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">Cover Image URL</label>
                        <input
                            type="text"
                            name="cover_image_url"
                            value={formData.cover_image_url}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-md border border-gray-600 px-6 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none"
                >
                    Previous
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-teal-600 px-6 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                    Next: Review & Submit
                </button>
            </div>
        </form>
    )
}
