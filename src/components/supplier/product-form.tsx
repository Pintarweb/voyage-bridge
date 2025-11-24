'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useDropzone } from 'react-dropzone'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa'
import { COUNTRY_DATA, REGIONS, CONTINENTS, REGION_TO_CONTINENT_MAP } from '@/components/auth/registration-wizard/constants'

export default function ProductForm({ onSuccess }: { onSuccess?: () => void }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        product_name: '',
        product_category: '',
        description: '',
        website_url: '',
        country_code: '',
        city: '',
        region: '',
        continent: '',
        currency: 'USD',
        agent_price: '',
        public_price: '',
        validity_start_date: new Date().toISOString().split('T')[0],
        validity_end_date: '',
        photo_url_1: '',
        photo_url_2: '',
        photo_url_3: '',
    })

    const [otherCategory, setOtherCategory] = useState('')
    const [uploadedImages, setUploadedImages] = useState<string[]>([])

    // Fetch supplier details to auto-fill country
    useEffect(() => {
        const fetchSupplierDetails = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: supplier } = await supabase
                    .from('suppliers')
                    .select('country_code')
                    .eq('id', user.id)
                    .single()

                if (supplier && supplier.country_code) {
                    setFormData(prev => ({ ...prev, country_code: supplier.country_code }))
                }
            }
        }
        fetchSupplierDetails()
    }, [supabase])

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (uploadedImages.length + acceptedFiles.length > 3) {
            alert('You can only upload a maximum of 3 images.')
            return
        }

        setLoading(true)
        const newUrls: string[] = []

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('User not authenticated')

            for (const file of acceptedFiles) {
                try {
                    const fileExt = file.name.split('.').pop()
                    const fileName = `${Math.random()}.${fileExt}`
                    const filePath = `${user.id}/${fileName}`

                    const { error: uploadError } = await supabase.storage
                        .from('product-images')
                        .upload(filePath, file)

                    if (uploadError) throw uploadError

                    const { data: { publicUrl } } = supabase.storage
                        .from('product-images')
                        .getPublicUrl(filePath)

                    newUrls.push(publicUrl)
                } catch (error) {
                    console.error('Error uploading image:', error)
                    alert('Error uploading image')
                }
            }
        } catch (error) {
            console.error('Authentication error:', error)
            alert('Authentication error. Please log in again.')
        }

        setUploadedImages((prev) => [...prev, ...newUrls])
        setLoading(false)
    }, [uploadedImages, supabase.storage, supabase.auth])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 3
    })

    const removeImage = (index: number) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        if (value === 'Other') {
            setFormData((prev) => ({ ...prev, product_category: otherCategory || 'Other' }))
        } else {
            setFormData((prev) => ({ ...prev, product_category: value }))
        }
    }

    const handleOtherCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setOtherCategory(value)
        setFormData((prev) => ({ ...prev, product_category: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase.from('products').insert({
                supplier_id: user.id,
                ...formData,
                photo_url_1: uploadedImages[0] || null,
                photo_url_2: uploadedImages[1] || null,
                photo_url_3: uploadedImages[2] || null,
                status: 'active',
            })

            if (error) throw error

            setMessage('Product created successfully!')
            // Reset form (keep country code)
            setFormData(prev => ({
                ...prev,
                product_name: '',
                product_category: '',
                description: '',
                website_url: '',
                city: '',
                region: '',
                continent: '',
                currency: 'USD',
                agent_price: '',
                public_price: '',
                validity_start_date: new Date().toISOString().split('T')[0],
                validity_end_date: '',
                photo_url_1: '',
                photo_url_2: '',
                photo_url_3: '',
            }))
            setUploadedImages([])
            setOtherCategory('')
            if (onSuccess) onSuccess()

        } catch (error: any) {
            console.error('Error creating product:', error)
            // Log detailed error if available
            if (error.details) console.error('Error details:', error.details)
            if (error.hint) console.error('Error hint:', error.hint)
            if (error.message) console.error('Error message:', error.message)

            setMessage(`Error: ${error.message || 'Unknown error occurred. Check console for details.'}`)
        } finally {
            setLoading(false)
        }
    }

    const CATEGORIES = ['Tour', 'Activity', 'Ticket', 'Transport', 'Accommodation']
    const isOtherSelected = !CATEGORIES.includes(formData.product_category) && formData.product_category !== ''

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {message && (
                <div className={`p-4 rounded-md ${message.includes('Error') ? 'bg-red-900 text-red-200' : 'bg-teal-900 text-teal-200'}`}>
                    {message}
                </div>
            )}

            {/* Card 1: Basic Details */}
            <div className="bg-white rounded-lg shadow-md p-6 text-gray-900">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Product Details</h2>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                        <input
                            type="text"
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="product_category"
                                value={CATEGORIES.includes(formData.product_category) ? formData.product_category : (isOtherSelected ? 'Other' : '')}
                                onChange={handleCategoryChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                            >
                                <option value="">Select Category</option>
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                <option value="Other">Other</option>
                            </select>
                            {/* Conditional "Other" Input */}
                            {(isOtherSelected || formData.product_category === 'Other') && (
                                <input
                                    type="text"
                                    placeholder="Please specify..."
                                    value={otherCategory}
                                    onChange={handleOtherCategoryChange}
                                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Website URL</label>
                            <input
                                type="url"
                                name="website_url"
                                value={formData.website_url}
                                onChange={handleChange}
                                placeholder="https://"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>
            </div>

            {/* Card 2: Location (Grid Layout) */}
            <div className="bg-white rounded-lg shadow-md p-6 text-gray-900">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Country *</label>
                        <select
                            name="country_code"
                            value={formData.country_code}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                        >
                            <option value="">Select Country</option>
                            {Object.entries(COUNTRY_DATA).map(([code, data]) => (
                                <option key={code} value={code}>{data.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">City *</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Region</label>
                        <select
                            name="region"
                            value={formData.region}
                            onChange={(e) => {
                                const region = e.target.value
                                const continent = REGION_TO_CONTINENT_MAP[region] || ''
                                setFormData(prev => ({ ...prev, region, continent }))
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                        >
                            <option value="">Select Region</option>
                            {REGIONS.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Continent</label>
                        <select
                            name="continent"
                            value={formData.continent}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                        >
                            <option value="">Select Continent</option>
                            {CONTINENTS.map(continent => (
                                <option key={continent} value={continent}>{continent}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Card 3: Pricing & Validity (Grid Layout) */}
            <div className="bg-white rounded-lg shadow-md p-6 text-gray-900">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Pricing & Validity</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Currency *</label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                        >
                            <option value="USD">USD</option>
                            <option value="MYR">MYR</option>
                            <option value="SGD">SGD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Agent Price</label>
                        <input
                            type="number"
                            name="agent_price"
                            value={formData.agent_price}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Suggested Retail Price</label>
                        <input
                            type="number"
                            name="public_price"
                            value={formData.public_price}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Valid From</label>
                        <input
                            type="date"
                            name="validity_start_date"
                            value={formData.validity_start_date}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Valid Until</label>
                        <input
                            type="date"
                            name="validity_end_date"
                            value={formData.validity_end_date}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>
            </div>

            {/* Card 4: Images (Full Width Dropzone) */}
            <div className="bg-white rounded-lg shadow-md p-6 text-gray-900">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Product Images</h2>

                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors w-full ${isDragActive ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-400'
                        }`}
                >
                    <input {...getInputProps()} />
                    <FaCloudUploadAlt className="mx-auto h-16 w-16 text-gray-400" />
                    <p className="mt-4 text-lg font-medium text-gray-700">
                        {isDragActive ? "Drop the files here..." : "Drag & drop images here"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">or click to select files (Max 3)</p>
                </div>

                {/* Image Previews */}
                {uploadedImages.length > 0 && (
                    <div className="mt-6 grid grid-cols-3 gap-6">
                        {uploadedImages.map((url, index) => (
                            <div key={index} className="relative group aspect-video">
                                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-md shadow-sm" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
                                >
                                    <FaTimes size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-teal-600 py-3 px-8 text-base font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Product'}
                </button>
            </div>
        </form>
    )
}
