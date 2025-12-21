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
        },
        'fr-FR': {
            title: 'Légal et Vérification',
            regCountry: 'Pays d\'enregistrement :',
            regNo: 'Numéro d\'enregistrement',
            licenseNo: 'Numéro de licence',
            taxId: 'Numéro de TVA / ID fiscal',
            phone: 'Téléphone d\'assistance',
            previous: 'Précédent',
            next: 'Suivant : Profil d\'entreprise',
            errors: {
                regNo: 'Le numéro d\'enregistrement est requis',
                phone: 'Le numéro de téléphone est requis',
                phoneInvalid: 'Numéro de téléphone invalide pour le pays sélectionné'
            }
        },
        'de-DE': {
            title: 'Rechtliches & Verifizierung',
            regCountry: 'Registrierungsland:',
            regNo: 'Registrierungsnummer',
            licenseNo: 'Lizenznummer',
            taxId: 'Steuer-ID / USt-IdNr.',
            phone: 'Support-Telefon',
            previous: 'Zurück',
            next: 'Weiter: Unternehmensprofil',
            errors: {
                regNo: 'Registrierungsnummer ist erforderlich',
                phone: 'Telefonnummer ist erforderlich',
                phoneInvalid: 'Ungültige Telefonnummer für das ausgewählte Land'
            }
        },
        'ja-JP': {
            title: '法務と確認',
            regCountry: '登録国：',
            regNo: '登録番号',
            licenseNo: 'ライセンス番号',
            taxId: '納税者番号 / VAT番号',
            phone: 'サポート電話番号',
            previous: '戻る',
            next: '次へ：ビジネスプロフィール',
            errors: {
                regNo: '登録番号は必須です',
                phone: '電話番号は必須です',
                phoneInvalid: '選択された国の電話番号が無効です'
            }
        },
        'ko-KR': {
            title: '법률 및 확인',
            regCountry: '등록 국가:',
            regNo: '등록 번호',
            licenseNo: '면허 번호',
            taxId: '납세자 번호 / VAT 번호',
            phone: '지원 전화',
            previous: '이전',
            next: '다음: 비즈니스 프로필',
            errors: {
                regNo: '등록 번호는 필수입니다',
                phone: '전화번호는 필수입니다',
                phoneInvalid: '선택한 국가의 전화번호가 유효하지 않습니다'
            }
        },
        'ar-SA': {
            title: 'القانوني والتحقق',
            regCountry: 'بلد التسجيل:',
            regNo: 'رقم التسجيل',
            licenseNo: 'رقم الترخيص',
            taxId: 'الرقم الضريبي / رقم ضريبة القيمة المضافة',
            phone: 'هاتف الدعم',
            previous: 'سابق',
            next: 'التالي: ملف الشركة',
            errors: {
                regNo: 'رقم التسجيل مطلوب',
                phone: 'رقم الهاتف مطلوب',
                phoneInvalid: 'رقم الهاتف غير صالح للبلد المحدد'
            }
        },
        'th-TH': {
            title: 'กฎหมายและการตรวจสอบ',
            regCountry: 'ประเทศที่จดทะเบียน:',
            regNo: 'หมายเลขจดทะเบียน',
            licenseNo: 'หมายเลขใบอนุญาต',
            taxId: 'เลขประจำตัวผู้เสียภาษี / หมายเลข VAT',
            phone: 'โทรศัพท์ฝ่ายสนับสนุน',
            previous: 'ก่อนหน้า',
            next: 'ถัดไป: โปรไฟล์ธุรกิจ',
            errors: {
                regNo: 'จำเป็นต้องมีหมายเลขจดทะเบียน',
                phone: 'จำเป็นต้องมีหมายเลขโทรศัพท์',
                phoneInvalid: 'หมายเลขโทรศัพท์ไม่ถูกต้องสำหรับประเทศที่เลือก'
            }
        },
        'vi-VN': {
            title: 'Pháp lý & Xác minh',
            regCountry: 'Quốc gia đăng ký:',
            regNo: 'Số đăng ký',
            licenseNo: 'Số giấy phép',
            taxId: 'Mã số thuế / Số VAT',
            phone: 'Điện thoại hỗ trợ',
            previous: 'Trước',
            next: 'Tiếp theo: Hồ sơ doanh nghiệp',
            errors: {
                regNo: 'Số đăng ký là bắt buộc',
                phone: 'Số điện thoại là bắt buộc',
                phoneInvalid: 'Số điện thoại không hợp lệ cho quốc gia đã chọn'
            }
        },
        'id-ID': {
            title: 'Hukum & Verifikasi',
            regCountry: 'Negara Pendaftaran:',
            regNo: 'Nomor Pendaftaran',
            licenseNo: 'Nomor Lisensi',
            taxId: 'NPWP / Nomor PPN',
            phone: 'Telepon Dukungan',
            previous: 'Sebelumnya',
            next: 'Berikutnya: Profil Bisnis',
            errors: {
                regNo: 'Nomor Pendaftaran diperlukan',
                phone: 'Nomor Telepon diperlukan',
                phoneInvalid: 'Nomor telepon tidak valid untuk negara yang dipilih'
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
        <form onSubmit={handleNext} className="space-y-8">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-md border-b border-white/10 pb-4">{content.title}</h2>

                {/* Country Highlight */}
                <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 backdrop-blur-md border border-amber-500/30 p-6 rounded-2xl relative overflow-hidden group shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                    <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors"></div>
                    <p className="text-amber-200/60 text-xs font-bold uppercase tracking-wider mb-1 z-10 relative">{content.regCountry}</p>
                    <p className="text-2xl font-bold text-amber-100 z-10 relative tracking-tight">{countryName} <span className="text-amber-400">({formData.country_code})</span></p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-bold !text-white uppercase tracking-wider mb-2 ml-1">{content.regNo} *</label>
                        <input
                            type="text"
                            name="company_reg_no"
                            value={formData.company_reg_no}
                            onChange={handleChange}
                            required
                            className={`block w-full rounded-xl border ${errors.company_reg_no ? 'border-red-500' : 'border-white/10'} bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all backdrop-blur-sm`}
                        />
                        {errors.company_reg_no && <p className="mt-1 text-xs text-red-400 ml-1">{errors.company_reg_no}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold !text-white uppercase tracking-wider mb-2 ml-1">{content.licenseNo}</label>
                        <input
                            type="text"
                            name="license_no"
                            value={formData.license_no}
                            onChange={handleChange}
                            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all backdrop-blur-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold !text-white uppercase tracking-wider mb-2 ml-1">{content.taxId}</label>
                    <input
                        type="text"
                        name="tax_id"
                        value={formData.tax_id}
                        onChange={handleChange}
                        className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all backdrop-blur-sm"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-bold !text-white uppercase tracking-wider mb-2 ml-1">{content.phone} *</label>
                        <div className={`phone-input-container rounded-xl border ${errors.phone_number ? 'border-red-500' : 'border-white/10'} bg-white/5 px-4 py-3 transition-all backdrop-blur-sm focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.3)]`}>
                            <PhoneInput
                                international
                                defaultCountry={formData.country_code as any}
                                value={formData.phone_number}
                                onChange={handlePhoneChange}
                                className="flex h-full w-full bg-transparent text-white placeholder-white/30 focus:outline-none"
                                numberInputProps={{
                                    className: "bg-transparent border-none text-white focus:ring-0 text-base w-full ml-3 placeholder-white/30 h-full p-0"
                                }}
                            />
                        </div>
                        {errors.phone_number && <p className="mt-1 text-xs text-red-400 ml-1">{errors.phone_number}</p>}
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-bold rounded-xl transition-all backdrop-blur-md"
                >
                    {content.previous}
                </button>
                <button
                    type="submit"
                    className="px-10 py-4 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-1"
                >
                    {content.next}
                </button>
            </div>

            <style jsx global>{`
        .PhoneInputCountryIcon {
            box-shadow: 0 0 5px rgba(255,255,255,0.2);
        }
        .PhoneInputCountrySelectArrow {
            color: rgba(255,255,255,0.7);
            opacity: 1;
        }
        .PhoneInputCountrySelect {
            background-color: #1f2937;
            color: white;
        }
        /* Custom overrides for the phone input structure */
        .phone-input-container .PhoneInput {
            display: flex;
            align-items: center;
        }
      `}</style>
        </form>
    )
}
