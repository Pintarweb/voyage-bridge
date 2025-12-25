'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FaGlobe, FaSearch, FaBell, FaShieldAlt } from 'react-icons/fa'
import LogoutButton from './LogoutButton'
import { useDebouncedCallback } from 'use-debounce'
import { createClient } from '@/utils/supabase/client'

interface AdminHeaderProps {
    unreadCount: number
    adminName?: string
    adminId?: string
}

export default function AdminHeader({ unreadCount, adminName = 'Admin User', adminId = 'SUPER_ADMIN_01' }: AdminHeaderProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Realtime Presence State
    const [onlineCount, setOnlineCount] = useState(1) // Start with 1 (self)

    useEffect(() => {
        const supabase = createClient()
        const channel = supabase.channel('online-users')

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                // Count unique user_ids
                const uniqueUsers = new Set()
                Object.values(state).forEach((presences: any) => {
                    presences.forEach((p: any) => uniqueUsers.add(p.user_id))
                })
                setOnlineCount(uniqueUsers.size || 1)
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // Initialize search from URL if present (optional)
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
        <header className="relative z-50 w-full h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 shadow-lg">
            <div className="flex items-center gap-8">
                {/* Logo Area */}
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/admin/dashboard')}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all transform group-hover:scale-105">
                        <FaShieldAlt className="text-white text-lg drop-shadow-md" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-wider text-white leading-none">
                            ARK<span className="text-cyan-400">COMMAND</span>
                        </h1>
                        <span className="text-[9px] text-white/40 font-mono tracking-[0.2em] uppercase block hover:text-cyan-300 transition-colors">Authorization Level 1</span>
                    </div>
                </div>

                {/* System Pulse */}
                <div
                    className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 cursor-help transition-colors hover:bg-green-500/20 hover:border-green-500/40"
                    title="Database Connection: Stable | API Latency: <50ms"
                >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                    <span className="text-[10px] uppercase font-bold text-green-400 tracking-wider">System Operational</span>
                </div>

                {/* Real-time Traffic */}
                <div className="flex items-center gap-2 text-xs font-mono text-blue-200" title="Currently Online Authenticated Users">
                    <FaGlobe className="text-blue-400 animate-pulse-slow" />
                    <span>Live Users: <span className="text-white font-bold">{onlineCount}</span></span>
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
                        placeholder="Omni-search: Supplier ID, Agent Name..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            handleSearch(e.target.value)
                        }}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-black/40 focus:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-[10px] text-white/20 border border-white/10 px-1.5 py-0.5 rounded">Global</span>
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button
                    className="relative p-2 text-white/60 hover:text-white transition-colors hover:bg-white/5 rounded-lg group"
                    onClick={() => {
                        const params = new URLSearchParams(searchParams.toString())
                        params.set('tab', 'user_voice')
                        router.push(`?${params.toString()}`)
                    }}
                >
                    <FaBell className="group-hover:animate-swing" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F172A] animate-ping"></span>
                    )}
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F172A]"></span>
                    )}
                </button>
                <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold text-white leading-tight">{adminName}</div>
                        <div className="text-[10px] text-cyan-400 font-mono tracking-wide">{adminId}</div>
                    </div>
                    <LogoutButton />
                </div>
            </div>
        </header>
    )
}
