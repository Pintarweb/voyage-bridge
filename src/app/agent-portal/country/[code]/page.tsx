import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaBuilding, FaBus, FaHotel, FaPlane } from 'react-icons/fa'

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
            // Access supplier_type from the joined supplier object
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/agent-portal"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors font-medium"
                    >
                        <FaArrowLeft /> Back to Country Search
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
                        Suppliers in {code}
                    </h1>
                    <p className="text-slate-600">
                        Click on any number to view suppliers in that category
                    </p>
                </div>

                {/* Table */}
                <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-900 to-blue-600">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    City
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                    <div className="flex items-center justify-center gap-2">
                                        <FaBuilding className="text-teal-300" />
                                        Land Operators
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                    <div className="flex items-center justify-center gap-2">
                                        <FaBus className="text-purple-300" />
                                        Transport
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                    <div className="flex items-center justify-center gap-2">
                                        <FaHotel className="text-blue-300" />
                                        Hotels
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                    <div className="flex items-center justify-center gap-2">
                                        <FaPlane className="text-rose-300" />
                                        Airlines
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {cityData.map((city) => {
                                const rowTotal = city.land_operators + city.transport + city.hotels + city.airlines;
                                return (
                                    <tr key={city.city} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-900 font-semibold">
                                            {city.city}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {city.land_operators > 0 ? (
                                                <Link
                                                    href={`/agent-portal/products?country=${code}&city=${city.city}&type=LAND OPERATOR`}
                                                    className="inline-block px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                                >
                                                    {city.land_operators}
                                                </Link>
                                            ) : (
                                                <span className="text-slate-400">0</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {city.transport > 0 ? (
                                                <Link
                                                    href={`/agent-portal/products?country=${code}&city=${city.city}&type=TRANSPORT`}
                                                    className="inline-block px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                                >
                                                    {city.transport}
                                                </Link>
                                            ) : (
                                                <span className="text-slate-400">0</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {city.hotels > 0 ? (
                                                <Link
                                                    href={`/agent-portal/products?country=${code}&city=${city.city}&type=HOTEL`}
                                                    className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                                >
                                                    {city.hotels}
                                                </Link>
                                            ) : (
                                                <span className="text-slate-400">0</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {city.airlines > 0 ? (
                                                <Link
                                                    href={`/agent-portal/products?country=${code}&city=${city.city}&type=AIRLINE`}
                                                    className="inline-block px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                                >
                                                    {city.airlines}
                                                </Link>
                                            ) : (
                                                <span className="text-slate-400">0</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block px-4 py-2 bg-slate-700 text-white font-black rounded-lg">
                                                {rowTotal}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {/* Totals Row */}
                            <tr className="bg-gradient-to-r from-slate-100 to-blue-100 font-bold">
                                <td className="px-6 py-4 text-slate-900 font-black uppercase text-sm">
                                    Total
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-block px-4 py-2 bg-teal-600 text-white font-black rounded-lg shadow-md">
                                        {cityData.reduce((sum, c) => sum + c.land_operators, 0)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-block px-4 py-2 bg-purple-600 text-white font-black rounded-lg shadow-md">
                                        {cityData.reduce((sum, c) => sum + c.transport, 0)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-block px-4 py-2 bg-blue-600 text-white font-black rounded-lg shadow-md">
                                        {cityData.reduce((sum, c) => sum + c.hotels, 0)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-block px-4 py-2 bg-rose-600 text-white font-black rounded-lg shadow-md">
                                        {cityData.reduce((sum, c) => sum + c.airlines, 0)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-block px-4 py-2 bg-slate-800 text-white font-black rounded-lg shadow-md">
                                        {cityData.reduce((sum, c) => sum + c.land_operators + c.transport + c.hotels + c.airlines, 0)}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-center shadow-lg">
                        <div className="text-3xl font-black text-white mb-1">
                            {cityData.reduce((sum, c) => sum + c.land_operators, 0)}
                        </div>
                        <div className="text-sm text-teal-100 uppercase tracking-wider font-semibold">
                            Total Land Operators
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-center shadow-lg">
                        <div className="text-3xl font-black text-white mb-1">
                            {cityData.reduce((sum, c) => sum + c.transport, 0)}
                        </div>
                        <div className="text-sm text-purple-100 uppercase tracking-wider font-semibold">
                            Total Transport
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-center shadow-lg">
                        <div className="text-3xl font-black text-white mb-1">
                            {cityData.reduce((sum, c) => sum + c.hotels, 0)}
                        </div>
                        <div className="text-sm text-blue-100 uppercase tracking-wider font-semibold">
                            Total Hotels
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-6 text-center shadow-lg">
                        <div className="text-3xl font-black text-white mb-1">
                            {cityData.reduce((sum, c) => sum + c.airlines, 0)}
                        </div>
                        <div className="text-sm text-rose-100 uppercase tracking-wider font-semibold">
                            Total Airlines
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
