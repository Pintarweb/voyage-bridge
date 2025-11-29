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
            subtitle: 'Join ArkAlliance and connect with global travel agents.',
            welcome: "Welcome to the future of B2B travel. We're excited to have you on board!"
        },
        'zh-CN': {
            title: '供应商注册',
            subtitle: '加入 ArkAlliance，与全球旅行社建立联系。',
            welcome: '欢迎来到 B2B 旅游的未来。我们很高兴您的加入！'
        },
        'ms-MY': {
            title: 'Pendaftaran Pembekal',
            subtitle: 'Sertai ArkAlliance dan berhubung dengan ejen pelancongan global.',
            welcome: 'Selamat datang ke masa depan pelancongan B2B. Kami teruja untuk mempunyai anda bersama kami!'
        },
        'es-ES': {
            title: 'Registro de Proveedores',
            subtitle: 'Únase a ArkAlliance y conéctese con agentes de viajes globales.',
            welcome: 'Bienvenido al futuro de los viajes B2B. ¡Estamos emocionados de tenerte a bordo!'
        },
        'fr-FR': {
            title: 'Inscription Fournisseur',
            subtitle: 'Rejoignez ArkAlliance et connectez-vous avec des agents de voyages mondiaux.',
            welcome: 'Bienvenue dans le futur du voyage B2B. Nous sommes ravis de vous compter parmi nous !'
        },
        'de-DE': {
            title: 'Lieferantenregistrierung',
            subtitle: 'Treten Sie ArkAlliance bei und vernetzen Sie sich mit globalen Reisebüros.',
            welcome: 'Willkommen in der Zukunft des B2B-Reisens. Wir freuen uns, Sie an Bord zu haben!'
        },
        'ja-JP': {
            title: 'サプライヤー登録',
            subtitle: 'ArkAllianceに参加して、世界の旅行代理店とつながりましょう。',
            welcome: 'B2B旅行の未来へようこそ。ご参加いただきありがとうございます！'
        },
        'ko-KR': {
            title: '공급업체 등록',
            subtitle: 'ArkAlliance에 가입하고 글로벌 여행사와 연결하세요.',
            welcome: 'B2B 여행의 미래에 오신 것을 환영합니다. 함께하게 되어 기쁩니다!'
        },
        'ar-SA': {
            title: 'تسجيل الموردين',
            subtitle: 'انضم إلى ArkAlliance وتواصل مع وكلاء السفر العالميين.',
            welcome: 'مرحبًا بكم في مستقبل السفر B2B. نحن متحمسون لانضمامك إلينا!'
        },
        'th-TH': {
            title: 'การลงทะเบียนซัพพลายเออร์',
            subtitle: 'เข้าร่วม ArkAlliance และเชื่อมต่อกับตัวแทนท่องเที่ยวทั่วโลก',
            welcome: 'ยินดีต้อนรับสู่อนาคตของการท่องเที่ยวแบบ B2B เราตื่นเต้นที่มีคุณร่วมเดินทางไปกับเรา!'
        },
        'vi-VN': {
            title: 'Đăng ký nhà cung cấp',
            subtitle: 'Tham gia ArkAlliance và kết nối với các đại lý du lịch toàn cầu.',
            welcome: 'Chào mừng đến với tương lai của du lịch B2B. Chúng tôi rất vui mừng được đón tiếp bạn!'
        },
        'id-ID': {
            title: 'Pendaftaran Pemasok',
            subtitle: 'Bergabunglah dengan ArkAlliance dan terhubung dengan agen perjalanan global.',
            welcome: 'Selamat datang di masa depan perjalanan B2B. Kami senang Anda bergabung dengan kami!'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    return (
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
                    <p className="mt-6 text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 animate-fade-in-up drop-shadow-sm">
                        {content.welcome}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-orange-400 to-yellow-400 backdrop-blur-sm p-6 rounded-xl border border-orange-300 shadow-2xl">
                    <RegistrationWizard />
                </div>
            </div>
        </div>
    )
}
