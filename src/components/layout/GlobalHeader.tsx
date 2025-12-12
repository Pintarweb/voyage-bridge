'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { FaGlobe, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaLanguage } from 'react-icons/fa'
import { useCurrency } from '@/context/CurrencyContext'
import { useLanguage } from '@/context/LanguageContext'
import { createClient } from '@/utils/supabase/client'

export default function GlobalHeader() {
    const { currency, setCurrency, symbol } = useCurrency()
    const { language, setLanguage, languageName } = useLanguage()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    const [user, setUser] = useState<any>(null)

    // Determine type based on pathname
    const type = pathname?.startsWith('/portal') ? 'portal' :
        pathname?.startsWith('/supplier') ? 'supplier' : 'public'

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



    const t = {
        'en-US': { home: 'Home', whyUs: 'Why ArkAlliance?', about: 'About Us', blog: 'Blog', help: 'Help', logout: 'Logout', login: 'Login' },
        'zh-CN': { home: '首页', whyUs: '为什么选择 ArkAlliance？', about: '关于我们', blog: '博客', help: '帮助', logout: '退出登录', login: '登录' },
        'ms-MY': { home: 'Laman Utama', whyUs: 'Kenapa ArkAlliance?', about: 'Tentang Kami', blog: 'Blog', help: 'Bantuan', logout: 'Log Keluar', login: 'Log Masuk' },
        'es-ES': { home: 'Inicio', whyUs: '¿Por Qué ArkAlliance?', about: 'Sobre Nosotros', blog: 'Blog', help: 'Ayuda', logout: 'Cerrar Sesión', login: 'Iniciar Sesión' },
        'fr-FR': { home: 'Accueil', whyUs: 'Pourquoi ArkAlliance ?', about: 'À Propos', blog: 'Blog', help: 'Aide', logout: 'Déconnexion', login: 'Connexion' },
        'de-DE': { home: 'Startseite', whyUs: 'Warum ArkAlliance?', about: 'Über Uns', blog: 'Blog', help: 'Hilfe', logout: 'Abmelden', login: 'Anmelden' },
        'ja-JP': { home: 'ホーム', whyUs: 'ArkAllianceが選ばれる理由', about: '会社概要', blog: 'ブログ', help: 'ヘルプ', logout: 'ログアウト', login: 'ログイン' },
        'ko-KR': { home: '홈', whyUs: 'ArkAlliance를 선택하는 이유', about: '회사 소개', blog: '블로그', help: '도움말', logout: '로그아웃', login: '로그인' },
        'ar-SA': { home: 'الرئيسية', whyUs: 'لماذا ArkAlliance؟', about: 'من نحن', blog: 'مدونة', help: 'مساعدة', logout: 'تسجيل الخروج', login: 'تسجيل الدخول' },
        'th-TH': { home: 'หน้าแรก', whyUs: 'ทำไมต้อง ArkAlliance?', about: 'เกี่ยวกับเรา', blog: 'บล็อก', help: 'ช่วยเหลือ', logout: 'ออกจากระบบ', login: 'เข้าสู่ระบบ' },
        'vi-VN': { home: 'Trang Chủ', whyUs: 'Tại Sao Chọn ArkAlliance?', about: 'Về Chúng Tôi', blog: 'Blog', help: 'Trợ Giúp', logout: 'Đăng Xuất', login: 'Đăng Nhập' },
        'id-ID': { home: 'Beranda', whyUs: 'Mengapa ArkAlliance?', about: 'Tentang Kami', blog: 'Blog', help: 'Bantuan', logout: 'Keluar', login: 'Masuk' }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    const getNavLinks = () => {
        switch (type) {
            case 'portal':
            case 'supplier':
            case 'public':
            default:
                return [
                    { label: content.home, href: '/' },
                    { label: content.whyUs, href: '/why-us' },
                    { label: content.about, href: '/about' },
                    { label: content.blog, href: '/blog' },
                    { label: content.help, href: '/help' },
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
                        <Link href={type === 'public' ? '/' : (type === 'portal' ? '/portal' : '/supplier/dashboard')} className="flex items-center gap-2 text-2xl font-bold text-foreground tracking-tight">
                            <Image
                                src="/ark-logo-icon.jpg"
                                alt="ArkAlliance Logo"
                                width={56}
                                height={56}
                                className="h-14 w-auto object-contain rounded-md"
                            />
                            <span>Ark<span className="text-primary">Alliance</span></span>
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
