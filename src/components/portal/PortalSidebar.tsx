'use client'

import { FaColumns, FaHeart, FaHeadset, FaGem } from 'react-icons/fa'
import { usePathname, useRouter } from 'next/navigation'

export default function PortalSidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden lg:flex flex-col w-20 xl:w-64 bg-slate-950/40 backdrop-blur-xl border-r border-white/5 pt-8 pb-4 transition-all duration-300 h-[calc(100vh-64px)] fixed top-16 left-0 z-40">
            <nav className="flex-1 space-y-2 px-3">
                <SidebarItem
                    icon={<FaColumns />}
                    label="Dashboard"
                    active={pathname === '/agent-portal'}
                    href="/agent-portal"
                />
                <SidebarItem
                    icon={<FaHeart />}
                    label="Saved Suppliers"
                    active={pathname === '/agent-portal/saved-suppliers'}
                    href="/agent-portal/saved-suppliers"
                />
                <SidebarItem
                    icon={<FaHeadset />}
                    label="Agent Support"
                    href="#" // Placeholder
                />
            </nav>

            <div className="px-6 py-4 mt-auto">
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 text-center">
                    <FaGem className="mx-auto text-amber-400 mb-2 text-xl" />
                    <p className="text-xs text-amber-200 font-medium hidden xl:block">Founding Member Status Active</p>
                </div>
            </div>
        </aside>
    )
}

function SidebarItem({ icon, label, active = false, href }: { icon: any, label: string, active?: boolean, href?: string }) {
    const router = useRouter()
    return (
        <button
            onClick={() => href && router.push(href)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${active ? 'bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
            <span className={`text-xl ${active ? 'text-amber-400' : 'text-slate-500 group-hover:text-white transition-colors'}`}>
                {icon}
            </span>
            <span className={`text-sm font-medium hidden xl:block ${active ? 'font-bold' : ''}`}>
                {label}
            </span>
            {active && <div className="ml-auto w-1 h-1 rounded-full bg-amber-400 hidden xl:block shadow-[0_0_5px_#fbbf24]"></div>}
        </button>
    )
}
