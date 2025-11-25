'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

type AgentProfile = {
    id: string
    full_name: string
    email: string
    agency_name: string
    verification_status: 'pending' | 'approved' | 'rejected'
    created_at: string
}

export default function AdminVerificationPage() {
    const [agents, setAgents] = useState<AgentProfile[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        fetchPendingAgents()
    }, [])

    const fetchPendingAgents = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('agent_profiles')
            .select('*')
            .eq('verification_status', 'pending')

        if (error) {
            console.error('Error fetching agents:', error)
        } else {
            setAgents(data || [])
        }
        setLoading(false)
    }

    const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
        const { error } = await supabase
            .from('agent_profiles')
            .update({ verification_status: status })
            .eq('id', id)

        if (error) {
            console.error(`Error updating status to ${status}:`, error)
            alert(`Failed to ${status} agent.`)
        } else {
            // Optimistic update
            setAgents(prev => prev.filter(agent => agent.id !== id))

            if (status === 'approved') {
                // Trigger Webhook for Welcome Email (Placeholder)
                try {
                    await fetch('https://n8n.example.com/webhook/welcome-email', {
                        method: 'POST',
                        body: JSON.stringify({ agent_id: id, status: 'approved' })
                    })
                    console.log('Welcome email webhook triggered')
                } catch (e) {
                    console.error('Webhook failed:', e)
                }
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-8 text-teal-400">Admin Verification Dashboard</h1>

            {loading ? (
                <p>Loading pending requests...</p>
            ) : agents.length === 0 ? (
                <p className="text-gray-400">No pending verification requests.</p>
            ) : (
                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-700 text-gray-300 uppercase">
                            <tr>
                                <th className="px-6 py-3">Agency Name</th>
                                <th className="px-6 py-3">Contact Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Date Applied</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {agents.map((agent) => (
                                <tr key={agent.id} className="hover:bg-gray-750">
                                    <td className="px-6 py-4 font-medium">{agent.agency_name}</td>
                                    <td className="px-6 py-4">{agent.full_name}</td>
                                    <td className="px-6 py-4">{agent.email}</td>
                                    <td className="px-6 py-4">{new Date(agent.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button
                                            onClick={() => handleStatusUpdate(agent.id, 'approved')}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(agent.id, 'rejected')}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
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
