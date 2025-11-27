import { useWizard } from './WizardContext'
import { COUNTRY_DATA } from './constants'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function Step2Legal() {
    const { formData, updateFormData, setStep } = useWizard()
    const { language } = useLanguage()

    const [errors, setErrors] = useState<Record<string, string>>({})

    const t = {
        'en-US': {
            title: 'Legal & Verification',
            regCountry: 'Registration Country:',
            regNo: 'Registration Number (SSM/Biz Reg)',
            licenseNo: 'License Number (e.g. MOTAC)',
            taxId: 'Tax ID / VAT Number',
            email: 'Official Email (Correspondence)',
            phone: 'Support Phone (Hotline)',
            previous: 'Previous',
            next: 'Next: Business Profile',
            errors: {
                regNo: 'Registration Number is required',
                email: 'Official Email is required',
                phone: 'Phone Number is required',
                phoneInvalid: 'Invalid phone number for the selected country'
            }
        },
        'zh-CN': {
            title: '法律与验证',
            regCountry: '注册国家：',
            regNo: '注册号 (SSM/Biz Reg)',
            licenseNo: '执照号码 (例如 MOTAC)',
            taxId: '税务识别号 / 增值税号',
            email: '官方电子邮件 (通信)',
            phone: '支持电话 (热线)',
            previous: '上一步',
            next: '下一步：业务资料',
            errors: {
                regNo: '需要注册号',
                email: '需要官方电子邮件',
                phone: '需要电话号码',
                phoneInvalid: '所选国家的电话号码无效'
            }
        },
        'ms-MY': {
            title: 'Undang-undang & Pengesahan',
            regCountry: 'Negara Pendaftaran:',
            regNo: 'Nombor Pendaftaran (SSM/Biz Reg)',
            licenseNo: 'Nombor Lesen (cth. MOTAC)',
            taxId: 'ID Cukai / Nombor VAT',
            email: 'Emel Rasmi (Surat-menyurat)',
            phone: 'Telefon Sokongan (Talian Utama)',
            previous: 'Sebelumnya',
            next: 'Seterusnya: Profil Perniagaan',
            errors: {
                regNo: 'Nombor Pendaftaran diperlukan',
                email: 'Emel Rasmi diperlukan',
                phone: 'Nombor Telefon diperlukan',
                phoneInvalid: 'Nombor telefon tidak sah untuk negara yang dipilih'
            }
        },
        'es-ES': {
            title: 'Legal y Verificación',
            regCountry: 'País de Registro:',
            regNo: 'Número de Registro',
            licenseNo: 'Número de Licencia',
            taxId: 'ID Fiscal / Número de IVA',
            email: 'Correo Electrónico Oficial',
            phone: 'Teléfono de Soporte',
            previous: 'Anterior',
            next: 'Siguiente: Perfil de Negocio',
            errors: {
                regNo: 'El número de registro es obligatorio',
                email: 'El correo electrónico oficial es obligatorio',
                phone: 'El número de teléfono es obligatorio',
                phoneInvalid: 'Número de teléfono no válido para el país seleccionado'
            }
        }
    }

    const getContent = (lang: string) => {
        const mapping = t[lang as keyof typeof t]
        return mapping || t['en-US']
    }

    const content = getContent(language)

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.company_reg_no) newErrors.company_reg_no = content.errors.regNo
        if (!formData.contact_email) newErrors.contact_email = content.errors.email
        if (!formData.phone_number) {
            newErrors.phone_number = content.errors.phone
        } else if (!isValidPhoneNumber(formData.phone_number)) {
            newErrors.phone_number = content.errors.phoneInvalid
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        updateFormData({ [name]: value })
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handlePhoneChange = (value: string | undefined) => {
        updateFormData({ phone_number: value || '' })
        if (errors.phone_number) {
            setErrors(prev => ({ ...prev, phone_number: '' }))
        }
    }

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        if (validate()) {
            setStep(3)
        }
    }

    const countryName = formData.country_code ? COUNTRY_DATA[formData.country_code]?.name : 'Unknown'

    return (
        <form onSubmit={handleNext} className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">{content.title}</h2>

                <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                    <p className="text-xs text-gray-400">{content.regCountry}</p>
                    <p className="text-base font-medium text-white">{countryName} ({formData.country_code})</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-300">{content.regNo} *</label>
                        <input
                            type="text"
                            name="company_reg_no"
                            value={formData.company_reg_no}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full rounded-md border ${errors.company_reg_no ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                        />
                        {errors.company_reg_no && <p className="mt-1 text-xs text-red-500">{errors.company_reg_no}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">{content.licenseNo}</label>
                        <input
                            type="text"
                            name="license_no"
                            value={formData.license_no}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300">{content.taxId}</label>
                    <input
                        type="text"
                        name="tax_id"
                        value={formData.tax_id}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-300">{content.email} *</label>
                        <input
                            type="email"
                            name="contact_email"
                            value={formData.contact_email}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full rounded-md border ${errors.contact_email ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                        />
                        {errors.contact_email && <p className="mt-1 text-xs text-red-500">{errors.contact_email}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">{content.phone} *</label>
                        <div className={`mt-1 text-black phone-input-container ${errors.phone_number ? 'border-red-500' : ''}`}>
                            <PhoneInput
                                international
                                defaultCountry={formData.country_code as any}
                                value={formData.phone_number}
                                onChange={handlePhoneChange}
                                className={`flex h-9 w-full rounded-md border ${errors.phone_number ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50`}
                                numberInputProps={{
                                    className: "bg-transparent border-none text-white focus:ring-0 text-xs w-full ml-2 placeholder-gray-500"
                                }}
                            />
                        </div>
                        {errors.phone_number && <p className="mt-1 text-xs text-red-500">{errors.phone_number}</p>}
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-md border border-gray-600 px-6 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none"
                >
                    {content.previous}
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-teal-600 px-6 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                    {content.next}
                </button>
            </div>

            <style jsx global>{`
        .PhoneInputCountry {
            margin-right: 0.5rem;
        }
        .PhoneInputCountrySelect {
            background-color: #1f2937;
            color: white;
        }
        .PhoneInputInput {
            background-color: transparent;
            color: white;
            border: none;
        }
        .PhoneInputInput:focus {
            outline: none;
        }
      `}</style>
        </form>
    )
}
