'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import SmartSearchBar from './SmartSearchBar'
import PortalSidebar from '@/components/portal/PortalSidebar'
import {
    FaSearch, FaGlobe, FaFire, FaStar, FaLeaf,
    FaBolt, FaMapMarkerAlt, FaColumns, FaSuitcase,
    FaHeart, FaHeadset, FaVoteYea, FaGem, FaBuilding
} from 'react-icons/fa'

type AgentDashboardProps = {
    userName: string
    countries: { code: string; name: string; productCount: number }[]
    trendingProducts: any[]
    latestSuppliers: any[]
}

export default function AgentDashboard({
    userName,
    countries,
    trendingProducts,
    latestSuppliers
}: AgentDashboardProps) {
    const router = useRouter()
    const [selectedFlag, setSelectedFlag] = useState<string | null>(null)

    return (
        <div className="flex flex-col lg:flex-row min-h-screen pt-32 bg-transparent">

            <PortalSidebar />

            {/* CENTER - Command Hub */}
            <main className="flex-1 lg:ml-20 xl:ml-64 relative flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar h-[calc(100vh-64px)]">

                {/* Search & Discovery Hub */}
                <div className="min-h-[45vh] flex flex-col items-center justify-center relative p-8">
                    <div className="w-full max-w-4xl z-10 space-y-10 text-center">

                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
                                Where to next, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-100">{userName || 'Agent'}</span>?
                            </h1>
                            <p className="text-white text-lg font-light shadow-black/50 drop-shadow-md">
                                Access exclusive founding rates across {countries.length} global markets.
                            </p>
                        </div>

                        {/* Smart Search Bar */}
                        <div className="w-full flex justify-center pb-8">
                            <SmartSearchBar countries={countries} />
                        </div>

                        {/* Flag Navigation Grid */}
                        <div className="pt-8">
                            <p className="text-xs text-white uppercase tracking-widest font-bold mb-4 drop-shadow-md">Quick Access Markets</p>
                            <div className="flex justify-center gap-6 overflow-x-auto pb-4 no-scrollbar px-4 mask-fade-sides">
                                {countries.slice(0, 8).map((country) => (
                                    <Link
                                        key={country.code}
                                        href={`/agent-portal/country/${country.code}`}
                                        onClick={() => setSelectedFlag(country.code)}
                                        className={`group flex flex-col items-center gap-3 min-w-[80px] transition-all duration-300 ${selectedFlag === country.code ? 'transform scale-110' : 'hover:-translate-y-2'}`}
                                    >
                                        <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 shadow-lg transition-all duration-300 ${selectedFlag === country.code ? 'border-amber-400 ring-4 ring-amber-500/20' : 'border-white/20 group-hover:border-amber-400'}`}>
                                            <img
                                                src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`}
                                                alt={`Flag of ${country.name}`}
                                                className="w-full h-full object-cover transform scale-150"
                                            />
                                            {/* Shine effect */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                        <span className={`text-xs font-bold tracking-wide transition-colors drop-shadow-md ${selectedFlag === country.code ? 'text-amber-400' : 'text-white group-hover:text-amber-200'}`}>
                                            {country.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hot & Trending Intelligence */}
                <div className="flex-1 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <FaFire className="text-amber-500 text-xl animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Trending Supplier Showcases</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {trendingProducts.map((product, idx) => (
                                <Link
                                    key={product.id || idx}
                                    href={`/agent-portal/product/${product.id}`}
                                    className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-amber-500/50 transition-all duration-500 shadow-2xl hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] block"
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        <Image
                                            src={product.photo_url || product.photo_urls?.[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop'}
                                            alt={product.product_name || 'Product Image'}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />
                                    </div>

                                    {/* Trending Badge */}
                                    <div className="absolute top-4 left-4 flex items-center gap-1 bg-amber-500/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-lg">
                                        <FaFire /> Trending
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-white/5 backdrop-blur-md border-t border-white/10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">{product.product_category}</p>
                                                <h3 className="font-bold text-white leading-tight line-clamp-2">{product.product_name}</h3>
                                            </div>
                                            <div className="flex items-center gap-1 bg-slate-950/50 px-2 py-1 rounded text-xs">
                                                <FaStar className="text-amber-400" />
                                                <span className="text-white font-bold">4.9</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-3 border-t border-white/5 mt-3">
                                            <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold border border-white/20">
                                                {product.supplier?.company_name?.[0]}
                                            </div>
                                            <span className="text-xs text-white truncate">{product.supplier?.company_name}</span>

                                            <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded text-white border border-white/5">
                                                Founding Member
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* RIGHT SIDEBAR - Platform News */}
            <aside className="hidden 2xl:block w-80 bg-slate-950/60 backdrop-blur-xl border-l border-white/5 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">Network Activity</h3>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <p className="text-xs text-white font-semibold uppercase">New Founding Suppliers</p>
                        {latestSuppliers.map((supplier, i) => (
                            <Link
                                href={`/agent-portal/supplier/${supplier.id}`}
                                key={i}
                                className="flex items-start gap-3 group cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-colors border border-transparent hover:border-white/5"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-amber-500 text-lg shadow-inner">
                                    <FaBuilding className="drop-shadow-sm" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{supplier.company_name}</h4>
                                    <p className="text-xs text-slate-200 line-clamp-1">{supplier.supplier_type} • {supplier.products?.[0]?.count || 0} Products</p>
                                    <p className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-green-400"></span> Just Joined
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-2 text-blue-300">
                            <FaBolt />
                            <h4 className="text-xs font-bold uppercase">System Update</h4>
                        </div>
                        <p className="text-xs text-white leading-relaxed">
                            Global connectivity protocols optimized for real-time inventory synchronization. Direct supplier messaging now active for all regions.
                        </p>
                    </div>
                </div>
            </aside >
        </div >
    )
}
