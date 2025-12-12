'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaFacebook, FaLinkedin, FaYoutube, FaInstagram, FaDiscord, FaTwitter } from 'react-icons/fa'

import { useLanguage } from '@/context/LanguageContext'

export default function Footer() {
    const { language } = useLanguage()

    const t = {
        'en-US': {
            desc: 'A comprehensive travel infrastructure designed to simplify and democratize sourcing and distribution for industry partners.',
            company: 'Company',
            about: 'About us',
            careers: 'Careers',
            blog: 'Blog',
            nav: 'Navigation',
            home: 'Home',
            whyUs: 'Why Ark Alliance?',
            packages: 'Service Packages',
            resources: 'Resources',
            docs: 'Documentation',
            help: 'Help Center',
            rights: '2025. All Rights Reserved. Ark Alliance is made with ♥ in Malaysia.',
            cookies: 'Cookies policy',
            privacy: 'Privacy policy',
            legal: 'Legal Notice'
        },
        'zh-CN': {
            desc: '旨在简化和大众化行业合作伙伴采购与分销的综合旅游基础设施。',
            company: '公司',
            about: '关于我们',
            careers: '招聘信息',
            blog: '博客',
            nav: '导航',
            home: '首页',
            whyUs: '为什么选择 Ark Alliance？',
            packages: '服务套餐',
            resources: '资源',
            docs: '文档',
            help: '帮助中心',
            rights: '2025. 保留所有权利。Ark Alliance 用 ♥ 在马来西亚制作。',
            cookies: 'Cookie 政策',
            privacy: '隐私政策',
            legal: '法律声明'
        },
        'ms-MY': {
            desc: 'Infrastruktur pelancongan komprehensif yang direka untuk memudahkan dan mendemokrasikan penyumberan dan pengedaran bagi rakan industri.',
            company: 'Syarikat',
            about: 'Tentang Kami',
            careers: 'Kerjaya',
            blog: 'Blog',
            nav: 'Navigasi',
            home: 'Laman Utama',
            whyUs: 'Kenapa Ark Alliance?',
            packages: 'Pakej Perkhidmatan',
            resources: 'Sumber',
            docs: 'Dokumentasi',
            help: 'Pusat Bantuan',
            rights: '2025. Hak Cipta Terpelihara. Ark Alliance dibuat dengan ♥ di Malaysia.',
            cookies: 'Dasar Kuki',
            privacy: 'Dasar Privasi',
            legal: 'Notis Undang-undang'
        },
        'es-ES': {
            desc: 'Una infraestructura de viajes integral diseñada para simplificar y democratizar el abastecimiento y la distribución para los socios de la industria.',
            company: 'Empresa',
            about: 'Sobre nosotros',
            careers: 'Carreras',
            blog: 'Blog',
            nav: 'Navegación',
            home: 'Inicio',
            whyUs: '¿Por qué Ark Alliance?',
            packages: 'Paquetes de Servicios',
            resources: 'Recursos',
            docs: 'Documentación',
            help: 'Centro de Ayuda',
            rights: '2025. Todos los derechos reservados. Ark Alliance hecho con ♥ en Malasia.',
            cookies: 'Política de cookies',
            privacy: 'Política de privacidad',
            legal: 'Aviso legal'
        },
        'fr-FR': {
            desc: 'Une infrastructure de voyage complète conçue pour simplifier et démocratiser l\'approvisionnement et la distribution pour les partenaires de l\'industrie.',
            company: 'Entreprise',
            about: 'À propos',
            careers: 'Carrières',
            blog: 'Blog',
            nav: 'Navigation',
            home: 'Accueil',
            whyUs: 'Pourquoi Ark Alliance ?',
            packages: 'Forfaits de Services',
            resources: 'Ressources',
            docs: 'Documentation',
            help: 'Centre d\'aide',
            rights: '2025. Tous droits réservés. Ark Alliance fait avec ♥ en Malaisie.',
            cookies: 'Politique de cookies',
            privacy: 'Politique de confidentialité',
            legal: 'Mentions légales'
        },
        'de-DE': {
            desc: 'Eine umfassende Reiseinfrastruktur, die entwickelt wurde, um die Beschaffung und den Vertrieb für Industriepartner zu vereinfachen und zu demokratisieren.',
            company: 'Unternehmen',
            about: 'Über uns',
            careers: 'Karriere',
            blog: 'Blog',
            nav: 'Navigation',
            home: 'Startseite',
            whyUs: 'Warum Ark Alliance?',
            packages: 'Servicepakete',
            resources: 'Ressourcen',
            docs: 'Dokumentation',
            help: 'Hilfezentrum',
            rights: '2025. Alle Rechte vorbehalten. Ark Alliance mit ♥ in Malaysia gemacht.',
            cookies: 'Cookie-Richtlinie',
            privacy: 'Datenschutzrichtlinie',
            legal: 'Rechtlicher Hinweis'
        },
        'ja-JP': {
            desc: '業界パートナーの調達と流通を簡素化し、民主化するために設計された包括的な旅行インフラストラクチャ。',
            company: '会社',
            about: '私たちについて',
            careers: '採用情報',
            blog: 'ブログ',
            nav: 'ナビゲーション',
            home: 'ホーム',
            whyUs: 'Ark Allianceを選ぶ理由',
            packages: 'サービスパッケージ',
            resources: 'リソース',
            docs: 'ドキュメント',
            help: 'ヘルプセンター',
            rights: '2025. 全著作権所有。Ark Allianceはマレーシアで♥を込めて作られました。',
            cookies: 'クッキーポリシー',
            privacy: 'プライバシーポリシー',
            legal: '法的通知'
        },
        'ko-KR': {
            desc: '업계 파트너를 위한 소싱 및 유통을 단순화하고 민주화하기 위해 설계된 포괄적인 여행 인프라.',
            company: '회사',
            about: '회사 소개',
            careers: '채용',
            blog: '블로그',
            nav: '네비게이션',
            home: '홈',
            whyUs: '왜 Ark Alliance인가?',
            packages: '서비스 패키지',
            resources: '자원',
            docs: '문서',
            help: '도움말 센터',
            rights: '2025. 모든 권리 보유. Ark Alliance는 말레이시아에서 ♥로 만들어졌습니다.',
            cookies: '쿠키 정책',
            privacy: '개인정보 처리방침',
            legal: '법적 고지'
        },
        'ar-SA': {
            desc: 'بنية تحتية شاملة للسفر مصممة لتبسيط وإضفاء الطابع الديمقراطي على المصادر والتوزيع لشركاء الصناعة.',
            company: 'الشركة',
            about: 'من نحن',
            careers: 'وظائف',
            blog: 'مدونة',
            nav: 'تصفح',
            home: 'الرئيسية',
            whyUs: 'لماذا Ark Alliance؟',
            packages: 'باقات الخدمات',
            resources: 'الموارد',
            docs: 'وثائق',
            help: 'مركز المساعدة',
            rights: '2025. جميع الحقوق محفوظة. صنع Ark Alliance بـ ♥ في ماليزيا.',
            cookies: 'سياسة ملفات تعريف الارتباط',
            privacy: 'سياسة الخصوصية',
            legal: 'إشعار قانوني'
        },
        'th-TH': {
            desc: 'โครงสร้างพื้นฐานการท่องเที่ยวที่ครอบคลุมซึ่งออกแบบมาเพื่อลดความซับซ้อนและทำให้การจัดหาและการจัดจำหน่ายเป็นประชาธิปไตยสำหรับพันธมิตรในอุตสาหกรรม',
            company: 'บริษัท',
            about: 'เกี่ยวกับเรา',
            careers: 'ร่วมงานกับเรา',
            blog: 'บล็อก',
            nav: 'การนำทาง',
            home: 'หน้าแรก',
            whyUs: 'ทำไมต้อง Ark Alliance?',
            packages: 'แพ็คเกจบริการ',
            resources: 'ทรัพยากร',
            docs: 'เอกสารประกอบ',
            help: 'ศูนย์ช่วยเหลือ',
            rights: '2025. สงวนลิขสิทธิ์. Ark Alliance สร้างด้วย ♥ ในมาเลเซีย',
            cookies: 'นโยบายคุกกี้',
            privacy: 'นโยบายความเป็นส่วนตัว',
            legal: 'ประกาศทางกฎหมาย'
        },
        'vi-VN': {
            desc: 'Cơ sở hạ tầng du lịch toàn diện được thiết kế để đơn giản hóa và dân chủ hóa việc tìm nguồn cung ứng và phân phối cho các đối tác trong ngành.',
            company: 'Công ty',
            about: 'Về chúng tôi',
            careers: 'Tuyển dụng',
            blog: 'Blog',
            nav: 'Điều hướng',
            home: 'Trang chủ',
            whyUs: 'Tại sao chọn Ark Alliance?',
            packages: 'Gói dịch vụ',
            resources: 'Tài nguyên',
            docs: 'Tài liệu',
            help: 'Trung tâm trợ giúp',
            rights: '2025. Đã đăng ký bản quyền. Ark Alliance được làm bằng ♥ tại Malaysia.',
            cookies: 'Chính sách cookie',
            privacy: 'Chính sách bảo mật',
            legal: 'Thông báo pháp lý'
        },
        'id-ID': {
            desc: 'Infrastruktur perjalanan komprehensif yang dirancang untuk menyederhanakan dan mendemokratisasi sumber dan distribusi bagi mitra industri.',
            company: 'Perusahaan',
            about: 'Tentang Kami',
            careers: 'Karir',
            blog: 'Blog',
            nav: 'Navigasi',
            home: 'Beranda',
            whyUs: 'Mengapa Ark Alliance?',
            packages: 'Paket Layanan',
            resources: 'Sumber Daya',
            docs: 'Dokumentasi',
            help: 'Pusat Bantuan',
            rights: '2025. Hak Cipta Dilindungi. Ark Alliance dibuat dengan ♥ di Malaysia.',
            cookies: 'Kebijakan Cookie',
            privacy: 'Kebijakan Privasi',
            legal: 'Pemberitahuan Hukum'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    return (
        <footer className="bg-slate-600 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Column */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <Image
                                src="/ark-logo-icon.jpg"
                                alt="ArkAlliance Logo"
                                width={40}
                                height={40}
                                className="h-10 w-auto object-contain rounded-md"
                            />
                            <span className="text-2xl font-bold tracking-tight">
                                Ark<span className="text-blue-300">Alliance</span>
                            </span>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed">
                            {content.desc}
                        </p>

                        <div className="text-xs text-slate-300">
                            © 2025 Ark Alliance
                        </div>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="text-sm font-bold mb-2 uppercase tracking-wider text-slate-200">{content.company}</h3>
                        <ul className="space-y-1 text-xs text-slate-100">
                            <li><Link href="/about" className="hover:text-blue-200 transition-colors">{content.about}</Link></li>
                            <li><Link href="/careers" className="hover:text-blue-200 transition-colors">{content.careers}</Link></li>
                            <li><Link href="/blog" className="hover:text-blue-200 transition-colors">{content.blog}</Link></li>
                        </ul>
                    </div>

                    {/* Navigation Column */}
                    <div>
                        <h3 className="text-sm font-bold mb-2 uppercase tracking-wider text-slate-200">{content.nav}</h3>
                        <ul className="space-y-1 text-xs text-slate-100">
                            <li><Link href="/" className="hover:text-blue-200 transition-colors">{content.home}</Link></li>
                            <li><Link href="/why-us" className="hover:text-blue-200 transition-colors">{content.whyUs}</Link></li>
                            <li><Link href="/packages" className="hover:text-blue-200 transition-colors">{content.packages}</Link></li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h3 className="text-sm font-bold mb-2 uppercase tracking-wider text-slate-200">{content.resources}</h3>
                        <ul className="space-y-1 text-xs text-slate-100">
                            <li><Link href="/docs" className="hover:text-blue-200 transition-colors">{content.docs}</Link></li>
                            <li><Link href="/help" className="hover:text-blue-200 transition-colors">{content.help}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-500 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-300">
                    <div>
                        {content.rights.split('♥').map((part, i) => (
                            <span key={i}>
                                {part}
                                {i === 0 && <span className="text-blue-300">♥</span>}
                            </span>
                        ))}
                    </div>
                    <div className="flex space-x-4">
                        <Link href="/cookies" className="hover:text-white transition-colors">{content.cookies}</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">{content.privacy}</Link>
                        <Link href="/legal" className="hover:text-white transition-colors">{content.legal}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
