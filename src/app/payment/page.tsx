'use client'


import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import TourismBackground from '@/components/ui/TourismBackground'
import { useLanguage } from '@/context/LanguageContext'

export default function PaymentPage() {
    const router = useRouter()
    const { language } = useLanguage()

    const t = {
        'en-US': {
            title: 'Payment Gateway',
            processing: 'Processing your subscription...',
            placeholder: '(This is a placeholder. Redirecting to dashboard in 3s)'
        },
        'zh-CN': {
            title: '支付网关',
            processing: '正在处理您的订阅...',
            placeholder: '（这是一个占位符。3秒后重定向到仪表板）'
        },
        'ms-MY': {
            title: 'Gerbang Pembayaran',
            processing: 'Memproses langganan anda...',
            placeholder: '(Ini adalah ruang letak. Mengalihkan ke papan pemuka dalam 3s)'
        },
        'es-ES': {
            title: 'Pasarela de Pago',
            processing: 'Procesando su suscripción...',
            placeholder: '(Esto es un marcador de posición. Redirigiendo al panel en 3s)'
        },
        'fr-FR': {
            title: 'Passerelle de paiement',
            processing: 'Traitement de votre abonnement...',
            placeholder: '(Ceci est un espace réservé. Redirection vers le tableau de bord dans 3s)'
        },
        'de-DE': {
            title: 'Zahlungs-Gateway',
            processing: 'Ihre Anmeldung wird bearbeitet...',
            placeholder: '(Dies ist ein Platzhalter. Weiterleitung zum Dashboard in 3s)'
        },
        'ja-JP': {
            title: '支払いゲートウェイ',
            processing: 'サブスクリプションを処理しています...',
            placeholder: '（これはプレースホルダーです。3秒後にダッシュボードにリダイレクトします）'
        },
        'ko-KR': {
            title: '결제 게이트웨이',
            processing: '구독 처리 중...',
            placeholder: '(이것은 자리 표시자입니다. 3초 후 대시보드로 리디렉션됩니다)'
        },
        'ar-SA': {
            title: 'بوابة الدفع',
            processing: 'جاري معالجة اشتراكك...',
            placeholder: '(هذا عنصر نائب. إعادة التوجيه إلى لوحة التحكم خلال 3 ثوانٍ)'
        },
        'th-TH': {
            title: 'เกตเวย์การชำระเงิน',
            processing: 'กำลังดำเนินการสมัครสมาชิกของคุณ...',
            placeholder: '(นี่คือตัวยึดตำแหน่ง กำลังเปลี่ยนเส้นทางไปยังแดชบอร์ดใน 3 วินาที)'
        },
        'vi-VN': {
            title: 'Cổng thanh toán',
            processing: 'Đang xử lý đăng ký của bạn...',
            placeholder: '(Đây là trình giữ chỗ. Chuyển hướng đến bảng điều khiển trong 3 giây)'
        },
        'id-ID': {
            title: 'Gerbang Pembayaran',
            processing: 'Memproses langganan Anda...',
            placeholder: '(Ini adalah placeholder. Mengalihkan ke dasbor dalam 3 detik)'
        }
    }

    const getContent = (lang: string) => {
        const mapping = t[lang as keyof typeof t]
        return mapping || t['en-US']
    }

    const content = getContent(language)

    useEffect(() => {
        // Simulate payment processing
        const timer = setTimeout(() => {
            router.push('/approval-pending')
        }, 3000)

        return () => clearTimeout(timer)
    }, [router])

    return (
        <div className="flex-grow relative flex items-center justify-center px-4 py-12">
            <TourismBackground />

            <div className="relative z-10 w-full max-w-md space-y-8 bg-gradient-to-br from-orange-400 to-yellow-400 backdrop-blur-sm p-8 rounded-xl border border-orange-300 shadow-2xl text-center">
                <h1 className="text-3xl font-bold text-white drop-shadow-md">{content.title}</h1>
                <p className="text-lg text-white/90 font-medium">{content.processing}</p>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto my-6 shadow-sm"></div>
                <p className="text-sm text-white/80 mt-4 font-medium">{content.placeholder}</p>
            </div>
        </div>
    )
}
