'use client'

import { FaMapMarkerAlt, FaHeart, FaRegHeart } from 'react-icons/fa'
import { useCurrency } from '@/context/CurrencyContext'

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
}

type ProductCardProps = {
    product: Product
    onBook: (product: Product) => void
    isWishlisted?: boolean
    onToggleWishlist?: (id: string) => void
}

export default function ProductCard({ product, onBook, isWishlisted = false, onToggleWishlist }: ProductCardProps) {
    const { convertPrice, symbol } = useCurrency()
    const agentPrice = product.agent_price || (product.suggested_retail_price * 0.8)

    return (
        <div className="group bg-[#1A1A20] rounded-xl overflow-hidden border border-white/5 hover:border-teal-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-900/10 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${product.photo_url_1 || '/placeholder-image.jpg'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A20] via-transparent to-transparent opacity-80" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide text-white border border-white/10">
                    {product.product_category}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggleWishlist?.(product.id)
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20 transition-colors text-white"
                >
                    {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                </button>

                {/* Location Overlay */}
                <div className="absolute bottom-3 left-3 flex items-center text-xs text-white/90 font-medium">
                    <FaMapMarkerAlt className="mr-1 text-teal-400" />
                    {product.city}, {product.country_code}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-teal-400 transition-colors">
                    {product.product_name}
                </h3>
                <p className="text-gray-400 text-xs line-clamp-2 mb-4 flex-grow">
                    {product.description}
                </p>

                {/* Price & Action */}
                <div className="pt-4 border-t border-white/5 flex items-end justify-between mt-auto">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Agent Price</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-teal-400">
                                {symbol} {convertPrice(agentPrice, product.currency)}
                            </span>
                            <span className="text-xs text-gray-600 line-through">
                                {symbol} {convertPrice(product.suggested_retail_price, product.currency)}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => onBook(product)}
                        className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-teal-500 hover:text-white transition-all transform hover:-translate-y-0.5 shadow-lg shadow-white/5 hover:shadow-teal-500/20"
                    >
                        Request
                    </button>
                </div>
            </div>
        </div>
    )
}
