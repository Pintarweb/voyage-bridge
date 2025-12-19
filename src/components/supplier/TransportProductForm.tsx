'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaCloudUploadAlt, FaTimes, FaCheckCircle, FaBuilding, FaPhone, FaEnvelope, FaUser, FaInfoCircle, FaCar, FaMapMarkedAlt, FaSuitcase, FaMoneyBillWave, FaListUl, FaRocket, FaArrowLeft, FaSave } from 'react-icons/fa'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

    // Load existing product data if editing
    useEffect(() => {
        const loadProductData = async () => {
            if (productId) {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data: product, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', productId)
                    .single()

                if (product) {
                    setFormData(prev => ({
                        ...prev,
                        product_name: product.product_name || '',
                        product_url: product.product_url || '',
                        service_type: product.service_type || '',
                        country: product.country_code || '',
                        city: product.city || '',
                        coverage_area: product.coverage_area || '',
                        contact_name: product.contact_name || '',
                        contact_phone: product.contact_phone || '',
                        contact_email: product.contact_email || '',
                        description: product.product_description || '',
                        vehicle_config: product.vehicle_config || [],
                        price_model: product.price_model || '',
                        base_price: product.base_price || '',
                        currency: product.currency || 'USD',
                        inclusions: product.inclusions || '',
                        special_offer: product.special_offer || ''
                    }))

                    if (product.photo_urls && product.photo_urls.length > 0) {
                        setPreviews(product.photo_urls)
                    }
                }
            }
        }
        loadProductData()
    }, [productId, supabase])

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

        // Validation
        const required = [
            formData.product_name, formData.product_url, formData.service_type,
            formData.country, formData.city, formData.coverage_area,
            formData.contact_name, formData.contact_phone, formData.contact_email,
            formData.description
        ];

        if (required.some(field => !field || field.trim() === '')) {
            alert('Please fill in all required fields (Product Name, URL, Type, Location, Contact Info, Description).');
            setLoading(false);
            return;
        }

        if (previews.length === 0) {
            alert('Please upload at least one image.');
            setLoading(false);
            return;
        }

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

            if (productId) {
                const { error: updateError } = await supabase
                    .from('products')
                    .update({
                        ...dataToSubmit,
                        photo_urls: [...previews.filter(url => !url.startsWith('blob:')), ...imageUrls]
                    })
                    .eq('id', productId)
                if (updateError) throw updateError
            } else {
                const { error: insertError } = await supabase.from('products').insert({
                    ...dataToSubmit,
                    photo_urls: imageUrls
                })
                if (insertError) throw insertError
            }

            if (onSuccess) onSuccess()
            else router.push('/supplier/dashboard')

        } catch (error: any) {
            console.error('Form Submission Error:', error);
            alert('Failed to save product: ' + (error.message || JSON.stringify(error)));
        } finally {
            setLoading(false)
        }
    }

    // Styles for Inputs
    const glassInputClass = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all backdrop-blur-md"
    const glassLabelClass = "block text-sm font-bold !text-white mb-2 uppercase tracking-wider opacity-100"

    return (
        <div className="w-full text-white font-sans animate-in fade-in duration-500">
            {/* Navigation - Top Left */}
            <div className="mb-6">
                <Link href="/supplier/dashboard" className="text-blue-300 hover:text-white transition-colors flex items-center gap-2 group text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 w-fit">
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
            </div>

            {/* Header Banner - Redesigned */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 p-10 shadow-2xl border border-white/10 mb-12">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                            Add Transport Service
                        </h1>
                        <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
                            Complete the details below to list your vehicle or transport service on the global marketplace.
                        </p>
                    </div>
                    {/* Professional Icon/Graphic */}
                    <div className="hidden md:flex h-20 w-20 bg-blue-500/10 rounded-2xl items-center justify-center border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                        <FaCar className="text-4xl text-blue-400" />
                    </div>
                </div>
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            </div>

            <form className="space-y-8 pb-32">
                {/* Card 1: Transport Service Identification */}
                <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-50" />
                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                        <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><FaCar /></span>
                        Service Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className={glassLabelClass}>Product Name *</label>
                            <input
                                required
                                value={formData.product_name}
                                onChange={(e) => handleChange('product_name', e.target.value)}
                                className={glassInputClass}
                                placeholder="e.g. Premium Airport Transfer - Sedan"
                            />
                        </div>

                        <div>
                            <label className={glassLabelClass}>Product URL *</label>
                            <input
                                required
                                type="url"
                                value={formData.product_url}
                                onChange={(e) => handleChange('product_url', e.target.value)}
                                className={glassInputClass}
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className={glassLabelClass}>Service Type *</label>
                            <div className="relative">
                                <select
                                    required
                                    value={formData.service_type}
                                    onChange={(e) => handleChange('service_type', e.target.value)}
                                    className={`${glassInputClass} appearance-none cursor-pointer`}
                                >
                                    <option value="" className="bg-slate-900 text-gray-500">Select Type</option>
                                    {SERVICE_TYPES.map(t => <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</div>
                            </div>
                        </div>

                        <div>
                            <label className={glassLabelClass}>Country *</label>
                            <input
                                value={formData.country}
                                onChange={(e) => handleChange('country', e.target.value)}
                                className={glassInputClass}
                                placeholder="e.g. Malaysia"
                            />
                        </div>
                        <div>
                            <label className={glassLabelClass}>State / City *</label>
                            <input
                                required
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className={glassInputClass}
                                placeholder="e.g. Kuala Lumpur"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={glassLabelClass}>Coverage Area / Routes *</label>
                            <textarea
                                required
                                value={formData.coverage_area}
                                onChange={(e) => handleChange('coverage_area', e.target.value)}
                                rows={3}
                                className={glassInputClass}
                                placeholder="Describe the service area or specific routes (e.g. Within 50km of KL City Centre, or KLIA to City)"
                            />
                        </div>
                    </div>
                </section>

                {/* Card 2: Key Contact Information */}
                <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-50" />
                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                        <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><FaUser /></span>
                        Contact Person
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={glassLabelClass}>Contact Name *</label>
                            <input
                                required
                                value={formData.contact_name}
                                onChange={(e) => handleChange('contact_name', e.target.value)}
                                className={glassInputClass}
                            />
                        </div>
                        <div>
                            <label className={glassLabelClass}>Phone Number *</label>
                            <div className="relative">
                                <FaPhone className="absolute left-4 top-4 text-gray-400 text-xs" />
                                <input
                                    required
                                    value={formData.contact_phone}
                                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                                    className={`${glassInputClass} pl-10`}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={glassLabelClass}>Email Address *</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-4 text-gray-400 text-xs" />
                                <input
                                    required
                                    type="email"
                                    value={formData.contact_email}
                                    onChange={(e) => handleChange('contact_email', e.target.value)}
                                    className={`${glassInputClass} pl-10`}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Card 3: Details & Vehicle Configuration */}
                <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-50" />
                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                        <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><FaInfoCircle /></span>
                        Configuration & Pricing
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label className={glassLabelClass}>Description *</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={4}
                                className={glassInputClass}
                                placeholder="Detailed description of the service..."
                            />
                        </div>

                        {/* Vehicle Configuration */}
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <label className={glassLabelClass}>Fleet / Vehicles</label>
                                <button
                                    type="button"
                                    onClick={handleAddVehicle}
                                    className="text-blue-400 hover:text-blue-300 transition-colors font-bold text-sm flex items-center gap-2"
                                >
                                    + Add Vehicle Type
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.vehicle_config.map((vehicle, idx) => (
                                    <div key={idx} className="flex flex-wrap md:flex-nowrap gap-4 items-start bg-black/40 p-4 rounded-xl border border-white/5 transition-all">
                                        <div className="flex-1 min-w-[150px]">
                                            <label className="block text-xs font-semibold text-gray-400 mb-1">Type</label>
                                            <div className="relative">
                                                <select
                                                    value={vehicle.type}
                                                    onChange={(e) => handleVehicleChange(idx, 'type', e.target.value)}
                                                    className={`${glassInputClass} py-2 text-sm appearance-none bg-transparent`}
                                                >
                                                    <option value="" className="bg-slate-900 text-gray-500">Select</option>
                                                    {VEHICLE_TYPES.map(t => <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>)}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</div>
                                            </div>
                                        </div>
                                        <div className="w-1/2 md:w-24">
                                            <label className="block text-xs font-semibold text-gray-400 mb-1">Max Pax</label>
                                            <input
                                                type="number"
                                                value={vehicle.max_passengers}
                                                onChange={(e) => handleVehicleChange(idx, 'max_passengers', e.target.value)}
                                                className={`${glassInputClass} py-2 text-sm`}
                                            />
                                        </div>
                                        <div className="w-1/2 md:w-24">
                                            <label className="block text-xs font-semibold text-gray-400 mb-1">Luggage</label>
                                            <input
                                                type="number"
                                                value={vehicle.luggage_capacity}
                                                onChange={(e) => handleVehicleChange(idx, 'luggage_capacity', e.target.value)}
                                                className={`${glassInputClass} py-2 text-sm`}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveVehicle(idx)}
                                            className="mt-7 text-gray-500 hover:text-red-400 transition-colors px-2"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                                {formData.vehicle_config.length === 0 && (
                                    <div className="text-center py-8 border border-dashed border-white/10 rounded-xl text-gray-400 text-sm bg-black/20">
                                        No vehicles added yet. Click "+ Add Vehicle Type" to configure your fleet.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div>
                                <label className={glassLabelClass}>Price Model</label>
                                <div className="relative">
                                    <select
                                        value={formData.price_model}
                                        onChange={(e) => handleChange('price_model', e.target.value)}
                                        className={`${glassInputClass} appearance-none cursor-pointer`}
                                    >
                                        <option value="" className="bg-slate-900 text-gray-500">Select Model</option>
                                        {PRICE_MODELS.map(m => <option key={m} value={m} className="bg-slate-900 text-white">{m}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</div>
                                </div>
                            </div>
                            <div>
                                <label className={glassLabelClass}>Starting Price</label>
                                <div className="grid grid-cols-[6rem_1fr] w-full items-center gap-2">
                                    <div className="relative h-full">
                                        <select
                                            value={formData.currency}
                                            onChange={(e) => handleChange('currency', e.target.value)}
                                            className={`${glassInputClass} h-full appearance-none cursor-pointer text-center font-bold`}
                                        >
                                            <option className="bg-slate-900">USD</option>
                                            <option className="bg-slate-900">MYR</option>
                                            <option className="bg-slate-900">SGD</option>
                                            <option className="bg-slate-900">EUR</option>
                                        </select>
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.base_price}
                                        onChange={(e) => handleChange('base_price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                        className={glassInputClass}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className={glassLabelClass}>Inclusions</label>
                            <textarea
                                value={formData.inclusions}
                                onChange={(e) => handleChange('inclusions', e.target.value)}
                                rows={3}
                                className={glassInputClass}
                                placeholder="List key features included (e.g. Driver, Fuel, Insurance, Tolls)..."
                            />
                        </div>
                    </div>
                </section>

                {/* Card 4: Visuals & Promotions */}
                <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-50" />
                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                        <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><FaCloudUploadAlt /></span>
                        Photos & Offers
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label className={glassLabelClass}>Images * (Max 5)</label>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 group bg-black/20 ${isDragActive
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-white/10 hover:border-blue-500/50 hover:bg-black/40'
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                    <FaCloudUploadAlt className="text-3xl text-blue-400" />
                                </div>
                                <p className="text-gray-300 font-medium mb-1 group-hover:text-blue-300 transition-colors">Click or drag images to upload</p>
                                <p className="text-xs text-gray-500">JPG, PNG (Max 5MB)</p>
                            </div>

                            {previews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                                    {previews.map((src, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group shadow-lg border border-white/10">
                                            <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(idx)}
                                                    className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-transform hover:scale-110"
                                                >
                                                    <FaTimes size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={glassLabelClass}>Special Offer / Promotion</label>
                            <textarea
                                value={formData.special_offer}
                                onChange={(e) => handleChange('special_offer', e.target.value)}
                                rows={3}
                                className={glassInputClass}
                                placeholder="Detail any current deals..."
                            />
                        </div>
                    </div>
                </section>

                {/* Spacer for sticky footer */}
                <div className="h-20"></div>

                {/* Sticky Action Panel */}
                <div className="fixed bottom-0 left-0 w-full bg-[#0a0f1c]/95 backdrop-blur-xl border-t border-white/10 p-4 z-50 animate-in slide-in-from-bottom duration-500 shadow-[0_-5px_30px_rgba(0,0,0,0.5)]">
                    <div className="max-w-5xl mx-auto flex justify-end gap-6 items-center">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, 'draft')}
                            disabled={loading}
                            className="px-8 py-3 rounded-xl border border-white/20 font-bold text-white hover:bg-white/10 transition-all disabled:opacity-50 hover:border-white/40"
                        >
                            Save Draft
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, 'active')}
                            disabled={loading}
                            className="px-10 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-bold shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    <FaCheckCircle className="text-lg" />
                                    Activate Product
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    )
}
