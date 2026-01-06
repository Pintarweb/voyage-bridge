'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { FaSearch, FaGlobe, FaBuilding, FaMapMarkerAlt, FaSpinner, FaHistory, FaArrowRight } from 'react-icons/fa'
import { Command } from 'cmdk' // We will implement a custom UI first if cmdk install is taking time or for custom styling control
// actually, I'll build a custom one for maximum design control matching the "Glass" theme without fighting library styles.

type SearchResult = {
    type: 'country' | 'city' | 'supplier' | 'product'
    id: string
    title: string
    subtitle?: string
    code?: string // for country flag
    icon?: any
    href: string
}

type SmartSearchBarProps = {
    countries: { code: string; name: string; productCount: number }[]
}

export default function SmartSearchBar({ countries }: SmartSearchBarProps) {
    const router = useRouter()
    const supabase = createClient()
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState<SearchResult[]>([])
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const containerRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Search Logic with Debounce
    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults([])
                return
            }

            setIsLoading(true)

            try {
                // 1. Filter Countries (Local)
                const matchedCountries = countries
                    .filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
                    .slice(0, 3)
                    .map(c => ({
                        type: 'country' as const,
                        id: c.code,
                        title: c.name,
                        subtitle: `${c.productCount} Products Available`,
                        code: c.code,
                        icon: <FaGlobe className="text-blue-400" />,
                        href: `/agent-portal/country/${c.code}`
                    }))

                // 2. Search Suppliers (Supabase)
                const { data: suppliers } = await supabase
                    .from('suppliers')
                    .select('id, company_name, supplier_type')
                    .ilike('company_name', `%${query}%`)
                    .limit(3)

                const matchedSuppliers = (suppliers || []).map(s => ({
                    type: 'supplier' as const,
                    id: s.id,
                    title: s.company_name,
                    subtitle: `Certified ${s.supplier_type}`,
                    icon: <FaBuilding className="text-amber-400" />,
                    href: `/agent-portal/suppliers?id=${s.id}` // Link logic might need adjustment
                }))

                // 3. Search Products (simulating "City" search via product locations for now, or direct product search)
                const { data: products } = await supabase
                    .from('products')
                    .select('id, product_name, city, country_code')
                    .ilike('product_name', `%${query}%`)
                    .limit(3)

                const matchedProducts = (products || []).map(p => ({
                    type: 'product' as const,
                    id: p.id,
                    title: p.product_name,
                    subtitle: `${p.city}, ${p.country_code}`,
                    icon: <FaMapMarkerAlt className="text-emerald-400" />,
                    href: `/agent-portal/product/${p.id}`
                }))

                setResults([...matchedCountries, ...matchedSuppliers, ...matchedProducts])
                setIsOpen(true)
            } catch (error) {
                console.error('Search error', error)
            } finally {
                setIsLoading(false)
            }
        }

        const timeoutId = setTimeout(fetchResults, 300)
        return () => clearTimeout(timeoutId)
    }, [query, countries, supabase])

    const handleSelect = (result: SearchResult) => {
        // Save to recent
        const newRecent = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5)
        setRecentSearches(newRecent) // In a real app, persist to localStorage or DB

        router.push(result.href)
        setIsOpen(false)
    }

    return (
        <div ref={containerRef} className="relative group w-full max-w-3xl mx-auto z-50">
            {/* Glossy Backdrop for Input */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-amber-500/50 to-purple-600/50 rounded-2xl blur opacity-30 transition duration-500 ${isOpen ? 'opacity-100' : 'group-hover:opacity-70'}`}></div>

            {/* Input Field */}
            <div className="relative flex items-center bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300">
                <div className="pl-5 pr-4 text-amber-500 text-xl animate-pulse">
                    {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                </div>
                <input
                    type="text"
                    className="flex-1 bg-transparent border-none text-white text-lg placeholder-slate-400 focus:ring-0 px-2 h-14 font-medium"
                    placeholder="Ask the network (e.g., 'Hotels in Tokyo', 'Luxury tours')..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        if (e.target.value.length === 0) setIsOpen(false)
                        else setIsOpen(true)
                    }}
                    onFocus={() => {
                        if (query.length > 0) setIsOpen(true)
                    }}
                />

                {/* Visual "Enter" hint */}
                <div className="hidden md:flex items-center gap-2 pr-4 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span className="bg-white/10 px-2 py-1 rounded border border-white/5">CMD + K</span>
                </div>
            </div>

            {/* Smart Dropdown Results */}
            {isOpen && (results.length > 0 || query.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* Results List */}
                    <div className="max-h-[60vh] overflow-y-auto py-2 custom-scrollbar">

                        {/* No Results State */}
                        {results.length === 0 && !isLoading && query.length >= 2 && (
                            <div className="p-8 text-center text-slate-500">
                                <p>No matching intelligence found.</p>
                                <button className="mt-2 text-amber-500 text-sm font-bold hover:underline">Request coverage for &quot;{query}&quot;</button>
                            </div>
                        )}

                        {/* Grouped Results would be better, but flat list for v1 is fine if typed nicely */}

                        {/* Render Results */}
                        {results.map((result, index) => (
                            <div
                                key={`${result.type}-${result.id}-${index}`}
                                onClick={() => handleSelect(result)}
                                className="group/item flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-amber-500"
                            >
                                {/* Icon Config */}
                                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-lg shadow-inner group-hover/item:scale-110 transition-transform">
                                    {result.type === 'country' && result.code ? (
                                        <img
                                            src={`https://flagcdn.com/w40/${result.code.toLowerCase()}.png`}
                                            alt={result.title}
                                            className="w-full h-full object-cover rounded-xl opacity-80 group-hover/item:opacity-100"
                                        />
                                    ) : (
                                        result.icon
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-white font-bold text-base truncate pr-4 group-hover/item:text-amber-400 transition-colors">
                                            {result.title}
                                        </h4>
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-0.5 rounded bg-white/5 border border-white/5">
                                            {result.type}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm truncate">{result.subtitle}</p>
                                </div>

                                <FaArrowRight className="text-slate-600 group-hover/item:text-amber-500 -translate-x-2 opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100 transition-all" />
                            </div>
                        ))}

                        {/* Footer / Smart Actions at Bottom */}
                        <div className="bg-slate-950/50 p-3 border-t border-white/5 flex justify-between items-center text-xs text-slate-500 px-6">
                            <span>Use arrow keys to navigate</span>
                            <span className="flex items-center gap-1"><FaHistory /> Recent saved</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
