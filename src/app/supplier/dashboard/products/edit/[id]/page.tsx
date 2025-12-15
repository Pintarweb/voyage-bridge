'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProductForm from '@/components/supplier/product-form'
import HotelProductForm from '@/components/supplier/HotelProductForm'
import { FaArrowLeft } from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'
import { createClient } from '@/utils/supabase/client'

export default function EditProductPage() {
    const params = useParams()
    const router = useRouter()
    const { language } = useLanguage()
    const productId = params.id as string
    const supabase = createClient()

    const [supplierType, setSupplierType] = useState<string | null>(null)
    const [supplier, setSupplier] = useState<any>(null)
    const [loadingSupplier, setLoadingSupplier] = useState(true)

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
            setLoadingSupplier(false)
        }
        fetchSupplier()
    }, [supabase])

    const t = {
        'en-US': {
            back: 'Back to Dashboard',
            greeting: 'Edit Your Product ✏️',
            instruction: 'Update your product details and save changes.',
            loading: 'Loading...'
        },
        'zh-CN': {
            back: '返回仪表板',
            greeting: '编辑您的产品 ✏️',
            instruction: '更新您的产品详情并保存更改。',
            loading: '加载中...'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    const isHotel = supplierType?.toLowerCase().includes('hotel')

    if (loadingSupplier) {
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
                    <HotelProductForm
                        supplier={supplier}
                        productId={productId}
                        onSuccess={() => router.push('/supplier/dashboard')}
                    />
                ) : (
                    <ProductForm
                        productId={productId}
                        mode="edit"
                        onSuccess={() => router.push('/supplier/dashboard')}
                    />
                )}
            </main>
        </div>
    )
}
