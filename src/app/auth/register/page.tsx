'use client'

import RegistrationWizard from '@/components/auth/registration-wizard/RegistrationWizard'
import GlobalHeader from '@/components/layout/GlobalHeader'
import Footer from '@/components/layout/Footer'
import TourismBackground from '@/components/ui/TourismBackground'
import { useLanguage } from '@/context/LanguageContext'

export default function RegisterPage() {
    const { language } = useLanguage()

    const t = {
        'en-US': {
            title: 'Supplier Registration',
            subtitle: 'Join ArkAlliance and connect with global travel agents.'
        },
        'zh-CN': {
            title: '供应商注册',
            subtitle: '加入 ArkAlliance，与全球旅行社建立联系。'
        },
        'ms-MY': {
            title: 'Pendaftaran Pembekal',
            subtitle: 'Sertai ArkAlliance dan berhubung dengan ejen pelancongan global.'
        },
        'es-ES': {
            title: 'Registro de Proveedores',
            subtitle: 'Únase a ArkAlliance y conéctese con agentes de viajes globales.'
        },
        'fr-FR': {
            title: 'Inscription Fournisseur',
            subtitle: 'Rejoignez ArkAlliance et connectez-vous avec des agents de voyages mondiaux.'
        },
        'de-DE': {
            title: 'Lieferantenregistrierung',
            subtitle: 'Treten Sie ArkAlliance bei und vernetzen Sie sich mit globalen Reisebüros.'
        },
        'ja-JP': {
            title: 'サプライヤー登録',
            subtitle: 'ArkAllianceに参加して、世界の旅行代理店とつながりましょう。'
        },
        'ko-KR': {
            title: '공급업체 등록',
            subtitle: 'ArkAlliance에 가입하고 글로벌 여행사와 연결하세요.'
        },
        'ar-SA': {
            title: 'تسجيل الموردين',
            subtitle: 'انضم إلى ArkAlliance وتواصل مع وكلاء السفر العالميين.'
        },
        'th-TH': {
            title: 'การลงทะเบียนซัพพลายเออร์',
            subtitle: 'เข้าร่วม ArkAlliance และเชื่อมต่อกับตัวแทนท่องเที่ยวทั่วโลก'
        },
        'vi-VN': {
            title: 'Đăng ký nhà cung cấp',
            subtitle: 'Tham gia ArkAlliance và kết nối với các đại lý du lịch toàn cầu.'
        },
        'id-ID': {
            title: 'Pendaftaran Pemasok',
            subtitle: 'Bergabunglah dengan ArkAlliance dan terhubung dengan agen perjalanan global.'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    return (
        <main className="min-h-screen flex flex-col">
            <GlobalHeader type="public" />
            <div className="flex-grow relative flex items-center justify-center px-4 py-12">
                <TourismBackground />

                <div className="relative z-10 w-full max-w-4xl space-y-8">
                    <div className="text-center mb-8">
                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
                            {content.title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            {content.subtitle}
                        </p>
                    </div>

                    <div className="bg-gray-900/90 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-2xl">
                        <RegistrationWizard />
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
