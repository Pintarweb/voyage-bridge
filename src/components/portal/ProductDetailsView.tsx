'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { FaArrowLeft, FaMapMarkerAlt, FaBuilding, FaMoneyBillWave, FaStar, FaShareAlt, FaHeart, FaChevronLeft, FaChevronRight, FaEnvelope, FaGlobe, FaTimes, FaCheck, FaPhone, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { useCurrency } from '@/context/CurrencyContext'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import ImageGallery from './ImageGallery'
import SupplierContactModal from './SupplierContactModal'
import { getCountryInfo } from '@/utils/geo'

type Product = {
    id: string
    product_name: string
    description: string
    product_description?: string
    photo_urls: string[] | null
    photo_url_1?: string
    city: string
    country_code: string
    currency: string
    suggested_retail_price: number
    agent_price?: number
    product_category: string

    // Rich Details
    amenities?: string[]
    inclusions?: string[]
    exclusions?: string[]
    duration?: string
    max_group_size?: number
    start_time?: string
    cutoff_time?: string

    supplier: {
        id: string
        company_name: string
        contact_email: string
        website_url?: string
        description?: string
        phone_number?: string
        address_line_1?: string
        city?: string
        country_code?: string
        logo_url?: string
    }
}

export default function ProductDetailsView({ product }: { product: Product }) {
    const router = useRouter()
    const { convertPrice, symbol } = useCurrency()
    const supabase = createClient()
    const agentPrice = product.agent_price || (product.suggested_retail_price * 0.8)

    // --- Image Logic ---
    const images: string[] = []
    if (product.photo_urls && Array.isArray(product.photo_urls)) {
        images.push(...product.photo_urls)
    }
    if (images.length === 0 && product.photo_url_1) {
        images.push(product.photo_url_1)
    }
    if (images.length === 0) {
        images.push('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')
    }

    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // --- View Count ---
    const hasViewed = useRef(false)
    useEffect(() => {
        if (hasViewed.current) return
        hasViewed.current = true
        const incrementView = async () => {
            try {
                await fetch('/api/products/view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product_id: product.id })
                })
            } catch (error) {
                console.error('Error incrementing view count:', error)
            }
        }
        incrementView()
    }, [product.id])

    // --- Wishlist Logic ---
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)

    useEffect(() => {
        const checkWishlist = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            const { data } = await supabase
                .from('wishlists')
                .select('id')
                .eq('user_id', user.id)
                .eq('product_id', product.id)
                .maybeSingle()
            if (data) setIsWishlisted(true)
        }
        checkWishlist()
    }, [product.id, supabase])

    // --- Save Supplier Logic ---
    const saveSupplier = async () => {
        try {
            await fetch('/api/agent/saved-suppliers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ supplier_id: product.supplier?.id }) // Ensure supplier has ID
            })
        } catch (error) {
            console.error('Error saving supplier:', error)
        }
    }

    const toggleWishlist = async () => {
        if (wishlistLoading) return
        setWishlistLoading(true)
        try {
            if (isWishlisted) {
                const res = await fetch('/api/wishlist', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product_id: product.id })
                })
                if (res.ok) setIsWishlisted(false)
            } else {
                const res = await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product_id: product.id })
                })
                if (res.ok) {
                    setIsWishlisted(true)
                    // Auto-save supplier when wishlisting
                    saveSupplier()
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            setWishlistLoading(false)
        }
    }

    const [showSupplierModal, setShowSupplierModal] = useState(false)

    const handleOpenSupplierModal = () => {
        setShowSupplierModal(true)
        saveSupplier()
    }

    return (
        <div className="relative min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500/30 overflow-x-hidden">
            <div className="fixed inset-0 z-0">
                <Image
                    src={images[currentImageIndex]}
                    alt="Background"
                    fill
                    className="object-cover opacity-20 blur-sm scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 pt-24 lg:pt-32">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 hover:border-amber-500/50 transition-all hover:bg-white/5"
                    >
                        <FaArrowLeft className="text-slate-400 group-hover:text-amber-400 transition-colors" />
                        <span className="text-sm font-bold text-slate-300 group-hover:text-white">Back to Command</span>
                    </button>

                    <div className="flex gap-3">
                        <button
                            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 hover:border-amber-500/50 hover:text-amber-400 transition-all text-xs font-bold text-slate-400"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: product.product_name,
                                        url: window.location.href
                                    })
                                }
                            }}
                        >
                            <FaShareAlt /> Share
                        </button>
                        <button
                            onClick={toggleWishlist}
                            className={`p-3 rounded-full bg-slate-900/50 backdrop-blur-md border transition-all ${isWishlisted ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-white/10 hover:border-red-500/50 hover:text-red-400'}`}
                        >
                            <FaHeart className={isWishlisted ? 'animate-pulse' : ''} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                            <ImageGallery
                                images={images}
                                onIndexChange={setCurrentImageIndex}
                                height="h-[400px] md:h-[500px]"
                            />

                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 pointer-events-none">
                                <div className="flex items-center gap-3 mb-4 animate-in slide-in-from-bottom-2 fade-in duration-700">
                                    <span className="px-3 py-1 bg-amber-500 text-slate-900 text-xs font-black uppercase tracking-wider rounded">
                                        {product.product_category}
                                    </span>
                                    <div className="flex items-center gap-1 bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded text-xs border border-white/10">
                                        <FaStar className="text-amber-400" />
                                        <span className="font-bold">4.9</span>
                                        <span className="text-slate-400">(128 Reviews)</span>
                                    </div>
                                </div>

                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-2 drop-shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
                                    {product.product_name}
                                </h1>

                                <div className="flex items-center gap-4 text-base md:text-lg text-slate-300 animate-in slide-in-from-bottom-6 fade-in duration-700 delay-200">
                                    <span className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-amber-500" />
                                        {product.city}, {getCountryInfo(product.country_code).name} {getCountryInfo(product.country_code).flag}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details Panel */}
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <FaBuilding className="text-amber-500" /> About this Experience
                            </h3>
                            <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed">
                                <p>{product.description || product.product_description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t border-white/5 pt-8">
                                {(product.inclusions?.length || product.amenities?.length) ? (
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Highlights</h4>
                                        <ul className="space-y-2">
                                            {[...(product.inclusions || []), ...(product.amenities || [])].slice(0, 6).map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                    <span className="mt-1 text-amber-500"><FaCheck size={10} /></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}

                                <div className="space-y-4">
                                    {product.duration && (
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-500 uppercase">Duration</h4>
                                            <p className="text-white font-medium">{product.duration}</p>
                                        </div>
                                    )}
                                    {product.max_group_size && (
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-500 uppercase">Group Size</h4>
                                            <p className="text-white font-medium">Up to {product.max_group_size} people</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-amber-500 border border-white/10 uppercase relative overflow-hidden">
                                        {product.supplier?.logo_url ? (
                                            <Image
                                                src={product.supplier.logo_url}
                                                alt={product.supplier.company_name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            product.supplier?.company_name?.[0]
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Provided By</p>
                                        <p className="text-white font-bold text-lg">{product.supplier?.company_name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleOpenSupplierModal}
                                    className="text-xs font-bold text-amber-500 uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    View Supplier Profile →
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-32 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                            <div className="mb-8 text-center bg-gradient-to-r from-amber-500/10 to-transparent p-4 rounded-xl border border-amber-500/10">
                                <p className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-1">Founding Member Rate</p>
                                <p className="text-xs text-slate-400">Exclusive access active</p>
                            </div>

                            <div className="space-y-6 mb-8">
                                <div className="flex justify-between items-end border-b border-white/10 pb-4 border-dashed">
                                    <p className="text-slate-400 font-medium">Retail Price (RRP)</p>
                                    <p className="text-xl text-slate-500 line-through decoration-red-500/50">
                                        {symbol} {convertPrice(product.suggested_retail_price, product.currency)}
                                    </p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-slate-200 font-bold text-lg">Your Net Price</p>
                                        <p className="text-xs text-green-400 font-mono">Commission: 20%</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-5xl font-black text-white tracking-tight drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                                            {symbol}{convertPrice(agentPrice, product.currency)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowSupplierModal(true)}
                                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-black text-lg uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-1"
                            >
                                Connect with Supplier
                            </button>

                            <p className="text-center text-[10px] text-slate-500 mt-4 leading-relaxed">
                                *Direct line to supplier. No booking fees.
                            </p>
                        </div>
                    </div>
                </div >
            </div >

            {/* Supplier Contact Modal */}
            <SupplierContactModal
                isOpen={showSupplierModal}
                onClose={() => setShowSupplierModal(false)}
                supplier={product.supplier as any}
            />
        </div >
    )
}
