
import { createClient } from '@/utils/supabase/server'
import AdminCommandCenter from '@/components/admin/AdminCommandCenter'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // 1. Fetch Pending Agents
    const { data: pendingAgents } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('is_approved', false)
        .eq('role', 'pending_agent')
        .neq('verification_status', 'rejected')

    // 2. Fetch Pending Suppliers
    const { data: pendingSuppliers } = await supabase
        .from('suppliers')
        .select('*')
        .eq('is_approved', false)
        .eq('payment_status', 'completed')

    // 3. Fetch All Agents (for User Management)
    const { data: allAgents } = await supabase
        .from('agent_profiles')
        .select('*')
        .neq('role', 'admin') // Exclude super admins from list for now

    // 4. Fetch All Suppliers (for User Management)
    const { data: allSuppliers } = await supabase
        .from('suppliers')
        .select('*')

    // 5. Fetch Total Active Products
    // Using count instead of fetching all rows for performance
    const { count: activeProductsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

    return (
        <AdminCommandCenter
            pendingAgents={pendingAgents || []}
            pendingSuppliers={pendingSuppliers || []}
            allAgents={allAgents || []}
            allAgents={allAgents || []}
            allSuppliers={allSuppliers || []}
            initialActiveProductsCount={activeProductsCount || 0}
        />
    )
}
