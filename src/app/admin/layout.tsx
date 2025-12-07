import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/admin/LogoutButton'

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

    // Task 1: Check role from agent_profiles
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

    // Task 2: Admin Dashboard Layout with Sidebar
    return (
        <div className="flex min-h-screen bg-gray-100">
            <nav className="w-64 bg-gray-900 text-white p-6 flex-shrink-0 flex flex-col">
                <h2 className="text-2xl font-bold mb-8 text-teal-500">ArkAlliance Admin</h2>
                <ul className="space-y-4 flex-1">
                    <li>
                        <Link href="/admin" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 hover:text-teal-400 transition-colors">
                            <span>📊</span>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/verification" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 hover:text-teal-400 transition-colors">
                            <span>✅</span>
                            <span>Verification</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/users" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 hover:text-teal-400 transition-colors">
                            <span>👥</span>
                            <span>User Management</span>
                        </Link>
                    </li>
                </ul>

                <div className="mt-auto pt-8 border-t border-gray-800 space-y-4">
                    <div className="text-sm text-gray-500">
                        Logged in as:<br />
                        <span className="text-gray-300 truncate block">{user.email}</span>
                    </div>
                    <LogoutButton />
                </div>
            </nav>
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
