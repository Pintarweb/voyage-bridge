'use client'

import { Suspense, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TourismBackground from '@/components/ui/TourismBackground'
import { useLanguage } from '@/context/LanguageContext'
import { useRoleRedirect } from '@/hooks/useRoleRedirect'

function AgentAuthContent() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()
    const { language } = useLanguage()
    const { checkAndRedirect } = useRoleRedirect()

    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    const t = {
        'en-US': {
            title: 'Agent Portal',
            subtitle: 'Access exclusive inventory',
            email: 'Email',
            password: 'Password',
            signIn: 'Sign In',
            loggingIn: 'Logging in...',
            newAgent: 'New Agent?',
            registerHere: 'Register Here'
        },
        'zh-CN': {
            title: '代理商门户',
            subtitle: '访问独家库存',
            email: '电子邮件',
            password: '密码',
            signIn: '登录',
            loggingIn: '登录中...',
            newAgent: '新代理商？',
            registerHere: '在此注册'
        },
        'ms-MY': {
            title: 'Portal Ejen',
            subtitle: 'Akses inventori eksklusif',
            email: 'E-mel',
            password: 'Kata Laluan',
            signIn: 'Log Masuk',
            loggingIn: 'Sedang log masuk...',
            newAgent: 'Ejen Baru?',
            registerHere: 'Daftar Di Sini'
        },
        'es-ES': {
            title: 'Portal de Agentes',
            subtitle: 'Accede al inventario exclusivo',
            email: 'Correo Electrónico',
            password: 'Contraseña',
            signIn: 'Iniciar Sesión',
            loggingIn: 'Iniciando sesión...',
            newAgent: '¿Nuevo Agente?',
            registerHere: 'Regístrate Aquí'
        },
        'fr-FR': {
            title: 'Portail Agent',
            subtitle: 'Accéder à l\'inventaire exclusif',
            email: 'E-mail',
            password: 'Mot de passe',
            signIn: 'Se Connecter',
            loggingIn: 'Connexion en cours...',
            newAgent: 'Nouvel Agent?',
            registerHere: 'S\'inscrire Ici'
        },
        'de-DE': {
            title: 'Agentenportal',
            subtitle: 'Zugang zu exklusivem Inventar',
            email: 'E-Mail',
            password: 'Passwort',
            signIn: 'Anmelden',
            loggingIn: 'Anmelden...',
            newAgent: 'Neuer Agent?',
            registerHere: 'Hier Registrieren'
        },
        'ja-JP': {
            title: 'エージェントポータル',
            subtitle: '限定在庫へのアクセス',
            email: 'メールアドレス',
            password: 'パスワード',
            signIn: 'サインイン',
            loggingIn: 'ログイン中...',
            newAgent: '新規エージェント？',
            registerHere: 'こちらで登録'
        },
        'ko-KR': {
            title: '에이전트 포털',
            subtitle: '독점 인벤토리 액세스',
            email: '이메일',
            password: '비밀번호',
            signIn: '로그인',
            loggingIn: '로그인 중...',
            newAgent: '신규 에이전트?',
            registerHere: '여기서 등록'
        },
        'ar-SA': {
            title: 'بوابة الوكيل',
            subtitle: 'الوصول إلى المخزون الحصري',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            signIn: 'تسجيل الدخول',
            loggingIn: 'جاري تسجيل الدخول...',
            newAgent: 'وكيل جديد؟',
            registerHere: 'سجل هنا'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            })

            if (error) throw error

            // Secure Admin Redirection Check
            const wasRedirected = await checkAndRedirect(data.user.id)
            if (wasRedirected) return

            // Standard Agent Flow
            router.push('/portal')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="flex-grow relative flex items-center justify-center px-4 py-12">
                <TourismBackground />

                <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/20">
                    {/* Header */}
                    <div className="bg-slate-50/80 px-8 py-6 border-b border-slate-100 text-center">
                        <h2 className="text-2xl font-bold text-slate-900">{content.title}</h2>
                        <p className="text-sm text-slate-500 mt-1">{content.subtitle}</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{content.email}</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{content.password}</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary btn-md"
                            >
                                {loading ? content.loggingIn : content.signIn}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-slate-900 font-medium">{content.newAgent} </span>
                            <Link href="/register-agent" className="font-bold text-blue-700 hover:text-blue-800 underline decoration-2 underline-offset-2">
                                {content.registerHere}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function AgentAuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AgentAuthContent />
        </Suspense>
    )
}
