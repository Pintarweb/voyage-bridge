'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import ProductForm from '@/components/supplier/product-form'
import HotelProductForm from '@/components/supplier/HotelProductForm'
import TransportProductForm from '@/components/supplier/TransportProductForm'
import LandOperatorProductForm from '@/components/supplier/LandOperatorProductForm'
import AirlineProductPlaceholder from '@/components/supplier/AirlineProductPlaceholder'
import { FaArrowLeft, FaRocket } from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'
import { createClient } from '@/utils/supabase/client'
import SupplierSidebar from '@/components/supplier/dashboard/SupplierSidebar'

function CreateProductContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const mode = searchParams.get('edit') === 'true' ? 'edit' : 'create'
    const editProductId = searchParams.get('id')
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
    const isTransport = supplierType?.toLowerCase().includes('transport') || supplierType?.toLowerCase().includes('transfer') || supplierType?.toLowerCase().includes('car')
    const isAirline = supplierType?.toLowerCase().includes('airline') || supplierType?.toLowerCase().includes('flight')
    const isLandOperator = supplierType?.toLowerCase().includes('tour') || supplierType?.toLowerCase().includes('land') || supplierType?.toLowerCase().includes('operator') || supplierType?.toLowerCase().includes('activity')

    const handleSidebarNavigation = (tab: string) => {
        router.push('/supplier/dashboard')
    }

    if (!supplierType) {
        return (
            <div className="flex h-screen items-center justify-center text-white bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
                    <p className="text-amber-500/80 font-medium tracking-wide animate-pulse">{content.loading}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative flex font-sans text-white bg-slate-950 overflow-hidden">

            {/* Background Atmosphere (Borrowed from Dashboard for Consistency) */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-slate-950/55 z-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-slate-950/90 z-20" />
                <div className="absolute top-0 right-[-10%] w-[60%] h-[60%] bg-amber-600/10 blur-[150px] z-20 pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] z-20 pointer-events-none" />

                <img
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                    alt="Global Business Travel"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>

            {/* Sidebar Navigation */}
            <SupplierSidebar activeTab="products" setActiveTab={handleSidebarNavigation} />

            {/* Main Content Area */}
            <div className="relative z-20 flex-1 ml-0 lg:ml-20 xl:ml-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen flex flex-col">

                    {/* Content */}
                    <main className="flex-1 pb-20">

                        {/* Welcome Banner - Hidden for specific types as they have custom internal headers, but kept for generic generic ProductForm if used */}
                        {!isTransport && !isHotel && !isLandOperator && (
                            <div className="mb-8">
                                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 shadow-2xl p-8 backdrop-blur-md">
                                    <div className="relative z-10 flex items-start justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
                                                {content.greeting}
                                            </h1>
                                            <p className="text-amber-200/80 text-lg">
                                                {content.instruction}
                                            </p>
                                        </div>
                                        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                            <FaRocket className="text-xl" />
                                        </div>
                                    </div>

                                    {/* Decorative Blob */}
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/20 blur-3xl rounded-full pointer-events-none"></div>
                                </div>
                                <div className="mt-6">
                                    <button
                                        onClick={() => router.back()}
                                        className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors group"
                                    >
                                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                                        <span className="font-medium tracking-wide">{content.back}</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Forms */}
                        <div className="animate-fade-in-up">
                            {isHotel ? (
                                <HotelProductForm supplier={supplier} productId={editProductId || undefined} onSuccess={() => router.push('/supplier/dashboard')} />
                            ) : isTransport ? (
                                <TransportProductForm supplier={supplier} productId={editProductId || undefined} onSuccess={() => router.push('/supplier/dashboard')} />
                            ) : isAirline ? (
                                <AirlineProductPlaceholder supplier={supplier} />
                            ) : isLandOperator ? (
                                <LandOperatorProductForm supplier={supplier} productId={editProductId || undefined} onSuccess={() => router.push('/supplier/dashboard')} />
                            ) : (
                                <ProductForm productId={editProductId || undefined} mode={mode} onSuccess={() => router.push('/supplier/dashboard')} />
                            )}
                        </div>
                    </main>

                </div>
            </div>
            <style jsx global>{`
                  @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                  .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                  }
                  /* Autofill Transparency Fix */
                  input:-webkit-autofill,
                  input:-webkit-autofill:hover, 
                  input:-webkit-autofill:focus, 
                  input:-webkit-autofill:active {
                      -webkit-box-shadow: 0 0 0 30px rgba(2, 6, 23, 0.8) inset !important;
                      -webkit-text-fill-color: white !important;
                      caret-color: white !important;
                      transition: background-color 5000s ease-in-out 0s;
                  }
             `}</style>
        </div>
    )
}

export default function CreateProductPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center text-white bg-slate-950">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
            </div>
        }>
            <CreateProductContent />
        </Suspense>
    )
}
