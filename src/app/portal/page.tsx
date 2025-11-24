import { createClient } from '@/utils/supabase/server'
import PortalDashboard from '@/components/portal/PortalDashboard'

export default async function PortalPage() {
    const supabase = await createClient()

    // Fetch active products
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching products:', error)
        return <div className="text-white p-8">Error loading portal.</div>
    }

    return <PortalDashboard products={products || []} />
}
