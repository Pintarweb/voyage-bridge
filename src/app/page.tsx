'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { FaGlobe, FaChartLine, FaUsers, FaArrowRight, FaBuilding, FaShieldAlt, FaHandshake, FaCoins, FaStar } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

// Simple CountUp Component
const CountUp = ({ end, duration = 2 }: { end: number, duration?: number }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let startTime: number
        let animationFrame: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime
            // Ease out quart
            const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

            const percentage = Math.min(progress / (duration * 1000), 1)
            const easedProgress = easeOutQuart(percentage)

            setCount(Math.floor(end * easedProgress))

            if (progress < duration * 1000) {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        animationFrame = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrame)
    }, [end, duration])

    return <>{count.toLocaleString()}</>
}

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

    // Logic matches previous implementation explicitly.

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

// HERO SECTION
            <section className="relative z-10 pt-20 pb-16 lg:pt-32 lg:pb-24 px-4 overflow-hidden min-h-[90vh] flex flex-col justify-center">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative w-full">

                    {/* Floating Social Proof Widget (Desktop Only) */}
                    <div className="hidden lg:flex absolute bottom-0 left-0 mb-8 ml-4 z-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/20 backdrop-blur-md shadow-2xl"
                        >
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                                <span className="text-xl">✨</span>
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">New Partner Added</p>
                                <p className="text-sm text-slate-100 font-semibold">Luxury Stay Maldives <span className="text-slate-500 font-normal ml-1">4m ago</span></p>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 max-w-5xl relative z-10"
                    >
                        {/* Top-Center Accent Badge */}
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-amber-500/50 bg-amber-950/30 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-[pulse_4s_ease-in-out_infinite]">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute opacity-75" />
                            <span className="w-2 h-2 rounded-full bg-amber-500 relative" />
                            <span className="text-amber-100 text-xs md:text-sm font-bold tracking-widest uppercase">
                                Phase 1: Early Bird Founding Spots Closing Soon
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9]">
                            <span className="block text-white drop-shadow-2xl">Connect. Trade.</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_0_35px_rgba(245,158,11,0.5)] py-2">
                                Dominate Global.
                            </span>
                        </h1>

                        {/* Subheadline + Integrated Stats */}
                        <div className="space-y-6">
                            <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
                                The premium ecosystem where verified global suppliers and elite travel agents build profitable, exclusive partnerships.
                            </p>

                            {/* Live Network Stats Bar */}
                            <div className="inline-flex flex-wrap justify-center gap-8 md:gap-16 py-6 px-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
                                <div className="flex flex-col items-center gap-2 group hover:-translate-y-1 transition-transform duration-300">
                                    <div className="text-blue-400 text-3xl md:text-4xl mb-1 drop-shadow-md"><FaShieldAlt /></div>
                                    <span className="text-4xl md:text-5xl font-black text-white tabular-nums drop-shadow-lg">
                                        <CountUp end={supplierCount} />+
                                    </span>
                                    <span className="text-blue-300 text-xs md:text-sm font-bold uppercase tracking-widest">Verified Suppliers</span>
                                </div>
                                <div className="w-px h-20 bg-white/10 hidden md:block" />
                                <div className="flex flex-col items-center gap-2 group hover:-translate-y-1 transition-transform duration-300">
                                    <div className="text-emerald-400 text-3xl md:text-4xl mb-1 drop-shadow-md"><FaStar /></div>
                                    <span className="text-4xl md:text-5xl font-black text-white tabular-nums drop-shadow-lg">
                                        <CountUp end={productCount} />+
                                    </span>
                                    <span className="text-emerald-300 text-xs md:text-sm font-bold uppercase tracking-widest">Active Products</span>
                                </div>
                                <div className="w-px h-20 bg-white/10 hidden md:block" />
                                <div className="flex flex-col items-center gap-2 group hover:-translate-y-1 transition-transform duration-300">
                                    <div className="text-amber-400 text-3xl md:text-4xl mb-1 drop-shadow-md"><FaUsers /></div>
                                    <span className="text-4xl md:text-5xl font-black text-white tabular-nums drop-shadow-lg">
                                        <CountUp end={agentCount} />+
                                    </span>
                                    <span className="text-amber-300 text-xs md:text-sm font-bold uppercase tracking-widest">Partner Agents</span>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 items-center">
                            <Link
                                href="/auth/agent"
                                className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold text-xl rounded-full shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-1 overflow-hidden"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                <span className="relative flex items-center gap-3">
                                    {content.ctaAgent} <FaArrowRight />
                                </span>
                            </Link>
                            <Link
                                href="/auth/supplier"
                                className="px-10 py-5 bg-slate-900/60 border border-white/20 backdrop-blur-xl text-white font-semibold text-xl rounded-full hover:bg-white/10 hover:border-white/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                            >
                                <FaBuilding className="text-slate-400" /> {content.ctaSupplier}
                            </Link>
                        </div>
                    </motion.div>

                </div>

                {/* Light Bokeh Effects */}
                <div className="absolute top-1/4 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
                <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000 pointer-events-none" />
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
