'use client'

import { useState, useMemo } from 'react'
import BookingModal from '@/components/bookings/BookingModal'
import FeaturedProductCarousel from './FeaturedProductCarousel'
import SmartLocationSearch from './SmartLocationSearch'
import CategoryChips from './CategoryChips'
import ProductCard from './ProductCard'

export default function PortalDashboard({ products, agencyName }: { products: any[], agencyName: string }) {
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [wishlist, setWishlist] = useState<Set<string>>(new Set())

    // Smart Search & Filtering
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Smart Search (Fuzzy-ish)
            const searchLower = searchQuery.toLowerCase()
            const matchesSearch = !searchQuery ||
                product.product_name.toLowerCase().includes(searchLower) ||
                product.city?.toLowerCase().includes(searchLower) ||
                product.country_code?.toLowerCase().includes(searchLower) ||
                product.region?.toLowerCase().includes(searchLower)

            // Category Filter
            const matchesCategory = !selectedCategory || product.product_category === selectedCategory

            return matchesSearch && matchesCategory
        })
    }, [products, searchQuery, selectedCategory])

    const handleBook = (product: any) => {
        setSelectedProduct(product)
        setIsBookingModalOpen(true)
    }

    const toggleWishlist = (id: string) => {
        setWishlist(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    // Top 5 for Carousel
    const featuredProducts = products.slice(0, 5)

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

                {/* Header & Welcome */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                            Welcome back, {agencyName}!
                        </h1>
                        <p className="text-gray-400 mt-2 text-lg">
                            Discover exclusive inventory for your premium clients.
                        </p>
                    </div>
                </div>

                {/* Featured Showcase */}
                <FeaturedProductCarousel products={featuredProducts} onBook={handleBook} />

                {/* Search & Filters */}
                <div className="space-y-6 sticky top-4 z-30 bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5 shadow-2xl">
                    <SmartLocationSearch value={searchQuery} onChange={setSearchQuery} />
                    <CategoryChips selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onBook={handleBook}
                            isWishlisted={wishlist.has(product.id)}
                            onToggleWishlist={toggleWishlist}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
                        <p className="text-gray-400">Try adjusting your search or browse our featured collection above.</p>
                    </div>
                )}

                {/* Booking Modal */}
                {selectedProduct && (
                    <BookingModal
                        isOpen={isBookingModalOpen}
                        onClose={() => setIsBookingModalOpen(false)}
                        product={{
                            id: selectedProduct.id,
                            title: selectedProduct.product_name,
                            agent_price: selectedProduct.agent_price || selectedProduct.suggested_retail_price * 0.8
                        }}
                    />
                )}
            </div>
        </div>
    )
}
