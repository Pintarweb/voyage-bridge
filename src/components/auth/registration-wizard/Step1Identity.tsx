'use client'

import { useState, useEffect } from 'react'
import { useWizard } from './WizardContext'
import { COUNTRY_DATA, CURRENCIES } from './constants'
import TimezoneSelect, { ITimezone } from 'react-timezone-select'
import CountrySelect from '@/components/ui/CountrySelect'
import CurrencySelect from '@/components/ui/CurrencySelect'
import { useLanguage } from '@/context/LanguageContext'

export default function Step1Identity() {
    const { formData, updateFormData, setStep } = useWizard()
    const { language } = useLanguage()
    const [mounted, setMounted] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const t = {
        'en-US': {
            title: 'Identity & Location',
            email: 'Email Address',
            password: 'Password',
            companyName: 'Company Legal Name',
            tradingName: 'Trading Name (Optional)',
            country: 'Country',
            currency: 'Base Currency',
            address: 'Address Line 1',
            city: 'City',
            postcode: 'Postcode',
            timezone: 'Timezone',
            next: 'Next: Legal & Verification',
            errors: {
                email: 'Email is required',
                password: 'Password is required',
                passwordLength: 'Password must be at least 6 characters',
                companyName: 'Company Name is required',
                country: 'Country is required',
                currency: 'Currency is required',
                address: 'Address is required',
                city: 'City is required',
                postcode: 'Postcode is required',
                timezone: 'Timezone is required'
            }
        },
        'zh-CN': {
            title: '身份与位置',
            email: '电子邮件地址',
            password: '密码',
            companyName: '公司法定名称',
            tradingName: '商号（可选）',
            country: '国家',
            currency: '基础货币',
            address: '地址第一行',
            city: '城市',
            postcode: '邮政编码',
            timezone: '时区',
            next: '下一步：法律与验证',
            errors: {
                email: '需要电子邮件',
                password: '需要密码',
                passwordLength: '密码必须至少6个字符',
                companyName: '需要公司名称',
                country: '需要国家',
                currency: '需要货币',
                address: '需要地址',
                city: '需要城市',
                postcode: '需要邮政编码',
                timezone: '需要时区'
            }
        },
        // Add other languages as needed, falling back to English for now to save space/tokens if acceptable, 
        // but ideally should be comprehensive. Given the user request "translator did not translate the whole page", 
        // I should probably be thorough. I will add a few key ones and maybe use English for others if I run out of context, 
        // but let's try to be complete based on the pattern.
        'ms-MY': {
            title: 'Identiti & Lokasi',
            email: 'Alamat Emel',
            password: 'Kata Laluan',
            companyName: 'Nama Sah Syarikat',
            tradingName: 'Nama Perniagaan (Pilihan)',
            country: 'Negara',
            currency: 'Mata Wang Asas',
            address: 'Baris Alamat 1',
            city: 'Bandar',
            postcode: 'Poskod',
            timezone: 'Zon Masa',
            next: 'Seterusnya: Undang-undang & Pengesahan',
            errors: {
                email: 'Emel diperlukan',
                password: 'Kata laluan diperlukan',
                passwordLength: 'Kata laluan mesti sekurang-kurangnya 6 aksara',
                companyName: 'Nama Syarikat diperlukan',
                country: 'Negara diperlukan',
                currency: 'Mata wang diperlukan',
                address: 'Alamat diperlukan',
                city: 'Bandar diperlukan',
                postcode: 'Poskod diperlukan',
                timezone: 'Zon masa diperlukan'
            }
        },
        'es-ES': {
            title: 'Identidad y Ubicación',
            email: 'Dirección de Correo Electrónico',
            password: 'Contraseña',
            companyName: 'Nombre Legal de la Empresa',
            tradingName: 'Nombre Comercial (Opcional)',
            country: 'País',
            currency: 'Moneda Base',
            address: 'Línea de Dirección 1',
            city: 'Ciudad',
            postcode: 'Código Postal',
            timezone: 'Zona Horaria',
            next: 'Siguiente: Legal y Verificación',
            errors: {
                email: 'El correo electrónico es obligatorio',
                password: 'La contraseña es obligatoria',
                passwordLength: 'La contraseña debe tener al menos 6 caracteres',
                companyName: 'El nombre de la empresa es obligatorio',
                country: 'El país es obligatorio',
                currency: 'La moneda es obligatoria',
                address: 'La dirección es obligatoria',
                city: 'La ciudad es obligatoria',
                postcode: 'El código postal es obligatorio',
                timezone: 'La zona horaria es obligatoria'
            }
        },
        'fr-FR': {
            title: 'Identité et Localisation',
            email: 'Adresse E-mail',
            password: 'Mot de passe',
            companyName: 'Nom Légal de la Société',
            tradingName: 'Nom Commercial (Optionnel)',
            country: 'Pays',
            currency: 'Devise de Base',
            address: 'Adresse Ligne 1',
            city: 'Ville',
            postcode: 'Code Postal',
            timezone: 'Fuseau Horaire',
            next: 'Suivant : Légal et Vérification',
            errors: {
                email: 'L\'e-mail est requis',
                password: 'Le mot de passe est requis',
                passwordLength: 'Le mot de passe doit contenir au moins 6 caractères',
                companyName: 'Le nom de la société est requis',
                country: 'Le pays est requis',
                currency: 'La devise est requise',
                address: 'L\'adresse est requise',
                city: 'La ville est requise',
                postcode: 'Le code postal est requis',
                timezone: 'Le fuseau horaire est requis'
            }
        },
        'de-DE': {
            title: 'Identität & Standort',
            email: 'E-Mail-Adresse',
            password: 'Passwort',
            companyName: 'Rechtlicher Firmenname',
            tradingName: 'Handelsname (Optional)',
            country: 'Land',
            currency: 'Basiswährung',
            address: 'Adresszeile 1',
            city: 'Stadt',
            postcode: 'Postleitzahl',
            timezone: 'Zeitzone',
            next: 'Weiter: Rechtliches & Verifizierung',
            errors: {
                email: 'E-Mail ist erforderlich',
                password: 'Passwort ist erforderlich',
                passwordLength: 'Passwort muss mindestens 6 Zeichen lang sein',
                companyName: 'Firmenname ist erforderlich',
                country: 'Land ist erforderlich',
                currency: 'Währung ist erforderlich',
                address: 'Adresse ist erforderlich',
                city: 'Stadt ist erforderlich',
                postcode: 'Postleitzahl ist erforderlich',
                timezone: 'Zeitzone ist erforderlich'
            }
        },
        'ja-JP': {
            title: '身元と場所',
            email: 'メールアドレス',
            password: 'パスワード',
            companyName: '会社正式名称',
            tradingName: '屋号（任意）',
            country: '国',
            currency: '基本通貨',
            address: '住所1',
            city: '市区町村',
            postcode: '郵便番号',
            timezone: 'タイムゾーン',
            next: '次へ：法務と確認',
            errors: {
                email: 'メールアドレスは必須です',
                password: 'パスワードは必須です',
                passwordLength: 'パスワードは6文字以上である必要があります',
                companyName: '会社名は必須です',
                country: '国は必須です',
                currency: '通貨は必須です',
                address: '住所は必須です',
                city: '市区町村は必須です',
                postcode: '郵便番号は必須です',
                timezone: 'タイムゾーンは必須です'
            }
        },
        'ko-KR': {
            title: '신원 및 위치',
            email: '이메일 주소',
            password: '비밀번호',
            companyName: '회사 법적 이름',
            tradingName: '상호 (선택 사항)',
            country: '국가',
            currency: '기본 통화',
            address: '주소 1',
            city: '도시',
            postcode: '우편번호',
            timezone: '시간대',
            next: '다음: 법률 및 확인',
            errors: {
                email: '이메일은 필수입니다',
                password: '비밀번호는 필수입니다',
                passwordLength: '비밀번호는 6자 이상이어야 합니다',
                companyName: '회사 이름은 필수입니다',
                country: '국가는 필수입니다',
                currency: '통화는 필수입니다',
                address: '주소는 필수입니다',
                city: '도시는 필수입니다',
                postcode: '우편번호는 필수입니다',
                timezone: '시간대는 필수입니다'
            }
        },
        'ar-SA': {
            title: 'الهوية والموقع',
            email: 'عنوان البريد الإلكتروني',
            password: 'كلمة المرور',
            companyName: 'الاسم القانوني للشركة',
            tradingName: 'الاسم التجاري (اختياري)',
            country: 'البلد',
            currency: 'العملة الأساسية',
            address: 'سطر العنوان 1',
            city: 'المدينة',
            postcode: 'الرمز البريدي',
            timezone: 'المنطقة الزمنية',
            next: 'التالي: القانوني والتحقق',
            errors: {
                email: 'البريد الإلكتروني مطلوب',
                password: 'كلمة المرور مطلوبة',
                passwordLength: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
                companyName: 'اسم الشركة مطلوب',
                country: 'البلد مطلوب',
                currency: 'العملة مطلوبة',
                address: 'العنوان مطلوب',
                city: 'المدينة مطلوبة',
                postcode: 'الرمز البريدي مطلوب',
                timezone: 'المنطقة الزمنية مطلوبة'
            }
        },
        'th-TH': {
            title: 'ตัวตนและที่ตั้ง',
            email: 'ที่อยู่อีเมล',
            password: 'รหัสผ่าน',
            companyName: 'ชื่อนิติบุคคลของบริษัท',
            tradingName: 'ชื่อทางการค้า (ไม่บังคับ)',
            country: 'ประเทศ',
            currency: 'สกุลเงินหลัก',
            address: 'ที่อยู่บรรทัดที่ 1',
            city: 'เมือง',
            postcode: 'รหัสไปรษณีย์',
            timezone: 'เขตเวลา',
            next: 'ถัดไป: กฎหมายและการตรวจสอบ',
            errors: {
                email: 'จำเป็นต้องมีอีเมล',
                password: 'จำเป็นต้องมีรหัสผ่าน',
                passwordLength: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
                companyName: 'จำเป็นต้องมีชื่อบริษัท',
                country: 'จำเป็นต้องมีประเทศ',
                currency: 'จำเป็นต้องมีสกุลเงิน',
                address: 'จำเป็นต้องมีที่อยู่',
                city: 'จำเป็นต้องมีเมือง',
                postcode: 'จำเป็นต้องมีรหัสไปรษณีย์',
                timezone: 'จำเป็นต้องมีเขตเวลา'
            }
        },
        'vi-VN': {
            title: 'Danh tính & Vị trí',
            email: 'Địa chỉ Email',
            password: 'Mật khẩu',
            companyName: 'Tên pháp lý công ty',
            tradingName: 'Tên giao dịch (Tùy chọn)',
            country: 'Quốc gia',
            currency: 'Tiền tệ cơ sở',
            address: 'Địa chỉ dòng 1',
            city: 'Thành phố',
            postcode: 'Mã bưu chính',
            timezone: 'Múi giờ',
            next: 'Tiếp theo: Pháp lý & Xác minh',
            errors: {
                email: 'Email là bắt buộc',
                password: 'Mật khẩu là bắt buộc',
                passwordLength: 'Mật khẩu phải có ít nhất 6 ký tự',
                companyName: 'Tên công ty là bắt buộc',
                country: 'Quốc gia là bắt buộc',
                currency: 'Tiền tệ là bắt buộc',
                address: 'Địa chỉ là bắt buộc',
                city: 'Thành phố là bắt buộc',
                postcode: 'Mã bưu chính là bắt buộc',
                timezone: 'Múi giờ là bắt buộc'
            }
        },
        'id-ID': {
            title: 'Identitas & Lokasi',
            email: 'Alamat Email',
            password: 'Kata Sandi',
            companyName: 'Nama Resmi Perusahaan',
            tradingName: 'Nama Dagang (Opsional)',
            country: 'Negara',
            currency: 'Mata Uang Dasar',
            address: 'Alamat Baris 1',
            city: 'Kota',
            postcode: 'Kode Pos',
            timezone: 'Zona Waktu',
            next: 'Berikutnya: Hukum & Verifikasi',
            errors: {
                email: 'Email diperlukan',
                password: 'Kata sandi diperlukan',
                passwordLength: 'Kata sandi harus minimal 6 karakter',
                companyName: 'Nama Perusahaan diperlukan',
                country: 'Negara diperlukan',
                currency: 'Mata uang diperlukan',
                address: 'Alamat diperlukan',
                city: 'Kota diperlukan',
                postcode: 'Kode Pos diperlukan',
                timezone: 'Zona waktu diperlukan'
            }
        }
    }

    // Helper to get content with fallback
    const getContent = (lang: string) => {
        const mapping = t[lang as keyof typeof t]
        return mapping || t['en-US']
    }

    const content = getContent(language)

    useEffect(() => {
        setMounted(true)
    }, [])

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.email) newErrors.email = content.errors.email
        if (!formData.password) {
            newErrors.password = content.errors.password
        } else if (formData.password.length < 6) {
            newErrors.password = content.errors.passwordLength
        }
        if (!formData.company_name) newErrors.company_name = content.errors.companyName
        if (!formData.country_code) newErrors.country_code = content.errors.country
        if (!formData.base_currency) newErrors.base_currency = content.errors.currency
        if (!formData.address_line_1) newErrors.address_line_1 = content.errors.address
        if (!formData.city) newErrors.city = content.errors.city
        if (!formData.postcode) newErrors.postcode = content.errors.postcode
        if (!formData.timezone) newErrors.timezone = content.errors.timezone

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        updateFormData({ [name]: value })

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleCountryChange = (value: string) => {
        const country = COUNTRY_DATA[value]
        if (country) {
            updateFormData({
                country_code: value,
                base_currency: country.currency,
                timezone: country.timezone
            })
            // Clear related errors
            setErrors(prev => ({
                ...prev,
                country_code: '',
                base_currency: '',
                timezone: ''
            }))
        } else {
            // Fallback if country data not found (e.g. searching all countries)
            updateFormData({ country_code: value })
            if (errors.country_code) setErrors(prev => ({ ...prev, country_code: '' }))
        }
    }

    const handleCurrencyChange = (value: string) => {
        updateFormData({ base_currency: value })
        if (errors.base_currency) {
            setErrors(prev => ({ ...prev, base_currency: '' }))
        }
    }

    const handleTimezoneChange = (tz: ITimezone) => {
        const val = typeof tz === 'string' ? tz : tz.value
        updateFormData({ timezone: val })
        if (errors.timezone) {
            setErrors(prev => ({ ...prev, timezone: '' }))
        }
    }

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        if (validate()) {
            setStep(2)
        }
    }

    return (
        <form onSubmit={handleNext} className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">{content.title}</h2>

                {/* Auth Fields */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-300">{content.email} *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                            className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">{content.password} *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            className={`mt-1 block w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-300">{content.companyName} *</label>
                        <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full rounded-md border ${errors.company_name ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                        />
                        {errors.company_name && <p className="mt-1 text-xs text-red-500">{errors.company_name}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">{content.tradingName}</label>
                        <input
                            type="text"
                            name="trading_name"
                            value={formData.trading_name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-300">{content.country} *</label>
                        <CountrySelect
                            value={formData.country_code}
                            onChange={handleCountryChange}
                            theme="dark"
                            className={errors.country_code ? 'border-red-500' : ''}
                        />
                        {errors.country_code && <p className="mt-1 text-xs text-red-500">{errors.country_code}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">{content.currency} *</label>
                        <CurrencySelect
                            value={formData.base_currency}
                            onChange={handleCurrencyChange}
                            currencies={CURRENCIES}
                            theme="dark"
                            className={errors.base_currency ? 'border-red-500' : ''}
                        />
                        {errors.base_currency && <p className="mt-1 text-xs text-red-500">{errors.base_currency}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300">{content.address} *</label>
                    <input
                        type="text"
                        name="address_line_1"
                        value={formData.address_line_1}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full rounded-md border ${errors.address_line_1 ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                    />
                    {errors.address_line_1 && <p className="mt-1 text-xs text-red-500">{errors.address_line_1}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-300">{content.city} *</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full rounded-md border ${errors.city ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                        />
                        {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300">{content.postcode} *</label>
                        <input
                            type="text"
                            name="postcode"
                            value={formData.postcode}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full rounded-md border ${errors.postcode ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                        />
                        {errors.postcode && <p className="mt-1 text-xs text-red-500">{errors.postcode}</p>}
                    </div>
                </div>

                {/* Timezone moved to its own spacious row */}
                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">{content.timezone} *</label>
                    <div className="text-black text-xs">
                        {mounted && (
                            <TimezoneSelect
                                value={formData.timezone}
                                onChange={handleTimezoneChange}
                                className="text-xs"
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        backgroundColor: '#1f2937', // gray-800
                                        borderColor: errors.timezone ? '#ef4444' : '#4b5563', // red-500 or gray-600
                                        color: 'white',
                                        minHeight: '38px',
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        color: 'white',
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        backgroundColor: '#1f2937',
                                        color: 'white',
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isFocused ? '#374151' : '#1f2937',
                                        color: 'white',
                                    }),
                                    input: (provided) => ({
                                        ...provided,
                                        color: 'white',
                                    }),
                                }}
                            />
                        )}
                    </div>
                    {errors.timezone && <p className="mt-1 text-xs text-red-500">{errors.timezone}</p>}
                </div>

            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="btn-primary btn-md"
                >
                    {content.next}
                </button>
            </div>
        </form>
    )
}
