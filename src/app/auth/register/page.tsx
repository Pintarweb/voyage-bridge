'use client'

import RegistrationWizard from '@/components/auth/registration-wizard/RegistrationWizard'
import ExitIntentModal from '@/components/feedback/ExitIntentModal'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

function RegisterPageContent() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { language } = useLanguage()
    const searchParams = useSearchParams()
    const email = searchParams.get('email') || ''

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
        <div className="flex-grow relative flex items-center justify-center px-4 py-12 min-h-screen bg-slate-950 overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                {/* Main Visual: Business/Luxury Travel Theme */}
                <div className="absolute inset-0 bg-slate-950/60 z-10 mix-blend-multiply" /> {/* Dark Cinematic Tint */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-transparent to-slate-950/80 z-20" /> {/* Lighting Gradient */}

                {/* Amber Light Leak (Left) */}
                <div className="absolute top-0 left-[-10%] w-[50%] h-full bg-amber-600/10 blur-[150px] z-20 pointer-events-none" />

                <img
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                    alt="Global Business Travel"
                    className="w-full h-full object-cover opacity-60"
                />
            </div>

            <div className="relative z-10 w-full max-w-4xl space-y-8">
                <div className="text-center mb-8">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-white drop-shadow-md">
                        {content.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">
                        {content.subtitle}
                    </p>
                    <p className="mt-6 text-xl md:text-2xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] animate-fade-in-up">
                        Welcome to the future of <span className="text-amber-400">B2B travel</span>. We're excited to have you on <span className="text-amber-400">board</span>!
                    </p>
                </div>

                <div className="bg-slate-950/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(245,158,11,0.1)] ring-1 ring-white/5 relative">
                    {/* 1px Silver-Gold Border Effect */}
                    <div className="absolute inset-0 border border-amber-500/10 rounded-3xl pointer-events-none" />

                    <RegistrationWizard initialEmail={email} onSubmissionStart={() => {
                        console.log('Disabling Exit Intent due to submission')
                        setIsSubmitting(true)
                    }} />
                </div>
            </div>
            {/* Hard remove the modal when submitting */}
            {!isSubmitting && <ExitIntentModal />}
        </div>
    )
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterPageContent />
        </Suspense>
    )
}
