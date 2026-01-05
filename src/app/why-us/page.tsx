'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaNetworkWired, FaChartLine, FaDraftingCompass, FaBinoculars, FaRocket, FaCheckCircle, FaArrowRight } from 'react-icons/fa'

const features = [
    {
        icon: FaNetworkWired,
        title: "Access the World’s Most Targeted Agent Network",
        desc: "Stop shouting into the void of the open internet. ArkAlliance connects you directly to a vetted, high-intent network of 5,000+ global travel agents. These aren't just browsers; they are professional \"Paymasters\" looking for exactly what you offer.",
        gradient: "from-blue-400 to-indigo-500"
    },
    {
        icon: FaChartLine,
        title: "Industry-Leading ROI (The $30 Revolution)",
        desc: "Traditional trade shows cost thousands. Global marketing agencies take massive retainers. At ArkAlliance, our Founding Member rate of just $30/month is designed to be paid for by your very first booking. The rest? That’s pure profit.",
        gradient: "from-amber-400 to-orange-500"
    },
    {
        icon: FaDraftingCompass,
        title: "You Are a Co-Designer, Not Just a Subscriber",
        desc: "As a Founding Member, you aren't just \"using\" a platform; you are building it. Through our Public Roadmap and Feedback Loops, your voice directly influences the features we build next. You have a seat at the table with our architects.",
        gradient: "from-emerald-400 to-teal-500"
    },
    {
        icon: FaBinoculars,
        title: "Real-Time Performance Intelligence",
        desc: "Don’t guess—know. Our Supplier Command Center gives you transparent, real-time data on how many agents are viewing, wishlisting, and inquiring about your products. Spot market trends before your competitors even know they exist.",
        gradient: "from-purple-400 to-pink-500"
    },
    {
        icon: FaRocket,
        title: "Frictionless, Premium Growth",
        desc: "We’ve removed the barriers to entry. Our \"Glassmorphism\" interface is designed for speed and clarity. From our Intelligent ROI Calculator to our Rapid Product Creator, every click is optimized to get your inventory in front of global agents.",
        gradient: "from-cyan-400 to-blue-500"
    }
]

export default function WhyUsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden selection:bg-amber-500/30">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* LEFT COLUMN: Content */}
                    <div className="flex-1 space-y-16">

                        {/* Hero Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <h2 className="text-amber-400 font-bold tracking-widest text-sm uppercase">Why ArkAlliance?</h2>
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                                The Future of <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                                    B2B Travel
                                </span>
                            </h1>
                            <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                                The Global Command Center for the Modern Supplier. Stop relying on outdated methods and join the high-performance network designed for growth.
                            </p>
                        </motion.div>

                        {/* Features Grid */}
                        <div className="space-y-8">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="group relative"
                                >
                                    <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl group-hover:bg-white/10 transition-all duration-500" />
                                    <div className="relative p-8 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md hover:border-amber-500/30 transition-all duration-300 flex flex-col md:flex-row gap-6">
                                        <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                                            <feature.icon className="text-white text-3xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-amber-400 transition-colors">{feature.title}</h3>
                                            <p className="text-slate-400 leading-relaxed text-lg">{feature.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Interactive Proof: Mini-Roadmap */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 to-slate-800 backdrop-blur-md"
                        >
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <FaDraftingCompass className="text-amber-400" />
                                Community-Driven Roadmap
                            </h3>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-slate-300">Requested by Suppliers</span>
                                </div>
                                <FaArrowRight className="text-slate-500 hidden md:block" />
                                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-slate-300">Vetted by Experts</span>
                                </div>
                                <FaArrowRight className="text-slate-500 hidden md:block" />
                                <div className="flex items-center gap-3 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/30">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                                    <span className="text-amber-200 font-bold">Built by ArkAlliance</span>
                                </div>
                            </div>
                        </motion.div>

                    </div>


                    {/* RIGHT COLUMN: Sticky Sidebar */}
                    <div className="lg:w-96 flex-shrink-0 relative">
                        <div className="sticky top-28 space-y-6">

                            {/* Founding Member Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="relative p-1 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 shadow-[0_0_40px_rgba(245,158,11,0.2)]"
                            >
                                <div className="bg-slate-950 rounded-[14px] p-6 text-center overflow-hidden relative">
                                    {/* Glass Shine */}
                                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-white/10 rounded-full blur-2xl transform rotate-45" />

                                    <div className="inline-block px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
                                        Status: Early Bird Phase
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2">Founding Member</h3>
                                    <div className="flex items-baseline justify-center gap-1 mb-6">
                                        <span className="text-4xl font-extrabold text-white">$30</span>
                                        <span className="text-slate-400">/ month</span>
                                    </div>

                                    <ul className="space-y-3 text-sm text-left mb-8 text-slate-300">
                                        <li className="flex items-start gap-2">
                                            <FaCheckCircle className="text-amber-500 mt-1 flex-shrink-0" />
                                            <span>Lock in this rate for a full year</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FaCheckCircle className="text-amber-500 mt-1 flex-shrink-0" />
                                            <span>First 30 days 100% FREE</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FaCheckCircle className="text-amber-500 mt-1 flex-shrink-0" />
                                            <span>Founding Member Badge</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FaCheckCircle className="text-amber-500 mt-1 flex-shrink-0" />
                                            <span>Priority Roadmap Voting</span>
                                        </li>
                                    </ul>

                                    <div className="text-sm font-medium text-amber-300 mb-4">
                                        Only 15 spots left at this price!
                                    </div>

                                    <Link href="/auth/register" className="block w-full">
                                        <button className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-extrabold text-lg shadow-lg hover:shadow-amber-500/25 transform hover:scale-[1.02] transition-all duration-200">
                                            Claim My Spot Now
                                        </button>
                                    </Link>

                                    <p className="mt-3 text-xs text-slate-500">
                                        No payment required for trial
                                    </p>
                                </div>
                            </motion.div>

                            {/* Trust Badge / Sidebar Extra */}
                            <div className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm text-center">
                                <p className="text-slate-400 text-sm italic">
                                    "The ROI on ArkAlliance has been higher than any trade show we've attended in the last 5 years."
                                </p>
                                <div className="mt-3 flex items-center justify-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-700" />
                                    <div className="text-left">
                                        <div className="text-xs font-bold text-white">Sarah Jenkins</div>
                                        <div className="text-[10px] text-slate-500">Director of Sales, LuxResorts</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
