import { FaExternalLinkAlt, FaTimes, FaBuilding, FaEnvelope, FaGlobe, FaStar, FaMapMarkerAlt, FaTag } from 'react-icons/fa'

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

    const handleWriteReview = () => {
        // Placeholder for review functionality
        alert('Review feature coming soon!')
    }

    const price = product.starting_price ?? product.base_price

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-t-2xl flex items-start justify-between shadow-md">
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
                <div className="p-6 space-y-8">
                    {/* Images Grid */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2 relative aspect-video rounded-xl overflow-hidden shadow-md">
                                <img
                                    src={images[0]}
                                    alt={product.product_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {images.slice(1).map((img, idx) => (
                                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden shadow-sm">
                                    <img
                                        src={img}
                                        alt={`${product.product_name} ${idx + 2}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ))}
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
                        {price !== undefined && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold text-center">Starting From</p>
                                <p className="text-lg font-bold text-slate-800 text-center text-blue-600">
                                    {product.currency} {price}
                                </p>
                            </div>
                        )}
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
                    </div>

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
                <div className="space-y-3 pt-4 border-t border-slate-200">
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
        </div>
    )
}
