'use client'

import React from 'react'
import { FaUserCircle, FaEdit, FaSignOutAlt, FaBuilding, FaGlobe, FaPhone, FaEnvelope } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function AccountTab({ supplier, user, handleLogout }: { supplier: any, user: any, handleLogout: () => void }) {
    const router = useRouter()

    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-white/5">
                            {(supplier?.company_name || 'S').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{supplier?.company_name || 'Your Company'}</h2>
                            <div className="space-y-1 text-white/60 text-sm">
                                <div className="flex items-center gap-2"><FaEnvelope className="text-blue-400" /> {user?.email}</div>
                                {supplier?.website && <div className="flex items-center gap-2"><FaGlobe className="text-blue-400" /> {supplier.website}</div>}
                                {supplier?.phone && <div className="flex items-center gap-2"><FaPhone className="text-blue-400" /> {supplier.phone}</div>}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/supplier/dashboard/profile')}
                        className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-bold transition-all flex items-center gap-2 text-sm"
                    >
                        <FaEdit /> Edit Profile
                    </button>
                </div>

                <div className="border-t border-white/10 mt-8 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4">Company Details</h3>
                        <div className="space-y-4">
                            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                <div className="text-xs text-white/40 mb-1">Company Name</div>
                                <div className="text-white font-medium">{supplier?.company_name || '-'}</div>
                            </div>
                            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                <div className="text-xs text-white/40 mb-1">Business Type</div>
                                <div className="text-white font-medium capitalize">{supplier?.supplier_type || '-'}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4">Account Security</h3>
                        <div className="space-y-4">
                            <button onClick={() => router.push('/auth/reset-password')} className="w-full text-left bg-black/20 hover:bg-black/30 rounded-xl p-4 border border-white/5 transition-colors group">
                                <div className="text-white font-medium group-hover:text-amber-400 transition-colors">Change Password</div>
                                <div className="text-xs text-white/40">Last changed: Never</div>
                            </button>
                            <button onClick={handleLogout} className="w-full text-left bg-red-500/10 hover:bg-red-500/20 rounded-xl p-4 border border-red-500/20 transition-colors group">
                                <div className="text-red-400 font-bold group-hover:text-red-300">Logout</div>
                                <div className="text-xs text-red-400/50">Sign out of your account</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
