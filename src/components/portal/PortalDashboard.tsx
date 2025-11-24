'use client'

import { useState, useMemo } from 'react'
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'

export default function PortalDashboard({ products }: { products: any[] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedContinent, setSelectedContinent] = useState('')
    const [selectedRegion, setSelectedRegion] = useState('')
    const [selectedCountry, setSelectedCountry] = useState('')
    const [selectedCity, setSelectedCity] = useState('')
    const [travelDate, setTravelDate] = useState('')

    // Extract unique values for filters
    const continents = useMemo(() => [...new Set(products.map(p => p.continent).filter(Boolean))], [products])
    const regions = useMemo(() => [...new Set(products.filter(p => !selectedContinent || p.continent === selectedContinent).map(p => p.region).filter(Boolean))], [products, selectedContinent])
    const countries = useMemo(() => [...new Set(products.filter(p => (!selectedContinent || p.continent === selectedContinent) && (!selectedRegion || p.region === selectedRegion)).map(p => p.country_code).filter(Boolean))], [products, selectedContinent, selectedRegion])
    const cities = useMemo(() => [...new Set(products.filter(p => (!selectedContinent || p.continent === selectedContinent) && (!selectedRegion || p.region === selectedRegion) && (!selectedCountry || p.country_code === selectedCountry)).map(p => p.city).filter(Boolean))], [products, selectedContinent, selectedRegion, selectedCountry])

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.product_description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesContinent = !selectedContinent || product.continent === selectedContinent
        const matchesRegion = !selectedRegion || product.region === selectedRegion
        const matchesCountry = !selectedCountry || product.country_code === selectedCountry
        const matchesCity = !selectedCity || product.city === selectedCity
        const matchesDate = !travelDate || (new Date(travelDate) <= new Date(product.validity_end_date))

        return matchesSearch && matchesContinent && matchesRegion && matchesCountry && matchesCity && matchesDate
    })

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Travel Agent Portal</h1>
                        <p className="text-gray-400 mt-2">Discover exclusive inventory for your clients.</p>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative md:col-span-2">
                            <FaSearch className="absolute left-3 top-3 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Date Picker */}
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
                            <input
                                type="date"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                value={travelDate}
                                onChange={(e) => setTravelDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Drill-down Filters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-800">
                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                            value={selectedContinent}
                            onChange={(e) => { setSelectedContinent(e.target.value); setSelectedRegion(''); setSelectedCountry(''); setSelectedCity('') }}
                        >
                            <option value="">All Continents</option>
                            {continents.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                            value={selectedRegion}
                            onChange={(e) => { setSelectedRegion(e.target.value); setSelectedCountry(''); setSelectedCity('') }}
                            disabled={!selectedContinent && regions.length === 0}
                        >
                            <option value="">All Regions</option>
                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                            value={selectedCountry}
                            onChange={(e) => { setSelectedCountry(e.target.value); setSelectedCity('') }}
                            disabled={!selectedRegion && countries.length === 0}
                        >
                            <option value="">All Countries</option>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            disabled={!selectedCountry && cities.length === 0}
                        >
                            <option value="">All Cities</option>
                            {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-teal-500/50 transition-all group">
                            <div className="h-48 bg-gray-800 relative">
                                {product.photo_url_1 ? (
                                    <img src={product.photo_url_1} alt={product.product_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                                )}
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                                    {product.product_category}
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <div className="flex items-center text-xs text-teal-400 mb-2">
                                        <FaMapMarkerAlt className="mr-1" /> {product.city}, {product.country_code}
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">{product.product_name}</h3>
                                </div>

                                <div className="pt-4 border-t border-gray-800 flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-gray-500">RRP</p>
                                        <p className="text-lg font-bold text-white">{product.currency} {product.suggested_retail_price}</p>
                                    </div>
                                    <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No products found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    )
}
