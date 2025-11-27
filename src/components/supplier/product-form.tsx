'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaCloudUploadAlt, FaTrash, FaPlus, FaTimes } from 'react-icons/fa'
import { createClient } from '@/utils/supabase/client'
import { useLanguage } from '@/context/LanguageContext'

interface ProductFormProps {
    onSuccess: () => void
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const supabase = createClient()
    const { language } = useLanguage()

    const [formData, setFormData] = useState({
        product_name: '',
        product_description: '',
        product_category: '',
        city: '',
        country_code: '',
        validity_start_date: '',
        validity_end_date: '',
        agent_price: '',
        currency: 'USD',
        min_pax: 1,
        max_pax: 100,
        cancellation_policy: '',
        inclusions: [''],
        exclusions: [''],
        terms_conditions: ''
    })

    const t = {
        'en-US': {
            basicInfo: 'Basic Information',
            productName: 'Product Name',
            productNamePlaceholder: 'e.g., Full Day City Tour',
            category: 'Category',
            selectCategory: 'Select a category',
            categories: {
                tours: 'Tours & Activities',
                transport: 'Transportation',
                accommodation: 'Accommodation',
                tickets: 'Tickets & Passes',
                packages: 'Multi-day Packages'
            },
            location: 'Location',
            city: 'City',
            countryCode: 'Country Code',
            pricingValidity: 'Pricing & Validity',
            agentPrice: 'Agent Price (Net)',
            currency: 'Currency',
            validFrom: 'Valid From',
            validTo: 'Valid To',
            capacity: 'Capacity',
            minPax: 'Min Pax',
            maxPax: 'Max Pax',
            media: 'Media',
            dragDrop: 'Drag & drop images here, or click to select',
            maxImages: '(Max 5 images, 5MB each)',
            details: 'Product Details',
            description: 'Description',
            descriptionPlaceholder: 'Detailed description of the product...',
            inclusions: 'Inclusions',
            addInclusion: 'Add Inclusion',
            exclusions: 'Exclusions',
            addExclusion: 'Add Exclusion',
            policies: 'Policies',
            cancellationPolicy: 'Cancellation Policy',
            cancellationPlaceholder: 'e.g., Free cancellation up to 24 hours before...',
            termsConditions: 'Terms & Conditions',
            termsPlaceholder: 'e.g., General terms and conditions...',
            createProduct: 'Create Product',
            creating: 'Creating...',
            errorMissingFields: 'Please fill in all required fields and upload at least one image.',
            errorUpload: 'Error uploading images',
            errorCreate: 'Error creating product'
        },
        'zh-CN': {
            basicInfo: '基本信息',
            productName: '产品名称',
            productNamePlaceholder: '例如：全天城市游',
            category: '类别',
            selectCategory: '选择类别',
            categories: {
                tours: '旅游与活动',
                transport: '交通',
                accommodation: '住宿',
                tickets: '门票与通票',
                packages: '多日套餐'
            },
            location: '地点',
            city: '城市',
            countryCode: '国家代码',
            pricingValidity: '定价与有效期',
            agentPrice: '代理价格（净价）',
            currency: '货币',
            validFrom: '有效期自',
            validTo: '有效期至',
            capacity: '容量',
            minPax: '最少人数',
            maxPax: '最多人数',
            media: '媒体',
            dragDrop: '拖放图片到此处，或点击选择',
            maxImages: '（最多 5 张图片，每张 5MB）',
            details: '产品详情',
            description: '描述',
            descriptionPlaceholder: '产品的详细描述...',
            inclusions: '包含项目',
            addInclusion: '添加包含项目',
            exclusions: '不包含项目',
            addExclusion: '添加不包含项目',
            policies: '政策',
            cancellationPolicy: '取消政策',
            cancellationPlaceholder: '例如：24 小时前免费取消...',
            termsConditions: '条款与条件',
            termsPlaceholder: '例如：一般条款与条件...',
            createProduct: '创建产品',
            creating: '创建中...',
            errorMissingFields: '请填写所有必填字段并上传至少一张图片。',
            errorUpload: '上传图片时出错',
            errorCreate: '创建产品时出错'
        },
        'ms-MY': {
            basicInfo: 'Maklumat Asas',
            productName: 'Nama Produk',
            productNamePlaceholder: 'cth., Lawatan Bandar Sepenuh Hari',
            category: 'Kategori',
            selectCategory: 'Pilih kategori',
            categories: {
                tours: 'Lawatan & Aktiviti',
                transport: 'Pengangkutan',
                accommodation: 'Penginapan',
                tickets: 'Tiket & Pas',
                packages: 'Pakej Berbilang Hari'
            },
            location: 'Lokasi',
            city: 'Bandar',
            countryCode: 'Kod Negara',
            pricingValidity: 'Harga & Kesahihan',
            agentPrice: 'Harga Ejen (Bersih)',
            currency: 'Mata Wang',
            validFrom: 'Sah Dari',
            validTo: 'Sah Hingga',
            capacity: 'Kapasiti',
            minPax: 'Min Pax',
            maxPax: 'Max Pax',
            media: 'Media',
            dragDrop: 'Seret & lepas imej di sini, atau klik untuk memilih',
            maxImages: '(Maks 5 imej, 5MB setiap satu)',
            details: 'Butiran Produk',
            description: 'Penerangan',
            descriptionPlaceholder: 'Penerangan terperinci produk...',
            inclusions: 'Termasuk',
            addInclusion: 'Tambah Item Termasuk',
            exclusions: 'Tidak Termasuk',
            addExclusion: 'Tambah Item Tidak Termasuk',
            policies: 'Polisi',
            cancellationPolicy: 'Polisi Pembatalan',
            cancellationPlaceholder: 'cth., Pembatalan percuma sehingga 24 jam sebelum...',
            termsConditions: 'Terma & Syarat',
            termsPlaceholder: 'cth., Terma dan syarat umum...',
            createProduct: 'Cipta Produk',
            creating: 'Mencipta...',
            errorMissingFields: 'Sila isi semua medan yang diperlukan dan muat naik sekurang-kurangnya satu imej.',
            errorUpload: 'Ralat memuat naik imej',
            errorCreate: 'Ralat mencipta produk'
        },
        'es-ES': {
            basicInfo: 'Información Básica',
            productName: 'Nombre del Producto',
            productNamePlaceholder: 'ej., Tour de Día Completo por la Ciudad',
            category: 'Categoría',
            selectCategory: 'Seleccione una categoría',
            categories: {
                tours: 'Tours y Actividades',
                transport: 'Transporte',
                accommodation: 'Alojamiento',
                tickets: 'Entradas y Pases',
                packages: 'Paquetes de Varios Días'
            },
            location: 'Ubicación',
            city: 'Ciudad',
            countryCode: 'Código de País',
            pricingValidity: 'Precios y Validez',
            agentPrice: 'Precio de Agente (Neto)',
            currency: 'Moneda',
            validFrom: 'Válido Desde',
            validTo: 'Válido Hasta',
            capacity: 'Capacidad',
            minPax: 'Mín Pax',
            maxPax: 'Máx Pax',
            media: 'Medios',
            dragDrop: 'Arrastre y suelte imágenes aquí, o haga clic para seleccionar',
            maxImages: '(Máx 5 imágenes, 5MB cada una)',
            details: 'Detalles del Producto',
            description: 'Descripción',
            descriptionPlaceholder: 'Descripción detallada del producto...',
            inclusions: 'Inclusiones',
            addInclusion: 'Agregar Inclusión',
            exclusions: 'Exclusiones',
            addExclusion: 'Agregar Exclusión',
            policies: 'Políticas',
            cancellationPolicy: 'Política de Cancelación',
            cancellationPlaceholder: 'ej., Cancelación gratuita hasta 24 horas antes...',
            termsConditions: 'Términos y Condiciones',
            termsPlaceholder: 'ej., Términos y condiciones generales...',
            createProduct: 'Crear Producto',
            creating: 'Creando...',
            errorMissingFields: 'Por favor complete todos los campos requeridos y suba al menos una imagen.',
            errorUpload: 'Error al subir imágenes',
            errorCreate: 'Error al crear el producto'
        },
        'fr-FR': {
            basicInfo: 'Informations de Base',
            productName: 'Nom du Produit',
            productNamePlaceholder: 'ex., Tour de Ville Journée Complète',
            category: 'Catégorie',
            selectCategory: 'Sélectionnez une catégorie',
            categories: {
                tours: 'Tours et Activités',
                transport: 'Transport',
                accommodation: 'Hébergement',
                tickets: 'Billets et Pass',
                packages: 'Forfaits Plusieurs Jours'
            },
            location: 'Emplacement',
            city: 'Ville',
            countryCode: 'Code Pays',
            pricingValidity: 'Prix et Validité',
            agentPrice: 'Prix Agent (Net)',
            currency: 'Devise',
            validFrom: 'Valide Du',
            validTo: 'Valide Au',
            capacity: 'Capacité',
            minPax: 'Min Pax',
            maxPax: 'Max Pax',
            media: 'Médias',
            dragDrop: 'Glissez et déposez des images ici, ou cliquez pour sélectionner',
            maxImages: '(Max 5 images, 5MB chacune)',
            details: 'Détails du Produit',
            description: 'Description',
            descriptionPlaceholder: 'Description détaillée du produit...',
            inclusions: 'Inclusions',
            addInclusion: 'Ajouter une Inclusion',
            exclusions: 'Exclusions',
            addExclusion: 'Ajouter une Exclusion',
            policies: 'Politiques',
            cancellationPolicy: 'Politique d\'Annulation',
            cancellationPlaceholder: 'ex., Annulation gratuite jusqu\'à 24 heures avant...',
            termsConditions: 'Termes et Conditions',
            termsPlaceholder: 'ex., Termes et conditions généraux...',
            createProduct: 'Créer le Produit',
            creating: 'Création...',
            errorMissingFields: 'Veuillez remplir tous les champs obligatoires et télécharger au moins une image.',
            errorUpload: 'Erreur lors du téléchargement des images',
            errorCreate: 'Erreur lors de la création du produit'
        },
        'de-DE': {
            basicInfo: 'Grundlegende Informationen',
            productName: 'Produktname',
            productNamePlaceholder: 'z.B. Ganztägige Stadtrundfahrt',
            category: 'Kategorie',
            selectCategory: 'Wählen Sie eine Kategorie',
            categories: {
                tours: 'Touren & Aktivitäten',
                transport: 'Transport',
                accommodation: 'Unterkunft',
                tickets: 'Tickets & Pässe',
                packages: 'Mehrtagespakete'
            },
            location: 'Standort',
            city: 'Stadt',
            countryCode: 'Ländercode',
            pricingValidity: 'Preise & Gültigkeit',
            agentPrice: 'Agentenpreis (Netto)',
            currency: 'Währung',
            validFrom: 'Gültig Von',
            validTo: 'Gültig Bis',
            capacity: 'Kapazität',
            minPax: 'Min Pax',
            maxPax: 'Max Pax',
            media: 'Medien',
            dragDrop: 'Bilder hierher ziehen oder klicken zum Auswählen',
            maxImages: '(Max 5 Bilder, je 5MB)',
            details: 'Produktdetails',
            description: 'Beschreibung',
            descriptionPlaceholder: 'Detaillierte Beschreibung des Produkts...',
            inclusions: 'Inklusivleistungen',
            addInclusion: 'Inklusivleistung Hinzufügen',
            exclusions: 'Ausschlüsse',
            addExclusion: 'Ausschluss Hinzufügen',
            policies: 'Richtlinien',
            cancellationPolicy: 'Stornierungsbedingungen',
            cancellationPlaceholder: 'z.B. Kostenlose Stornierung bis 24 Stunden vor...',
            termsConditions: 'Allgemeine Geschäftsbedingungen',
            termsPlaceholder: 'z.B. Allgemeine Geschäftsbedingungen...',
            createProduct: 'Produkt Erstellen',
            creating: 'Erstellen...',
            errorMissingFields: 'Bitte füllen Sie alle Pflichtfelder aus und laden Sie mindestens ein Bild hoch.',
            errorUpload: 'Fehler beim Hochladen der Bilder',
            errorCreate: 'Fehler beim Erstellen des Produkts'
        },
        'ja-JP': {
            basicInfo: '基本情報',
            productName: '製品名',
            productNamePlaceholder: '例：一日市内観光',
            category: 'カテゴリー',
            selectCategory: 'カテゴリーを選択',
            categories: {
                tours: 'ツアー＆アクティビティ',
                transport: '交通機関',
                accommodation: '宿泊施設',
                tickets: 'チケット＆パス',
                packages: '複数日パッケージ'
            },
            location: '場所',
            city: '都市',
            countryCode: '国コード',
            pricingValidity: '価格と有効期限',
            agentPrice: 'エージェント価格（ネット）',
            currency: '通貨',
            validFrom: '有効開始日',
            validTo: '有効終了日',
            capacity: '定員',
            minPax: '最小人数',
            maxPax: '最大人数',
            media: 'メディア',
            dragDrop: '画像をここにドラッグ＆ドロップ、またはクリックして選択',
            maxImages: '（最大5枚、各5MB）',
            details: '製品詳細',
            description: '説明',
            descriptionPlaceholder: '製品の詳細な説明...',
            inclusions: '含まれるもの',
            addInclusion: '含まれるものを追加',
            exclusions: '含まれないもの',
            addExclusion: '含まれないものを追加',
            policies: 'ポリシー',
            cancellationPolicy: 'キャンセルポリシー',
            cancellationPlaceholder: '例：24時間前までキャンセル無料...',
            termsConditions: '利用規約',
            termsPlaceholder: '例：一般的な利用規約...',
            createProduct: '製品を作成',
            creating: '作成中...',
            errorMissingFields: 'すべての必須フィールドに入力し、少なくとも1つの画像をアップロードしてください。',
            errorUpload: '画像のアップロードエラー',
            errorCreate: '製品作成エラー'
        },
        'ko-KR': {
            basicInfo: '기본 정보',
            productName: '제품명',
            productNamePlaceholder: '예: 전일 시티 투어',
            category: '카테고리',
            selectCategory: '카테고리 선택',
            categories: {
                tours: '투어 & 액티비티',
                transport: '교통',
                accommodation: '숙박',
                tickets: '티켓 & 패스',
                packages: '다일 패키지'
            },
            location: '위치',
            city: '도시',
            countryCode: '국가 코드',
            pricingValidity: '가격 & 유효기간',
            agentPrice: '에이전트 가격 (순)',
            currency: '통화',
            validFrom: '유효 시작일',
            validTo: '유효 종료일',
            capacity: '수용 인원',
            minPax: '최소 인원',
            maxPax: '최대 인원',
            media: '미디어',
            dragDrop: '이미지를 여기로 드래그 앤 드롭하거나 클릭하여 선택',
            maxImages: '(최대 5장, 각 5MB)',
            details: '제품 상세',
            description: '설명',
            descriptionPlaceholder: '제품에 대한 상세 설명...',
            inclusions: '포함 사항',
            addInclusion: '포함 사항 추가',
            exclusions: '불포함 사항',
            addExclusion: '불포함 사항 추가',
            policies: '정책',
            cancellationPolicy: '취소 정책',
            cancellationPlaceholder: '예: 24시간 전까지 무료 취소...',
            termsConditions: '이용 약관',
            termsPlaceholder: '예: 일반 이용 약관...',
            createProduct: '제품 생성',
            creating: '생성 중...',
            errorMissingFields: '모든 필수 필드를 입력하고 최소 하나의 이미지를 업로드하십시오.',
            errorUpload: '이미지 업로드 오류',
            errorCreate: '제품 생성 오류'
        },
        'ar-SA': {
            basicInfo: 'معلومات أساسية',
            productName: 'اسم المنتج',
            productNamePlaceholder: 'مثال: جولة في المدينة ليوم كامل',
            category: 'الفئة',
            selectCategory: 'اختر فئة',
            categories: {
                tours: 'جولات وأنشطة',
                transport: 'نقل',
                accommodation: 'إقامة',
                tickets: 'تذاكر وتصاريح',
                packages: 'باقات متعددة الأيام'
            },
            location: 'الموقع',
            city: 'المدينة',
            countryCode: 'رمز الدولة',
            pricingValidity: 'التسعير والصلاحية',
            agentPrice: 'سعر الوكيل (الصافي)',
            currency: 'العملة',
            validFrom: 'صالح من',
            validTo: 'صالح إلى',
            capacity: 'السعة',
            minPax: 'الحد الأدنى للأشخاص',
            maxPax: 'الحد الأقصى للأشخاص',
            media: 'الوسائط',
            dragDrop: 'اسحب وأفلت الصور هنا، أو انقر للتحديد',
            maxImages: '(الحد الأقصى 5 صور، 5 ميجابايت لكل منها)',
            details: 'تفاصيل المنتج',
            description: 'الوصف',
            descriptionPlaceholder: 'وصف مفصل للمنتج...',
            inclusions: 'المشتملات',
            addInclusion: 'إضافة مشتملات',
            exclusions: 'المستبعدات',
            addExclusion: 'إضافة مستبعدات',
            policies: 'السياسات',
            cancellationPolicy: 'سياسة الإلغاء',
            cancellationPlaceholder: 'مثال: إلغاء مجاني حتى 24 ساعة قبل...',
            termsConditions: 'الشروط والأحكام',
            termsPlaceholder: 'مثال: الشروط والأحكام العامة...',
            createProduct: 'إنشاء منتج',
            creating: 'جاري الإنشاء...',
            errorMissingFields: 'يرجى ملء جميع الحقول المطلوبة وتحميل صورة واحدة على الأقل.',
            errorUpload: 'خطأ في تحميل الصور',
            errorCreate: 'خطأ في إنشاء المنتج'
        },
        'th-TH': {
            basicInfo: 'ข้อมูลพื้นฐาน',
            productName: 'ชื่อผลิตภัณฑ์',
            productNamePlaceholder: 'เช่น ทัวร์ชมเมืองเต็มวัน',
            category: 'หมวดหมู่',
            selectCategory: 'เลือกหมวดหมู่',
            categories: {
                tours: 'ทัวร์และกิจกรรม',
                transport: 'การขนส่ง',
                accommodation: 'ที่พัก',
                tickets: 'ตั๋วและบัตรผ่าน',
                packages: 'แพ็คเกจหลายวัน'
            },
            location: 'สถานที่',
            city: 'เมือง',
            countryCode: 'รหัสประเทศ',
            pricingValidity: 'ราคาและความถูกต้อง',
            agentPrice: 'ราคาตัวแทน (สุทธิ)',
            currency: 'สกุลเงิน',
            validFrom: 'ใช้ได้ตั้งแต่',
            validTo: 'ใช้ได้ถึง',
            capacity: 'ความจุ',
            minPax: 'จำนวนคนขั้นต่ำ',
            maxPax: 'จำนวนคนสูงสุด',
            media: 'สื่อ',
            dragDrop: 'ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือก',
            maxImages: '(สูงสุด 5 รูป, รูปละ 5MB)',
            details: 'รายละเอียดผลิตภัณฑ์',
            description: 'คำอธิบาย',
            descriptionPlaceholder: 'คำอธิบายโดยละเอียดของผลิตภัณฑ์...',
            inclusions: 'สิ่งที่รวมอยู่',
            addInclusion: 'เพิ่มสิ่งที่รวมอยู่',
            exclusions: 'สิ่งที่ไม่รวมอยู่',
            addExclusion: 'เพิ่มสิ่งที่ไม่รวมอยู่',
            policies: 'นโยบาย',
            cancellationPolicy: 'นโยบายการยกเลิก',
            cancellationPlaceholder: 'เช่น ยกเลิกฟรีล่วงหน้า 24 ชั่วโมง...',
            termsConditions: 'ข้อกำหนดและเงื่อนไข',
            termsPlaceholder: 'เช่น ข้อกำหนดและเงื่อนไขทั่วไป...',
            createProduct: 'สร้างผลิตภัณฑ์',
            creating: 'กำลังสร้าง...',
            errorMissingFields: 'กรุณากรอกข้อมูลในช่องที่จำเป็นทั้งหมดและอัปโหลดรูปภาพอย่างน้อยหนึ่งรูป',
            errorUpload: 'ข้อผิดพลาดในการอัปโหลดรูปภาพ',
            errorCreate: 'ข้อผิดพลาดในการสร้างผลิตภัณฑ์'
        },
        'vi-VN': {
            basicInfo: 'Thông tin cơ bản',
            productName: 'Tên sản phẩm',
            productNamePlaceholder: 'ví dụ: Tour tham quan thành phố cả ngày',
            category: 'Danh mục',
            selectCategory: 'Chọn danh mục',
            categories: {
                tours: 'Tour & Hoạt động',
                transport: 'Vận chuyển',
                accommodation: 'Chỗ ở',
                tickets: 'Vé & Thẻ',
                packages: 'Gói nhiều ngày'
            },
            location: 'Địa điểm',
            city: 'Thành phố',
            countryCode: 'Mã quốc gia',
            pricingValidity: 'Giá & Hiệu lực',
            agentPrice: 'Giá đại lý (Ròng)',
            currency: 'Tiền tệ',
            validFrom: 'Có hiệu lực từ',
            validTo: 'Có hiệu lực đến',
            capacity: 'Sức chứa',
            minPax: 'Số khách tối thiểu',
            maxPax: 'Số khách tối đa',
            media: 'Phương tiện',
            dragDrop: 'Kéo & thả hình ảnh vào đây, hoặc nhấp để chọn',
            maxImages: '(Tối đa 5 hình ảnh, mỗi hình 5MB)',
            details: 'Chi tiết sản phẩm',
            description: 'Mô tả',
            descriptionPlaceholder: 'Mô tả chi tiết về sản phẩm...',
            inclusions: 'Bao gồm',
            addInclusion: 'Thêm mục bao gồm',
            exclusions: 'Không bao gồm',
            addExclusion: 'Thêm mục không bao gồm',
            policies: 'Chính sách',
            cancellationPolicy: 'Chính sách hủy',
            cancellationPlaceholder: 'ví dụ: Hủy miễn phí trước 24 giờ...',
            termsConditions: 'Điều khoản & Điều kiện',
            termsPlaceholder: 'ví dụ: Các điều khoản và điều kiện chung...',
            createProduct: 'Tạo sản phẩm',
            creating: 'Đang tạo...',
            errorMissingFields: 'Vui lòng điền vào tất cả các trường bắt buộc và tải lên ít nhất một hình ảnh.',
            errorUpload: 'Lỗi tải lên hình ảnh',
            errorCreate: 'Lỗi tạo sản phẩm'
        },
        'id-ID': {
            basicInfo: 'Informasi Dasar',
            productName: 'Nama Produk',
            productNamePlaceholder: 'mis., Tur Kota Sehari Penuh',
            category: 'Kategori',
            selectCategory: 'Pilih kategori',
            categories: {
                tours: 'Tur & Aktivitas',
                transport: 'Transportasi',
                accommodation: 'Akomodasi',
                tickets: 'Tiket & Pas',
                packages: 'Paket Multi-hari'
            },
            location: 'Lokasi',
            city: 'Kota',
            countryCode: 'Kode Negara',
            pricingValidity: 'Harga & Validitas',
            agentPrice: 'Harga Agen (Bersih)',
            currency: 'Mata Uang',
            validFrom: 'Berlaku Dari',
            validTo: 'Berlaku Hingga',
            capacity: 'Kapasitas',
            minPax: 'Min Pax',
            maxPax: 'Max Pax',
            media: 'Media',
            dragDrop: 'Seret & lepas gambar di sini, atau klik untuk memilih',
            maxImages: '(Maks 5 gambar, masing-masing 5MB)',
            details: 'Detail Produk',
            description: 'Deskripsi',
            descriptionPlaceholder: 'Deskripsi rinci produk...',
            inclusions: 'Termasuk',
            addInclusion: 'Tambah Item Termasuk',
            exclusions: 'Tidak Termasuk',
            addExclusion: 'Tambah Item Tidak Termasuk',
            policies: 'Kebijakan',
            cancellationPolicy: 'Kebijakan Pembatalan',
            cancellationPlaceholder: 'mis., Pembatalan gratis hingga 24 jam sebelum...',
            termsConditions: 'Syarat & Ketentuan',
            termsPlaceholder: 'mis., Syarat dan ketentuan umum...',
            createProduct: 'Buat Produk',
            creating: 'Membuat...',
            errorMissingFields: 'Harap isi semua bidang yang wajib diisi dan unggah setidaknya satu gambar.',
            errorUpload: 'Kesalahan mengunggah gambar',
            errorCreate: 'Kesalahan membuat produk'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (files.length + acceptedFiles.length > 5) {
            alert('Max 5 images allowed')
            return
        }
        const newFiles = [...files, ...acceptedFiles]
        setFiles(newFiles)

        // Create previews
        const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file))
        setPreviews(prev => [...prev, ...newPreviews])
    }, [files])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxSize: 5242880 // 5MB
    })

    const removeFile = (index: number) => {
        const newFiles = [...files]
        newFiles.splice(index, 1)
        setFiles(newFiles)

        const newPreviews = [...previews]
        URL.revokeObjectURL(newPreviews[index])
        newPreviews.splice(index, 1)
        setPreviews(newPreviews)
    }

    const handleArrayChange = (field: 'inclusions' | 'exclusions', index: number, value: string) => {
        const newArray = [...formData[field]]
        newArray[index] = value
        setFormData({ ...formData, [field]: newArray })
    }

    const addArrayItem = (field: 'inclusions' | 'exclusions') => {
        setFormData({ ...formData, [field]: [...formData[field], ''] })
    }

    const removeArrayItem = (field: 'inclusions' | 'exclusions', index: number) => {
        const newArray = [...formData[field]]
        newArray.splice(index, 1)
        setFormData({ ...formData, [field]: newArray })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Basic validation
        if (!formData.product_name || !formData.agent_price || files.length === 0) {
            alert(content.errorMissingFields)
            setLoading(false)
            return
        }

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // Upload images
            const imageUrls: string[] = []
            for (const file of files) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${user.id}/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath)

                imageUrls.push(publicUrl)
            }

            // Create product record
            const { error: insertError } = await supabase
                .from('products')
                .insert({
                    supplier_id: user.id,
                    product_name: formData.product_name,
                    product_description: formData.product_description,
                    product_category: formData.product_category,
                    city: formData.city,
                    country_code: formData.country_code,
                    validity_start_date: formData.validity_start_date,
                    validity_end_date: formData.validity_end_date,
                    agent_price: parseFloat(formData.agent_price),
                    currency: formData.currency,
                    min_pax: formData.min_pax,
                    max_pax: formData.max_pax,
                    cancellation_policy: formData.cancellation_policy,
                    inclusions: formData.inclusions.filter(i => i),
                    exclusions: formData.exclusions.filter(e => e),
                    terms_conditions: formData.terms_conditions,
                    photo_url_1: imageUrls[0] || null,
                    photo_url_2: imageUrls[1] || null,
                    photo_url_3: imageUrls[2] || null,
                    status: 'active'
                })

            if (insertError) throw insertError

            onSuccess()
        } catch (error) {
            console.error('Error:', error)
            alert(content.errorCreate)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Card */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <h3 className="text-lg font-medium text-foreground mb-4">{content.basicInfo}</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                        <label className="block text-sm font-medium text-foreground">{content.productName}</label>
                        <div className="mt-1">
                            <input
                                type="text"
                                required
                                value={formData.product_name}
                                onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                                placeholder={content.productNamePlaceholder}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-foreground">{content.category}</label>
                        <div className="mt-1">
                            <select
                                value={formData.product_category}
                                onChange={e => setFormData({ ...formData, product_category: e.target.value })}
                                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                            >
                                <option value="">{content.selectCategory}</option>
                                <option value="Tours & Activities">{content.categories.tours}</option>
                                <option value="Transportation">{content.categories.transport}</option>
                                <option value="Accommodation">{content.categories.accommodation}</option>
                                <option value="Tickets & Passes">{content.categories.tickets}</option>
                                <option value="Multi-day Packages">{content.categories.packages}</option>
                            </select>
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-foreground">{content.city}</label>
                        <div className="mt-1">
                            <input
                                type="text"
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-foreground">{content.countryCode}</label>
                        <div className="mt-1">
                            <input
                                type="text"
                                maxLength={2}
                                value={formData.country_code}
                                onChange={e => setFormData({ ...formData, country_code: e.target.value.toUpperCase() })}
                                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                                placeholder="MY"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing & Validity Card */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <h3 className="text-lg font-medium text-foreground mb-4">{content.pricingValidity}</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-foreground">{content.agentPrice}</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.agent_price}
                                onChange={e => setFormData({ ...formData, agent_price: e.target.value })}
                                className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-1">
                        <label className="block text-sm font-medium text-foreground">{content.currency}</label>
                        <div className="mt-1">
                            <select
                                value={formData.currency}
                                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                            >
                                <option>USD</option>
                                <option>MYR</option>
                                <option>SGD</option>
                                <option>EUR</option>
                            </select>
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground">{content.validFrom}</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.validity_start_date}
                                    onChange={e => setFormData({ ...formData, validity_start_date: e.target.value })}
                                    className="mt-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground">{content.validTo}</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.validity_end_date}
                                    onChange={e => setFormData({ ...formData, validity_end_date: e.target.value })}
                                    className="mt-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <h4 className="text-sm font-medium text-foreground mb-2">{content.capacity}</h4>
                        <div className="grid grid-cols-2 gap-4 sm:w-1/2">
                            <div>
                                <label className="block text-xs text-muted-foreground">{content.minPax}</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.min_pax}
                                    onChange={e => setFormData({ ...formData, min_pax: parseInt(e.target.value) })}
                                    className="mt-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground">{content.maxPax}</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.max_pax}
                                    onChange={e => setFormData({ ...formData, max_pax: parseInt(e.target.value) })}
                                    className="mt-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Upload Card */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <h3 className="text-lg font-medium text-foreground mb-4">{content.media}</h3>
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                >
                    <input {...getInputProps()} />
                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-foreground font-medium">{content.dragDrop}</p>
                    <p className="text-xs text-muted-foreground">{content.maxImages}</p>
                </div>

                {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {previews.map((url, index) => (
                            <div key={index} className="relative group aspect-square">
                                <img src={url} alt="Preview" className="w-full h-full object-cover rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Details Card */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <h3 className="text-lg font-medium text-foreground mb-4">{content.details}</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground">{content.description}</label>
                        <div className="mt-1">
                            <textarea
                                rows={4}
                                value={formData.product_description}
                                onChange={e => setFormData({ ...formData, product_description: e.target.value })}
                                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                                placeholder={content.descriptionPlaceholder}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">{content.inclusions}</label>
                            {formData.inclusions.map((item, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={e => handleArrayChange('inclusions', index, e.target.value)}
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('inclusions', index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('inclusions')}
                                className="text-sm text-primary hover:text-primary/80 flex items-center"
                            >
                                <FaPlus className="mr-1" /> {content.addInclusion}
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">{content.exclusions}</label>
                            {formData.exclusions.map((item, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={e => handleArrayChange('exclusions', index, e.target.value)}
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('exclusions', index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('exclusions')}
                                className="text-sm text-primary hover:text-primary/80 flex items-center"
                            >
                                <FaPlus className="mr-1" /> {content.addExclusion}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Policies Card */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <h3 className="text-lg font-medium text-foreground mb-4">{content.policies}</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground">{content.cancellationPolicy}</label>
                        <div className="mt-1">
                            <textarea
                                rows={3}
                                value={formData.cancellation_policy}
                                onChange={e => setFormData({ ...formData, cancellation_policy: e.target.value })}
                                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                                placeholder={content.cancellationPlaceholder}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground">{content.termsConditions}</label>
                        <div className="mt-1">
                            <textarea
                                rows={3}
                                value={formData.terms_conditions}
                                onChange={e => setFormData({ ...formData, terms_conditions: e.target.value })}
                                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground"
                                placeholder={content.termsPlaceholder}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                    {loading ? content.creating : content.createProduct}
                </button>
            </div>
        </form>
    )
}
