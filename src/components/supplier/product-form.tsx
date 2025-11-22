'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

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
            // Optional: Reset form or redirect
            // (e.target as HTMLFormElement).reset() 
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setLoading(false)
        }
    }

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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                        Product Title *
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
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
                    <label htmlFor="country" className="block text-sm font-medium text-gray-300">
                        Country *
                    </label>
                    <input
                        id="country"
                        name="country"
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

                {/* Photo URLs */}
                <div className="col-span-2 space-y-4">
                    <h3 className="text-sm font-medium text-gray-300">Photos (URLs)</h3>

                    <div>
                        <input
                            name="photo_url_1"
                            type="url"
                            placeholder="Photo URL 1"
                            className="block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                    <div>
                        <input
                            name="photo_url_2"
                            type="url"
                            placeholder="Photo URL 2"
                            className="block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                    <div>
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
