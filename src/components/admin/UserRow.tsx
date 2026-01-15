'use client'

import { FaUserTie, FaBuilding, FaEllipsisV } from 'react-icons/fa'

interface UserRowProps {
    user: any
    type: 'Agent' | 'Supplier'
    onView: (user: any) => void
    getCountryInfo: (code: string) => { name: string, flag: string }
}

export default function UserRow({ user, type, onView, getCountryInfo }: UserRowProps) {
    return (
        <tr
            onClick={() => onView(user)}
            className="border-b border-white/5 hover:bg-indigo-500/5 transition-all group cursor-pointer"
        >
            <td className="py-5 px-6">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border border-white/5 bg-slate-950 group-hover:scale-110 transition-transform ${type === 'Agent' ? 'text-indigo-400' : 'text-amber-400'}`}>
                        {type === 'Agent' ? <FaUserTie /> : <FaBuilding />}
                    </div>
                    <div>
                        <div className="font-black text-white text-[15px] uppercase tracking-tight group-hover:text-indigo-300 transition-colors">{user.company_name || user.agency_name || 'N/A'}</div>
                        <div className="text-[12px] text-slate-500 font-bold uppercase tracking-[0.2em]">{type} Node</div>
                    </div>
                </div>
            </td>
            <td className="py-5 px-6">
                <div className="text-[14px] text-slate-400 font-medium">{user.email || user.contact_email}</div>
                <div className="text-[11px] text-slate-600 font-mono mt-0.5">UID: {user.id.slice(0, 8)}...</div>
            </td>
            <td className="py-5 px-6 text-center">
                <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">{getCountryInfo(user.country_code || user.country).flag}</span>
                    <span className="text-[12px] text-slate-400 font-black uppercase tracking-widest">{getCountryInfo(user.country_code || user.country).name}</span>
                </div>
            </td>
            <td className="py-5 px-6">
                {(() => {
                    let status = 'pending'
                    let statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]'

                    if (user.is_approved) {
                        status = 'active'
                        statusColor = 'text-green-400 bg-green-500/10 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                    } else if (type === 'Agent') {
                        if (user.verification_status === 'rejected') {
                            status = 'rejected'
                            statusColor = 'text-red-400 bg-red-500/10 border-red-500/20'
                        }
                    } else {
                        // Supplier
                        if (user.subscription_status === 'canceled') {
                            status = 'offline'
                            statusColor = 'text-slate-500 bg-white/5 border-white/10'
                        } else if (user.subscription_status === 'past_due') {
                            status = 'frozen'
                            statusColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                        } else if (user.rejection_reason) {
                            status = 'rejected'
                            statusColor = 'text-red-400 bg-red-500/10 border-red-500/20'
                        }
                    }

                    return (
                        <div className={`
                            inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-black uppercase tracking-widest
                            ${statusColor}
                        `}>
                            <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-current shadow-sm'}`} />
                            {status}
                        </div>
                    )
                })()}
            </td>
            <td className="py-5 px-6 text-right">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                    <FaEllipsisV className="text-xs" />
                </button>
            </td>
        </tr>
    )
}
