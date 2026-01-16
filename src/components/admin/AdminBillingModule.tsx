'use client'

import React, { useState, useEffect } from 'react'
import { FaCreditCard, FaArrowUp, FaUsers, FaDollarSign, FaSearch, FaFilter, FaFileInvoiceDollar, FaExternalLinkAlt } from 'react-icons/fa'
import { getBillingStats } from '@/app/actions/billing'

export default function AdminBillingModule() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        const loadStats = async () => {
            const data = await getBillingStats()
            setStats(data)
            setLoading(false)
        }
        loadStats()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 italic">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mb-4"></div>
                Analyzing Financial Protocol...
            </div>
        )
    }

    const filteredSubs = stats.subscriptions.filter((s: any) => {
        const matchesSearch = s.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === 'all' || s.status === filterStatus
        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <BillingCard
                    label="Current MRR"
                    value={`$${stats.mrr.toLocaleString()}`}
                    subtext="+12.5% from last month"
                    icon={<FaDollarSign className="text-emerald-400" />}
                    trend="up"
                />
                <BillingCard
                    label="Active Subs"
                    value={stats.activeSubscriptions}
                    subtext="Full Protocol Access"
                    icon={<FaUsers className="text-indigo-400" />}
                />
                <BillingCard
                    label="Trialing"
                    value={stats.trialingSubscriptions}
                    subtext="Potential Conversion"
                    icon={<FaCreditCard className="text-amber-400" />}
                />
                <BillingCard
                    label="Est. Annual"
                    value={`$${(stats.mrr * 12).toLocaleString()}`}
                    subtext="Current Run-rate projection"
                    icon={<FaArrowUp className="text-blue-400" />}
                />
            </div>

            {/* Controls & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
                    <input
                        type="text"
                        placeholder="Search Entity Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                        style={{ paddingLeft: '4.5rem' }}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex bg-slate-950/50 p-1 rounded-xl border border-white/5">
                        {['all', 'active', 'trialing', 'canceled'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subscription Table */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 border-b border-white/5 text-[10px] uppercase font-black tracking-widest text-slate-500">
                            <th className="py-5 px-6">Company / Entity</th>
                            <th className="py-5 px-6">Protocol Status</th>
                            <th className="py-5 px-6 text-center">Slots</th>
                            <th className="py-5 px-6">Monthly MRR</th>
                            <th className="py-5 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredSubs.map((sub: any) => (
                            <tr key={sub.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="py-5 px-6">
                                    <div className="font-bold text-white uppercase tracking-tight">{sub.companyName || 'Unknown Entity'}</div>
                                    <div className="text-[10px] text-slate-500 font-mono mt-1">ID: {sub.id.substring(0, 8)}...</div>
                                </td>
                                <td className="py-5 px-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${sub.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                        sub.status === 'trialing' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                            'bg-red-500/10 border-red-500/20 text-red-400'
                                        }`}>
                                        {sub.status || 'inactive'}
                                    </span>
                                </td>
                                <td className="py-5 px-6 text-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/50 border border-white/5">
                                        <FaFileInvoiceDollar className="text-slate-500 text-[10px]" />
                                        <span className="text-sm font-bold text-white">{sub.slots}</span>
                                    </div>
                                </td>
                                <td className="py-5 px-6">
                                    <div className="text-lg font-black text-white">${sub.monthlyFee}</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">USD / Monthly</div>
                                </td>
                                <td className="py-5 px-6 text-right">
                                    <button className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                        <FaExternalLinkAlt className="text-xs" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredSubs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-20 text-center text-slate-500 italic">No financial records match the current scan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function BillingCard({ label, value, subtext, icon, trend }: { label: string, value: string | number, subtext: string, icon: React.ReactNode, trend?: 'up' | 'down' }) {
    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all text-left">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-6xl">
                {icon}
            </div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-lg">
                    {icon}
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</span>
            </div>
            <div className="text-3xl font-black text-white tracking-tighter mb-1">{value}</div>
            <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500'}`}>
                    {subtext}
                </span>
            </div>
        </div>
    )
}
