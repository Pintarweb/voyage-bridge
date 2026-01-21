'use client'

import React, { useState } from 'react'
import { FaSearch, FaFilter, FaPlus, FaFolder, FaBox, FaArchive, FaEye, FaHeart, FaMapMarkerAlt, FaEdit, FaTrashRestore, FaFileAlt, FaTrash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import MicroSurveyToast from '@/components/feedback/MicroSurveyToast'

export default function ProductTab({ products, supplier, content, onProductUpdate, onOpenSlotModal }: { products: any[], supplier: any, content: any, onProductUpdate: () => void, onOpenSlotModal: () => void }) {
    const router = useRouter()
    const supabase = createClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all') // 'all', 'active', 'archived', 'draft'
    const [showSurvey, setShowSurvey] = useState(false)

    // Mock Folders State
    const [folders, setFolders] = useState([
        { id: 1, name: 'Summer 2025', count: 3 },
        { id: 2, name: 'VIP Packages', count: 1 },
        { id: 3, name: 'Archive 2024', count: 12 }
    ])

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === 'all' || p.status === filterStatus
        return matchesSearch && matchesStatus
    })

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

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        // Confirmation Logic
        if (newStatus === 'active') {
            const message = "Are you sure you want to restore and publish this product? It will become visible to all agents."
            if (!confirm(message)) return
        } else if (newStatus === 'archived') {
            if (!confirm("Are you sure you want to archive this product? It will no longer be visible.")) return
        } else if (newStatus === 'draft') {
            if (!confirm("Are you sure you want to revert to draft? Agents will no longer see it.")) return
        }

        if (newStatus === 'active') {
            // Check slots
            const activeCount = products.filter(p => p.status === 'active').length
            const totalSlots = supplier?.total_slots || 1
            if (activeCount >= totalSlots) {
                // Slots Full Logic
                // Use a custom alert or modal, then trigger the upgrade modal
                alert("You have reached your active slot limit! \n\nTo publish this product, you need to acquire more slots. \n\nMaximize your reach and sales potential by expanding your inventory now!")
                onOpenSlotModal()
                return
            }
        }

        try {
            const { error } = await supabase
                .from('products')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) {
                console.error('Error updating status:', error)
                throw new Error('Failed to update product status')
            }

            onProductUpdate() // Refresh data in parent
            if (newStatus === 'active') {
                setShowSurvey(true)
            }
        } catch (e) {
            alert('Failed to update product status')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to DELETE this product? This action cannot be undone.")) return
        if (!confirm("Double Confirmation: This product will be permanently removed from your account. Click OK to delete.")) return

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting product:', error)
            alert('Failed to delete product')
        } else {
            onProductUpdate()
        }
    }

    return (
        <div className="space-y-8">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between gap-4 bg-slate-950/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg">
                <div className="flex gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                        <input
                            type="text"
                            placeholder={content.searchPlaceholder || "Search products..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full !pl-14 pr-4 py-3 !bg-slate-900/60 !border !border-white/10 rounded-xl !text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="!pl-14 pr-10 py-3 !bg-slate-900/60 !border !border-white/10 rounded-xl !text-white appearance-none focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 cursor-pointer hover:bg-slate-800 transition-colors"
                        >
                            <option value="all">All Products</option>
                            <option value="active">Active</option>
                            <option value="draft">Drafts</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => alert("Folder creation coming soon!")} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-md">
                        <FaFolder className="text-amber-500" /> New Folder
                    </button>
                    <Link href="/supplier/dashboard/products/create" className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:to-orange-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5">
                        <FaPlus /> New Product
                    </Link>
                </div>
            </div>

            {/* Folders Row (Mock) */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {folders.map(folder => (
                    <div key={folder.id} className="bg-slate-950/40 hover:bg-slate-900 border border-white/5 hover:border-amber-500/30 p-4 rounded-xl cursor-pointer transition-all group">
                        <FaFolder className="text-amber-500/50 group-hover:text-amber-400 mb-3 text-3xl transition-colors" />
                        <div className="font-bold text-slate-200 group-hover:text-white text-sm truncate transition-colors">{folder.name}</div>
                        <div className="text-xs text-slate-500">{folder.count} items</div>
                    </div>
                ))}

                {/* New Folder Placeholder */}
                <button onClick={() => alert("Folder creation coming soon!")} className="bg-slate-950/20 hover:bg-slate-900/40 border-2 border-dashed border-white/10 hover:border-amber-500/50 p-4 rounded-xl cursor-pointer transition-all group flex flex-col items-center justify-center h-full min-h-[120px]">
                    <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-amber-500/20 flex items-center justify-center mb-2 transition-colors">
                        <FaPlus className="text-slate-500 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <div className="font-bold text-slate-400 group-hover:text-amber-400 text-xs uppercase tracking-wider transition-colors">New Folder</div>
                </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        key={product.id}
                        className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group hover:border-amber-500/30 transition-all hover:-translate-y-1 shadow-lg"
                    >
                        {/* Image */}
                        <div className="relative h-48 bg-slate-900">
                            {getMainImage(product.photo_urls) ? (
                                <img src={getMainImage(product.photo_urls)} alt={product.product_name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-700">
                                    <FaBox size={40} />
                                </div>
                            )}
                            <div className="absolute top-3 right-3 flex gap-2">
                                <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase backdrop-blur-md shadow-sm ${product.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    product.status === 'draft' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30' :
                                        'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                    {product.status}
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
                        </div>

                        <div className="p-5">
                            <h3 className="font-bold text-white text-lg mb-1 truncate group-hover:text-amber-400 transition-colors">{product.product_name}</h3>
                            <div className="flex items-center text-xs text-slate-400 mb-4">
                                <FaMapMarkerAlt className="mr-1 text-slate-500" /> {product.city || 'No location'}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-white/5">
                                <div className="text-center border-r border-white/5">
                                    <div className="text-lg font-bold text-white">{product.view_count || 0}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Views</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-white">{product.wishlist_count || 0}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Wishlists</div>
                                </div>
                            </div>

                            <div className="flex gap-2 text-xs font-bold pt-4 border-t border-white/5 mt-4">
                                <Link href={`/supplier/dashboard/products/create?id=${product.id}`} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-lg text-white transition-all flex items-center justify-center gap-1 hover:shadow-md">
                                    <FaEdit /> Edit
                                </Link>

                                {product.status === 'active' && (
                                    <button onClick={() => handleUpdateStatus(product.id, 'draft')} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1" title="Set to Draft">
                                        <FaFileAlt /> Draft
                                    </button>
                                )}

                                {product.status === 'draft' && (
                                    <button onClick={() => handleUpdateStatus(product.id, 'active')} className="flex-1 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-emerald-400 transition-all flex items-center justify-center gap-1 hover:shadow-md" title="Publish">
                                        <FaPlus /> Publish
                                    </button>
                                )}

                                {product.status !== 'archived' ? (
                                    <button onClick={() => handleUpdateStatus(product.id, 'archived')} className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-lg text-slate-400 hover:text-red-400 transition-all" title="Archive">
                                        <FaArchive />
                                    </button>
                                ) : (
                                    <button onClick={() => handleUpdateStatus(product.id, 'draft')} className="flex-1 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-emerald-400 transition-all flex items-center justify-center gap-1" title="Restore to Draft">
                                        <FaTrashRestore /> Restore
                                    </button>
                                )}

                                <button onClick={() => handleDelete(product.id)} className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-all hover:shadow-md" title="Permanently Delete">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 border border-white/5 mb-4 shadow-inner">
                            <FaBox className="text-slate-600 text-3xl" />
                        </div>
                        <h3 className="text-white font-bold text-lg">No products found</h3>
                        <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
            <MicroSurveyToast visible={showSurvey} onClose={() => setShowSurvey(false)} />
        </div>
    )
}
