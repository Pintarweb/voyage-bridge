'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    FaChartLine, FaDownload, FaArrowLeft, FaEye, FaHeart, FaComments,
    FaDollarSign, FaCrown, FaGlobeAmericas, FaBolt
} from 'react-icons/fa'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { motion } from 'framer-motion'

export default function SupplierReports() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [supplier, setSupplier] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('30d')

    // Mock Data for Charts & Tiles (Replace with real data later)
    const kpiData = {
        views: { value: 1245, growth: 12.5 },
        wishlists: { value: 85, growth: 5.2 },
        leads: { value: 24, growth: 18.0 }, // "Confirmed Inquiries"
        value: { value: 4320, growth: 22.1 } // 24 leads * avg price $180 (est)
    }

    const trendData = [
        { name: 'Week 1', views: 240, leads: 4 },
        { name: 'Week 2', views: 300, leads: 5 },
        { name: 'Week 3', views: 280, leads: 6 },
        { name: 'Week 4', views: 425, leads: 9 },
    ]

    const topProducts = [
        { name: 'Sunset Cruise Package', views: 450, inquiries: 12, conversion: '2.6%' },
        { name: 'Island Hopping Tour', views: 380, inquiries: 8, conversion: '2.1%' },
        { name: 'City Heritage Walk', views: 210, inquiries: 4, conversion: '1.9%' },
    ]

    useEffect(() => {
        const fetchSupplier = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/auth/supplier')
                return
            }
            const { data } = await supabase.from('suppliers').select('*').eq('id', user.id).single()
            setSupplier(data)
            setLoading(false)
        }
        fetchSupplier()
    }, [])

    const downloadReport = () => {
        alert("Coming Soon! We're putting the finishing touches on our PDF engine. Check back in a few days.")
    }

    if (loading) return <div className="min-h-screen bg-[#121826] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div></div>

    // Calculations for ROI
    const monthlyFee = 70 // Assuming base + slots as per current dev state
    const roiMultiplier = (kpiData.value.value / monthlyFee).toFixed(1)

    return (
        <div className="min-h-screen bg-[#121826] text-white font-sans selection:bg-amber-500/30 pb-20">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-600/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <header className="py-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 mb-8">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Link href="/supplier/dashboard" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                            <FaArrowLeft />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Performance Insights</h1>
                            <p className="text-sm text-white/40">Track your growth and ROI</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 p-1 rounded-xl border border-white/5">
                        {['7d', '30d', '90d'].map(range => (
                            <button
                                key={range}
                                onClick={() => setActiveTab(range)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === range ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                            >
                                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last Quarter'}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={downloadReport}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#121826] font-bold rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <FaDownload size={14} /> Download Report
                    </button>
                </header>

                {/* KPI Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Views */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-4 right-4 p-3 bg-blue-500/20 rounded-xl text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"><FaEye size={20} /></div>
                        <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Total Views</div>
                        <div className="text-3xl font-bold text-white mb-1">{kpiData.views.value.toLocaleString()}</div>
                        <div className="text-emerald-400 text-xs flex items-center gap-1 font-medium">
                            <FaBolt size={10} /> +{kpiData.views.growth}% vs last month
                        </div>
                    </motion.div>

                    {/* Wishlists */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-4 right-4 p-3 bg-pink-500/20 rounded-xl text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]"><FaHeart size={20} /></div>
                        <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Total Wishlisted</div>
                        <div className="text-3xl font-bold text-white mb-1">{kpiData.wishlists.value}</div>
                        <div className="text-emerald-400 text-xs flex items-center gap-1 font-medium">
                            <FaBolt size={10} /> +{kpiData.wishlists.growth}% vs last month
                        </div>
                    </motion.div>

                    {/* Leads */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-4 right-4 p-3 bg-emerald-500/20 rounded-xl text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"><FaComments size={20} /></div>
                        <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Confirmed Inquiries</div>
                        <div className="text-3xl font-bold text-white mb-1">{kpiData.leads.value}</div>
                        <div className="text-emerald-400 text-xs flex items-center gap-1 font-medium">
                            <FaBolt size={10} /> +{kpiData.leads.growth}% Hot Leads
                        </div>
                    </motion.div>

                    {/* ROI Value */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 backdrop-blur-md border border-amber-500/30 p-6 rounded-2xl relative overflow-hidden group shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                        <div className="absolute top-4 right-4 p-3 bg-amber-500/20 rounded-xl text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"><FaDollarSign size={20} /></div>
                        <div className="text-amber-200/60 text-xs font-bold uppercase tracking-wider mb-2">Est. Lead Value</div>
                        <div className="text-3xl font-bold text-amber-400 mb-1">${kpiData.value.value.toLocaleString()}</div>
                        <div className="text-amber-200/60 text-xs flex items-center gap-1 font-medium">
                            Based on avg. deal size
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* Charts Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Trend Chart */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <FaChartLine className="text-blue-400" /> Engagement Trends
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: '#121826', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" name="Product Views" />
                                        <Area type="monotone" dataKey="leads" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" name="Inquiries" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Interaction Map Mockup */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl relative overflow-hidden">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                                <FaGlobeAmericas className="text-emerald-400" /> Global Demand Heatmap
                            </h3>
                            <div className="aspect-video w-full bg-[#0B101B] rounded-2xl relative border border-white/5 flex items-center justify-center overflow-hidden">
                                {/* Abstract Map Background using Image or SVG */}
                                <img
                                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen scale-110"
                                    alt="World Map"
                                />

                                {/* Glowing Hotspots */}
                                <div className="absolute top-[30%] left-[20%] w-4 h-4 bg-amber-500 rounded-full blur-[8px] animate-pulse"></div>
                                <div className="absolute top-[35%] left-[50%] w-6 h-6 bg-blue-500 rounded-full blur-[12px] animate-pulse delay-75"></div>
                                <div className="absolute top-[40%] right-[30%] w-3 h-3 bg-emerald-500 rounded-full blur-[6px] animate-pulse delay-150"></div>

                                <div className="relative z-10 bg-black/60 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-xl">
                                    <p className="text-sm font-medium text-white">High agent activity detected in <span className="text-amber-400 font-bold">New York</span>, <span className="text-blue-400 font-bold">London</span>, & <span className="text-emerald-400 font-bold">Singapore</span>.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">

                        {/* ROI Proof Card */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 p-8 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-30">
                                <FaCrown className="text-amber-400 text-6xl rotate-12" />
                            </div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                    Founding Member Report
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-6">Investment ROI</h3>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                        <span className="text-white/60 text-sm">Monthly Plan Fee</span>
                                        <span className="text-white font-bold text-lg">${monthlyFee}</span>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                        <span className="text-white/60 text-sm">Est. Lead Value</span>
                                        <span className="text-amber-400 font-bold text-2xl">${kpiData.value.value.toLocaleString()}</span>
                                    </div>

                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mt-4">
                                        <p className="text-emerald-300 text-sm leading-relaxed">
                                            <span className="text-xl font-bold block mb-1">{roiMultiplier}x ROI</span>
                                            Your subscription was paid for <strong>{roiMultiplier} times</strong> over by the inquiries generated this month alone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Top Products Report */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                            <h3 className="text-lg font-bold text-white mb-4">Top Performers</h3>
                            <div className="space-y-4">
                                {topProducts.map((p, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-white/10 cursor-default">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                            #{i + 1}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="text-sm font-bold text-white truncate">{p.name}</div>
                                            <div className="text-xs text-white/40">{p.views} Views • {p.inquiries} Inquiries</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-amber-500 font-bold">{p.conversion}</div>
                                            <div className="text-[10px] text-white/30">Conv. Rate</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Future Opportunity / FOMO */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }} className="bg-gradient-to-b from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-blue-500/30 p-6 rounded-3xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                                    Market Demand Alert
                                </h3>
                                <p className="text-sm text-blue-100 leading-relaxed mb-4">
                                    Agents are currently searching for more <strong className="text-white">Luxury Day Trips</strong> in your region.
                                </p>
                                <button onClick={() => alert("Coming Soon! Our AI demand matching engine is currently in beta. You'll be notified when it unlocks for your region.")} className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2">
                                    Capture Demand <FaChartLine />
                                </button>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    )
}
