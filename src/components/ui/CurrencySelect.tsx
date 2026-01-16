'use client'

import { useState, useRef, useEffect } from 'react'

interface Currency {
    code: string
    name: string
    flagCode: string
}

interface CurrencySelectProps {
    value: string
    onChange: (value: string) => void
    currencies: Currency[]
    className?: string
    theme?: 'dark' | 'light'
}

export default function CurrencySelect({ value, onChange, currencies, className, theme = 'dark' }: CurrencySelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const wrapperRef = useRef<HTMLDivElement>(null)

    const filteredCurrencies = currencies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
    )

    const selectedCurrency = currencies.find(c => c.code === value)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [wrapperRef])

    const bgClass = theme === 'dark' ? 'bg-slate-900/50 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
    const dropdownBgClass = theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-300'
    const hoverClass = theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
    const inputClass = theme === 'dark' ? 'bg-slate-950 border-white/10 text-white placeholder-slate-500' : 'bg-gray-50 border-gray-300 text-gray-900'

    return (
        <div className={`relative ${className} ${isOpen ? 'z-50' : 'z-0'}`} ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all ${bgClass}`}
            >
                {selectedCurrency ? (
                    <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-amber-500">{selectedCurrency.code}</span>
                        <span className="truncate text-sm opacity-80">{selectedCurrency.name}</span>
                    </div>
                ) : (
                    <span className="text-slate-400">Select Currency</span>
                )}
                <svg className="w-4 h-4 ml-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute z-50 mt-2 w-full border rounded-xl shadow-2xl max-h-60 overflow-auto backdrop-blur-xl ${dropdownBgClass}`}>
                    <div className={`p-2 sticky top-0 border-b ${theme === 'dark' ? 'bg-slate-900/95 border-white/10' : 'bg-white border-gray-200'}`}>
                        <input
                            type="text"
                            placeholder="Search currency..."
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 ${inputClass}`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    {filteredCurrencies.map((currency) => (
                        <div
                            key={currency.code}
                            onClick={() => {
                                onChange(currency.code)
                                setIsOpen(false)
                                setSearch('')
                            }}
                            className={`flex items-center px-3 py-2 cursor-pointer text-sm ${hoverClass} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                        >
                            <img
                                src={`https://flagcdn.com/w40/${currency.flagCode.toLowerCase()}.png`}
                                alt={currency.code}
                                className="w-6 h-4 mr-3 object-cover rounded-sm"
                            />
                            <span>{currency.name} ({currency.code})</span>
                        </div>
                    ))}
                    {filteredCurrencies.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">No results found</div>
                    )}
                </div>
            )}
        </div>
    )
}
