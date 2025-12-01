import { useWizard } from './WizardContext'
import { SUPPLIER_TYPES, LANGUAGES } from './constants'
import { useState } from 'react'
import { FaFacebook, FaInstagram, FaTiktok, FaLinkedin, FaTripadvisor, FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'

export default function Step3Profile() {
    const { formData, updateFormData, setStep } = useWizard()
    const { language } = useLanguage()
    const [errors, setErrors] = useState<Record<string, string>>({})

    const t = {
        'en-US': {
            title: 'Business Profile',
            category: 'Supplier Category',
            selectCategory: 'Select Category',
            about: 'About Us (Description)',
            website: 'Website URL',
            social: 'Social Media & Contact Links',
            languages: 'Languages Spoken',
            previous: 'Previous',
            next: 'Next: Review & Submit',
            errors: {
                category: 'Supplier Category is required',
                website: 'Website URL is required'
            },
            languageOptions: {
                'English': 'English',
                'Mandarin': 'Mandarin',
                'Malay': 'Malay',
                'Tamil': 'Tamil',
                'Japanese': 'Japanese',
                'Korean': 'Korean',
                'Arabic': 'Arabic',
                'French': 'French',
                'Spanish': 'Spanish',
                'German': 'German',
            }
        },
        'zh-CN': {
            title: '业务资料',
            category: '供应商类别',
            selectCategory: '选择类别',
            about: '关于我们 (描述)',
            website: '网站 URL',
            social: '社交媒体与联系链接',
            languages: '所讲语言',
            previous: '上一步',
            next: '下一步：审查与提交',
            errors: {
                category: '需要供应商类别',
                website: '需要网站 URL'
            },
            languageOptions: {
                'English': '英语',
                'Mandarin': '普通话',
                'Malay': '马来语',
                'Tamil': '泰米尔语',
                'Japanese': '日语',
                'Korean': '韩语',
                'Arabic': '阿拉伯语',
                'French': '法语',
                'Spanish': '西班牙语',
                'German': '德语',
            }
        },
        'ms-MY': {
            title: 'Profil Perniagaan',
            category: 'Kategori Pembekal',
            selectCategory: 'Pilih Kategori',
            about: 'Tentang Kami (Penerangan)',
            website: 'URL Laman Web',
            social: 'Media Sosial & Pautan Kenalan',
            languages: 'Bahasa Pertuturan',
            previous: 'Sebelumnya',
            next: 'Seterusnya: Semak & Hantar',
            errors: {
                category: 'Kategori Pembekal diperlukan',
                website: 'URL Laman Web diperlukan'
            },
            languageOptions: {
                'English': 'Bahasa Inggeris',
                'Mandarin': 'Mandarin',
                'Malay': 'Bahasa Melayu',
                'Tamil': 'Tamil',
                'Japanese': 'Jepun',
                'Korean': 'Korea',
                'Arabic': 'Arab',
                'French': 'Perancis',
                'Spanish': 'Sepanyol',
                'German': 'Jerman',
            }
        },
        'es-ES': {
            title: 'Perfil de Negocio',
            category: 'Categoría de Proveedor',
            selectCategory: 'Seleccionar Categoría',
            about: 'Sobre Nosotros (Descripción)',
            website: 'URL del Sitio Web',
            social: 'Redes Sociales y Enlaces de Contacto',
            languages: 'Idiomas Hablados',
            previous: 'Anterior',
            next: 'Siguiente: Revisar y Enviar',
            errors: {
                category: 'La categoría de proveedor es obligatoria',
                website: 'La URL del sitio web es obligatoria'
            },
            languageOptions: {
                'English': 'Inglés',
                'Mandarin': 'Mandarín',
                'Malay': 'Malayo',
                'Tamil': 'Tamil',
                'Japanese': 'Japonés',
                'Korean': 'Coreano',
                'Arabic': 'Árabe',
                'French': 'Francés',
                'Spanish': 'Español',
                'German': 'Alemán',
            }
        },
        'fr-FR': {
            title: 'Profil d\'entreprise',
            category: 'Catégorie de fournisseur',
            selectCategory: 'Sélectionner une catégorie',
            about: 'À propos de nous (Description)',
            website: 'URL du site web',
            social: 'Réseaux sociaux et liens de contact',
            languages: 'Langues parlées',
            previous: 'Précédent',
            next: 'Suivant : Réviser et soumettre',
            errors: {
                category: 'La catégorie de fournisseur est requise',
                website: 'L\'URL du site web est requise'
            },
            languageOptions: {
                'English': 'Anglais',
                'Mandarin': 'Mandarin',
                'Malay': 'Malais',
                'Tamil': 'Tamoul',
                'Japanese': 'Japonais',
                'Korean': 'Coréen',
                'Arabic': 'Arabe',
                'French': 'Français',
                'Spanish': 'Espagnol',
                'German': 'Allemand',
            }
        },
        'de-DE': {
            title: 'Unternehmensprofil',
            category: 'Lieferantenkategorie',
            selectCategory: 'Kategorie auswählen',
            about: 'Über uns (Beschreibung)',
            website: 'Webseiten-URL',
            social: 'Soziale Medien & Kontaktlinks',
            languages: 'Gesprochene Sprachen',
            previous: 'Zurück',
            next: 'Weiter: Überprüfen & Absenden',
            errors: {
                category: 'Lieferantenkategorie ist erforderlich',
                website: 'Webseiten-URL ist erforderlich'
            },
            languageOptions: {
                'English': 'Englisch',
                'Mandarin': 'Mandarin',
                'Malay': 'Malaiisch',
                'Tamil': 'Tamilisch',
                'Japanese': 'Japanisch',
                'Korean': 'Koreanisch',
                'Arabic': 'Arabisch',
                'French': 'Französisch',
                'Spanish': 'Spanisch',
                'German': 'Deutsch',
            }
        },
        'ja-JP': {
            title: 'ビジネスプロフィール',
            category: 'サプライヤーカテゴリ',
            selectCategory: 'カテゴリを選択',
            about: '私たちについて（説明）',
            website: 'ウェブサイトURL',
            social: 'ソーシャルメディアと連絡先リンク',
            languages: '対応言語',
            previous: '戻る',
            next: '次へ：確認して送信',
            errors: {
                category: 'サプライヤーカテゴリは必須です',
                website: 'ウェブサイトURLは必須です'
            },
            languageOptions: {
                'English': '英語',
                'Mandarin': '中国語（北京語）',
                'Malay': 'マレー語',
                'Tamil': 'タミル語',
                'Japanese': '日本語',
                'Korean': '韓国語',
                'Arabic': 'アラビア語',
                'French': 'フランス語',
                'Spanish': 'スペイン語',
                'German': 'ドイツ語',
            }
        },
        'ko-KR': {
            title: '비즈니스 프로필',
            category: '공급업체 카테고리',
            selectCategory: '카테고리 선택',
            about: '회사 소개 (설명)',
            website: '웹사이트 URL',
            social: '소셜 미디어 및 연락처 링크',
            languages: '사용 언어',
            previous: '이전',
            next: '다음: 검토 및 제출',
            errors: {
                category: '공급업체 카테고리는 필수입니다',
                website: '웹사이트 URL은 필수입니다'
            },
            languageOptions: {
                'English': '영어',
                'Mandarin': '중국어(만다린)',
                'Malay': '말레이어',
                'Tamil': '타밀어',
                'Japanese': '일본어',
                'Korean': '한국어',
                'Arabic': '아랍어',
                'French': '프랑스어',
                'Spanish': '스페인어',
                'German': '독일어',
            }
        },
        'ar-SA': {
            title: 'ملف الشركة',
            category: 'فئة المورد',
            selectCategory: 'اختر الفئة',
            about: 'معلومات عنا (الوصف)',
            website: 'رابط الموقع الإلكتروني',
            social: 'وسائل التواصل الاجتماعي وروابط الاتصال',
            languages: 'اللغات المتحدث بها',
            previous: 'سابق',
            next: 'التالي: المراجعة والإرسال',
            errors: {
                category: 'فئة المورد مطلوبة',
                website: 'رابط الموقع مطلوب'
            },
            languageOptions: {
                'English': 'الإنجليزية',
                'Mandarin': 'الماندرين',
                'Malay': 'الملايو',
                'Tamil': 'التاميلية',
                'Japanese': 'اليابانية',
                'Korean': 'الكورية',
                'Arabic': 'العربية',
                'French': 'الفرنسية',
                'Spanish': 'الإسبانية',
                'German': 'الألمانية',
            }
        },
        'th-TH': {
            title: 'โปรไฟล์ธุรกิจ',
            category: 'หมวดหมู่ซัพพลายเออร์',
            selectCategory: 'เลือกหมวดหมู่',
            about: 'เกี่ยวกับเรา (คำอธิบาย)',
            website: 'URL เว็บไซต์',
            social: 'โซเชียลมีเดียและลิงก์ติดต่อ',
            languages: 'ภาษาที่พูด',
            previous: 'ก่อนหน้า',
            next: 'ถัดไป: ตรวจสอบและส่ง',
            errors: {
                category: 'จำเป็นต้องมีหมวดหมู่ซัพพลายเออร์',
                website: 'จำเป็นต้องมี URL เว็บไซต์'
            },
            languageOptions: {
                'English': 'อังกฤษ',
                'Mandarin': 'จีนกลาง',
                'Malay': 'มลายู',
                'Tamil': 'ทมิฬ',
                'Japanese': 'ญี่ปุ่น',
                'Korean': 'เกาหลี',
                'Arabic': 'อาหรับ',
                'French': 'ฝรั่งเศส',
                'Spanish': 'สเปน',
                'German': 'เยอรมัน',
            }
        },
        'vi-VN': {
            title: 'Hồ sơ doanh nghiệp',
            category: 'Danh mục nhà cung cấp',
            selectCategory: 'Chọn danh mục',
            about: 'Về chúng tôi (Mô tả)',
            website: 'URL trang web',
            social: 'Mạng xã hội & Liên kết liên hệ',
            languages: 'Ngôn ngữ sử dụng',
            previous: 'Trước',
            next: 'Tiếp theo: Xem lại & Gửi',
            errors: {
                category: 'Danh mục nhà cung cấp là bắt buộc',
                website: 'URL trang web là bắt buộc'
            },
            languageOptions: {
                'English': 'Tiếng Anh',
                'Mandarin': 'Tiếng Quan Thoại',
                'Malay': 'Tiếng Mã Lai',
                'Tamil': 'Tiếng Tamil',
                'Japanese': 'Tiếng Nhật',
                'Korean': 'Tiếng Hàn',
                'Arabic': 'Tiếng Ả Rập',
                'French': 'Tiếng Pháp',
                'Spanish': 'Tiếng Tây Ban Nha',
                'German': 'Tiếng Đức',
            }
        },
        'id-ID': {
            title: 'Profil Bisnis',
            category: 'Kategori Pemasok',
            selectCategory: 'Pilih Kategori',
            about: 'Tentang Kami (Deskripsi)',
            website: 'URL Situs Web',
            social: 'Media Sosial & Tautan Kontak',
            languages: 'Bahasa yang Digunakan',
            previous: 'Sebelumnya',
            next: 'Berikutnya: Tinjau & Kirim',
            errors: {
                category: 'Kategori Pemasok diperlukan',
                website: 'URL Situs Web diperlukan'
            },
            languageOptions: {
                'English': 'Inggris',
                'Mandarin': 'Mandarin',
                'Malay': 'Melayu',
                'Tamil': 'Tamil',
                'Japanese': 'Jepang',
                'Korean': 'Korea',
                'Arabic': 'Arab',
                'French': 'Prancis',
                'Spanish': 'Spanyol',
                'German': 'Jerman',
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
        if (!formData.supplier_type) newErrors.supplier_type = content.errors.category
        if (!formData.website_url) newErrors.website_url = content.errors.website

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        updateFormData({ [name]: value })
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleSupplierTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        updateFormData({ supplier_type: value })
        if (errors.supplier_type) {
            setErrors(prev => ({ ...prev, supplier_type: '' }))
        }
    }

    const handleLanguageToggle = (lang: string) => {
        const current = formData.languages_spoken || []
        if (current.includes(lang)) {
            updateFormData({ languages_spoken: current.filter(l => l !== lang) })
        } else {
            updateFormData({ languages_spoken: [...current, lang] })
        }
    }

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        if (validate()) {
            setStep(4)
        }
    }

    return (
        <form onSubmit={handleNext} className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">{content.title}</h2>

                <div>
                    <label className="block text-xs font-medium text-gray-300">{content.category} *</label>
                    <select
                        name="supplier_type"
                        value={formData.supplier_type}
                        onChange={handleSupplierTypeChange}
                        required
                        className={`mt-1 block w-full rounded-md border ${errors.supplier_type ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                    >
                        <option value="">{content.selectCategory}</option>
                        {SUPPLIER_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {errors.supplier_type && <p className="mt-1 text-xs text-red-500">{errors.supplier_type}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300">{content.about}</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300">{content.website} *</label>
                    <input
                        type="url"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleChange}
                        required
                        placeholder="https://example.com"
                        className={`mt-1 block w-full rounded-md border ${errors.website_url ? 'border-red-500' : 'border-gray-600'} bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                    />
                    {errors.website_url && <p className="mt-1 text-xs text-red-500">{errors.website_url}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">{content.social}</label>
                    <div className="space-y-3">
                        {/* Instagram */}
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-600 bg-gray-700 px-3 text-gray-400">
                                <FaInstagram className="h-4 w-4" />
                            </span>
                            <input
                                type="url"
                                name="social_instagram"
                                placeholder="Instagram URL"
                                value={formData.social_instagram}
                                onChange={handleChange}
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                            />
                        </div>

                        {/* Facebook */}
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-600 bg-gray-700 px-3 text-gray-400">
                                <FaFacebook className="h-4 w-4" />
                            </span>
                            <input
                                type="url"
                                name="social_facebook"
                                placeholder="Facebook URL"
                                value={formData.social_facebook}
                                onChange={handleChange}
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                            />
                        </div>

                        {/* TikTok */}
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-600 bg-gray-700 px-3 text-gray-400">
                                <FaTiktok className="h-4 w-4" />
                            </span>
                            <input
                                type="url"
                                name="social_tiktok"
                                placeholder="TikTok URL"
                                value={formData.social_tiktok}
                                onChange={handleChange}
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                            />
                        </div>

                        {/* LinkedIn */}
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-600 bg-gray-700 px-3 text-gray-400">
                                <FaLinkedin className="h-4 w-4" />
                            </span>
                            <input
                                type="url"
                                name="social_linkedin"
                                placeholder="LinkedIn URL"
                                value={formData.social_linkedin}
                                onChange={handleChange}
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                            />
                        </div>

                        {/* TripAdvisor */}
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-600 bg-gray-700 px-3 text-gray-400">
                                <FaTripadvisor className="h-4 w-4" />
                            </span>
                            <input
                                type="url"
                                name="social_tripadvisor"
                                placeholder="TripAdvisor URL"
                                value={formData.social_tripadvisor}
                                onChange={handleChange}
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                            />
                        </div>

                        {/* WhatsApp */}
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-600 bg-gray-700 px-3 text-gray-400">
                                <FaWhatsapp className="h-4 w-4" />
                            </span>
                            <input
                                type="url"
                                name="whatsapp_business_url"
                                placeholder="WhatsApp Business URL (https://wa.me/...)"
                                value={formData.whatsapp_business_url}
                                onChange={handleChange}
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-xs focus:border-teal-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">{content.languages}</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {LANGUAGES.map((lang) => (
                            <div key={lang} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`lang-${lang}`}
                                    checked={formData.languages_spoken.includes(lang)}
                                    onChange={() => handleLanguageToggle(lang)}
                                    className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-teal-600 focus:ring-teal-500"
                                />
                                <label htmlFor={`lang-${lang}`} className="ml-2 text-xs text-gray-300">
                                    {content.languageOptions[lang as keyof typeof content.languageOptions] || lang}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-lg bg-gradient-to-r from-blue-900 to-blue-500 hover:from-blue-800 hover:to-blue-400 px-6 py-2 text-sm font-bold text-white focus:outline-none transition-all shadow-md border-none"
                >
                    {content.previous}
                </button>
                <button
                    type="submit"
                    className="btn-md bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold shadow-lg rounded-lg transition-all duration-200 ease-in-out"
                >
                    {content.next}
                </button>
            </div>
        </form>
    )
}
