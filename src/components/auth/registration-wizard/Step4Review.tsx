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
                officialEmail: 'Official Email:',
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
                officialEmail: '官方电子邮件：',
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
                officialEmail: 'Emel Rasmi:',
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
                officialEmail: 'Correo Oficial:',
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
                    contact_email: formData.contact_email,
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
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-teal-400">{content.identity}</h3>
                        <button onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-white">{content.edit}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <p><span className="text-gray-500">{content.labels.company}</span> {formData.company_name}</p>
                        <p><span className="text-gray-500">{content.labels.country}</span> {formData.country_code}</p>
                        <p><span className="text-gray-500">{content.labels.email}</span> {formData.email}</p>
                        <p><span className="text-gray-500">{content.labels.currency}</span> {formData.base_currency}</p>
                    </div>
                </div>

                {/* Legal Section */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-teal-400">{content.legal}</h3>
                        <button onClick={() => setStep(2)} className="text-xs text-gray-400 hover:text-white">{content.edit}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <p><span className="text-gray-500">{content.labels.regNo}</span> {formData.company_reg_no}</p>
                        <p><span className="text-gray-500">{content.labels.officialEmail}</span> {formData.contact_email}</p>
                        <p><span className="text-gray-500">{content.labels.phone}</span> {formData.phone_number}</p>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-teal-400">{content.profile}</h3>
                        <button onClick={() => setStep(3)} className="text-xs text-gray-400 hover:text-white">{content.edit}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <p><span className="text-gray-500">{content.labels.type}</span> {formData.supplier_type}</p>
                        <p><span className="text-gray-500">{content.labels.website}</span> {formData.website_url}</p>
                    </div>

                    {/* Social Icons Display */}
                    <div className="flex space-x-3 mt-2">
                        {formData.social_facebook && <FaFacebook className="text-blue-500" title="Facebook" />}
                        {formData.social_instagram && <FaInstagram className="text-pink-500" title="Instagram" />}
                        {formData.social_tiktok && <FaTiktok className="text-white" title="TikTok" />}
                        {formData.social_linkedin && <FaLinkedin className="text-blue-400" title="LinkedIn" />}
                        {formData.social_tripadvisor && <FaTripadvisor className="text-green-500" title="TripAdvisor" />}
                        {formData.whatsapp_business_url && <FaWhatsapp className="text-green-400" title="WhatsApp" />}
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="rounded-md border border-gray-600 px-6 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none"
                >
                    {content.previous}
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary btn-md"
                >
                    {loading ? content.submitting : content.submit}
                </button>
            </div>
        </div>
    )
}
