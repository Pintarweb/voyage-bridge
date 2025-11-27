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
            router.push(`/portal/country/${selectedCountry}`)
        }
    }

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-500/10 rounded-full mb-6">
                        <FaGlobeAmericas className="text-4xl text-teal-500" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        {content.title}
                    </h1>
                    <p className="text-lg text-gray-400">
                        {content.subtitle}
                    </p>
                </div>

                {/* Search Card */}
                <div className="bg-[#1A1A20] border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        {content.selectCountry}
                    </label>

                    <div className="flex gap-3">
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="flex-1 bg-[#101015] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                        >
                            <option value="">{content.chooseCountry}</option>
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name} ({country.productCount} {content.productsSuffix})
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleSearch}
                            disabled={!selectedCountry}
                            className="px-8 py-4 bg-teal-500 hover:bg-teal-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all transform hover:-translate-y-0.5 disabled:transform-none shadow-lg disabled:shadow-none flex items-center gap-2"
                        >
                            <FaSearch />
                            {content.search}
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-teal-400">
                                    {countries.length}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                                    {content.stats.countries}
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-400">
                                    {countries.reduce((sum, c) => sum + c.productCount, 0)}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                                    {content.stats.products}
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-400">
                                    {countries.filter(c => c.productCount > 0).length}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                                    {content.stats.activeMarkets}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Access - Top Countries */}
                {countries.length > 0 && (
                    <div className="mt-8">
                        <p className="text-sm text-gray-500 mb-4">{content.popularDestinations}</p>
                        <div className="flex flex-wrap gap-2">
                            {countries
                                .sort((a, b) => b.productCount - a.productCount)
                                .slice(0, 6)
                                .map((country) => (
                                    <button
                                        key={country.code}
                                        onClick={() => router.push(`/portal/country/${country.code}`)}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-500/50 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
                                    >
                                        {country.name}
                                    </button>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
