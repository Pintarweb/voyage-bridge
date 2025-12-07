
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Count pending agents
    const { count: pendingCount, error } = await supabase
        .from('agent_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending')
        .eq('is_approved', false)

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome to the ArkAlliance Admin Portal.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Link href="/admin/verification" className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-700">Pending Approvals</h3>
                            <span className="text-2xl">✅</span>
                        </div>
                        <p className="text-4xl font-bold text-teal-600 mt-4">
                            {pendingCount || 0}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Agents awaiting verification</p>
                    </div>
                </Link>

                <Link href="/admin/users" className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
                            <span className="text-2xl">👥</span>
                        </div>
                        <p className="text-4xl font-bold text-blue-600 mt-4">
                            -
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Manage system users</p>
                    </div>
                </Link>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-700">System Status</h3>
                        <span className="text-2xl">🖥️</span>
                    </div>
                    <div className="mt-4 flex items-center text-green-600 font-medium">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        Operational
                    </div>
                    <p className="text-sm text-gray-500 mt-2">All systems running</p>
                </div>
            </div>
        </div>
    )
}
