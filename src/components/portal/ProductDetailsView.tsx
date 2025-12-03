'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { FaArrowLeft, FaMapMarkerAlt, FaBuilding, FaMoneyBillWave } from 'react-icons/fa'
import { useCurrency } from '@/context/CurrencyContext'
import Image from 'next/image'

type Product = {
    id: string
    product_name: string
    description: string
    photo_url_1: string
    city: string
    country_code: string
    currency: string
    suggested_retail_price: number
    agent_price?: number
    product_category: string
    supplier: {
        company_name: string
        contact_email: string
    }
}

export default function ProductDetailsView({ product }: { product: Product }) {
    const router = useRouter()
    const { convertPrice, symbol } = useCurrency()
    const agentPrice = product.agent_price || (product.suggested_retail_price * 0.8)

    // Increment view count on mount
    const hasViewed = useRef(false)

    useEffect(() => {
        if (hasViewed.current) return
        hasViewed.current = true

        const incrementView = async () => {
            console.log('Incrementing view count for:', product.id)
            try {
                const res = await fetch('/api/products/view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product_id: product.id })
                })
                console.log('View increment response:', res.status)
            } catch (error) {
                console.error('Error incrementing view count:', error)
            }
        }
        incrementView()
    }, [product.id])

    return (
        <div className="min-h-screen bg-[#101015] text-white p-8">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <FaArrowLeft /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${product.photo_url_1 || '/placeholder-image.jpg'})` }}
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider rounded-full border border-teal-500/20">
                                    {product.product_category}
                                </span>
                                <span className="flex items-center gap-1 text-gray-400 text-sm">
                                    <FaMapMarkerAlt className="text-teal-500" />
                                    {product.city}, {product.country_code}
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                                {product.product_name}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-400">
                                <FaBuilding className="text-gray-500" />
                                <span>Provided by <span className="text-white font-medium">{product.supplier?.company_name || 'Unknown Supplier'}</span></span>
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none text-gray-300">
                            <p>{product.description}</p>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-[#1A1A20] p-6 rounded-xl border border-white/10 space-y-4">
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wider">Agent Net Price</p>
                                    <p className="text-3xl font-bold text-teal-400">
                                        {symbol} {convertPrice(agentPrice, product.currency)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">RRP</p>
                                    <p className="text-lg text-gray-400 line-through">
                                        {symbol} {convertPrice(product.suggested_retail_price, product.currency)}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-lg transition-all transform hover:-translate-y-1 shadow-lg shadow-teal-900/20">
                                    Request Booking
                                </button>
                                <p className="text-center text-xs text-gray-500 mt-3">
                                    *Prices are converted to your selected currency ({symbol})
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
