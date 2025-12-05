'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { approveUser, rejectUser } from '@/app/actions/admin-actions'

type UserRequest = {
    id: string
    full_name?: string // Agents
    company_name?: string // Suppliers
    email: string
    role: 'agent' | 'supplier'
    created_at?: string
    status: string
}

export default function AdminVerificationPage() {
    const [requests, setRequests] = useState<UserRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchPendingRequests()
    }, [])

    const fetchPendingRequests = async () => {
        setLoading(true)

        // Fetch Agents
        const { data: agents, error: agentError } = await supabase
            .from('agent_profiles')
            .select('id, agency_name, email, created_at, verification_status')
            .eq('verification_status', 'pending')

        if (agentError) {
            console.error('Error fetching agents:', agentError)
        } else {
            console.log('Fetched agents:', agents)
        }

        // Fetch Suppliers
        const { data: suppliers, error: supplierError } = await supabase
            .from('suppliers')
            .select('id, company_name, contact_email, subscription_status')
            .or('subscription_status.eq.pending,subscription_status.eq.pending_payment')

        if (supplierError) {
            console.error('Error fetching suppliers:', supplierError)
        }

        const formattedAgents: UserRequest[] = (agents || []).map(a => ({
            id: a.id,
            full_name: a.agency_name,
            email: a.email,
            role: 'agent',
            created_at: a.created_at,
            status: a.verification_status
        }))

        const formattedSuppliers: UserRequest[] = (suppliers || []).map(s => ({
            id: s.id,
            company_name: s.company_name,
            email: s.contact_email,
            role: 'supplier',
            status: s.subscription_status
        }))

        setRequests([...formattedAgents, ...formattedSuppliers])
        setLoading(false)
    }

    const handleAction = async (user: UserRequest, action: 'approve' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this ${user.role}?`)) return

        setProcessingId(user.id)

        let result
        if (action === 'approve') {
            result = await approveUser(user.id, user.role, user.email)
        } else {
            result = await rejectUser(user.id, user.role, user.email)
        }

        if (result.success) {
            setRequests(prev => prev.filter(r => r.id !== user.id))
            alert(`User ${action}d successfully`)
        } else {
            alert(`Failed to ${action} user: ${result.error}`)
        }

        setProcessingId(null)
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-8 text-teal-400">Admin Verification Dashboard</h1>

            {loading ? (
                <p>Loading pending requests...</p>
            ) : requests.length === 0 ? (
                <p className="text-gray-400">No pending verification requests.</p>
            ) : (
                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-700 text-gray-300 uppercase">
                            <tr>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Name / Company</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-750">
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${req.role === 'agent' ? 'bg-blue-900 text-blue-300' : 'bg-purple-900 text-purple-300'}`}>
                                            {req.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{req.full_name || req.company_name}</td>
                                    <td className="px-6 py-4">{req.email}</td>
                                    <td className="px-6 py-4 capitalize text-yellow-400">{req.status.replace('_', ' ')}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button
                                            onClick={() => handleAction(req, 'approve')}
                                            disabled={!!processingId}
                                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1 rounded text-xs transition-colors"
                                        >
                                            {processingId === req.id ? 'Processing...' : 'Approve'}
                                        </button>
                                        <button
                                            onClick={() => handleAction(req, 'reject')}
                                            disabled={!!processingId}
                                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-1 rounded text-xs transition-colors"
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
