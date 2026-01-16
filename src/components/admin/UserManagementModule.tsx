'use client'

import { useState, useMemo } from 'react'
import { FaChevronDown, FaGlobe, FaSearch, FaUserCheck, FaUserClock, FaUserSlash, FaFilter, FaUsers, FaBuilding, FaUserTie } from 'react-icons/fa'
import UserRow from './UserRow'

interface UserManagementModuleProps {
    allAgents: any[]
    allSuppliers: any[]
    onViewUser: (user: any) => void
    onManageUser: (userId: string, action: string, type: 'Agent' | 'Supplier') => Promise<void>
}

// Tactical Helper Components
const FilterSelect = ({ label, value, onChange, options }: any) => (
    <div className="relative group/select">
        <label className="absolute -top-2 left-4 px-2 bg-slate-900 text-[11px] font-black text-slate-500 uppercase tracking-widest z-10">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="appearance-none bg-slate-950/50 border border-white/10 rounded-xl text-[12px] font-black uppercase tracking-wider text-slate-400 pl-4 pr-10 py-2.5 outline-none focus:border-indigo-500 focus:text-white hover:bg-slate-900 hover:border-white/20 cursor-pointer min-w-[160px] transition-all"
        >
            {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] pointer-events-none group-hover/select:text-indigo-400 transition-colors" />
    </div>
)

const StatMiniCard = ({ label, value, icon, color, subValue }: any) => (
    <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 group hover:border-indigo-500/20 transition-all duration-500">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${color} bg-slate-950 border border-white/5 group-hover:scale-110 transition-transform shadow-2xl`}>
                {icon}
            </div>
            {subValue && <span className="text-[12px] font-black text-slate-600 uppercase tracking-widest">{subValue}</span>}
        </div>
        <div>
            <h3 className="text-[13px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</h3>
            <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
        </div>
    </div>
)

export default function UserManagementModule({ allAgents, allSuppliers, onViewUser, onManageUser }: UserManagementModuleProps) {
    const [filterRole, setFilterRole] = useState<'all' | 'agent' | 'supplier'>('all')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'rejected' | 'frozen' | 'deactivated'>('all')
    const [localSearch, setLocalSearch] = useState('')

    // Country Helper
    const getCountryInfo = (code: string) => {
        if (!code) return { name: 'Unknown', flag: '🏳️' }
        if (code.length > 3) return { name: code, flag: '🌍' }

        try {
            const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
            const name = regionNames.of(code.toUpperCase()) || code
            const flag = code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
            return { name, flag }
        } catch (e) {
            return { name: code, flag: '🏳️' }
        }
    }

    const allUsers = useMemo(() => [
        ...allSuppliers.map(s => ({ ...s, type: 'Supplier' as const })),
        ...allAgents.map(a => ({ ...a, type: 'Agent' as const }))
    ], [allSuppliers, allAgents])

    const filteredUsers = useMemo(() => {
        return allUsers.filter(user => {
            // Role Filter
            if (filterRole !== 'all' && user.type.toLowerCase() !== filterRole) return false

            // Status Logic
            let status = 'pending'
            if (user.is_approved) {
                status = 'active'
            } else if (user.type === 'Agent') {
                if (user.verification_status === 'rejected') status = 'rejected'
            } else {
                if (user.subscription_status === 'canceled') status = 'deactivated'
                else if (user.subscription_status === 'past_due') status = 'frozen'
                else if (user.rejection_reason) status = 'rejected'
            }

            // Status Filter
            if (filterStatus !== 'all' && status !== filterStatus) return false

            // Search Filter
            if (localSearch) {
                const searchStr = localSearch.toLowerCase()
                const matches =
                    (user.company_name || user.agency_name || '').toLowerCase().includes(searchStr) ||
                    (user.email || user.contact_email || '').toLowerCase().includes(searchStr) ||
                    user.id.toLowerCase().includes(searchStr)
                if (!matches) return false
            }

            return true
        })
    }, [allUsers, filterRole, filterStatus, localSearch])

    const stats = useMemo(() => {
        const agentsCount = allAgents.length
        const suppliersCount = allSuppliers.length
        return {
            total: allUsers.length,
            agents: agentsCount,
            suppliers: suppliersCount,
            active: allUsers.filter(u => u.is_approved).length,
            pending: allUsers.filter(u => !u.is_approved && !u.rejection_reason && u.verification_status !== 'rejected').length,
            issues: allUsers.filter(u => u.rejection_reason || u.verification_status === 'rejected' || u.subscription_status === 'past_due').length
        }
    }, [allUsers, allAgents, allSuppliers])

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Sector Tabs (Strategic Navigation) */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 border-b border-white/5 pb-10">
                <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl">
                    {[
                        { id: 'all', label: 'All Entities', icon: FaGlobe, count: allUsers.length },
                        { id: 'agent', label: 'Agents', icon: FaUserTie, count: allAgents.length },
                        { id: 'supplier', label: 'Suppliers', icon: FaBuilding, count: allSuppliers.length }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterRole(tab.id as any)}
                            className={`
                                flex items-center gap-3 px-6 py-3 rounded-xl text-[14px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative overflow-hidden
                                ${filterRole === tab.id
                                    ? 'bg-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.25)]'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            <tab.icon className={`${filterRole === tab.id ? 'text-white' : 'text-slate-600'} transition-colors`} />
                            {tab.label}
                            <span className={`
                                ml-1 px-2 py-0.5 rounded-md text-[11px] border transition-colors
                                ${filterRole === tab.id ? 'bg-white/20 border-white/10 text-white' : 'bg-slate-900 border-white/5 text-slate-600'}
                            `}>
                                {tab.count}
                            </span>
                            {filterRole === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/20" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group/search">
                        <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within/search:bg-indigo-500/10 transition-all rounded-full" />
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/search:text-indigo-400 transition-colors text-xs z-20" />
                        <input
                            type="text"
                            placeholder="SEARCH INTELLIGENCE REGISTRY..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="relative z-10 bg-slate-950/50 border border-white/10 rounded-[1.25rem] text-[13px] font-black uppercase tracking-[0.1em] text-white pr-32 py-4 outline-none focus:border-indigo-500/50 focus:bg-slate-900/80 transition-all min-w-[400px] placeholder:text-slate-700 shadow-inner backdrop-blur-md"
                            style={{ paddingLeft: '4.5rem' }}
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10">
                            {localSearch && (
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-indigo-500 animate-ping" />
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Scanning</span>
                                </div>
                            )}
                            <div className="h-4 w-px bg-white/10" />
                            <kbd className="hidden sm:block text-[10px] font-black text-slate-600 bg-white/5 border border-white/5 px-2 py-1 rounded-md uppercase tracking-tighter">Enter</kbd>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tactical Stats Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatMiniCard label="Global Nodes" value={stats.total} icon={<FaUsers />} color="text-indigo-400" subValue="Across Sectors" />
                <StatMiniCard label="Active Status" value={stats.active} icon={<FaUserCheck />} color="text-emerald-400" subValue="Protocol Verified" />
                <StatMiniCard label="Awaiting Review" value={stats.pending} icon={<FaUserClock />} color="text-amber-400" subValue="Queue Depth" />
                <StatMiniCard label="Flagged Nodes" value={stats.issues} icon={<FaUserSlash />} color="text-red-400" subValue="Issue Protocol" />
            </div>

            {/* Registry Control Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/20 p-6 rounded-[2rem] border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight uppercase">Registry Ledger</h2>
                        <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest">Showing {filteredUsers.length} matched entities</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 px-4 py-2 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                        <FaFilter className="text-indigo-400 text-[10px]" />
                        <span className="text-[12px] font-black text-indigo-300 uppercase tracking-widest">Protocol Filter</span>
                    </div>
                    <FilterSelect
                        label="Override Status"
                        value={filterStatus}
                        onChange={(e: any) => setFilterStatus(e.target.value)}
                        options={[
                            { value: 'all', label: 'All Status' },
                            { value: 'active', label: 'Active' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'rejected', label: 'Rejected' },
                            { value: 'frozen', label: 'Frozen' },
                            { value: 'deactivated', label: 'Deactivated' }
                        ]}
                    />
                </div>
            </div>

            {/* High-Authority Intelligence Table */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-transparent rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.5)]">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-slate-950/80 border-b border-white/5 text-[13px] uppercase font-black tracking-[0.25em] text-slate-500">
                                    <th className="py-7 px-8">Strategic Entity</th>
                                    <th className="py-7 px-8">Contact Protocol</th>
                                    <th className="py-7 px-8 text-center">Operational Hub</th>
                                    <th className="py-7 px-8">Identity Status</th>
                                    <th className="py-7 px-8 text-right">System Override</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <UserRow
                                            key={user.id}
                                            user={user}
                                            type={user.type}
                                            onView={onViewUser}
                                            getCountryInfo={getCountryInfo}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-40 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center">
                                                    <FaSearch className="text-slate-700 text-2xl" />
                                                </div>
                                                <div className="text-[12px] font-black text-slate-600 uppercase tracking-widest">No nodes identified within filtered parameters.</div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
