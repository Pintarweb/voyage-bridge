'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { handleUserApproval, rejectSupplier } from '@/app/actions/admin'
import { rejectAgent } from '@/app/actions/reject-agent'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import RejectionModal from '@/components/ui/RejectionModal'

type UserRequest = {
    id: string
    full_name?: string
    company_name?: string
    email: string
    role: 'pending_agent' | 'pending_supplier' | 'agent' | 'supplier' | 'rejected_supplier'
    created_at?: string
    status: string
    rejection_reason?: string
    rejected_at?: string
    approved_at?: string
    profile_type: 'agent' | 'supplier'
}

type TimeFilter = 'all' | 'today' | 'week' | 'month'
type StatusFilter = 'all' | 'approved' | 'rejected'

export default function AdminVerificationPage() {
    const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending')
    const [requests, setRequests] = useState<UserRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // History Filters
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

    const supabase = createClient()

    // Modal State
    const [modal, setModal] = useState<{
        isOpen: boolean
        type: 'approve' | 'reject' | null
        user: UserRequest | null
    }>({
        isOpen: false,
        type: null,
        user: null
    })

    useEffect(() => {
        fetchRequests()
    }, [activeTab, timeFilter, statusFilter])

    const fetchRequests = async () => {
        setLoading(true)
        setError(null)

        try {
            let fetchedAgents: any[] = []
            let fetchedSuppliers: any[] = []

            if (activeTab === 'pending') {
                // Fetch Pending Agents
                const { data: agents, error: agentError } = await supabase
                    .from('agent_profiles')
                    .select('*')
                    .eq('is_approved', false)
                    .eq('role', 'pending_agent')
                    .neq('verification_status', 'rejected')

                if (agentError) throw agentError
                fetchedAgents = agents || []

                // Fetch Paid, Pending Suppliers
                const { data: allSuppliers } = await supabase.from('suppliers').select('id, payment_status, is_approved')
                console.log('DEBUG: All Visible Suppliers:', allSuppliers)

                const { data: suppliers, error: supplierError } = await supabase
                    .from('suppliers')
                    .select('*')
                    .eq('is_approved', false)
                    .eq('payment_status', 'completed')

                if (supplierError) throw supplierError
                fetchedSuppliers = suppliers || []

            } else if (activeTab === 'history') {
                // Fetch Agent History
                let agentQuery = supabase
                    .from('agent_profiles')
                    .select('*')
                    .neq('role', 'admin') // Exclude admins
                    .order('created_at', { ascending: false })

                if (statusFilter === 'approved') agentQuery = agentQuery.eq('verification_status', 'approved')
                else if (statusFilter === 'rejected') agentQuery = agentQuery.eq('verification_status', 'rejected')
                else agentQuery = agentQuery.in('verification_status', ['approved', 'rejected'])

                const { data: agents, error: agentError } = await agentQuery
                console.log('DEBUG: History Agents:', agents, 'Error:', agentError)
                if (agentError) throw agentError
                fetchedAgents = agents || []

                // Fetch Supplier History
                let supplierQuery = supabase
                    .from('suppliers')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (statusFilter === 'approved') {
                    supplierQuery = supplierQuery.eq('is_approved', true) // .eq('role', 'supplier')
                } else if (statusFilter === 'rejected') {
                    supplierQuery = supplierQuery.eq('payment_status', 'refunded') // or role rejected
                } else {
                    // Get both approved and refunded
                    supplierQuery = supplierQuery.or('is_approved.eq.true,payment_status.eq.refunded')
                }

                const { data: suppliers, error: supplierError } = await supplierQuery
                console.log('DEBUG: History Suppliers:', suppliers, 'Error:', supplierError)
                if (supplierError) throw supplierError
                fetchedSuppliers = suppliers || []
            }

            // Apply Date Filters (Shared logic)
            const now = new Date()
            let startDate: Date | null = null
            if (timeFilter === 'today') startDate = new Date(now.setHours(0, 0, 0, 0))
            else if (timeFilter === 'week') {
                const firstDay = now.getDate() - now.getDay()
                startDate = new Date(now.setDate(firstDay))
                startDate.setHours(0, 0, 0, 0)
            } else if (timeFilter === 'month') startDate = new Date(now.getFullYear(), now.getMonth(), 1)


            const filterByDate = (item: any, type: 'agent' | 'supplier') => {
                if (!startDate) return true
                // Use whatever date field is appropriate
                const dateStr = item.approved_at || item.rejected_at || item.created_at
                if (!dateStr) return false
                return new Date(dateStr) >= startDate
            }

            if (startDate) {
                fetchedAgents = fetchedAgents.filter(a => filterByDate(a, 'agent'))
                fetchedSuppliers = fetchedSuppliers.filter(s => filterByDate(s, 'supplier'))
            }


            // Map to Unified UserRequest
            const formattedAgents: UserRequest[] = fetchedAgents.map(a => ({
                id: a.id,
                full_name: a.agency_name,
                email: a.email,
                role: a.role,
                created_at: a.created_at,
                status: a.verification_status,
                rejection_reason: a.rejection_reason,
                rejected_at: a.rejected_at,
                approved_at: a.approved_at,
                profile_type: 'agent'
            }))

            const formattedSuppliers: UserRequest[] = fetchedSuppliers.map(s => ({
                id: s.id,
                company_name: s.company_name,
                email: s.contact_email, // or whatever field stores email
                role: s.role,
                created_at: s.created_at, // Use created_at
                status: s.is_approved ? 'approved' : (s.payment_status === 'refunded' ? 'rejected' : 'pending'),
                approved_at: s.approved_at, // If schema has this? If not, fallback
                rejection_reason: s.rejection_reason, // If schema has this?
                profile_type: 'supplier'
            }))

            // Merge & Sort
            const allRequests = [...formattedAgents, ...formattedSuppliers].sort((a, b) => {
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
            })

            setRequests(allRequests)

        } catch (err: any) {
            console.error('Error fetching requests:', err, JSON.stringify(err, Object.getOwnPropertyNames(err)))
            setError('Failed to load verification requests.')
        } finally {
            setLoading(false)
        }
    }

    const confirmAction = (user: UserRequest, action: 'approve' | 'reject') => {
        setModal({
            isOpen: true,
            type: action,
            user: user
        })
    }

    const executeAction = async (reason?: string) => {
        const { user, type } = modal
        if (!user || !type) return

        setProcessingId(user.id)
        let success = false
        let resultMessage = ''

        try {
            if (type === 'approve') {
                const result = await handleUserApproval(user.id, user.profile_type, user.email)
                if (!result.success) throw new Error(result.error)
                resultMessage = result.message || 'User approved successfully!'
                success = true
            } else if (type === 'reject') {
                if (user.profile_type === 'agent') {
                    if (!reason) throw new Error('Rejection reason is required.')
                    const result = await rejectAgent(user.id, reason)
                    if (!result.success) throw new Error(result.error)
                    resultMessage = 'Agent rejected.'
                    success = true
                } else {
                    // Reject Supplier
                    const result = await rejectSupplier(user.id, reason)
                    if (!result.success) throw new Error(result.error)
                    resultMessage = result.message || 'Supplier rejected & refunded.'
                    success = true
                }
            }
        } catch (err: any) {
            console.error('Error processing request:', err)
            alert(`Action Failed: ${err.message || 'Unknown error'}`)
        }

        if (success) {
            setRequests(prev => prev.filter(r => r.id !== user.id))
            const toast = document.createElement('div')
            toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce'
            toast.textContent = resultMessage
            document.body.appendChild(toast)
            setTimeout(() => toast.remove(), 3000)
        }

        setProcessingId(null)
        setModal({ isOpen: false, type: null, user: null })
        if (activeTab === 'history') fetchRequests()
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Verification Requests</h1>
                    <p className="text-gray-500 mt-1">Manage pending agent and supplier approvals.</p>
                </div>
                <button
                    onClick={fetchRequests}
                    className="text-sm text-teal-600 hover:underline flex items-center gap-1"
                >
                    🔄 Refresh
                </button>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`${activeTab === 'pending'
                            ? 'border-teal-500 text-teal-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        Pending Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`${activeTab === 'history'
                            ? 'border-teal-500 text-teal-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        History
                    </button>
                </nav>
            </div>

            {activeTab === 'history' && (
                <div className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 animation-fade-in transition-all">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Time:</span>
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                            className="bg-white text-sm border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 py-1.5"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                            className="bg-white text-sm border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 py-1.5"
                        >
                            <option value="all">All</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                    <div className="text-4xl mb-4">✨</div>
                    <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                    <p className="text-gray-500 mt-2">No items found for this view.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                {activeTab === 'history' && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                {activeTab === 'pending' && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${req.profile_type === 'agent'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-purple-100 text-purple-800'
                                            }`}>
                                            {req.profile_type?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{req.full_name || req.company_name}</div>
                                        <div className="text-sm text-gray-500 text-xs text-gray-400">ID: {req.id.slice(0, 8)}...</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {req.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm px-2 py-1 rounded capitalize ${req.status?.includes('reject') ? 'text-red-700 bg-red-100' :
                                            req.status?.includes('approved') ? 'text-green-700 bg-green-100' :
                                                'text-yellow-700 bg-yellow-100'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    {activeTab === 'history' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={req.rejection_reason}>
                                            {req.rejection_reason || '-'}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(req.created_at!).toLocaleDateString()}
                                    </td>

                                    {activeTab === 'pending' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => confirmAction(req, 'approve')}
                                                disabled={!!processingId}
                                                className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-xs transition-colors disabled:opacity-50"
                                            >
                                                {processingId === req.id ? '...' : 'Approve'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => confirmAction(req, 'reject')}
                                                disabled={!!processingId}
                                                className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-xs transition-colors disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modals */}
            <ConfirmationModal
                isOpen={modal.isOpen && modal.type === 'approve'}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={() => executeAction()}
                title="Approve User"
                message={`Are you sure you want to approve ${modal.user?.full_name || modal.user?.company_name}? They will be sent an onboarding email.`}
                confirmLabel="Approve"
                isLoading={!!processingId}
            />

            <RejectionModal
                isOpen={modal.isOpen && modal.type === 'reject'}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={(reason) => executeAction(reason)}
                title="Reject User"
                message={`Please confirm you want to reject ${modal.user?.full_name || modal.user?.company_name}. ${modal.user?.profile_type === 'supplier' ? 'This will initiate a refund.' : 'They will receive a rejection notification.'}`}
                isLoading={!!processingId}
            />
        </div>
    )
}
