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
            router.push('/supplier/dashboard')
        }, 3000)

        return () => clearTimeout(timer)
    }, [router])

    return (
        <div className="flex-grow relative flex items-center justify-center px-4 py-12">
            <TourismBackground />

            <div className="relative z-10 w-full max-w-md space-y-8 bg-gray-900/90 backdrop-blur-sm p-8 rounded-xl border border-gray-800 shadow-2xl text-center">
                <h1 className="text-3xl font-bold text-teal-500">{content.title}</h1>
                <p className="text-lg text-gray-300">{content.processing}</p>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto my-6"></div>
                <p className="text-sm text-gray-500 mt-4">{content.placeholder}</p>
            </div>
        </div>
    )
}
