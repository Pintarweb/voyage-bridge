import React from 'react'

interface StatMiniCardProps {
    label: string
    value: string | number
    icon: React.ReactNode
    color: string
    subValue?: string
}

const StatMiniCard: React.FC<StatMiniCardProps> = ({ label, value, icon, color, subValue }) => (
    <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 group hover:border-indigo-500/20 transition-all duration-500">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${color} bg-slate-950 border border-white/5 group-hover:scale-110 transition-transform shadow-2xl`}>
                {icon}
            </div>
            {subValue && <span className="text-[12px] font-black text-slate-600 uppercase tracking-widest">{subValue}</span>}
        </div>
        <div>
            <h3 className="text-[13px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</h3>
            <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
        </div>
    </div>
)

export default StatMiniCard
