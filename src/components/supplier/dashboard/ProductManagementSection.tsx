'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { FaPlus, FaEye, FaHeart, FaBox, FaArchive, FaEdit } from 'react-icons/fa'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import ProductHistoryTable from '@/components/supplier/product-history/ProductHistoryTable'

// Mock Data for Sparklines (moved from page.tsx)
const MOCK_SPARK_DATA = [
    { value: 10 }, { value: 15 }, { value: 12 }, { value: 20 }, { value: 25 }, { value: 22 }, { value: 30 }
]

interface ProductManagementSectionProps {
    content: any
    activeProducts: any[]
    historyProducts: any[]
    activeTab: 'active' | 'history'
    setActiveTab: (tab: 'active' | 'history') => void
    totalSlots: number
    handleArchive: (id: string) => void
    handleRestore: (id: string) => void
    supplier: any
    language: string
    translateCity: (city: string) => string
}

export default function ProductManagementSection({
    content,
    activeProducts,
    historyProducts,
    activeTab,
    setActiveTab,
    totalSlots,
    handleArchive,
    handleRestore,
    supplier,
    language,
    translateCity
}: ProductManagementSectionProps) {
    const router = useRouter()
    const usedSlots = activeProducts.length
    const emptySlotsCount = Math.max(0, totalSlots - usedSlots)
    const emptySlots = Array.from({ length: emptySlotsCount })

    return (
        <div className="space-y-6">
            {/* Header / Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Products Management</h2>
                    <p className="text-muted-foreground text-sm">Manage your inventory and track performance.</p>
                </div>
                <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`
                            px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                            ${activeTab === 'active'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                            }
                        `}
                    >
                        {content.activeInventory}
                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                            }`}>
                            {activeProducts.length} / {totalSlots}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`
                            px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                            ${activeTab === 'history'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                            }
                        `}
                    >
                        {content.productHistory}
                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === 'history' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                            }`}>
                            {historyProducts.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* Content Content */}
            {activeTab === 'active' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Active Products */}
                    {activeProducts.map((product) => (
                        <div key={product.id} className="bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-lg border border-orange-200 overflow-hidden hover:border-orange-300 hover:shadow-md transition-all duration-300 flex flex-col">
                            {/* Top Section: Details */}
                            <div className="p-6 flex flex-col md:flex-row justify-between items-start flex-grow">
                                <div className="flex items-start space-x-4 w-full">
                                    {product.photo_urls && product.photo_urls[0] ? (
                                        <img src={product.photo_urls[0]} alt={product.product_name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                                    ) : (
                                        <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center text-muted-foreground flex-shrink-0">No Img</div>
                                    )}
                                    <div className="flex-grow min-w-0">
                                        <h3 className="text-lg font-semibold text-foreground truncate" title={product.product_name}>
                                            {product.product_name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {translateCity(product.city)}, {new Intl.DisplayNames([language], { type: 'region' }).of(product.country_code)}
                                        </p>
                                        <div className="mt-2 flex flex-col space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                    {content.statusValues[product.status as keyof typeof content.statusValues] || product.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex flex-col space-y-2 ml-4 flex-shrink-0">
                                    <button
                                        className="px-3 py-1.5 border border-blue-500 rounded text-sm text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors w-full text-center flex items-center justify-center"
                                        onClick={() => router.push(`/supplier/dashboard/products/create?edit=true&id=${product.id}`)}
                                    >
                                        <FaEdit className="mr-1.5" />
                                        {content.edit}
                                    </button>
                                    <button
                                        className="px-3 py-1.5 border border-border rounded text-sm text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-colors w-full text-center flex items-center justify-center"
                                        onClick={() => handleArchive(product.id)}
                                    >
                                        <FaArchive className="mr-1.5" />
                                        {content.archive}
                                    </button>
                                </div>
                            </div>
                            {/* Bottom Section: Performance Strip */}
                            <div className="bg-muted/30 border-t border-border px-6 py-3 grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-muted rounded-full text-blue-500">
                                        <FaEye />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-medium">{content.views}</p>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg font-bold text-foreground">{product.view_count || 0}</span>
                                            <div className="w-16 h-8">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={MOCK_SPARK_DATA}>
                                                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-muted rounded-full text-pink-500">
                                        <FaHeart />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-medium">{content.wishlisted}</p>
                                        <p className="text-lg font-bold text-foreground">{product.wishlist_count || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty Slots */}
                    {emptySlots.map((_, index) => (
                        <div key={`empty-slot-${index}`} className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[200px] hover:border-primary/50 hover:bg-muted/5 transition-all group cursor-pointer" onClick={() => router.push('/supplier/dashboard/products/create')}>
                            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FaPlus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">Empty Slot</h3>
                            <p className="text-sm text-muted-foreground mb-4">You have an available slot to list a new product.</p>
                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                                {content.createProduct}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                /* History Tab */
                <div className="bg-card rounded-lg p-6 border border-border">
                    <ProductHistoryTable
                        products={historyProducts}
                        onRestore={handleRestore}
                        onArchive={() => { }}
                        supplierType={supplier?.supplier_type}
                    />
                </div>
            )}
        </div>
    )
}
