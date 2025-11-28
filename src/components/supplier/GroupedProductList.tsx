'use client'

import { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaMapMarkerAlt } from 'react-icons/fa'

type Product = {
    id: string
    product_name: string
    product_category: string
    city: string
    country_code: string
    status: string
}

type GroupedProductListProps = {
    products: Product[]
    groupingType: 'city' | 'country-city'
}

export default function GroupedProductList({ products, groupingType }: GroupedProductListProps) {
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

    const toggleGroup = (key: string) => {
        const newExpanded = new Set(expandedGroups)
        if (newExpanded.has(key)) {
            newExpanded.delete(key)
        } else {
            newExpanded.add(key)
        }
        setExpandedGroups(newExpanded)
    }

    if (groupingType === 'city') {
        // Group by city only (for LAND OPERATOR and TRANSPORT)
        const grouped = products.reduce((acc, product) => {
            const city = product.city || 'Unknown City'
            if (!acc[city]) acc[city] = []
            acc[city].push(product)
            return acc
        }, {} as Record<string, Product[]>)

        const cities = Object.keys(grouped).sort()

        return (
            <div className="space-y-4">
                {cities.map((city) => {
                    const cityProducts = grouped[city]
                    const isExpanded = expandedGroups.has(city)

                    return (
                        <div key={city} className="bg-[#1A1A20] border border-white/10 rounded-xl overflow-hidden">
                            {/* City Header */}
                            <button
                                onClick={() => toggleGroup(city)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <FaMapMarkerAlt className="text-teal-500" />
                                    <div className="text-left">
                                        <h3 className="text-lg font-bold text-white">{city}</h3>
                                        <p className="text-sm text-gray-500">
                                            {cityProducts.length} product{cityProducts.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                {isExpanded ? (
                                    <FaChevronUp className="text-gray-400" />
                                ) : (
                                    <FaChevronDown className="text-gray-400" />
                                )}
                            </button>

                            {/* Products List */}
                            {isExpanded && (
                                <div className="border-t border-white/5">
                                    <table className="w-full">
                                        <thead className="bg-black/20">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Product</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Category</th>

                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {cityProducts.map((product) => (
                                                <tr key={product.id} className="hover:bg-white/5">
                                                    <td className="px-6 py-4 text-white">{product.product_name}</td>
                                                    <td className="px-6 py-4 text-gray-400 text-sm">{product.product_category}</td>

                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.status === 'active'
                                                            ? 'bg-green-500/10 text-green-400'
                                                            : 'bg-gray-500/10 text-gray-400'
                                                            }`}>
                                                            {product.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    // Group by country, then by city (for HOTEL)
    const grouped = products.reduce((acc, product) => {
        const country = product.country_code || 'Unknown Country'
        const city = product.city || 'Unknown City'

        if (!acc[country]) acc[country] = {}
        if (!acc[country][city]) acc[country][city] = []
        acc[country][city].push(product)

        return acc
    }, {} as Record<string, Record<string, Product[]>>)

    const countries = Object.keys(grouped).sort()

    return (
        <div className="space-y-6">
            {countries.map((country) => {
                const cities = Object.keys(grouped[country]).sort()
                const countryKey = `country-${country}`
                const isCountryExpanded = expandedGroups.has(countryKey)

                return (
                    <div key={country} className="bg-[#1A1A20] border border-white/10 rounded-xl overflow-hidden">
                        {/* Country Header */}
                        <button
                            onClick={() => toggleGroup(countryKey)}
                            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-teal-500/10 to-transparent hover:from-teal-500/20 transition-colors"
                        >
                            <div className="text-left">
                                <h2 className="text-xl font-bold text-white">{country}</h2>
                                <p className="text-sm text-gray-500">
                                    {cities.length} cit{cities.length !== 1 ? 'ies' : 'y'} • {
                                        Object.values(grouped[country]).reduce((sum, cityProducts) => sum + cityProducts.length, 0)
                                    } products
                                </p>
                            </div>
                            {isCountryExpanded ? (
                                <FaChevronUp className="text-gray-400" />
                            ) : (
                                <FaChevronDown className="text-gray-400" />
                            )}
                        </button>

                        {/* Cities */}
                        {isCountryExpanded && (
                            <div className="border-t border-white/5 p-4 space-y-3">
                                {cities.map((city) => {
                                    const cityProducts = grouped[country][city]
                                    const cityKey = `${country}-${city}`
                                    const isCityExpanded = expandedGroups.has(cityKey)

                                    return (
                                        <div key={cityKey} className="bg-black/20 rounded-lg overflow-hidden">
                                            {/* City Header */}
                                            <button
                                                onClick={() => toggleGroup(cityKey)}
                                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-teal-400 text-sm" />
                                                    <span className="text-white font-medium">{city}</span>
                                                    <span className="text-xs text-gray-500">
                                                        ({cityProducts.length})
                                                    </span>
                                                </div>
                                                {isCityExpanded ? (
                                                    <FaChevronUp className="text-gray-500 text-sm" />
                                                ) : (
                                                    <FaChevronDown className="text-gray-500 text-sm" />
                                                )}
                                            </button>

                                            {/* Products */}
                                            {isCityExpanded && (
                                                <div className="border-t border-white/5">
                                                    <table className="w-full">
                                                        <thead className="bg-black/20">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-400 uppercase">Product</th>
                                                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-400 uppercase">Category</th>

                                                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-white/5">
                                                            {cityProducts.map((product) => (
                                                                <tr key={product.id} className="hover:bg-white/5">
                                                                    <td className="px-4 py-3 text-white text-sm">{product.product_name}</td>
                                                                    <td className="px-4 py-3 text-gray-400 text-xs">{product.product_category}</td>

                                                                    <td className="px-4 py-3">
                                                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${product.status === 'active'
                                                                            ? 'bg-green-500/10 text-green-400'
                                                                            : 'bg-gray-500/10 text-gray-400'
                                                                            }`}>
                                                                            {product.status}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
