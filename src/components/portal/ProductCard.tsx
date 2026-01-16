'use client'

import { useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import SupplierDetailsModal from './SupplierDetailsModal'
import CardImageCarousel from './CardImageCarousel'

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
    starting_price?: number
    base_price?: number
    currency?: string
}

type ProductCardProps = {
    product: Product
    isWishlisted?: boolean
    onToggleWishlist?: (id: string) => void
    onBook?: (product: any) => void
}

export default function ProductCard({ product, isWishlisted = false, onToggleWishlist, onBook }: ProductCardProps) {
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

        await incrementViewCount()

        if (onBook) {
            onBook(product)
            return
        }

        if (!product.supplier) {
            alert('Supplier information is not available for this product.')
            return
        }

        setIsLoading(true)
        try {
            await fetch('/api/track-supplier-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    supplier_id: product.supplier.id,
                    product_id: product.id
                })
            })
            setShowContactInfo(true)
            setIsModalOpen(true)
        } catch (error) {
            console.error('Error tracking click:', error)
            setShowContactInfo(true)
            setIsModalOpen(true)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div
                className="group relative bg-slate-900/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col h-full cursor-pointer"
                onClick={handleCardClick}
            >
                <CardImageCarousel
                    images={images}
                    alt={product.product_name}
                    city={product.city}
                    countryCode={product.country_code}
                    category={product.product_category}
                />

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggleWishlist?.(product.id)
                    }}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/10 hover:bg-slate-950/60 transition-all shadow-xl z-20"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    {isWishlisted ? (
                        <FaHeart className="text-red-500 text-lg drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    ) : (
                        <FaRegHeart className="text-white text-lg" />
                    )}
                </button>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-transparent to-slate-950/30">
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
                            className="px-6 py-2.5 bg-white text-slate-950 hover:bg-amber-400 text-[10px] font-black uppercase tracking-tight rounded-lg transition-all duration-300 transform group-hover:scale-105 disabled:opacity-50 shadow-lg shadow-black/20"
                        >
                            {isLoading ? '...' : (onBook ? 'Book Now' : 'Reserve Access')}
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
