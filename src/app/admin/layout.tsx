import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import LogoutButton from '@/components/admin/LogoutButton'
import NotificationBell from '@/components/admin/NotificationBell'
import { FaGlobe, FaSearch, FaBell, FaExclamationTriangle, FaServer, FaBolt } from 'react-icons/fa'

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

    // Task 2: Command Center Layout
    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
            {/* Global background effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            {/* 2. Global Command Header */}
            <header className="relative z-50 w-full h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 shadow-lg">
                <div className="flex items-center gap-8">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            <span className="font-bold text-white text-lg">A</span>
                        </div>
                        <h1 className="text-lg font-bold tracking-wider text-white">
                            ARK<span className="text-cyan-400">COMMAND</span>
                        </h1>
                    </div>

                    {/* System Pulse */}
                    <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                        <span className="text-[10px] uppercase font-bold text-green-400 tracking-wider">System Operational</span>
                    </div>

                    {/* Real-time Traffic */}
                    <div className="flex items-center gap-2 text-xs font-mono text-blue-200">
                        <FaGlobe className="text-blue-400" />
                        <span>Live Users: <span className="text-white font-bold">142</span></span>
                    </div>
                </div>

                {/* Omni-search */}
                <div className="flex-1 max-w-xl px-8">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaSearch className="text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Omni-search: Supplier ID, Agent Name, Transaction Hash..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-black/40 focus:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-[10px] text-white/20 border border-white/10 px-1.5 py-0.5 rounded">CMD+K</span>
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-xs font-bold text-white leading-tight">Admin User</div>
                            <div className="text-[10px] text-cyan-400 font-mono tracking-wide">SUPER_ADMIN_01</div>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative z-10">
                {/* Main Tabbed Central Workspace (Children) */}
                <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {children}
                </main>

                {/* 4. The "Future-Proof" Sidebar (Right-hand Panel) */}
                <aside className="w-80 border-l border-white/10 bg-black/20 backdrop-blur-xl flex flex-col">
                    <div className="p-5 border-b border-white/5">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Live Activity Feed</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3 items-start group">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]"></div>
                                    <div>
                                        <p className="text-xs text-white/90 leading-relaxed">
                                            <span className="text-cyan-300 font-bold">New Supplier</span> "Ocean View Hotel" registered.
                                        </p>
                                        <span className="text-[10px] text-white/30 font-mono">{i * 2} min ago</span>
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-3 items-start group">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_#ca8a04]"></div>
                                <div>
                                    <p className="text-xs text-white/90 leading-relaxed">
                                        <span className="text-amber-300 font-bold">Subscription Payment</span> received (TX-9928).
                                    </p>
                                    <span className="text-[10px] text-white/30 font-mono">15 min ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 border-b border-white/5 flex-1">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FaExclamationTriangle className="text-red-400" /> Error Watch
                        </h3>
                        {/* Red-tinted glass area */}
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 relative overflow-hidden">
                            <div className="absolute inset-0 bg-red-500/5 animate-pulse-slow pointer-events-none"></div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] text-red-300 font-mono uppercase">Database Latency</span>
                                <span className="text-xs font-bold text-red-200">12ms</span>
                            </div>
                            <div className="w-full bg-red-950/30 h-1 rounded-full overflow-hidden">
                                <div className="bg-red-500 h-full w-[15%]"></div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-red-500/10">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-red-300 font-mono uppercase">API Health</span>
                                    <span className="text-[10px] font-bold text-green-400">99.9%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 mt-auto bg-gradient-to-t from-black/40 to-transparent">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                                    <FaServer />
                                </div>
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold border border-[#0F172A]">3</span>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Message Center</div>
                                <div className="text-[10px] text-white/40">Direct inquiries pending</div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
