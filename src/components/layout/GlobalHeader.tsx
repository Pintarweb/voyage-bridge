'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaGlobe, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaLanguage } from 'react-icons/fa'
import { useCurrency } from '@/context/CurrencyContext'
import { useLanguage } from '@/context/LanguageContext'
import { createClient } from '@/utils/supabase/client'

interface GlobalHeaderProps {
    type: 'portal' | 'supplier' | 'public'
}

export default function GlobalHeader({ type }: GlobalHeaderProps) {
    const { currency, setCurrency, symbol } = useCurrency()
    const { language, setLanguage, languageName } = useLanguage()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    const getNavLinks = () => {
        switch (type) {
            case 'portal':
                return [
                    { label: 'Search', href: '/portal' },
                    { label: 'My Bookings', href: '/portal/bookings' },
                ]
            case 'supplier':
                return [
                    { label: 'Dashboard', href: '/supplier/dashboard' },
                    { label: 'Products', href: '/supplier/products' },
                ]
            case 'public':
            default:
                return [
                    { label: 'Why Us', href: '/why-us' },
                    { label: 'About Us', href: '/about' },
                    { label: 'Blog', href: '/blog' },
                    { label: 'Help', href: '/help' },
                ]
        }
    }

    const navLinks = getNavLinks()

    const getFlagUrl = (countryCode: string) => `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`

    const LANGUAGES = [
        { code: 'en-US', name: 'English (US)', flagCode: 'us' },
        { code: 'zh-CN', name: '简体中文', flagCode: 'cn' },
        { code: 'es-ES', name: 'Español', flagCode: 'es' },
        { code: 'fr-FR', name: 'Français', flagCode: 'fr' },
        { code: 'de-DE', name: 'Deutsch', flagCode: 'de' },
        { code: 'ja-JP', name: '日本語', flagCode: 'jp' },
        { code: 'ko-KR', name: '한국어', flagCode: 'kr' },
        { code: 'ar-SA', name: 'العربية', flagCode: 'sa' },
        { code: 'ms-MY', name: 'Bahasa Melayu', flagCode: 'my' },
        { code: 'th-TH', name: 'ไทย', flagCode: 'th' },
        { code: 'vi-VN', name: 'Tiếng Việt', flagCode: 'vn' },
        { code: 'id-ID', name: 'Bahasa Indonesia', flagCode: 'id' }
    ]

    const CURRENCIES = [
        { code: 'USD', symbol: '$', flagCode: 'us' },
        { code: 'EUR', symbol: '€', flagCode: 'eu' },
        { code: 'GBP', symbol: '£', flagCode: 'gb' },
        { code: 'AUD', symbol: 'A$', flagCode: 'au' },
        { code: 'MYR', symbol: 'RM', flagCode: 'my' },
        { code: 'SGD', symbol: 'S$', flagCode: 'sg' },
        { code: 'JPY', symbol: '¥', flagCode: 'jp' },
        { code: 'CNY', symbol: '¥', flagCode: 'cn' }
    ]

    const currentLang = LANGUAGES.find(l => l.code === language)
    const currentCurrency = CURRENCIES.find(c => c.code === currency)

    return (
        <header className="bg-background/80 border-b border-border sticky top-0 z-50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href={type === 'public' ? '/' : (type === 'portal' ? '/portal' : '/supplier/dashboard')} className="text-2xl font-bold text-foreground tracking-tight">
                            Ark<span className="text-primary">Alliance</span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${pathname === link.href
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center space-x-6">

                        {/* Language Selector */}
                        <div className="relative group">
                            <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground text-sm font-medium focus:outline-none">
                                {currentLang && (
                                    <img
                                        src={getFlagUrl(currentLang.flagCode)}
                                        alt={currentLang.name}
                                        className="w-5 h-auto rounded-sm object-cover"
                                    />
                                )}
                                <span>{language.split('-')[0].toUpperCase()}</span>
                            </button>
                            <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right max-h-80 overflow-y-auto scrollbar-hide">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code as any)}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-3 ${language === lang.code ? 'text-primary font-bold' : 'text-foreground'
                                            }`}
                                    >
                                        <img
                                            src={getFlagUrl(lang.flagCode)}
                                            alt={lang.name}
                                            className="w-5 h-auto rounded-sm object-cover"
                                        />
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Currency Selector */}
                        <div className="relative group">
                            <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground text-sm font-medium focus:outline-none">
                                {currentCurrency && (
                                    <img
                                        src={getFlagUrl(currentCurrency.flagCode)}
                                        alt={currentCurrency.code}
                                        className="w-5 h-auto rounded-sm object-cover"
                                    />
                                )}
                                <span>{currency} ({symbol})</span>
                            </button>
                            <div className="absolute right-0 mt-2 w-40 bg-popover border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right max-h-64 overflow-y-auto scrollbar-hide">
                                {CURRENCIES.map((c) => (
                                    <button
                                        key={c.code}
                                        onClick={() => setCurrency(c.code as any)}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-3 ${currency === c.code ? 'text-primary font-bold' : 'text-foreground'
                                            }`}
                                    >
                                        <img
                                            src={getFlagUrl(c.flagCode)}
                                            alt={c.code}
                                            className="w-5 h-auto rounded-sm object-cover"
                                        />
                                        {c.code}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* User Profile (Only for logged in types) */}
                        {type !== 'public' && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground focus:outline-none"
                                >
                                    <FaUserCircle className="text-2xl" />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-xl py-1">
                                        <button
                                            onClick={() => {/* TODO: Edit Profile */ }}
                                            className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                                        >
                                            Edit Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center"
                                        >
                                            <FaSignOutAlt className="mr-2" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-muted-foreground hover:text-foreground focus:outline-none"
                        >
                            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-background border-b border-border">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.href
                                    ? 'text-primary bg-primary/10'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="border-t border-border my-2 pt-2">
                            <div className="px-3 py-2 text-sm font-medium text-muted-foreground">Language</div>
                            <div className="grid grid-cols-2 gap-2 px-3 pb-2">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code as any)}
                                        className={`px-3 py-1 rounded text-xs border flex items-center gap-1 justify-center ${language === lang.code
                                            ? 'border-primary text-primary'
                                            : 'border-border text-muted-foreground'
                                            }`}
                                    >
                                        <img
                                            src={getFlagUrl(lang.flagCode)}
                                            alt={lang.name}
                                            className="w-4 h-auto rounded-sm object-cover"
                                        />
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-border my-2 pt-2">
                            <div className="px-3 py-2 text-sm font-medium text-muted-foreground">Currency</div>
                            <div className="flex space-x-2 px-3 pb-2 flex-wrap gap-y-2">
                                {CURRENCIES.map((c) => (
                                    <button
                                        key={c.code}
                                        onClick={() => setCurrency(c.code as any)}
                                        className={`px-3 py-1 rounded text-xs border flex items-center gap-1 ${currency === c.code
                                            ? 'border-primary text-primary'
                                            : 'border-border text-muted-foreground'
                                            }`}
                                    >
                                        <img
                                            src={getFlagUrl(c.flagCode)}
                                            alt={c.code}
                                            className="w-4 h-auto rounded-sm object-cover"
                                        />
                                        {c.code}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {type !== 'public' && (
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
