'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
    product_url?: string
    supplier?: {
        id: string
        company_name: string
        description: string | null
        website_url: string | null
        contact_email: string | null
    } | null
    // Extended fields
    duration?: string
    activity_level?: string
    max_group_size?: number
    starting_price?: number
    base_price?: number
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

type ProductCardProps = {
    product: Product
    isWishlisted?: boolean
    onToggleWishlist?: (id: string) => void
}

export default function ProductCard({ product, isWishlisted = false, onToggleWishlist }: ProductCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showContactInfo, setShowContactInfo] = useState(false)

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

    const incrementViewCount = async () => {
        try {
            await fetch('/api/products/view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: product.id })
            })
        } catch (error) {
            console.error('Error incrementing view count:', error)
        }
    }

    const handleCardClick = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault()
            // Don't trigger if clicking navigation buttons
            if ((e.target as HTMLElement).closest('button')) return
        }

        await incrementViewCount()

        if (!product.supplier) return

        setShowContactInfo(false)
        setIsModalOpen(true)
    }

    const handleRequest = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // Increment view count regardless of supplier status
        await incrementViewCount()

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

            // Show supplier modal with contact info
            setShowContactInfo(true)
            setIsModalOpen(true)
        } catch (error) {
            console.error('Error tracking click:', error)
            // Still show modal even if tracking fails
            setShowContactInfo(true)
            setIsModalOpen(true)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div
                className="group relative bg-slate-900/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col h-full cursor-pointer"
                onClick={handleCardClick}
            >
                {/* Image Carousel */}
                <div className="relative h-64 overflow-hidden bg-slate-800">
                    <div className="block h-full w-full">
                        {images.length > 0 ? (
                            <>
                                <Image
                                    src={images[currentImageIndex]}
                                    alt={product.product_name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-500 italic text-sm">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                        <FaMapMarkerAlt className="opacity-20" />
                                    </div>
                                    Visuals pending
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-md shadow-lg z-10">
                        {product.product_category}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleWishlist?.(product.id)
                        }}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/10 hover:bg-slate-950/60 transition-all shadow-xl z-10"
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        {isWishlisted ? (
                            <FaHeart className="text-red-500 text-lg drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        ) : (
                            <FaRegHeart className="text-white text-lg" />
                        )}
                    </button>

                    {/* Image Navigation */}
                    {images.length > 1 && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    prevImage()
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/10 hover:bg-slate-950/60 transition-all shadow-xl z-20"
                                aria-label="Previous image"
                            >
                                <FaChevronLeft className="text-white text-xs" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    nextImage()
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/10 hover:bg-slate-950/60 transition-all shadow-xl z-20"
                                aria-label="Next image"
                            >
                                <FaChevronRight className="text-white text-xs" />
                            </button>

                            {/* Image Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setCurrentImageIndex(index)
                                        }}
                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex
                                            ? 'bg-amber-400 w-4'
                                            : 'bg-white/30 hover:bg-white/50'
                                            }`}
                                        aria-label={`Go to image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Location Overlay */}
                    <div className="absolute bottom-4 left-4 flex items-center text-[10px] text-white font-black uppercase tracking-tighter bg-slate-950/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg z-10">
                        <FaMapMarkerAlt className="mr-1.5 text-amber-500 animate-pulse" />
                        {product.city}, {product.country_code}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-transparent to-slate-950/50">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white leading-tight group-hover:text-amber-400 transition-colors uppercase tracking-tight line-clamp-2">
                            {product.product_name}
                        </h3>
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed mb-6 flex-grow line-clamp-3">
                        {product.product_description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Starting at</span>
                            <span className="text-lg font-black text-white">{product.currency || '$'}{product.starting_price || product.base_price || '---'}</span>
                        </div>

                        <button
                            onClick={handleRequest}
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-white text-slate-950 hover:bg-amber-400 text-[10px] font-black uppercase tracking-tight rounded-lg transition-all duration-300 transform group-hover:scale-105 disabled:opacity-50"
                        >
                            {isLoading ? '...' : 'Reserve Access'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Supplier Details Modal */}
            {product.supplier && (
                <SupplierDetailsModal
                    supplier={product.supplier}
                    product={product}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    productUrl={product.product_url}
                    showContactInfo={showContactInfo}
                />
            )}
        </>
    )
}
