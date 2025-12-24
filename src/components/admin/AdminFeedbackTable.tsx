'use client'

import { useState, useEffect } from 'react'
import { FaFilter, FaDownload, FaExclamationTriangle, FaSearch, FaUserTie, FaBuilding, FaTable, FaEye } from 'react-icons/fa'
import { getFeedbackStats, sendAdminFeedbackEmail } from '@/app/actions/feedback'
import { getContactMemberEmail } from '@/lib/email-templates'

export default function AdminFeedbackTable() {
    const [entries, setEntries] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterFrustration, setFilterFrustration] = useState(false)
    const [selectedEntry, setSelectedEntry] = useState<any | null>(null)

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Sorting State
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

    useEffect(() => {
        fetchFeedback()
    }, [])

    const fetchFeedback = async () => {
        setIsLoading(true)
        try {
            const stats = await getFeedbackStats()
            setEntries(stats.reviews || [])
        } catch (error) {
            console.error('Error fetching feedback:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Filter Logic
    let processedEntries = entries.filter(entry => {
        if (filterFrustration && (entry.score > 2 || !entry.score)) return false // Strict > 2 (shows 1 and 2 only)
        return true
    })

    // Sorting Logic
    if (sortConfig) {
        processedEntries.sort((a, b) => {
            let aValue = a[sortConfig.key]
            let bValue = b[sortConfig.key]

            // Customize sort keys
            if (sortConfig.key === 'user') {
                aValue = a.user?.name || ''
                bValue = b.user?.name || ''
            }
            // Handle nulls
            if (aValue === null || aValue === undefined) return 1
            if (bValue === null || bValue === undefined) return -1

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1
            }
            return 0
        })
    }

    // Pagination Logic
    const totalPages = Math.ceil(processedEntries.length / itemsPerPage)
    const paginatedEntries = processedEntries.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const getSortIcon = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) return <FaTable className="text-white/20 text-[10px]" />
        return sortConfig.direction === 'asc' ? <FaTable className="text-cyan-400 text-[10px] rotate-180" /> : <FaTable className="text-cyan-400 text-[10px]" />
    }

    const headers = [
        { label: 'Timestamp', key: 'created_at' },
        { label: 'Source', key: 'source' },
        { label: 'User / Role', key: 'user' },
        { label: 'Score', key: 'score' },
        { label: 'Feedback', key: 'content' }, // Not typically sorted but fine
        { label: 'Actions', key: '' } // No sort
    ]

    const handleDownloadCSV = () => {
        const csvHeaders = ['ID', 'Source', 'Score', 'Comment', 'Date', 'User Name', 'Role']
        const csvContent = [
            csvHeaders.join(','),
            ...processedEntries.map(e => [
                e.id,
                e.source,
                e.score,
                `"${(e.content || '').replace(/"/g, '""')}"`,
                e.created_at || e.date,
                `"${e.user?.name || 'Anonymous'}"`,
                e.user?.role || 'Guest'
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `feedback_export_${new Date().toISOString().slice(0, 10)}.csv`
        link.click()
    }

    const handleContactMember = async (entry: any) => {
        console.log('handleContactMember called', entry)
        if (!entry.user?.email) {
            console.warn('No email found for user', entry.user)
            alert('No email address found for this user.')
            return
        }

        if (!confirm(`Send follow-up email to ${entry.user.name}? This will be sent directly from the system.`)) return

        try {
            console.log('Sending email via server action...')
            // @ts-ignore - Importing next step
            const res = await sendAdminFeedbackEmail(
                entry.user.email,
                entry.user.name || 'Partner',
                entry.content || '',
                entry.score
            )

            if (res.success) {
                alert(`Email successfully sent to ${entry.user.email}`)
                console.log('Email sent successfully', res)
            } else {
                throw new Error(res.error)
            }

        } catch (error) {
            console.error('Error sending email:', error)
            alert('Failed to send email. Check console for details.')
        }
    }

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaTable className="text-cyan-400" /> Feedback Data View
                        {entries.some(e => e.score !== null && e.score <= 2) && (
                            <span className="ml-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-lg shadow-red-500/20">
                                {entries.filter(e => e.score !== null && e.score <= 2).length} ALERTS
                            </span>
                        )}
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
                        <FaExclamationTriangle /> High Frustration (1-2)
                    </button>

                    <button
                        onClick={handleDownloadCSV}
                        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <FaDownload /> Download CSV
                    </button>
                </div>
            </div>

            {/* High Priority Alert Cards (Automation Trigger Visualization) */}
            {processedEntries.some(e => e.score !== null && e.score <= 2) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {processedEntries.filter(e => e.score !== null && e.score <= 2).slice(0, 3).map(alert => (
                        <div key={alert.id} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                <FaExclamationTriangle className="text-red-500 animate-pulse" />
                            </div>
                            <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">High Priority Alert</div>
                            <div className="text-white font-bold text-sm mb-1">{alert.user?.name || 'Anonymous'}</div>
                            <div className="text-white/60 text-xs mb-3">Score: <span className="text-red-400 font-bold">{alert.score}/10</span> • Source: {alert.source?.replace(/_/g, ' ') || 'Unknown'}</div>
                            <p className="text-white/80 text-xs italic border-l-2 border-red-500/50 pl-2 mb-3">"{alert.content || 'No comment provided'}"</p>
                            <button
                                onClick={() => handleContactMember(alert)}
                                className="w-full py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-bold rounded uppercase tracking-wider transition-colors hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Contact Member
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Table */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 border-b border-white/10 text-xs uppercase tracking-wider text-white/50 font-semibold">
                                {headers.map((header, idx) => (
                                    <th
                                        key={idx}
                                        className={`py-4 px-6 ${header.key ? 'cursor-pointer hover:text-white transition-colors select-none' : ''} ${header.label === 'Actions' ? 'text-right' : header.label === 'Score' ? 'text-center' : ''}`}
                                        onClick={() => header.key && handleSort(header.key)}
                                    >
                                        <div className={`flex items-center gap-2 ${header.label === 'Actions' ? 'justify-end' : header.label === 'Score' ? 'justify-center' : ''}`}>
                                            {header.label}
                                            {header.key && getSortIcon(header.key)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-white/30 italic">Loading feedback data...</td>
                                </tr>
                            ) : paginatedEntries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-white/30 italic">No feedback entries found.</td>
                                </tr>
                            ) : (
                                paginatedEntries.map((entry) => (
                                    <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6 text-xs text-white/60 font-mono">
                                            {/* Use raw formatted date string from server or format raw timestamp if available */}
                                            {entry.created_at ? (
                                                <>
                                                    {new Date(entry.created_at).toLocaleDateString()} <span className="opacity-50">{new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </>
                                            ) : entry.date}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border 
                                                ${entry.source === 'Exit_Intent' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    entry.source === 'Dashboard_Pulse' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                                {entry.source?.replace(/_/g, ' ') || 'General'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-white/60 text-xs">
                                                    {entry.user?.role === 'agent' ? <FaUserTie /> : <FaBuilding />}
                                                </div>
                                                <div>
                                                    <div className="text-white text-xs font-bold">{entry.user?.name || 'Anonymous'}</div>
                                                    <div className="text-[10px] text-white/40 uppercase tracking-wider">{entry.user?.role || 'Guest'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {entry.score != null ? (
                                                <span className={`font-bold text-sm ${entry.score <= 2 ? 'text-red-400' : (entry.score >= 4 ? 'text-green-400' : 'text-amber-400')}`}>
                                                    {entry.score}
                                                </span>
                                            ) : (
                                                <span className="text-white/20">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 max-w-xs">
                                            <p className="text-white/80 text-sm truncate" title={entry.content}>{entry.content || <span className="text-white/20 italic">No comment</span>}</p>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => setSelectedEntry(entry)}
                                                className="text-cyan-400 hover:text-cyan-300 text-xs font-bold flex items-center justify-end gap-1 w-full"
                                            >
                                                <FaEye /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!isLoading && totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-white/10 bg-black/10">
                        <div className="text-xs text-white/40">
                            Showing <span className="text-white font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white font-bold">{Math.min(currentPage * itemsPerPage, processedEntries.length)}</span> of <span className="text-white font-bold">{processedEntries.length}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(curr => Math.max(1, curr - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-all
                                        ${currentPage === page
                                            ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                                            : 'text-white/40 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(curr => Math.min(totalPages, curr + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {/* Feedback Detail Modal */}
                {selectedEntry && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedEntry(null)}>
                        <div className="bg-[#1a1d26] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/5">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        Feedback Details
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${selectedEntry.score !== null && selectedEntry.score <= 2 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60'
                                            }`}>
                                            {selectedEntry.score !== null ? `Score: ${selectedEntry.score}` : 'No Score'}
                                        </span>
                                    </h3>
                                    <p className="text-white/40 text-xs mt-1">ID: {selectedEntry.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedEntry(null)}
                                    className="text-white/40 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 space-y-6">
                                {/* User Info Section */}
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400 text-xl border border-white/10">
                                        {selectedEntry.user?.role === 'agent' ? <FaUserTie /> : <FaBuilding />}
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-lg">{selectedEntry.user?.name || 'Anonymous'}</div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-white/40 uppercase tracking-wider font-bold">{selectedEntry.user?.role || 'Guest'}</span>
                                            {selectedEntry.user?.email && <span className="text-white/20">• {selectedEntry.user.email}</span>}
                                        </div>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <div className="text-white/60 text-xs mb-1">Submitted on</div>
                                        <div className="text-white font-mono text-sm">
                                            {selectedEntry.created_at ? new Date(selectedEntry.created_at).toLocaleString() : selectedEntry.date}
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics & Source */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                        <div className="text-white/40 text-xs uppercase tracking-wider font-bold mb-2">Score / Rating</div>
                                        <div className={`text-3xl font-black ${!selectedEntry.score ? 'text-white/20' :
                                            selectedEntry.score <= 2 ? 'text-red-400' :
                                                selectedEntry.score >= 4 ? 'text-green-400' : 'text-amber-400'
                                            }`}>
                                            {selectedEntry.score ?? '-'}
                                            <span className="text-base text-white/20 font-normal ml-1">/ 10</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                        <div className="text-white/40 text-xs uppercase tracking-wider font-bold mb-2">Source</div>
                                        <div className="text-xl font-bold text-white capitalize">
                                            {selectedEntry.source?.replace(/_/g, ' ') || 'Unknown'}
                                        </div>
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div>
                                    <div className="text-white/40 text-xs uppercase tracking-wider font-bold mb-3">Feedback Content</div>
                                    <div className="bg-black/40 p-6 rounded-xl border border-white/10 text-white/90 leading-relaxed text-sm min-h-[100px] whitespace-pre-wrap">
                                        {selectedEntry.content || <span className="text-white/30 italic">No text provided.</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedEntry(null)}
                                    className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-bold"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => handleContactMember(selectedEntry)}
                                    className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all text-sm flex items-center gap-2"
                                >
                                    Contact Member
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
