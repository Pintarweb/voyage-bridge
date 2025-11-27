'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import ProductHistoryTable, { Product } from '@/components/supplier/product-history/ProductHistoryTable'
import { FaPlus, FaEye, FaHeart, FaMoneyBillWave, FaChartLine, FaMapMarkerAlt, FaTag } from 'react-icons/fa'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { useLanguage } from '@/context/LanguageContext'

// Mock Data for Sparklines
const MOCK_SPARK_DATA = [
    { value: 10 }, { value: 15 }, { value: 12 }, { value: 20 }, { value: 25 }, { value: 22 }, { value: 30 }
]

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const [supplier, setSupplier] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<any[]>([]) // Using any for now to include analytics fields
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
    const router = useRouter()
    const supabase = createClient()
    const { language } = useLanguage()

    const t = {
        'en-US': {
            title: 'Inventory Management',
            subtitle: 'Track performance and manage your active listings.',
            createProduct: 'Create Product',
            activeInventory: 'Active Inventory',
            productHistory: 'Product History (Archived)',
            noActiveProducts: 'No active products found.',
            createFirstProduct: '+ Create your first product',
            agentPrice: 'Agent Price',
            valid: 'Valid',
            edit: 'Edit',
            archive: 'Archive',
            views: 'Views',
            conversion: 'Conversion',
            wishlisted: 'Wishlisted',
            revenue: 'Revenue',
            editComingSoon: 'Edit functionality coming soon',
            confirmArchive: 'Are you sure you want to archive this product?',
            errorArchive: 'Error archiving product',
            confirmRestore: 'Restore this product? You may need to update the validity dates.',
            errorRestore: 'Error restoring product',
            loading: 'Loading...'
        },
        'zh-CN': {
            title: '库存管理',
            subtitle: '跟踪绩效并管理您的活动列表。',
            createProduct: '创建产品',
            activeInventory: '活动库存',
            productHistory: '产品历史（已归档）',
            noActiveProducts: '未找到活动产品。',
            createFirstProduct: '+ 创建您的第一个产品',
            agentPrice: '代理价格',
            valid: '有效期',
            edit: '编辑',
            archive: '归档',
            views: '浏览量',
            conversion: '转化率',
            wishlisted: '收藏',
            revenue: '收入',
            editComingSoon: '编辑功能即将推出',
            confirmArchive: '您确定要归档此产品吗？',
            errorArchive: '归档产品时出错',
            confirmRestore: '恢复此产品？您可能需要更新有效期。',
            errorRestore: '恢复产品时出错',
            loading: '加载中...'
        },
        'ms-MY': {
            title: 'Pengurusan Inventori',
            subtitle: 'Jejak prestasi dan urus penyenaraian aktif anda.',
            createProduct: 'Cipta Produk',
            activeInventory: 'Inventori Aktif',
            productHistory: 'Sejarah Produk (Diarkibkan)',
            noActiveProducts: 'Tiada produk aktif ditemui.',
            createFirstProduct: '+ Cipta produk pertama anda',
            agentPrice: 'Harga Ejen',
            valid: 'Sah',
            edit: 'Sunting',
            archive: 'Arkib',
            views: 'Paparan',
            conversion: 'Penukaran',
            wishlisted: 'Disenarai hajat',
            revenue: 'Hasil',
            editComingSoon: 'Fungsi suntingan akan datang tidak lama lagi',
            confirmArchive: 'Adakah anda pasti mahu mengarkibkan produk ini?',
            errorArchive: 'Ralat mengarkibkan produk',
            confirmRestore: 'Pulihkan produk ini? Anda mungkin perlu mengemas kini tarikh sah.',
            errorRestore: 'Ralat memulihkan produk',
            loading: 'Memuatkan...'
        },
        'es-ES': {
            title: 'Gestión de Inventario',
            subtitle: 'Rastree el rendimiento y gestione sus listados activos.',
            createProduct: 'Crear Producto',
            activeInventory: 'Inventario Activo',
            productHistory: 'Historial de Productos (Archivado)',
            noActiveProducts: 'No se encontraron productos activos.',
            createFirstProduct: '+ Cree su primer producto',
            agentPrice: 'Precio de Agente',
            valid: 'Válido',
            edit: 'Editar',
            archive: 'Archivar',
            views: 'Vistas',
            conversion: 'Conversión',
            wishlisted: 'En lista de deseos',
            revenue: 'Ingresos',
            editComingSoon: 'Funcionalidad de edición próximamente',
            confirmArchive: '¿Está seguro de que desea archivar este producto?',
            errorArchive: 'Error al archivar el producto',
            confirmRestore: '¿Restaurar este producto? Es posible que deba actualizar las fechas de validez.',
            errorRestore: 'Error al restaurar el producto',
            loading: 'Cargando...'
        },
        'fr-FR': {
            title: 'Gestion des Stocks',
            subtitle: 'Suivez les performances et gérez vos annonces actives.',
            createProduct: 'Créer un Produit',
            activeInventory: 'Inventaire Actif',
            productHistory: 'Historique des Produits (Archivé)',
            noActiveProducts: 'Aucun produit actif trouvé.',
            createFirstProduct: '+ Créez votre premier produit',
            agentPrice: 'Prix Agent',
            valid: 'Valide',
            edit: 'Modifier',
            archive: 'Archiver',
            views: 'Vues',
            conversion: 'Conversion',
            wishlisted: 'Dans la liste de souhaits',
            revenue: 'Revenus',
            editComingSoon: 'Fonctionnalité de modification bientôt disponible',
            confirmArchive: 'Êtes-vous sûr de vouloir archiver ce produit ?',
            errorArchive: 'Erreur lors de l\'archivage du produit',
            confirmRestore: 'Restaurer ce produit ? Vous devrez peut-être mettre à jour les dates de validité.',
            errorRestore: 'Erreur lors de la restauration du produit',
            loading: 'Chargement...'
        },
        'de-DE': {
            title: 'Bestandsverwaltung',
            subtitle: 'Verfolgen Sie die Leistung und verwalten Sie Ihre aktiven Angebote.',
            createProduct: 'Produkt Erstellen',
            activeInventory: 'Aktiver Bestand',
            productHistory: 'Produkthistorie (Archiviert)',
            noActiveProducts: 'Keine aktiven Produkte gefunden.',
            createFirstProduct: '+ Erstellen Sie Ihr erstes Produkt',
            agentPrice: 'Agentenpreis',
            valid: 'Gültig',
            edit: 'Bearbeiten',
            archive: 'Archivieren',
            views: 'Ansichten',
            conversion: 'Konversion',
            wishlisted: 'Auf der Wunschliste',
            revenue: 'Einnahmen',
            editComingSoon: 'Bearbeitungsfunktion kommt bald',
            confirmArchive: 'Sind Sie sicher, dass Sie dieses Produkt archivieren möchten?',
            errorArchive: 'Fehler beim Archivieren des Produkts',
            confirmRestore: 'Dieses Produkt wiederherstellen? Möglicherweise müssen Sie die Gültigkeitsdaten aktualisieren.',
            errorRestore: 'Fehler beim Wiederherstellen des Produkts',
            loading: 'Laden...'
        },
        'ja-JP': {
            title: '在庫管理',
            subtitle: 'パフォーマンスを追跡し、アクティブなリスティングを管理します。',
            createProduct: '製品を作成',
            activeInventory: 'アクティブな在庫',
            productHistory: '製品履歴（アーカイブ済み）',
            noActiveProducts: 'アクティブな製品が見つかりません。',
            createFirstProduct: '+ 最初の製品を作成',
            agentPrice: 'エージェント価格',
            valid: '有効',
            edit: '編集',
            archive: 'アーカイブ',
            views: '閲覧数',
            conversion: 'コンバージョン',
            wishlisted: 'ウィッシュリスト',
            revenue: '収益',
            editComingSoon: '編集機能は近日公開予定',
            confirmArchive: 'この製品をアーカイブしてもよろしいですか？',
            errorArchive: '製品のアーカイブエラー',
            confirmRestore: 'この製品を復元しますか？有効期限を更新する必要がある場合があります。',
            errorRestore: '製品の復元エラー',
            loading: '読み込み中...'
        },
        'ko-KR': {
            title: '재고 관리',
            subtitle: '성과를 추적하고 활성 목록을 관리하십시오.',
            createProduct: '제품 생성',
            activeInventory: '활성 재고',
            productHistory: '제품 기록 (보관됨)',
            noActiveProducts: '활성 제품을 찾을 수 없습니다.',
            createFirstProduct: '+ 첫 번째 제품 생성',
            agentPrice: '에이전트 가격',
            valid: '유효',
            edit: '편집',
            archive: '보관',
            views: '조회수',
            conversion: '전환',
            wishlisted: '위시리스트',
            revenue: '수익',
            editComingSoon: '편집 기능 곧 제공 예정',
            confirmArchive: '이 제품을 보관하시겠습니까?',
            errorArchive: '제품 보관 오류',
            confirmRestore: '이 제품을 복원하시겠습니까? 유효 기간을 업데이트해야 할 수도 있습니다.',
            errorRestore: '제품 복원 오류',
            loading: '로딩 중...'
        },
        'ar-SA': {
            title: 'إدارة المخزون',
            subtitle: 'تتبع الأداء وإدارة القوائم النشطة الخاصة بك.',
            createProduct: 'إنشاء منتج',
            activeInventory: 'المخزون النشط',
            productHistory: 'سجل المنتج (مؤرشف)',
            noActiveProducts: 'لم يتم العثور على منتجات نشطة.',
            createFirstProduct: '+ أنشئ منتجك الأول',
            agentPrice: 'سعر الوكيل',
            valid: 'صالح',
            edit: 'تعديل',
            archive: 'أرشفة',
            views: 'المشاهدات',
            conversion: 'التحويل',
            wishlisted: 'في قائمة الرغبات',
            revenue: 'الإيرادات',
            editComingSoon: 'وظيفة التعديل قريبا',
            confirmArchive: 'هل أنت متأكد أنك تريد أرشفة هذا المنتج؟',
            errorArchive: 'خطأ في أرشفة المنتج',
            confirmRestore: 'هل تريد استعادة هذا المنتج؟ قد تحتاج إلى تحديث تواريخ الصلاحية.',
            errorRestore: 'خطأ في استعادة المنتج',
            loading: 'جار التحميل...'
        },
        'th-TH': {
            title: 'การจัดการสินค้าคงคลัง',
            subtitle: 'ติดตามประสิทธิภาพและจัดการรายการที่ใช้งานอยู่ของคุณ',
            createProduct: 'สร้างผลิตภัณฑ์',
            activeInventory: 'สินค้าคงคลังที่ใช้งานอยู่',
            productHistory: 'ประวัติผลิตภัณฑ์ (เก็บถาวร)',
            noActiveProducts: 'ไม่พบผลิตภัณฑ์ที่ใช้งานอยู่',
            createFirstProduct: '+ สร้างผลิตภัณฑ์แรกของคุณ',
            agentPrice: 'ราคาตัวแทน',
            valid: 'ใช้ได้',
            edit: 'แก้ไข',
            archive: 'เก็บถาวร',
            views: 'ยอดเข้าชม',
            conversion: 'การแปลง',
            wishlisted: 'รายการที่อยากได้',
            revenue: 'รายได้',
            editComingSoon: 'ฟังก์ชันแก้ไขเร็วๆ นี้',
            confirmArchive: 'คุณแน่ใจหรือไม่ว่าต้องการเก็บถาวรผลิตภัณฑ์นี้',
            errorArchive: 'ข้อผิดพลาดในการเก็บถาวรผลิตภัณฑ์',
            confirmRestore: 'กู้คืนผลิตภัณฑ์นี้หรือไม่ คุณอาจต้องอัปเดตวันที่ใช้งานได้',
            errorRestore: 'ข้อผิดพลาดในการกู้คืนผลิตภัณฑ์',
            loading: 'กำลังโหลด...'
        },
        'vi-VN': {
            title: 'Quản lý Kho hàng',
            subtitle: 'Theo dõi hiệu suất và quản lý danh sách đang hoạt động của bạn.',
            createProduct: 'Tạo Sản phẩm',
            activeInventory: 'Kho hàng Đang hoạt động',
            productHistory: 'Lịch sử Sản phẩm (Đã lưu trữ)',
            noActiveProducts: 'Không tìm thấy sản phẩm đang hoạt động.',
            createFirstProduct: '+ Tạo sản phẩm đầu tiên của bạn',
            agentPrice: 'Giá Đại lý',
            valid: 'Hợp lệ',
            edit: 'Chỉnh sửa',
            archive: 'Lưu trữ',
            views: 'Lượt xem',
            conversion: 'Chuyển đổi',
            wishlisted: 'Đã thêm vào danh sách mong muốn',
            revenue: 'Doanh thu',
            editComingSoon: 'Chức năng chỉnh sửa sắp ra mắt',
            confirmArchive: 'Bạn có chắc chắn muốn lưu trữ sản phẩm này không?',
            errorArchive: 'Lỗi khi lưu trữ sản phẩm',
            confirmRestore: 'Khôi phục sản phẩm này? Bạn có thể cần cập nhật ngày hiệu lực.',
            errorRestore: 'Lỗi khi khôi phục sản phẩm',
            loading: 'Đang tải...'
        },
        'id-ID': {
            title: 'Manajemen Inventaris',
            subtitle: 'Lacak kinerja dan kelola daftar aktif Anda.',
            createProduct: 'Buat Produk',
            activeInventory: 'Inventaris Aktif',
            productHistory: 'Riwayat Produk (Diarsipkan)',
            noActiveProducts: 'Tidak ada produk aktif ditemukan.',
            createFirstProduct: '+ Buat produk pertama Anda',
            agentPrice: 'Harga Agen',
            valid: 'Berlaku',
            edit: 'Edit',
            archive: 'Arsipkan',
            views: 'Dilihat',
            conversion: 'Konversi',
            wishlisted: 'Didaftarkan Keinginan',
            revenue: 'Pendapatan',
            editComingSoon: 'Fungsi edit segera hadir',
            confirmArchive: 'Apakah Anda yakin ingin mengarsipkan produk ini?',
            errorArchive: 'Kesalahan mengarsipkan produk',
            confirmRestore: 'Pulihkan produk ini? Anda mungkin perlu memperbarui tanggal berlaku.',
            errorRestore: 'Kesalahan memulihkan produk',
            loading: 'Memuat...'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/auth/register')
            } else {
                setUser(user)
                await Promise.all([
                    fetchProducts(user.id),
                    fetchSupplier(user.id)
                ])
            }
            setLoading(false)
        }
        checkUser()
    }, [router, supabase])

    const fetchSupplier = async (userId: string) => {
        const { data, error } = await supabase
            .from('suppliers')
            .select('*')
            .eq('id', userId)
            .single()

        if (error) {
            console.error('Error fetching supplier:', error)
        } else {
            setSupplier(data)
        }
    }

    const fetchProducts = async (userId: string) => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('supplier_id', userId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching products:', error)
        } else {
            setProducts(data || [])
        }
    }

    const handleArchive = async (id: string) => {
        if (!confirm(content.confirmArchive)) return

        const { error } = await supabase
            .from('products')
            .update({ status: 'archived', is_archived: true, archived_at: new Date().toISOString() })
            .eq('id', id)

        if (error) {
            alert(content.errorArchive)
        } else {
            fetchProducts(user.id)
        }
    }

    const handleRestore = async (id: string) => {
        if (!confirm(content.confirmRestore)) return

        const { error } = await supabase
            .from('products')
            .update({ status: 'active', is_archived: false, archived_at: null })
            .eq('id', id)

        if (error) {
            alert(content.errorRestore)
        } else {
            fetchProducts(user.id)
        }
    }

    if (loading) {
        return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">{content.loading}</div>
    }

    const activeProducts = products.filter(p => p.status === 'active' || p.status === 'draft')
    const historyProducts = products.filter(p => p.status === 'archived')

    return (
        <div className="text-foreground">
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">{content.title}</h1>
                        <p className="mt-2 text-muted-foreground">{content.subtitle}</p>

                        {supplier && (
                            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                {supplier.supplier_type && (
                                    <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                                        <FaTag className="text-primary" />
                                        <span className="font-medium text-foreground">{supplier.supplier_type}</span>
                                    </div>
                                )}
                                {supplier.city && (
                                    <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                                        <FaMapMarkerAlt className="text-primary" />
                                        <span className="font-medium text-foreground">{supplier.city}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => router.push('/supplier/dashboard/products/create')}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <FaPlus className="mr-2" />
                        {content.createProduct}
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-border mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`${activeTab === 'active'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {content.activeInventory} ({activeProducts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`${activeTab === 'history'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {content.productHistory} ({historyProducts.length})
                        </button>
                    </nav>
                </div>

                {activeTab === 'active' ? (
                    <div className="space-y-6">
                        {activeProducts.length === 0 ? (
                            <div className="text-center py-12 bg-card rounded-lg border border-border">
                                <p className="text-muted-foreground">{content.noActiveProducts}</p>
                                <button
                                    onClick={() => router.push('/supplier/dashboard/products/create')}
                                    className="mt-4 text-primary hover:text-primary/80 font-medium"
                                >
                                    {content.createFirstProduct}
                                </button>
                            </div>
                        ) : (
                            activeProducts.map((product) => (
                                <div key={product.id} className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors shadow-sm">
                                    {/* Top Section: Details */}
                                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div className="flex items-start space-x-4">
                                            {product.photo_url_1 ? (
                                                <img src={product.photo_url_1} alt={product.product_name} className="w-20 h-20 object-cover rounded-md" />
                                            ) : (
                                                <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center text-muted-foreground">No Img</div>
                                            )}
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">{product.product_name}</h3>
                                                <p className="text-sm text-muted-foreground">{product.city}, {product.country_code} • {product.product_category}</p>
                                                <div className="mt-2 flex flex-col space-y-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                            {product.status.toUpperCase()}
                                                        </span>
                                                        <span className="text-sm font-medium text-foreground">
                                                            {content.agentPrice}: {product.currency} {product.agent_price}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {content.valid}: {product.validity_start_date} - {product.validity_end_date}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex space-x-3">
                                            <button
                                                className="px-3 py-1.5 border border-border rounded text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                                onClick={() => alert(content.editComingSoon)}
                                            >
                                                {content.edit}
                                            </button>
                                            <button
                                                className="px-3 py-1.5 border border-border rounded text-sm text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-colors"
                                                onClick={() => handleArchive(product.id)}
                                            >
                                                {content.archive}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bottom Section: Performance Strip */}
                                    <div className="bg-muted/30 border-t border-border px-6 py-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* Views + Sparkline */}
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-muted rounded-full text-blue-500">
                                                <FaEye />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase font-medium">{content.views}</p>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg font-bold text-foreground">{product.view_count || 0}</span>
                                                    <div className="w-16 h-8">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <LineChart data={MOCK_SPARK_DATA}>
                                                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                                            </LineChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Conversion */}
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-muted rounded-full text-green-500">
                                                <FaChartLine />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase font-medium">{content.conversion}</p>
                                                <p className="text-lg font-bold text-foreground">
                                                    {product.view_count > 0 ? ((product.booking_count / product.view_count) * 100).toFixed(1) : 0}%
                                                </p>
                                            </div>
                                        </div>

                                        {/* Wishlisted */}
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-muted rounded-full text-pink-500">
                                                <FaHeart />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase font-medium">{content.wishlisted}</p>
                                                <p className="text-lg font-bold text-foreground">{product.wishlist_count || 0}</p>
                                            </div>
                                        </div>

                                        {/* Revenue */}
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-muted rounded-full text-yellow-500">
                                                <FaMoneyBillWave />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase font-medium">{content.revenue}</p>
                                                <p className="text-lg font-bold text-foreground">${product.revenue || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    /* History Tab */
                    <div className="bg-card rounded-lg p-6 border border-border">
                        <ProductHistoryTable
                            products={historyProducts}
                            onRestore={handleRestore}
                            onArchive={() => { }}
                        />
                    </div>
                )}
            </main>
        </div>
    )
}
