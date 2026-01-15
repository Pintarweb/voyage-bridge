'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaGlobe, FaSearch, FaBell, FaShieldAlt } from 'react-icons/fa'
import LogoutButton from './LogoutButton'
import { useDebouncedCallback } from 'use-debounce'
import { createClient } from '@/utils/supabase/client'

interface AdminHeaderProps {
    unreadCount: number
    liveUserCount: number
    adminName?: string
    adminId?: string
}

export default function AdminHeader({ unreadCount, liveUserCount, adminName = 'Admin User', adminId = 'SUPER_ADMIN_01' }: AdminHeaderProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize search from URL if present
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }
        router.push(`?${params.toString()}`)
    }, 300)

    return (
        <header className="relative z-50 w-full h-16 bg-slate-950/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 shadow-2xl">
            <div className="flex items-center gap-8">
                {/* Logo Area */}
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/admin')}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-all">
                        <FaShieldAlt className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tighter text-white leading-none">
                            ARK<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">COMMAND</span>
                        </h1>
                        <span className="text-[11px] text-slate-500 font-bold tracking-[0.2em] uppercase block">Admin Protocol 0.1</span>
                    </div>
                </div>

                {/* System Stats (Cinematic Pill) */}
                <div className="hidden md:flex items-center gap-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                        <span className="text-[11px] font-black text-green-400 uppercase tracking-widest">Active</span>
                    </div>
                    <div className="w-[1px] h-3 bg-white/10"></div>
                    <div className="flex items-center gap-2">
                        <FaGlobe className="text-xs text-slate-500" />
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                            Live Users: <span className="text-white">{liveUserCount}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Admin Command Search */}
            <div className="flex-1 max-w-xl px-8 hidden sm:block">
                <div className="relative group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Intelligence: Supplier ID, Agent Email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            handleSearch(e.target.value)
                        }}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all shadow-inner"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                <button
                    className="relative p-2.5 text-slate-400 hover:text-white transition-all hover:bg-white/5 rounded-xl group"
                    onClick={() => router.push('/admin?tab=user_voice')}
                >
                    <FaBell className="group-hover:scale-110 transition-transform" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-950 animate-pulse"></span>
                    )}
                </button>

                <div className="h-8 w-[1px] bg-white/5"></div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-black text-white leading-tight uppercase tracking-tight">{adminName}</div>
                        <div className="text-[11px] text-indigo-400 font-bold tracking-widest uppercase">{adminId}</div>
                    </div>
                    <LogoutButton />
                </div>
            </div>
        </header>
    )
}
