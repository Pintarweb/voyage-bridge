import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa'
import SupplierCard from '@/components/portal/SupplierCard'

type Supplier = {
    id: string
    company_name: string
    description: string
    website_url: string
    supplier_type: string
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

    if (!country || !city || !type) {
        return (
            <div className="p-8 text-white">
                <p>Missing required parameters</p>
                <Link href="/agent-portal" className="text-teal-400 hover:underline">
                    Return to search
                </Link>
            </div>
        )
    }

    // Fetch suppliers matching the criteria
    const { data: suppliers, error } = await supabase
        .from('suppliers')
        .select(`
            id,
            company_name,
            description,
            website_url,
            supplier_type,
            products:products(count)
        `)
        .eq('supplier_type', type)

    // Filter by city through products
    const { data: supplierIds } = await supabase
        .from('products')
        .select('supplier_id')
        .eq('country_code', country)
        .eq('city', city)
        .eq('status', 'active')

    const validSupplierIds = new Set(supplierIds?.map((s: any) => s.supplier_id) || [])

    const filteredSuppliers: Supplier[] = (suppliers || [])
        .filter((s: any) => validSupplierIds.has(s.id))
        .map((s: any) => ({
            id: s.id,
            company_name: s.company_name,
            description: s.description || '',
            website_url: s.website_url || '',
            supplier_type: s.supplier_type,
            product_count: s.products?.[0]?.count || 0
        }))

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href={`/agent-portal/country/${country}`}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <FaArrowLeft /> Back to {country}
                </Link>
                <h1 className="text-3xl font-bold text-white">
                    {type} in {city}, {country}
                </h1>
                <p className="text-gray-400 mt-2">
                    {filteredSuppliers.length} supplier{filteredSuppliers.length !== 1 ? 's' : ''} found
                </p>
            </div>

            {/* Supplier Grid */}
            {filteredSuppliers.length === 0 ? (
                <div className="bg-[#1A1A20] border border-white/10 rounded-xl p-12 text-center">
                    <p className="text-gray-400">No suppliers found matching your criteria.</p>
                    <Link
                        href="/agent-portal"
                        className="inline-block mt-4 text-teal-400 hover:text-teal-300"
                    >
                        Start a new search
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSuppliers.map((supplier) => (
                        <SupplierCard key={supplier.id} supplier={supplier} />
                    ))}
                </div>
            )}
        </div>
    )
}
