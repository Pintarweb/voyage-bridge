'use client'

import { useState, useEffect } from 'react'

import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import SupplierVerificationModal from './SupplierVerificationModal'
import UserManagementModal from './UserManagementModal'
import { handleUserApproval, rejectSupplier, manageUserStatus } from '@/app/actions/admin'

import UserFeedbackModule from './UserFeedbackModule'
import { FaCheck, FaTimes, FaEllipsisV, FaBuilding, FaUserTie, FaNetworkWired, FaLock, FaUnlock, FaPowerOff, FaSync, FaBolt, FaChevronDown, FaBullhorn, FaUsers, FaShieldAlt, FaSatelliteDish } from 'react-icons/fa'

import AdminFeedbackTable from './AdminFeedbackTable'
import AdminSystemControl from './AdminSystemControl'
import UserManagementModule from './UserManagementModule'
import UserRow from './UserRow'
import VerificationModule from './VerificationModule'

// Cinematic Helper Components
const MonitorCard = ({ label, value, subtext, icon, highlight = false }: any) => (
    <div className={`
        relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-white/10 group
        ${highlight ? 'shadow-[0_20px_40px_rgba(79,70,229,0.1)]' : ''}
    `}>
        {highlight && <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px]" />}
        <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border border-white/5 bg-slate-950 group-hover:scale-110 transition-transform ${highlight ? 'text-indigo-400 border-indigo-500/20' : 'text-slate-400'}`}>
                {icon}
            </div>
        </div>
        <div>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{label}</h3>
            <div className="text-4xl font-black text-white tracking-tighter mb-2">{value}</div>
            <div className="text-[13px] text-slate-600 font-bold uppercase tracking-widest">{subtext}</div>
        </div>
    </div>
)


type Tab = 'overview' | 'verifications' | 'users' | 'user_voice' | 'feedback_data' | 'system'

interface AdminCommandCenterProps {
    pendingAgents: any[]
    pendingSuppliers: any[]
    allAgents: any[]
    allSuppliers: any[]
    initialActiveProductsCount: number
    unreadCount: number
    priorityCount: number
}

export default function AdminCommandCenter({ pendingAgents, pendingSuppliers, allAgents, allSuppliers, initialActiveProductsCount, unreadCount, priorityCount }: AdminCommandCenterProps) {
    const [activeTab, setActiveTab] = useState<Tab>('overview')
    const [isLoading, setIsLoading] = useState(false)
    const [growthTimeFrame, setGrowthTimeFrame] = useState<'day' | 'week' | 'month'>('week')
    const [growthMetric, setGrowthMetric] = useState<'views' | 'wishlisted' | 'products' | 'suppliers' | 'agents' | 'sales'>('views')

    const [selectedSupplier, setSelectedSupplier] = useState<any>(null)
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)

    // User Management State
    const [selectedManagementUser, setSelectedManagementUser] = useState<any>(null)
    const [isUserManagementModalOpen, setIsUserManagementModalOpen] = useState(false)

    // Realtime Counts (Active Only)
    const [agentCount, setAgentCount] = useState(allAgents.filter(a => a.is_approved).length)
    const [supplierCount, setSupplierCount] = useState(allSuppliers.filter(s => s.is_approved).length)
    const [activeProductsCount, setActiveProductsCount] = useState(initialActiveProductsCount)

    const supabase = createClient()
    const router = useRouter()

    // Sync state with props
    useEffect(() => {
        setAgentCount(allAgents.filter(a => a.is_approved).length)
        setSupplierCount(allSuppliers.filter(s => s.is_approved).length)
        setActiveProductsCount(initialActiveProductsCount)
    }, [allAgents, allSuppliers, initialActiveProductsCount])

    // Realtime Subscription
    useEffect(() => {
        const channel = supabase
            .channel('admin-dashboard-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_profiles' }, () => {
                router.refresh()
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'suppliers' }, () => {
                router.refresh()
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
                router.refresh()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, router])

    // Mock Data Generator for Platform Growth
    const getGrowthData = () => {
        // Deterministic mock data based on metric
        let baseData: number[] = []
        switch (growthMetric) {
            case 'views': baseData = [45, 60, 75, 50, 80, 95, 70]; break
            case 'wishlisted': baseData = [20, 35, 25, 40, 30, 50, 45]; break
            case 'products': baseData = [10, 15, 12, 18, 20, 25, 22]; break
            case 'suppliers': baseData = [5, 8, 4, 6, 9, 12, 10]; break
            case 'agents': baseData = [12, 18, 15, 22, 28, 35, 30]; break
            case 'sales': baseData = [30, 45, 40, 55, 60, 75, 65]; break
        }

        // Adjust for timeframe
        if (growthTimeFrame === 'day') {
            // Simulate hourly data (24h compressed to 7 bars for simplicity in this view)
            return baseData.map(v => Math.floor(v * 0.2))
        } else if (growthTimeFrame === 'month') {
            // Simulate weekly data for the month (4 weeks)
            return baseData.slice(0, 4).map(v => Math.min(100, Math.floor(v * 1.5)))
        }
        return baseData
    }

    const growthLabels = {
        day: ['00', '04', '08', '12', '16', '20', '24'],
        week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        month: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    }

    const currentGrowthData = getGrowthData()
    const currentGrowthLabels = growthLabels[growthTimeFrame]

    const handleVerification = async (type: 'agent' | 'supplier', id: string, status: 'approved' | 'rejected') => {
        if (type === 'supplier' && status === 'approved') {
            // For suppliers, rely on the modal for approval logic (or fallback here if triggered directly)
            // But the UI buttons will now trigger Open Modal.
            // If this function is called directly with 'supplier', it might be legacy or direct action.
            // Let's modify the UI instead to call openModal.
        }

        if (!confirm(`Are you sure you want to ${status} this ${type}?`)) return
        setIsLoading(true)

        try {
            if (type === 'agent') {
                await supabase.from('agent_profiles').update({
                    verification_status: status,
                    is_approved: status === 'approved',
                    role: status === 'approved' ? 'agent' : 'pending_agent'
                }).eq('id', id)
            } else {
                if (status === 'rejected') {
                    await supabase.from('suppliers').update({ is_approved: false }).eq('id', id)
                } else {
                    await supabase.from('suppliers').update({ is_approved: true }).eq('id', id)
                }
            }
            router.refresh()
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Failed to update status')
        } finally {
            setIsLoading(false)
        }
    }

    const openVerificationModal = (supplier: any) => {
        setSelectedSupplier(supplier)
        setIsVerificationModalOpen(true)
    }

    const handleModalApprove = async (id: string, data: any) => {
        try {
            // Updated to use Server Action which handles DB update, Email, & Password Reset
            const response = await handleUserApproval(
                id,
                'supplier',
                selectedSupplier?.contact_email || '',
                {
                    riskLevel: data.riskLevel,
                    internalNotes: data.internalNotes,
                    checklist: data.checklist
                }
            )

            if (!response.success) {
                throw new Error(response.error)
            }

            router.refresh()
        } catch (error: any) {
            console.error('Error approving supplier:', error)
            alert(`Failed to approve supplier: ${error.message || 'Unknown error'}`)
        }
    }

    const handleModalReject = async (id: string, data: any) => {
        try {
            const response = await rejectSupplier(id, data.reason)

            if (!response.success) {
                throw new Error(response.error)
            }
            router.refresh()
        } catch (error: any) {
            console.error('Error rejecting supplier:', error)
            alert(`Failed to reject supplier: ${error.message || 'Unknown error'}`)
        }
    }

    const handleModalRequestInfo = async (id: string, data: any) => {
        alert('Info request sent! (Mock)')
        // Implement email logic here
    }

    const handleManagementAction = async (userId: string, action: string, type: 'Agent' | 'Supplier') => {
        const result = await manageUserStatus(userId, action as any, type)
        if (result.success) {
            alert(result.message)
            router.refresh()
        } else {
            alert(`Action failed: ${result.error}`)
        }
    }

    // Filter Logic
    const allUsers = [...allSuppliers.map(s => ({ ...s, type: 'Supplier' as const })), ...allAgents.map(a => ({ ...a, type: 'Agent' as const }))]

    const searchParams = useSearchParams()
    const searchQuery = searchParams.get('q')?.toLowerCase() || ''
    const tabParam = searchParams.get('tab')

    // Effect to switch to search tab if query exists or tab param matches
    useEffect(() => {
        if (searchQuery) {
            setActiveTab('search_results' as any)
        } else if (tabParam && ['overview', 'verifications', 'users', 'user_voice', 'feedback_data', 'system'].includes(tabParam)) {
            setActiveTab(tabParam as any)
        } else if (activeTab === 'search_results' as any) {
            setActiveTab('overview')
        }
    }, [searchQuery, tabParam])

    // Search Logic
    const searchResults = searchQuery
        ? allUsers.filter(u =>
            (u.company_name || u.agency_name || '').toLowerCase().includes(searchQuery) ||
            (u.email || u.contact_email || '').toLowerCase().includes(searchQuery) ||
            u.id.toLowerCase().includes(searchQuery)
        )
        : []

    // Country Helper
    const getCountryInfo = (code: string) => {
        if (!code) return { name: 'Unknown', flag: '🏳️' }
        // If code is likely a full name (longer than 3 chars), just return it as name with generic flag
        if (code.length > 3) return { name: code, flag: '🌍' }

        try {
            const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
            const name = regionNames.of(code.toUpperCase()) || code
            // Simple flag emoji generator from char code
            const flag = code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
            return { name, flag }
        } catch (e) {
            return { name: code, flag: '🏳️' }
        }
    }

    const handleViewUser = (user: any) => {
        setSelectedManagementUser(user)
        setIsUserManagementModalOpen(true)
    }

    return (
        <div className="h-full flex flex-col pt-4">
            {/* Header Title Section */}
            <div className="mb-8 px-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
                    Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-100">Hub</span>
                </h2>
                <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[13px]">Strategic Platform Intelligence • Session Active</p>
            </div>

            {/* Tab Navigation (Tactical Design) */}
            <div className="px-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div className="flex items-center space-x-2 bg-slate-900/40 backdrop-blur-xl p-1.5 rounded-2xl w-fit border border-white/5 shadow-2xl">
                    {[
                        { id: 'overview', label: 'Monitor', icon: FaNetworkWired, iconColor: 'text-indigo-400', count: null },
                        { id: 'verifications', label: 'Verifications', icon: FaCheck, iconColor: 'text-emerald-400', count: pendingAgents.length + pendingSuppliers.length },
                        { id: 'users', label: 'Network', icon: FaUsers, iconColor: 'text-blue-400', count: null },
                        { id: 'user_voice', label: 'Voice', icon: FaBullhorn, iconColor: 'text-purple-400', count: unreadCount },
                        { id: 'feedback_data', label: 'Intelligence', icon: FaEllipsisV, iconColor: 'text-amber-400', count: priorityCount, countColor: 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]' },
                        { id: 'system', label: 'Control', icon: FaPowerOff, iconColor: 'text-slate-400', count: null },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                if (tab.id === 'overview') {
                                    router.push('/admin')
                                } else {
                                    router.push(`/admin?tab=${tab.id}`)
                                }
                                setActiveTab(tab.id as Tab)
                            }}
                            className={`
                                overflow-hidden relative group px-6 py-2.5 rounded-xl text-[13px] font-black uppercase tracking-widest transition-all flex items-center gap-3
                                ${activeTab === tab.id
                                    ? 'bg-indigo-600/10 text-white border border-indigo-500/20 shadow-[0_10px_20px_rgba(79,70,229,0.1)]'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            <tab.icon className={`${activeTab === tab.id ? tab.iconColor : 'text-slate-600 group-hover:text-indigo-400'} transition-colors`} />
                            {tab.label}
                            {tab.count !== null && tab.count > 0 && (
                                <span className={`text-[12px] font-black px-2 py-0.5 rounded-md ${(tab as any).countColor || 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]'}`}>
                                    {tab.count}
                                </span>
                            )}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 px-6 overflow-y-auto no-scrollbar pb-20">
                {/* Module Overview */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MonitorCard
                                label="Network Scale"
                                value={agentCount + supplierCount}
                                subtext={`${agentCount} Agents • ${supplierCount} Partners`}
                                icon={<FaUsers className="text-indigo-400" />}
                            />
                            <MonitorCard
                                label="Pending Items"
                                value={pendingAgents.length + pendingSuppliers.length}
                                subtext="Awaiting Protocol Review"
                                icon={<FaShieldAlt className="text-amber-400" />}
                                highlight={true}
                            />
                            <MonitorCard
                                label="Market Inventory"
                                value={activeProductsCount}
                                subtext="Verified Assets Live"
                                icon={<FaSatelliteDish className="text-blue-400" />}
                            />
                            <MonitorCard
                                label="Uptime Status"
                                value="99.9%"
                                subtext="System Operational"
                                icon={<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-base font-black text-slate-500 uppercase tracking-widest">Real-time Activity Pipeline</h3>
                                    <span className="text-[11px] text-indigo-400 font-bold uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Live Sync</span>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                                            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-indigo-400 border border-white/5 group-hover:scale-110 transition-transform">
                                                <FaNetworkWired className="text-xs" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">Protocol Entry #{1000 + i} Captured</div>
                                                <div className="text-[13px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Automated Traffic Log • Strategic Hub</div>
                                            </div>
                                            <div className="text-[11px] font-mono text-slate-500">{i * 5}m ago</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col">
                                <div className="flex justify-between items-start mb-6 gap-4">
                                    <h3 className="text-lg font-bold text-white">Platform Growth</h3>
                                    <div className="flex gap-2">
                                        <div className="relative group/select">
                                            <select
                                                value={growthMetric}
                                                onChange={(e) => setGrowthMetric(e.target.value as any)}
                                                className="appearance-none bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-white/70 pl-3 pr-8 py-1.5 outline-none focus:border-cyan-500 focus:text-white hover:bg-white/10 hover:border-white/20 cursor-pointer min-w-[120px] transition-all [&>option]:bg-[#0a0a0a] [&>option]:text-white"
                                            >
                                                <option value="views">Views</option>
                                                <option value="wishlisted">Wishlisted</option>
                                                <option value="products">Products</option>
                                                <option value="suppliers">Suppliers</option>
                                                <option value="agents">Agents</option>
                                                <option value="sales">Sales</option>
                                            </select>
                                            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none group-hover/select:text-cyan-400 transition-colors" />
                                        </div>
                                        <div className="flex bg-black/30 border border-white/10 rounded-lg p-0.5">
                                            {(['day', 'week', 'month'] as const).map((tf) => (
                                                <button
                                                    key={tf}
                                                    onClick={() => setGrowthTimeFrame(tf)}
                                                    className={`px-3 py-1 text-xs rounded-md transition-all ${growthTimeFrame === tf ? 'bg-cyan-500 text-white font-bold' : 'text-white/40 hover:text-white'}`}
                                                >
                                                    {tf.charAt(0).toUpperCase() + tf.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="h-48 flex items-end justify-between px-2 gap-2 mt-auto">
                                    {currentGrowthData.map((h, i) => {
                                        const gradients = [
                                            'from-pink-500 via-purple-500 to-indigo-500',
                                            'from-purple-500 via-indigo-500 to-blue-500',
                                            'from-indigo-500 via-blue-500 to-cyan-400',
                                            'from-blue-500 via-cyan-500 to-teal-400',
                                            'from-cyan-500 via-teal-500 to-emerald-400',
                                            'from-teal-500 via-emerald-500 to-green-400',
                                            'from-emerald-500 via-green-500 to-lime-400'
                                        ]
                                        const barGradient = gradients[i % gradients.length]

                                        return (
                                            <div key={i} className="w-full bg-white/5 rounded-t-xl relative group h-full">
                                                <div
                                                    style={{ height: `${h}%` }}
                                                    className={`w-full absolute bottom-0 bg-gradient-to-t ${barGradient} rounded-t-xl transition-all duration-500 opacity-80 group-hover:opacity-100 shadow-[0_0_20px_rgba(255,255,255,0.1)]`}
                                                >
                                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-20 shadow-xl">
                                                        {h} {growthMetric}
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-white/40 font-mono">
                                    {currentGrowthLabels.map((l, i) => (
                                        <span key={i} className="w-full text-center">{l}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Module A: Verifications */}
                {activeTab === 'verifications' && (
                    <VerificationModule
                        pendingAgents={pendingAgents}
                        pendingSuppliers={pendingSuppliers}
                        onVerify={handleVerification}
                        onOpenModal={openVerificationModal}
                        isLoading={isLoading}
                    />
                )}

                {/* Module B: User Management */}
                {activeTab === 'users' && (
                    <UserManagementModule
                        allAgents={allAgents}
                        allSuppliers={allSuppliers}
                        onViewUser={handleViewUser}
                        onManageUser={handleManagementAction}
                    />
                )}

                {/* Module C: User Voice (Visual High Level) */}
                {activeTab === 'user_voice' && (
                    <UserFeedbackModule />
                )}

                {/* Module E: Feedback Data Table (Raw Data) */}
                {activeTab === 'feedback_data' && (
                    <AdminFeedbackTable />
                )}

                {/* Search Results Module */}
                {(activeTab as any) === 'search_results' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight uppercase">Intelligence Scan</h2>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Registry Match for "{searchQuery}"</p>
                            </div>
                        </div>

                        {searchResults.length === 0 ? (
                            <div className="text-center py-32 bg-slate-900/40 backdrop-blur-xl border border-dashed border-white/10 rounded-3xl">
                                <h3 className="text-xl font-black text-white uppercase mb-2">No Records Found</h3>
                                <p className="text-slate-500 text-sm font-medium">Verify your query and re-initialize scan.</p>
                            </div>
                        ) : (
                            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-950 border-b border-white/5 text-[10px] uppercase font-black tracking-widest text-slate-500">
                                            <th className="py-5 px-6">Entity</th>
                                            <th className="py-5 px-6">Contact Logic</th>
                                            <th className="py-5 px-6">Role Protocol</th>
                                            <th className="py-5 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchResults.map(user => (
                                            <UserRow
                                                key={user.id}
                                                user={user}
                                                type={user.type}
                                                onView={handleViewUser}
                                                getCountryInfo={getCountryInfo}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Module D: System Control */}
                {activeTab === 'system' && (
                    <AdminSystemControl />
                )}
            </div>

            <SupplierVerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                supplier={selectedSupplier}
                onApprove={handleModalApprove}
                onReject={handleModalReject}
                onRequestInfo={handleModalRequestInfo}
            />

            <UserManagementModal
                isOpen={isUserManagementModalOpen}
                onClose={() => setIsUserManagementModalOpen(false)}
                user={selectedManagementUser}
                type={selectedManagementUser?.type || 'Agent'}
                onUpdateStatus={(id, action) => handleManagementAction(id, action, selectedManagementUser?.type || 'Agent')}
            />
        </div>
    )
}
