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

                <div className="flex items-center gap-4 pl-2">
                    {/* User Badge */}
                    <div className="flex items-center gap-3 bg-white/5 pl-2 pr-4 py-1.5 rounded-full border border-white/10">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center text-xs font-extrabold shadow-lg">
                            {(userEmail || 'A')[0]?.toUpperCase()}
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-slate-200 text-xs font-bold leading-none">{userEmail?.split('@')[0] || 'Agent'}</p>
                            <p className="text-slate-500 text-[9px] uppercase tracking-wider leading-none mt-0.5">Verified Agent</p>
                        </div>
                    </div>

                    {/* Direct Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-lg transition-all"
                        title="Sign Out"
                    >
                        <FiLogOut className="text-slate-400 group-hover:text-red-400 text-lg transition-colors" />
                        <span className="text-xs font-bold text-slate-400 group-hover:text-red-400 uppercase tracking-wider hidden sm:inline transition-colors">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
