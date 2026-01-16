'use client'

import { useState, useCallback, useEffect } from 'react'
import { FaCloudUploadAlt, FaTimes, FaHotel, FaMapMarkerAlt, FaTag, FaBuilding, FaDownload } from 'react-icons/fa'
import ImageUploader from './FormElements/ImageUploader'
import { createClient } from '@/utils/supabase/client'
import { useLanguage } from '@/context/LanguageContext'

interface ProductFormProps {
    onSuccess: () => void
    productId?: string
    mode?: 'create' | 'edit'
}

export default function ProductForm({ onSuccess, productId, mode = 'create' }: ProductFormProps) {
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const supabase = createClient()
    const { language } = useLanguage()

    // Supplier Details
    const [supplierCountry, setSupplierCountry] = useState('')
    const [supplierCity, setSupplierCity] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [supplierType, setSupplierType] = useState('')

    const [formData, setFormData] = useState({
        product_name: '',
        product_description: '',
        product_category: '',
        hotel_address: '',
        hotel_stars: '5',
        city: '',
        photo_url_1: '',
        description: '',
        product_url: '',
        status: 'draft'
    })

    useEffect(() => {
        const fetchSupplierProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('suppliers')
                    .select('country_code, city, company_name, supplier_type, website_url')
                    .eq('id', user.id)
                    .single()

                if (data) {
                    setSupplierCountry(data.country_code)
                    setSupplierCity(data.city)
                    setCompanyName(data.company_name)
                    setSupplierType(data.supplier_type)

                    // Use supplier_type directly as product_category
                    setFormData(prev => ({
                        ...prev,
                        product_category: data.supplier_type,
                        product_url: data.website_url || ''
                    }))
                }
            }
        }
        fetchSupplierProfile()
    }, [supabase])

    // Load existing product data if editing
    useEffect(() => {
        const loadProductData = async () => {
            if (mode === 'edit' && productId) {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data: product, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', productId)
                    .eq('supplier_id', user.id) // Enforce ownership
                    .single()

                if (error || !product) {
                    console.error('Error loading product:', error)
                    alert('Product not found or access denied')
                    onSuccess() // Redirect back
                    return
                }

                if (product) {
                    setFormData({
                        product_name: product.product_name || '',
                        product_description: product.product_description || '',
                        product_category: product.product_category || '',
                        hotel_address: product.address || product.hotel_address || '',
                        hotel_stars: product.star_rating ? String(product.star_rating) : (product.hotel_stars || '5'),
                        city: product.city || '',
                        photo_url_1: '',
                        description: '',
                        product_url: product.product_url || '',
                        status: product.status || 'draft'
                    })

                    // Load existing images as previews
                    if (product.photo_urls && product.photo_urls.length > 0) {
                        setPreviews(product.photo_urls)
                    }
                }
            }
        }
        loadProductData()
    }, [mode, productId, supabase, onSuccess])

    const t = {
        'en-US': {
            hotelDetails: 'Hotel Details',
            hotelName: 'Hotel Name',
            hotelAddress: 'Address',
            hotelStars: 'Star Rating',
            productDescription: 'Product Description',
            descriptionPlaceholder: 'Describe your product...',
            media: 'Media',
            dragDrop: 'Drag & drop images here, or click to select',
            maxImages: '(Max 5 images, 5MB each)',
            createProduct: 'Create Product',
            updateProduct: 'Update Product',
            creating: 'Creating...',
            errorMissingFields: 'Please fill in all required fields and upload at least one image.',
            errorUpload: 'Error uploading images',
            errorCreate: 'Error creating product',
            yourCompany: 'Your Company',
            category: 'Category',
            location: 'Location',
            city: 'City',
            uploadImage: 'Upload Image',
            createWinningProduct: 'Create Your Winning Product Now',
            placeholderHotelName: 'e.g. Grand Hyatt Kuala Lumpur',
            placeholderAddress: 'Full street address',
            remove: 'Remove',
            download: 'Download',
            productCity: 'City (Product Location)',
            productAddress: 'Address (Product Location)',
            // Supplier Types
            hotel: 'Hotel',
            airline: 'Airline',
            transportation: 'Transportation',
            tourOperator: 'Tour Operator',
            travelAgent: 'Travel Agent',
            other: 'Other'
        },
        'zh-CN': {
            hotelDetails: '酒店详情',
            hotelName: '酒店名称',
            hotelAddress: '地址',
            hotelStars: '星级',
            productDescription: '产品描述',
            descriptionPlaceholder: '描述您的产品...',
            media: '媒体',
            dragDrop: '拖放图片到此处，或点击选择',
            maxImages: '（最多 5 张图片，每张 5MB）',
            createProduct: '创建产品',
            updateProduct: '更新产品',
            creating: '创建中...',
            errorMissingFields: '请填写所有必填字段并上传至少一张图片。',
            errorUpload: '上传图片时出错',
            errorCreate: '创建产品时出错',
            yourCompany: '您的公司',
            category: '类别',
            location: '位置',
            city: '城市',
            uploadImage: '上传图片',
            createWinningProduct: '立即创建您的致胜产品',
            placeholderHotelName: '例如：吉隆坡君悦酒店',
            placeholderAddress: '完整街道地址',
            remove: '移除',
            download: '下载',
            productCity: '城市 (产品位置)',
            productAddress: '地址 (产品位置)',
            // Supplier Types
            hotel: '酒店',
            airline: '航空公司',
            transportation: '交通运输',
            tourOperator: '旅游运营商',
            travelAgent: '旅行社',
            other: '其他'
        },
        'ms-MY': {
            hotelDetails: 'Butiran Hotel',
            hotelName: 'Nama Hotel',
            hotelAddress: 'Alamat',
            hotelStars: 'Penarafan Bintang',
            productDescription: 'Penerangan Produk',
            descriptionPlaceholder: 'Terangkan produk anda...',
            media: 'Media',
            dragDrop: 'Seret & lepas imej di sini, atau klik untuk memilih',
            maxImages: '(Maks 5 imej, 5MB setiap satu)',
            createProduct: 'Cipta Produk',
            updateProduct: 'Kemas Kini Produk',
            creating: 'Mencipta...',
            errorMissingFields: 'Sila isi semua medan yang diperlukan dan muat naik sekurang-kurangnya satu imej.',
            errorUpload: 'Ralat memuat naik imej',
            errorCreate: 'Ralat mencipta produk',
            yourCompany: 'Syarikat Anda',
            category: 'Kategori',
            location: 'Lokasi',
            city: 'Bandar',
            uploadImage: 'Muat Naik Imej',
            createWinningProduct: 'Cipta Produk Menang Anda Sekarang',
            placeholderHotelName: 'cth. Grand Hyatt Kuala Lumpur',
            placeholderAddress: 'Alamat penuh',
            remove: 'Buang',
            download: 'Muat Turun',
            productCity: 'Bandar (Lokasi Produk)',
            productAddress: 'Alamat (Lokasi Produk)',
            // Supplier Types
            hotel: 'Hotel',
            airline: 'Syarikat Penerbangan',
            transportation: 'Pengangkutan',
            tourOperator: 'Pengendali Pelancongan',
            travelAgent: 'Ejen Pelancongan',
            other: 'Lain-lain'
        },
        'es-ES': {
            hotelDetails: 'Detalles del Hotel',
            hotelName: 'Nombre del Hotel',
            hotelAddress: 'Dirección',
            hotelStars: 'Clasificación de Estrellas',
            productDescription: 'Descripción del Producto',
            descriptionPlaceholder: 'Describa su producto...',
            media: 'Medios',
            dragDrop: 'Arrastre y suelte imágenes aquí, o haga clic para seleccionar',
            maxImages: '(Máx 5 imágenes, 5MB cada una)',
            createProduct: 'Crear Producto',
            updateProduct: 'Actualizar Producto',
            creating: 'Creando...',
            errorMissingFields: 'Por favor complete todos los campos requeridos y suba al menos una imagen.',
            errorUpload: 'Error al subir imágenes',
            errorCreate: 'Error al crear el producto',
            yourCompany: 'Su Empresa',
            category: 'Categoría',
            location: 'Ubicación',
            city: 'Ciudad',
            uploadImage: 'Subir Imagen',
            createWinningProduct: 'Cree Su Producto Ganador Ahora',
            placeholderHotelName: 'ej. Grand Hyatt Kuala Lumpur',
            placeholderAddress: 'Dirección completa',
            remove: 'Eliminar',
            download: 'Descargar',
            productCity: 'Ciudad (Ubicación del Producto)',
            productAddress: 'Dirección (Ubicación del Producto)',
            // Supplier Types
            hotel: 'Hotel',
            airline: 'Aerolínea',
            transportation: 'Transporte',
            tourOperator: 'Operador Turístico',
            travelAgent: 'Agencia de Viajes',
            other: 'Otro'
        },
        'fr-FR': {
            hotelDetails: 'Détails de l\'Hôtel',
            hotelName: 'Nom de l\'Hôtel',
            hotelAddress: 'Adresse',
            hotelStars: 'Classement par Étoiles',
            productDescription: 'Description du Produit',
            descriptionPlaceholder: 'Décrivez votre produit...',
            media: 'Médias',
            dragDrop: 'Glissez-déposez des images ici, ou cliquez pour sélectionner',
            maxImages: '(Max 5 images, 5 Mo chacune)',
            createProduct: 'Créer un Produit',
            updateProduct: 'Mettre à Jour le Produit',
            creating: 'Création...',
            errorMissingFields: 'Veuillez remplir tous les champs obligatoires et télécharger au moins une image.',
            errorUpload: 'Erreur lors du téléchargement des images',
            errorCreate: 'Erreur lors de la création du produit',
            yourCompany: 'Votre Entreprise',
            category: 'Catégorie',
            location: 'Emplacement',
            city: 'Ville',
            uploadImage: 'Télécharger une Image',
            createWinningProduct: 'Créez Votre Produit Gagnant Maintenant',
            placeholderHotelName: 'ex. Grand Hyatt Kuala Lumpur',
            placeholderAddress: 'Adresse complète',
            remove: 'Supprimer',
            download: 'Télécharger',
            productCity: 'Ville (Emplacement du Produit)',
            productAddress: 'Adresse (Emplacement du Produit)',
            // Supplier Types
            hotel: 'Hôtel',
            airline: 'Compagnie Aérienne',
            transportation: 'Transport',
            tourOperator: 'Tour Opérateur',
            travelAgent: 'Agence de Voyage',
            other: 'Autre'
        },
        'de-DE': {
            hotelDetails: 'Hoteldetails',
            hotelName: 'Hotelname',
            hotelAddress: 'Adresse',
            hotelStars: 'Sternebewertung',
            productDescription: 'Produktbeschreibung',
            descriptionPlaceholder: 'Beschreiben Sie Ihr Produkt...',
            media: 'Medien',
            dragDrop: 'Bilder hierher ziehen oder klicken zum Auswählen',
            maxImages: '(Max. 5 Bilder, je 5 MB)',
            createProduct: 'Produkt Erstellen',
            updateProduct: 'Produkt Aktualisieren',
            creating: 'Erstellen...',
            errorMissingFields: 'Bitte füllen Sie alle Pflichtfelder aus und laden Sie mindestens ein Bild hoch.',
            errorUpload: 'Fehler beim Hochladen der Bilder',
            errorCreate: 'Fehler beim Erstellen des Produkts',
            yourCompany: 'Ihr Unternehmen',
            category: 'Kategorie',
            location: 'Standort',
            city: 'Stadt',
            uploadImage: 'Bild Hochladen',
            createWinningProduct: 'Erstellen Sie Jetzt Ihr Gewinnerprodukt',
            placeholderHotelName: 'z.B. Grand Hyatt Kuala Lumpur',
            placeholderAddress: 'Vollständige Adresse',
            remove: 'Entfernen',
            download: 'Herunterladen',
            productCity: 'Stadt (Produktstandort)',
            productAddress: 'Adresse (Produktstandort)',
            // Supplier Types
            hotel: 'Hotel',
            airline: 'Fluggesellschaft',
            transportation: 'Transport',
            tourOperator: 'Reiseveranstalter',
            travelAgent: 'Reisebüro',
            other: 'Andere'
        },
        'ja-JP': {
            hotelDetails: 'ホテルの詳細',
            hotelName: 'ホテル名',
            hotelAddress: '住所',
            hotelStars: '星評価',
            productDescription: '製品説明',
            descriptionPlaceholder: '製品について説明してください...',
            media: 'メディア',
            dragDrop: '画像をここにドラッグ＆ドロップ、またはクリックして選択',
            maxImages: '（最大5枚、各5MB）',
            createProduct: '製品を作成',
            updateProduct: '製品を更新',
            creating: '作成中...',
            errorMissingFields: 'すべての必須フィールドに入力し、少なくとも1つの画像をアップロードしてください。',
            errorUpload: '画像のアップロードエラー',
            errorCreate: '製品作成エラー',
            yourCompany: 'あなたの会社',
            category: 'カテゴリー',
            location: '場所',
            city: '都市',
            uploadImage: '画像をアップロード',
            createWinningProduct: '今すぐ勝てる製品を作成',
            placeholderHotelName: '例：グランドハイアットクアラルンプール',
            placeholderAddress: '完全な住所',
            remove: '削除',
            download: 'ダウンロード',
            productCity: '都市 (製品の場所)',
            productAddress: '住所 (製品の場所)',
            // Supplier Types
            hotel: 'ホテル',
            airline: '航空会社',
            transportation: '交通機関',
            tourOperator: 'ツアーオペレーター',
            travelAgent: '旅行代理店',
            other: 'その他'
        },
        'ko-KR': {
            hotelDetails: '호텔 세부 정보',
            hotelName: '호텔 이름',
            hotelAddress: '주소',
            hotelStars: '별점',
            productDescription: '제품 설명',
            descriptionPlaceholder: '제품을 설명하세요...',
            media: '미디어',
            dragDrop: '이미지를 여기로 드래그 앤 드롭하거나 클릭하여 선택하세요',
            maxImages: '(최대 5장, 각 5MB)',
            createProduct: '제품 생성',
            updateProduct: '제품 업데이트',
            creating: '생성 중...',
            errorMissingFields: '모든 필수 입력란을 작성하고 최소 하나의 이미지를 업로드하세요.',
            errorUpload: '이미지 업로드 오류',
            errorCreate: '제품 생성 오류',
            yourCompany: '귀하의 회사',
            category: '카테고리',
            location: '위치',
            city: '도시',
            uploadImage: '이미지 업로드',
            createWinningProduct: '지금 성공적인 제품을 만드세요',
            placeholderHotelName: '예: 그랜드 하얏트 쿠알라룸푸르',
            placeholderAddress: '전체 주소',
            remove: '제거',
            download: '다운로드',
            productCity: '도시 (제품 위치)',
            productAddress: '주소 (제품 위치)',
            // Supplier Types
            hotel: '호텔',
            airline: '항공사',
            transportation: '교통',
            tourOperator: '투어 운영자',
            travelAgent: '여행사',
            other: '기타'
        },
        'ar-SA': {
            hotelDetails: 'تفاصيل الفندق',
            hotelName: 'اسم الفندق',
            hotelAddress: 'العنوان',
            hotelStars: 'تصنيف النجوم',
            productDescription: 'وصف المنتج',
            descriptionPlaceholder: 'صف منتجك...',
            media: 'الوسائط',
            dragDrop: 'اسحب وأفلت الصور هنا، أو انقر للتحديد',
            maxImages: '(الحد الأقصى 5 صور، 5 ميجابايت لكل منها)',
            createProduct: 'إنشاء منتج',
            updateProduct: 'تحديث المنتج',
            creating: 'جاري الإنشاء...',
            errorMissingFields: 'يرجى ملء جميع الحقول المطلوبة وتحميل صورة واحدة على الأقل.',
            errorUpload: 'خطأ في تحميل الصور',
            errorCreate: 'خطأ في إنشاء المنتج',
            yourCompany: 'شركتك',
            category: 'الفئة',
            location: 'الموقع',
            city: 'المدينة',
            uploadImage: 'تحميل صورة',
            createWinningProduct: 'أنشئ منتجك الرابح الآن',
            placeholderHotelName: 'مثال: جراند حياة كوالالمبور',
            placeholderAddress: 'العنوان الكامل',
            remove: 'إزالة',
            download: 'تحميل',
            productCity: 'المدينة (موقع المنتج)',
            productAddress: 'العنوان (موقع المنتج)',
            // Supplier Types
            hotel: 'فندق',
            airline: 'شركة طيران',
            transportation: 'نقل',
            tourOperator: 'منظم رحلات',
            travelAgent: 'وكيل سفر',
            other: 'آخر'
        },
        'th-TH': {
            hotelDetails: 'รายละเอียดโรงแรม',
            hotelName: 'ชื่อโรงแรม',
            hotelAddress: 'ที่อยู่',
            hotelStars: 'ระดับดาว',
            productDescription: 'รายละเอียดสินค้า',
            descriptionPlaceholder: 'อธิบายสินค้าของคุณ...',
            media: 'สื่อ',
            dragDrop: 'ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือก',
            maxImages: '(สูงสุด 5 รูป, รูปละ 5MB)',
            createProduct: 'สร้างสินค้า',
            updateProduct: 'อัปเดตสินค้า',
            creating: 'กำลังสร้าง...',
            errorMissingFields: 'กรุณากรอกข้อมูลที่จำเป็นทั้งหมดและอัปโหลดรูปภาพอย่างน้อยหนึ่งรูป',
            errorUpload: 'ข้อผิดพลาดในการอัปโหลดรูปภาพ',
            errorCreate: 'ข้อผิดพลาดในการสร้างสินค้า',
            yourCompany: 'บริษัทของคุณ',
            category: 'หมวดหมู่',
            location: 'สถานที่ตั้ง',
            city: 'เมือง',
            uploadImage: 'อัปโหลดรูปภาพ',
            createWinningProduct: 'สร้างสินค้าที่ชนะใจลูกค้าของคุณตอนนี้',
            placeholderHotelName: 'เช่น แกรนด์ ไฮแอท กัวลาลัมเปอร์',
            placeholderAddress: 'ที่อยู่เต็ม',
            remove: 'ลบ',
            download: 'ดาวน์โหลด',
            productCity: 'เมือง (ที่ตั้งสินค้า)',
            productAddress: 'ที่อยู่ (ที่ตั้งสินค้า)',
            // Supplier Types
            hotel: 'โรงแรม',
            airline: 'สายการบิน',
            transportation: 'การขนส่ง',
            tourOperator: 'ผู้ประกอบการท่องเที่ยว',
            travelAgent: 'ตัวแทนท่องเที่ยว',
            other: 'อื่นๆ'
        },
        'vi-VN': {
            hotelDetails: 'Chi tiết Khách sạn',
            hotelName: 'Tên Khách sạn',
            hotelAddress: 'Địa chỉ',
            hotelStars: 'Xếp hạng Sao',
            productDescription: 'Mô tả Sản phẩm',
            descriptionPlaceholder: 'Mô tả sản phẩm của bạn...',
            media: 'Phương tiện',
            dragDrop: 'Kéo và thả hình ảnh vào đây, hoặc nhấp để chọn',
            maxImages: '(Tối đa 5 hình ảnh, mỗi hình 5MB)',
            createProduct: 'Tạo Sản phẩm',
            updateProduct: 'Cập nhật Sản phẩm',
            creating: 'Đang tạo...',
            errorMissingFields: 'Vui lòng điền vào tất cả các trường bắt buộc và tải lên ít nhất một hình ảnh.',
            errorUpload: 'Lỗi tải lên hình ảnh',
            errorCreate: 'Lỗi tạo sản phẩm',
            yourCompany: 'Công ty của Bạn',
            category: 'Danh mục',
            location: 'Vị trí',
            city: 'Thành phố',
            uploadImage: 'Tải lên Hình ảnh',
            createWinningProduct: 'Tạo Sản phẩm Chiến thắng của Bạn Ngay',
            placeholderHotelName: 'vd: Grand Hyatt Kuala Lumpur',
            placeholderAddress: 'Địa chỉ đầy đủ',
            remove: 'Xóa',
            download: 'Tải xuống',
            productCity: 'Thành phố (Vị trí Sản phẩm)',
            productAddress: 'Địa chỉ (Vị trí Sản phẩm)',
            // Supplier Types
            hotel: 'Khách sạn',
            airline: 'Hãng hàng không',
            transportation: 'Vận tải',
            tourOperator: 'Nhà điều hành tour',
            travelAgent: 'Đại lý du lịch',
            other: 'Khác'
        },
        'id-ID': {
            hotelDetails: 'Detail Hotel',
            hotelName: 'Nama Hotel',
            hotelAddress: 'Alamat',
            hotelStars: 'Peringkat Bintang',
            productDescription: 'Deskripsi Produk',
            descriptionPlaceholder: 'Jelaskan produk Anda...',
            media: 'Media',
            dragDrop: 'Seret & lepas gambar di sini, atau klik untuk memilih',
            maxImages: '(Maks 5 gambar, masing-masing 5MB)',
            createProduct: 'Buat Produk',
            updateProduct: 'Perbarui Produk',
            creating: 'Sedang membuat...',
            errorMissingFields: 'Harap isi semua bidang yang wajib diisi dan unggah setidaknya satu gambar.',
            errorUpload: 'Kesalahan mengunggah gambar',
            errorCreate: 'Kesalahan membuat produk',
            yourCompany: 'Perusahaan Anda',
            category: 'Kategori',
            location: 'Lokasi',
            city: 'Kota',
            uploadImage: 'Unggah Gambar',
            createWinningProduct: 'Buat Produk Pemenang Anda Sekarang',
            placeholderHotelName: 'cth. Grand Hyatt Kuala Lumpur',
            placeholderAddress: 'Alamat lengkap',
            remove: 'Hapus',
            download: 'Unduh',
            productCity: 'Kota (Lokasi Produk)',
            productAddress: 'Alamat (Lokasi Produk)',
            // Supplier Types
            hotel: 'Hotel',
            airline: 'Maskapai Penerbangan',
            transportation: 'Transportasi',
            tourOperator: 'Operator Tur',
            travelAgent: 'Agen Perjalanan',
            other: 'Lainnya'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    const getCountryName = (code: string, locale: string) => {
        if (!code) return ''
        try {
            const regionNames = new Intl.DisplayNames([locale], { type: 'region' });
            return regionNames.of(code);
        } catch (e) {
            return code;
        }
    }

    const getTranslatedSupplierType = (type: string) => {
        if (!type) return content.category
        const normalizedType = type.toLowerCase()
        if (normalizedType.includes('hotel')) return content.hotel
        if (normalizedType.includes('airline')) return content.airline
        if (normalizedType.includes('transport')) return content.transportation
        if (normalizedType.includes('tour')) return content.tourOperator
        if (normalizedType.includes('agent')) return content.travelAgent
        return type // Fallback to original if no match
    }



    const isHotel = formData.product_category?.toLowerCase().includes('hotel')
    const isTransport = formData.product_category?.toLowerCase().includes('transport') || formData.product_category?.toLowerCase().includes('airline')

    const getFlagUrl = (countryCode: string) => {
        if (!countryCode) return ''
        return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Validation
        const isHotel = formData.product_category?.toLowerCase().includes('hotel')

        if (!formData.product_name || !formData.product_description || !formData.product_category || previews.length === 0) {
            alert(content.errorMissingFields)
            setLoading(false)
            return
        }

        if (isHotel && !formData.city) {
            alert('City is required for hotels.')
            setLoading(false)
            return
        }

        try {
            console.log('Starting submission...')
            const { data: { user }, error: authError } = await supabase.auth.getUser()
            if (authError || !user) {
                console.error('Auth Error:', authError)
                throw new Error('Not authenticated')
            }

            // Upload images
            const imageUrls: string[] = []
            for (const file of files) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${user.id}/${fileName}`

                console.log('Uploading file:', filePath)
                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file)

                if (uploadError) {
                    console.error('Upload Error:', uploadError)
                    throw new Error(`Upload failed: ${uploadError.message}`)
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath)

                imageUrls.push(publicUrl)
            }

            // Construct description
            let finalDescription = formData.product_description

            const productData = {
                product_name: formData.product_name,
                product_description: finalDescription,
                product_category: formData.product_category,
                photo_urls: imageUrls.length > 0 ? imageUrls : previews,
                status: 'active',
                city: formData.city || supplierCity,
                country_code: supplierCountry,
                star_rating: isHotel ? parseInt(formData.hotel_stars) : null,
                address: isHotel ? formData.hotel_address : null,
                product_url: formData.product_url
            }

            console.log('Submitting product data:', productData)

            // Create or Update product record
            if (mode === 'edit' && productId) {
                // UPDATE existing product
                const { error: updateError } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', productId)

                if (updateError) {
                    console.error('Update Error:', updateError)
                    throw new Error(`Update failed: ${updateError.message}`)
                }
            } else {
                // INSERT new product
                const { error: insertError } = await supabase
                    .from('products')
                    .insert({
                        ...productData,
                        supplier_id: user.id
                    })

                if (insertError) {
                    console.error('Insert Error:', insertError)
                    throw new Error(`Insert failed: ${insertError.message}`)
                }
            }

            console.log('Submission successful')
            onSuccess()
        } catch (error: any) {
            console.error('Error submitting product (Full Details):', error)
            // Try to log specific Supabase error properties if they exist
            if (error?.details) console.error('Error Details:', error.details)
            if (error?.hint) console.error('Error Hint:', error.hint)
            if (error?.message) console.error('Error Message:', error.message)

            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            alert(content.errorCreate + (errorMessage ? `: ${errorMessage}` : ''))
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8" >
            {/* Context Header - Vibrant Gradient */}
            < div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-8 shadow-xl border border-white/10" >
                <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 translate-y-[-50%] rounded-full bg-white/10 blur-3xl"></div>
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <FaBuilding className="text-yellow-300" />
                            </div>
                            {companyName || content.yourCompany}
                        </h2>
                        <div className="flex flex-wrap items-center gap-6 mt-4 text-white">
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <FaTag className="text-cyan-300" />
                                <span className="font-medium">{getTranslatedSupplierType(supplierType)}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                {supplierCountry && (
                                    <img
                                        src={getFlagUrl(supplierCountry)}
                                        alt={supplierCountry}
                                        className="w-6 h-4 object-cover rounded-sm"
                                    />
                                )}
                                <FaMapMarkerAlt className="text-pink-300" />
                                <span>
                                    {supplierCity ? `${supplierCity}, ` : ''}
                                    {getCountryName(supplierCountry, language) || content.location}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* Hotel Specific Fields */}
            {
                isHotel && (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-8 shadow-xl border border-white/10 space-y-6">
                        <div className="absolute left-0 bottom-0 h-64 w-64 translate-x-[-50%] translate-y-[50%] rounded-full bg-white/5 blur-3xl"></div>
                        <div className="relative">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <FaHotel className="text-yellow-300" />
                                </div>
                                {content.hotelDetails}
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium !text-white mb-2">{content.hotelName}</label>
                                    <input
                                        type="text"
                                        value={formData.product_name}
                                        onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                                        className="block w-full rounded-xl border-white/20 bg-white/10 p-4 text-white placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium !text-white mb-2">{content.productCity}</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        className="block w-full rounded-xl border-white/20 bg-white/10 p-4 text-white placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                                        placeholder={content.city}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium !text-white mb-2">Product URL</label>
                                    <input
                                        type="url"
                                        value={formData.product_url}
                                        onChange={e => setFormData({ ...formData, product_url: e.target.value })}
                                        className="block w-full rounded-xl border-white/20 bg-white/10 p-4 text-white placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                                        placeholder="https://example.com/product"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium !text-white mb-2">{content.productAddress}</label>
                                    <input
                                        type="text"
                                        value={formData.hotel_address}
                                        onChange={e => setFormData({ ...formData, hotel_address: e.target.value })}
                                        className="block w-full rounded-xl border-white/20 bg-white/10 p-4 text-white placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                                        placeholder={content.placeholderAddress}
                                    />

                                </div>

                                <div>
                                    <label className="block text-sm font-medium !text-white mb-2">{content.hotelStars}</label>
                                    <select
                                        value={formData.hotel_stars}
                                        onChange={e => setFormData({ ...formData, hotel_stars: e.target.value })}
                                        className="block w-full rounded-xl border-white/20 bg-white/10 p-4 text-white focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all [&>option]:text-black"
                                    >
                                        <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                                        <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                                        <option value="3">⭐⭐⭐ 3 Stars</option>
                                        <option value="2">⭐⭐ 2 Stars</option>
                                        <option value="1">⭐ 1 Star</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium !text-white mb-2">{content.productDescription}</label>
                                    <textarea
                                        rows={4}
                                        value={formData.product_description}
                                        onChange={e => setFormData({ ...formData, product_description: e.target.value })}
                                        className="block w-full rounded-xl border-white/20 bg-white/10 p-4 text-white placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                                        placeholder={content.descriptionPlaceholder}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Product Description for Non-Hotel Products */}
            {
                !isHotel && (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-8 shadow-xl border border-white/10">
                        <div className="relative space-y-6">
                            <div>
                                <label className="block text-sm font-medium !text-white mb-2">Product Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.product_name}
                                    onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                                    className="block w-full rounded-xl border-white/20 bg-white/10 p-4 text-white placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                                    placeholder="e.g. Guided City Tour"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium !text-white mb-2">Product URL</label>
                                <input
                                    required
                                    type="url"
                                    value={formData.product_url}
                                    onChange={e => setFormData({ ...formData, product_url: e.target.value })}
                                    className="block w-full rounded-xl border-white/20 bg-white/10 p-4 text-white placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                                    placeholder="https://example.com/product"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-bold text-white mb-4">{content.productDescription}</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={formData.product_description}
                                    onChange={e => setFormData({ ...formData, product_description: e.target.value })}
                                    className="block w-full rounded-xl border-white/20 bg-white/10 p-4 text-white placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                                    placeholder={content.descriptionPlaceholder}
                                />
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Media Upload */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-8 shadow-xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                        <FaCloudUploadAlt className="text-cyan-300" />
                    </div>
                    {content.media}
                </h3>
                <ImageUploader
                    files={files}
                    previews={previews}
                    onFilesChange={setFiles}
                    onPreviewsChange={setPreviews}
                />
            </div>

            <div className="fixed bottom-8 right-8 z-50">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-blue-900 to-blue-400 text-white font-bold rounded-full shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 animate-heartbeat border-2 border-white/20"
                >
                    {loading ? content.creating : content.createWinningProduct}
                </button>
            </div>
        </form >
    )
}
