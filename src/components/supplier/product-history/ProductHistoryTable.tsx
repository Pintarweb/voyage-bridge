'use client'

import { useState, useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table'
import { FaSearch, FaTrashRestore, FaArchive } from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'

export type Product = {
    id: string
    product_name: string
    product_category: string
    city: string
    country_code: string
    status: 'active' | 'draft' | 'archived'
}

interface ProductHistoryTableProps {
    products: Product[]
    onRestore: (id: string) => void
    onArchive: (id: string) => void
}

export default function ProductHistoryTable({ products, onRestore, onArchive }: ProductHistoryTableProps) {
    const [globalFilter, setGlobalFilter] = useState('')
    const { language } = useLanguage()

    const t = {
        'en-US': {
            productName: 'Product Name',
            category: 'Category',
            location: 'Location',
            price: 'Suggested Retail Price',
            status: 'Status',
            actions: 'Actions',
            searchPlaceholder: 'Search products, cities, categories...',
            noProducts: 'No products found.',
            previous: 'Previous',
            next: 'Next',
            showing: 'Showing',
            to: 'to',
            of: 'of',
            results: 'results',
            restore: 'Restore',
            archive: 'Archive',
            statusValues: {
                active: 'ACTIVE',
                draft: 'DRAFT',
                archived: 'ARCHIVED'
            }
        },
        'zh-CN': {
            productName: '产品名称',
            category: '类别',
            location: '地点',
            price: '建议零售价',
            status: '状态',
            actions: '操作',
            searchPlaceholder: '搜索产品、城市、类别...',
            noProducts: '未找到产品。',
            previous: '上一页',
            next: '下一页',
            showing: '显示',
            to: '至',
            of: '共',
            results: '条结果',
            restore: '恢复',
            archive: '归档',
            statusValues: {
                active: '活跃',
                draft: '草稿',
                archived: '已归档'
            }
        },
        'ms-MY': {
            productName: 'Nama Produk',
            category: 'Kategori',
            location: 'Lokasi',
            price: 'Harga Runcit Disyorkan',
            status: 'Status',
            actions: 'Tindakan',
            searchPlaceholder: 'Cari produk, bandar, kategori...',
            noProducts: 'Tiada produk ditemui.',
            previous: 'Sebelumnya',
            next: 'Seterusnya',
            showing: 'Menunjukkan',
            to: 'hingga',
            of: 'daripada',
            results: 'keputusan',
            restore: 'Pulihkan',
            archive: 'Arkib',
            statusValues: {
                active: 'AKTIF',
                draft: 'DRAF',
                archived: 'DIARKIBKAN'
            }
        },
        'es-ES': {
            productName: 'Nombre del Producto',
            category: 'Categoría',
            location: 'Ubicación',
            price: 'Precio de Venta Sugerido',
            status: 'Estado',
            actions: 'Acciones',
            searchPlaceholder: 'Buscar productos, ciudades, categorías...',
            noProducts: 'No se encontraron productos.',
            previous: 'Anterior',
            next: 'Siguiente',
            showing: 'Mostrando',
            to: 'a',
            of: 'de',
            results: 'resultados',
            restore: 'Restaurar',
            archive: 'Archivar',
            statusValues: {
                active: 'ACTIVO',
                draft: 'BORRADOR',
                archived: 'ARCHIVADO'
            }
        },
        'fr-FR': {
            productName: 'Nom du Produit',
            category: 'Catégorie',
            location: 'Emplacement',
            price: 'Prix de Vente Conseillé',
            status: 'Statut',
            actions: 'Actions',
            searchPlaceholder: 'Rechercher des produits, villes, catégories...',
            noProducts: 'Aucun produit trouvé.',
            previous: 'Précédent',
            next: 'Suivant',
            showing: 'Affichage de',
            to: 'à',
            of: 'sur',
            results: 'résultats',
            restore: 'Restaurer',
            archive: 'Archiver',
            statusValues: {
                active: 'ACTIF',
                draft: 'BROUILLON',
                archived: 'ARCHIVÉ'
            }
        },
        'de-DE': {
            productName: 'Produktname',
            category: 'Kategorie',
            location: 'Standort',
            price: 'Empfohlener Verkaufspreis',
            status: 'Status',
            actions: 'Aktionen',
            searchPlaceholder: 'Produkte, Städte, Kategorien suchen...',
            noProducts: 'Keine Produkte gefunden.',
            previous: 'Zurück',
            next: 'Weiter',
            showing: 'Zeige',
            to: 'bis',
            of: 'von',
            results: 'Ergebnissen',
            restore: 'Wiederherstellen',
            archive: 'Archivieren',
            statusValues: {
                active: 'AKTIV',
                draft: 'ENTWURF',
                archived: 'ARCHIVIERT'
            }
        },
        'ja-JP': {
            productName: '製品名',
            category: 'カテゴリー',
            location: '場所',
            price: '希望小売価格',
            status: 'ステータス',
            actions: 'アクション',
            searchPlaceholder: '製品、都市、カテゴリーを検索...',
            noProducts: '製品が見つかりません。',
            previous: '前へ',
            next: '次へ',
            showing: '表示中',
            to: 'から',
            of: 'の',
            results: '件の結果',
            restore: '復元',
            archive: 'アーカイブ',
            statusValues: {
                active: 'アクティブ',
                draft: '下書き',
                archived: 'アーカイブ済み'
            }
        },
        'ko-KR': {
            productName: '제품명',
            category: '카테고리',
            location: '위치',
            price: '권장 소매 가격',
            status: '상태',
            actions: '작업',
            searchPlaceholder: '제품, 도시, 카테고리 검색...',
            noProducts: '제품을 찾을 수 없습니다.',
            previous: '이전',
            next: '다음',
            showing: '표시 중',
            to: '~',
            of: '/',
            results: '결과',
            restore: '복원',
            archive: '보관',
            statusValues: {
                active: '활성',
                draft: '초안',
                archived: '보관됨'
            }
        },
        'ar-SA': {
            productName: 'اسم المنتج',
            category: 'الفئة',
            location: 'الموقع',
            price: 'سعر التجزئة المقترح',
            status: 'الحالة',
            actions: 'الإجراءات',
            searchPlaceholder: 'البحث عن المنتجات، المدن، الفئات...',
            noProducts: 'لم يتم العثور على منتجات.',
            previous: 'السابق',
            next: 'التالي',
            showing: 'عرض',
            to: 'إلى',
            of: 'من',
            results: 'نتائج',
            restore: 'استعادة',
            archive: 'أرشفة',
            statusValues: {
                active: 'نشط',
                draft: 'مسودة',
                archived: 'مؤرشف'
            }
        },
        'th-TH': {
            productName: 'ชื่อผลิตภัณฑ์',
            category: 'หมวดหมู่',
            location: 'สถานที่',
            price: 'ราคาขายปลีกที่แนะนำ',
            status: 'สถานะ',
            actions: 'การดำเนินการ',
            searchPlaceholder: 'ค้นหาผลิตภัณฑ์ เมือง หมวดหมู่...',
            noProducts: 'ไม่พบผลิตภัณฑ์',
            previous: 'ก่อนหน้า',
            next: 'ถัดไป',
            showing: 'แสดง',
            to: 'ถึง',
            of: 'จาก',
            results: 'ผลลัพธ์',
            restore: 'กู้คืน',
            archive: 'เก็บถาวร',
            statusValues: {
                active: 'ใช้งานอยู่',
                draft: 'ร่าง',
                archived: 'เก็บถาวร'
            }
        },
        'vi-VN': {
            productName: 'Tên sản phẩm',
            category: 'Danh mục',
            location: 'Địa điểm',
            price: 'Giá bán lẻ đề xuất',
            status: 'Trạng thái',
            actions: 'Hành động',
            searchPlaceholder: 'Tìm kiếm sản phẩm, thành phố, danh mục...',
            noProducts: 'Không tìm thấy sản phẩm.',
            previous: 'Trước',
            next: 'Tiếp theo',
            showing: 'Đang hiển thị',
            to: 'đến',
            of: 'trong tổng số',
            results: 'kết quả',
            restore: 'Khôi phục',
            archive: 'Lưu trữ',
            statusValues: {
                active: 'ĐANG HOẠT ĐỘNG',
                draft: 'BẢN NHÁP',
                archived: 'ĐÃ LƯU TRỮ'
            }
        },
        'id-ID': {
            productName: 'Nama Produk',
            category: 'Kategori',
            location: 'Lokasi',
            price: 'Harga Eceran yang Disarankan',
            status: 'Status',
            actions: 'Tindakan',
            searchPlaceholder: 'Cari produk, kota, kategori...',
            noProducts: 'Tidak ada produk ditemukan.',
            previous: 'Sebelumnya',
            next: 'Berikutnya',
            showing: 'Menampilkan',
            to: 'hingga',
            of: 'dari',
            results: 'hasil',
            restore: 'Pulihkan',
            archive: 'Arsipkan',
            statusValues: {
                active: 'AKTIF',
                draft: 'DRAF',
                archived: 'DIARSIPKAN'
            }
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    const columns = useMemo<ColumnDef<Product>[]>(
        () => [
            {
                accessorKey: 'product_name',
                header: content.productName,
                cell: (info) => <span className="font-medium text-foreground">{info.getValue() as string}</span>,
            },
            {
                accessorKey: 'product_category',
                header: content.category,
            },
            {
                accessorKey: 'city',
                header: content.location,
                cell: (info) => `${info.getValue()}, ${info.row.original.country_code}`,
            },

            {
                accessorKey: 'status',
                header: content.status,
                cell: (info) => {
                    const status = info.getValue() as string
                    let colorClass = 'bg-muted text-muted-foreground'
                    if (status === 'active') colorClass = 'bg-primary/10 text-primary'
                    if (status === 'archived') colorClass = 'bg-red-500/10 text-red-500'

                    const statusText = content.statusValues[status as keyof typeof content.statusValues] || status.toUpperCase()

                    return (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                            {statusText}
                        </span>
                    )
                },
            },
            {
                id: 'actions',
                header: content.actions,
                cell: (info) => {
                    const product = info.row.original
                    return (
                        <div className="flex space-x-2">
                            {product.status === 'archived' ? (
                                <button
                                    onClick={() => onRestore(product.id)}
                                    className="p-1 text-primary hover:text-primary/80"
                                    title={content.restore}
                                >
                                    <FaTrashRestore />
                                </button>
                            ) : (
                                <button
                                    onClick={() => onArchive(product.id)}
                                    className="p-1 text-red-500 hover:text-red-500/80"
                                    title={content.archive}
                                >
                                    <FaArchive />
                                </button>
                            )}
                        </div>
                    )
                },
            },
        ],
        [onRestore, onArchive, content]
    )

    const table = useReactTable({
        data: products,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="space-y-4">
            {/* Smart Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-muted-foreground" />
                </div>
                <input
                    type="text"
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder={content.searchPlaceholder}
                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="min-w-full divide-y divide-border bg-card">
                    <thead className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border">
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-muted-foreground">
                                    {content.noProducts}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted disabled:opacity-50"
                    >
                        {content.previous}
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted disabled:opacity-50"
                    >
                        {content.next}
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {content.showing} <span className="font-medium text-foreground">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> {content.to}{' '}
                            <span className="font-medium text-foreground">
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                    products.length
                                )}
                            </span>{' '}
                            {content.of} <span className="font-medium text-foreground">{products.length}</span> {content.results}
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
                            >
                                {content.previous}
                            </button>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
                            >
                                {content.next}
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}
