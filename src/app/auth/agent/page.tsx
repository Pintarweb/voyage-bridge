'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import PhoneInput, { Country } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import CountrySelect from '@/components/ui/CountrySelect'
import { FaInfoCircle, FaCheckCircle } from 'react-icons/fa'
import './auth.css'
import GlobalHeader from '@/components/layout/GlobalHeader'
import Footer from '@/components/layout/Footer'
import TourismBackground from '@/components/ui/TourismBackground'
import { useLanguage } from '@/context/LanguageContext'

const CITY_TO_COUNTRY: Record<string, string> = {
    // North America
    'new york': 'US', 'los angeles': 'US', 'chicago': 'US', 'houston': 'US', 'miami': 'US', 'san francisco': 'US',
    'toronto': 'CA', 'vancouver': 'CA', 'montreal': 'CA', 'mexico city': 'MX',
    // Europe
    'london': 'GB', 'manchester': 'GB', 'birmingham': 'GB',
    'paris': 'FR', 'lyon': 'FR', 'marseille': 'FR',
    'berlin': 'DE', 'munich': 'DE', 'hamburg': 'DE', 'frankfurt': 'DE',
    'rome': 'IT', 'milan': 'IT', 'naples': 'IT',
    'madrid': 'ES', 'barcelona': 'ES',
    'amsterdam': 'NL', 'rotterdam': 'NL',
    'brussels': 'BE', 'vienna': 'AT', 'zurich': 'CH', 'geneva': 'CH',
    'dublin': 'IE', 'lisbon': 'PT', 'athens': 'GR', 'stockholm': 'SE', 'oslo': 'NO', 'copenhagen': 'DK', 'helsinki': 'FI',
    'warsaw': 'PL', 'prague': 'CZ', 'budapest': 'HU', 'istanbul': 'TR', 'moscow': 'RU',
    // Asia
    'dubai': 'AE', 'abu dhabi': 'AE',
    'singapore': 'SG',
    'tokyo': 'JP', 'osaka': 'JP',
    'seoul': 'KR',
    'beijing': 'CN', 'shanghai': 'CN', 'hong kong': 'HK',
    'mumbai': 'IN', 'delhi': 'IN', 'bangalore': 'IN',
    'bangkok': 'TH', 'jakarta': 'ID', 'kuala lumpur': 'MY', 'manila': 'PH', 'ho chi minh city': 'VN',
    // Oceania
    'sydney': 'AU', 'melbourne': 'AU', 'brisbane': 'AU', 'perth': 'AU',
    'auckland': 'NZ',
    // South America
    'sao paulo': 'BR', 'rio de janeiro': 'BR',
    'buenos aires': 'AR', 'santiago': 'CL', 'bogota': 'CO', 'lima': 'PE',
    // Africa
    'cairo': 'EG', 'johannesburg': 'ZA', 'cape town': 'ZA', 'lagos': 'NG', 'nairobi': 'KE'
}

export default function AgentAuthPage() {
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(
        searchParams.get('tab') === 'register' ? 'register' : 'login'
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()
    const { language } = useLanguage()

    // Login State
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    // Register State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        agency_name: '',
        license_number: '',
        website_url: '',
        city: '',
        country_code: '',
        address: '',
        phone_number: '',
        has_agreed_tc: false
    })

    const t = {
        'en-US': {
            title: 'Agent Portal',
            subtitle: 'Access exclusive inventory',
            login: 'Login',
            register: 'Register',
            email: 'Email',
            password: 'Password',
            loggingIn: 'Logging in...',
            creatingAccount: 'Creating Account...',
            registerAgency: 'Register Agency',
            agencyName: 'Agency Name',
            licenseNumber: 'License Number',
            websiteUrl: 'Website URL',
            address: 'Address',
            city: 'City',
            phoneNumber: 'Phone Number',
            secureNetwork: 'Secure Network.',
            licenseUsage: 'Your license is used for verification purposes only.',
            licenseTooltip: 'Accepted: IATA, MOTAC, or Local Government License',
            agreeTc: 'I agree to the',
            tc: 'Terms & Conditions',
            enterPhone: 'Enter phone number'
        },
        'zh-CN': {
            title: '代理商门户',
            subtitle: '访问独家库存',
            login: '登录',
            register: '注册',
            email: '电子邮件',
            password: '密码',
            loggingIn: '登录中...',
            creatingAccount: '创建账户中...',
            registerAgency: '注册代理机构',
            agencyName: '代理机构名称',
            licenseNumber: '执照号码',
            websiteUrl: '网站链接',
            address: '地址',
            city: '城市',
            phoneNumber: '电话号码',
            secureNetwork: '安全网络。',
            licenseUsage: '您的执照仅用于验证目的。',
            licenseTooltip: '接受：IATA、MOTAC 或当地政府执照',
            agreeTc: '我同意',
            tc: '条款和条件',
            enterPhone: '输入电话号码'
        },
        'ms-MY': {
            title: 'Portal Ejen',
            subtitle: 'Akses inventori eksklusif',
            login: 'Log Masuk',
            register: 'Daftar',
            email: 'Emel',
            password: 'Kata Laluan',
            loggingIn: 'Sedang Log Masuk...',
            creatingAccount: 'Sedang Membuat Akaun...',
            registerAgency: 'Daftar Agensi',
            agencyName: 'Nama Agensi',
            licenseNumber: 'Nombor Lesen',
            websiteUrl: 'URL Laman Web',
            address: 'Alamat',
            city: 'Bandar',
            phoneNumber: 'Nombor Telefon',
            secureNetwork: 'Rangkaian Selamat.',
            licenseUsage: 'Lesen anda digunakan untuk tujuan pengesahan sahaja.',
            licenseTooltip: 'Diterima: IATA, MOTAC, atau Lesen Kerajaan Tempatan',
            agreeTc: 'Saya bersetuju dengan',
            tc: 'Terma & Syarat',
            enterPhone: 'Masukkan nombor telefon'
        },
        'es-ES': {
            title: 'Portal de Agentes',
            subtitle: 'Acceso a inventario exclusivo',
            login: 'Iniciar Sesión',
            register: 'Registrarse',
            email: 'Correo Electrónico',
            password: 'Contraseña',
            loggingIn: 'Iniciando sesión...',
            creatingAccount: 'Creando cuenta...',
            registerAgency: 'Registrar Agencia',
            agencyName: 'Nombre de la Agencia',
            licenseNumber: 'Número de Licencia',
            websiteUrl: 'URL del Sitio Web',
            address: 'Dirección',
            city: 'Ciudad',
            phoneNumber: 'Número de Teléfono',
            secureNetwork: 'Red Segura.',
            licenseUsage: 'Su licencia se utiliza solo con fines de verificación.',
            licenseTooltip: 'Aceptado: IATA, MOTAC o Licencia del Gobierno Local',
            agreeTc: 'Estoy de acuerdo con los',
            tc: 'Términos y Condiciones',
            enterPhone: 'Ingrese número de teléfono'
        },
        'fr-FR': {
            title: 'Portail Agent',
            subtitle: 'Accéder à l\'inventaire exclusif',
            login: 'Connexion',
            register: 'S\'inscrire',
            email: 'E-mail',
            password: 'Mot de passe',
            loggingIn: 'Connexion en cours...',
            creatingAccount: 'Création du compte...',
            registerAgency: 'Enregistrer l\'agence',
            agencyName: 'Nom de l\'agence',
            licenseNumber: 'Numéro de licence',
            websiteUrl: 'URL du site web',
            address: 'Adresse',
            city: 'Ville',
            phoneNumber: 'Numéro de téléphone',
            secureNetwork: 'Réseau sécurisé.',
            licenseUsage: 'Votre licence est utilisée uniquement à des fins de vérification.',
            licenseTooltip: 'Accepté : IATA, MOTAC ou licence gouvernementale locale',
            agreeTc: 'J\'accepte les',
            tc: 'Termes et Conditions',
            enterPhone: 'Entrez le numéro de téléphone'
        },
        'de-DE': {
            title: 'Agentenportal',
            subtitle: 'Zugang zu exklusivem Inventar',
            login: 'Anmelden',
            register: 'Registrieren',
            email: 'E-Mail',
            password: 'Passwort',
            loggingIn: 'Anmelden...',
            creatingAccount: 'Konto wird erstellt...',
            registerAgency: 'Agentur registrieren',
            agencyName: 'Agenturname',
            licenseNumber: 'Lizenznummer',
            websiteUrl: 'Webseiten-URL',
            address: 'Adresse',
            city: 'Stadt',
            phoneNumber: 'Telefonnummer',
            secureNetwork: 'Sicheres Netzwerk.',
            licenseUsage: 'Ihre Lizenz wird nur zu Überprüfungszwecken verwendet.',
            licenseTooltip: 'Akzeptiert: IATA, MOTAC oder lokale Regierungslizenz',
            agreeTc: 'Ich stimme den',
            tc: 'Allgemeinen Geschäftsbedingungen zu',
            enterPhone: 'Telefonnummer eingeben'
        },
        'ja-JP': {
            title: 'エージェントポータル',
            subtitle: '限定在庫へのアクセス',
            login: 'ログイン',
            register: '登録',
            email: 'メールアドレス',
            password: 'パスワード',
            loggingIn: 'ログイン中...',
            creatingAccount: 'アカウント作成中...',
            registerAgency: '代理店登録',
            agencyName: '代理店名',
            licenseNumber: 'ライセンス番号',
            websiteUrl: 'ウェブサイトURL',
            address: '住所',
            city: '都市',
            phoneNumber: '電話番号',
            secureNetwork: '安全なネットワーク。',
            licenseUsage: 'ライセンスは確認目的でのみ使用されます。',
            licenseTooltip: '利用可能：IATA、MOTAC、または地方自治体のライセンス',
            agreeTc: '私は',
            tc: '利用規約に同意します',
            enterPhone: '電話番号を入力'
        },
        'ko-KR': {
            title: '에이전트 포털',
            subtitle: '독점 인벤토리 액세스',
            login: '로그인',
            register: '등록',
            email: '이메일',
            password: '비밀번호',
            loggingIn: '로그인 중...',
            creatingAccount: '계정 생성 중...',
            registerAgency: '에이전시 등록',
            agencyName: '에이전시 이름',
            licenseNumber: '라이센스 번호',
            websiteUrl: '웹사이트 URL',
            address: '주소',
            city: '도시',
            phoneNumber: '전화번호',
            secureNetwork: '보안 네트워크.',
            licenseUsage: '귀하의 라이센스는 확인 목적으로만 사용됩니다.',
            licenseTooltip: '허용됨: IATA, MOTAC 또는 지방 정부 라이센스',
            agreeTc: '나는',
            tc: '이용 약관에 동의합니다',
            enterPhone: '전화번호 입력'
        },
        'ar-SA': {
            title: 'بوابة الوكيل',
            subtitle: 'الوصول إلى المخزون الحصري',
            login: 'تسجيل الدخول',
            register: 'تسجيل',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            loggingIn: 'جاري تسجيل الدخول...',
            creatingAccount: 'جاري إنشاء الحساب...',
            registerAgency: 'تسجيل الوكالة',
            agencyName: 'اسم الوكالة',
            licenseNumber: 'رقم الترخيص',
            websiteUrl: 'رابط الموقع',
            address: 'العنوان',
            city: 'المدينة',
            phoneNumber: 'رقم الهاتف',
            secureNetwork: 'شبكة آمنة.',
            licenseUsage: 'يتم استخدام الترخيص الخاص بك لأغراض التحقق فقط.',
            licenseTooltip: 'مقبول: IATA أو MOTAC أو ترخيص الحكومة المحلية',
            agreeTc: 'أوافق على',
            tc: 'الشروط والأحكام',
            enterPhone: 'أدخل رقم الهاتف'
        },
        'th-TH': {
            title: 'พอร์ทัลตัวแทน',
            subtitle: 'เข้าถึงสินค้าคงคลังพิเศษ',
            login: 'เข้าสู่ระบบ',
            register: 'ลงทะเบียน',
            email: 'อีเมล',
            password: 'รหัสผ่าน',
            loggingIn: 'กำลังเข้าสู่ระบบ...',
            creatingAccount: 'กำลังสร้างบัญชี...',
            registerAgency: 'ลงทะเบียนหน่วยงาน',
            agencyName: 'ชื่อหน่วยงาน',
            licenseNumber: 'หมายเลขใบอนุญาต',
            websiteUrl: 'URL เว็บไซต์',
            address: 'ที่อยู่',
            city: 'เมือง',
            phoneNumber: 'หมายเลขโทรศัพท์',
            secureNetwork: 'เครือข่ายที่ปลอดภัย',
            licenseUsage: 'ใบอนุญาตของคุณใช้เพื่อการตรวจสอบเท่านั้น',
            licenseTooltip: 'ยอมรับ: IATA, MOTAC หรือใบอนุญาตจากรัฐบาลท้องถิ่น',
            agreeTc: 'ฉันยอมรับ',
            tc: 'ข้อกำหนดและเงื่อนไข',
            enterPhone: 'ป้อนหมายเลขโทรศัพท์'
        },
        'vi-VN': {
            title: 'Cổng thông tin đại lý',
            subtitle: 'Truy cập kho hàng độc quyền',
            login: 'Đăng nhập',
            register: 'Đăng ký',
            email: 'Email',
            password: 'Mật khẩu',
            loggingIn: 'Đang đăng nhập...',
            creatingAccount: 'Đang tạo tài khoản...',
            registerAgency: 'Đăng ký đại lý',
            agencyName: 'Tên đại lý',
            licenseNumber: 'Số giấy phép',
            websiteUrl: 'URL trang web',
            address: 'Địa chỉ',
            city: 'Thành phố',
            phoneNumber: 'Số điện thoại',
            secureNetwork: 'Mạng an toàn.',
            licenseUsage: 'Giấy phép của bạn chỉ được sử dụng cho mục đích xác minh.',
            licenseTooltip: 'Chấp nhận: IATA, MOTAC hoặc Giấy phép chính quyền địa phương',
            agreeTc: 'Tôi đồng ý với',
            tc: 'Điều khoản & Điều kiện',
            enterPhone: 'Nhập số điện thoại'
        },
        'id-ID': {
            title: 'Portal Agen',
            subtitle: 'Akses inventaris eksklusif',
            login: 'Masuk',
            register: 'Daftar',
            email: 'Email',
            password: 'Kata Sandi',
            loggingIn: 'Sedang Masuk...',
            creatingAccount: 'Sedang Membuat Akun...',
            registerAgency: 'Daftar Agensi',
            agencyName: 'Nama Agensi',
            licenseNumber: 'Nomor Lisensi',
            websiteUrl: 'URL Situs Web',
            address: 'Alamat',
            city: 'Kota',
            phoneNumber: 'Nomor Telepon',
            secureNetwork: 'Jaringan Aman.',
            licenseUsage: 'Lisensi Anda hanya digunakan untuk tujuan verifikasi.',
            licenseTooltip: 'Diterima: IATA, MOTAC, atau Lisensi Pemerintah Daerah',
            agreeTc: 'Saya setuju dengan',
            tc: 'Syarat & Ketentuan',
            enterPhone: 'Masukkan nomor telepon'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    // Auto-suggest country & Prefetch Portal
    useEffect(() => {
        router.prefetch('/portal')

        if (formData.city) {
            const cityLower = formData.city.toLowerCase().trim()
            const suggestedCountry = CITY_TO_COUNTRY[cityLower]
            if (suggestedCountry && formData.country_code !== suggestedCountry) {
                setFormData(prev => ({ ...prev, country_code: suggestedCountry }))
            }
        }
    }, [formData.city, formData.country_code, router])

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setFormData({ ...formData, [e.target.name]: value })
    }

    const handleCountryChange = (value: string) => {
        setFormData(prev => ({ ...prev, country_code: value }))
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword
            })
            if (error) throw error
            router.push('/portal')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.has_agreed_tc) {
            setError('You must agree to the Terms & Conditions.')
            return
        }
        setLoading(true)
        setError('')

        try {
            // 1. Sign Up
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: { role: 'agent' }
                }
            })

            if (authError) throw authError
            if (!authData.user) throw new Error('Registration failed')

            // 2. Create Profile
            const { error: profileError } = await supabase
                .from('agent_profiles')
                .insert({
                    id: authData.user.id,
                    agency_name: formData.agency_name,
                    license_number: formData.license_number,
                    website_url: formData.website_url,
                    city: formData.city,
                    country_code: formData.country_code,
                    address: formData.address,
                    phone_number: formData.phone_number,
                    verification_status: 'pending',
                    has_agreed_tc: formData.has_agreed_tc,
                    email: formData.email
                })

            if (profileError) throw profileError

            router.push('/approval-pending')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex flex-col">
            <GlobalHeader type="public" />
            <div className="flex-grow relative flex items-center justify-center px-4 py-12">
                <TourismBackground />

                <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/20">
                    {/* Header */}
                    <div className="bg-slate-50/80 px-8 py-6 border-b border-slate-100 text-center">
                        <h2 className="text-2xl font-bold text-slate-900">{content.title}</h2>
                        <p className="text-sm text-slate-500 mt-1">{content.subtitle}</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-200">
                        <button
                            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => {
                                setActiveTab('login')
                                setError('')
                            }}
                        >
                            {content.login}
                        </button>
                        <button
                            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'register' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => {
                                setActiveTab('register')
                                setError('')
                            }}
                        >
                            {content.register}
                        </button>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {activeTab === 'login' ? (
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
                                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {loading ? content.loggingIn : content.login}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-4">
                                {/* Trust Statement */}
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start space-x-3 mb-4">
                                    <FaCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-blue-800">
                                        <strong>{content.secureNetwork}</strong> {content.licenseUsage}
                                    </p>
                                </div>

                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder={content.email}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                    onChange={handleRegisterChange}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder={content.password}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                    onChange={handleRegisterChange}
                                />
                                <input
                                    type="text"
                                    name="agency_name"
                                    required
                                    placeholder={content.agencyName}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                    onChange={handleRegisterChange}
                                />

                                {/* License with Tooltip */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="license_number"
                                        required
                                        placeholder={content.licenseNumber}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 pr-10"
                                        onChange={handleRegisterChange}
                                    />
                                    <div className="absolute right-3 top-2.5 text-slate-400 cursor-help tooltip-container">
                                        <FaInfoCircle />
                                        <span className="tooltip-text">{content.licenseTooltip}</span>
                                    </div>
                                </div>

                                <input
                                    type="url"
                                    name="website_url"
                                    placeholder={content.websiteUrl}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                    onChange={handleRegisterChange}
                                />

                                <input
                                    type="text"
                                    name="address"
                                    required
                                    placeholder={content.address}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                    onChange={handleRegisterChange}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        placeholder={content.city}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                        onChange={handleRegisterChange}
                                    />
                                    <CountrySelect
                                        value={formData.country_code}
                                        onChange={handleCountryChange}
                                        className="text-slate-900"
                                        theme="light"
                                    />
                                </div>

                                <div className="border border-slate-300 rounded-lg px-3 py-2">
                                    <PhoneInput
                                        key={formData.country_code}
                                        placeholder={content.enterPhone}
                                        value={formData.phone_number}
                                        onChange={(value) => setFormData({ ...formData, phone_number: value as string })}
                                        defaultCountry={formData.country_code as Country}
                                        className="bg-transparent phone-input-light"
                                    />
                                </div>

                                {/* T&C Checkbox */}
                                <div className="flex items-center mt-4">
                                    <input
                                        id="tc-agree"
                                        name="has_agreed_tc"
                                        type="checkbox"
                                        required
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                        onChange={handleRegisterChange}
                                    />
                                    <label htmlFor="tc-agree" className="ml-2 block text-sm text-slate-700">
                                        {content.agreeTc} <a href="#" className="text-blue-600 hover:underline">{content.tc}</a>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 mt-4"
                                >
                                    {loading ? content.creatingAccount : content.registerAgency}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
