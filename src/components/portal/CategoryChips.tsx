'use client'

import { FaHotel, FaHiking, FaUmbrellaBeach, FaShip, FaPlane, FaGlobeAmericas } from 'react-icons/fa'

interface CategoryChipsProps {
    selectedCategory: string
    onSelect: (category: string) => void
    categories: string[]
}

const getIcon = (category: string) => {
    const lower = category.toLowerCase()
    if (lower.includes('hotel')) return FaHotel
    if (lower.includes('tour')) return FaHiking
    if (lower.includes('dmc')) return FaUmbrellaBeach
    if (lower.includes('cruise')) return FaShip
    if (lower.includes('transport')) return FaPlane
    return FaGlobeAmericas
}

export default function CategoryChips({ selectedCategory, onSelect, categories }: CategoryChipsProps) {
    return (
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
                onClick={() => onSelect('')}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === ''
                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                    }`}
            >
                All
            </button>

            {categories.map((category) => {
                const Icon = getIcon(category)
                return (
                    <button
                        key={category}
                        onClick={() => onSelect(category)}
                        className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category
                                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                            }`}
                    >
                        <Icon className="mr-2" />
                        {category}
                    </button>
                )
            })}
        </div>
    )
}
