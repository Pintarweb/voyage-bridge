'use client'

import { FaMapMarkerAlt, FaHeart, FaRegHeart } from 'react-icons/fa'

type Product = {
    id: string
    product_name: string
    product_description: string
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
    const agentPrice = product.agent_price || (product.suggested_retail_price * 0.8)

    return (
        <div className="group bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-teal-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-900/10 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${product.photo_url_1 || '/placeholder-image.jpg'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                    {product.product_category}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggleWishlist?.(product.id)
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20 transition-colors text-white"
                >
                    {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                </button>

                {/* Location Overlay */}
                <div className="absolute bottom-4 left-4 flex items-center text-xs text-white/90 font-medium">
                    <FaMapMarkerAlt className="mr-1 text-teal-400" />
                    {product.city}, {product.country_code}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-teal-400 transition-colors">
                    {product.product_name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
                    {product.product_description}
                </p>

                {/* Price & Action */}
                <div className="pt-4 border-t border-gray-800 flex items-end justify-between mt-auto">
                    <div>
                        <p className="text-xs text-gray-500 mb-0.5">Agent Price</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-teal-400">
                                {product.currency} {agentPrice.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-600 line-through">
                                {product.currency} {product.suggested_retail_price}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => onBook(product)}
                        className="px-5 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-teal-500 hover:text-white transition-all transform hover:-translate-y-0.5 shadow-lg shadow-white/5 hover:shadow-teal-500/20"
                    >
                        Request
                    </button>
                </div>
            </div>
        </div>
    )
}
