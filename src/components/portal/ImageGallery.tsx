'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface ImageGalleryProps {
    images: string[]
    autoPlayInterval?: number
    onIndexChange?: (index: number) => void
    height?: string
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, autoPlayInterval = 5000, onIndexChange, height = 'h-[400px]' }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const nextImage = () => {
        const next = (currentImageIndex + 1) % images.length
        setCurrentImageIndex(next)
        onIndexChange?.(next)
    }
    const prevImage = () => {
        const prev = (currentImageIndex - 1 + images.length) % images.length
        setCurrentImageIndex(prev)
        onIndexChange?.(prev)
    }

    useEffect(() => {
        if (images.length <= 1 || autoPlayInterval === 0) return
        const interval = setInterval(nextImage, autoPlayInterval)
        return () => clearInterval(interval)
    }, [images.length, autoPlayInterval, currentImageIndex]) // Added currentImageIndex to deps to update interval if manually changed

    if (!images || images.length === 0) return null

    return (
        <div className={`relative ${height} w-full group overflow-hidden rounded-2xl bg-black/5 flex items-center justify-center`}>
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-1000 ease-out ${idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
                        }`}
                >
                    <Image
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                </div>
            ))}

            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110 border border-white/20"
                    >
                        <FaChevronLeft size={20} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110 border border-white/20"
                    >
                        <FaChevronRight size={20} />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex(idx);
                                    onIndexChange?.(idx);
                                }}
                                className={`h-1.5 transition-all duration-300 rounded-full ${idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default ImageGallery
