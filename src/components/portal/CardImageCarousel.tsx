'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt } from 'react-icons/fa'

interface CardImageCarouselProps {
    images: string[]
    alt: string
    city?: string
    countryCode?: string
    category?: string
}

export default function CardImageCarousel({ images, alt, city, countryCode, category }: CardImageCarouselProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const goToImage = (e: React.MouseEvent, index: number) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentImageIndex(index)
    }

    return (
        <div className="relative h-64 overflow-hidden bg-slate-800">
            <div className="block h-full w-full">
                {images.length > 0 ? (
                    <>
                        <Image
                            src={images[currentImageIndex]}
                            alt={alt}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 italic text-sm">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <FaMapMarkerAlt className="opacity-20" />
                            </div>
                            Visuals pending
                        </div>
                    </div>
                )}
            </div>

            {/* Category Badge */}
            {category && (
                <div className="absolute top-4 left-4 bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-md shadow-lg z-10">
                    {category}
                </div>
            )}

            {/* Image Navigation */}
            {images.length > 1 && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/10 hover:bg-slate-950/60 transition-all shadow-xl z-20"
                        aria-label="Previous image"
                    >
                        <FaChevronLeft className="text-white text-xs" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/10 hover:bg-slate-950/60 transition-all shadow-xl z-20"
                        aria-label="Next image"
                    >
                        <FaChevronRight className="text-white text-xs" />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => goToImage(e, index)}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex
                                    ? 'bg-amber-400 w-4'
                                    : 'bg-white/30 hover:bg-white/50'
                                    }`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Location Overlay */}
            {city && countryCode && (
                <div className="absolute bottom-4 left-4 flex items-center text-[10px] text-white font-black uppercase tracking-tighter bg-slate-950/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg z-10">
                    <FaMapMarkerAlt className="mr-1.5 text-amber-500 animate-pulse" />
                    {city}, {countryCode}
                </div>
            )}
        </div>
    )
}
