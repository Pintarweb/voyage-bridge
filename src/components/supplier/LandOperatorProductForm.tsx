'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaCloudUploadAlt, FaTimes, FaCheckCircle, FaMapMarkedAlt, FaPhone, FaEnvelope, FaUser, FaInfoCircle, FaHiking, FaListUl, FaGlobe, FaClock, FaUsers } from 'react-icons/fa'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

// Product Types for Land Operators
const PRODUCT_TYPES = [
    'Day Tour', 'Multi-Day Trek', 'Sightseeing', 'Activity/Adventure', 'Cultural Experience', 'Workshop', 'Ticket/Pass', 'Other'
]

// Activity Levels
const ACTIVITY_LEVELS = [
    'Easy', 'Moderate', 'Strenuous'
]

// Common Languages
const LANGUAGES = [
    'English', 'Mandarin', 'Malay', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Arabic', 'Hindi'
]

interface LandOperatorProductFormProps {
    supplier: any
    productId?: string
    onSuccess?: () => void
}

export default function LandOperatorProductForm({ supplier, productId, onSuccess }: LandOperatorProductFormProps) {
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
        product_type: '', // mapped to service_type column
        country: supplier?.country_code || '',
        city: supplier?.city || '',
        meeting_point: '',

        // 2. Contact
        contact_name: supplier?.name || supplier?.company_name || '',
        contact_phone: supplier?.phone_number || '',
        contact_email: supplier?.contact_email || '',

        // 3. Details & Pricing
        description: '',
        duration: '',
        activity_level: '',
        languages: [] as string[],
        max_group_size: '' as string | number,
        itinerary: '',
        inclusions: '',
        exclusions: '',
        base_price: '' as string | number,
        currency: 'USD',

        // 4. Visuals
        special_offer: '',
    })

    // New language input state for custom languages
    const [customLanguage, setCustomLanguage] = useState('')

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleMultiSelect = (field: 'languages', value: string) => {
        setFormData(prev => {
            const current = prev[field]
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(item => item !== value) }
            } else {
                return { ...prev, [field]: [...current, value] }
            }
        })
    }

    const handleAddCustomLanguage = () => {
        if (customLanguage.trim()) {
            handleMultiSelect('languages', customLanguage.trim())
            setCustomLanguage('')
        }
    }

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
                        product_type: product.service_type || '', // Map service_type back to product_type
                        country: product.country_code || '',
                        city: product.city || '',
                        meeting_point: product.meeting_point || '',

                        contact_name: product.contact_name || '',
                        contact_phone: product.contact_phone || '',
                        contact_email: product.contact_email || '',

                        description: product.product_description || '',
                        duration: product.duration || '',
                        activity_level: product.activity_level || '',
                        languages: product.languages || [],
                        max_group_size: product.max_group_size || '',
                        itinerary: product.itinerary || '',
                        inclusions: product.inclusions || '',
                        exclusions: product.exclusions || '',
                        base_price: product.base_price || '',
                        currency: product.currency || 'USD',

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
            formData.product_name, formData.product_url, formData.product_type,
            formData.country, formData.city, formData.meeting_point,
            formData.contact_name, formData.contact_phone, formData.contact_email,
            formData.description
        ];

        if (required.some(field => !field || field.trim() === '')) {
            alert('Please fill in all required fields marked with *');
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

            const dataToSubmit = {
                supplier_id: user.id,
                product_name: formData.product_name,
                product_url: formData.product_url,
                service_type: formData.product_type, // Stored in service_type column
                country_code: formData.country,
                city: formData.city,
                meeting_point: formData.meeting_point,

                contact_name: formData.contact_name,
                contact_phone: formData.contact_phone,
                contact_email: formData.contact_email,

                product_description: formData.description,
                duration: formData.duration,
                activity_level: formData.activity_level,
                languages: formData.languages,
                max_group_size: formData.max_group_size === '' ? null : formData.max_group_size,
                itinerary: formData.itinerary,
                inclusions: formData.inclusions,
                exclusions: formData.exclusions,
                base_price: formData.base_price === '' ? null : formData.base_price,
                currency: formData.currency,

                special_offer: formData.special_offer,
                photo_urls: [...previews.filter(url => !url.startsWith('blob:')), ...imageUrls], // Merge existing and new

                product_category: 'Land Operator',
                status: status
            }

            if (productId) {
                const { error: updateError } = await supabase
                    .from('products')
                    .update(dataToSubmit)
                    .eq('id', productId)
                if (updateError) throw updateError
            } else {
                const { error: insertError } = await supabase.from('products').insert(dataToSubmit)
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

    return (
        <form className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* 1. Identification & Location */}
            <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                    <FaHiking className="text-primary" />
                    <h2 className="font-bold text-lg">Product Identification & Location</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Product Name *</label>
                        <input
                            required
                            value={formData.product_name}
                            onChange={(e) => handleChange('product_name', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g. Mount Bromo Sunrise Trek and Safari"
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
                        <label className="block text-sm font-medium mb-1">Product Type *</label>
                        <select
                            required
                            value={formData.product_type}
                            onChange={(e) => handleChange('product_type', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="">Select Type</option>
                            {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Country *</label>
                        <input
                            value={formData.country}
                            onChange={(e) => handleChange('country', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g. Indonesia"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">State / City *</label>
                        <input
                            required
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g. Probolinggo"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Meeting / Start Point *</label>
                        <textarea
                            required
                            value={formData.meeting_point}
                            onChange={(e) => handleChange('meeting_point', e.target.value)}
                            rows={2}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="Detailed description of the primary pick-up or meeting location..."
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
                        <label className="block text-sm font-medium mb-1">Phone Number (Contact) *</label>
                        <div className="relative">
                            <FaPhone className="absolute left-3 top-3 text-muted-foreground text-xs" />
                            <input
                                required
                                value={formData.contact_phone}
                                onChange={(e) => handleChange('contact_phone', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg py-2 text-sm focus:ring-2 focus:ring-primary/50"
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address (Contact) *</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-muted-foreground text-xs" />
                            <input
                                required
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg py-2 text-sm focus:ring-2 focus:ring-primary/50"
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Experience Details & Pricing */}
            <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                    <FaInfoCircle className="text-primary" />
                    <h2 className="font-bold text-lg">Experience Details & Pricing</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="Detailed write-up highlighting the experience..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Duration</label>
                            <div className="relative">
                                <select
                                    value={formData.duration}
                                    onChange={(e) => handleChange('duration', e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                    style={{
                                        appearance: 'none',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none'
                                    }}
                                >
                                    <option value="">Select Duration</option>
                                    <option value="Half Day">Half Day</option>
                                    <option value="Full Day">Full Day</option>
                                    <option value="Multi-Day">Multi-Day</option>
                                    <option value="1 Hour">1 Hour</option>
                                    <option value="2 Hours">2 Hours</option>
                                    <option value="3 Hours">3 Hours</option>
                                    <option value="4 Hours">4 Hours</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Activity Level</label>
                            <div className="relative">
                                <select
                                    value={formData.activity_level}
                                    onChange={(e) => handleChange('activity_level', e.target.value)}
                                    className="w-full border border-border rounded-lg pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-colors duration-200"
                                    style={{
                                        appearance: 'none',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none',
                                        backgroundColor:
                                            formData.activity_level === 'Easy' ? '#fef9c3' : // yellow-100
                                                formData.activity_level === 'Moderate' ? '#dcfce7' : // green-100
                                                    formData.activity_level === 'Strenuous' ? '#fee2e2' : // red-100
                                                        'var(--background)',
                                        color:
                                            formData.activity_level === 'Easy' ? '#854d0e' : // yellow-800
                                                formData.activity_level === 'Moderate' ? '#166534' : // green-800
                                                    formData.activity_level === 'Strenuous' ? '#991b1b' : // red-800
                                                        'inherit'
                                    }}
                                >
                                    <option value="" style={{ backgroundColor: 'var(--background)', color: 'inherit' }}>Select Level</option>
                                    {ACTIVITY_LEVELS.map(l => (
                                        <option
                                            key={l}
                                            value={l}
                                            style={{
                                                backgroundColor:
                                                    l === 'Easy' ? '#fef9c3' :
                                                        l === 'Moderate' ? '#dcfce7' :
                                                            l === 'Strenuous' ? '#fee2e2' : undefined,
                                                color:
                                                    l === 'Easy' ? '#854d0e' :
                                                        l === 'Moderate' ? '#166534' :
                                                            l === 'Strenuous' ? '#991b1b' : undefined
                                            }}
                                        >
                                            {l}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Maximum Group Size</label>
                            <div className="relative">
                                <div className="absolute left-3 top-0 bottom-0 flex items-center justify-center pointer-events-none text-muted-foreground">
                                    <FaUsers size={14} />
                                </div>
                                <input
                                    type="number"
                                    value={formData.max_group_size}
                                    onChange={(e) => handleChange('max_group_size', e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg py-2 text-sm focus:ring-2 focus:ring-primary/50"
                                    style={{ paddingLeft: '4rem' }}
                                    placeholder="e.g. 15"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Tour Language(s)</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => handleMultiSelect('languages', lang)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${formData.languages.includes(lang)
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2 items-center max-w-xs">
                            <input
                                value={customLanguage}
                                onChange={(e) => setCustomLanguage(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomLanguage(); } }}
                                placeholder="Other Language"
                                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomLanguage}
                                className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium"
                            >
                                Add
                            </button>
                        </div>
                        {formData.languages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.languages.map((lang, idx) => (
                                    <span key={idx} className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs text-foreground">
                                        <FaGlobe className="text-[10px]" />
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Itinerary Overview</label>
                        <textarea
                            value={formData.itinerary}
                            onChange={(e) => handleChange('itinerary', e.target.value)}
                            rows={4}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="Brief itemized summary of the schedule..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Inclusions</label>
                            <textarea
                                value={formData.inclusions}
                                onChange={(e) => handleChange('inclusions', e.target.value)}
                                rows={3}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                                placeholder="What is included?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Exclusions</label>
                            <textarea
                                value={formData.exclusions}
                                onChange={(e) => handleChange('exclusions', e.target.value)}
                                rows={3}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                                placeholder="What is NOT included?"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Starting Price (per person)</label>
                        <div className="grid grid-cols-[7rem_1fr] w-full max-w-sm rounded-lg border border-border bg-background overflow-hidden relative">
                            <div className="relative h-full border-r border-border bg-muted/50">
                                <select
                                    value={formData.currency}
                                    onChange={(e) => handleChange('currency', e.target.value)}
                                    className="w-full h-full bg-transparent px-3 py-2 text-sm outline-none font-medium cursor-pointer appearance-none"
                                    style={{
                                        appearance: 'none',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none'
                                    }}
                                >
                                    <option>USD</option>
                                    <option>MYR</option>
                                    <option>SGD</option>
                                    <option>EUR</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground z-10 bg-muted/50">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
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
