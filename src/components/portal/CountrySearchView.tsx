'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaGlobeAmericas, FaSearch } from 'react-icons/fa'

type CountryOption = {
    code: string
    name: string
    productCount: number
}

export default function CountrySearchView({ countries }: { countries: CountryOption[] }) {
    const [selectedCountry, setSelectedCountry] = useState('')
    const router = useRouter()

    const handleSearch = () => {
        if (selectedCountry) {
            router.push(`/portal/country/${selectedCountry}`)
        }
    }

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-500/10 rounded-full mb-6">
                        <FaGlobeAmericas className="text-4xl text-teal-500" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Discover Travel Suppliers
                    </h1>
                    <p className="text-lg text-gray-400">
                        Search by country to find land operators, transport providers, and hotels
                    </p>
                </div>

                {/* Search Card */}
                <div className="bg-[#1A1A20] border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        Select a Country
                    </label>

                    <div className="flex gap-3">
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="flex-1 bg-[#101015] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                        >
                            <option value="">Choose a country...</option>
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name} ({country.productCount} products)
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleSearch}
                            disabled={!selectedCountry}
                            className="px-8 py-4 bg-teal-500 hover:bg-teal-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all transform hover:-translate-y-0.5 disabled:transform-none shadow-lg disabled:shadow-none flex items-center gap-2"
                        >
                            <FaSearch />
                            Search
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-teal-400">
                                    {countries.length}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                                    Countries
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-400">
                                    {countries.reduce((sum, c) => sum + c.productCount, 0)}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                                    Products
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-400">
                                    {countries.filter(c => c.productCount > 0).length}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                                    Active Markets
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Access - Top Countries */}
                {countries.length > 0 && (
                    <div className="mt-8">
                        <p className="text-sm text-gray-500 mb-4">Popular destinations:</p>
                        <div className="flex flex-wrap gap-2">
                            {countries
                                .sort((a, b) => b.productCount - a.productCount)
                                .slice(0, 6)
                                .map((country) => (
                                    <button
                                        key={country.code}
                                        onClick={() => router.push(`/portal/country/${country.code}`)}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-500/50 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
                                    >
                                        {country.name}
                                    </button>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
