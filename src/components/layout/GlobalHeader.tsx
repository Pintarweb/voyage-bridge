'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaGlobe, FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'
import { useCurrency } from '@/context/CurrencyContext'
import { createClient } from '@/utils/supabase/client'

interface GlobalHeaderProps {
    type: 'portal' | 'supplier'
}

export default function GlobalHeader({ type }: GlobalHeaderProps) {
    const { currency, setCurrency, symbol } = useCurrency()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    const navLinks = type === 'portal' ? [
        { label: 'Search', href: '/portal' },
        { label: 'My Bookings', href: '/portal/bookings' },
    ] : [
        { label: 'Dashboard', href: '/supplier/dashboard' },
        { label: 'Products', href: '/supplier/products' },
    ]

    return (
        <header className="bg-[#101015] border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href={type === 'portal' ? '/portal' : '/supplier/dashboard'} className="text-2xl font-bold text-white tracking-tight">
                            Voyage<span className="text-teal-500">Bridge</span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${pathname === link.href
                                    ? 'text-teal-400'
                                    : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center space-x-6">

                        {/* Currency Selector */}
                        <div className="relative group">
                            <button className="flex items-center space-x-1 text-gray-300 hover:text-white text-sm font-medium focus:outline-none">
                                <FaGlobe className="text-teal-500" />
                                <span>{currency} ({symbol})</span>
                            </button>
                            <div className="absolute right-0 mt-2 w-32 bg-[#1A1A20] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right max-h-64 overflow-y-auto scrollbar-hide">
                                {['USD', 'EUR', 'GBP', 'AUD', 'MYR', 'SGD', 'JPY', 'CNY'].map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setCurrency(c as any)}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/5 ${currency === c ? 'text-teal-400 font-bold' : 'text-gray-300'
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>


                        {/* User Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none"
                            >
                                <FaUserCircle className="text-2xl" />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#1A1A20] border border-white/10 rounded-lg shadow-xl py-1">
                                    <button
                                        onClick={() => {/* TODO: Edit Profile */ }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 flex items-center"
                                    >
                                        <FaSignOutAlt className="mr-2" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none"
                        >
                            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#1A1A20] border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.href
                                    ? 'text-teal-400 bg-white/5'
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="border-t border-white/10 my-2 pt-2">
                            <div className="px-3 py-2 text-sm font-medium text-gray-400">Currency</div>
                            <div className="flex space-x-2 px-3 pb-2">
                                {['USD', 'EUR', 'MYR'].map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setCurrency(c as any)}
                                        className={`px-3 py-1 rounded text-xs border ${currency === c
                                            ? 'border-teal-500 text-teal-400'
                                            : 'border-gray-600 text-gray-400'
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-white/5"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </header>
    )
}
