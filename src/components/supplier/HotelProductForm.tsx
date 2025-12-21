'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import {
    FaCloudUploadAlt, FaTimes, FaCheckCircle, FaBuilding, FaMapMarkerAlt,
    FaPhone, FaEnvelope, FaUser, FaInfoCircle, FaBed, FaClock,
    FaSwimmingPool, FaWifi, FaParking, FaUtensils, FaDumbbell,
    FaPaw, FaStar, FaRocket, FaArrowLeft, FaPlus, FaCamera, FaTag, FaChevronDown
} from 'react-icons/fa'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

// Amenities Options
const AMENITIES_LIST = [
    { id: 'wifi', label: 'Free Wi-Fi', icon: FaWifi, color: 'text-sky-400' },
    { id: 'pool', label: 'Swimming Pool', icon: FaSwimmingPool, color: 'text-blue-400' },
    { id: 'gym', label: 'Gym / Fitness Center', icon: FaDumbbell, color: 'text-orange-400' },
    { id: 'restaurant', label: 'Restaurant', icon: FaUtensils, color: 'text-amber-400' },
    { id: 'parking', label: 'Parking', icon: FaParking, color: 'text-zinc-400' },
    { id: 'airport_shuttle', label: 'Airport Shuttle', icon: FaBuilding, color: 'text-indigo-400' },
    { id: 'pet_friendly', label: 'Pet Friendly', icon: FaPaw, color: 'text-pink-400' },
    { id: 'spa', label: 'Spa & Wellness', icon: FaInfoCircle, color: 'text-purple-400' },
    { id: 'room_service', label: 'Room Service', icon: FaClock, color: 'text-emerald-400' },
    { id: 'bar', label: 'Bar / Lounge', icon: FaUtensils, color: 'text-rose-400' },
]

// Accommodation Types
const ACCOMMODATION_TYPES = [
    'Hotel', 'Resort', 'Hostel', 'B&B', 'Apartment', 'Villa', 'Guesthouse', 'Homestay'
]

// Room Types
const ROOM_TYPES = [
    'Standard', 'Deluxe', 'Suite', 'Family Room', 'Executive', 'Studio', 'Villa', 'Others'
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
        min_occupancy: '' as string | number,
        max_occupancy: '' as string | number,
        base_price: '' as string | number,
        currency: 'USD',
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
                    min_occupancy: data.min_occupancy || '',
                    max_occupancy: data.max_occupancy || '',
                    base_price: data.base_price || '',
                    currency: data.currency || 'USD',
                    check_in_time: data.check_in_time || '',
                    check_out_time: data.check_out_time || '',
                    amenities: data.amenities || [],
                    custom_amenity: '',
                    special_offer: data.special_offer || ''
                })

                if (data.photo_urls && Array.isArray(data.photo_urls)) {
                    setPreviews(data.photo_urls)
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

    const handleSubmit = async (e: React.SyntheticEvent, status: 'draft' | 'active') => {
        e.preventDefault()
        setLoading(true)

        // Validation
        if (status === 'active' && (!formData.product_name || !formData.product_url || !formData.city || !formData.contact_name || !formData.contact_phone || !formData.contact_email || !formData.description)) {
            alert('Please fill in all required fields marked with *');
            setLoading(false);
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

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
                min_occupancy: formData.min_occupancy === '' ? null : formData.min_occupancy,
                max_occupancy: formData.max_occupancy === '' ? null : formData.max_occupancy,
                base_price: formData.base_price === '' ? null : formData.base_price,
                currency: formData.currency,
                check_in_time: formData.check_in_time === '' ? null : formData.check_in_time,
                check_out_time: formData.check_out_time === '' ? null : formData.check_out_time,
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
            alert('Failed to save product: ' + (error.message || JSON.stringify(error)));
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 pb-32 hotel-form-container">

            {/* 1. Header & Navigation */}
            <div className="space-y-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group mb-2"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium tracking-wide">Back to Dashboard</span>
                </button>

                <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-amber-500/10 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                                Create Your Next Product!
                            </h1>
                            <p className="text-amber-400 font-medium text-lg tracking-wide">
                                Add a new hotel listing to showcase to travel agents worldwide.
                            </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-full border border-white/10 shadow-lg shadow-amber-500/20 backdrop-blur-md">
                            <FaRocket className="text-4xl text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] transform -rotate-12" />
                        </div>
                    </div>
                </div>
            </div>

            <form className="space-y-8">

                {/* Card 1: Product Identification & Location */}
                <section className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-amber-400/20 shadow-xl transition-all hover:border-amber-400/30">
                    <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <FaBuilding className="text-blue-400 text-lg" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-wide">Product Identification & Location</h2>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-white/90">Product Name</label>
                            <input
                                required
                                value={formData.product_name}
                                onChange={(e) => handleChange('product_name', e.target.value)}
                                className="glass-input w-full"
                                placeholder="e.g. Grand Plaza Hotel Tokyo"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/90">Product URL</label>
                            <input
                                required
                                type="url"
                                value={formData.product_url}
                                onChange={(e) => handleChange('product_url', e.target.value)}
                                className="glass-input w-full"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/90">Star Rating</label>
                            <div className="flex items-center gap-2 h-[50px] bg-white/5 border border-white/10 rounded-lg px-4 backdrop-blur-sm">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const isActive = parseInt(formData.star_rating) >= star
                                    return (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleChange('star_rating', star.toString())}
                                            className={`transition-all duration-300 focus:outline-none transform hover:scale-110 ${isActive
                                                ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                                                : 'text-white/20'}`}
                                            style={{ fontSize: isActive ? '24px' : '20px' }}
                                        >
                                            <FaStar />
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-white/90">Accommodation Type</label>
                            <div className="flex flex-wrap gap-3">
                                {ACCOMMODATION_TYPES.map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => handleMultiSelect('accommodation_type', type)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-300 backdrop-blur-sm ${formData.accommodation_type.includes(type)
                                            ? 'bg-blue-600/30 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/90">Country</label>
                            <div className="glass-input w-full opacity-60 flex items-center text-white/70">
                                {formData.country || 'Loading...'}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/90">City</label>
                            <input
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className="glass-input w-full"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-white/90">Full Address</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                rows={2}
                                className="glass-input w-full resize-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Card 2: Key Contact Information */}
                <section className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-amber-400/20 shadow-xl transition-all hover:border-amber-400/30">
                    <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <FaUser className="text-blue-400 text-lg" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-wide">Key Contact Information</h2>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/90">Contact Name</label>
                            <input
                                required
                                value={formData.contact_name}
                                onChange={(e) => handleChange('contact_name', e.target.value)}
                                className="glass-input w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/90">Phone Number</label>
                            <input
                                required
                                value={formData.contact_phone}
                                onChange={(e) => handleChange('contact_phone', e.target.value)}
                                className="glass-input w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/90">Email Address</label>
                            <input
                                required
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                                className="glass-input w-full"
                            />
                        </div>
                    </div>
                </section>

                {/* Card 3: Product Details & Pricing */}
                <section className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-amber-400/20 shadow-xl transition-all hover:border-amber-400/30">
                    <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <FaInfoCircle className="text-blue-400 text-lg" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-wide">Product Details & Pricing</h2>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/90">Overall Product Description</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={5}
                                className="glass-input w-full"
                                placeholder="Highlight your best features..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-white/90">Available Room Type</label>
                                <div className="flex flex-wrap gap-3">
                                    {ROOM_TYPES.map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => handleMultiSelect('room_type', type)}
                                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${formData.room_type.includes(type)
                                                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white/90">Available Occupancy Limit</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.min_occupancy}
                                        onChange={(e) => handleChange('min_occupancy', e.target.value)}
                                        className="glass-input w-full text-center"
                                        placeholder="Min"
                                    />
                                    <span className="text-white/40">-</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.max_occupancy}
                                        onChange={(e) => handleChange('max_occupancy', e.target.value)}
                                        className="glass-input w-full text-center"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white/90">Starting Price (per night)</label>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <select
                                            value={formData.currency}
                                            onChange={(e) => handleChange('currency', e.target.value)}
                                            className="glass-input px-1 bg-white/5 text-center text-sm flex-none appearance-none cursor-pointer"
                                            style={{ width: '90px', paddingRight: '1.5rem' }}
                                        >
                                            <option className="bg-gray-800">USD</option>
                                            <option className="bg-gray-800">EUR</option>
                                            <option className="bg-gray-800">MYR</option>
                                            <option className="bg-gray-800">SGD</option>
                                        </select>
                                        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-xs pointer-events-none" />
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.base_price}
                                        onChange={(e) => handleChange('base_price', e.target.value)}
                                        className="glass-input flex-1"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white/90">Check-in Time</label>
                                <input
                                    type="time"
                                    value={formData.check_in_time}
                                    onChange={(e) => handleChange('check_in_time', e.target.value)}
                                    className="glass-input w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white/90">Check-out Time</label>
                                <input
                                    type="time"
                                    value={formData.check_out_time}
                                    onChange={(e) => handleChange('check_out_time', e.target.value)}
                                    className="glass-input w-full"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-white/90">Key Amenities</label>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {AMENITIES_LIST.map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleMultiSelect('amenities', item.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 text-left hover:scale-[1.02] group ${formData.amenities.includes(item.id)
                                            ? 'bg-blue-600/20 border-blue-400/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <item.icon className={`text-lg transition-colors ${formData.amenities.includes(item.id) ? item.color : 'text-white/30 group-hover:text-white'}`} />
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    value={formData.custom_amenity}
                                    onChange={(e) => handleChange('custom_amenity', e.target.value)}
                                    placeholder="Add custom amenity..."
                                    className="glass-input flex-1"
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomAmenity() } }}
                                />
                                <button type="button" onClick={handleAddCustomAmenity} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-white border border-white/10">Add</button>
                            </div>

                            {formData.amenities.filter(a => !AMENITIES_LIST.find(def => def.id === a)).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.amenities.filter(a => !AMENITIES_LIST.find(def => def.id === a)).map((amenity, idx) => (
                                        <span key={idx} className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-200 text-xs">
                                            {amenity}
                                            <button onClick={() => handleMultiSelect('amenities', amenity)} className="hover:text-white"><FaTimes /></button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Card 4: Visuals & Promotions */}
                <section className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-amber-400/20 shadow-xl transition-all hover:border-amber-400/30">
                    <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <FaCamera className="text-blue-400 text-lg" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-wide">Visuals & Promotions</h2>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-white/90">Product Images</label>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group ${isDragActive
                                    ? 'border-blue-400 bg-blue-400/10'
                                    : 'border-white/10 bg-white/5 hover:border-blue-400/50 hover:bg-white/10'
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                    <FaCloudUploadAlt className="text-4xl text-blue-300" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Drag & drop images here</h3>
                                <p className="text-white/50">or click to select files (Max 5)</p>
                            </div>

                            {previews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                                    {previews.map((src, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group shadow-lg border border-white/10">
                                            <img src={src} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                                    className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-500 transition-colors"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/90">Special Offer / Promotion</label>
                            <textarea
                                value={formData.special_offer}
                                onChange={(e) => handleChange('special_offer', e.target.value)}
                                rows={3}
                                className="glass-input w-full"
                                placeholder="e.g. Early bird discount: 20% off for bookings 60 days in advance"
                            />
                        </div>
                    </div>
                </section>
            </form>

            <style jsx global>{`
                .glass-input {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                    padding: 0.75rem 1rem;
                    border-radius: 0.75rem;
                    transition: all 0.3s ease;
                }
                .glass-input:focus {
                    outline: none;
                    border-color: #60a5fa;
                    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
                    background-color: rgba(255, 255, 255, 0.1);
                }
                .glass-input::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }
                .glass-input::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    cursor: pointer;
                    opacity: 0.7;
                }
                .glass-input::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                }
                .hotel-form-container label {
                    color: rgba(255, 255, 255, 0.9) !important;
                }
            `}</style>

            {/* Sticky Footer Action Panel */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-black/40 backdrop-blur-xl border-t border-white/10 supports-[backdrop-filter]:bg-black/20">
                <div className="max-w-5xl mx-auto flex justify-end gap-6 items-center">
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'draft')}
                        disabled={loading}
                        className="px-8 py-3 rounded-xl border border-white/20 font-semibold text-white/80 hover:bg-white/10 hover:text-white hover:border-white/40 transition-all"
                    >
                        Save Draft
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'active')}
                        disabled={loading}
                        className="px-10 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 border border-amber-300/50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <FaCheckCircle className="text-lg" />
                                <span>Activate Your Product</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

        </div>
    )
}
