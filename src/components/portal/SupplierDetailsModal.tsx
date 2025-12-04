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
}

type SupplierDetailsModalProps = {
    supplier: Supplier
    product: Product
    isOpen: boolean
    onClose: () => void
    productUrl?: string
}

export default function SupplierDetailsModal({ supplier, product, isOpen, onClose, productUrl }: SupplierDetailsModalProps) {
    if (!isOpen) return null

    // Parse photo_urls - handle both array and JSON string
    let productImage = ''
    if (Array.isArray(product.photo_urls)) {
        productImage = product.photo_urls[0] || ''
    } else if (typeof product.photo_urls === 'string') {
        try {
            const images = JSON.parse(product.photo_urls)
            productImage = images[0] || ''
        } catch {
            productImage = ''
        }
    }

    const handleWriteReview = () => {
        // Placeholder for review functionality
        alert('Review feature coming soon!')
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-600 text-white p-6 rounded-t-2xl flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <FaBuilding className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{supplier.company_name}</h2>
                            <p className="text-blue-100 text-sm">Supplier Information</p>
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
                <div className="p-6 space-y-6">
                    {/* Product Details */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-xl border-2 border-blue-200">
                        <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <FaTag className="text-blue-600" />
                            Product Details
                        </h3>
                        <div className="flex gap-4">
                            {productImage && (
                                <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-white shadow-md">
                                    <img
                                        src={productImage}
                                        alt={product.product_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-bold text-slate-900 mb-2">{product.product_name}</h4>
                                <p className="text-sm text-slate-600 mb-2 line-clamp-2">{product.product_description}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-blue-500" />
                                        <span>{product.city}, {product.country_code}</span>
                                    </div>
                                    <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                        {product.product_category}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Supplier Details */}
                    {supplier.description && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">About Supplier</h3>
                            <p className="text-slate-600 leading-relaxed">{supplier.description}</p>
                        </div>
                    )}

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {supplier.contact_email && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 font-bold uppercase">Email</p>
                                    <a href={`mailto:${supplier.contact_email}`} className="text-slate-900 hover:text-blue-600 font-medium truncate block">
                                        {supplier.contact_email}
                                    </a>
                                </div>
                            </div>
                        )}

                        {supplier.website_url && (
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                                    <FaGlobe />
                                </div>
                                <div>
                                    <p className="text-xs text-purple-600 font-bold uppercase">Website</p>
                                    <a href={supplier.website_url} target="_blank" rel="noopener noreferrer" className="text-slate-900 hover:text-purple-600 font-medium truncate block">
                                        {supplier.website_url}
                                    </a>
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
        </div>
    )
}
