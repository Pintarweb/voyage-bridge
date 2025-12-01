import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useWizard } from './WizardContext'
import { FaFacebook, FaInstagram, FaTiktok, FaLinkedin, FaTripadvisor, FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'

export default function Step4Review() {
    const { formData, setStep } = useWizard()
    const { language } = useLanguage()
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const t = {
        'en-US': {
            title: 'Review & Submit',
            identity: 'Identity & Location',
            legal: 'Legal & Verification',
            profile: 'Business Profile',
            edit: 'Edit',
            labels: {
                company: 'Company:',
                country: 'Country:',
                email: 'Email:',
                currency: 'Currency:',
                regNo: 'Reg No:',

                phone: 'Phone:',
                type: 'Type:',
                website: 'Website:'
            },
            previous: 'Previous',
            submit: 'Submit & Pay',
            submitting: 'Submitting...',
            errors: {
                failed: 'Registration failed',
                unexpected: 'An unexpected error occurred'
            }
        },
        'zh-CN': {
            title: '审查与提交',
            identity: '身份与位置',
            legal: '法律与验证',
            profile: '业务资料',
            edit: '编辑',
            labels: {
                company: '公司：',
                country: '国家：',
                email: '电子邮件：',
                currency: '货币：',
                regNo: '注册号：',

                phone: '电话：',
                type: '类型：',
                website: '网站：'
            },
            previous: '上一步',
            submit: '提交并付款',
            submitting: '提交中...',
            errors: {
                failed: '注册失败',
                unexpected: '发生意外错误'
            }
        },
        'ms-MY': {
            title: 'Semak & Hantar',
            identity: 'Identiti & Lokasi',
            legal: 'Undang-undang & Pengesahan',
            profile: 'Profil Perniagaan',
            edit: 'Edit',
            labels: {
                company: 'Syarikat:',
                country: 'Negara:',
                email: 'Emel:',
                currency: 'Mata Wang:',
                regNo: 'No Pendaftaran:',

                phone: 'Telefon:',
                type: 'Jenis:',
                website: 'Laman Web:'
            },
            previous: 'Sebelumnya',
            submit: 'Hantar & Bayar',
            submitting: 'Sedang menghantar...',
            errors: {
                failed: 'Pendaftaran gagal',
                unexpected: 'Ralat tidak dijangka berlaku'
            }
        },
        'es-ES': {
            title: 'Revisar y Enviar',
            identity: 'Identidad y Ubicación',
            legal: 'Legal y Verificación',
            profile: 'Perfil de Negocio',
            edit: 'Editar',
            labels: {
                company: 'Empresa:',
                country: 'País:',
                email: 'Correo:',
                currency: 'Moneda:',
                regNo: 'Nº Reg:',

                phone: 'Teléfono:',
                type: 'Tipo:',
                website: 'Sitio Web:'
            },
            previous: 'Anterior',
            submit: 'Enviar y Pagar',
            submitting: 'Enviando...',
            errors: {
                failed: 'Registro fallido',
                unexpected: 'Ocurrió un error inesperado'
            }
        },
        'fr-FR': {
            title: 'Réviser et soumettre',
            identity: 'Identité et localisation',
            legal: 'Légal et vérification',
            profile: 'Profil d\'entreprise',
            edit: 'Modifier',
            labels: {
                company: 'Entreprise :',
                country: 'Pays :',
                email: 'Email :',
                currency: 'Devise :',
                regNo: 'N° d\'enregistrement :',
                phone: 'Téléphone :',
                type: 'Type :',
                website: 'Site web :'
            },
            previous: 'Précédent',
            submit: 'Soumettre et payer',
            submitting: 'Soumission...',
            errors: {
                failed: 'L\'inscription a échoué',
                unexpected: 'Une erreur inattendue s\'est produite'
            }
        },
        'de-DE': {
            title: 'Überprüfen & Absenden',
            identity: 'Identität & Standort',
            legal: 'Rechtliches & Verifizierung',
            profile: 'Unternehmensprofil',
            edit: 'Bearbeiten',
            labels: {
                company: 'Firma:',
                country: 'Land:',
                email: 'E-Mail:',
                currency: 'Währung:',
                regNo: 'Reg.-Nr.:',
                phone: 'Telefon:',
                type: 'Typ:',
                website: 'Webseite:'
            },
            previous: 'Zurück',
            submit: 'Absenden & Bezahlen',
            submitting: 'Wird gesendet...',
            errors: {
                failed: 'Registrierung fehlgeschlagen',
                unexpected: 'Ein unerwarteter Fehler ist aufgetreten'
            }
        },
        'ja-JP': {
            title: '確認して送信',
            identity: '身元と場所',
            legal: '法務と確認',
            profile: 'ビジネスプロフィール',
            edit: '編集',
            labels: {
                company: '会社名:',
                country: '国:',
                email: 'メール:',
                currency: '通貨:',
                regNo: '登録番号:',
                phone: '電話:',
                type: 'タイプ:',
                website: 'ウェブサイト:'
            },
            previous: '戻る',
            submit: '送信して支払う',
            submitting: '送信中...',
            errors: {
                failed: '登録に失敗しました',
                unexpected: '予期しないエラーが発生しました'
            }
        },
        'ko-KR': {
            title: '검토 및 제출',
            identity: '신원 및 위치',
            legal: '법률 및 확인',
            profile: '비즈니스 프로필',
            edit: '편집',
            labels: {
                company: '회사:',
                country: '국가:',
                email: '이메일:',
                currency: '통화:',
                regNo: '등록 번호:',
                phone: '전화:',
                type: '유형:',
                website: '웹사이트:'
            },
            previous: '이전',
            submit: '제출 및 결제',
            submitting: '제출 중...',
            errors: {
                failed: '등록 실패',
                unexpected: '예기치 않은 오류가 발생했습니다'
            }
        },
        'ar-SA': {
            title: 'المراجعة والإرسال',
            identity: 'الهوية والموقع',
            legal: 'القانوني والتحقق',
            profile: 'ملف الشركة',
            edit: 'تعديل',
            labels: {
                company: 'الشركة:',
                country: 'البلد:',
                email: 'البريد الإلكتروني:',
                currency: 'العملة:',
                regNo: 'رقم التسجيل:',
                phone: 'الهاتف:',
                type: 'النوع:',
                website: 'الموقع الإلكتروني:'
            },
            previous: 'سابق',
            submit: 'إرسال ودفع',
            submitting: 'جاري الإرسال...',
            errors: {
                failed: 'فشل التسجيل',
                unexpected: 'حدث خطأ غير متوقع'
            }
        },
        'th-TH': {
            title: 'ตรวจสอบและส่ง',
            identity: 'ตัวตนและที่ตั้ง',
            legal: 'กฎหมายและการตรวจสอบ',
            profile: 'โปรไฟล์ธุรกิจ',
            edit: 'แก้ไข',
            labels: {
                company: 'บริษัท:',
                country: 'ประเทศ:',
                email: 'อีเมล:',
                currency: 'สกุลเงิน:',
                regNo: 'เลขทะเบียน:',
                phone: 'โทรศัพท์:',
                type: 'ประเภท:',
                website: 'เว็บไซต์:'
            },
            previous: 'ก่อนหน้า',
            submit: 'ส่งและชำระเงิน',
            submitting: 'กำลังส่ง...',
            errors: {
                failed: 'การลงทะเบียนล้มเหลว',
                unexpected: 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
            }
        },
        'vi-VN': {
            title: 'Xem lại & Gửi',
            identity: 'Danh tính & Vị trí',
            legal: 'Pháp lý & Xác minh',
            profile: 'Hồ sơ doanh nghiệp',
            edit: 'Chỉnh sửa',
            labels: {
                company: 'Công ty:',
                country: 'Quốc gia:',
                email: 'Email:',
                currency: 'Tiền tệ:',
                regNo: 'Số đăng ký:',
                phone: 'Điện thoại:',
                type: 'Loại:',
                website: 'Trang web:'
            },
            previous: 'Trước',
            submit: 'Gửi & Thanh toán',
            submitting: 'Đang gửi...',
            errors: {
                failed: 'Đăng ký thất bại',
                unexpected: 'Đã xảy ra lỗi không mong muốn'
            }
        },
        'id-ID': {
            title: 'Tinjau & Kirim',
            identity: 'Identitas & Lokasi',
            legal: 'Hukum & Verifikasi',
            profile: 'Profil Bisnis',
            edit: 'Edit',
            labels: {
                company: 'Perusahaan:',
                country: 'Negara:',
                email: 'Email:',
                currency: 'Mata Uang:',
                regNo: 'No Reg:',
                phone: 'Telepon:',
                type: 'Tipe:',
                website: 'Situs Web:'
            },
            previous: 'Sebelumnya',
            submit: 'Kirim & Bayar',
            submitting: 'Sedang mengirim...',
            errors: {
                failed: 'Pendaftaran gagal',
                unexpected: 'Terjadi kesalahan yang tidak terduga'
            }
        }
    }

    const getContent = (lang: string) => {
        const mapping = t[lang as keyof typeof t]
        return mapping || t['en-US']
    }

    const content = getContent(language)

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)

        try {
            // 1. Sign Up User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        role: 'supplier',
                        company_name: formData.company_name,
                        country_code: formData.country_code,
                        base_currency: formData.base_currency,
                    },
                },
            })

            if (authError) throw authError
            if (!authData.user) throw new Error(content.errors.failed)

            // 2. Insert Full Profile Data
            const { error: dbError } = await supabase
                .from('suppliers')
                .upsert({
                    id: authData.user.id,
                    company_name: formData.company_name,
                    trading_name: formData.trading_name,
                    country_code: formData.country_code,
                    address_line_1: formData.address_line_1,
                    city: formData.city,
                    postcode: formData.postcode,
                    timezone: formData.timezone,
                    base_currency: formData.base_currency,

                    company_reg_no: formData.company_reg_no,
                    license_no: formData.license_no,
                    tax_id: formData.tax_id,

                    phone_number: formData.phone_number,

                    supplier_type: formData.supplier_type,
                    description: formData.description,
                    website_url: formData.website_url,

                    // New Social Fields
                    social_instagram: formData.social_instagram,
                    social_facebook: formData.social_facebook,
                    social_tiktok: formData.social_tiktok,
                    social_linkedin: formData.social_linkedin,
                    social_tripadvisor: formData.social_tripadvisor,
                    whatsapp_business_url: formData.whatsapp_business_url,

                    languages_spoken: formData.languages_spoken,
                    logo_url: formData.logo_url,
                    cover_image_url: formData.cover_image_url,

                    subscription_status: 'pending_payment',
                })

            if (dbError) throw dbError

            // 3. Redirect to Payment
            router.push('/payment')

        } catch (err: any) {
            console.error('Registration error:', err)
            let errorMessage = content.errors.unexpected
            if (typeof err === 'string') {
                errorMessage = err
            } else if (err instanceof Error) {
                errorMessage = err.message
            } else if (err && typeof err === 'object' && 'message' in err) {
                errorMessage = String(err.message)
            }
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">{content.title}</h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-6 text-sm text-gray-300">
                {/* Identity Section */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-lg border border-orange-400/50 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-white text-lg">{content.identity}</h3>
                        <button onClick={() => setStep(1)} className="text-xs font-bold text-white/80 hover:text-white underline">{content.edit}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 font-bold text-white">
                        <p><span className="text-white/80">{content.labels.company}</span> {formData.company_name}</p>
                        <p><span className="text-white/80">{content.labels.country}</span> {formData.country_code}</p>
                        <p><span className="text-white/80">{content.labels.email}</span> {formData.email}</p>
                        <p><span className="text-white/80">{content.labels.currency}</span> {formData.base_currency}</p>
                    </div>
                </div>

                {/* Legal Section */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-lg border border-orange-400/50 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-white text-lg">{content.legal}</h3>
                        <button onClick={() => setStep(2)} className="text-xs font-bold text-white/80 hover:text-white underline">{content.edit}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 font-bold text-white">
                        <p><span className="text-white/80">{content.labels.regNo}</span> {formData.company_reg_no}</p>

                        <p><span className="text-white/80">{content.labels.phone}</span> {formData.phone_number}</p>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-lg border border-orange-400/50 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-white text-lg">{content.profile}</h3>
                        <button onClick={() => setStep(3)} className="text-xs font-bold text-white/80 hover:text-white underline">{content.edit}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2 font-bold text-white">
                        <p><span className="text-white/80">{content.labels.type}</span> {formData.supplier_type}</p>
                        <p><span className="text-white/80">{content.labels.website}</span> {formData.website_url}</p>
                    </div>

                    {/* Social Icons Display */}
                    <div className="flex space-x-3 mt-2">
                        {formData.social_facebook && <FaFacebook className="text-white hover:text-blue-200" title="Facebook" />}
                        {formData.social_instagram && <FaInstagram className="text-white hover:text-pink-200" title="Instagram" />}
                        {formData.social_tiktok && <FaTiktok className="text-white hover:text-gray-200" title="TikTok" />}
                        {formData.social_linkedin && <FaLinkedin className="text-white hover:text-blue-200" title="LinkedIn" />}
                        {formData.social_tripadvisor && <FaTripadvisor className="text-white hover:text-green-200" title="TripAdvisor" />}
                        {formData.whatsapp_business_url && <FaWhatsapp className="text-white hover:text-green-200" title="WhatsApp" />}
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="rounded-lg bg-gradient-to-r from-blue-900 to-blue-500 hover:from-blue-800 hover:to-blue-400 px-6 py-2 text-sm font-bold text-white focus:outline-none transition-all shadow-md border-none"
                >
                    {content.previous}
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-md bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold shadow-lg rounded-lg transition-all duration-200 ease-in-out"
                >
                    {loading ? content.submitting : content.submit}
                </button>
            </div>
        </div>
    )
}
