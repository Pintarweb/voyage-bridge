'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaExternalLinkAlt, FaBuilding, FaBoxOpen, FaGlobe, FaCertificate, FaHeart, FaRegHeart, FaHeadset, FaMapMarkerAlt } from 'react-icons/fa'

type Supplier = {
    id: string
    company_name: string
    description: string
    website_url: string
    supplier_type: string
    product_count: number
    city?: string
    country_code?: string
    contact_email?: string
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
    const router = useRouter()

    const handleCardClick = () => {
        router.push(`/agent-portal/supplier/${supplier.id}`)
    }

    const handleVisitWebsite = async (e: React.MouseEvent) => {
        e.stopPropagation()
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

    const handleToggleSave = async (e: React.MouseEvent) => {
        e.stopPropagation()
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

    // Dynamic description generation
    const displayDescription = supplier.description ||
        `${supplier.company_name} is a premier ${supplier.supplier_type} partner ${supplier.city ? `based in ${supplier.city}` : 'operating globally'}, providing exclusive access and premium services to the ArkAlliance network.`

    return (
        <div
            onClick={handleCardClick}
            className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 hover:border-amber-500/50 transition-all duration-500 group shadow-2xl flex flex-col gap-6 cursor-pointer"
        >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -z-10 group-hover:bg-amber-500/10 transition-all duration-500" />

            {/* HEADER SECTION: Full Width for Title */}
            <div className="w-full">
                {/* Badge & Category */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/20 flex items-center gap-1.5 whitespace-nowrap">
                        <FaCertificate className="text-[12px]" />
                        Founding Member
                    </span>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        {supplier.supplier_type}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2 group-hover:text-amber-400 transition-colors tracking-tight">
                    {supplier.company_name}
                </h1>

                {/* Location */}
                {(supplier.city || supplier.country_code) && (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <FaMapMarkerAlt className="text-amber-500" />
                        <span>{supplier.city}{supplier.city && supplier.country_code ? ', ' : ''}{supplier.country_code}</span>
                    </div>
                )}
            </div>

            {/* CONTENT SECTION: Description/Stats Left, Buttons Right (on large screens) */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 border-t border-white/5 pt-6">

                {/* Left: Stats & Description */}
                <div className="flex-1 space-y-4">
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

                    <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                        {displayDescription}
                    </p>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col sm:flex-row xl:flex-col gap-3 w-full xl:w-auto xl:min-w-[200px]">
                    <button
                        onClick={handleVisitWebsite}
                        disabled={isLoading || !supplier.website_url}
                        className="group/btn relative overflow-hidden flex-1 xl:w-full py-2.5 bg-white text-slate-950 hover:bg-amber-400 transition-all duration-300 font-black uppercase tracking-normal text-xs rounded-lg shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                        ) : (
                            <>
                                <FaExternalLinkAlt className="text-xs group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                Visit Official Site
                            </>
                        )}
                    </button>

                    {supplier.contact_email && (
                        <a
                            href={`mailto:${supplier.contact_email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="group/email flex-1 xl:w-full py-2.5 bg-slate-800 text-white hover:bg-slate-700 transition-all duration-300 font-bold uppercase tracking-wide text-xs rounded-lg shadow-lg flex items-center justify-center gap-2 border border-white/5"
                        >
                            <FaHeadset className="text-amber-500 group-hover/email:rotate-12 transition-transform text-xs" />
                            Contact Supplier
                        </a>
                    )}

                    <button
                        onClick={handleToggleSave}
                        disabled={isSaving}
                        className={`w-full py-2 border rounded-lg font-bold uppercase tracking-wide text-[10px] transition-all flex items-center justify-center gap-2 ${isSaved
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
