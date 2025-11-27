'use client'

import { useRouter } from 'next/navigation'
import ProductForm from '@/components/supplier/product-form'
import { FaArrowLeft } from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'

export default function CreateProductPage() {
    const router = useRouter()
    const { language } = useLanguage()

    const t = {
        'en-US': {
            back: 'Back to Dashboard',
            title: 'Create New Product',
            subtitle: 'Fill in the details below to add a new product to your inventory.'
        },
        'zh-CN': {
            back: '返回仪表板',
            title: '创建新产品',
            subtitle: '填写以下详细信息以将新产品添加到您的库存中。'
        },
        'ms-MY': {
            back: 'Kembali ke Papan Pemuka',
            title: 'Cipta Produk Baru',
            subtitle: 'Isi butiran di bawah untuk menambah produk baru ke inventori anda.'
        },
        'es-ES': {
            back: 'Volver al Panel',
            title: 'Crear Nuevo Producto',
            subtitle: 'Complete los detalles a continuación para agregar un nuevo producto a su inventario.'
        },
        'fr-FR': {
            back: 'Retour au Tableau de Bord',
            title: 'Créer un Nouveau Produit',
            subtitle: 'Remplissez les détails ci-dessous pour ajouter un nouveau produit à votre inventaire.'
        },
        'de-DE': {
            back: 'Zurück zum Dashboard',
            title: 'Neues Produkt Erstellen',
            subtitle: 'Füllen Sie die untenstehenden Details aus, um ein neues Produkt zu Ihrem Inventar hinzuzufügen.'
        },
        'ja-JP': {
            back: 'ダッシュボードに戻る',
            title: '新しい製品を作成',
            subtitle: '在庫に新しい製品を追加するには、以下の詳細を入力してください。'
        },
        'ko-KR': {
            back: '대시보드로 돌아가기',
            title: '새 제품 생성',
            subtitle: '인벤토리에 새 제품을 추가하려면 아래 세부 정보를 입력하십시오.'
        },
        'ar-SA': {
            back: 'العودة إلى لوحة القيادة',
            title: 'إنشاء منتج جديد',
            subtitle: 'املأ التفاصيل أدناه لإضافة منتج جديد إلى مخزونك.'
        },
        'th-TH': {
            back: 'กลับไปที่แดชบอร์ด',
            title: 'สร้างผลิตภัณฑ์ใหม่',
            subtitle: 'กรอกรายละเอียดด้านล่างเพื่อเพิ่มผลิตภัณฑ์ใหม่ลงในสินค้าคงคลังของคุณ'
        },
        'vi-VN': {
            back: 'Quay lại Bảng điều khiển',
            title: 'Tạo sản phẩm mới',
            subtitle: 'Điền vào các chi tiết bên dưới để thêm sản phẩm mới vào kho của bạn.'
        },
        'id-ID': {
            back: 'Kembali ke Dasbor',
            title: 'Buat Produk Baru',
            subtitle: 'Isi detail di bawah ini untuk menambahkan produk baru ke inventaris Anda.'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    return (
        <div className="text-foreground">
            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        {content.back}
                    </button>
                    <h1 className="text-3xl font-bold text-foreground">{content.title}</h1>
                    <p className="mt-2 text-muted-foreground">{content.subtitle}</p>
                </div>

                <ProductForm onSuccess={() => router.push('/supplier/dashboard')} />
            </main>
        </div>
    )
}
