'use client'

import React from 'react'
import { FaPlus, FaChartLine, FaCrown, FaEye, FaHeart, FaMapMarkerAlt, FaEdit, FaBox } from 'react-icons/fa'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function OverviewTab({ supplier, products, content, handleLogout }: { supplier: any, products: any[], content: any, handleLogout: () => void }) {

    // Derived Stats
    const totalViews = products.reduce((acc, curr) => acc + (curr.view_count || 0), 0)
    const totalWishlisted = products.reduce((acc, curr) => acc + (curr.wishlist_count || 0), 0)
    const activeProducts = products.filter(p => p.status === 'active')
    const activeCount = activeProducts.length
    const totalSlots = supplier?.total_slots || 1
    const emptySlots = Math.max(0, totalSlots - activeCount)

    const getMainImage = (urls: any) => {
        try {
            if (Array.isArray(urls) && urls.length > 0) return urls[0]
            if (typeof urls === 'string') {
                const parsed = JSON.parse(urls)
                return parsed[0] || null
            }
        } catch (e) { return null }
        return null
    }

    // Only show active products + slots in Overview
    const displayItems = [
        ...activeProducts.map((p: any) => ({ type: 'product', ...p })),
        ...Array.from({ length: emptySlots }).map((_, i) => ({ type: 'slot', id: `slot-${i}` }))
    ]

    return (
        <div className="space-y-8">

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-lg group hover:border-white/20 transition-all">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Products</div>
                    <div className="text-3xl font-bold text-white group-hover:text-amber-400 transition-colors">{products.length}</div>
                </div>
                <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-lg group hover:border-white/20 transition-all">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Views</div>
                    <div className="text-3xl font-bold text-white group-hover:text-amber-400 transition-colors">{totalViews.toLocaleString()}</div>
                </div>
                <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-lg group hover:border-white/20 transition-all">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Wishlisted</div>
                    <div className="text-3xl font-bold text-white group-hover:text-amber-400 transition-colors">{totalWishlisted}</div>
                </div>
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 backdrop-blur-xl border border-amber-500/30 p-5 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                    <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">Active Plan</div>
                    <div className="text-2xl font-bold text-white">Founding Member</div>
                    <FaCrown className="absolute bottom-[-10px] right-[-10px] text-amber-500/20 text-6xl rotate-[-15deg]" />
                </div>
            </div>

            {/* Content Area: Products & Slots */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                    Your Active Inventory
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayItems.map((item: any, idx) => {
                        if (item.type === 'slot') {
                            return (
                                <Link key={item.id} href="/supplier/dashboard/products/create" className="group h-full min-h-[250px] border-2 border-dashed border-white/10 rounded-2xl hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 group-hover:bg-amber-500/20 group-hover:border-amber-500/30 flex items-center justify-center transition-all">
                                        <FaPlus className="text-slate-500 group-hover:text-amber-400 text-2xl transition-colors" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-slate-300 font-bold group-hover:text-amber-400 transition-colors">Empty Slot Available</div>
                                        <div className="text-xs text-slate-500 mt-1">Click to add new product</div>
                                    </div>
                                </Link>
                            )
                        }

                        // Product Card
                        return (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
                                key={item.id}
                                className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group hover:border-amber-500/30 transition-all hover:-translate-y-1 shadow-lg"
                            >
                                <div className="relative h-48 bg-slate-900">
                                    {getMainImage(item.photo_urls) ? (
                                        <img src={getMainImage(item.photo_urls)} alt={item.product_name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-700">
                                            <FaBox size={40} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg text-xs font-bold uppercase backdrop-blur-md shadow-sm">
                                            Active
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-white text-lg mb-1 truncate group-hover:text-amber-400 transition-colors">{item.product_name}</h3>
                                    <div className="flex items-center text-xs text-slate-400 mb-4">
                                        <FaMapMarkerAlt className="mr-1 text-slate-500" /> {item.city || 'No location'}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-white/5">
                                        <div className="text-center border-r border-white/5">
                                            <div className="text-lg font-bold text-white">{item.view_count || 0}</div>
                                            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Views</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-white">{item.wishlist_count || 0}</div>
                                            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Wishlists</div>
                                        </div>
                                    </div>
                                    <Link href={`/supplier/dashboard/products/create?id=${item.id}`} className="block w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-xl text-sm font-bold text-white transition-all text-center group-hover/btn shadow-md">
                                        Edit Product
                                    </Link>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
