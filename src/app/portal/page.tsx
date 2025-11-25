import { createClient } from '@/utils/supabase/server'
import PortalDashboard from '@/components/portal/PortalDashboard'
import { redirect } from 'next/navigation'

export default async function PortalPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/supplier') // Or agent login
    }

    // Fetch agent profile
    const { data: profile } = await supabase
        .from('agent_profiles')
        .select('agency_name')
        .eq('id', user.id)
        .single()

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

    return <PortalDashboard products={products || []} agencyName={profile?.agency_name || 'Partner'} />
}
