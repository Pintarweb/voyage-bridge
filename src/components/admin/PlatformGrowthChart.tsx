import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'



type TimeFrame = 'day' | 'week' | 'month' | 'year'
type Metric = 'views' | 'wishlisted' | 'products' | 'suppliers' | 'agents' | 'sales'

const PlatformGrowthChart: React.FC = () => {
    const [growthTimeFrame, setGrowthTimeFrame] = useState<TimeFrame>('week')
    const [growthMetric, setGrowthMetric] = useState<Metric>('views')

    // Human-readable period display
    const getCurrentPeriodLabel = () => {
        const now = new Date()
        switch (growthTimeFrame) {
            case 'day':
                return now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            case 'week':
                const startOfWeek = new Date(now)
                startOfWeek.setDate(now.getDate() - now.getDay())
                const endOfWeek = new Date(now)
                endOfWeek.setDate(now.getDate() + (6 - now.getDay()))
                return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
            case 'month':
                return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            default:
                return now.getFullYear().toString()
        }
    }

    // Mock Data Generator (Extracted from AdminCommandCenter)
    const getGrowthData = () => {
        let baseData: number[] = []
        switch (growthMetric) {
            case 'views': baseData = [45, 60, 75, 50, 80, 95, 70]; break
            case 'wishlisted': baseData = [20, 35, 25, 40, 30, 50, 45]; break
            case 'products': baseData = [10, 15, 12, 18, 20, 25, 22]; break
            case 'suppliers': baseData = [5, 8, 4, 6, 9, 12, 10]; break
            case 'agents': baseData = [12, 18, 15, 22, 28, 35, 30]; break
            case 'sales': baseData = [30, 45, 40, 55, 60, 75, 65]; break
        }

        if (growthTimeFrame === 'day') {
            return baseData.map(v => Math.floor(v * 0.2))
        } else if (growthTimeFrame === 'month') {
            return baseData.slice(0, 4).map(v => Math.min(100, Math.floor(v * 1.5)))
        } else if (growthTimeFrame === 'year') {
            return [baseData[0] * 2, baseData[2] * 2.5, baseData[4] * 3, baseData[6] * 4].map(v => Math.floor(v))
        }
        return baseData
    }

    const growthLabels = {
        day: ['00', '04', '08', '12', '16', '20', '24'],
        week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        year: ['Q1', 'Q2', 'Q3', 'Q4']
    }

    const currentGrowthData = getGrowthData()
    const currentGrowthLabels = growthLabels[growthTimeFrame]

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex justify-between items-start mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-white">Platform Growth</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                        Current Period: <span className="text-indigo-400">{getCurrentPeriodLabel()}</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="relative group/select">
                        <select
                            value={growthMetric}
                            onChange={(e) => setGrowthMetric(e.target.value as any)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-white/70 pl-3 pr-8 py-1.5 outline-none focus:border-cyan-500 focus:text-white hover:bg-white/10 hover:border-white/20 cursor-pointer min-w-[120px] transition-all [&>option]:bg-[#0a0a0a] [&>option]:text-white"
                        >
                            <option value="views">Views</option>
                            <option value="wishlisted">Wishlisted</option>
                            <option value="products">Products</option>
                            <option value="suppliers">Suppliers</option>
                            <option value="agents">Agents</option>
                            <option value="sales">Sales</option>
                        </select>
                        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none group-hover/select:text-cyan-400 transition-colors" />
                    </div>
                    <div className="flex bg-black/30 border border-white/10 rounded-lg p-0.5">
                        {(['day', 'week', 'month', 'year'] as const).map((tf) => (
                            <button
                                key={tf}
                                onClick={() => setGrowthTimeFrame(tf)}
                                className={`px-3 py-1 text-xs rounded-md transition-all ${growthTimeFrame === tf ? 'bg-cyan-500 text-white font-bold' : 'text-white/40 hover:text-white'}`}
                            >
                                {tf.charAt(0).toUpperCase() + tf.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-48 flex items-end justify-between px-2 gap-2 mt-auto">
                {currentGrowthData.map((h, i) => {
                    const gradients = [
                        'from-pink-500 via-purple-500 to-indigo-500',
                        'from-purple-500 via-indigo-500 to-blue-500',
                        'from-indigo-500 via-blue-500 to-cyan-400',
                        'from-blue-500 via-cyan-500 to-teal-400',
                        'from-cyan-500 via-teal-500 to-emerald-400',
                        'from-teal-500 via-emerald-500 to-green-400',
                        'from-emerald-500 via-green-500 to-lime-400'
                    ]
                    const barGradient = gradients[i % gradients.length]

                    return (
                        <div key={i} className="w-full bg-white/5 rounded-t-xl relative group h-full">
                            <div
                                style={{ height: `${h}%` }}
                                className={`w-full absolute bottom-0 bg-gradient-to-t ${barGradient} rounded-t-xl transition-all duration-500 opacity-80 group-hover:opacity-100 shadow-[0_0_20px_rgba(255,255,255,0.1)]`}
                            >
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-20 shadow-xl">
                                    {h} {growthMetric}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-white/40 font-mono">
                {currentGrowthLabels.map((l, i) => (
                    <span key={i} className="w-full text-center">{l}</span>
                ))}
            </div>
        </div>
    )
}

export default PlatformGrowthChart
