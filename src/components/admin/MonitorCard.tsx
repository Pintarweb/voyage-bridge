import React from 'react'
import CountUp from '@/components/common/CountUp'

interface MonitorCardProps {
    label: string
    value: number | string
    subtext: string
    icon: React.ReactNode
    highlight?: boolean
    prefix?: string
    suffix?: string
}

const MonitorCard: React.FC<MonitorCardProps> = ({
    label,
    value,
    subtext,
    icon,
    highlight = false,
    prefix = '',
    suffix = ''
}) => {
    const isNumeric = typeof value === 'number'

    return (
        <div className={`
            relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-white/10 group
            ${highlight ? 'shadow-[0_20px_40px_rgba(79,70,229,0.1)]' : ''}
        `}>
            {highlight && <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px]" />}
            <div className="flex justify-between items-start mb-6">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl border border-white/5 bg-slate-950 group-hover:scale-110 transition-transform ${highlight ? 'text-indigo-400 border-indigo-500/20' : 'text-slate-400'}`}>
                    {icon}
                </div>
            </div>
            <div className="relative z-10">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{label}</h3>
                <div className="text-4xl font-black text-white tracking-tighter mb-2">
                    {isNumeric ? (
                        <CountUp end={value as number} prefix={prefix} suffix={suffix} />
                    ) : (
                        <>{prefix}{value}{suffix}</>
                    )}
                </div>
                <div className="text-[13px] text-slate-600 font-bold uppercase tracking-widest">{subtext}</div>
            </div>
        </div>
    )
}

export default MonitorCard
