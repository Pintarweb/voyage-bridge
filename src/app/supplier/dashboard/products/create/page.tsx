'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProductForm from '@/components/supplier/product-form'
import HotelProductForm from '@/components/supplier/HotelProductForm'
import { FaArrowLeft } from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'
import { createClient } from '@/utils/supabase/client'

export default function CreateProductPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { language } = useLanguage()
    const [supplierType, setSupplierType] = useState<string | null>(null)
    const [supplier, setSupplier] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchSupplier = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('suppliers')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (data) {
                    setSupplierType(data.supplier_type)
                    setSupplier(data)
                }
            }
        }
        fetchSupplier()
    }, [supabase])

    const t = {
        'en-US': {
            back: 'Back to Dashboard',
            greeting: 'Create Your Next Product! 🚀',
            instruction: 'Add a new listing to showcase to travel agents worldwide.',
            title: 'Create New Product',
            subtitle: 'Fill in the details below to add a new product to your inventory.',
            loading: 'Loading...'
        },
        'zh-CN': {
            back: '返回仪表板',
            greeting: '创建您的下一个产品！🚀',
            instruction: '添加新列表以向全球旅行社展示。',
            title: '创建新产品',
            subtitle: '填写以下详细信息以将新产品添加到您的库存中。',
            loading: '加载中...'
        },
        'ms-MY': {
            back: 'Kembali ke Papan Pemuka',
            greeting: 'Cipta Produk Seterusnya Anda! 🚀',
            instruction: 'Tambah penyenaraian baharu untuk dipamerkan kepada ejen pelancongan di seluruh dunia.',
            title: 'Cipta Produk Baru',
            subtitle: 'Isi butiran di bawah untuk menambah produk baru ke inventori anda.',
            loading: 'Memuatkan...'
        },
        'es-ES': {
            back: 'Volver al Panel',
            greeting: '¡Crea Tu Próximo Producto! 🚀',
            instruction: 'Agrega un nuevo listado para mostrarlo a agentes de viajes de todo el mundo.',
            title: 'Crear Nuevo Producto',
            subtitle: 'Complete los detalles a continuación para agregar un nuevo producto a su inventario.',
            loading: 'Cargando...'
        },
        'fr-FR': {
            back: 'Retour au Tableau de Bord',
            greeting: 'Créez Votre Prochain Produit ! 🚀',
            instruction: 'Ajoutez une nouvelle annonce à présenter aux agents de voyages du monde entier.',
            title: 'Créer un Nouveau Produit',
            subtitle: 'Remplissez les détails ci-dessous pour ajouter un nouveau produit à votre inventaire.',
            loading: 'Chargement...'
        },
        'de-DE': {
            back: 'Zurück zum Dashboard',
            greeting: 'Erstellen Sie Ihr Nächstes Produkt! 🚀',
            instruction: 'Fügen Sie ein neues Angebot hinzu, um es Reisebüros weltweit zu präsentieren.',
            title: 'Neues Produkt Erstellen',
            subtitle: 'Füllen Sie die untenstehenden Details aus, um ein neues Produkt zu Ihrem Inventar hinzuzufügen.',
            loading: 'Laden...'
        },
        'ja-JP': {
            back: 'ダッシュボードに戻る',
            greeting: '次の製品を作成しましょう！🚀',
            instruction: '世界中の旅行代理店に見せるための新しいリスティングを追加します。',
            title: '新しい製品を作成',
            subtitle: '在庫に新しい製品を追加するには、以下の詳細を入力してください。',
            loading: '読み込み中...'
        },
        'ko-KR': {
            back: '대시보드로 돌아가기',
            greeting: '다음 제품을 만드세요! 🚀',
            instruction: '전 세계 여행사에 선보일 새 목록을 추가하세요.',
            title: '새 제품 생성',
            subtitle: '인벤토리에 새 제품을 추가하려면 아래 세부 정보를 입력하십시오.',
            loading: '로딩 중...'
        },
        'ar-SA': {
            back: 'العودة إلى لوحة القيادة',
            greeting: 'أنشئ منتجك التالي! 🚀',
            instruction: 'أضف قائمة جديدة لعرضها على وكلاء السفر في جميع أنحاء العالم.',
            title: 'إنشاء منتج جديد',
            subtitle: 'املأ التفاصيل أدناه لإضافة منتج جديد إلى مخزونك.',
            loading: 'جار التحميل...'
        },
        'th-TH': {
            back: 'กลับไปที่แดชบอร์ด',
            greeting: 'สร้างผลิตภัณฑ์ต่อไปของคุณ! 🚀',
            instruction: 'เพิ่มรายการใหม่เพื่อแสดงให้ตัวแทนท่องเที่ยวทั่วโลกเห็น',
            title: 'สร้างผลิตภัณฑ์ใหม่',
            subtitle: 'กรอกรายละเอียดด้านล่างเพื่อเพิ่มผลิตภัณฑ์ใหม่ลงในสินค้าคงคลังของคุณ',
            loading: 'กำลังโหลด...'
        },
        'vi-VN': {
            back: 'Quay lại Bảng điều khiển',
            greeting: 'Tạo Sản Phẩm Tiếp Theo Của Bạn! 🚀',
            instruction: 'Thêm danh sách mới để giới thiệu với các đại lý du lịch trên toàn thế giới.',
            title: 'Tạo sản phẩm mới',
            subtitle: 'Điền vào các chi tiết bên dưới để thêm sản phẩm mới vào kho của bạn.',
            loading: 'Đang tải...'
        },
        'id-ID': {
            back: 'Kembali ke Dasbor',
            greeting: 'Buat Produk Selanjutnya! 🚀',
            instruction: 'Tambahkan daftar baru untuk ditampilkan kepada agen perjalanan di seluruh dunia.',
            title: 'Buat Produk Baru',
            subtitle: 'Isi detail di bawah ini untuk menambahkan produk baru ke inventaris Anda.',
            loading: 'Memuat...'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    // Determine which form to show
    const isHotel = supplierType?.toLowerCase().includes('hotel')

    if (!supplierType) {
        return (
            <div className="flex h-screen items-center justify-center text-foreground">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <p>{content.loading}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="text-foreground">
            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 shadow-lg mb-8">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {content.greeting}
                        </h1>
                        <p className="text-blue-100 text-lg">
                            {content.instruction}
                        </p>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                </div>

                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <FaArrowLeft className="mr-2" />
                        {content.back}
                    </button>
                </div>

                {isHotel ? (
                    <HotelProductForm supplier={supplier} onSuccess={() => router.push('/supplier/dashboard')} />
                ) : (
                    <ProductForm onSuccess={() => router.push('/supplier/dashboard')} />
                )}
            </main>
        </div>
    )
}
