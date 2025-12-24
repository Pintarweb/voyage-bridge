
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
    // 6. Fetch Unread (Pending) Feedback Count
    // We want feedback entries that do NOT have a corresponding response.
    // This requires a left join and filtering for null, or a simpler approach if we trust the structure.
    // Let's use a raw query or checking existence. 
    // Actually, simple way: fetch all feedback IDs, fetch all response feedback_ids, diff them.
    // Or better: Use remote rpc/view if complex. 
    // For now, let's just fetch all feedback and filter in JS (assuming reasonable scale < 1000 items for now).
    const { data: allFeedback } = await supabase.from('feedback_entries').select('entry_id, metric_score')
    const { data: allResponses } = await supabase.from('feedback_responses').select('feedback_id')

    const respondedIds = new Set(allResponses?.map(r => r.feedback_id));
    const unreadCount = allFeedback?.filter(f => !respondedIds.has(f.entry_id)).length || 0;
    const priorityCount = allFeedback?.filter(f => f.metric_score !== null && f.metric_score <= 2).length || 0;

    return (
        <AdminCommandCenter
            pendingAgents={pendingAgents || []}
            pendingSuppliers={pendingSuppliers || []}
            allAgents={allAgents || []}
            allSuppliers={allSuppliers || []}
            initialActiveProductsCount={activeProductsCount || 0}
            unreadCount={unreadCount || 0}
            priorityCount={priorityCount || 0}
        />
    )
}
