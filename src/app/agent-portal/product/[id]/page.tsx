import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ProductDetailsView from '@/components/portal/ProductDetailsView'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            supplier:suppliers (
                id,
                company_name,
                contact_email,
                website_url,
                description,
                phone_number,
                address_line_1,
                city,
                country_code,
                logo_url
            )
        `)
        .eq('id', id)
        .single()

    if (error || !product) {
        console.error('Error fetching product:', error)
        return (
            <div className="p-8 text-white">
                <h1 className="text-2xl text-red-500">Error Loading Product</h1>
                <p>Product ID: {id}</p>
                <pre className="bg-gray-900 p-4 mt-4 rounded overflow-auto">
                    {JSON.stringify(error, null, 2)}
                </pre>
                {!product && <p className="mt-4 text-yellow-500">Product is null (Not Found)</p>}
            </div>
        )
    }

    return <ProductDetailsView product={product} />
}
