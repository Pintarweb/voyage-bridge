
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { FaArrowLeft, FaFire, FaBoxOpen } from 'react-icons/fa'
import SupplierCard from '@/components/portal/SupplierCard'
import ProductList from '@/components/portal/ProductList'
import PortalSidebar from '@/components/portal/PortalSidebar'
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
    let isSaved = false
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        // Fetch wishlist
        const { data: wishlistData } = await supabase
            .from('wishlists')
            .select('product_id')
            .eq('user_id', user.id)

        if (wishlistData) {
            wishlist = wishlistData.map(w => w.product_id)
        }

        // Fetch saved supplier status
        const { data: savedData } = await supabase
            .from('saved_suppliers')
            .select('id')
            .eq('user_id', user.id)
            .eq('supplier_id', id)
            .maybeSingle()

        if (savedData) isSaved = true
    }

    // Format for SupplierCard
    const formattedSupplier = {
        ...supplier,
        product_count: supplier.products?.[0]?.count || 0
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen pt-16 bg-transparent">
            <PortalSidebar />

            <main className="flex-1 lg:ml-20 xl:ml-64 relative flex flex-col p-8">
                <div className="max-w-7xl mx-auto w-full space-y-8">
                    {/* Navigation */}
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <Link
                            href="/agent-portal"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-amber-400 hover:bg-white/10 hover:border-amber-500/50 transition-all text-sm font-bold uppercase tracking-wider"
                        >
                            <FaArrowLeft /> Back to Command Hub
                        </Link>
                    </div>

                    {/* Supplier Profile Header */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        <SupplierCard supplier={formattedSupplier} initialIsSaved={isSaved} />
                    </div>

                    {/* Active Inventory */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                    <FaFire className="text-amber-500 text-xl animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Active Inventory</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Direct fulfillment enabled</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-400 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                                {products?.length || 0} ITEMS AVAILABLE
                            </span>
                        </div>

                        {products && products.length > 0 ? (
                            <ProductList products={products} initialWishlist={wishlist} />
                        ) : (
                            <div className="p-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
                                <div className="max-w-xs mx-auto space-y-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                        <FaBoxOpen className="text-slate-600 text-2xl" />
                                    </div>
                                    <p className="text-slate-400 font-medium">This partner has no active inventory displayed on the public exchange.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
