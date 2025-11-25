'use client'

import { useState, useEffect } from 'react'
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
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
}

export default function FeaturedProductCarousel({ products, onBook }: { products: Product[], onBook: (product: Product) => void }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const { convertPrice, symbol } = useCurrency()

    // Auto-scroll
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [products.length])

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % products.length)
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)

    if (products.length === 0) return null

    const currentProduct = products[currentIndex]
    const agentPrice = currentProduct.agent_price || (currentProduct.suggested_retail_price * 0.8)

    return (
        <div className="relative w-full h-[280px] rounded-2xl overflow-hidden shadow-2xl group">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform hover:scale-105"
                style={{ backgroundImage: `url(${currentProduct.photo_url_1 || '/placeholder-image.jpg'})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 space-y-2">
                <div className="inline-block px-3 py-1 bg-teal-500 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-1">
                    Featured
                </div>
                <h2 className="text-3xl font-bold text-white leading-tight">
                    {currentProduct.product_name}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span>{currentProduct.city}, {currentProduct.country_code}</span>
                    <span className="text-teal-400 font-bold text-lg">
                        {symbol} {convertPrice(agentPrice, currentProduct.currency)}
                    </span>
                </div>

                <div className="pt-2">
                    <button
                        onClick={() => onBook(currentProduct)}
                        className="px-6 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-teal-500 hover:text-white transition-all shadow-lg flex items-center gap-2"
                    >
                        Book Now <FaArrowRight />
                    </button>
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
                <FaChevronLeft />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
                <FaChevronRight />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 right-8 flex gap-2">
                {products.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-teal-500 w-6' : 'bg-white/50 hover:bg-white'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
