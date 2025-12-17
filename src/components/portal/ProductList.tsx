'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProductCard from '@/components/portal/ProductCard'

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
    }
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

    // Hotel fields
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

export default function ProductList({ products, initialWishlist }: { products: Product[], initialWishlist: string[] }) {
    const router = useRouter()
    const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set(initialWishlist))
    const [isUpdating, setIsUpdating] = useState<string | null>(null)

    const handleToggleWishlist = async (productId: string) => {
        if (isUpdating) return // Prevent multiple simultaneous updates

        setIsUpdating(productId)
        const isCurrentlyWishlisted = wishlistedIds.has(productId)

        // Optimistic update
        setWishlistedIds(prev => {
            const newSet = new Set(prev)
            if (isCurrentlyWishlisted) {
                newSet.delete(productId)
            } else {
                newSet.add(productId)
            }
            return newSet
        })

        try {
            const response = await fetch('/api/wishlist', {
                method: isCurrentlyWishlisted ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId })
            })

            if (!response.ok) {
                // Revert on error
                setWishlistedIds(prev => {
                    const newSet = new Set(prev)
                    if (isCurrentlyWishlisted) {
                        newSet.add(productId)
                    } else {
                        newSet.delete(productId)
                    }
                    return newSet
                })
                console.error('Failed to update wishlist')
            }
        } catch (error) {
            // Revert on error
            setWishlistedIds(prev => {
                const newSet = new Set(prev)
                if (isCurrentlyWishlisted) {
                    newSet.add(productId)
                } else {
                    newSet.delete(productId)
                }
                return newSet
            })
            console.error('Error updating wishlist:', error)
        } finally {
            setIsUpdating(null)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistedIds.has(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                />
            ))}
        </div>
    )
}
