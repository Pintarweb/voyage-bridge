'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { FaSearch, FaGlobe, FaBuilding, FaMapMarkerAlt, FaSpinner, FaHistory, FaArrowRight, FaFire } from 'react-icons/fa'

type SearchResult = {
    type: 'country' | 'city' | 'supplier' | 'product' | 'category'
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
    const [selectedIndex, setSelectedIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

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
            const trimmedQuery = query.trim().toLowerCase()
            if (trimmedQuery.length < 2) {
                setResults([])
                return
            }

            setIsLoading(true)

            try {
                const searchTerm = query.trim()

                // Category Synonym Mapping - mapping natural words to database category names
                const categorySynonyms: Record<string, string> = {
                    // Transport
                    'car': 'Transport',
                    'bus': 'Transport',
                    'lorry': 'Transport',
                    'van': 'Transport',
                    'taxi': 'Transport',
                    'truck': 'Transport',
                    'transport': 'Transport',
                    'transportation': 'Transport',
                    'vehicle': 'Transport',

                    // Hotel
                    'hotel': 'Hotel',
                    'hotels': 'Hotel',
                    'inn': 'Hotel',
                    'guesthouse': 'Hotel',
                    'homestay': 'Hotel',
                    'motel': 'Hotel',
                    'hostel': 'Hotel',
                    'villa': 'Hotel',
                    'resort': 'Hotel',
                    'accommodation': 'Hotel',
                    'stay': 'Hotel',

                    // Airline
                    'flight': 'Airline',
                    'flights': 'Airline',
                    'plane': 'Airline',
                    'air': 'Airline',
                    'airline': 'Airline',

                    // Land Operator
                    'tour': 'Land Operator',
                    'tours': 'Land Operator',
                    'guide': 'Land Operator',
                    'activity': 'Land Operator',
                    'activities': 'Land Operator',
                    'land': 'Land Operator',
                    'operator': 'Land Operator'
                }

                // Intent Detection: Match synonyms or partial synonyms
                const matchingSynonym = Object.entries(categorySynonyms).find(([syn, cat]) =>
                    syn.startsWith(trimmedQuery) || trimmedQuery.startsWith(syn)
                )

                // Check direct category names too
                const isDirectCategory = ['Hotel', 'Transport', 'Airline', 'Land Operator'].find(cat =>
                    cat.toLowerCase().startsWith(trimmedQuery)
                )

                const mappedCategory = isDirectCategory || (matchingSynonym ? matchingSynonym[1] : null)

                // 1. Filter Countries (Local)
                const matchedCountries = countries
                    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
                let supplierQuery = supabase
                    .from('suppliers')
                    .select('id, company_name, supplier_type, city, country_code')

                if (mappedCategory) {
                    // When a category is detected, we prioritize it
                    supplierQuery = supplierQuery.or(`company_name.ilike."%${searchTerm}%",supplier_type.ilike."${mappedCategory}",city.ilike."%${searchTerm}%"`)
                } else {
                    // Multi-field search
                    supplierQuery = supplierQuery.or(`company_name.ilike."%${searchTerm}%",supplier_type.ilike."%${searchTerm}%",city.ilike."%${searchTerm}%"`)
                }

                const { data: suppliers } = await supplierQuery.limit(4)

                const matchedSuppliers = (suppliers || []).map(s => ({
                    type: 'supplier' as const,
                    id: s.id,
                    title: s.company_name,
                    subtitle: `${s.supplier_type} • ${s.city || 'Global'}`,
                    icon: <FaBuilding className="text-amber-400" />,
                    href: `/agent-portal/supplier/${s.id}`
                }))

                // 3. Search Products
                let productQuery = supabase
                    .from('products')
                    .select('id, product_name, city, country_code, product_category')
                    .eq('status', 'active')

                if (mappedCategory) {
                    productQuery = productQuery.or(`product_name.ilike."%${searchTerm}%",product_category.ilike."${mappedCategory}",city.ilike."%${searchTerm}%"`)
                } else {
                    productQuery = productQuery.or(`product_name.ilike."%${searchTerm}%",product_category.ilike."%${searchTerm}%",city.ilike."%${searchTerm}%"`)
                }

                const { data: products } = await productQuery.limit(5)

                const matchedProducts = (products || []).map(p => ({
                    type: 'product' as const,
                    id: p.id,
                    title: p.product_name,
                    subtitle: `${p.product_category} • ${p.city}, ${p.country_code}`,
                    icon: <FaMapMarkerAlt className="text-emerald-400" />,
                    href: `/agent-portal/product/${p.id}`
                }))

                // Intent Suggestion: Add a specialized entry for the mapped category
                let intentResult: any[] = []
                if (mappedCategory) {
                    intentResult = [{
                        type: 'category',
                        id: mappedCategory,
                        title: `All ${mappedCategory} Partners`,
                        subtitle: `Global network matching "${searchTerm}"`,
                        icon: <FaFire className="text-amber-500" />,
                        href: `/agent-portal/suppliers?type=${mappedCategory}`
                    }]
                }

                const combinedResults = [...intentResult, ...matchedCountries, ...matchedSuppliers, ...matchedProducts]
                setResults(combinedResults)
                setSelectedIndex(0)

                // CRITICAL FIX: Keep dropdown open if we have a query, regardless of results count
                // This ensures the "No matching intelligence found" state can actually show up.
                setIsOpen(true)
            } catch (error) {
                console.error('Search error', error)
                setResults([])
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
        setRecentSearches(newRecent)

        router.push(result.href)
        setIsOpen(false)
        setQuery('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => (prev + 1) % results.length)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
        } else if (e.key === 'Enter') {
            e.preventDefault()
            if (results[selectedIndex]) {
                handleSelect(results[selectedIndex])
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false)
        }
    }

    return (
        <div ref={containerRef} className="relative group w-full max-w-3xl mx-auto z-50">
            {/* Glossy Backdrop for Input */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-amber-500/50 to-purple-600/50 rounded-2xl blur opacity-10 transition duration-500 ${isOpen ? 'opacity-40' : 'group-hover:opacity-20'}`}></div>

            {/* Input Field */}
            <div className="relative flex items-center bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300">
                <div className="pl-5 pr-4 text-amber-500 text-xl">
                    {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch className={isOpen ? 'animate-pulse' : ''} />}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 bg-transparent border-none text-white text-lg placeholder-slate-500 focus:ring-0 px-2 h-14 font-medium"
                    placeholder="Search destinations, partners, or product categories..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        if (e.target.value.trim().length === 0) {
                            setIsOpen(false)
                        } else {
                            setIsOpen(true)
                        }
                    }}
                    onFocus={() => {
                        if (query.trim().length >= 2) setIsOpen(true)
                    }}
                    onKeyDown={handleKeyDown}
                />

                {/* Keyboard Hint */}
                <div className="hidden md:flex items-center gap-2 pr-6 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                    <span className="bg-white/5 px-2 py-1 rounded border border-white/10">ESC to close</span>
                </div>
            </div>

            {/* Smart Dropdown Results */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">

                    <div className="max-h-[60vh] overflow-y-auto py-3 custom-scrollbar">

                        {/* Loading State within dropdown */}
                        {isLoading && results.length === 0 && (
                            <div className="px-6 py-10 text-center space-y-3">
                                <FaSpinner className="animate-spin text-amber-500 text-2xl mx-auto" />
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Scanning network intelligence...</p>
                            </div>
                        )}

                        {/* No Results State */}
                        {results.length === 0 && !isLoading && query.trim().length >= 2 && (
                            <div className="px-6 py-12 text-center text-slate-500">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaSearch className="opacity-20" />
                                </div>
                                <p className="font-bold text-white mb-1">No matching intelligence found</p>
                                <p className="text-sm">Try searching for a city, category (like &quot;Hotel&quot;), or partner name.</p>
                            </div>
                        )}

                        {/* Render Results */}
                        {results.map((result, index) => (
                            <div
                                key={`${result.type}-${result.id}-${index}`}
                                onClick={() => handleSelect(result)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`group/item flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-200 border-l-4 ${selectedIndex === index
                                    ? 'bg-white/10 border-amber-500 translate-x-1'
                                    : 'border-transparent hover:bg-white/5'
                                    }`}
                            >
                                {/* Icon Config */}
                                <div className={`w-11 h-11 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-lg shadow-inner transition-transform ${selectedIndex === index ? 'scale-110 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : ''}`}>
                                    {result.type === 'country' && result.code ? (
                                        <img
                                            src={`https://flagcdn.com/w80/${result.code.toLowerCase()}.png`}
                                            alt={result.title}
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    ) : (
                                        result.icon
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h4 className={`font-black text-sm uppercase tracking-tight truncate pr-4 transition-colors ${selectedIndex === index ? 'text-amber-400' : 'text-white'}`}>
                                            {result.title}
                                        </h4>
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border transition-colors ${selectedIndex === index
                                            ? 'bg-amber-500 text-slate-950 border-amber-500'
                                            : 'bg-white/5 text-slate-500 border-white/5'
                                            }`}>
                                            {result.type}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate">{result.subtitle}</p>
                                </div>

                                <FaArrowRight className={`text-amber-500 transition-all duration-300 ${selectedIndex === index ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
                            </div>
                        ))}

                        {/* Footer / Navigation Guide */}
                        {results.length > 0 && (
                            <div className="mt-2 bg-slate-950/50 p-4 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 px-8 font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1.5"><span className="bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-slate-300">↑↓</span> Navigate</span>
                                    <span className="flex items-center gap-1.5"><span className="bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-slate-300">ENTER</span> Select</span>
                                </div>
                                <span className="flex items-center gap-2 text-amber-500/50"><FaHistory /> Live discovery</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
