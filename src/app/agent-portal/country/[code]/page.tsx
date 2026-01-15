import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaBuilding, FaBus, FaHotel, FaPlane, FaMapMarkerAlt, FaGlobe, FaChevronRight } from 'react-icons/fa'
import PortalSidebar from '@/components/portal/PortalSidebar'

type CityData = {
    city: string
    land_operators: number
    transport: number
    hotels: number
    airlines: number
}

export default async function CountryCityTablePage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params
    const supabase = await createClient()

    // Fetch products with supplier_type (it's denormalized in the products table)
    let cityData: CityData[] = []

    // Try exact match first
    let query = supabase
        .from('products')
        .select(`
            city, 
            supplier_id,
            supplier:suppliers (
                supplier_type
            )
        `)
        .eq('status', 'active')
        .eq('country_code', code) // First try exact match

    let { data: products } = await query

    // If no results, try uppercase (handle mixed case in DB vs URL)
    if (!products || products.length === 0) {
        const { data: upperProducts } = await supabase
            .from('products')
            .select(`
                city, 
                supplier_id,
                supplier:suppliers (
                    supplier_type
                )
            `)
            .eq('status', 'active')
            .eq('country_code', code.toUpperCase())
        products = upperProducts
    }

    if (products && products.length > 0) {
        const cityMap = new Map<string, {
            city: string
            land_operators: number
            transport: number
            hotels: number
            airlines: number
        }>()

        products.forEach((p: any) => {
            if (!p.supplier_id || !p.supplier) {
                return
            }

            // Handle missing city
            const cityName = p.city || 'General'

            // Get or create city entry
            if (!cityMap.has(cityName)) {
                cityMap.set(cityName, {
                    city: cityName,
                    land_operators: 0,
                    transport: 0,
                    hotels: 0,
                    airlines: 0
                })
            }

            const cityEntry = cityMap.get(cityName)!

            // Track total products per category (convert to uppercase for comparison)
            const supplierTypeUpper = p.supplier?.supplier_type?.toUpperCase()

            if (supplierTypeUpper === 'LAND OPERATOR') {
                cityEntry.land_operators++
            } else if (supplierTypeUpper === 'TRANSPORT') {
                cityEntry.transport++
            } else if (supplierTypeUpper === 'HOTEL') {
                cityEntry.hotels++
            } else if (supplierTypeUpper === 'AIRLINE') {
                cityEntry.airlines++
            }
        })

        // Convert map to array
        cityData = Array.from(cityMap.values()).sort((a, b) => a.city.localeCompare(b.city))
    }

    if (cityData.length === 0) {
        notFound()
    }

    const totalStats = {
        land_operators: cityData.reduce((sum, c) => sum + c.land_operators, 0),
        transport: cityData.reduce((sum, c) => sum + c.transport, 0),
        hotels: cityData.reduce((sum, c) => sum + c.hotels, 0),
        airlines: cityData.reduce((sum, c) => sum + c.airlines, 0),
        total: cityData.reduce((sum, c) => sum + c.land_operators + c.transport + c.hotels + c.airlines, 0)
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen pt-16 bg-transparent">
            <PortalSidebar />

            <main className="flex-1 lg:ml-20 xl:ml-64 relative flex flex-col overflow-y-auto h-[calc(100vh-64px)] no-scrollbar">
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

                    {/* Cinematic Header */}
                    <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Link
                            href="/agent-portal"
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-400 mb-6 transition-all font-black uppercase tracking-[0.2em] text-[10px] group"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            Back to Mission Hub
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                                        <img
                                            src={`https://flagcdn.com/w160/${code.toLowerCase()}.png`}
                                            alt={code}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
                                        {code} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-100">Intelligence Hub</span>
                                    </h1>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        {totalStats.total} Active Assets Identified
                                    </p>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                        Operational across {cityData.length} strategic cities
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        <SummaryCard
                            icon={<FaBuilding className="text-teal-400" />}
                            label="Land Operators"
                            count={totalStats.land_operators}
                            href={`/agent-portal/suppliers?country=${code}&type=LAND OPERATOR`}
                        />
                        <SummaryCard
                            icon={<FaBus className="text-purple-400" />}
                            label="Transport"
                            count={totalStats.transport}
                            href={`/agent-portal/suppliers?country=${code}&type=TRANSPORT`}
                        />
                        <SummaryCard
                            icon={<FaHotel className="text-blue-400" />}
                            label="Hotels"
                            count={totalStats.hotels}
                            href={`/agent-portal/suppliers?country=${code}&type=HOTEL`}
                        />
                        <SummaryCard
                            icon={<FaPlane className="text-rose-400" />}
                            label="Airlines"
                            count={totalStats.airlines}
                            href={`/agent-portal/suppliers?country=${code}&type=AIRLINE`}
                        />
                    </div>

                    {/* Regional Grid */}
                    <div className="space-y-6 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Operational Cities</h2>
                            <div className="h-px flex-1 bg-white/5 mx-8"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {cityData.map((city) => (
                                <CityHubCard key={city.city} city={city} countryCode={code} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function SummaryCard({ icon, label, count, href }: { icon: any, label: string, count: number, href: string }) {
    const isEmpty = count === 0
    return (
        <Link
            href={isEmpty ? '#' : href}
            className={`bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl transition-all group ${isEmpty ? 'opacity-40 grayscale cursor-default' : 'hover:border-amber-500/50 hover:bg-white/5 hover:-translate-y-1'}`}
        >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
            <div className="text-2xl font-black text-white">{count}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</div>
        </Link>
    )
}

function CityHubCard({ city, countryCode }: { city: CityData, countryCode: string }) {
    const totalInCity = city.land_operators + city.transport + city.hotels + city.airlines

    // Find the first non-zero category to link the main hub to
    let defaultType = 'HOTEL'
    if (city.land_operators > 0) defaultType = 'LAND OPERATOR'
    else if (city.transport > 0) defaultType = 'TRANSPORT'
    else if (city.airlines > 0) defaultType = 'AIRLINE'

    const hubHref = `/agent-portal/suppliers?country=${countryCode}&city=${city.city}&type=${defaultType}`

    return (
        <div className="group bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <div className="p-6 pb-4">
                <Link href={hubHref} className="flex items-center justify-between mb-4 group/header">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-amber-500 border border-white/5 shadow-inner group-hover/header:scale-110 group-hover/header:text-amber-400 transition-all">
                            <FaMapMarkerAlt />
                        </div>
                        <div>
                            <h3 className="font-black text-white uppercase tracking-tight group-hover/header:text-amber-400 transition-colors uppercase">{city.city}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{totalInCity} Assets Found</p>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/header:bg-amber-500 transition-all group-hover/header:text-slate-950">
                        <FaChevronRight className="text-xs" />
                    </div>
                </Link>

                <div className="h-px bg-white/5 mb-6"></div>

                <div className="grid grid-cols-2 gap-3">
                    <CategoryLink
                        label="Land Op"
                        count={city.land_operators}
                        type="LAND OPERATOR"
                        country={countryCode}
                        city={city.city}
                        colorClass="teal"
                    />
                    <CategoryLink
                        label="Transport"
                        count={city.transport}
                        type="TRANSPORT"
                        country={countryCode}
                        city={city.city}
                        colorClass="purple"
                    />
                    <CategoryLink
                        label="Hotels"
                        count={city.hotels}
                        type="HOTEL"
                        country={countryCode}
                        city={city.city}
                        colorClass="blue"
                    />
                    <CategoryLink
                        label="Airlines"
                        count={city.airlines}
                        type="AIRLINE"
                        country={countryCode}
                        city={city.city}
                        colorClass="rose"
                    />
                </div>
            </div>

            <Link
                href={hubHref}
                className="w-full py-4 bg-white/5 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-amber-500 hover:text-slate-950 transition-all block border-t border-white/5"
            >
                Enter Regional Hub
            </Link>
        </div>
    )
}

function CategoryLink({ label, count, type, country, city, colorClass }: { label: string, count: number, type: string, country: string, city: string, colorClass: string }) {
    if (count === 0) {
        return (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col items-center opacity-30 grayscale cursor-not-allowed">
                <span className="text-lg font-black text-white">{count}</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 text-center">{label}</span>
            </div>
        )
    }

    const colorMap: any = {
        teal: 'hover:border-teal-500/50 hover:bg-teal-500/10 text-teal-500',
        purple: 'hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-500',
        blue: 'hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-500',
        rose: 'hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-500',
    }

    return (
        <Link
            href={`/agent-portal/products?country=${country}&city=${city}&type=${type}`}
            className={`bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center transition-all ${colorMap[colorClass]}`}
        >
            <span className="text-lg font-black">{count}</span>
            <span className="text-[8px] font-bold uppercase tracking-widest opacity-70 text-center">{label}</span>
        </Link>
    )
}
