import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa'
import SupplierCard from '@/components/portal/SupplierCard'
import PortalSidebar from '@/components/portal/PortalSidebar'

type Supplier = {
    id: string
    company_name: string
    description: string
    website_url: string
    supplier_type: string
    city?: string
    country_code?: string
    contact_email?: string
    product_count: number
}

export default async function SupplierListPage({
    searchParams
}: {
    searchParams: Promise<{ country?: string; city?: string; type?: string }>
}) {
    const params = await searchParams
    const { country, city, type } = params
    const supabase = await createClient()

    if (!type) {
        return (
            <div className="p-8 text-white min-h-screen flex flex-col items-center justify-center">
                <p className="text-xl font-bold mb-4">Please specify a partner category</p>
                <Link href="/agent-portal" className="px-6 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition-all">
                    Return to Mission Hub
                </Link>
            </div>
        )
    }

    // Fetch suppliers matching the criteria
    let query = supabase
        .from('suppliers')
        .select(`
            id,
            company_name,
            description,
            website_url,
            supplier_type,
            contact_email,
            city,
            country_code,
            products:products(count)
        `)
        .ilike('supplier_type', type)

    const { data: suppliers } = await query

    let filteredSuppliers: Supplier[] = []

    if (country || city) {
        // Filter by location (country and/or city) through products
        let productQuery = supabase
            .from('products')
            .select('supplier_id')
            .eq('status', 'active')

        if (country) {
            productQuery = productQuery.eq('country_code', country)
        }

        if (city) {
            productQuery = productQuery.eq('city', city)
        }

        const { data: supplierIds } = await productQuery

        const validSupplierIds = new Set(supplierIds?.map((s: any) => s.supplier_id) || [])

        filteredSuppliers = (suppliers || [])
            .filter((s: any) => validSupplierIds.has(s.id))
            .map((s: any) => ({
                id: s.id,
                company_name: s.company_name,
                description: s.description || '',
                website_url: s.website_url || '',
                supplier_type: s.supplier_type,
                contact_email: s.contact_email || undefined,
                city: s.city,
                country_code: s.country_code,
                product_count: s.products?.[0]?.count || 0
            }))
    } else {
        // If no location, show all filtered by type
        filteredSuppliers = (suppliers || []).map((s: any) => ({
            id: s.id,
            company_name: s.company_name,
            description: s.description || '',
            website_url: s.website_url || '',
            supplier_type: s.supplier_type,
            contact_email: s.contact_email || undefined,
            city: s.city,
            country_code: s.country_code,
            product_count: s.products?.[0]?.count || 0
        }))
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen pt-16 bg-transparent">
            <PortalSidebar />

            <main className="flex-1 lg:ml-20 xl:ml-64 relative flex flex-col overflow-y-auto h-[calc(100vh-64px)] no-scrollbar">
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Link
                            href={country ? `/agent-portal/country/${country}` : "/agent-portal"}
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-400 mb-6 transition-all font-black uppercase tracking-[0.2em] text-[10px] group"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            {country ? `Back to ${country}` : "Return to Mission Hub"}
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-2xl mb-4">
                                    {type} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-100">
                                        {city ? `in ${city}` : (country ? `in ${country}` : "Global Network")}
                                    </span>
                                </h1>
                                <div className="flex items-center gap-4">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                        {filteredSuppliers.length} partner{filteredSuppliers.length !== 1 ? 's' : ''} active
                                    </p>
                                    {country && (
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                            Location: {country}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Supplier Grid */}
                    {filteredSuppliers.length === 0 ? (
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-20 text-center shadow-2xl animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                                <FaExternalLinkAlt className="text-amber-500 text-2xl" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">No intelligence found</h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">We couldn&apos;t find any suppliers matching these specific criteria in our current network.</p>
                            <Link
                                href="/agent-portal"
                                className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg hover:shadow-amber-500/20"
                            >
                                Start New Discovery
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            {filteredSuppliers.map((supplier) => (
                                <SupplierCard key={supplier.id} supplier={supplier} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
