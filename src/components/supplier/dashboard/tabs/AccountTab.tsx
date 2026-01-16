'use client'

import React from 'react'
import { FaUserCircle, FaEdit, FaSignOutAlt, FaBuilding, FaGlobe, FaPhone, FaEnvelope } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function AccountTab({ supplier, user, handleLogout }: { supplier: any, user: any, handleLogout: () => void }) {
    const router = useRouter()

    return (
        <div className="space-y-6">
            <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl font-bold text-amber-500">
                                {(supplier?.company_name || 'S').charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{supplier?.company_name || 'Your Company'}</h2>
                            <div className="space-y-1 text-slate-400 text-sm font-medium">
                                <div className="flex items-center gap-2"><FaEnvelope className="text-amber-500" /> {user?.email}</div>
                                {supplier?.website && <div className="flex items-center gap-2"><FaGlobe className="text-amber-500" /> {supplier.website}</div>}
                                {supplier?.phone && <div className="flex items-center gap-2"><FaPhone className="text-amber-500" /> {supplier.phone}</div>}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/supplier/dashboard/profile')}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-amber-500/50 rounded-xl text-white font-bold transition-all flex items-center gap-2 text-sm shadow-lg group"
                    >
                        <FaEdit className="text-amber-500 group-hover:scale-110 transition-transform" /> Edit Profile
                    </button>
                </div>

                <div className="border-t border-white/5 mt-8 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-amber-500/80 text-xs font-bold uppercase tracking-widest mb-4">Company Details</h3>
                        <div className="space-y-4">
                            <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                                <div className="text-xs text-slate-500 mb-1 font-bold uppercase">Company Name</div>
                                <div className="text-slate-200 font-medium text-lg">{supplier?.company_name || '-'}</div>
                            </div>
                            <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                                <div className="text-xs text-slate-500 mb-1 font-bold uppercase">Business Type</div>
                                <div className="text-slate-200 font-medium capitalize text-lg">{supplier?.supplier_type || '-'}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-amber-500/80 text-xs font-bold uppercase tracking-widest mb-4">Account Security</h3>
                        <div className="space-y-4">
                            <button onClick={() => router.push('/auth/reset-password')} className="w-full text-left bg-slate-900/50 hover:bg-slate-800/80 rounded-xl p-4 border border-white/5 transition-all group hover:border-amber-500/30">
                                <div className="text-slate-200 font-medium group-hover:text-amber-400 transition-colors">Change Password</div>
                                <div className="text-xs text-slate-500 mt-1">Last changed: Never</div>
                            </button>
                            <button onClick={handleLogout} className="w-full text-left bg-red-500/5 hover:bg-red-500/10 rounded-xl p-4 border border-red-500/10 hover:border-red-500/30 transition-all group">
                                <div className="text-red-400 font-bold group-hover:text-red-300">Logout</div>
                                <div className="text-xs text-red-400/50 mt-1">Sign out of your account</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
