'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Currency = 'USD' | 'EUR' | 'MYR' | 'GBP' | 'AUD' | 'JPY' | 'CNY' | 'SGD'

interface CurrencyContextType {
    currency: Currency
    setCurrency: (currency: Currency) => void
    convertPrice: (amount: number, sourceCurrency?: string) => string
    symbol: string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Base rates relative to USD
const RATES: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    MYR: 4.45,
    GBP: 0.79,
    AUD: 1.52,
    JPY: 151.4,
    CNY: 7.23,
    SGD: 1.34
}

const SYMBOLS: Record<string, string> = {
    USD: '$',
    EUR: '€',
    MYR: 'RM',
    GBP: '£',
    AUD: 'A$',
    JPY: '¥',
    CNY: '¥',
    SGD: 'S$'
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('USD')

    const convertPrice = (amount: number, sourceCurrency: string = 'USD') => {
        if (!amount) return '0.00'

        // Convert to USD first (Base)
        const sourceRate = RATES[sourceCurrency] || 1
        const amountInUSD = amount / sourceRate

        // Convert to Target
        const targetRate = RATES[currency]
        const converted = amountInUSD * targetRate

        return converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, symbol: SYMBOLS[currency] }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider')
    }
    return context
}
