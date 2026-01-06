'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaGlobeAmericas, FaSearch } from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'

type CountryOption = {
    code: string
    name: string
    productCount: number
}

export default function CountrySearchView({ countries }: { countries: CountryOption[] }) {
    const [selectedCountry, setSelectedCountry] = useState('')
    const router = useRouter()
    const { language } = useLanguage()

    const t = {
        'en-US': {
            title: 'Discover Travel Suppliers',
            subtitle: 'Search by country to find land operators, transport providers, and hotels',
            selectCountry: 'Select a Country',
            chooseCountry: 'Choose a country...',
            search: 'Search',
            stats: {
                countries: 'Countries',
                products: 'Products',
                activeMarkets: 'Active Markets'
            },
            popularDestinations: 'Popular destinations:',
            productsSuffix: 'products'
        },
        'zh-CN': {
            title: '发现旅游供应商',
            subtitle: '按国家搜索以查找地接社、交通提供商和酒店',
            selectCountry: '选择国家',
            chooseCountry: '选择一个国家...',
            search: '搜索',
            stats: {
                countries: '国家',
                products: '产品',
                activeMarkets: '活跃市场'
            },
            popularDestinations: '热门目的地：',
            productsSuffix: '产品'
        },
        'ms-MY': {
            title: 'Temui Pembekal Pelancongan',
            subtitle: 'Cari mengikut negara untuk mencari operator darat, penyedia pengangkutan, dan hotel',
            selectCountry: 'Pilih Negara',
            chooseCountry: 'Pilih negara...',
            search: 'Cari',
            stats: {
                countries: 'Negara',
                products: 'Produk',
                activeMarkets: 'Pasaran Aktif'
            },
            popularDestinations: 'Destinasi popular:',
            productsSuffix: 'produk'
        },
        'es-ES': {
            title: 'Descubra Proveedores de Viajes',
            subtitle: 'Busque por país para encontrar operadores terrestres, proveedores de transporte y hoteles',
            selectCountry: 'Seleccione un País',
            chooseCountry: 'Elija un país...',
            search: 'Buscar',
            stats: {
                countries: 'Países',
                products: 'Productos',
                activeMarkets: 'Mercados Activos'
            },
            popularDestinations: 'Destinos populares:',
            productsSuffix: 'productos'
        },
        'fr-FR': {
            title: 'Découvrez les Fournisseurs de Voyage',
            subtitle: 'Recherchez par pays pour trouver des opérateurs terrestres, des fournisseurs de transport et des hôtels',
            selectCountry: 'Sélectionnez un Pays',
            chooseCountry: 'Choisissez un pays...',
            search: 'Rechercher',
            stats: {
                countries: 'Pays',
                products: 'Produits',
                activeMarkets: 'Marchés Actifs'
            },
            popularDestinations: 'Destinations populaires :',
            productsSuffix: 'produits'
        },
        'de-DE': {
            title: 'Reiseanbieter Entdecken',
            subtitle: 'Suchen Sie nach Land, um Landoperatoren, Transportanbieter und Hotels zu finden',
            selectCountry: 'Wählen Sie ein Land',
            chooseCountry: 'Wählen Sie ein Land...',
            search: 'Suchen',
            stats: {
                countries: 'Länder',
                products: 'Produkte',
                activeMarkets: 'Aktive Märkte'
            },
            popularDestinations: 'Beliebte Reiseziele:',
            productsSuffix: 'Produkte'
        },
        'ja-JP': {
            title: '旅行サプライヤーを発見',
            subtitle: '国で検索して、ランドオペレーター、交通機関、ホテルを見つけましょう',
            selectCountry: '国を選択',
            chooseCountry: '国を選択...',
            search: '検索',
            stats: {
                countries: '国',
                products: '製品',
                activeMarkets: 'アクティブな市場'
            },
            popularDestinations: '人気の目的地：',
            productsSuffix: '製品'
        },
        'ko-KR': {
            title: '여행 공급업체 찾기',
            subtitle: '국가별로 검색하여 랜드 오퍼레이터, 운송 제공업체 및 호텔을 찾으십시오',
            selectCountry: '국가 선택',
            chooseCountry: '국가를 선택하세요...',
            search: '검색',
            stats: {
                countries: '국가',
                products: '제품',
                activeMarkets: '활성 시장'
            },
            popularDestinations: '인기 여행지:',
            productsSuffix: '제품'
        },
        'ar-SA': {
            title: 'اكتشف موردي السفر',
            subtitle: 'ابحث حسب الدولة للعثور على مشغلي الرحلات البرية ومقدمي خدمات النقل والفنادق',
            selectCountry: 'اختر دولة',
            chooseCountry: 'اختر دولة...',
            search: 'بحث',
            stats: {
                countries: 'دول',
                products: 'منتجات',
                activeMarkets: 'أسواق نشطة'
            },
            popularDestinations: 'الوجهات الشهيرة:',
            productsSuffix: 'منتجات'
        },
        'th-TH': {
            title: 'ค้นพบซัพพลายเออร์การท่องเที่ยว',
            subtitle: 'ค้นหาตามประเทศเพื่อค้นหาผู้ประกอบการทางบก ผู้ให้บริการขนส่ง และโรงแรม',
            selectCountry: 'เลือกประเทศ',
            chooseCountry: 'เลือกประเทศ...',
            search: 'ค้นหา',
            stats: {
                countries: 'ประเทศ',
                products: 'ผลิตภัณฑ์',
                activeMarkets: 'ตลาดที่ใช้งานอยู่'
            },
            popularDestinations: 'จุดหมายปลายทางยอดนิยม:',
            productsSuffix: 'ผลิตภัณฑ์'
        },
        'vi-VN': {
            title: 'Khám phá Nhà cung cấp Du lịch',
            subtitle: 'Tìm kiếm theo quốc gia để tìm các nhà điều hành tour, nhà cung cấp vận chuyển và khách sạn',
            selectCountry: 'Chọn Quốc gia',
            chooseCountry: 'Chọn một quốc gia...',
            search: 'Tìm kiếm',
            stats: {
                countries: 'Quốc gia',
                products: 'Sản phẩm',
                activeMarkets: 'Thị trường Hoạt động'
            },
            popularDestinations: 'Điểm đến phổ biến:',
            productsSuffix: 'sản phẩm'
        },
        'id-ID': {
            title: 'Temukan Pemasok Perjalanan',
            subtitle: 'Cari berdasarkan negara untuk menemukan operator darat, penyedia transportasi, dan hotel',
            selectCountry: 'Pilih Negara',
            chooseCountry: 'Pilih negara...',
            search: 'Cari',
            stats: {
                countries: 'Negara',
                products: 'Produk',
                activeMarkets: 'Pasar Aktif'
            },
            popularDestinations: 'Destinasi populer:',
            productsSuffix: 'produk'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    const handleSearch = () => {
        if (selectedCountry) {
            router.push(`/agent-portal/country/${selectedCountry}`)
        }
    }

    return (
        <div className="flex items-center justify-center px-4 py-12">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white shadow-lg rounded-full mb-6 transform hover:scale-110 transition-transform duration-300">
                        <FaGlobeAmericas className="text-4xl text-rose-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight drop-shadow-sm">
                        {content.title}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
                        {content.subtitle}
                    </p>
                </div>

                {/* Search Card */}
                <div className="bg-gradient-to-br from-blue-900 to-blue-400 rounded-3xl p-8 shadow-2xl relative overflow-hidden group border border-white/20">
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm"></div>

                    <div className="relative z-10">
                        <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide drop-shadow-sm">
                            {content.selectCountry}
                        </label>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="w-full bg-white/90 border-0 rounded-xl px-4 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all appearance-none font-medium shadow-lg"
                                >
                                    <option value="">{content.chooseCountry}</option>
                                    {countries.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.name} ({country.productCount} {content.productsSuffix})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            <button
                                onClick={handleSearch}
                                disabled={!selectedCountry}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 disabled:bg-white/50 disabled:text-white/50 disabled:cursor-not-allowed font-black rounded-xl transition-all transform hover:-translate-y-1 disabled:transform-none shadow-lg disabled:shadow-none flex items-center justify-center gap-2 min-w-[140px]"
                            >
                                <FaSearch />
                                {content.search}
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="mt-10 pt-8 border-t border-white/20">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Countries Stat */}
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center hover:bg-white/20 transition-colors">
                                    <div className="text-3xl font-black text-white mb-1 drop-shadow-sm">
                                        {countries.length}
                                    </div>
                                    <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
                                        {content.stats.countries}
                                    </div>
                                </div>

                                {/* Products Stat */}
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center hover:bg-white/20 transition-colors">
                                    <div className="text-3xl font-black text-white mb-1 drop-shadow-sm">
                                        {countries.reduce((sum, c) => sum + c.productCount, 0)}
                                    </div>
                                    <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
                                        {content.stats.products}
                                    </div>
                                </div>

                                {/* Active Markets Stat */}
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center hover:bg-white/20 transition-colors">
                                    <div className="text-3xl font-black text-white mb-1 drop-shadow-sm">
                                        {countries.filter(c => c.productCount > 0).length}
                                    </div>
                                    <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
                                        {content.stats.activeMarkets}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Access - Top Countries */}
                {countries.length > 0 && (
                    <div className="mt-10 text-center">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">{content.popularDestinations}</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {countries
                                .sort((a, b) => b.productCount - a.productCount)
                                .slice(0, 6)
                                .map((country) => (
                                    <button
                                        key={country.code}
                                        onClick={() => router.push(`/agent-portal/country/${country.code}`)}
                                        className="group relative flex flex-col items-center transition-transform hover:scale-110"
                                        title={country.name}
                                    >
                                        <div className="w-16 h-12 shadow-lg rounded-md overflow-hidden border-2 border-white group-hover:border-rose-400 transition-colors relative">
                                            <img
                                                src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                                                srcSet={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png 2x`}
                                                alt={country.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-colors"></div>
                                        </div>
                                        <span className="mt-2 text-xs font-bold text-slate-600 group-hover:text-rose-600 transition-colors bg-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
                                            {country.name}
                                        </span>
                                    </button>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
