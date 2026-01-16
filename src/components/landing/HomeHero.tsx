'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowRight, FaBuilding } from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'

interface HomeHeroProps {
    ctaAgentText: string
    ctaSupplierText: string
    statsComponent: React.ReactNode
}

const HomeHero: React.FC<HomeHeroProps> = ({ ctaAgentText, ctaSupplierText, statsComponent }) => {
    return (
        <section className="relative z-10 pt-20 pb-16 lg:pt-32 lg:pb-24 px-4 overflow-hidden min-h-[90vh] flex flex-col justify-center">
            {/* BACKGROUND: Deep Slate + Animated Globe Overlay */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-slate-950/30 z-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/80 z-20" />
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <img
                        src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop"
                        alt="Global Connectivity"
                        className="w-full h-full object-cover animate-pan-slow opacity-60"
                    />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[80px] z-0" />
            </div>

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

                        {statsComponent}
                    </div>

                    {/* Enhanced CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 items-center">
                        <Link
                            href="/auth/agent"
                            className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold text-xl rounded-full shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            <span className="relative flex items-center gap-3">
                                {ctaAgentText} <FaArrowRight />
                            </span>
                        </Link>
                        <Link
                            href="/auth/supplier"
                            className="px-10 py-5 bg-slate-900/60 border border-white/20 backdrop-blur-xl text-white font-semibold text-xl rounded-full hover:bg-white/10 hover:border-white/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <FaBuilding className="text-slate-400" /> {ctaSupplierText}
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Light Bokeh Effects */}
            <div className="absolute top-1/4 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000 pointer-events-none" />
        </section>
    )
}

export default HomeHero
