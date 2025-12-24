'use client'

import { useState, useEffect } from 'react'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import SupplierVerificationModal from './SupplierVerificationModal'
import UserManagementModal from './UserManagementModal'
import { handleUserApproval, rejectSupplier, manageUserStatus } from '@/app/actions/admin'

import UserFeedbackModule from './UserFeedbackModule'
import { FaCheck, FaTimes, FaEllipsisV, FaBuilding, FaUserTie, FaNetworkWired, FaLock, FaUnlock, FaPowerOff, FaSync, FaBolt, FaChevronDown, FaBullhorn } from 'react-icons/fa'

import AdminFeedbackTable from './AdminFeedbackTable'

type Tab = 'overview' | 'verifications' | 'users' | 'user_voice' | 'feedback_data' | 'system'

interface AdminCommandCenterProps {
    pendingAgents: any[]
    pendingSuppliers: any[]
    allAgents: any[]
    allSuppliers: any[]
    initialActiveProductsCount: number
    unreadCount: number
}

export default function AdminCommandCenter({ pendingAgents, pendingSuppliers, allAgents, allSuppliers, initialActiveProductsCount, unreadCount }: AdminCommandCenterProps) {
    const [activeTab, setActiveTab] = useState<Tab>('overview')
    const [isLoading, setIsLoading] = useState(false)
    const [growthTimeFrame, setGrowthTimeFrame] = useState<'day' | 'week' | 'month'>('week')
    const [growthMetric, setGrowthMetric] = useState<'views' | 'wishlisted' | 'products' | 'suppliers' | 'agents' | 'sales'>('views')

    const [selectedSupplier, setSelectedSupplier] = useState<any>(null)
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)

    // User Management State
    const [selectedManagementUser, setSelectedManagementUser] = useState<any>(null)
    const [isUserManagementModalOpen, setIsUserManagementModalOpen] = useState(false)
    const [filterRole, setFilterRole] = useState<'all' | 'agent' | 'supplier'>('all')
    const [filterLocation, setFilterLocation] = useState<string>('all')

    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'rejected'>('all')

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

    const uniqueLocations = Array.from(new Set(allUsers.map(u => u.country || u.country_code || 'Unknown'))).sort()

    const filteredUsers = allUsers.filter(user => {
        if (filterRole !== 'all' && user.type.toLowerCase() !== filterRole) return false

        const userLoc = user.country || user.country_code || 'Unknown'
        if (filterLocation !== 'all' && userLoc !== filterLocation) return false

        let status = 'pending'
        if (user.is_approved) {
            status = 'active'
        } else if (user.type === 'Agent') {
            if (user.verification_status === 'rejected') status = 'rejected'
        } else {
            // Supplier Logic
            if (user.subscription_status === 'canceled') status = 'deactivated'
            else if (user.subscription_status === 'past_due') status = 'frozen' // Maps to 'frozen' action
            else if (user.rejection_reason) status = 'rejected'
        }

        if (filterStatus !== 'all' && status !== filterStatus) return false

        return true
    })

    const UserRow = ({ user, type }: { user: any, type: 'Agent' | 'Supplier' }) => (
        <tr
            onClick={() => {
                setSelectedManagementUser(user)
                setIsUserManagementModalOpen(true)
            }}
            className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
        >
            <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type === 'Agent' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {type === 'Agent' ? <FaUserTie /> : <FaBuilding />}
                    </div>
                    <div>
                        <div className="font-bold text-white text-sm">{user.company_name || user.agency_name || 'N/A'}</div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest">{type}</div>
                    </div>
                </div>
            </td>
            <td className="py-4 px-4 text-sm text-white/70">{user.email || user.contact_email}</td>
            <td className="py-4 px-4 text-sm text-white/70">
                <div className="flex items-center gap-2">
                    <span>{getCountryInfo(user.country_code || user.country).flag}</span>
                    <span>{getCountryInfo(user.country_code || user.country).name}</span>
                </div>
            </td>
            <td className="py-4 px-4">
                {(() => {
                    let status = 'pending'
                    let statusClasses = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'

                    if (user.is_approved) {
                        status = 'active'
                        statusClasses = 'bg-green-500/10 text-green-400 border-green-500/20'
                    } else if (type === 'Agent') {
                        if (user.verification_status === 'rejected') {
                            status = 'rejected'
                            statusClasses = 'bg-red-500/10 text-red-400 border-red-500/20'
                        }
                    } else {
                        // Supplier
                        if (user.subscription_status === 'canceled') {
                            status = 'deactivated'
                            statusClasses = 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        } else if (user.subscription_status === 'past_due') {
                            status = 'frozen'
                            statusClasses = 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        } else if (user.rejection_reason) {
                            status = 'rejected'
                            statusClasses = 'bg-red-500/10 text-red-400 border-red-500/20'
                        }
                    }

                    return (
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${statusClasses}`}>
                            {status}
                        </span>
                    )
                })()}
            </td>
            <td className="py-4 px-4 text-right">
                <button className="p-2 text-white/40 hover:text-white transition-colors">
                    <FaEllipsisV />
                </button>
            </td>
        </tr>
    )

    return (
        <div className="h-full flex flex-col">
            {/* Tab Navigation */}
            <div className="flex items-center space-x-1 mb-8 bg-black/20 p-1 rounded-xl w-fit border border-white/10 backdrop-blur-sm">
                {[
                    { id: 'overview', label: 'Overview', icon: FaNetworkWired, count: null },
                    { id: 'verifications', label: 'Verifications', icon: FaCheck, count: pendingAgents.length + pendingSuppliers.length },
                    { id: 'users', label: 'User Management', icon: FaNetworkWired, count: null },
                    { id: 'user_voice', label: 'User Voice', icon: FaBullhorn, count: unreadCount },
                    { id: 'feedback_data', label: 'Data View', icon: FaEllipsisV, count: null },
                    { id: 'system', label: 'System Control', icon: FaPowerOff, count: null },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`
                            relative px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2
                            ${activeTab === tab.id
                                ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10'
                                : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                            }
                        `}
                    >
                        <tab.icon className={activeTab === tab.id ? 'text-cyan-400' : ''} />
                        {tab.label}
                        {tab.count !== null && tab.count > 0 && (
                            <span className="ml-2 bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0">
                {/* Module Overview */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-white/60 text-sm font-bold uppercase tracking-wider mb-2">Total Active Users</h3>
                                <div className="text-4xl font-bold text-white mb-2">{agentCount + supplierCount}</div>
                                <div className="flex gap-4 text-xs text-white/50">
                                    <span>Agents: <b className="text-white">{agentCount}</b></span>
                                    <span>Suppliers: <b className="text-white">{supplierCount}</b></span>
                                </div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-white/60 text-sm font-bold uppercase tracking-wider mb-2">Pending Actions</h3>
                                <div className="text-4xl font-bold text-amber-400 mb-2">{pendingAgents.length + pendingSuppliers.length}</div>
                                <div className="text-xs text-white/50">Requires immediate attention</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-white/60 text-sm font-bold uppercase tracking-wider mb-2">Total Active Products</h3>
                                <div className="text-4xl font-bold text-cyan-400 mb-2">{activeProductsCount}</div>
                                <div className="text-xs text-white/50">Live Marketplace Items</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-white/60 text-sm font-bold uppercase tracking-wider mb-2">System Health</h3>
                                <div className="text-4xl font-bold text-green-400 mb-2">99.9%</div>
                                <div className="text-xs text-white/50">All systems operational</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex gap-4 items-center p-3 rounded-xl bg-white/5 border border-white/5">
                                            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                            <div className="flex-1">
                                                <div className="text-sm text-white">New user registration</div>
                                                <div className="text-xs text-white/40">User ID: #{1000 + i} joined the platform</div>
                                            </div>
                                            <div className="text-xs text-white/40">{i * 5}m ago</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-lg font-bold text-white">Platform Growth</h3>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <select
                                                value={growthMetric}
                                                onChange={(e) => setGrowthMetric(e.target.value as any)}
                                                className="appearance-none bg-black/30 border border-white/10 rounded-lg text-xs text-white pl-3 pr-8 py-1 outline-none focus:border-cyan-500 cursor-pointer"
                                            >
                                                <option value="views">Views</option>
                                                <option value="wishlisted">Wishlisted</option>
                                                <option value="products">Products</option>
                                                <option value="suppliers">Suppliers</option>
                                                <option value="agents">Agents</option>
                                                <option value="sales">Sales</option>
                                            </select>
                                            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-[10px] pointer-events-none" />
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
                                    {currentGrowthData.map((h, i) => (
                                        <div key={i} className="w-full bg-gradient-to-t from-cyan-500/10 to-cyan-500/30 rounded-t-lg relative group h-full">
                                            <div style={{ height: `${h}%` }} className="w-full absolute bottom-0 bg-cyan-500/50 rounded-t-lg transition-all duration-500 group-hover:bg-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded border border-white/10 transition-opacity whitespace-nowrap z-10">
                                                    {h} {growthMetric}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                                Pending Verification Queue
                            </h2>
                            <span className="text-sm text-white/40">Showing {pendingAgents.length + pendingSuppliers.length} pending items</span>
                        </div>

                        {pendingAgents.length === 0 && pendingSuppliers.length === 0 ? (
                            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                                <p className="text-white/40">Queue empty. All systems clear.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Agents */}
                                {pendingAgents.map((agent) => (
                                    <div key={agent.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg group hover:border-cyan-500/30 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-xl font-bold border border-blue-500/30">
                                                <FaUserTie />
                                            </div>
                                            <span className="bg-blue-500/10 text-blue-300 text-[10px] font-bold px-2 py-1 rounded border border-blue-500/20 uppercase">
                                                Agent
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">{agent.agency_name}</h3>
                                        <p className="text-sm text-white/60 mb-4">{agent.email}</p>

                                        <div className="space-y-2 mb-6">
                                            <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                                                <span className="text-white/40">Location</span>
                                                <span className="text-white/80">{agent.country || 'Unknown'}</span>
                                            </div>
                                            <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                                                <span className="text-white/40">IATA / Lic</span>
                                                <span className="text-white/80 font-mono">{agent.license_number || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleVerification('agent', agent.id, 'rejected')}
                                                disabled={isLoading}
                                                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-white/60 hover:text-white text-xs font-bold transition-all"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleVerification('agent', agent.id, 'approved')}
                                                disabled={isLoading}
                                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs hover:from-amber-400 hover:to-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Suppliers */}
                                {pendingSuppliers.map((supplier) => (
                                    <div
                                        key={supplier.id}
                                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg group hover:border-amber-500/30 transition-all cursor-pointer relative overflow-hidden"
                                        onClick={() => openVerificationModal(supplier)}
                                    >
                                        <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 text-xl font-bold border border-amber-500/30">
                                                    <FaBuilding />
                                                </div>
                                                <span className="bg-amber-500/10 text-amber-300 text-[10px] font-bold px-2 py-1 rounded border border-amber-500/20 uppercase">
                                                    Supplier
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                                {supplier.company_name}
                                                <FaChevronDown className="-rotate-90 text-white/30 text-xs group-hover:translate-x-1 transition-transform" />
                                            </h3>
                                            <p className="text-sm text-white/60 mb-4">{supplier.contact_email}</p>

                                            <div className="space-y-2 mb-6">
                                                <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                                                    <span className="text-white/40">Location</span>
                                                    <span className="text-white/80">{supplier.country_code || 'Unknown'}</span>
                                                </div>
                                                <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                                                    <span className="text-white/40">Reg No</span>
                                                    <span className="text-white/80 font-mono">{supplier.company_reg_no || 'N/A'}</span>
                                                </div>
                                            </div>

                                            <div className="block w-full text-center py-2 rounded-xl bg-white/5 text-white/40 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                                                Click to Verify
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Module B: User Management */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm animate-fade-in">
                            <div className="relative group">
                                <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block">Role</label>
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value as any)}
                                    className="bg-black/20 border border-white/10 rounded-lg text-sm text-white pl-3 pr-8 py-2 outline-none focus:border-cyan-500 cursor-pointer min-w-[150px] appearance-none"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="agent">Agents</option>
                                    <option value="supplier">Suppliers</option>
                                </select>
                                <FaChevronDown className="absolute right-3 bottom-3 text-white/50 text-xs pointer-events-none" />
                            </div>

                            <div className="relative group">
                                <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block">Location</label>
                                <select
                                    value={filterLocation}
                                    onChange={(e) => setFilterLocation(e.target.value)}
                                    className="bg-black/20 border border-white/10 rounded-lg text-sm text-white pl-3 pr-8 py-2 outline-none focus:border-cyan-500 cursor-pointer min-w-[150px] appearance-none"
                                >
                                    <option value="all">All Locations</option>
                                    {uniqueLocations.map(loc => {
                                        const { name, flag } = getCountryInfo(loc)
                                        return <option key={loc} value={loc}>{flag} {name}</option>
                                    })}
                                </select>
                                <FaChevronDown className="absolute right-3 bottom-3 text-white/50 text-xs pointer-events-none" />
                            </div>

                            <div className="relative group">
                                <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block">Status</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as any)}
                                    className="bg-black/20 border border-white/10 rounded-lg text-sm text-white pl-3 pr-8 py-2 outline-none focus:border-cyan-500 cursor-pointer min-w-[150px] appearance-none"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="frozen">Frozen</option>
                                    <option value="deactivated">Deactivated</option>
                                </select>
                                <FaChevronDown className="absolute right-3 bottom-3 text-white/50 text-xs pointer-events-none" />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden animate-fade-in shadow-xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/20 border-b border-white/10 text-xs uppercase tracking-wider text-white/50 font-semibold">
                                        <th className="py-4 px-4">Entity</th>
                                        <th className="py-4 px-4">Contact</th>
                                        <th className="py-4 px-4">Location</th>
                                        <th className="py-4 px-4">Status</th>
                                        <th className="py-4 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <UserRow key={user.id} user={user} type={user.type} />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-white/40">
                                                No users found matching filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Module C: User Voice (Visual High Level) */}
                {activeTab === 'user_voice' && (
                    <UserFeedbackModule />
                )}

                {/* Module E: Feedback Data Table (Raw Data) */}
                {activeTab === 'feedback_data' && (
                    <AdminFeedbackTable />
                )}

                {/* Module D: System Control */}
                {activeTab === 'system' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <FaBolt className="text-amber-400" /> Early Bird Configuration
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div>
                                        <div className="font-bold text-white mb-1">Founding Member Pricing</div>
                                        <div className="text-xs text-white/50">Active: 70% Discount + 30 Day Trial</div>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div>
                                        <div className="font-bold text-white mb-1">Global Gate Enabled</div>
                                        <div className="text-xs text-white/50">Only verified emails can register</div>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <FaSync className="text-cyan-400" /> System Params
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Global Comission Rate (%)</label>
                                    <input type="number" defaultValue={10} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-cyan-500 focus:outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">System Maintenance Mode</label>
                                    <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-all [&>option]:bg-gray-900">
                                        <option value="off">Disabled (System Live)</option>
                                        <option value="on">Enabled (Maintenance)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
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
