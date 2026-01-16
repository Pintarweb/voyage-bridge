import React from 'react'
import { FaChevronDown } from 'react-icons/fa'

interface FilterSelectProps {
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: { value: string; label: string }[]
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, value, onChange, options }) => (
    <div className="relative group/select">
        <label className="absolute -top-2 left-4 px-2 bg-slate-900 text-[11px] font-black text-slate-500 uppercase tracking-widest z-10">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="appearance-none bg-slate-950/50 border border-white/10 rounded-xl text-[12px] font-black uppercase tracking-wider text-slate-400 pl-4 pr-10 py-2.5 outline-none focus:border-indigo-500 focus:text-white hover:bg-slate-900 hover:border-white/20 cursor-pointer min-w-[160px] transition-all"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] pointer-events-none group-hover/select:text-indigo-400 transition-colors" />
    </div>
)

export default FilterSelect
