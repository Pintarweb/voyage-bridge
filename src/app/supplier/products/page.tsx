import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GroupedProductList from '@/components/supplier/GroupedProductList'
import Link from 'next/link'
import { FaPlus } from 'react-icons/fa'

export default async function SupplierProductsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/register')
    }

    // Fetch supplier info to get supplier_type
    const { data: supplier } = await supabase
        .from('suppliers')
        .select('supplier_type')
        .eq('id', user.id)
        .single()

    // Fetch products
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('supplier_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching products:', error)
        return <div className="text-white p-8">Error loading products.</div>
    }

    // Determine grouping type based on supplier_type
    const groupingType = supplier?.supplier_type === 'HOTEL' ? 'country-city' : 'city'

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Products</h1>
                    <p className="text-gray-400 mt-2">
                        {products?.length || 0} active product{products?.length !== 1 ? 's' : ''}
                        {supplier?.supplier_type && (
                            <span className="ml-2 px-2 py-1 bg-teal-500/10 text-teal-400 text-xs rounded border border-teal-500/20">
                                {supplier.supplier_type}
                            </span>
                        )}
                    </p>
                </div>
                <Link
                    href="/supplier/dashboard/products/create"
                    className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg"
                >
                    <FaPlus />
                    Add Product
                </Link>
            </div>

            {/* Grouped Products */}
            {products && products.length > 0 ? (
                <GroupedProductList products={products} groupingType={groupingType} />
            ) : (
                <div className="bg-[#1A1A20] border border-white/10 rounded-xl p-12 text-center">
                    <p className="text-gray-400 mb-4">No products yet.</p>
                    <Link
                        href="/supplier/dashboard/products/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-lg transition-all"
                    >
                        <FaPlus />
                        Create Your First Product
                    </Link>
                </div>
            )}
        </div>
    )
}
