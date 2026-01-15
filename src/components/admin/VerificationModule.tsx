'use client'

import { FaUserTie, FaBuilding, FaShieldAlt } from 'react-icons/fa'

interface VerificationModuleProps {
    pendingAgents: any[]
    pendingSuppliers: any[]
    onVerify: (type: 'agent' | 'supplier', id: string, status: 'approved' | 'rejected') => Promise<void>
    onOpenModal: (supplier: any) => void
    isLoading: boolean
}

// Tactical Helper Components
const VerificationProp = ({ label, value, isMono = false, isStatus = false }: any) => (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</span>
        <span className={`
            text-[11px] font-bold 
            ${isMono ? 'font-mono text-indigo-300' : 'text-white'}
            ${isStatus ? 'text-amber-400 animate-pulse' : ''}
        `}>
            {value}
        </span>
    </div>
)

export default function VerificationModule({ pendingAgents, pendingSuppliers, onVerify, onOpenModal, isLoading }: VerificationModuleProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Strategic Verification Queue</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Founding Member Authority Required • Manual Signal Check</p>
                </div>
                <div className="bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
                    <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{pendingAgents.length + pendingSuppliers.length} Signals Pending</span>
                </div>
            </div>

            {pendingAgents.length === 0 && pendingSuppliers.length === 0 ? (
                <div className="text-center py-32 bg-slate-900/40 backdrop-blur-xl border border-dashed border-white/10 rounded-3xl">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                        <FaShieldAlt className="text-green-500 text-2xl" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase mb-2">Queue Status: Clear</h3>
                    <p className="text-slate-500 text-sm font-medium">All strategic assets have been processed. Systems are nominal.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Agents */}
                    {pendingAgents.map((agent) => (
                        <div key={agent.id} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl group hover:border-indigo-500/30 transition-all duration-500 h-fit">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                    <FaUserTie />
                                </div>
                                <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-3 py-1.5 rounded-lg border border-indigo-500/20 uppercase tracking-widest leading-none">
                                    Agent Profile
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">{agent.agency_name}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">{agent.email}</p>

                            <div className="space-y-3 mb-8">
                                <VerificationProp label="Mission Sector" value={agent.country || 'Global'} />
                                <VerificationProp label="Protocol ID" value={agent.license_number || 'UNVERIFIED'} isMono />
                                <VerificationProp label="Auth Status" value="Awaiting Hub Signal" isStatus />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => onVerify('agent', agent.id, 'rejected')}
                                    disabled={isLoading}
                                    className="py-3 px-4 rounded-xl border border-white/5 hover:bg-red-500/10 hover:border-red-500/30 text-slate-500 hover:text-red-400 text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Deny Signal
                                </button>
                                <button
                                    onClick={() => onVerify('agent', agent.id, 'approved')}
                                    disabled={isLoading}
                                    className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(79,70,229,0.2)] hover:shadow-[0_10px_25px_rgba(79,70,229,0.3)]"
                                >
                                    Authorize
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Suppliers */}
                    {pendingSuppliers.map((supplier) => (
                        <div
                            key={supplier.id}
                            className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl group hover:border-amber-500/30 transition-all duration-500 cursor-pointer relative overflow-hidden h-fit"
                            onClick={() => onOpenModal(supplier)}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 text-xl border border-amber-500/20 group-hover:scale-110 transition-transform">
                                        <FaBuilding />
                                    </div>
                                    <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-3 py-1.5 rounded-lg border border-amber-500/20 uppercase tracking-widest leading-none">
                                        Supplier Hub
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">{supplier.company_name}</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">{supplier.contact_email}</p>

                                <div className="space-y-3 mb-8">
                                    <VerificationProp label="Operational Hub" value={supplier.country_code || 'Unknown'} />
                                    <VerificationProp label="Registration" value={supplier.company_reg_no || 'Pending'} isMono />
                                    <VerificationProp label="Asset Type" value={supplier.supplier_type || 'Unspecified'} />
                                </div>

                                <div className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-500 transition-all duration-300">
                                    Initialize Verification
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
