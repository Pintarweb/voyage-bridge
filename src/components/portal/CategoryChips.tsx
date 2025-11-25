'use client'

import { FaHotel, FaPlane, FaUmbrellaBeach, FaShip, FaHiking } from 'react-icons/fa'

type CategoryChipsProps = {
    selectedCategory: string
    onSelect: (category: string) => void
}

const CATEGORIES = [
    { id: 'Hotel Chain', label: 'Hotels', icon: FaHotel },
    { id: 'Tour Operator', label: 'Tours', icon: FaHiking },
    { id: 'DMC', label: 'DMC', icon: FaUmbrellaBeach },
    { id: 'Cruise Line', label: 'Cruises', icon: FaShip },
    { id: 'Transport', label: 'Transport', icon: FaPlane },
]

export default function CategoryChips({ selectedCategory, onSelect }: CategoryChipsProps) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
                onClick={() => onSelect('')}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === ''
                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                    }`}
            >
                All
            </button>
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat.id
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                        }`}
                >
                    <cat.icon />
                    {cat.label}
                </button>
            ))}
        </div>
    )
}
