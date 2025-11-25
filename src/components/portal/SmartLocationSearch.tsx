'use client'

import { FaSearch } from 'react-icons/fa'

type SmartLocationSearchProps = {
    value: string
    onChange: (value: string) => void
}

export default function SmartLocationSearch({ value, onChange }: SmartLocationSearchProps) {
    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search by city, country, or region..."
                className="block w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
            />
        </div>
    )
}
