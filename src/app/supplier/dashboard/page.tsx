'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import ProductHistoryTable, { Product } from '@/components/supplier/product-history/ProductHistoryTable'
import { FaPlus, FaEye, FaHeart, FaMoneyBillWave, FaChartLine } from 'react-icons/fa'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

// Mock Data for Sparklines
const MOCK_SPARK_DATA = [
    { value: 10 }, { value: 15 }, { value: 12 }, { value: 20 }, { value: 25 }, { value: 22 }, { value: 30 }
]

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<any[]>([]) // Using any for now to include analytics fields
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/auth/register')
            } else {
                setUser(user)
                fetchProducts(user.id)
            }
            setLoading(false)
        }
        checkUser()
    }, [router, supabase])

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
        if (!confirm('Are you sure you want to archive this product?')) return

        const { error } = await supabase
            .from('products')
            .update({ status: 'archived', is_archived: true, archived_at: new Date().toISOString() })
            .eq('id', id)

        if (error) {
            alert('Error archiving product')
        } else {
            fetchProducts(user.id)
        }
    }

    const handleRestore = async (id: string) => {
        if (!confirm('Restore this product? You may need to update the validity dates.')) return

        const { error } = await supabase
            .from('products')
            .update({ status: 'active', is_archived: false, archived_at: null })
            .eq('id', id)

        if (error) {
            alert('Error restoring product')
        } else {
            fetchProducts(user.id)
        }
    }

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>
    }

    const activeProducts = products.filter(p => p.status === 'active' || p.status === 'draft')
    const historyProducts = products.filter(p => p.status === 'archived')

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-gray-800 bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="text-xl font-bold text-teal-500">VoyageBridge Supplier</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-400">{user?.email}</span>
                            <button
                                onClick={() => router.push('/supplier/dashboard/products/create')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            >
                                <FaPlus className="mr-2" />
                                Create Product
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
                    <p className="mt-2 text-gray-400">Track performance and manage your active listings.</p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-700 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`${activeTab === 'active'
                                ? 'border-teal-500 text-teal-500'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Active Inventory ({activeProducts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`${activeTab === 'history'
                                ? 'border-teal-500 text-teal-500'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Product History (Archived) ({historyProducts.length})
                        </button>
                    </nav>
                </div>

                {activeTab === 'active' ? (
                    <div className="space-y-6">
                        {activeProducts.length === 0 ? (
                            <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                                <p className="text-gray-500">No active products found.</p>
                                <button
                                    onClick={() => router.push('/supplier/dashboard/products/create')}
                                    className="mt-4 text-teal-500 hover:text-teal-400 font-medium"
                                >
                                    + Create your first product
                                </button>
                            </div>
                        ) : (
                            activeProducts.map((product) => (
                                <div key={product.id} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
                                    {/* Top Section: Details */}
                                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div className="flex items-start space-x-4">
                                            {product.photo_url_1 ? (
                                                <img src={product.photo_url_1} alt={product.product_name} className="w-20 h-20 object-cover rounded-md" />
                                            ) : (
                                                <div className="w-20 h-20 bg-gray-800 rounded-md flex items-center justify-center text-gray-600">No Img</div>
                                            )}
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{product.product_name}</h3>
                                                <p className="text-sm text-gray-400">{product.city}, {product.country_code} • {product.product_category}</p>
                                                <div className="mt-2 flex flex-col space-y-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="px-2 py-0.5 rounded-full bg-teal-900 text-teal-300 text-xs font-medium">
                                                            {product.status.toUpperCase()}
                                                        </span>
                                                        <span className="text-sm font-medium text-white">
                                                            Agent Price: {product.currency} {product.agent_price}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        Valid: {product.validity_start_date} - {product.validity_end_date}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex space-x-3">
                                            <button
                                                className="px-3 py-1.5 border border-gray-600 rounded text-sm text-gray-300 hover:bg-gray-800"
                                                onClick={() => alert('Edit functionality coming soon')}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="px-3 py-1.5 border border-gray-600 rounded text-sm text-red-400 hover:bg-gray-800 hover:border-red-400"
                                                onClick={() => handleArchive(product.id)}
                                            >
                                                Archive
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bottom Section: Performance Strip */}
                                    <div className="bg-gray-800/50 border-t border-gray-800 px-6 py-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* Views + Sparkline */}
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gray-800 rounded-full text-blue-400">
                                                <FaEye />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-medium">Views</p>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg font-bold text-white">{product.view_count || 0}</span>
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
                                            <div className="p-2 bg-gray-800 rounded-full text-green-400">
                                                <FaChartLine />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-medium">Conversion</p>
                                                <p className="text-lg font-bold text-white">
                                                    {product.view_count > 0 ? ((product.booking_count / product.view_count) * 100).toFixed(1) : 0}%
                                                </p>
                                            </div>
                                        </div>

                                        {/* Wishlisted */}
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gray-800 rounded-full text-pink-400">
                                                <FaHeart />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-medium">Wishlisted</p>
                                                <p className="text-lg font-bold text-white">{product.wishlist_count || 0}</p>
                                            </div>
                                        </div>

                                        {/* Revenue */}
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gray-800 rounded-full text-yellow-400">
                                                <FaMoneyBillWave />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-medium">Revenue</p>
                                                <p className="text-lg font-bold text-white">${product.revenue || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    /* History Tab */
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
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
