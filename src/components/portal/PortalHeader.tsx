'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { FiLogOut } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'

interface PortalHeaderProps {
    userEmail: string | undefined
}

export default function PortalHeader({ userEmail }: PortalHeaderProps) {
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/auth/agent')
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-[1000] h-16 bg-slate-950/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6">
            {/* Logo Area */}
            <div className="flex items-center gap-3">
                <Link href="/agent-portal" className="flex items-center gap-2 group">
                    <Image
                        src="/ark-logo-icon.jpg"
                        alt="ArkAlliance Command"
                        width={32}
                        height={32}
                        className="w-10 h-10 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="font-bold text-white tracking-tight hidden sm:block">ArkAlliance <span className="text-amber-500">Command</span></span>
                </Link>
            </div>

            {/* Right Command Actions */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push('/agent-portal/community')}
                    className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
                    Vote Ideas
                </button>

                <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block"></div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden md:block">
                        <p className="text-white text-xs font-bold leading-none mb-0.5">{userEmail?.split('@')[0]}</p>
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider leading-none">Verified Agent</p>
                    </div>

                    <div className="relative group">
                        <button className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white overflow-hidden hover:border-amber-500/50 transition-colors">
                            <span className="font-bold text-xs">{userEmail?.[0]?.toUpperCase()}</span>
                        </button>

                        {/* Dropdown Menu (on hover/click simplified for now) */}
                        <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl py-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2">
                                <FiLogOut /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
