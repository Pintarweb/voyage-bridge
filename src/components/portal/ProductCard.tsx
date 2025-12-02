'use client'

import { useState } from 'react'
import { FaMapMarkerAlt, FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import SupplierDetailsModal from './SupplierDetailsModal'

type Product = {
    id: string
    product_name: string
    product_description: string
    photo_urls: string[] | string
    city: string
    country_code: string
    product_category: string
    supplier?: {
        id: string
        company_name: string
        description: string | null
        website_url: string | null
        contact_email: string | null
    } | null
}

type ProductCardProps = {
    product: Product
    isWishlisted?: boolean
    onToggleWishlist?: (id: string) => void
}

export default function ProductCard({ product, isWishlisted = false, onToggleWishlist }: ProductCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Parse photo_urls - handle both array and JSON string
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

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const handleRequest = async () => {
        // If no supplier data, just show an alert
        if (!product.supplier) {
            alert('Supplier information is not available for this product.')
            return
        }

        setIsLoading(true)

        try {
            // Track the click
            await fetch('/api/track-supplier-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    supplier_id: product.supplier.id,
                    product_id: product.id
                })
            })

            // Show supplier modal
            setIsModalOpen(true)
        } catch (error) {
            console.error('Error tracking click:', error)
            // Still show modal even if tracking fails
            setIsModalOpen(true)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl flex flex-col h-full">
                {/* Image Carousel */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                    {images.length > 0 ? (
                        <>
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                            No image available
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide text-slate-700 shadow-md">
                        {product.product_category}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleWishlist?.(product.id)
                        }}
                        className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all shadow-md hover:shadow-lg"
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        {isWishlisted ? (
                            <FaHeart className="text-red-500 text-lg" />
                        ) : (
                            <FaRegHeart className="text-slate-600 text-lg" />
                        )}
                    </button>

                    {/* Image Navigation */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-all shadow-md"
                                aria-label="Previous image"
                            >
                                <FaChevronLeft className="text-slate-700" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-all shadow-md"
                                aria-label="Next image"
                            >
                                <FaChevronRight className="text-slate-700" />
                            </button>
                            {/* Image Indicators */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                                                ? 'bg-white w-6'
                                                : 'bg-white/50 hover:bg-white/75'
                                            }`}
                                        aria-label={`Go to image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Location Overlay */}
                    <div className="absolute bottom-3 left-3 flex items-center text-sm text-white font-medium bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        <FaMapMarkerAlt className="mr-1.5 text-blue-300" />
                        {product.city}, {product.country_code}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {product.product_name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow whitespace-pre-wrap">
                        {product.product_description}
                    </p>

                    {/* Action */}
                    <div className="pt-4 border-t border-slate-200 mt-auto">
                        <button
                            onClick={handleRequest}
                            disabled={isLoading}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-400 disabled:to-slate-400 text-white text-sm font-bold rounded-lg transition-all transform hover:-translate-y-0.5 disabled:transform-none shadow-lg hover:shadow-xl disabled:shadow-none"
                        >
                            {isLoading ? 'Processing...' : 'Request'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Supplier Details Modal */}
            {product.supplier && (
                <SupplierDetailsModal
                    supplier={product.supplier}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    )
}
