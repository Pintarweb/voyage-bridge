'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaLayerGroup, FaUserShield, FaLightbulb, FaArrowRight } from 'react-icons/fa'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-x-hidden selection:bg-amber-500/30">

            {/* BACKGROUND: Cinematic Cityscape */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden bg-slate-950">
                {/* Background Gradient to ensure text readability */}
                <div className="absolute inset-0 bg-slate-950/50 z-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/80 z-20" />

                {/* Background Image: Night City with Golden Lights */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop"
                    alt="City Command"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>

            <div className="relative z-10">
                {/* HERO SECTION */}
                <section className="pt-32 pb-20 px-4 md:pt-48 md:pb-32">
                    <div className="max-w-7xl mx-auto text-center space-y-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight"
                        >
                            ArkAlliance: The New Standard<br />
                            for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_0_25px_rgba(245,158,11,0.4)]">B2B Travel</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-xl md:text-2xl text-slate-200 font-medium max-w-3xl mx-auto drop-shadow-md leading-relaxed"
                        >
                            Moving the industry forward through direct, premium, and transparent partnerships.
                        </motion.p>
                    </div>
                </section>

                {/* VISIONARY PILLARS */}
                <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: FaLayerGroup,
                                title: "Efficiency",
                                subtitle: "Removing the middleman to maximize your profit.",
                                desc: "We provide the 'small' hotelier or 'local' transport provider with the same digital firepower as a global conglomerate.",
                                color: "amber"
                            },
                            {
                                icon: FaUserShield,
                                title: "Authority",
                                subtitle: "A vetted community of elite suppliers and travel paymasters.",
                                desc: "Strict vetting ensures only legitimate suppliers and active agents enter the ecosystem.",
                                color: "blue"
                            },
                            {
                                icon: FaLightbulb,
                                title: "Innovation",
                                subtitle: "Beautifully designed technology that works as hard as you do.",
                                desc: "Business software should be as beautiful and intuitive as a high-end consumer app.",
                                color: "emerald"
                            }
                        ].map((pillar, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="group relative p-8 rounded-sm bg-slate-900/20 backdrop-blur-sm border border-white/10 hover:border-amber-500/50 transition-all duration-500"
                            >
                                <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${pillar.color}-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

                                <div className={`w-12 h-12 mb-6 text-${pillar.color}-400 text-3xl`}>
                                    <pillar.icon />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">{pillar.title}</h3>
                                <p className="text-lg text-amber-200 mb-4 font-medium">{pillar.subtitle}</p>
                                <p className="text-slate-300 leading-relaxed text-sm">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 5-YEAR ROADMAP */}
                <section className="py-24 px-4 bg-slate-950/40 backdrop-blur-md border-y border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">The Universal Travel Ledger</h2>
                            <p className="text-slate-300 max-w-2xl mx-auto">By 2030, ArkAlliance will be the global standard for B2B travel verification and transaction.</p>
                        </div>

                        {/* Horizontal Timeline */}
                        <div className="relative mt-20 hidden md:block">
                            {/* The Line */}
                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent -translate-y-1/2" />

                            <div className="grid grid-cols-3 gap-8 relative z-10">
                                {[
                                    {
                                        phase: "Phase 1: Now",
                                        title: "Market Penetration",
                                        desc: "Building the exclusive, high-ROI community of Founding Members."
                                    },
                                    {
                                        phase: "Phase 2: 2027",
                                        title: "AI-Driven Intelligence",
                                        desc: "Predictive demand forecasting to optimize your service offerings."
                                    },
                                    {
                                        phase: "Phase 3: 2029",
                                        title: "Instant Settlement",
                                        desc: "Seamless, blockchain-backed instant payments for confirmed bookings."
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center text-center group">
                                        <div className="w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-500 mb-8 relative shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:scale-125 transition-transform">
                                            <div className="absolute -inset-1 rounded-full bg-amber-500/20 animate-pulse" />
                                        </div>
                                        <div className="p-6 border border-white/5 bg-white/5 backdrop-blur-md rounded-sm w-full hover:border-amber-500/30 transition-colors">
                                            <div className="text-amber-400 text-sm font-bold tracking-widest uppercase mb-2">{item.phase}</div>
                                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                            <p className="text-slate-300 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Vertical Timeline */}
                        <div className="space-y-8 md:hidden">
                            {[
                                {
                                    phase: "Phase 1: Now",
                                    title: "Market Penetration",
                                    desc: "Building the exclusive, high-ROI community of Founding Members."
                                },
                                {
                                    phase: "Phase 2: 2027",
                                    title: "AI-Driven Intelligence",
                                    desc: "Predictive demand forecasting to optimize your service offerings."
                                },
                                {
                                    phase: "Phase 3: 2029",
                                    title: "Instant Settlement",
                                    desc: "Seamless, blockchain-backed instant payments for confirmed bookings."
                                }
                            ].map((item, i) => (
                                <div key={i} className="relative pl-8 border-l border-amber-500/30">
                                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <div className="mb-1 text-amber-400 text-xs font-bold uppercase">{item.phase}</div>
                                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                    <p className="text-slate-300 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FOUNDER'S CARD */}
                <section className="py-24 px-4">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative rounded-sm overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl md:grid md:grid-cols-5"
                        >
                            {/* Portrait Placeholder */}
                            <div className="md:col-span-2 bg-slate-900/50 min-h-[300px] relative group overflow-hidden">
                                {/* Abstract Professional Silhouette / Placeholder */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-800/50" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 rounded-full border-2 border-white/10 flex items-center justify-center text-white/20">
                                        <span className="text-xs tracking-widest">PORTRAIT</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mission Narrative */}
                            <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-1">Born from Necessity</h3>
                                    <p className="text-amber-400 text-sm font-bold tracking-wider uppercase opacity-80">Our Origin Story</p>
                                </div>

                                <div className="space-y-4 text-slate-300 text-lg leading-relaxed font-light italic">
                                    <p>
                                        &quot;For too long, the gap between those who create travel experiences and those who sell them has been filled with expensive middle-men, outdated technology, and high barriers to entry.&quot;
                                    </p>
                                    <p>
                                        &quot;ArkAlliance was founded to close that gap. We didn&apos;t just build another directory; we built an ecosystem of direct connection.&quot;
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                                    {/* Digital Signature */}
                                    <div className="text-amber-500/80 text-4xl transform -rotate-2 select-none" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                                        Ark Founder
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="py-20 text-center px-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                        Be Part of the Vision.<br />
                        <span className="text-slate-400 text-2xl md:text-3xl font-medium">Lock in Your Founding Rate.</span>
                    </h2>

                    <Link href="/auth/agent">
                        <button className="px-10 py-5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xl rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-1 inline-flex items-center gap-2">
                            Start Trading <FaArrowRight />
                        </button>
                    </Link>
                </section>

            </div>
        </div>
    )
}
