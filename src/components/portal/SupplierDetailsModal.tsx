import { FaExternalLinkAlt, FaTimes, FaBuilding, FaEnvelope, FaGlobe, FaStar, FaMapMarkerAlt, FaTag, FaChevronLeft, FaChevronRight, FaWifi, FaSwimmingPool, FaSpa, FaDumbbell, FaParking, FaCoffee, FaSnowflake, FaUtensils, FaGlassMartini, FaCheckCircle } from 'react-icons/fa'
import Image from 'next/image'
import { useState } from 'react'

type Supplier = {
    id: string
    company_name: string
    description: string | null
    website_url: string | null
    contact_email: string | null
}

type Product = {
    id: string
    product_name: string
    product_description: string
    photo_urls: string[] | string
    city: string
    country_code: string
    product_category: string
    duration?: string
    activity_level?: string
    max_group_size?: number
    starting_price?: number
    base_price?: number // Common for Transport
    currency?: string
    meeting_point?: string
    languages?: string[]
    itinerary?: any
    inclusions?: string[]
    exclusions?: string[]
    service_type?: string
    coverage_area?: string
    vehicle_config?: any[]
    // Hotel Fields
    accommodation_type?: string[]
    star_rating?: number
    address?: string
    room_type?: string[]
    min_occupancy?: number
    max_occupancy?: number
    check_in_time?: string
    check_out_time?: string
    amenities?: string[]
}

type SupplierDetailsModalProps = {
    supplier: Supplier
    product: Product
    isOpen: boolean
    onClose: () => void
    productUrl?: string
    showContactInfo?: boolean
}

export default function SupplierDetailsModal({ supplier, product, isOpen, onClose, productUrl, showContactInfo = false }: SupplierDetailsModalProps) {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null)

    if (!isOpen) return null

    // Parse photo_urls
    let images: string[] = []
    if (Array.isArray(product.photo_urls)) {
        images = product.photo_urls
    } else if (typeof product.photo_urls === 'string') {
        try {
            images = JSON.parse(product.photo_urls)
        } catch {
            images = []
        }
    }

    // Prepare looping images for marquee
    // Ensure we have enough density for smooth looping
    const displayImages = images.length > 0
        ? (images.length < 5 ? [...images, ...images, ...images, ...images] : [...images, ...images])
        : []

    const getAmenityIcon = (amenity: string) => {
        const text = amenity.toLowerCase()
        if (text.includes('wifi') || text.includes('internet')) return <FaWifi className="text-blue-500" />
        if (text.includes('pool') || text.includes('swim')) return <FaSwimmingPool className="text-cyan-500" />
        if (text.includes('spa') || text.includes('wellness')) return <FaSpa className="text-pink-500" />
        if (text.includes('gym') || text.includes('fitness')) return <FaDumbbell className="text-slate-600" />
        if (text.includes('park')) return <FaParking className="text-slate-600" />
        if (text.includes('breakfast') || text.includes('coffee')) return <FaCoffee className="text-amber-700" />
        if (text.includes('ac') || text.includes('air') || text.includes('cool')) return <FaSnowflake className="text-sky-300" />
        if (text.includes('restaurant') || text.includes('dining') || text.includes('food')) return <FaUtensils className="text-orange-500" />
        if (text.includes('bar') || text.includes('drink')) return <FaGlassMartini className="text-purple-500" />
        return <FaCheckCircle className="text-green-500" />
    }

    const handleWriteReview = () => {
        // Placeholder for review functionality
        alert('Review feature coming soon!')
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden">
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex items-start justify-between shadow-md shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <FaTag className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold">{product.product_name}</h2>
                            <p className="text-slate-300 text-sm">{product.product_category} • {product.city}, {product.country_code}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8 overflow-y-auto">
                    {/* Continuous Image Scroll */}
                    {displayImages.length > 0 && (
                        <div className="relative h-56 md:h-64 w-full rounded-xl overflow-hidden shadow-inner bg-neutral-100 shrink-0 group">
                            {/* Scrolling Track */}
                            <div className="flex h-full w-max animate-scroll">
                                {/* Original + Duplicate for seamless loop */}
                                {displayImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="relative h-full w-64 md:w-80 cursor-zoom-in shrink-0"
                                        onClick={() => setLightboxImage(img)}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Product image ${idx}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 256px, 320px"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Hover Overlay Hint */}
                            <div className="absolute inset-x-0 bottom-4 pointer-events-none flex justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">Click to expand • Pauses on hover</span>
                            </div>
                        </div>
                    )}

                    {/* Product Description */}
                    <div className="prose max-w-none text-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                            Description
                        </h3>
                        <p className="whitespace-pre-wrap leading-relaxed">
                            {product.product_description}
                        </p>
                    </div>

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {product.service_type && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold text-center">Service Type</p>
                                <p className="text-sm font-semibold text-slate-800 text-center">{product.service_type}</p>
                            </div>
                        )}
                        {product.duration && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold text-center">Duration</p>
                                <p className="text-sm font-semibold text-slate-800 text-center">{product.duration}</p>
                            </div>
                        )}
                        {product.coverage_area && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 md:col-span-2 lg:col-span-1">
                                <p className="text-xs text-slate-500 uppercase font-bold text-center">Coverage Area</p>
                                <p className="text-sm font-semibold text-slate-800 text-center truncate" title={product.coverage_area}>{product.coverage_area}</p>
                            </div>
                        )}
                        {product.activity_level && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold text-center">Activity Level</p>
                                <p className="text-sm font-semibold text-slate-800 text-center">{product.activity_level}</p>
                            </div>
                        )}
                        {product.max_group_size && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold text-center">Max Group Size</p>
                                <p className="text-sm font-semibold text-slate-800 text-center">{product.max_group_size} pax</p>
                            </div>
                        )}
                        {product.languages && product.languages.length > 0 && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold text-center">Languages</p>
                                <p className="text-sm font-semibold text-slate-800 text-center">
                                    {Array.isArray(product.languages) ? product.languages.join(', ') : product.languages}
                                </p>
                            </div>
                        )}
                        {product.meeting_point && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold text-center">Meeting Point</p>
                                <p className="text-sm font-semibold text-slate-800 text-center truncate" title={product.meeting_point}>
                                    {product.meeting_point}
                                </p>
                            </div>
                        )}
                        {/* Hotel Specific Fields */}
                        {product.star_rating && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold text-center">Rating</p>
                                <div className="flex justify-center text-yellow-500 mt-1">
                                    {[...Array(Math.round(product.star_rating))].map((_, i) => <FaStar key={i} size={14} />)}
                                </div>
                            </div>
                        )}
                        {product.accommodation_type && product.accommodation_type.length > 0 && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold text-center">Property Type</p>
                                <p className="text-sm font-semibold text-slate-800 text-center">
                                    {Array.isArray(product.accommodation_type) ? product.accommodation_type.join(', ') : product.accommodation_type}
                                </p>
                            </div>
                        )}
                        {product.check_in_time && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold text-center">Check-in</p>
                                <p className="text-sm font-semibold text-slate-800 text-center">{product.check_in_time}</p>
                            </div>
                        )}
                        {product.check_out_time && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold text-center">Check-out</p>
                                <p className="text-sm font-semibold text-slate-800 text-center">{product.check_out_time}</p>
                            </div>
                        )}
                        {(product.min_occupancy || product.max_occupancy) && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold text-center">Occupancy</p>
                                <p className="text-sm font-semibold text-slate-800 text-center">
                                    {product.min_occupancy} - {product.max_occupancy} Guests
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Hotel Amenities */}
                    {product.amenities && product.amenities.length > 0 && (
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <FaBuilding className="text-slate-500" />
                                Amenities
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {product.amenities.map((amenity, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm flex items-center gap-2 hover:border-slate-300 transition-colors">
                                        {getAmenityIcon(amenity)}
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hotel Room Types */}
                    {product.room_type && product.room_type.length > 0 && (
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <FaBuilding className="text-slate-500" />
                                Available Room Types
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(product.room_type) ? product.room_type.map((type, i) => (
                                    <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">
                                        {type}
                                    </span>
                                )) : <span className="text-sm text-slate-600">{String(product.room_type)}</span>}
                            </div>
                        </div>
                    )}

                    {/* Vehicle Configuration (Transport) */}
                    {product.vehicle_config && product.vehicle_config.length > 0 && (
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <FaBuilding className="text-slate-500" /> {/* Reuse icon or import FaCar if needed */}
                                Available Vehicles
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {product.vehicle_config.map((v: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                                        <span className="font-semibold text-slate-800">{v.type}</span>
                                        <div className="text-xs text-slate-500 text-right">
                                            {v.max_passengers && <div>Max {v.max_passengers} Pax</div>}
                                            {v.luggage_capacity && <div>{v.luggage_capacity} Bags</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Inclusions & Exclusions */}
                    {(product.inclusions?.length || product.exclusions?.length) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {product.inclusions && product.inclusions.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                        What's Included
                                    </h4>
                                    <ul className="space-y-1">
                                        {Array.isArray(product.inclusions) ? product.inclusions.map((item, i) => (
                                            <li key={i} className="text-sm text-slate-600 flex items-start">
                                                <span className="mr-2 text-green-500">✓</span> {item}
                                            </li>
                                        )) : <li className="text-sm text-slate-600">{String(product.inclusions)}</li>}
                                    </ul>
                                </div>
                            )}
                            {product.exclusions && product.exclusions.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                                        What's Excluded
                                    </h4>
                                    <ul className="space-y-1">
                                        {Array.isArray(product.exclusions) ? product.exclusions.map((item, i) => (
                                            <li key={i} className="text-sm text-slate-600 flex items-start">
                                                <span className="mr-2 text-red-500">✕</span> {item}
                                            </li>
                                        )) : <li className="text-sm text-slate-600">{String(product.exclusions)}</li>}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : null}

                    {/* Supplier Information (Conditional) */}
                    {showContactInfo && (
                        <div className="border-t border-slate-200 pt-6 animate-in slide-in-from-top-4 duration-300">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FaBuilding className="text-blue-600" />
                                Supplier Contact
                            </h3>

                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-6">
                                <div>
                                    <h4 className="font-bold text-lg mb-1">{supplier.company_name}</h4>
                                    {supplier.description && <p className="text-slate-600 text-sm">{supplier.description}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {supplier.contact_email && (
                                        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors shadow-sm">
                                            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                                <FaEnvelope />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs text-slate-500 font-bold uppercase">Email</p>
                                                <a href={`mailto:${supplier.contact_email}`} className="text-slate-900 hover:text-blue-600 font-medium truncate block">
                                                    {supplier.contact_email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {supplier.website_url && (
                                        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-purple-300 transition-colors shadow-sm">
                                            <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                                                <FaGlobe />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs text-slate-500 font-bold uppercase">Website</p>
                                                <a href={supplier.website_url} target="_blank" rel="noopener noreferrer" className="text-slate-900 hover:text-purple-600 font-medium truncate block">
                                                    {supplier.website_url}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-slate-200 p-6">
                    <div className="flex gap-3">
                        {(productUrl || supplier.website_url) && (
                            <button
                                onClick={() => {
                                    const url = productUrl || supplier.website_url
                                    if (url) window.open(url, '_blank', 'noopener,noreferrer')
                                }}
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <FaGlobe />
                                Visit Website
                            </button>
                        )}

                        <button
                            onClick={handleWriteReview}
                            className="flex-1 py-3 px-6 bg-white border-2 border-slate-200 hover:border-yellow-400 hover:bg-yellow-50 text-slate-700 hover:text-yellow-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            <FaStar className="text-slate-400 group-hover:text-yellow-400 transition-colors" />
                            Write Review
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Lightbox Overlay */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2 z-50"
                        title="Close"
                    >
                        <FaTimes className="text-4xl" />
                    </button>
                    <div className="relative w-full h-full max-w-7xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <Image
                            src={lightboxImage}
                            alt="Full screen view"
                            fill
                            className="object-contain"
                            quality={100}
                            sizes="100vw"
                            priority
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
