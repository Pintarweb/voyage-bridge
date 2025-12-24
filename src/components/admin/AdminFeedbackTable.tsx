'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { FaFilter, FaDownload, FaExclamationTriangle, FaSearch, FaUserTie, FaBuilding, FaTable } from 'react-icons/fa'

type FeedbackSource = 'Dashboard_Pulse' | 'Post_Action_Survey' | 'Exit_Intent'

interface FeedbackEntry {
    entry_id: string
    user_id: string
    source: FeedbackSource
    metric_score: number
    comment: string
    created_at: string
    user_email?: string // Joined manually for now or via view
    user_role?: string
}

export default function AdminFeedbackTable() {
    const [entries, setEntries] = useState<FeedbackEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterFrustration, setFilterFrustration] = useState(false)
    const [filterCategory, setFilterCategory] = useState<'All' | 'Hotel' | 'Transport' | 'Land Operator'>('All') // Valid for Suppliers primarily

    // Mocking user data join for visualization as real join requires DB setup
    const mockEnrichment = (data: any[]) => {
        return data.map(entry => ({
            ...entry,
            user_email: `user_${entry.user_id.slice(0, 4)}@example.com`,
            user_role: Math.random() > 0.5 ? 'Supplier' : 'Agent',
            // Mock category for filtering demo
            category: Math.random() > 0.6 ? 'Hotel' : (Math.random() > 0.5 ? 'Transport' : 'Land Operator')
        }))
    }

    const supabase = createClient()

    useEffect(() => {
        fetchFeedback()
    }, [])

    const fetchFeedback = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('feedback_entries')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            // Enrich with mock data for display purposes
            setEntries(mockEnrichment(data || []))
        } catch (error) {
            console.error('Error fetching feedback:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredEntries = entries.filter(entry => {
        if (filterFrustration && (entry.metric_score > 3 || !entry.metric_score)) return false
        // Note: Category filtering is mocked here as it depends on joining user profiles
        // showing the logic flow.
        if (filterCategory !== 'All' && (entry as any).category !== filterCategory) return false
        return true
    })

    const handleDownloadCSV = () => {
        const headers = ['ID', 'Source', 'Score', 'Comment', 'Date', 'User Email']
        const csvContent = [
            headers.join(','),
            ...filteredEntries.map(e => [
                e.entry_id,
                e.source,
                e.metric_score,
                `"${e.comment || ''}"`,
                new Date(e.created_at).toLocaleDateString(),
                e.user_email
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `feedback_export_${new Date().toISOString().slice(0, 10)}.csv`
        link.click()
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaTable className="text-cyan-400" /> Feedback Data View
                    </h2>
                    <p className="text-white/50 text-xs mt-1">Raw intelligence from the User Voice loop.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {/* Filters */}
                    <button
                        onClick={() => setFilterFrustration(!filterFrustration)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 ${filterFrustration
                            ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                            : 'bg-black/20 border-white/10 text-white/60 hover:text-white'}`}
                    >
                        <FaExclamationTriangle /> High Frustration (1-3)
                    </button>

                    <div className="relative group">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value as any)}
                            className="appearance-none bg-black/20 border border-white/10 rounded-xl text-xs text-white pl-4 pr-10 py-2 outline-none focus:border-cyan-500 cursor-pointer font-bold hover:bg-white/5 transition-colors"
                        >
                            <option value="All">All Categories</option>
                            <option value="Hotel">Hotel</option>
                            <option value="Transport">Transport</option>
                            <option value="Land Operator">Land Operator</option>
                        </select>
                        <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-[10px] pointer-events-none" />
                    </div>

                    <button
                        onClick={handleDownloadCSV}
                        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <FaDownload /> Download CSV
                    </button>
                </div>
            </div>

            {/* High Priority Alert Cards (Automation Trigger Visualization) */}
            {filteredEntries.some(e => e.metric_score <= 2) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEntries.filter(e => e.metric_score <= 2).slice(0, 3).map(alert => (
                        <div key={alert.entry_id} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                <FaExclamationTriangle className="text-red-500 animate-pulse" />
                            </div>
                            <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">High Priority Alert</div>
                            <div className="text-white font-bold text-sm mb-1">{alert.user_email}</div>
                            <div className="text-white/60 text-xs mb-3">Score: <span className="text-red-400 font-bold">{alert.metric_score}/10</span> • Source: {alert.source.replace(/_/g, ' ')}</div>
                            <p className="text-white/80 text-xs italic border-l-2 border-red-500/50 pl-2 mb-3">"{alert.comment || 'No comment provided'}"</p>
                            <button className="w-full py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-bold rounded uppercase tracking-wider transition-colors">
                                Contact Member
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Table */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/20 border-b border-white/10 text-xs uppercase tracking-wider text-white/50 font-semibold">
                            <th className="py-4 px-6">Timestamp</th>
                            <th className="py-4 px-6">Source</th>
                            <th className="py-4 px-6">User / Role</th>
                            <th className="py-4 px-6 text-center">Score</th>
                            <th className="py-4 px-6">Feedback</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-white/30 italic">Loading feedback data...</td>
                            </tr>
                        ) : filteredEntries.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-white/30 italic">No feedback entries found.</td>
                            </tr>
                        ) : (
                            filteredEntries.map((entry) => (
                                <tr key={entry.entry_id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="py-4 px-6 text-xs text-white/60 font-mono">
                                        {new Date(entry.created_at).toLocaleDateString()} <span className="opacity-50">{new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border 
                                            ${entry.source === 'Exit_Intent' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                entry.source === 'Dashboard_Pulse' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                            {entry.source.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-white/60 text-xs">
                                                {entry.user_role === 'Agent' ? <FaUserTie /> : <FaBuilding />}
                                            </div>
                                            <div>
                                                <div className="text-white text-xs font-bold">{entry.user_email}</div>
                                                <div className="text-[10px] text-white/40">{(entry as any).category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {entry.metric_score ? (
                                            <span className={`font-bold text-sm ${entry.metric_score <= 2 ? 'text-red-400' : (entry.metric_score >= 4 ? 'text-green-400' : 'text-amber-400')}`}>
                                                {entry.metric_score}
                                            </span>
                                        ) : (
                                            <span className="text-white/20">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 max-w-xs">
                                        <p className="text-white/80 text-sm truncate" title={entry.comment}>{entry.comment || <span className="text-white/20 italic">No comment</span>}</p>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-cyan-400 hover:text-cyan-300 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
