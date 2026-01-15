'use client'

import { useState } from 'react'
import { FaExternalLinkAlt, FaBuilding, FaBoxOpen, FaGlobe, FaCertificate, FaHeart, FaRegHeart } from 'react-icons/fa'

type Supplier = {
    id: string
    company_name: string
    description: string
    website_url: string
    supplier_type: string
    product_count: number
}

export default function SupplierCard({
    supplier,
    initialIsSaved = false
}: {
    supplier: Supplier,
    initialIsSaved?: boolean
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSaved, setIsSaved] = useState(initialIsSaved)
    const [isSaving, setIsSaving] = useState(false)

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

    const handleToggleSave = async () => {
        setIsSaving(true)
        const nextState = !isSaved

        try {
            const response = await fetch('/api/agent/saved-suppliers', {
                method: nextState ? 'POST' : 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ supplier_id: supplier.id })
            })

            if (response.ok) {
                setIsSaved(nextState)
            } else {
                console.error('Failed to toggle save status')
            }
        } catch (error) {
            console.error('Error toggling save status:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 hover:border-amber-500/30 transition-all duration-500 group shadow-2xl">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -z-10 group-hover:bg-amber-500/10 transition-all duration-500" />

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="flex-1 space-y-4 min-w-0">
                    {/* Badge & Category */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/20 flex items-center gap-1.5 whitespace-nowrap">
                            <FaCertificate className="text-[12px]" />
                            Founding Member
                        </span>
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                            {supplier.supplier_type}
                        </span>
                    </div>

                    {/* Title & Stats */}
                    <div className="min-w-0">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 group-hover:text-amber-400 transition-colors truncate">
                            {supplier.company_name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-2 whitespace-nowrap">
                                <div className="p-1.5 bg-white/5 rounded-md">
                                    <FaBoxOpen className="text-amber-500/70" />
                                </div>
                                <b className="text-white">{supplier.product_count}</b> <span className="hidden sm:inline">Active Products</span>
                                <span className="sm:hidden">Prods</span>
                            </span>
                            {supplier.website_url && (
                                <span className="flex items-center gap-2 whitespace-nowrap">
                                    <div className="p-1.5 bg-white/5 rounded-md">
                                        <FaGlobe className="text-blue-400/70" />
                                    </div>
                                    <span className="hidden sm:inline">Verified Website</span>
                                    <span className="sm:hidden">Web</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed max-w-2xl line-clamp-3 md:line-clamp-none">
                        {supplier.description || 'This founding partner provides premium services to the ArkAlliance network. Direct collaboration enabled through the Command Hub.'}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row xl:flex-col gap-3 w-full xl:w-auto xl:min-w-[240px]">
                    <button
                        onClick={handleVisitWebsite}
                        disabled={isLoading || !supplier.website_url}
                        className="group/btn relative overflow-hidden flex-1 xl:w-full py-4 bg-white text-slate-950 hover:bg-amber-400 transition-all duration-300 font-black uppercase tracking-tighter rounded-xl shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                        ) : (
                            <>
                                <FaExternalLinkAlt className="text-sm group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                Visit Official Site
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleToggleSave}
                        disabled={isSaving}
                        className={`w-full py-3 border rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${isSaved
                            ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                            }`}
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isSaved ? (
                            <>
                                <FaHeart /> Saved to Partners
                            </>
                        ) : (
                            <>
                                <FaRegHeart /> Save Partner
                            </>
                        )}
                    </button>

                    {!supplier.website_url && (
                        <p className="text-[10px] text-slate-500 text-center font-bold uppercase tracking-widest">
                            Direct channel only
                        </p>
                    )}
                </div>
            </div>

            {/* Decorative Icon */}
            <div className="absolute top-1/2 -right-8 -translate-y-1/2 opacity-5 -rotate-12 group-hover:rotate-0 group-hover:opacity-10 transition-all duration-700 pointer-events-none">
                <FaBuilding className="text-[180px] text-white" />
            </div>
        </div>
    )
}
