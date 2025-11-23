'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// Simplified lists for MVP (Duplicated from RegisterForm for now)
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

const CATEGORIES = [
    'Accommodation',
    'Tour',
    'Activity',
    'Transport',
    'Ticket/Pass',
    'Package',
]

export default function ProductForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [dragActive, setDragActive] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        // Manual validation or transformation if needed
        // e.g. ensure numbers are numbers

        try {
            const res = await fetch('/api/supplier/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.error || 'Failed to create product')
            }

            setMessage({ type: 'success', text: 'Product created successfully!' })
            // Optional: Reset form
            // (e.target as HTMLFormElement).reset() 
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setLoading(false)
        }
    }

    // Drag & Drop Handlers
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // In a real app, we would upload this file to Supabase Storage here.
            // For MVP, we'll just show an alert.
            alert('File upload is not configured in this MVP. Please use the URL fields below.')
        }
    }, [])

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 p-6 rounded-lg border border-slate-700">
            {message && (
                <div
                    className={`p-4 rounded-md text-sm ${message.type === 'success'
                            ? 'bg-green-500/10 border border-green-500 text-green-500'
                            : 'bg-red-500/10 border border-red-500 text-red-500'
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="col-span-2 md:col-span-1">
                    <label htmlFor="product_name" className="block text-sm font-medium text-gray-300">
                        Product Name *
                    </label>
                    <input
                        id="product_name"
                        name="product_name"
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

                <div className="col-span-2 md:col-span-1">
                    <label htmlFor="product_category" className="block text-sm font-medium text-gray-300">
                        Category
                    </label>
                    <select
                        id="product_category"
                        name="product_category"
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                        <option value="">Select Category</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

                <div className="col-span-2">
                    <label htmlFor="website_url" className="block text-sm font-medium text-gray-300">
                        Product Website URL
                    </label>
                    <input
                        id="website_url"
                        name="website_url"
                        type="url"
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

                {/* Location Fields */}
                <div className="col-span-2">
                    <h3 className="text-lg font-medium text-white mb-2">Location</h3>
                </div>

                <div>
                    <label htmlFor="country_code" className="block text-sm font-medium text-gray-300">
                        Country *
                    </label>
                    <select
                        id="country_code"
                        name="country_code"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                        <option value="">Select Country</option>
                        {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-300">
                        City *
                    </label>
                    <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

                <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-300">
                        Region
                    </label>
                    <input
                        id="region"
                        name="region"
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

                <div>
                    <label htmlFor="continent" className="block text-sm font-medium text-gray-300">
                        Continent
                    </label>
                    <input
                        id="continent"
                        name="continent"
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

                {/* Pricing & Validity */}
                <div className="col-span-2">
                    <h3 className="text-lg font-medium text-white mb-2">Pricing & Validity</h3>
                </div>

                <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-300">
                        Currency *
                    </label>
                    <select
                        id="currency"
                        name="currency"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                        <option value="">Select Currency</option>
                        {CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="agent_price" className="block text-sm font-medium text-gray-300">
                        Agent Price *
                    </label>
                    <input
                        id="agent_price"
                        name="agent_price"
                        type="number"
                        step="0.01"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

                <div>
                    <label htmlFor="public_price" className="block text-sm font-medium text-gray-300">
                        Public Price
                    </label>
                    <input
                        id="public_price"
                        name="public_price"
                        type="number"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 col-span-2 md:col-span-1">
                    <div>
                        <label htmlFor="validity_start_date" className="block text-sm font-medium text-gray-300">
                            Valid From
                        </label>
                        <input
                            id="validity_start_date"
                            name="validity_start_date"
                            type="date"
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="validity_end_date" className="block text-sm font-medium text-gray-300">
                            Valid Until
                        </label>
                        <input
                            id="validity_end_date"
                            name="validity_end_date"
                            type="date"
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                </div>

                {/* Photos */}
                <div className="col-span-2 space-y-4">
                    <h3 className="text-lg font-medium text-white">Photos</h3>

                    {/* Drag & Drop Zone */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-teal-500 bg-teal-500/10' : 'border-gray-600 hover:border-gray-500'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <p className="text-gray-400">
                            Drag & drop photos here, or <span className="text-teal-400 cursor-pointer">browse</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            (File upload not configured in MVP. Please use URL fields below.)
                        </p>
                        <input
                            type="file"
                            className="hidden"
                            onChange={() => alert('File upload is not configured in this MVP. Please use the URL fields below.')}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <input
                            name="photo_url_1"
                            type="url"
                            placeholder="Photo URL 1"
                            className="block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                        <input
                            name="photo_url_2"
                            type="url"
                            placeholder="Photo URL 2"
                            className="block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                        <input
                            name="photo_url_3"
                            type="url"
                            placeholder="Photo URL 3"
                            className="block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? 'Creating Product...' : 'Create Product'}
                </button>
            </div>
        </form>
    )
}
