'use client'

import { FaColumns, FaUsers, FaShieldAlt, FaCog, FaChartLine, FaEnvelopeOpen, FaSatelliteDish, FaFingerprint } from 'react-icons/fa'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AdminSidebar() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    return (
        <aside className="hidden lg:flex flex-col w-24 xl:w-72 bg-slate-950/80 backdrop-blur-2xl border-r border-white/5 pt-12 pb-8 transition-all duration-500 h-[calc(100vh-64px)] fixed top-16 left-0 z-40 overflow-hidden">
            {/* Visual Accent Glow */}
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-indigo-500/0 via-indigo-500/20 to-indigo-500/0" />

            <div className="flex-1 space-y-2 px-4">
                <div className="px-4 mb-10">
                    <h3 className="text-[13px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Strategic Ops</h3>
                    <div className="space-y-1">
                        <SidebarItem
                            icon={<FaColumns />}
                            label="Command Center"
                            active={pathname === '/admin' && !searchParams.get('tab')}
                            href="/admin"
                            badge="Active"
                        />
                        <SidebarItem
                            icon={<FaUsers />}
                            label="Node Registry"
                            active={searchParams.get('tab') === 'users'}
                            href="/admin?tab=users"
                        />
                        <SidebarItem
                            icon={<FaShieldAlt />}
                            label="Verification"
                            active={searchParams.get('tab') === 'verifications'}
                            href="/admin?tab=verifications"
                        />
                    </div>
                </div>

                <div className="px-4">
                    <h3 className="text-[13px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Data Pipeline</h3>
                    <div className="space-y-1">
                        <SidebarItem
                            icon={<FaEnvelopeOpen />}
                            label="Intelligence"
                            active={searchParams.get('tab') === 'feedback_data'}
                            href="/admin?tab=feedback_data"
                        />
                        <SidebarItem
                            icon={<FaChartLine />}
                            label="Voice"
                            active={searchParams.get('tab') === 'user_voice'}
                            href="/admin?tab=user_voice"
                        />
                        <SidebarItem
                            icon={<FaCog />}
                            label="System Logic"
                            active={searchParams.get('tab') === 'system'}
                            href="/admin?tab=system"
                        />
                    </div>
                </div>
            </div>

            <div className="px-8 mt-auto group">
                <div className="relative p-6 rounded-3xl bg-slate-900/50 border border-white/5 text-center overflow-hidden transition-all duration-500 hover:border-indigo-500/30">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <FaFingerprint className="mx-auto text-indigo-400 mb-3 text-2xl animate-pulse" />
                    <p className="text-[13px] text-indigo-200/60 font-black uppercase tracking-[0.2em] hidden xl:block mb-1">Authorization</p>
                    <p className="text-[13px] text-white font-black uppercase hidden xl:block">Level 4 Verified</p>

                    <div className="mt-4 pt-4 border-t border-white/5 hidden xl:flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                        <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest">Systems Nominal</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}

function SidebarItem({ icon, label, active = false, href, badge }: { icon: any, label: string, active?: boolean, href?: string, badge?: string }) {
    const router = useRouter()
    return (
        <button
            onClick={() => href && router.push(href)}
            className={`
                w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden
                ${active
                    ? 'bg-indigo-600/10 text-white shadow-[0_10px_20px_rgba(79,70,229,0.05)] border border-indigo-500/20'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }
            `}
        >
            {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_15px_#6366f1]" />
            )}

            <span className={`text-lg transition-all duration-500 ${active ? 'text-indigo-400 scale-110' : 'text-slate-600 group-hover:text-indigo-300 group-hover:scale-110'}`}>
                {icon}
            </span>

            <div className="flex-1 flex items-center justify-between">
                <span className={`text-[15px] font-bold hidden xl:block uppercase tracking-tight ${active ? 'font-black' : ''}`}>
                    {label}
                </span>

                {badge && (
                    <span className="hidden xl:block px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-[12px] font-black uppercase tracking-widest border border-indigo-500/20">
                        {badge}
                    </span>
                )}
            </div>

            {!active && (
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            )}
        </button>
    )
}
