'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { FaGlobe, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaLanguage } from 'react-icons/fa'
import { useCurrency } from '@/context/CurrencyContext'
import { createClient } from '@/utils/supabase/client'

export default function GlobalHeader() {
    const { currency, setCurrency, symbol } = useCurrency()
    const [language, setLanguage] = useState('en')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    const [user, setUser] = useState<any>(null)

    // Determine type based on pathname
    const type = pathname?.startsWith('/agent-portal') ? 'portal' :
        pathname?.startsWith('/supplier') ? 'supplier' :
            pathname?.startsWith('/admin') ? 'admin' : 'public'

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])





    const getNavLinks = () => {
        switch (type) {
            case 'portal':
            case 'supplier':
            case 'public':
            default:
                return [
                    { label: 'Home', href: '/' },
                    { label: 'Why ArkAlliance?', href: '/why-us' },
                    { label: 'About Us', href: '/about' },
                    { label: 'Blog', href: '/blog' },
                    { label: 'Help', href: '/help' },
                ]
        }
    }

    const navLinks = getNavLinks()

    const getFlagUrl = (countryCode: string) => `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`

    const LANGUAGES = [
        { code: 'en', name: 'English (US)', flagCode: 'us' },
        { code: 'zh-CN', name: '简体中文', flagCode: 'cn' },
        { code: 'es', name: 'Español', flagCode: 'es' },
        { code: 'fr', name: 'Français', flagCode: 'fr' },
        { code: 'de', name: 'Deutsch', flagCode: 'de' },
        { code: 'ja', name: '日本語', flagCode: 'jp' },
        { code: 'ko', name: '한국어', flagCode: 'kr' },
        { code: 'ar', name: 'العربية', flagCode: 'sa' },
        { code: 'ms', name: 'Bahasa Melayu', flagCode: 'my' },
        { code: 'th', name: 'ไทย', flagCode: 'th' },
        { code: 'vi', name: 'Tiếng Việt', flagCode: 'vn' },
        { code: 'id', name: 'Bahasa Indonesia', flagCode: 'id' }
    ]

    // Initialize language from cookie or default
    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        }

        // Google translate cookie format is often /en/target-lang or just /target-lang
        const googtrans = getCookie('googtrans');
        if (googtrans) {
            // Extract the target language code
            const langCode = googtrans.split('/').pop();
            if (langCode) {
                // Map back to our supported codes if necessary
                const supported = LANGUAGES.find(l => l.code === langCode);
                if (supported) setLanguage(supported.code);
            }
        }
    }, [])

    const handleLanguageChange = (langCode: string) => {
        // Set the google translate cookie
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=/en/${langCode}; path=/`; // Fallback for localhost

        setLanguage(langCode);
        window.location.reload(); // Reload to apply translation
    }



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


    const currentCurrency = CURRENCIES.find(c => c.code === currency)
    const currentLang = LANGUAGES.find(l => l.code === language)

    // Dedicated portals have their own headers
    if (type === 'portal' || type === 'supplier' || type === 'admin') {
        return null
    }

    return (
        <header className="bg-slate-950/80 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href={type === 'public' ? '/' : (type === 'portal' ? '/agent-portal' : '/supplier/dashboard')} className="flex items-center gap-2 text-2xl font-bold text-white tracking-tight">
                            <Image
                                src="/ark-logo-icon.jpg"
                                alt="ArkAlliance Logo"
                                width={56}
                                height={56}
                                className="h-14 w-auto object-contain rounded-md"
                            />
                            <span className="notranslate">Ark<span className="text-blue-500">Alliance</span></span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${pathname === link.href
                                    ? 'text-blue-400'
                                    : 'text-slate-300 hover:text-white'
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
                            <button className="flex items-center space-x-2 text-slate-300 hover:text-white text-sm font-medium focus:outline-none">
                                {currentLang && (
                                    <img
                                        src={getFlagUrl(currentLang.flagCode)}
                                        alt={currentLang.name}
                                        className="w-5 h-auto rounded-sm object-cover"
                                    />
                                )}
                                <span>{currentLang?.code.toUpperCase()}</span>
                            </button>
                            <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right max-h-80 overflow-y-auto scrollbar-hide">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
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
                        <div className="relative group">
                            <button className="flex items-center space-x-2 text-slate-300 hover:text-white text-sm font-medium focus:outline-none">
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

                        {type === 'public' && !user && (
                            <Link
                                href="/auth/agent"
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-primary/10"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
