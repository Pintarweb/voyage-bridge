'use client'

import GlobalHeader from '@/components/layout/GlobalHeader'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { FaBuilding, FaGlobeAmericas, FaUserTie, FaMapMarkedAlt, FaHandshake, FaPlaneDeparture } from 'react-icons/fa'
import TourismBackground from '@/components/ui/TourismBackground'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function Home() {
  const [stats, setStats] = useState<any>(null)
  const supabase = createClient()
  const { language } = useLanguage()

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.rpc('get_landing_stats')
      setStats(data)
    }
    fetchStats()
  }, [])

  const supplierCount = stats?.suppliers || 0
  const productCount = stats?.products || 0
  const agentCount = stats?.agents || 0

  const t = {
    'en-US': {
      badge: 'Bridging B2B Together',
      title: 'Connect. Trade.',
      subtitle: 'Explore the World.',
      desc: 'The premium ecosystem where verified global suppliers and elite travel agents build profitable partnerships.',
      ctaAgent: 'Start Trading',
      ctaSupplier: 'For Suppliers',
      statsSuppliers: 'Verified Suppliers',
      statsProducts: 'Active Products',
      statsAgents: 'Partner Agents',
      statsSuppliersDesc: 'Global partners ready to connect',
      statsProductsDesc: 'Exclusive deals and packages',
      statsAgentsDesc: 'Trusted professionals worldwide'
    },
    'zh-CN': {
      badge: '共同搭建B2B桥梁',
      title: '连接。交易。',
      subtitle: '探索世界。',
      desc: '经过验证的全球供应商和精英旅行社建立盈利合作伙伴关系的优质生态系统。',
      ctaAgent: '开始交易',
      ctaSupplier: '供应商入口',
      statsSuppliers: '认证供应商',
      statsProducts: '活跃产品',
      statsAgents: '合作伙伴',
      statsSuppliersDesc: '全球合作伙伴随时准备连接',
      statsProductsDesc: '独家优惠和套餐',
      statsAgentsDesc: '值得信赖的全球专业人士'
    },
    'ms-MY': {
      badge: 'Menghubungkan B2B Bersama',
      title: 'Sambung. Dagang.',
      subtitle: 'Terokai Dunia.',
      desc: 'Ekosistem premium di mana pembekal global yang disahkan dan ejen pelancongan elit membina perkongsian yang menguntungkan.',
      ctaAgent: 'Mula Berdagang',
      ctaSupplier: 'Untuk Pembekal',
      statsSuppliers: 'Pembekal Disahkan',
      statsProducts: 'Produk Aktif',
      statsAgents: 'Ejen Rakan Kongsi',
      statsSuppliersDesc: 'Rakan kongsi global sedia untuk berhubung',
      statsProductsDesc: 'Tawaran dan pakej eksklusif',
      statsAgentsDesc: 'Profesional dipercayai di seluruh dunia'
    },
    'es-ES': {
      badge: 'Uniendo B2B Juntos',
      title: 'Conectar. Comerciar.',
      subtitle: 'Explora el Mundo.',
      desc: 'El ecosistema premium donde proveedores globales verificados y agentes de viajes de élite construyen asociaciones rentables.',
      ctaAgent: 'Empezar a Operar',
      ctaSupplier: 'Para Proveedores',
      statsSuppliers: 'Proveedores Verificados',
      statsProducts: 'Productos Activos',
      statsAgents: 'Agentes Asociados',
      statsSuppliersDesc: 'Socios globales listos para conectar',
      statsProductsDesc: 'Ofertas y paquetes exclusivos',
      statsAgentsDesc: 'Profesionales de confianza en todo el mundo'
    },
    'fr-FR': {
      badge: 'Rapprocher le B2B Ensemble',
      title: 'Connecter. Échanger.',
      subtitle: 'Explorez le Monde.',
      desc: 'L\'écosystème premium où les fournisseurs mondiaux vérifiés et les agents de voyages d\'élite établissent des partenariats rentables.',
      ctaAgent: 'Commencer à Trader',
      ctaSupplier: 'Pour les Fournisseurs',
      statsSuppliers: 'Fournisseurs Vérifiés',
      statsProducts: 'Produits Actifs',
      statsAgents: 'Agents Partenaires',
      statsSuppliersDesc: 'Partenaires mondiaux prêts à se connecter',
      statsProductsDesc: 'Offres et forfaits exclusifs',
      statsAgentsDesc: 'Professionnels de confiance dans le monde entier'
    },
    'de-DE': {
      badge: 'B2B Gemeinsam Verbinden',
      title: 'Verbinden. Handeln.',
      subtitle: 'Entdecke die Welt.',
      desc: 'Das Premium-Ökosystem, in dem verifizierte globale Lieferanten und Elite-Reisebüros profitable Partnerschaften aufbauen.',
      ctaAgent: 'Handel Starten',
      ctaSupplier: 'Für Lieferanten',
      statsSuppliers: 'Verifizierte Lieferanten',
      statsProducts: 'Aktive Produkte',
      statsAgents: 'Partneragenten',
      statsSuppliersDesc: 'Globale Partner bereit zur Verbindung',
      statsProductsDesc: 'Exklusive Angebote und Pakete',
      statsAgentsDesc: 'Vertrauenswürdige Profis weltweit'
    },
    'ja-JP': {
      badge: 'B2Bを共に架ける',
      title: 'つながる。取引する。',
      subtitle: '世界を探検しよう。',
      desc: '検証済みのグローバルサプライヤーとエリート旅行代理店が収益性の高いパートナーシップを築くプレミアムエコシステム。',
      ctaAgent: '取引を開始',
      ctaSupplier: 'サプライヤー向け',
      statsSuppliers: '認証済みサプライヤー',
      statsProducts: 'アクティブな製品',
      statsAgents: 'パートナーエージェント',
      statsSuppliersDesc: 'つながる準備ができているグローバルパートナー',
      statsProductsDesc: '限定セールとパッケージ',
      statsAgentsDesc: '世界中の信頼できる専門家'
    },
    'ko-KR': {
      badge: 'B2B를 함께 연결하다',
      title: '연결하다. 거래하다.',
      subtitle: '세상을 탐험하세요.',
      desc: '검증된 글로벌 공급업체와 엘리트 여행사가 수익성 있는 파트너십을 구축하는 프리미엄 생태계.',
      ctaAgent: '거래 시작',
      ctaSupplier: '공급업체용',
      statsSuppliers: '인증된 공급업체',
      statsProducts: '활성 제품',
      statsAgents: '파트너 에이전트',
      statsSuppliersDesc: '연결 준비가 된 글로벌 파트너',
      statsProductsDesc: '독점 거래 및 패키지',
      statsAgentsDesc: '전 세계적으로 신뢰받는 전문가'
    },
    'ar-SA': {
      badge: 'ربط B2B معًا',
      title: 'تواصل. تاجر.',
      subtitle: 'استكشف العالم.',
      desc: 'النظام البيئي المتميز حيث يبني الموردون العالميون المعتمدون ووكلاء السفر النخبة شراكات مربحة.',
      ctaAgent: 'ابدأ التداول',
      ctaSupplier: 'للموردين',
      statsSuppliers: 'موردون معتمدون',
      statsProducts: 'منتجات نشطة',
      statsAgents: 'وكلاء شركاء',
      statsSuppliersDesc: 'شركاء عالميون مستعدون للتواصل',
      statsProductsDesc: 'عروض وباقات حصرية',
      statsAgentsDesc: 'محترفون موثوقون حول العالم'
    },
    'th-TH': {
      badge: 'เชื่อมโยง B2B เข้าด้วยกัน',
      title: 'เชื่อมต่อ ค้าขาย',
      subtitle: 'สำรวจโลก',
      desc: 'ระบบนิเวศระดับพรีเมียมที่ซัพพลายเออร์ระดับโลกที่ผ่านการตรวจสอบและตัวแทนท่องเที่ยวชั้นนำสร้างพันธมิตรที่ทำกำไร',
      ctaAgent: 'เริ่มการซื้อขาย',
      ctaSupplier: 'สำหรับซัพพลายเออร์',
      statsSuppliers: 'ซัพพลายเออร์ที่ผ่านการตรวจสอบ',
      statsProducts: 'สินค้าที่ใช้งานอยู่',
      statsAgents: 'ตัวแทนพันธมิตร',
      statsSuppliersDesc: 'พันธมิตรระดับโลกพร้อมเชื่อมต่อ',
      statsProductsDesc: 'ข้อเสนอและแพ็คเกจพิเศษ',
      statsAgentsDesc: 'ผู้เชี่ยวชาญที่เชื่อถือได้ทั่วโลก'
    },
    'vi-VN': {
      badge: 'Cùng Nhau Kết Nối B2B',
      title: 'Kết nối. Giao thương.',
      subtitle: 'Khám Phá Thế Giới.',
      desc: 'Hệ sinh thái cao cấp nơi các nhà cung cấp toàn cầu đã được xác minh và các đại lý du lịch ưu tú xây dựng quan hệ đối tác có lợi nhuận.',
      ctaAgent: 'Bắt Đầu Giao Dịch',
      ctaSupplier: 'Dành Cho Nhà Cung Cấp',
      statsSuppliers: 'Nhà Cung Cấp Đã Xác Minh',
      statsProducts: 'Sản Phẩm Đang Hoạt Động',
      statsAgents: 'Đại Lý Đối Tác',
      statsSuppliersDesc: 'Các đối tác toàn cầu sẵn sàng kết nối',
      statsProductsDesc: 'Ưu đãi và gói độc quyền',
      statsAgentsDesc: 'Các chuyên gia đáng tin cậy trên toàn thế giới'
    },
    'id-ID': {
      badge: 'Menjembatani B2B Bersama',
      title: 'Terhubung. Berdagang.',
      subtitle: 'Jelajahi Dunia.',
      desc: 'Ekosistem premium di mana pemasok global terverifikasi dan agen perjalanan elit membangun kemitraan yang menguntungkan.',
      ctaAgent: 'Mulai Berdagang',
      ctaSupplier: 'Untuk Pemasok',
      statsSuppliers: 'Pemasok Terverifikasi',
      statsProducts: 'Produk Aktif',
      statsAgents: 'Agen Mitra',
      statsSuppliersDesc: 'Mitra global siap terhubung',
      statsProductsDesc: 'Penawaran dan paket eksklusif',
      statsAgentsDesc: 'Profesional tepercaya di seluruh dunia'
    }
  }

  const content = t[language as keyof typeof t] || t['en-US']

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navbar */}
      <GlobalHeader type="public" />

      {/* Hero Section */}
      <section className="relative w-full py-8 md:py-12 lg:py-16 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Abstract Tourism Background */}
        <TourismBackground />

        <div className="z-10 max-w-5xl mx-auto space-y-4 relative">
          <div className="inline-block px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm text-rose-600 font-bold tracking-wide uppercase text-[10px] md:text-sm mb-2 animate-fade-in-up">
            {content.badge}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm leading-tight">
            {content.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 relative inline-block transform hover:scale-105 transition-transform duration-300" style={{ textShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              {content.subtitle}
            </span>
          </h1>
          <p className="text-sm md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-light px-4">
            {content.desc}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 md:pt-6 px-4">
            <Link
              href="/auth/agent"
              className="group relative px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-sm md:text-base rounded-xl shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 transition-all transform hover:-translate-y-1 overflow-hidden w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {content.ctaAgent} <FaPlaneDeparture />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <Link
              href="/auth/supplier"
              className="group px-6 py-2 md:px-8 md:py-3 bg-white text-slate-800 font-bold text-sm md:text-base rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-slate-200 w-full sm:w-auto"
            >
              {content.ctaSupplier}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 -mt-8 md:-mt-12 px-4 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Supplier Stats */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                <FaBuilding />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-2">
                {supplierCount || 0}+
              </div>
              <div className="text-slate-600 font-bold uppercase tracking-wider text-xs md:text-sm">
                {content.statsSuppliers}
              </div>
              <div className="mt-2 text-xs text-slate-400">{content.statsSuppliersDesc}</div>
            </div>
          </div>

          {/* Product Stats */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                <FaMapMarkedAlt />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-rose-600 mb-2">
                {productCount || 0}+
              </div>
              <div className="text-slate-600 font-bold uppercase tracking-wider text-xs md:text-sm">
                {content.statsProducts}
              </div>
              <div className="mt-2 text-xs text-slate-400">{content.statsProductsDesc}</div>
            </div>
          </div>

          {/* Agent Stats */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                <FaHandshake />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-violet-600 mb-2">
                {agentCount || 0}+
              </div>
              <div className="text-slate-600 font-bold uppercase tracking-wider text-xs md:text-sm">
                {content.statsAgents}
              </div>
              <div className="mt-2 text-xs text-slate-400">{content.statsAgentsDesc}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
