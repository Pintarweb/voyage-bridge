'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { FaBolt, FaSync, FaChartLine, FaEnvelope, FaDownload } from 'react-icons/fa'
import { Line } from 'react-chartjs-2'
import toast from 'react-hot-toast'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { sendSystemReportEmail } from '@/app/actions/report'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

export default function AdminSystemControl() {
    const [performanceData, setPerformanceData] = useState<any[]>([])
    const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day')
    const [isGeneratingReport, setIsGeneratingReport] = useState(false)
    const [reports, setReports] = useState<any[]>([])
    const supabase = createClient()
    const searchParams = useSearchParams()

    const [showHistory, setShowHistory] = useState(false)
    const [historyFilter, setHistoryFilter] = useState<'all' | 'day' | 'week' | 'month'>('all')

    const [maintenanceMode, setMaintenanceMode] = useState(false)

    // Fetch Maintenance Settings
    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase
                .from('system_settings')
                .select('value')
                .eq('key', 'maintenance_mode')
                .single()

            if (data) {
                setMaintenanceMode(data.value)
            }
        }
        fetchSettings()
    }, [])

    const toggleMaintenanceMode = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value === 'on'
        if (newValue && !confirm('Are you sure you want to enable Maintenance Mode? Users will be blocked from accessing the site.')) {
            e.target.value = 'off' // Revert
            return
        }

        setMaintenanceMode(newValue)

        const { error } = await supabase
            .from('system_settings')
            .update({ value: newValue })
            .eq('key', 'maintenance_mode')

        if (error) {
            toast.error('Failed to update maintenance mode')
            setMaintenanceMode(!newValue) // Revert state
        } else {
            toast.success(`System Maintenance Mode turned ${newValue ? 'ON' : 'OFF'}`)
        }
    }

    const fetchReports = async () => {
        const { data } = await supabase
            .from('system_reports')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)

        if (data) setReports(data)
    }

    // Auto-open history if URL has ?view=history
    useEffect(() => {
        if (searchParams.get('view') === 'history') {
            setShowHistory(true)
            fetchReports()
        }
    }, [searchParams])

    useEffect(() => {
        fetchReports()
    }, [])

    useEffect(() => {
        // Mock data fetch - replace with real supabase select in future
        // TODO: Fetch from 'system_metrics' table
        const generateMockData = () => {
            const now = new Date()
            const data = []
            const points = timeRange === 'day' ? 24 : timeRange === 'week' ? 7 : 30

            for (let i = points; i >= 0; i--) {
                const t = new Date(now)
                if (timeRange === 'day') t.setHours(t.getHours() - i)
                if (timeRange === 'week') t.setDate(t.getDate() - i)
                if (timeRange === 'month') t.setDate(t.getDate() - i)

                // Simulated variance
                const baseLoad = 10 + Math.random() * 30 // 10-40%
                const users = Math.floor(100 + Math.random() * 50) + (timeRange === 'day' && t.getHours() > 18 ? 50 : 0)

                let label = ''
                if (timeRange === 'day') {
                    label = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                } else if (timeRange === 'week') {
                    label = t.toLocaleDateString([], { weekday: 'short' })
                } else {
                    label = t.toLocaleDateString([], { month: 'short', day: 'numeric' })
                }

                data.push({
                    timestamp: label,
                    fullDate: t.toISOString(),
                    load: Math.floor(baseLoad),
                    users: users
                })
            }
            setPerformanceData(data)
        }

        generateMockData()
    }, [timeRange])

    // Filter reports based on selected range
    const filteredReports = reports.filter(r => historyFilter === 'all' || r.period === historyFilter)

    if (showHistory) {
        // OVERALL SUMMARY CALCS
        const totalReports = filteredReports.length
        const avgLoad = totalReports > 0 ? Math.round(filteredReports.reduce((a, b) => a + b.avg_load, 0) / totalReports) : 0
        const issuesFound = filteredReports.filter(r => r.avg_load > 70).length // Mock issue detection

        return (
            <div className="space-y-6 animate-fade-in">
                {/* Header / Nav */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaDownload className="text-blue-400" /> Report History
                    </h2>
                    <button
                        onClick={() => setShowHistory(false)}
                        className="text-sm text-white/50 hover:text-white underline"
                    >
                        Back to System Control
                    </button>
                </div>

                {/* Overall Summary Card */}
                <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold text-white mb-2">Overall Performance Summary</h3>
                        <p className="text-sm text-white/70 max-w-2xl">
                            Across the selected {totalReports} reports, the system maintained an average load of <strong className="text-white">{avgLoad}%</strong>.
                            {issuesFound > 0 ? ` However, ${issuesFound} reports flagged high usage.` : ' performance remained optimal.'}
                            Suggested actions include regular database maintenance and monitoring API latency during peak hours.
                        </p>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent"></div>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    {(['all', 'day', 'week', 'month'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setHistoryFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider border ${historyFilter === f
                                ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Reports List */}
                <div className="grid gap-4">
                    {filteredReports.length === 0 ? (
                        <div className="text-center py-12 text-white/30 bg-white/5 rounded-xl border border-white/5">No reports found for this filter.</div>
                    ) : (
                        filteredReports.map((report: any) => (
                            <div key={report.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-cyan-400 font-bold uppercase tracking-widest text-xs">{report.period} Report</span>
                                            <span className="text-white/30 text-xs">{new Date(report.created_at).toLocaleString()}</span>
                                        </div>
                                        <h4 className="text-white font-bold">{report.summary || 'System performance report generated.'}</h4>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${report.status === 'emailed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                            report.status === 'failed_email' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                                'bg-white/5 border-white/10 text-white/50'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4 p-4 bg-black/20 rounded-lg">
                                    <div className="space-y-1">
                                        <div className="text-white/40 text-xs uppercase font-bold">Metrics</div>
                                        <div className="text-white">Avg Load: <span className="text-cyan-400">{report.avg_load}%</span></div>
                                        <div className="text-white">Peak Users: <span className="text-purple-400">{report.peak_users}</span></div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-white/40 text-xs uppercase font-bold">Suggested Actions</div>
                                        <div className="text-white/80 italic">{report.action_items || 'No immediate actions.'}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )
    }

    const chartData = {
        labels: performanceData.map(d => d.timestamp),
        datasets: [
            {
                label: 'System Load (%)',
                data: performanceData.map(d => d.load),
                borderColor: '#22d3ee', // Cyan-400
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
                fill: true,
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: 'Active Users',
                data: performanceData.map(d => d.users),
                borderColor: '#a78bfa', // Purple-400
                backgroundColor: 'rgba(167, 139, 250, 0.0)',
                borderDash: [5, 5],
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: 'white' }
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'rgba(255, 255, 255, 0.5)' }
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'cyan' },
                max: 100
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: { drawOnChartArea: false },
                ticks: { color: '#a78bfa' }
            },
        },
    }

    const handleSendReport = async () => {
        if (!confirm('Generate and email system report now?')) return
        setIsGeneratingReport(true)
        const toastId = toast.loading('Generating report...')

        try {
            if (performanceData.length === 0) {
                toast.error('No data to report.', { id: toastId })
                setIsGeneratingReport(false)
                return
            }

            // Calculate summary stats from current view data
            const avgLoad = Math.round(performanceData.reduce((acc, curr) => acc + curr.load, 0) / performanceData.length)
            const peakUsers = Math.max(...performanceData.map(d => d.users))

            const result = await sendSystemReportEmail({
                period: timeRange,
                avgLoad,
                peakUsers,
                totalRequests: performanceData.length * 1500, // Mock req count
                saveToDb: false
            })

            if (result.success) {
                toast.success('Report emailed successfully for preview.', { id: toastId })
                // No fetchReports needed as we didn't save
            } else {
                toast.error('Failed to email report: ' + result.error, { id: toastId })
            }
        } catch (error: any) {
            console.error('Frontend Error:', error)
            toast.error('Error generating report.', { id: toastId })
        } finally {
            setIsGeneratingReport(false)
            // toast.dismiss(toastId) handled by success/error updates
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Top Header with Actions */}
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaBolt className="text-yellow-400" /> System Control Center
                </h3>
                <div className="flex gap-3">
                    <button
                        onClick={() => { fetchReports(); setShowHistory(true) }}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-bold border border-white/10 transition-colors flex items-center gap-2"
                    >
                        <FaDownload /> Report History
                    </button>
                    <button
                        onClick={handleSendReport}
                        disabled={isGeneratingReport}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-sm font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isGeneratingReport ? <div className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"></div> : <FaEnvelope />}
                        Email Report (Preview)
                    </button>
                </div>
            </div>

            {/* Top Row: System Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <FaSync className="text-cyan-400" /> System Params
                    </h3>
                    <div className="space-y-4">
                        {/* Commission Rate removed as per user request */}
                        <div>
                            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">System Maintenance Mode</label>
                            <div className="relative">
                                <select
                                    value={maintenanceMode ? 'on' : 'off'}
                                    onChange={toggleMaintenanceMode}
                                    className={`w-full bg-black/20 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all appearance-none cursor-pointer ${maintenanceMode
                                        ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                        : 'border-white/10 focus:border-cyan-500'
                                        }`}
                                >
                                    <option value="off" className="bg-gray-900">Disabled (System Live)</option>
                                    <option value="on" className="bg-gray-900">Enabled (Maintenance)</option>
                                </select>
                                <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${maintenanceMode ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                            </div>
                            <p className="text-[10px] text-white/40 mt-2">
                                {maintenanceMode
                                    ? '⚠️ WARNING: Platform is currently inaccessible to users.'
                                    : '✅ Platform is active and accepting connections.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <FaBolt className="text-yellow-400" /> Real-time Performance
                    </h3>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                            <div className="text-xs text-white/40 uppercase font-bold tracking-widest mb-2">Current Load</div>
                            <div className="text-2xl font-mono text-cyan-400 font-bold">12%</div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-cyan-400 h-full w-[12%] shadow-[0_0_10px_#22d3ee]"></div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                            <div className="text-xs text-white/40 uppercase font-bold tracking-widest mb-2">Capacity</div>
                            <div className="text-2xl font-mono text-green-400 font-bold">~10k</div>
                            <div className="text-[10px] text-white/30 mt-2">Concurrent Users</div>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex flex-col justify-center items-center text-center">
                            <div className="text-green-500 font-bold mb-1">HEALTHY</div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Analytics Chart */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaChartLine className="text-purple-400" /> Performance Analytics
                    </h3>
                    <div className="flex gap-2">
                        {(['day', 'week', 'month'] as const).map((tf) => (
                            <button
                                key={tf}
                                onClick={() => setTimeRange(tf)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all uppercase tracking-wider ${timeRange === tf ? 'bg-purple-500 text-white shadow-lg' : 'bg-white/5 text-white/40 hover:text-white'}`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative h-[300px] w-full bg-black/20 rounded-xl p-4 border border-white/5">
                    <Line data={chartData} options={chartOptions} />
                </div>

                <div className="flex items-center justify-end gap-2 text-white/40 text-xs px-4 mt-4">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Auto-scheduled: Daily @ 00:00 UTC
                </div>
            </div>
        </div>
    )
}
