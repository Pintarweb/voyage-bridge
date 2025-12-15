'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaCloudUploadAlt, FaTimes, FaCheckCircle, FaBuilding, FaPhone, FaEnvelope, FaUser, FaInfoCircle, FaCar, FaMapMarkedAlt, FaSuitcase, FaMoneyBillWave, FaListUl } from 'react-icons/fa'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

// Service Types
const SERVICE_TYPES = [
    'Car Rental', 'Private Transfer', 'Shuttle Service', 'Coach/Bus Rental', 'Taxi', 'Chauffeur Service', 'Yacht Charter', 'Helicopter Transfer'
]

// Vehicle Types
const VEHICLE_TYPES = [
    'Sedan', 'SUV', 'Luxury Sedan', 'Minivan', 'Van', 'Minibus', 'Coach', 'Limousine', 'Hatchback', 'Convertible', 'Motorcycle', 'Scooter'
]

// Price Models
const PRICE_MODELS = [
    'Per hour', 'Per day', 'Per journey/route', 'Per km', 'Fixed Price'
]

interface TransportProductFormProps {
    supplier: any
    productId?: string
    onSuccess?: () => void
}

interface VehicleConfig {
    type: string
    max_passengers: number | string
    luggage_capacity: number | string
}

export default function TransportProductForm({ supplier, productId, onSuccess }: TransportProductFormProps) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])

    // Form State
    const [formData, setFormData] = useState({
        // 1. Identification
        product_name: '',
        product_url: supplier?.website_url || '',
        service_type: '',
        country: supplier?.country_code || '',
        city: supplier?.city || '',
        coverage_area: '',

        // 2. Contact
        contact_name: supplier?.name || supplier?.company_name || '',
        contact_phone: supplier?.phone_number || '',
        contact_email: supplier?.contact_email || '',

        // 3. Details & Pricing
        description: '',
        vehicle_config: [] as VehicleConfig[],
        price_model: '',
        base_price: '' as string | number,
        currency: 'USD',
        inclusions: '',

        // 4. Visuals
        special_offer: '',
    })

    // Helper for vehicle config management
    const handleAddVehicle = () => {
        setFormData(prev => ({
            ...prev,
            vehicle_config: [...prev.vehicle_config, { type: '', max_passengers: '', luggage_capacity: '' }]
        }))
    }

    const handleRemoveVehicle = (index: number) => {
        setFormData(prev => ({
            ...prev,
            vehicle_config: prev.vehicle_config.filter((_, i) => i !== index)
        }))
    }

    const handleVehicleChange = (index: number, field: keyof VehicleConfig, value: any) => {
        setFormData(prev => {
            const newConfig = [...prev.vehicle_config]
            newConfig[index] = { ...newConfig[index], [field]: value }
            return { ...prev, vehicle_config: newConfig }
        })
    }

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Image Upload Logic
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (files.length + acceptedFiles.length > 5) {
            alert('Max 5 images allowed')
            return
        }
        const newFiles = [...files, ...acceptedFiles]
        setFiles(newFiles)
        const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file))
        setPreviews(prev => [...prev, ...newPreviews])
    }, [files])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxSize: 5242880,
    })

    const removeFile = (index: number) => {
        const newFiles = [...files]
        newFiles.splice(index, 1)
        setFiles(newFiles)

        const newPreviews = [...previews]
        if (newPreviews[index].startsWith('blob:')) URL.revokeObjectURL(newPreviews[index])
        newPreviews.splice(index, 1)
        setPreviews(newPreviews)
    }

    const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'active') => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // Upload Images
            const imageUrls: string[] = []
            for (const file of files) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${user.id}/${fileName}`
                const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file)
                if (uploadError) throw uploadError
                const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath)
                imageUrls.push(publicUrl)
            }

            const finalImages = [...imageUrls]

            // Clean up vehicle config for submission (ensure numbers are numbers or null if empty)
            const cleanVehicleConfig = formData.vehicle_config.map(v => ({
                type: v.type,
                max_passengers: v.max_passengers === '' ? null : Number(v.max_passengers),
                luggage_capacity: v.luggage_capacity === '' ? null : Number(v.luggage_capacity)
            })).filter(v => v.type) // Filter out empty types if any

            const dataToSubmit = {
                supplier_id: user.id,
                product_name: formData.product_name,
                product_url: formData.product_url,
                service_type: formData.service_type,
                country_code: formData.country,
                city: formData.city,
                coverage_area: formData.coverage_area,

                contact_name: formData.contact_name,
                contact_phone: formData.contact_phone,
                contact_email: formData.contact_email,

                product_description: formData.description,
                vehicle_config: cleanVehicleConfig,
                price_model: formData.price_model,
                base_price: formData.base_price === '' ? null : formData.base_price,
                currency: formData.currency,
                inclusions: formData.inclusions,

                special_offer: formData.special_offer,
                photo_urls: finalImages,

                product_category: 'Transportation',
                status: status
            }

            const { error } = await supabase.from('products').insert(dataToSubmit)
            if (error) throw error

            if (onSuccess) onSuccess()
            else router.push('/supplier/dashboard')

        } catch (error: any) {
            console.error('Form Submission Error:', error);
            alert('Failed to save product: ' + (error.message || JSON.stringify(error)));
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* 1. Identification & Location */}
            <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                    <FaCar className="text-primary" />
                    <h2 className="font-bold text-lg">Transport Service Identification</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Product Name *</label>
                        <input
                            required
                            value={formData.product_name}
                            onChange={(e) => handleChange('product_name', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g. Kuala Lumpur Premium Airport Transfer - Sedan"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Product URL *</label>
                        <input
                            required
                            type="url"
                            value={formData.product_url}
                            onChange={(e) => handleChange('product_url', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Service Type *</label>
                        <select
                            required
                            value={formData.service_type}
                            onChange={(e) => handleChange('service_type', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="">Select Type</option>
                            {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Country *</label>
                        <input
                            // In a real app this would be a dropdown
                            value={formData.country}
                            onChange={(e) => handleChange('country', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g. Malaysia"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">State / City *</label>
                        <input
                            required
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g. Kuala Lumpur"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Coverage Area / Routes *</label>
                        <textarea
                            required
                            value={formData.coverage_area}
                            onChange={(e) => handleChange('coverage_area', e.target.value)}
                            rows={3}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="Describe the service area or specific routes (e.g. Within 50km of KL City Centre, or KLIA to City)"
                        />
                    </div>
                </div>
            </section>

            {/* 2. Key Contact Information */}
            <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                    <FaUser className="text-primary" />
                    <h2 className="font-bold text-lg">Key Contact Information</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Contact Name *</label>
                        <input
                            required
                            value={formData.contact_name}
                            onChange={(e) => handleChange('contact_name', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number *</label>
                        <div className="relative">
                            <FaPhone className="absolute left-3 top-3 text-muted-foreground text-xs" />
                            <input
                                required
                                value={formData.contact_phone}
                                onChange={(e) => handleChange('contact_phone', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address *</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-muted-foreground text-xs" />
                            <input
                                required
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Product Details & Vehicle Configuration */}
            <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                    <FaInfoCircle className="text-primary" />
                    <h2 className="font-bold text-lg">Details & Vehicle Configuration</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Overall Product Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="Detailed description of the service..."
                        />
                    </div>

                    {/* Vehicle Configuration */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Vehicle Configuration</label>
                        <p className="text-xs text-muted-foreground mb-3">Add the types of vehicles available for this service.</p>

                        <div className="space-y-3">
                            {formData.vehicle_config.map((vehicle, idx) => (
                                <div key={idx} className="flex gap-4 items-start bg-muted/20 p-4 rounded-lg border border-border">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium mb-1">Type</label>
                                        <select
                                            value={vehicle.type}
                                            onChange={(e) => handleVehicleChange(idx, 'type', e.target.value)}
                                            className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm"
                                        >
                                            <option value="">Select</option>
                                            {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-xs font-medium mb-1">Max Pax</label>
                                        <input
                                            type="number"
                                            value={vehicle.max_passengers}
                                            onChange={(e) => handleVehicleChange(idx, 'max_passengers', e.target.value)}
                                            className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm"
                                        />
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-xs font-medium mb-1">Luggage</label>
                                        <input
                                            type="number"
                                            value={vehicle.luggage_capacity}
                                            onChange={(e) => handleVehicleChange(idx, 'luggage_capacity', e.target.value)}
                                            className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveVehicle(idx)}
                                        className="mt-6 text-muted-foreground hover:text-red-500"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddVehicle}
                                className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                            >
                                + Add Vehicle Type
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Price Model</label>
                            <select
                                value={formData.price_model}
                                onChange={(e) => handleChange('price_model', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="">Select Model</option>
                                {PRICE_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Starting Price</label>
                            <div className="grid grid-cols-[7rem_1fr] w-full rounded-lg border border-border bg-background overflow-hidden">
                                <div className="relative h-full border-r border-border bg-muted/50">
                                    <select
                                        value={formData.currency}
                                        onChange={(e) => handleChange('currency', e.target.value)}
                                        className="w-full h-full bg-transparent px-3 py-2 text-sm outline-none font-medium cursor-pointer"
                                    >
                                        <option>USD</option>
                                        <option>MYR</option>
                                        <option>SGD</option>
                                        <option>EUR</option>
                                    </select>
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.base_price}
                                    onChange={(e) => handleChange('base_price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                    className="w-full bg-transparent px-3 py-2 text-sm outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Inclusions</label>
                        <textarea
                            value={formData.inclusions}
                            onChange={(e) => handleChange('inclusions', e.target.value)}
                            rows={3}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="List key features included (e.g. Driver, Fuel, Insurance, Tolls)..."
                        />
                    </div>
                </div>
            </section>

            {/* 4. Visuals & Promotions */}
            <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                    <FaCloudUploadAlt className="text-primary" />
                    <h2 className="font-bold text-lg">Visuals & Promotions</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Product Images * (Max 5)</label>
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                }`}
                        >
                            <input {...getInputProps()} />
                            <FaCloudUploadAlt className="mx-auto text-4xl text-muted-foreground mb-3" />
                            <p className="text-sm text-foreground font-medium">Drag & drop images here, or click to select</p>
                            <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG (Max 5MB)</p>
                        </div>

                        {previews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                                {previews.map((src, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                                        <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(idx)}
                                            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Special Offer / Promotion</label>
                        <textarea
                            value={formData.special_offer}
                            onChange={(e) => handleChange('special_offer', e.target.value)}
                            rows={3}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="Detail any current deals..."
                        />
                    </div>
                </div>
            </section>

            {/* Actions */}
            <div className="flex justify-end gap-4 sticky bottom-6 z-10">
                <div className="bg-background/80 backdrop-blur-md p-2 rounded-xl shadow-2xl border border-border flex gap-3">
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'draft')}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-lg border border-border font-semibold text-foreground hover:bg-muted transition-colors"
                    >
                        Save Draft
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'active')}
                        disabled={loading}
                        className="px-8 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold shadow-lg hover:shadow-primary/25 hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                        {loading ? 'Submitting...' : (
                            <>
                                <FaCheckCircle />
                                Activate Product
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}
