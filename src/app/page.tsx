'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { FaGlobe, FaChartLine, FaUsers, FaArrowRight, FaBuilding, FaShieldAlt, FaHandshake, FaCoins, FaStar } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function Home() {
    const [stats, setStats] = useState<any>(null)
    const supabase = createClient()
    const { language } = useLanguage()

    useEffect(() => {
        const fetchStats = async () => {
            const { data } = await supabase.rpc('get_landing_stats')
            setStats(data)
        }
        fetchStats()
    }, [])

    const supplierCount = stats?.suppliers || 120
    const productCount = stats?.products || 450
    const agentCount = stats?.agents || 85

    // Enhanced Translations could go here, keeping it simple for now to focus on layout
    const t = {
        'en-US': {
            subtitle: 'The premium ecosystem where verified global suppliers and elite travel agents build profitable, exclusive partnerships. Join the Phase 1 Early Bird intake today.',
            ctaAgent: 'Start Trading',
            ctaSupplier: 'For Suppliers'
        }
    }
    const content = t['en-US']

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-x-hidden selection:bg-amber-500/30">

            {/* BACKGROUND: Deep Slate + Animated Globe Overlay */}
            {/* BACKGROUND: Deep Slate + Animated Globe Overlay */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden bg-slate-950">
                {/* Background Gradient - Darker edges to frame the globe */}
                <div className="absolute inset-0 bg-slate-950/30 z-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/80 z-20" />

                {/* Animated Background Image - Sharp and Center */}
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop"
                        alt="Global Connectivity"
                        className="w-full h-full object-cover animate-pan-slow opacity-60"
                    />
                </div>

                {/* Ambient Glows - Very subtle, behind the globe center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[80px] z-0" />
            </div>

            {/* HERO SECTION */}
            <section className="relative z-10 pt-20 pb-16 lg:pt-32 lg:pb-24 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-8">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6 max-w-4xl"
                    >
                        {/* Pre-header Pill */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-900/10 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-amber-200 text-xs font-bold tracking-widest uppercase">Phase 1 Early Bird Live</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                            Connect. Trade. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                                Dominate the Global Market.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
                            {content.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                            <Link
                                href="/auth/agent"
                                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-bold text-lg rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                {content.ctaAgent} <FaArrowRight />
                            </Link>
                            <Link
                                href="/auth/supplier"
                                className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md text-white font-semibold text-lg rounded-full hover:bg-white/10 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <FaBuilding /> {content.ctaSupplier}
                            </Link>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* HOW IT WORKS (Glass Cards) */}
            <section className="py-24 px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Streamlined Success</h2>
                        <p className="text-slate-200 font-medium drop-shadow-sm">The modern way to transact in the travel industry.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: FaShieldAlt, title: "1. Verified Access", desc: "Strict vetting ensures only legitimate suppliers and active agents enter the ecosystem.", color: "blue" },
                            { icon: FaHandshake, title: "2. Direct Connection", desc: "No middlemen. Chat, negotiate, and agree on rates directly using our secure comms suite.", color: "amber" },
                            { icon: FaCoins, title: "3. Instant Transact", desc: "One-click payments and contract generation. Get paid faster and book confidently.", color: "emerald" }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                                <div className={`w-14 h-14 rounded-xl bg-${item.color}-500/20 flex items-center justify-center text-${item.color}-400 text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                                    <item.icon />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-slate-300 font-medium leading-relaxed drop-shadow-sm group-hover:text-slate-100 transition-colors">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STATS STRIP */}
            <section className="py-20 border-y border-white/10 bg-slate-900/40 backdrop-blur-md">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="group hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-5xl md:text-6xl font-black text-white mb-2 drop-shadow-lg group-hover:text-blue-200 transition-colors">{supplierCount}+</div>
                        <div className="text-blue-400 text-sm font-bold uppercase tracking-widest">Verified Suppliers</div>
                    </div>
                    <div className="group hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-5xl md:text-6xl font-black text-white mb-2 drop-shadow-lg group-hover:text-emerald-200 transition-colors">{productCount}+</div>
                        <div className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Active Products</div>
                    </div>
                    <div className="group hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-5xl md:text-6xl font-black text-white mb-2 drop-shadow-lg group-hover:text-amber-200 transition-colors">{agentCount}+</div>
                        <div className="text-amber-400 text-sm font-bold uppercase tracking-widest">Partner Agents</div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION - FOUNDING MEMBER */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="relative rounded-3xl overflow-hidden p-8 md:p-16 text-center border border-amber-500/30">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 to-slate-950 z-0" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0" />

                        <div className="relative z-10 space-y-6">
                            <span className="inline-block px-4 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-sm mb-2">
                                LIMITED TIME OFFER
                            </span>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
                                Become a Founding Member
                            </h2>
                            <p className="text-xl text-slate-100 max-w-2xl mx-auto font-medium drop-shadow-md">
                                Lock in the exclusive rate of <span className="text-amber-400 font-bold">$30/month</span> for a full year. No payment required for trial.
                            </p>
                            <div className="pt-6">
                                <Link href="/why-us">
                                    <button className="px-10 py-5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xl rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all transform hover:scale-105">
                                        Claim Early Bird Status
                                    </button>
                                </Link>
                            </div>
                            <p className="text-sm text-slate-300 font-semibold mt-4 drop-shadow-md">
                                Only 15 spots left in this batch.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}
