'use client'

import FeatureWishlist from '@/components/feedback/FeatureWishlist'
import PortalSidebar from '@/components/portal/PortalSidebar'
import { FaUsers, FaLightbulb, FaRoad } from 'react-icons/fa'

export default function CommunityPage() {
    return (
        <div className="flex min-h-screen pt-16 bg-transparent text-white">
            <PortalSidebar />

            <main className="flex-1 lg:ml-20 xl:ml-64 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)]">
                <div className="max-w-5xl mx-auto space-y-8 pb-12">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                <FaUsers className="text-amber-500" /> Community & Roadmap
                            </h1>
                            <p className="text-slate-400 max-w-2xl">
                                Help shape the future of ArkAlliance. Vote on features you want to see next or submit your own ideas for review by our Command Center.
                            </p>
                        </div>

                        {/* Stats / Info Pill */}
                        <div className="hidden md:flex gap-3">
                            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-slate-300">
                                <FaLightbulb className="text-yellow-400" />
                                <span>Innovation Hub Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 gap-8">
                        {/* Intro Card */}
                        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10 flex items-start gap-4">
                                <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-300 shadow-inner shadow-indigo-500/10">
                                    <FaRoad className="text-2xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-2">Development Roadmap</h2>
                                    <p className="text-indigo-200 text-sm leading-relaxed max-w-3xl">
                                        We are building this platform with you, not just for you. Your votes directly influence our development priorities.
                                        Check the status of requested features below and lend your voice to the mission.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <FeatureWishlist />
                    </div>
                </div>
            </main>
        </div>
    )
}
