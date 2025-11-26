'use client'

import { useState } from 'react'
import { FaExternalLinkAlt, FaBuilding, FaBoxOpen } from 'react-icons/fa'

type Supplier = {
    id: string
    company_name: string
    description: string
    website_url: string
    supplier_type: string
    product_count: number
}

export default function SupplierCard({ supplier }: { supplier: Supplier }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleVisitWebsite = async () => {
        if (!supplier.website_url) {
            alert('This supplier has not provided a website URL.')
            return
        }

        setIsLoading(true)

        try {
            // Track the click
            const response = await fetch('/api/track-supplier-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    supplier_id: supplier.id,
                    product_id: null
                })
            })

            const data = await response.json()

            // Open supplier website in new tab
            if (data.redirect_url) {
                window.open(data.redirect_url, '_blank', 'noopener,noreferrer')
            } else {
                // Fallback to direct URL
                window.open(supplier.website_url, '_blank', 'noopener,noreferrer')
            }
        } catch (error) {
            console.error('Error tracking click:', error)
            // Still open the website even if tracking fails
            window.open(supplier.website_url, '_blank', 'noopener,noreferrer')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all group shadow-sm hover:shadow-md">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {supplier.company_name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-1 bg-muted rounded border border-border">
                            {supplier.supplier_type}
                        </span>
                        <span className="flex items-center gap-1">
                            <FaBoxOpen />
                            {supplier.product_count} products
                        </span>
                    </div>
                </div>
                <FaBuilding className="text-2xl text-muted-foreground/50" />
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm mb-6 line-clamp-3 min-h-[60px]">
                {supplier.description || 'No description available.'}
            </p>

            {/* Action Button */}
            <button
                onClick={handleVisitWebsite}
                disabled={isLoading || !supplier.website_url}
                className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-primary-foreground font-bold rounded-lg transition-all transform hover:-translate-y-0.5 disabled:transform-none shadow-md disabled:shadow-none flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>Processing...</>
                ) : (
                    <>
                        <FaExternalLinkAlt />
                        Visit Website
                    </>
                )}
            </button>

            {!supplier.website_url && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                    Website not available
                </p>
            )}
        </div>
    )
}
