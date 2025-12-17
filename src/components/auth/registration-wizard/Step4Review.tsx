import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useWizard } from './WizardContext'
import { FaFacebook, FaInstagram, FaTiktok, FaLinkedin, FaTripadvisor, FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'
import { registerSupplier } from '@/app/actions/register-supplier'

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
            console.log('Submitting registration with data:', formData)
            const result = await registerSupplier(formData)

            if (result.error) {
                let errorMessage = result.error
                // Check if the error message indicates duplicate email
                if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('unique constraint')) {
                    errorMessage = 'This email is already registered.'
                }
                throw new Error(errorMessage)
            }

            if (formData.supplier_type?.toLowerCase().includes('airline') || formData.supplier_type?.toLowerCase().includes('flight')) {
                router.push('/supplier/dashboard/products/create')
            } else {
                router.push('/payment-init')
            }

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
                    {loading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        'Register My Company'
                    )}
                </button>
            </div>
        </div>
    )
}
