'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaCloudUploadAlt, FaTimes, FaSave, FaCheckCircle, FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaInfoCircle, FaBed, FaClock, FaSwimmingPool, FaWifi, FaParking, FaUtensils, FaDumbbell, FaPaw, FaStar } from 'react-icons/fa'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

// Amenities Options
const AMENITIES_LIST = [
    { id: 'wifi', label: 'Free Wi-Fi', icon: FaWifi },
    { id: 'pool', label: 'Swimming Pool', icon: FaSwimmingPool },
    { id: 'gym', label: 'Gym / Fitness Center', icon: FaDumbbell },
    { id: 'restaurant', label: 'Restaurant', icon: FaUtensils },
    { id: 'parking', label: 'Parking', icon: FaParking },
    { id: 'airport_shuttle', label: 'Airport Shuttle', icon: FaBuilding }, // Generic icon
    { id: 'pet_friendly', label: 'Pet Friendly', icon: FaPaw },
    { id: 'spa', label: 'Spa & Wellness', icon: FaInfoCircle }, // Generic
    { id: 'room_service', label: 'Room Service', icon: FaClock }, // Generic
    { id: 'bar', label: 'Bar / Lounge', icon: FaUtensils },
]

// Accommodation Types
const ACCOMMODATION_TYPES = [
    'Hotel', 'Resort', 'Hostel', 'B&B', 'Apartment', 'Villa', 'guesthouse', 'Homestay'
]

// Room Types
const ROOM_TYPES = [
    'Standard', 'Deluxe', 'Suite', 'Family Room', 'Executive', 'Studio', 'Villa'
]

interface HotelProductFormProps {
    supplier: any
    productId?: string
    onSuccess?: () => void
}

export default function HotelProductForm({ supplier, productId, onSuccess }: HotelProductFormProps) {
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
        accommodation_type: [] as string[],
        star_rating: '5',
        country: supplier?.country_code || '',
        city: supplier?.city || '',
        address: supplier?.address_line_1 || '',

        // 2. Key Contact (Default to supplier profile)
        contact_name: supplier?.name || supplier?.company_name || '',
        contact_phone: supplier?.phone_number || '',
        contact_email: supplier?.contact_email || '',

        // 3. Details & Pricing
        description: '',
        room_type: [] as string[],
        min_occupancy: 1,
        max_occupancy: 2,
        base_price: 0,
        currency: 'USD', // Default, ideally from supplier preference
        check_in_time: '15:00',
        check_out_time: '12:00',
        amenities: [] as string[],
        custom_amenity: '',

        // 4. Visuals
        special_offer: '',
    })

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Fetch existing product for Edit Mode
    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return

            setLoading(true)
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single()

            if (data && !error) {
                // Populate Form
                setFormData({
                    product_name: data.product_name || '',
                    product_url: data.product_url || '',
                    accommodation_type: data.accommodation_type || [],
                    star_rating: data.star_rating?.toString() || '5',
                    country: data.country_code || '',
                    city: data.city || '',
                    address: data.address || '',

                    contact_name: data.contact_name || '',
                    contact_phone: data.contact_phone || '',
                    contact_email: data.contact_email || '',

                    description: data.product_description || '',
                    room_type: data.room_type || [],
                    min_occupancy: data.min_occupancy || 1,
                    max_occupancy: data.max_occupancy || 2,
                    base_price: data.base_price || 0,
                    currency: data.currency || 'USD',
                    check_in_time: data.check_in_time || '15:00',
                    check_out_time: data.check_out_time || '12:00',
                    amenities: data.amenities || [],
                    custom_amenity: '',
                    special_offer: data.special_offer || ''
                })

                // Handle Images (If stored as URLs in photo_urls array)
                if (data.photo_urls && Array.isArray(data.photo_urls)) {
                    setPreviews(data.photo_urls)
                    // Note: 'files' state remains empty as we don't have File objects for existing images
                    // You might need a way to track "existing images" vs "new files" to avoid re-uploading or losing them.
                    // For now, we assume `previews` holds the URLs and we resubmit them?
                    // Actually, lines 155 in handleSubmit handles this: 
                    // const finalImages = [...imageUrls] (from new files)
                    // We need to MERGE existing images.
                }
            }
            setLoading(false)
        }

        fetchProduct()
    }, [productId, supabase])

    const handleMultiSelect = (field: 'accommodation_type' | 'room_type' | 'amenities', value: string) => {
        setFormData(prev => {
            const current = prev[field]
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(item => item !== value) }
            } else {
                return { ...prev, [field]: [...current, value] }
            }
        })
    }

    const handleAddCustomAmenity = () => {
        if (formData.custom_amenity.trim()) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, prev.custom_amenity.trim()],
                custom_amenity: ''
            }))
        }
    }

    // Image Upload Logic (Copied/Adapted from original)
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

            // Combine with existing non-blob previews if any (edit mode scenario, but this is create)
            const finalImages = [...imageUrls]

            const dataToSubmit = {
                supplier_id: user.id,
                product_name: formData.product_name,
                product_url: formData.product_url,
                accommodation_type: formData.accommodation_type,
                star_rating: parseFloat(formData.star_rating),
                country_code: formData.country,
                city: formData.city,
                address: formData.address,

                contact_name: formData.contact_name,
                contact_phone: formData.contact_phone,
                contact_email: formData.contact_email,

                product_description: formData.description,
                room_type: formData.room_type,
                min_occupancy: formData.min_occupancy,
                max_occupancy: formData.max_occupancy,
                base_price: formData.base_price,
                currency: formData.currency,
                check_in_time: formData.check_in_time,
                check_out_time: formData.check_out_time,
                amenities: formData.amenities,

                special_offer: formData.special_offer,
                photo_urls: finalImages,

                product_category: 'Hotel', // Enforce category
                status: status
            }

            let error;

            if (productId) {
                // UPDATE
                const { error: updateError } = await supabase
                    .from('products')
                    .update({
                        ...dataToSubmit,
                        photo_urls: [...previews.filter(url => !url.startsWith('blob:')), ...imageUrls] // Keep existing URLs + New Uploads
                    })
                    .eq('id', productId)
                error = updateError
            } else {
                // INSERT
                const { error: insertError } = await supabase.from('products').insert({
                    ...dataToSubmit,
                    photo_urls: imageUrls // Just new uploads for create
                })
                error = insertError
            }

            if (error) throw error

            if (onSuccess) onSuccess()
            else router.push('/supplier/dashboard')

        } catch (error: any) {
            console.error('Form Submission Error:', error);
            alert('Failed to save product. If you recently updated the code, please ensure database migrations are applied. Error: ' + (error.message || JSON.stringify(error)));
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* 1. Identification & Location */}
            <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                    <FaBuilding className="text-primary" />
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
                            placeholder="Luxury Hotel in Tokyo"
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
                        <label className="block text-sm font-medium mb-2">Star Rating</label>
                        <div className="flex items-center gap-2 h-14">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const isActive = parseInt(formData.star_rating) >= star
                                return (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleChange('star_rating', star.toString())}
                                        style={{ fontSize: isActive ? '36px' : '24px' }}
                                        className={`transition-all duration-300 focus:outline-none ${isActive ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                    >
                                        <FaStar />
                                    </button>
                                )
                            })}
                            <span className="ml-4 text-sm text-muted-foreground font-medium">
                                {formData.star_rating} Star{formData.star_rating !== '1' && 's'}
                            </span>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Accommodation Type *</label>
                        <div className="flex flex-wrap gap-2">
                            {ACCOMMODATION_TYPES.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleMultiSelect('accommodation_type', type)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${formData.accommodation_type.includes(type)
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Country</label>
                        <input
                            disabled
                            value={formData.country}
                            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <input
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Full Address</label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            rows={2}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 resize-none"
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

            {/* 3. Product Details & Pricing */}
            <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                    <FaInfoCircle className="text-primary" />
                    <h2 className="font-bold text-lg">Product Details & Pricing</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Overall Product Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={5}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            placeholder="Detailed write-up highlighting features..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Available Room Type *</label>
                            <div className="flex flex-wrap gap-2">
                                {ROOM_TYPES.map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => handleMultiSelect('room_type', type)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${formData.room_type.includes(type)
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Available Occupancy Limit *</label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 flex items-center rounded-lg border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
                                    <div className="bg-muted/50 px-3 py-2 border-r border-border text-xs text-muted-foreground font-medium select-none text-center min-w-[3rem]">
                                        Min
                                    </div>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.min_occupancy}
                                        onChange={(e) => handleChange('min_occupancy', parseInt(e.target.value))}
                                        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/50 w-full"
                                    />
                                </div>
                                <span className="text-muted-foreground">-</span>
                                <div className="flex-1 flex items-center rounded-lg border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
                                    <div className="bg-muted/50 px-3 py-2 border-r border-border text-xs text-muted-foreground font-medium select-none text-center min-w-[3rem]">
                                        Max
                                    </div>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.max_occupancy}
                                        onChange={(e) => handleChange('max_occupancy', parseInt(e.target.value))}
                                        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/50 w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Starting Price (per night) *</label>
                            <div className="grid grid-cols-[7rem_1fr] w-full rounded-lg border border-border bg-background transition-shadow focus-within:ring-2 focus-within:ring-primary/50 overflow-hidden">
                                <div className="relative h-full border-r border-border bg-muted/50">
                                    <select
                                        value={formData.currency}
                                        onChange={(e) => handleChange('currency', e.target.value)}
                                        className="w-full h-full bg-transparent px-3 py-2 text-sm outline-none font-medium cursor-pointer appearance-none relative z-10"
                                    >
                                        <option>USD</option>
                                        <option>EUR</option>
                                        <option>MYR</option>
                                        <option>SGD</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[0.6rem] pointer-events-none z-0">
                                        ▼
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.base_price}
                                    onChange={(e) => handleChange('base_price', parseFloat(e.target.value))}
                                    className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Check-in Time *</label>
                            <input
                                type="time"
                                value={formData.check_in_time}
                                onChange={(e) => handleChange('check_in_time', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Check-out Time *</label>
                            <input
                                type="time"
                                value={formData.check_out_time}
                                onChange={(e) => handleChange('check_out_time', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3">Key Amenities</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            {AMENITIES_LIST.map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleMultiSelect('amenities', item.id)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm transition-all text-left ${formData.amenities.includes(item.id)
                                        ? 'bg-primary/10 border-primary text-primary font-semibold'
                                        : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                                        }`}
                                >
                                    <item.icon />
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Other Amenities */}
                        <div className="flex gap-2 items-center max-w-md">
                            <input
                                value={formData.custom_amenity}
                                onChange={(e) => handleChange('custom_amenity', e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomAmenity(); } }}
                                placeholder="Add other amenity (e.g. Concierge)"
                                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomAmenity}
                                className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium"
                            >
                                Add
                            </button>
                        </div>
                        {formData.amenities.filter(a => !AMENITIES_LIST.find(def => def.id === a)).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.amenities.filter(a => !AMENITIES_LIST.find(def => def.id === a)).map((amenity, idx) => (
                                    <span key={idx} className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs text-foreground">
                                        {amenity}
                                        <button
                                            type="button"
                                            onClick={() => handleMultiSelect('amenities', amenity)}
                                            className="hover:text-red-500 ml-1"
                                        >
                                            <FaTimes />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
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
                            placeholder="Detail any current deals (e.g., 'Book 3 nights get 10% off')..."
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
                                Activate Your Product
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}
