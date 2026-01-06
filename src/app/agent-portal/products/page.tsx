import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'
import ProductList from '@/components/portal/ProductList'

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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <p className="text-slate-600">Missing required parameters</p>
                    <Link href="/agent-portal" className="text-blue-600 hover:underline mt-4 inline-block">
                        Return to search
                    </Link>
                </div>
            </div>
        )
    }

    // Fetch products with supplier details
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            *,
            supplier:suppliers (
                id,
                company_name,
                description,
                website_url,
                contact_email
            )
        `)
        .eq('country_code', country)
        .eq('city', city)
        .eq('status', 'active')

    console.log('[Products Page] Query params:', { country, city, type })
    console.log('[Products Page] Products fetched:', products?.length || 0)
    console.log('[Products Page] Error:', error)
    if (products && products.length > 0) {
        console.log('[Products Page] Sample product:', JSON.stringify(products[0], null, 2))
    }

    const filteredProducts = (products || []).filter((p: any) =>
        p.supplier_type?.toUpperCase() === type?.toUpperCase()
    )

    console.log('[Products Page] Filtered products:', filteredProducts.length)
    console.log('[Products Page] Filter comparison:', {
        productType: products?.[0]?.supplier_type,
        productTypeUpper: products?.[0]?.supplier_type?.toUpperCase(),
        urlType: type,
        urlTypeUpper: type?.toUpperCase(),
        match: products?.[0]?.supplier_type?.toUpperCase() === type?.toUpperCase()
    })

    // Fetch user's wishlist (handle gracefully if table doesn't exist)
    let wishlist: string[] = []
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const { data: wishlistData, error: wishlistError } = await supabase
            .from('wishlists')
            .select('product_id')
            .eq('user_id', user.id)

        if (wishlistError) {
            console.log('[Products Page] Wishlist error (table may not exist yet):', wishlistError.message)
        } else {
            wishlist = wishlistData?.map(w => w.product_id) || []
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/agent-portal/country/${country}`}
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors font-medium"
                    >
                        <FaArrowLeft /> Back to {country}
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
                        {type} in {city}
                    </h1>
                    <p className="text-slate-600">
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl p-12 text-center shadow-lg">
                        <p className="text-slate-500 text-lg mb-4">No products found matching your criteria.</p>
                        <Link
                            href={`/agent-portal/country/${country}`}
                            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                            Back to Overview
                        </Link>
                    </div>
                ) : (
                    <ProductList products={filteredProducts} initialWishlist={wishlist} />
                )}
            </div>
        </div>
    )
}
