import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaBuilding, FaBus, FaHotel } from 'react-icons/fa'

type CityData = {
    city: string
    land_operators: number
    transport: number
    hotels: number
}

export default async function CountryCityTablePage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params
    const supabase = await createClient()

    // Fetch city-level supplier counts
    const { data, error } = await supabase.rpc('get_city_supplier_counts', {
        p_country_code: code
    })

    // If RPC doesn't exist, fall back to manual query
    let cityData: CityData[] = []

    if (error) {
        // Manual aggregation
        const { data: products } = await supabase
            .from('products')
            .select(`
                city,
                supplier:suppliers (
                    supplier_type
                )
            `)
            .eq('country_code', code)
            .eq('status', 'active')

        if (products) {
            const cityMap = new Map<string, CityData>()

            products.forEach((p: any) => {
                if (!p.city) return

                const existing = cityMap.get(p.city) || {
                    city: p.city,
                    land_operators: 0,
                    transport: 0,
                    hotels: 0
                }

                if (p.supplier?.supplier_type === 'LAND OPERATOR') existing.land_operators++
                if (p.supplier?.supplier_type === 'TRANSPORT') existing.transport++
                if (p.supplier?.supplier_type === 'HOTEL') existing.hotels++

                cityMap.set(p.city, existing)
            })

            cityData = Array.from(cityMap.values()).sort((a, b) => a.city.localeCompare(b.city))
        }
    } else {
        cityData = data || []
    }

    if (cityData.length === 0) {
        notFound()
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/portal"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <FaArrowLeft /> Back to Country Search
                </Link>
                <h1 className="text-3xl font-bold text-white">
                    Suppliers in {code}
                </h1>
                <p className="text-gray-400 mt-2">
                    Click on any number to view suppliers in that category
                </p>
            </div>

            {/* Table */}
            <div className="bg-[#1A1A20] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <table className="w-full">
                    <thead className="bg-black/40 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                City
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <div className="flex items-center justify-center gap-2">
                                    <FaBuilding className="text-teal-500" />
                                    Land Operators
                                </div>
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <div className="flex items-center justify-center gap-2">
                                    <FaBus className="text-purple-500" />
                                    Transport
                                </div>
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <div className="flex items-center justify-center gap-2">
                                    <FaHotel className="text-blue-500" />
                                    Hotels
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {cityData.map((city) => (
                            <tr key={city.city} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">
                                    {city.city}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {city.land_operators > 0 ? (
                                        <Link
                                            href={`/portal/suppliers?country=${code}&city=${city.city}&type=LAND OPERATOR`}
                                            className="inline-block px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 font-bold rounded-lg border border-teal-500/20 hover:border-teal-500/40 transition-all"
                                        >
                                            {city.land_operators}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-600">0</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {city.transport > 0 ? (
                                        <Link
                                            href={`/portal/suppliers?country=${code}&city=${city.city}&type=TRANSPORT`}
                                            className="inline-block px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all"
                                        >
                                            {city.transport}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-600">0</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {city.hotels > 0 ? (
                                        <Link
                                            href={`/portal/suppliers?country=${code}&city=${city.city}&type=HOTEL`}
                                            className="inline-block px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all"
                                        >
                                            {city.hotels}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-600">0</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-teal-400">
                        {cityData.reduce((sum, c) => sum + c.land_operators, 0)}
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                        Total Land Operators
                    </div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                        {cityData.reduce((sum, c) => sum + c.transport, 0)}
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                        Total Transport
                    </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                        {cityData.reduce((sum, c) => sum + c.hotels, 0)}
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                        Total Hotels
                    </div>
                </div>
            </div>
        </div>
    )
}
