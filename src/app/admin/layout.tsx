import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Suspense } from 'react'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    // Check role from agent_profiles
    const { data: profile, error } = await supabase
        .from('agent_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    // Strict check: Must have profile AND role must be 'admin'
    if (error || !profile || profile.role !== 'admin') {
        console.error('Admin Access Denied:', { userId: user.id, role: profile?.role, error })
        redirect('/')
    }

    // Fetch Real-time Stats for Header
    const { count: agentCount } = await supabase
        .from('agent_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', true)

    const { count: supplierCount } = await supabase
        .from('suppliers')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', true)

    const liveUserCount = (agentCount || 0) + (supplierCount || 0)

    // Fetch Pending Verifications for Sidebar
    const { count: pendingAgents } = await supabase
        .from('agent_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false)
        .eq('role', 'pending_agent')
        .neq('verification_status', 'rejected')

    const { count: pendingSuppliers } = await supabase
        .from('suppliers')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false)
        .eq('payment_status', 'completed')

    const pendingTotal = (pendingAgents || 0) + (pendingSuppliers || 0)

    // Unread Notifications
    const { data: allFeedback } = await supabase.from('feedback_entries').select('entry_id, metric_score')
    const { data: allResponses } = await supabase.from('feedback_responses').select('feedback_id')
    const respondedIds = new Set(allResponses?.map((r: any) => r.feedback_id))
    const unreadCount = allFeedback?.filter((f: any) => !respondedIds.has(f.entry_id)).length || 0

    // Priority Count (High Priority Feedbacks with score <= 2)
    const priorityCount = allFeedback?.filter((f: any) => f.metric_score !== null && f.metric_score <= 2).length || 0

    return (
        <div className="relative min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden fixed">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop"
                    alt="Admin Command Hub"
                    className="w-full h-full object-cover opacity-30 scale-110 blur-[2px]"
                />
            </div>

            <div className="relative z-10 flex flex-col h-screen overflow-hidden">
                <AdminHeader
                    liveUserCount={liveUserCount}
                    unreadCount={unreadCount}
                    adminId="SUPER_ADMIN_01"
                />

                <div className="flex flex-1 overflow-hidden">
                    <Suspense fallback={<div className="w-24 xl:w-72 bg-slate-950/80 mt-16" />}>
                        <AdminSidebar
                            pendingCount={pendingTotal}
                            unreadCount={unreadCount}
                            priorityCount={priorityCount || 0}
                        />
                    </Suspense>

                    <main className="flex-1 lg:ml-24 xl:ml-72 relative flex flex-col overflow-y-auto h-[calc(100vh-64px)] no-scrollbar bg-black/20">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
