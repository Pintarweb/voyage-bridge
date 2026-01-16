'use client'

import React from 'react'
import { FaShieldAlt, FaStar, FaUsers } from 'react-icons/fa'
import CountUp from '@/components/common/CountUp'

interface HomeStatsProps {
    supplierCount: number
    productCount: number
    agentCount: number
}

const HomeStats: React.FC<HomeStatsProps> = ({ supplierCount, productCount, agentCount }) => {
    return (
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
    )
}

export default HomeStats
