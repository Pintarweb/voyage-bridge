'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import TourismBackground from '@/components/ui/TourismBackground'
import { useLanguage } from '@/context/LanguageContext'

export default function SupplierAuthPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()
    const { language } = useLanguage()

    const t = {
        'en-US': {
            title: 'Supplier Portal',
            subtitle: 'Manage your products and inventory',
            email: 'Email',
            password: 'Password',
            signIn: 'Sign In',
            loggingIn: 'Logging in...',
            newSupplier: 'New Supplier?',
            apply: 'Apply for Partnership'
        },
        'zh-CN': {
            title: '供应商门户',
            subtitle: '管理您的产品和库存',
            email: '电子邮件',
            password: '密码',
            signIn: '登录',
            loggingIn: '登录中...',
            newSupplier: '新供应商？',
            apply: '申请合作'
        },
        'ms-MY': {
            title: 'Portal Pembekal',
            subtitle: 'Urus produk dan inventori anda',
            email: 'Emel',
            password: 'Kata Laluan',
            signIn: 'Log Masuk',
            loggingIn: 'Sedang Log Masuk...',
            newSupplier: 'Pembekal Baru?',
            apply: 'Mohon Perkongsian'
        },
        'es-ES': {
            title: 'Portal de Proveedores',
            subtitle: 'Gestione sus productos e inventario',
            email: 'Correo Electrónico',
            password: 'Contraseña',
            signIn: 'Iniciar Sesión',
            loggingIn: 'Iniciando sesión...',
            newSupplier: '¿Nuevo Proveedor?',
            apply: 'Solicitar Asociación'
        },
        'fr-FR': {
            title: 'Portail Fournisseur',
            subtitle: 'Gérez vos produits et votre inventaire',
            email: 'E-mail',
            password: 'Mot de passe',
            signIn: 'Connexion',
            loggingIn: 'Connexion en cours...',
            newSupplier: 'Nouveau fournisseur ?',
            apply: 'Demander un partenariat'
        },
        'de-DE': {
            title: 'Lieferantenportal',
            subtitle: 'Verwalten Sie Ihre Produkte und Ihr Inventar',
            email: 'E-Mail',
            password: 'Passwort',
            signIn: 'Anmelden',
            loggingIn: 'Anmelden...',
            newSupplier: 'Neuer Lieferant?',
            apply: 'Partnerschaft beantragen'
        },
        'ja-JP': {
            title: 'サプライヤーポータル',
            subtitle: '製品と在庫の管理',
            email: 'メールアドレス',
            password: 'パスワード',
            signIn: 'サインイン',
            loggingIn: 'ログイン中...',
            newSupplier: '新規サプライヤーですか？',
            apply: 'パートナーシップを申請'
        },
        'ko-KR': {
            title: '공급업체 포털',
            subtitle: '제품 및 재고 관리',
            email: '이메일',
            password: '비밀번호',
            signIn: '로그인',
            loggingIn: '로그인 중...',
            newSupplier: '새 공급업체입니까?',
            apply: '파트너십 신청'
        },
        'ar-SA': {
            title: 'بوابة الموردين',
            subtitle: 'إدارة منتجاتك ومخزونك',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            signIn: 'تسجيل الدخول',
            loggingIn: 'جاري تسجيل الدخول...',
            newSupplier: 'مورد جديد؟',
            apply: 'التقدم بطلب للشراكة'
        },
        'th-TH': {
            title: 'พอร์ทัลซัพพลายเออร์',
            subtitle: 'จัดการผลิตภัณฑ์และสินค้าคงคลังของคุณ',
            email: 'อีเมล',
            password: 'รหัสผ่าน',
            signIn: 'ลงชื่อเข้าใช้',
            loggingIn: 'กำลังเข้าสู่ระบบ...',
            newSupplier: 'ซัพพลายเออร์รายใหม่?',
            apply: 'สมัครเป็นพันธมิตร'
        },
        'vi-VN': {
            title: 'Cổng thông tin nhà cung cấp',
            subtitle: 'Quản lý sản phẩm và kho hàng của bạn',
            email: 'Email',
            password: 'Mật khẩu',
            signIn: 'Đăng nhập',
            loggingIn: 'Đang đăng nhập...',
            newSupplier: 'Nhà cung cấp mới?',
            apply: 'Đăng ký đối tác'
        },
        'id-ID': {
            title: 'Portal Pemasok',
            subtitle: 'Kelola produk dan inventaris Anda',
            email: 'Email',
            password: 'Kata Sandi',
            signIn: 'Masuk',
            loggingIn: 'Sedang Masuk...',
            newSupplier: 'Pemasok Baru?',
            apply: 'Ajukan Kemitraan'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (authError) throw authError

            // Check if user is a registered supplier
            const { data: supplier, error: supplierError } = await supabase
                .from('suppliers')
                .select('id')
                .eq('id', authData.user.id)
                .single()

            if (supplierError || !supplier) {
                // Not a registered supplier
                await supabase.auth.signOut()
                alert('You are not a registered supplier. Please register first.')
                router.push('/')
                return
            }

            router.push('/supplier/dashboard')
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

                <div className="relative z-10 max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
                            {content.title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            {content.subtitle}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-400 to-yellow-400 backdrop-blur-sm p-8 rounded-xl border border-orange-300 shadow-2xl">
                        {error && (
                            <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-1">{content.email}</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 bg-white/90 border border-white/50 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900 placeholder-slate-500"
                                    placeholder="supplier@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-1">{content.password}</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-3 py-2 bg-white/90 border border-white/50 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900 placeholder-slate-500"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Link
                                    href="/auth/forgot-password?type=supplier"
                                    className="text-sm font-medium text-slate-900 hover:text-slate-700 hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold py-3 px-4 rounded-lg transition-colors shadow-lg"
                            >
                                {loading ? content.loggingIn : content.signIn}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-slate-900 font-medium">{content.newSupplier} </span>
                            <Link href="/auth/register" className="font-bold text-blue-700 hover:text-blue-800 underline decoration-2 underline-offset-2">
                                {content.apply}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
