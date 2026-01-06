
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'
import SupplierCard from '@/components/portal/SupplierCard'
import ProductList from '@/components/portal/ProductList'
import { notFound } from 'next/navigation'

export default async function SupplierProfilePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    // 1. Fetch Supplier Details
    const { data: supplier, error: supplierError } = await supabase
        .from('suppliers')
        .select(`
            id,
            company_name,
            description,
            website_url,
            supplier_type,
            contact_email,
            products:products(count)
        `)
        .eq('id', id)
        .single()

    if (supplierError || !supplier) {
        notFound()
    }

    // 2. Fetch Supplier's Products
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
            *,
            supplier:suppliers (
                company_name
            )
        `)
        .eq('supplier_id', id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    // 3. Fetch Wishlist (for 'Saved' status in ProductList)
    let wishlist: string[] = []
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const { data: wishlistData } = await supabase
            .from('wishlists')
            .select('product_id')
            .eq('user_id', user.id)

        if (wishlistData) {
            wishlist = wishlistData.map(w => w.product_id)
        }
    }

    // Format for SupplierCard
    const formattedSupplier = {
        ...supplier,
        product_count: supplier.products?.[0]?.count || 0
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Navigation */}
                <div>
                    <Link href="/agent-portal" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
                        <FaArrowLeft /> Back to Command Hub
                    </Link>
                </div>

                {/* Supplier Profile Header */}
                <SupplierCard supplier={formattedSupplier} />

                {/* Active Inventory */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="text-amber-500">Active Inventory</span>
                        <span className="text-sm font-normal text-slate-500 bg-white/5 px-2 py-1 rounded">
                            {products?.length || 0} items
                        </span>
                    </h2>

                    {products && products.length > 0 ? (
                        <ProductList products={products} initialWishlist={wishlist} />
                    ) : (
                        <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                            <p className="text-slate-400">This partner has no active inventory displayed on the public exchange.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
