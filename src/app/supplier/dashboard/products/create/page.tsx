'use client'

import { useRouter } from 'next/navigation'
import ProductForm from '@/components/supplier/product-form'
import { FaArrowLeft } from 'react-icons/fa'

export default function CreateProductPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800 bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Create New Product</h1>
                    <p className="mt-2 text-gray-400">Fill in the details below to add a new product to your inventory.</p>
                </div>

                <ProductForm onSuccess={() => router.push('/supplier/dashboard')} />
            </main>
        </div>
    )
}
