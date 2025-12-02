'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import ProductHistoryTable, { Product } from '@/components/supplier/product-history/ProductHistoryTable'
import { FaPlus, FaEye, FaHeart, FaMoneyBillWave, FaChartLine, FaMapMarkerAlt, FaTag, FaBox, FaArchive, FaTrashRestore, FaSignOutAlt } from 'react-icons/fa'
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
    const [productToArchive, setProductToArchive] = useState<string | null>(null)
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
    const [productToRestore, setProductToRestore] = useState<string | null>(null)
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)
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
            archiveModalTitle: 'Archive Product',
            archiveModalMessage: 'This product will be moved to the archived section. You can restore it later if needed.',
            cancel: 'Cancel',
            confirmArchiveAction: 'Yes, Archive',
            errorArchive: 'Error archiving product',
            confirmRestore: 'Restore this product?',
            restoreModalTitle: 'Restore Product',
            restoreModalMessage: 'This product will be moved back to your active inventory as a draft. You can then edit and publish it.',
            confirmRestoreAction: 'Yes, Restore',
            errorRestore: 'Error restoring product',
            loading: 'Loading...',
            welcomeBack: 'Welcome back',
            partner: 'Partner',
            manageYour: 'Manage your',
            inventory: 'inventory',
            trackPerformance: 'and track performance all in one place.',
            in_location: 'in',
            logout: 'Logout',
            createWinningProduct: 'Create Your Winning Product Now',
            supplierTypes: {
                'Hotel': 'Hotel',
                'Transportation': 'Transportation',
                'Transport': 'Transportation',
                'Land Operator': 'Land Operator',
                'Airline': 'Airline'
            },
            categoryValues: {
                'Accommodation': 'Accommodation',
                'Transportation': 'Transportation',
                'Land Operator': 'Land Operator',
                'Airline': 'Airline'
            },
            statusValues: {
                'active': 'ACTIVE',
                'draft': 'DRAFT',
                'archived': 'ARCHIVED'
            },
            cityTranslations: {
                'Kuala Lumpur': 'Kuala Lumpur',
                'Tokyo': 'Tokyo',
                'Osaka': 'Osaka',
                'Seoul': 'Seoul',
                'Bangkok': 'Bangkok',
                'Singapore': 'Singapore',
                'Paris': 'Paris',
                'London': 'London',
                'New York': 'New York',
                'Dubai': 'Dubai',
                'Penang': 'Penang',
                'Johor Bahru': 'Johor Bahru',
                'Kota Kinabalu': 'Kota Kinabalu'
            }
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
            archiveModalTitle: '归档产品',
            archiveModalMessage: '该产品将被移动到归档部分。如果需要，您可以稍后恢复它。',
            cancel: '取消',
            confirmArchiveAction: '是的，归档',
            errorArchive: '归档产品时出错',
            confirmRestore: '恢复此产品？',
            restoreModalTitle: '恢复产品',
            restoreModalMessage: '此产品将作为草稿移回您的活动库存。然后您可以编辑并发布它。',
            confirmRestoreAction: '是的，恢复',
            errorRestore: '恢复产品时出错',
            loading: '加载中...',
            welcomeBack: '欢迎回来',
            partner: '合作伙伴',
            manageYour: '管理您的',
            inventory: '库存',
            trackPerformance: '并在一个地方跟踪绩效。',
            in_location: '在',
            logout: '登出',
            createWinningProduct: '立即创建您的致胜产品',
            supplierTypes: {
                'Hotel': '酒店',
                'Transportation': '交通',
                'Transport': '交通',
                'Land Operator': '地接社',
                'Airline': '航空公司'
            },
            categoryValues: {
                'Accommodation': '住宿',
                'Transportation': '交通',
                'Land Operator': '地接社',
                'Airline': '航空公司'
            },
            cityTranslations: {
                'Kuala Lumpur': 'Kuala Lumpur',
                'Tokyo': 'Tokyo',
                'Osaka': 'Osaka',
                'Seoul': 'Seoul',
                'Bangkok': 'Bangkok',
                'Singapore': 'Singapore',
                'Paris': 'Paris',
                'London': 'London',
                'New York': '纽约',
                'Dubai': '迪拜',
                'Penang': '槟城',
                'Johor Bahru': '新山',
                'Kota Kinabalu': '亚庇'
            },
            statusValues: {
                'active': '活跃',
                'draft': '草稿',
                'archived': '已归档'
            }
        },
        'ms-MY': {
            title: 'Pengurusan Inventori',
            subtitle: 'Jejaki prestasi dan urus senarai aktif anda.',
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
            archiveModalTitle: 'Arkibkan Produk',
            archiveModalMessage: 'Produk ini akan dipindahkan ke bahagian arkib. Anda boleh memulihkannya kemudian jika perlu.',
            cancel: 'Batal',
            confirmArchiveAction: 'Ya, Arkibkan',
            errorArchive: 'Ralat mengarkibkan produk',
            confirmRestore: 'Pulihkan produk ini?',
            restoreModalTitle: 'Pulihkan Produk',
            restoreModalMessage: 'Produk ini akan dipindahkan kembali ke inventori aktif anda sebagai draf. Anda kemudian boleh menyunting dan menerbitkannya.',
            confirmRestoreAction: 'Ya, Pulihkan',
            errorRestore: 'Ralat memulihkan produk',
            loading: 'Memuatkan...',
            welcomeBack: 'Selamat kembali',
            partner: 'Rakan Kongsi',
            manageYour: 'Urus',
            inventory: 'inventori',
            trackPerformance: 'anda dan jejak prestasi semuanya di satu tempat.',
            in_location: 'di',
            logout: 'Log Keluar',
            createWinningProduct: 'Cipta Produk Menang Anda Sekarang',
            supplierTypes: {
                'Hotel': 'Hotel',
                'Transportation': 'Pengangkutan',
                'Transport': 'Pengangkutan',
                'Land Operator': 'Operator Darat',
                'Airline': 'Syarikat Penerbangan'
            },
            categoryValues: {
                'Accommodation': 'Penginapan',
                'Transportation': 'Pengangkutan',
                'Land Operator': 'Operator Darat',
                'Airline': 'Syarikat Penerbangan'
            },
            cityTranslations: {
                'Kuala Lumpur': 'Kuala Lumpur',
                'Tokyo': 'Tokyo',
                'Osaka': 'Osaka',
                'Seoul': 'Seoul',
                'Bangkok': 'Bangkok',
                'Singapore': 'Singapore',
                'Paris': 'Paris',
                'London': 'London',
                'New York': 'New York',
                'Dubai': 'Dubai',
                'Penang': 'Pulau Pinang',
                'Johor Bahru': 'Johor Bahru',
                'Kota Kinabalu': 'Kota Kinabalu'
            },
            statusValues: {
                'active': 'AKTIF',
                'draft': 'DRAF',
                'archived': 'DIARKIBKAN'
            }
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
            archiveModalTitle: 'Archivar Producto',
            archiveModalMessage: 'Este producto se moverá a la sección archivada. Puede restaurarlo más tarde si es necesario.',
            cancel: 'Cancelar',
            confirmArchiveAction: 'Sí, Archivar',
            errorArchive: 'Error al archivar el producto',
            confirmRestore: '¿Restaurar este producto?',
            restoreModalTitle: 'Restaurar Producto',
            restoreModalMessage: 'Este producto se moverá de nuevo a su inventario activo como borrador. Luego puede editarlo y publicarlo.',
            confirmRestoreAction: 'Sí, Restaurar',
            errorRestore: 'Error al restaurar el producto',
            loading: 'Cargando...',
            welcomeBack: 'Bienvenido de nuevo',
            partner: 'Socio',
            manageYour: 'Administre su',
            inventory: 'inventario',
            trackPerformance: 'y rastree el rendimiento todo en un solo lugar.',
            in_location: 'en',
            logout: 'Cerrar Sesión',
            createWinningProduct: 'Cree Su Producto Ganador Ahora',
            supplierTypes: {
                'Hotel': 'Hotel',
                'Transportation': 'Transporte',
                'Transport': 'Transporte',
                'Land Operator': 'Operador Terrestre',
                'Airline': 'Aerolínea'
            },
            categoryValues: {
                'Accommodation': 'Alojamiento',
                'Transportation': 'Transporte',
                'Land Operator': 'Operador Terrestre',
                'Airline': 'Aerolínea'
            },
            cityTranslations: {
                'Kuala Lumpur': 'Kuala Lumpur',
                'Tokyo': 'Tokio',
                'Osaka': 'Osaka',
                'Seoul': 'Seúl',
                'Bangkok': 'Bangkok',
                'Singapore': 'Singapur',
                'Paris': 'París',
                'London': 'Londres',
                'New York': 'Nueva York',
                'Dubai': 'Dubái',
                'Penang': 'Penang',
                'Johor Bahru': 'Johor Bahru',
                'Kota Kinabalu': 'Kota Kinabalu'
            },
            statusValues: {
                'active': 'ACTIVO',
                'draft': 'BORRADOR',
                'archived': 'ARCHIVADO'
            }
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
            archiveModalTitle: 'Archiver le Produit',
            archiveModalMessage: 'Ce produit sera déplacé vers la section archivée. Vous pourrez le restaurer plus tard si nécessaire.',
            cancel: 'Annuler',
            confirmArchiveAction: 'Oui, Archiver',
            errorArchive: 'Erreur lors de l\'archivage du produit',
            confirmRestore: 'Restaurer ce produit ?',
            restoreModalTitle: 'Restaurer le Produit',
            restoreModalMessage: 'Ce produit sera déplacé vers votre inventaire actif en tant que brouillon. Vous pourrez ensuite le modifier et le publier.',
            confirmRestoreAction: 'Oui, Restaurer',
            errorRestore: 'Erreur lors de la restauration du produit',
            loading: 'Chargement...',
            welcomeBack: 'Bon retour',
            partner: 'Partenaire',
            manageYour: 'Gérez votre',
            inventory: 'inventaire',
            trackPerformance: 'et suivez les performances au même endroit.',
            in_location: 'à',
            logout: 'Déconnexion',
            createWinningProduct: 'Créez Votre Produit Gagnant Maintenant',
            supplierTypes: {
                'Hotel': 'Hôtel',
                'Transportation': 'Transport',
                'Transport': 'Transport',
                'Land Operator': 'Opérateur Terrestre',
                'Airline': 'Compagnie Aérienne'
            },
            categoryValues: {
                'Accommodation': 'Hébergement',
                'Transportation': 'Transport',
                'Land Operator': 'Opérateur Terrestre',
                'Airline': 'Compagnie Aérienne'
            },
            cityTranslations: {
                'Kuala Lumpur': 'Kuala Lumpur',
                'Tokyo': 'Tokyo',
                'Osaka': 'Osaka',
                'Seoul': 'Séoul',
                'Bangkok': 'Bangkok',
                'Singapore': 'Singapour',
                'Paris': 'Paris',
                'London': 'Londres',
                'New York': 'New York',
                'Dubai': 'Dubaï',
                'Penang': 'Penang',
                'Johor Bahru': 'Johor Bahru',
                'Kota Kinabalu': 'Kota Kinabalu'
            },
            statusValues: {
                'active': 'ACTIF',
                'draft': 'BROUILLON',
                'archived': 'ARCHIVÉ'
            }
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
            archiveModalTitle: 'Produkt Archivieren',
            archiveModalMessage: 'Dieses Produkt wird in den archivierten Bereich verschoben. Sie können es später bei Bedarf wiederherstellen.',
            cancel: 'Abbrechen',
            confirmArchiveAction: 'Ja, Archivieren',
            errorArchive: 'Fehler beim Archivieren des Produkts',
            confirmRestore: 'Dieses Produkt wiederherstellen?',
            restoreModalTitle: 'Produkt Wiederherstellen',
            restoreModalMessage: 'Dieses Produkt wird als Entwurf in Ihren aktiven Bestand zurückverschoben. Sie können es dann bearbeiten und veröffentlichen.',
            confirmRestoreAction: 'Ja, Wiederherstellen',
            errorRestore: 'Fehler beim Wiederherstellen des Produkts',
            loading: 'Laden...',
            welcomeBack: 'Willkommen zurück',
            partner: 'Partner',
            manageYour: 'Verwalten Sie Ihr',
            inventory: 'Inventar',
            trackPerformance: 'und verfolgen Sie die Leistung an einem Ort.',
            in_location: 'in',
            logout: 'Abmelden',
            createWinningProduct: 'Erstellen Sie Jetzt Ihr Gewinnerprodukt',
            supplierTypes: {
                'Hotel': 'Hotel',
                'Transportation': 'Transport',
                'Transport': 'Transport',
                'Land Operator': 'Landoperator',
                'Airline': 'Fluggesellschaft'
            },
            categoryValues: {
                'Accommodation': 'Unterkunft',
                'Transportation': 'Transport',
                'Land Operator': 'Landoperator',
                'Airline': 'Fluggesellschaft'
            },
            cityTranslations: {
                'Kuala Lumpur': 'Kuala Lumpur',
                'Tokyo': 'Tokio',
                'Osaka': 'Osaka',
                'Seoul': 'Seoul',
                'Bangkok': 'Bangkok',
                'Singapore': 'Singapur',
                'Paris': 'Paris',
                'London': 'London',
                'New York': 'New York',
                'Dubai': 'Dubai',
                'Penang': 'Penang',
                'Johor Bahru': 'Johor Bahru',
                'Kota Kinabalu': 'Kota Kinabalu'
            },
            statusValues: {
                'active': 'AKTIV',
                'draft': 'ENTWURF',
                'archived': 'ARCHIVIERT'
            }
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
            archiveModalTitle: '製品をアーカイブ',
            archiveModalMessage: 'この製品はアーカイブセクションに移動されます。必要に応じて後で復元できます。',
            cancel: 'キャンセル',
            confirmArchiveAction: 'はい、アーカイブ',
            errorArchive: '製品のアーカイブエラー',
            confirmRestore: 'この製品を復元しますか？',
            restoreModalTitle: '製品を復元',
            restoreModalMessage: 'この製品は下書きとしてアクティブな在庫に戻されます。その後、編集して公開できます。',
            confirmRestoreAction: 'はい、復元',
            errorRestore: '製品の復元エラー',
            loading: '読み込み中...',
            welcomeBack: 'お帰りなさい',
            partner: 'パートナー',
            manageYour: '管理する',
            inventory: '在庫',
            trackPerformance: 'そして、一箇所でパフォーマンスを追跡します。',
            in_location: 'で',
            logout: 'ログアウト',
            createWinningProduct: '今すぐ勝てる製品を作成',
            supplierTypes: {
                'Hotel': 'ホテル',
                'Transportation': '交通',
                'Transport': '交通',
                'Land Operator': 'ランドオペレーター',
                'Airline': '航空会社'
            },
            categoryValues: {
                'Accommodation': '宿泊',
                'Transportation': '交通',
                'Land Operator': 'ランドオペレーター',
                'Airline': '航空会社'
            },
            cityTranslations: {
                'Kuala Lumpur': 'Kuala Lumpur',
                'Tokyo': 'Tokyo',
                'Osaka': 'Osaka',
                'Seoul': 'Seoul',
                'Bangkok': 'Bangkok',
                'Singapore': 'Singapore',
                'Paris': 'Paris',
                'London': 'London',
                'New York': 'ニューヨーク',
                'Dubai': 'ドバイ',
                'Penang': 'ペナン',
                'Johor Bahru': 'ジョホールバル',
                'Kota Kinabalu': 'コタキナバル'
            },
            statusValues: {
                'active': 'アクティブ',
                'draft': '下書き',
                'archived': 'アーカイブ済み'
            }
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
            archiveModalTitle: '제품 보관',
            archiveModalMessage: '이 제품은 보관된 섹션으로 이동됩니다. 필요한 경우 나중에 복원할 수 있습니다.',
            cancel: '취소',
            confirmArchiveAction: '예, 보관',
            errorArchive: '제품 보관 오류',
            confirmRestore: '이 제품을 복원하시겠습니까?',
            restoreModalTitle: '제품 복원',
            restoreModalMessage: '이 제품은 초안으로 활성 재고로 다시 이동됩니다. 그런 다음 편집하고 게시할 수 있습니다.',
            confirmRestoreAction: '예, 복원',
            errorRestore: '제품 복원 오류',
            loading: '로딩 중...',
            welcomeBack: '환영합니다',
            partner: '파트너',
            manageYour: '관리',
            inventory: '재고',
            trackPerformance: '한 곳에서 성과를 추적하십시오.',
            in_location: '에서',
            logout: '로그아웃',
            createWinningProduct: '지금 성공적인 제품을 만드세요',
            supplierTypes: {
                'Hotel': '호텔',
                'Transportation': '운송',
                'Transport': '운송',
                'Land Operator': '랜드 오퍼레이터',
                'Airline': '항공사'
            },
            categoryValues: {
                'Accommodation': '숙박',
                'Transportation': '운송',
                'Land Operator': '랜드 오퍼레이터',
                'Airline': '항공사'
            },
            cityTranslations: {
                'Kuala Lumpur': 'Kuala Lumpur',
                'Tokyo': 'Tokyo',
                'Osaka': 'Osaka',
                'Seoul': 'Seoul',
                'Bangkok': 'Bangkok',
                'Singapore': 'Singapore',
                'Paris': 'Paris',
                'London': 'London',
                'New York': '뉴욕',
                'Dubai': '두바이',
                'Penang': '페낭',
                'Johor Bahru': '조호바루',
                'Kota Kinabalu': '코타키나발루'
            },
            statusValues: {
                'active': '활성',
                'draft': '초안',
                'archived': '보관됨'
            }
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
            archiveModalTitle: 'أرشفة المنتج',
            archiveModalMessage: 'سيتم نقل هذا المنتج إلى القسم المؤرشف. يمكنك استعادته لاحقًا إذا لزم الأمر.',
            cancel: 'إلغاء',
            confirmArchiveAction: 'نعم، أرشفة',
            errorArchive: 'خطأ في أرشفة المنتج',
            confirmRestore: 'هل تريد استعادة هذا المنتج؟',
            restoreModalTitle: 'استعادة المنتج',
            restoreModalMessage: 'سيتم نقل هذا المنتج مرة أخرى إلى مخزونك النشط كمسودة. يمكنك بعد ذلك تعديله ونشره.',
            confirmRestoreAction: 'نعم، استعادة',
            errorRestore: 'خطأ في استعادة المنتج',
            loading: 'جار التحميل...',
            welcomeBack: 'مرحبًا بعودتك',
            partner: 'شريك',
            manageYour: 'إدارة',
            inventory: 'المخزون',
            trackPerformance: 'وتتبع الأداء في مكان واحد.',
            in_location: 'في',
            logout: 'تسجيل الخروج',
            createWinningProduct: 'أنشئ منتجك المتميز الآن',
            supplierTypes: {
                'Hotel': 'فندق',
                'Transportation': 'النقل',
                'Transport': 'النقل',
                'Land Operator': 'مشغل بري',
                'Airline': 'شركة طيران'
            },
            categoryValues: {
                'Accommodation': 'الإقامة',
                'Transportation': 'النقل',
                'Land Operator': 'مشغل بري',
                'Airline': 'شركة طيران'
            },
            cityTranslations: {
                'Kuala Lumpur': 'Kuala Lumpur',
                'Tokyo': 'Tokyo',
                'Osaka': 'Osaka',
                'Seoul': 'Seoul',
                'Bangkok': 'Bangkok',
                'Singapore': 'Singapore',
                'Paris': 'Paris',
                'London': 'London',
                'New York': 'نيويورك',
                'Dubai': 'دبي',
                'Penang': 'بينانج',
                'Johor Bahru': 'جوهر بهرو',
                'Kota Kinabalu': 'كوتا كينابالو'
            },
            statusValues: {
                'active': 'نشط',
                'draft': 'مسودة',
                'archived': 'مؤرشف'
            }
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
            archiveModalTitle: 'เก็บถาวรผลิตภัณฑ์',
            archiveModalMessage: 'ผลิตภัณฑ์นี้จะถูกย้ายไปยังส่วนที่เก็บถาวร คุณสามารถกู้คืนได้ในภายหลังหากจำเป็น',
            cancel: 'ยกเลิก',
            confirmArchiveAction: 'ใช่ เก็บถาวร',
            errorArchive: 'ข้อผิดพลาดในการเก็บถาวรผลิตภัณฑ์',
            confirmRestore: 'กู้คืนผลิตภัณฑ์นี้หรือไม่',
            restoreModalTitle: 'กู้คืนผลิตภัณฑ์',
            restoreModalMessage: 'ผลิตภัณฑ์นี้จะถูกย้ายกลับไปยังสินค้าคงคลังที่ใช้งานอยู่ของคุณเป็นฉบับร่าง จากนั้นคุณสามารถแก้ไขและเผยแพร่ได้',
            confirmRestoreAction: 'ใช่ กู้คืน',
            errorRestore: 'ข้อผิดพลาดในการกู้คืนผลิตภัณฑ์',
            loading: 'กำลังโหลด...',
            welcomeBack: 'ยินดีต้อนรับกลับ',
            partner: 'พาร์ทเนอร์',
            manageYour: 'จัดการ',
            inventory: 'สินค้าคงคลัง',
            trackPerformance: 'และติดตามประสิทธิภาพได้ในที่เดียว',
            in_location: 'ใน',
            logout: 'ออกจากระบบ',
            createWinningProduct: 'สร้างผลิตภัณฑ์ที่ชนะเลิศของคุณตอนนี้',
            supplierTypes: {
                'Hotel': 'โรงแรม',
                'Transportation': 'การขนส่ง',
                'Transport': 'การขนส่ง',
                'Land Operator': 'ผู้ให้บริการทางบก',
                'Airline': 'สายการบิน'
            },
            categoryValues: {
                'Accommodation': 'ที่พัก',
                'Transportation': 'การขนส่ง',
                'Land Operator': 'ผู้ให้บริการทางบก',
                'Airline': 'สายการบิน'
            },
            cityTranslations: {
                'Kuala Lumpur': 'Kuala Lumpur',
                'Tokyo': 'Tokyo',
                'Osaka': 'Osaka',
                'Seoul': 'Seoul',
                'Bangkok': 'Bangkok',
                'Singapore': 'Singapore',
                'Paris': 'Paris',
                'London': 'London',
                'New York': 'นิวยอร์ก',
                'Dubai': 'ดูไบ',
                'Penang': 'ปีนัง',
                'Johor Bahru': 'โจฮอร์บาห์รู',
                'Kota Kinabalu': 'โคตาคินาบาลู'
            },
            statusValues: {
                'active': 'ใช้งานอยู่',
                'draft': 'ร่าง',
                'archived': 'เก็บถาวรแล้ว'
            }
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
            archiveModalTitle: 'Lưu trữ Sản phẩm',
            archiveModalMessage: 'Sản phẩm này sẽ được chuyển đến phần đã lưu trữ. Bạn có thể khôi phục sau nếu cần.',
            cancel: 'Hủy',
            confirmArchiveAction: 'Có, Lưu trữ',
            errorArchive: 'Lỗi khi lưu trữ sản phẩm',
            confirmRestore: 'Khôi phục sản phẩm này?',
            restoreModalTitle: 'Khôi phục Sản phẩm',
            restoreModalMessage: 'Sản phẩm này sẽ được chuyển lại vào kho hàng đang hoạt động của bạn dưới dạng bản nháp. Sau đó bạn có thể chỉnh sửa và xuất bản nó.',
            confirmRestoreAction: 'Có, Khôi phục',
            errorRestore: 'Lỗi khi khôi phục sản phẩm',
            loading: 'Đang tải...',
            welcomeBack: 'Chào mừng trở lại',
            partner: 'Đối tác',
            manageYour: 'Quản lý',
            inventory: 'kho hàng',
            trackPerformance: 'và theo dõi hiệu suất tất cả ở một nơi.',
            in_location: 'tại',
            logout: 'Đăng xuất',
            createWinningProduct: 'Tạo Sản Phẩm Chiến Thắng Của Bạn Ngay',
            supplierTypes: {
                'Hotel': 'Khách sạn',
                'Transportation': 'Vận tải',
                'Transport': 'Vận tải',
                'Land Operator': 'Nhà điều hành mặt đất',
                'Airline': 'Hãng hàng không'
            },
            categoryValues: {
                'Accommodation': 'Chỗ ở',
                'Transportation': 'Vận tải',
                'Land Operator': 'Nhà điều hành mặt đất',
                'Airline': 'Hãng hàng không'
            },
            cityTranslations: {
                'Kuala Lumpur': 'Kuala Lumpur',
                'Tokyo': 'Tokyo',
                'Osaka': 'Osaka',
                'Seoul': 'Seoul',
                'Bangkok': 'Bangkok',
                'Singapore': 'Singapore',
                'Paris': 'Paris',
                'London': 'Luân Đôn',
                'New York': 'New York',
                'Dubai': 'Dubai',
                'Penang': 'Penang',
                'Johor Bahru': 'Johor Bahru',
                'Kota Kinabalu': 'Kota Kinabalu'
            },
            statusValues: {
                'active': 'ĐANG HOẠT ĐỘNG',
                'draft': 'BẢN NHÁP',
                'archived': 'ĐÃ LƯU TRỮ'
            }
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
            valid: 'Valid',
            edit: 'Edit',
            archive: 'Arsipkan',
            views: 'Dilihat',
            conversion: 'Konvers',
            wishlisted: 'Didaftarkan Keinginan',
            revenue: 'Pendapatan',
            editComingSoon: 'Fungsi edit segera hadir',
            confirmArchive: 'Apakah Anda yakin ingin mengarsipkan produk ini?',
            archiveModalTitle: 'Arsipkan Produk',
            archiveModalMessage: 'Produk ini akan dipindahkan ke bagian yang diarsipkan. Anda dapat memulihkannya nanti jika diperlukan.',
            cancel: 'Batal',
            confirmArchiveAction: 'Ya, Arsipkan',
            errorArchive: 'Kesalahan mengarsipkan produk',
            confirmRestore: 'Pulihkan produk ini?',
            restoreModalTitle: 'Pulihkan Produk',
            restoreModalMessage: 'Produk ini akan dipindahkan kembali ke inventaris aktif Anda sebagai draf. Anda kemudian dapat mengedit dan mempublikasikannya.',
            confirmRestoreAction: 'Ya, Pulihkan',
            errorRestore: 'Kesalahan memulihkan produk',
            loading: 'Memuat...',
            welcomeBack: 'Selamat kembali',
            partner: 'Mitra',
            manageYour: 'Kelola',
            inventory: 'inventaris',
            trackPerformance: 'dan lacak kinerja semuanya di satu tempat.',
            in_location: 'di',
            logout: 'Keluar',
            createWinningProduct: 'Buat Produk Unggulan Anda Sekarang',
            supplierTypes: {
                'Hotel': 'Hotel',
                'Transportation': 'Transportasi',
                'Transport': 'Transportasi',
                'Land Operator': 'Operator Darat',
                'Airline': 'Maskapai Penerbangan'
            },
            categoryValues: {
                'Accommodation': 'Akomodasi',
                'Transportation': 'Transportasi',
                'Land Operator': 'Operator Darat',
                'Airline': 'Maskapai Penerbangan'
            },
            cityTranslations: {
                'Kuala Lumpur': 'Kuala Lumpur',
                'Tokyo': 'Tokyo',
                'Osaka': 'Osaka',
                'Seoul': 'Seoul',
                'Bangkok': 'Bangkok',
                'Singapore': 'Singapura',
                'Paris': 'Paris',
                'London': 'London',
                'New York': 'New York',
                'Dubai': 'Dubai',
                'Penang': 'Penang',
                'Johor Bahru': 'Johor Bahru',
                'Kota Kinabalu': 'Kota Kinabalu'
            },
            statusValues: {
                'active': 'AKTIF',
                'draft': 'DRAF',
                'archived': 'DIARSIPKAN'
            }
        },
    }

    const content = t[language as keyof typeof t] || t['en-US']

    // Helper for city translation
    const translateCity = (cityInput: string) => {
        const city = cityInput?.trim();
        if (!city) return '';
        // console.log('translateCity called with:', city, 'Language:', language);
        const cityMap = content.cityTranslations as Record<string, string> | undefined;
        if (!cityMap) return city;

        // Direct match
        if (cityMap[city]) return cityMap[city];

        // Case-insensitive match
        const lowerCity = city.toLowerCase();
        const key = Object.keys(cityMap).find(k => k.toLowerCase() === lowerCity);
        return key ? cityMap[key] : city;
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get current user
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/auth/supplier')
                    return
                }

                // Get supplier profile
                const { data: supplierData } = await supabase
                    .from('suppliers')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (supplierData) {
                    setSupplier(supplierData)
                }

                // Get products
                const { data: productsData, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('supplier_id', user.id)
                    .order('created_at', { ascending: false })

                if (error) throw error

                if (productsData) {
                    setProducts(productsData)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [router])

    const handleArchive = async (productId: string) => {
        setProductToArchive(productId)
        setIsArchiveModalOpen(true)
    }

    const confirmArchive = async () => {
        if (!productToArchive) return

        try {
            const { error } = await supabase
                .from('products')
                .update({ status: 'archived' })
                .eq('id', productToArchive)

            if (error) throw error

            // Update local state
            setProducts(products.map(p =>
                p.id === productToArchive ? { ...p, status: 'archived' } : p
            ))
            setIsArchiveModalOpen(false)
            setProductToArchive(null)
        } catch (error) {
            console.error('Error archiving product:', error)
            alert(content.errorArchive)
        }
    }

    const handleRestore = async (productId: string) => {
        setProductToRestore(productId)
        setIsRestoreModalOpen(true)
    }

    const confirmRestore = async () => {
        if (!productToRestore) return

        try {
            const { error } = await supabase
                .from('products')
                .update({ status: 'draft' }) // Restore to draft
                .eq('id', productToRestore)

            if (error) throw error

            // Update local state
            setProducts(products.map(p =>
                p.id === productToRestore ? { ...p, status: 'draft' } : p
            ))
            setIsRestoreModalOpen(false)
            setProductToRestore(null)
            setActiveTab('active') // Switch to active tab to show restored product
        } catch (error) {
            console.error('Error restoring product:', error)
            alert(content.errorRestore)
        }
    }

    const activeProducts = products.filter(p => p.status !== 'archived')
    const historyProducts = products.filter(p => p.status === 'archived')

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            {content.welcomeBack}, {supplier?.company_name || supplier?.name || content.partner}
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            {content.manageYour} {(() => {
                                const type = supplier?.supplier_type || 'Supplier';
                                let key = '';
                                const lowerType = type.toLowerCase();

                                // Normalize supplier type
                                if (lowerType.includes('hotel') || lowerType.includes('accommodation')) key = 'Hotel';
                                else if (lowerType.includes('airline')) key = 'Airline';
                                else if (lowerType.includes('transport')) key = 'Transportation';
                                else if (lowerType.includes('land operator') || lowerType.includes('tour')) key = 'Land Operator';

                                // Try direct lookup if no key found
                                if (!key) {
                                    key = Object.keys(content.supplierTypes).find(k => k.toLowerCase() === lowerType) || '';
                                }

                                return key ? content.supplierTypes[key as keyof typeof content.supplierTypes] : type;
                            })()} {content.inventory} {content.trackPerformance}
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                        >
                            <FaSignOutAlt className="mr-2" />
                            {content.logout}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
                    {/* Active Inventory */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-6 shadow-[0_8px_0_0_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-1 border-t border-white/20">
                        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y-[-50%] rounded-full bg-white/10 blur-3xl"></div>
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-100 uppercase tracking-wider">{content.activeInventory}</p>
                                <p className="mt-2 text-5xl font-black text-white">{activeProducts.length}</p>
                            </div>
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-inner border border-white/10">
                                <FaBox className="h-8 w-8 text-yellow-300 drop-shadow-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Views */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-6 shadow-[0_8px_0_0_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-1 border-t border-white/20">
                        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y-[-50%] rounded-full bg-white/10 blur-3xl"></div>
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-100 uppercase tracking-wider">{content.views}</p>
                                <p className="mt-2 text-5xl font-black text-white">
                                    {activeProducts.reduce((acc, curr) => acc + (curr.view_count || 0), 0)}
                                </p>
                            </div>
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-inner border border-white/10">
                                <FaEye className="h-8 w-8 text-cyan-300 drop-shadow-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Wishlisted */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-6 shadow-[0_8px_0_0_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-1 border-t border-white/20">
                        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y-[-50%] rounded-full bg-white/10 blur-3xl"></div>
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-100 uppercase tracking-wider">{content.wishlisted}</p>
                                <p className="mt-2 text-5xl font-black text-white">
                                    {activeProducts.reduce((acc, curr) => acc + (curr.wishlist_count || 0), 0)}
                                </p>
                            </div>
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-inner border border-white/10">
                                <FaHeart className="h-8 w-8 text-pink-400 drop-shadow-lg" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg w-fit mb-6">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`
                            px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                            ${activeTab === 'active'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                            }
                        `}
                    >
                        {content.activeInventory}
                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                            }`}>
                            {activeProducts.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`
                            px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                            ${activeTab === 'history'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                            }
                        `}
                    >
                        {content.productHistory}
                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === 'history' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                            }`}>
                            {historyProducts.length}
                        </span>
                    </button>
                </div>

                {activeTab === 'active' ? (
                    <div className="grid grid-cols-1 gap-6">
                        {activeProducts.map((product) => (
                            <div key={product.id} className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors shadow-sm flex flex-col">
                                {/* Top Section: Details */}
                                <div className="p-6 flex flex-col md:flex-row justify-between items-start flex-grow">
                                    <div className="flex items-start space-x-4 w-full">
                                        {product.photo_urls && product.photo_urls[0] ? (
                                            <img src={product.photo_urls[0]} alt={product.product_name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                                        ) : (
                                            <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center text-muted-foreground flex-shrink-0">No Img</div>
                                        )}
                                        <div className="flex-grow min-w-0">
                                            <h3 className="text-lg font-semibold text-foreground truncate" title={product.product_name}>
                                                {(() => {
                                                    // Smart Title Logic
                                                    const type = product.product_category || supplier?.supplier_type || 'Supplier';
                                                    let key = '';
                                                    const lowerType = type.toLowerCase();

                                                    // Normalize supplier type
                                                    if (lowerType.includes('hotel') || lowerType.includes('accommodation')) key = 'Hotel';
                                                    else if (lowerType.includes('airline')) key = 'Airline';
                                                    else if (lowerType.includes('transport')) key = 'Transportation';
                                                    else if (lowerType.includes('land operator') || lowerType.includes('tour')) key = 'Land Operator';

                                                    // Try direct lookup if no key found
                                                    if (!key) {
                                                        key = Object.keys(content.supplierTypes).find(k => k.toLowerCase() === lowerType) || '';
                                                    }

                                                    const translatedType = key ? content.supplierTypes[key as keyof typeof content.supplierTypes] : type;
                                                    // Use product city if available (Hotels), otherwise fallback to supplier city (Airlines etc)
                                                    const cityToUse = product.city || supplier?.city || '';
                                                    const translatedCity = translateCity(cityToUse);

                                                    return `${translatedType} ${content.in_location} ${translatedCity}`;
                                                })()}
                                            </h3>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {translateCity(product.city)}, {new Intl.DisplayNames([language], { type: 'region' }).of(product.country_code)}
                                            </p>
                                            <div className="mt-2 flex flex-col space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                        {content.statusValues[product.status as keyof typeof content.statusValues] || product.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex flex-col space-y-2 ml-4 flex-shrink-0">
                                        <button
                                            className="px-3 py-1.5 border border-blue-500 rounded text-sm text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors w-full text-center"
                                            onClick={() => router.push(`/supplier/dashboard/products/edit/${product.id}`)}
                                        >
                                            {content.edit}
                                        </button>
                                        <button
                                            className="px-3 py-1.5 border border-border rounded text-sm text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-colors w-full text-center"
                                            onClick={() => handleArchive(product.id)}
                                        >
                                            {content.archive}
                                        </button>
                                    </div>
                                </div>

                                {/* Bottom Section: Performance Strip */}
                                <div className="bg-muted/30 border-t border-border px-6 py-3 grid grid-cols-2 gap-4">
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
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* History Tab */
                    <div className="bg-card rounded-lg p-6 border border-border">
                        <ProductHistoryTable
                            products={historyProducts}
                            onRestore={handleRestore}
                            onArchive={() => { }}
                            supplierType={supplier?.supplier_type}
                        />
                    </div>
                )}

                {/* Floating Action Button */}
                <button
                    onClick={() => router.push('/supplier/dashboard/products/create')}
                    className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-3 z-50 animate-pulse"
                >
                    <FaPlus className="h-5 w-5" />
                    <span className="text-lg font-bold">{content.createWinningProduct}</span>
                </button>

                {/* Archive Confirmation Modal */}
                {isArchiveModalOpen && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-card rounded-xl shadow-2xl max-w-md w-full border border-border overflow-hidden transform transition-all scale-100">
                            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 p-6 border-b border-border">
                                <h3 className="text-xl font-bold text-foreground flex items-center">
                                    <FaArchive className="mr-2 text-red-500" />
                                    {content.archiveModalTitle}
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-muted-foreground mb-6">
                                    {content.archiveModalMessage}
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setIsArchiveModalOpen(false)}
                                        className="px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors font-medium"
                                    >
                                        {content.cancel}
                                    </button>
                                    <button
                                        onClick={confirmArchive}
                                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md font-medium"
                                    >
                                        {content.confirmArchiveAction}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Restore Confirmation Modal */}
                {isRestoreModalOpen && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-card rounded-xl shadow-2xl max-w-md w-full border border-border overflow-hidden transform transition-all scale-100">
                            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 border-b border-border">
                                <h3 className="text-xl font-bold text-foreground flex items-center">
                                    <FaTrashRestore className="mr-2 text-green-500" />
                                    {content.restoreModalTitle}
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-muted-foreground mb-6">
                                    {content.restoreModalMessage}
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setIsRestoreModalOpen(false)}
                                        className="px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors font-medium"
                                    >
                                        {content.cancel}
                                    </button>
                                    <button
                                        onClick={confirmRestore}
                                        className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md font-medium"
                                    >
                                        {content.confirmRestoreAction}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
