'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type UserRequest = {
    id: string
    full_name?: string // Agents
    company_name?: string // Suppliers
    email: string
    role: 'pending_agent' | 'pending_supplier' | 'agent' | 'supplier'
    created_at?: string
    status: string
}

export default function AdminVerificationPage() {
    const [requests, setRequests] = useState<UserRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchPendingRequests()
    }, [])

    const fetchPendingRequests = async () => {
        setLoading(true)
        setError(null)

        // Fetch Pending Agents from agent_profiles
        // Strict check: role must be 'pending_agent'
        const { data: agents, error: agentError } = await supabase
            .from('agent_profiles')
            .select('*')
            .eq('is_approved', false)
            .eq('role', 'pending_agent')

        if (agentError) {
            console.error('Error fetching agents:', agentError)
            setError('Failed to load pending requests.')
        }

        // Fetch Suppliers (Optional/Legacy check)
        const { data: suppliers, error: supplierError } = await supabase
            .from('suppliers')
            .select('*')
            .or('subscription_status.eq.pending,subscription_status.eq.pending_payment')

        const formattedAgents: UserRequest[] = (agents || []).map(a => ({
            id: a.id,
            full_name: a.agency_name,
            email: a.email,
            role: a.role as any,
            created_at: a.created_at,
            status: a.verification_status
        }))

        const formattedSuppliers: UserRequest[] = (suppliers || []).map(s => ({
            id: s.id,
            company_name: s.company_name,
            email: s.contact_email,
            role: s.role as any || 'supplier',
            status: s.subscription_status
        }))

        setRequests([...formattedAgents, ...formattedSuppliers])
        setLoading(false)
    }

    const handleAction = async (user: UserRequest, action: 'approve' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this ${user.role?.replace('_', ' ')}?`)) return

        setProcessingId(user.id)
        let success = false
        const errorMessage = ''

        try {
            if (action === 'approve') {
                if (user.role === 'pending_agent') {
                    const { error } = await supabase
                        .from('agent_profiles')
                        .update({
                            is_approved: true,
                            role: 'agent',
                            verification_status: 'approved'
                        })
                        .eq('id', user.id)

                    if (error) throw error
                    success = true
                } else {
                    // Supplier logic
                    const { error } = await supabase
                        .from('suppliers')
                        .update({ subscription_status: 'active', role: 'supplier' })
                        .eq('id', user.id)
                    if (error) throw error
                    success = true
                }
            } else {
                // Reject logic
                alert('Reject functionality implementation pending.')
            }
        } catch (err: any) {
            console.error('Error processing request:', err)
            alert(`Error: ${err.message}`)
        }

        if (success) {
            setRequests(prev => prev.filter(r => r.id !== user.id))
            // Simple toast
            const toast = document.createElement('div')
            toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce'
            toast.textContent = `User successfully ${action}d!`
            document.body.appendChild(toast)
            setTimeout(() => toast.remove(), 3000)
        }

        setProcessingId(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Verification Requests</h1>
                    <p className="text-gray-500 mt-1">Manage pending agent and supplier approvals.</p>
                </div>
                <button
                    onClick={fetchPendingRequests}
                    className="text-sm text-teal-600 hover:underline flex items-center gap-1"
                >
                    🔄 Refresh
                </button>
            </div>

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
                    <p className="text-gray-500 mt-2">No pending requests at this time.</p>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${req.role?.includes('agent') ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                            }`}>
                                            {req.role?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{req.full_name || req.company_name}</div>
                                        <div className="text-sm text-gray-500 text-xs">ID: {req.id.slice(0, 8)}...</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {req.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                                            {req.status?.replace('_', ' ') || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleAction(req, 'approve')}
                                            disabled={!!processingId}
                                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-xs transition-colors disabled:opacity-50"
                                        >
                                            {processingId === req.id ? '...' : 'Approve'}
                                        </button>
                                        <button
                                            onClick={() => handleAction(req, 'reject')}
                                            disabled={!!processingId}
                                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-xs transition-colors disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
