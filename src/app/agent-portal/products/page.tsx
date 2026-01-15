import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { FaArrowLeft, FaBoxOpen, FaInfoCircle } from 'react-icons/fa'
import ProductList from '@/components/portal/ProductList'
import PortalSidebar from '@/components/portal/PortalSidebar'

export default async function ProductsPage({
    searchParams
}: {
    searchParams: Promise<{ country?: string; city?: string; type?: string }>
}) {
    const params = await searchParams
    const { country, city, type } = params
    const supabase = await createClient()

    if (!country || !city || !type) {
        return (
            <div className="p-8 text-white min-h-screen flex flex-col items-center justify-center">
                <p className="text-xl font-bold mb-4">Missing mission parameters</p>
                <Link href="/agent-portal" className="px-6 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition-all">
                    Return to Mission Hub
                </Link>
            </div>
        )
    }

    // Fetch products with supplier details (ensuring we get supplier_type for filtering)
    const { data: products } = await supabase
        .from('products')
        .select(`
            *,
            supplier:suppliers (
                id,
                company_name,
                description,
                website_url,
                contact_email,
                supplier_type
            )
        `)
        .eq('country_code', country)
        .eq('city', city)
        .eq('status', 'active')

    // Filter products by the requested category (case-insensitive)
    const filteredProducts = (products || []).filter((p: any) => {
        const productCategory = p.product_category?.toUpperCase()
        const supplierType = p.supplier?.supplier_type?.toUpperCase()
        const targetType = type.toUpperCase()

        return productCategory === targetType || supplierType === targetType
    })

    // Fetch user's wishlist
    let wishlist: string[] = []
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const { data: wishlistData } = await supabase
            .from('wishlists')
            .select('product_id')
            .eq('user_id', user.id)

        wishlist = wishlistData?.map(w => w.product_id) || []
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen pt-16 bg-transparent">
            <PortalSidebar />

            <main className="flex-1 lg:ml-20 xl:ml-64 relative flex flex-col overflow-y-auto h-[calc(100vh-64px)] no-scrollbar">
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

                    {/* Cinematic Header */}
                    <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Link
                            href={`/agent-portal/country/${country}`}
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-400 mb-6 transition-all font-black uppercase tracking-[0.2em] text-[10px] group"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            Back to {country} Overview
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-2xl mb-4">
                                    {type} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-100">in {city}</span>
                                </h1>
                                <div className="flex items-center gap-4">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                        <FaBoxOpen className="text-amber-500" />
                                        {filteredProducts.length} Active Asset{filteredProducts.length !== 1 ? 's' : ''} Identified
                                    </p>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                        Location Verified: {city}, {country}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {filteredProducts.length === 0 ? (
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-20 text-center shadow-2xl animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                                <FaInfoCircle className="text-amber-500 text-2xl" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">No active inventory found</h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">This regional hub currently has 0 active {type.toLowerCase()} listings. Check back soon for updated network availability.</p>
                            <Link
                                href={`/agent-portal/country/${country}`}
                                className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg hover:shadow-amber-500/20"
                            >
                                Back to Sector Overview
                            </Link>
                        </div>
                    ) : (
                        <div className="pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <ProductList products={filteredProducts} initialWishlist={wishlist} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
