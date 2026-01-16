'use client'

import { useState, useEffect } from 'react'
import { FaTimes, FaCheck, FaUserTie, FaBuilding, FaFileContract, FaIdCard, FaGlobe, FaExclamationTriangle, FaPaperPlane, FaBan, FaBolt, FaShieldAlt, FaFingerprint, FaGavel, FaSatelliteDish } from 'react-icons/fa'
import confetti from 'canvas-confetti'

interface AgentVerificationModalProps {
    isOpen: boolean
    onClose: () => void
    agent: any
    onApprove: (id: string, data: any) => Promise<void>
    onReject: (id: string, data: any) => Promise<void>
}

export default function AgentVerificationModal({ isOpen, onClose, agent, onApprove, onReject }: AgentVerificationModalProps) {
    const [checklist, setChecklist] = useState({
        legalName: false,
        license: false,
        contactReachability: false,
        countryCheck: false
    })

    const [riskLevel, setRiskLevel] = useState(1) // 1-10
    const [internalNotes, setInternalNotes] = useState('')
    const [showRejectReason, setShowRejectReason] = useState(false)
    const [rejectReason, setRejectReason] = useState('doc_missing')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setChecklist({
                legalName: false,
                license: false,
                contactReachability: false,
                countryCheck: false
            })
            setRiskLevel(1)
            setInternalNotes('')
            setShowRejectReason(false)
        }
    }, [isOpen, agent])

    if (!isOpen || !agent) return null

    const toggleCheck = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleApprove = async () => {
        if (!confirm(`CONFIRM STRATEGIC APPROVAL?\n\nThis will:\n- Activate ${agent.agency_name} node\n- Grant Agent Access Privileges\n- Initialize biometric setup credentials`)) {
            return
        }

        setIsSubmitting(true)

        // Tactical celebration
        const duration = 3000
        const end = Date.now() + duration

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6366f1', '#818cf8', '#ffffff']
            })
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6366f1', '#818cf8', '#ffffff']
            })

            if (Date.now() < end) {
                requestAnimationFrame(frame)
            }
        }
        frame()

        try {
            await onApprove(agent.id, { riskLevel, internalNotes, checklist })
        } catch (error) {
            console.error('Approval failed', error)
        } finally {
            setIsSubmitting(false)
            onClose()
        }
    }

    const handleReject = async () => {
        if (!showRejectReason) {
            setShowRejectReason(true)
            return
        }
        setIsSubmitting(true)
        await onReject(agent.id, { reason: rejectReason, internalNotes })
        setIsSubmitting(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-500" onClick={onClose} />

            <div className="relative w-full max-w-4xl bg-slate-900/90 border border-white/10 rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-700">

                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

                <div className="flex items-center justify-between p-10 border-b border-white/5 relative z-10 bg-slate-950/20">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                                <FaUserTie />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                                    {agent.agency_name}
                                </h2>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        Verification Pending
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                                        Agent Node ID: {agent.id.slice(0, 8).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:bg-white/10 hover:text-white transition-all shadow-xl"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar bg-slate-900/40">

                    <div>
                        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <FaFingerprint /> Agent Integrity Verification Protocol
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { id: 'legalName', label: 'Agency Legal Name', icon: FaBuilding, value: agent.agency_name, ref: 'Company Registry' },
                                { id: 'license', label: 'License / Registration ID', icon: FaFileContract, value: agent.license_number || 'UNVERIFIED', ref: 'Tourism Authority' },
                                { id: 'countryCheck', label: 'Operational Residency', icon: FaGlobe, value: agent.country || 'GLOBAL', ref: 'Regional Jurisdiction' },
                                { id: 'contactReachability', label: 'Communication Link', icon: FaSatelliteDish, value: agent.email, ref: 'Verified Agent Email' },
                            ].map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => toggleCheck(item.id as keyof typeof checklist)}
                                    className={`
                                        relative group flex items-center justify-between p-6 rounded-3xl border transition-all cursor-pointer overflow-hidden
                                        ${checklist[item.id as keyof typeof checklist]
                                            ? 'bg-indigo-500/10 border-indigo-500/30'
                                            : 'bg-slate-950/40 border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-8 flex-1">
                                        <div className={`
                                            w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all
                                            ${checklist[item.id as keyof typeof checklist]
                                                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'
                                                : 'bg-slate-900 text-slate-600 border border-white/5'
                                            }
                                        `}>
                                            <item.icon />
                                        </div>

                                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                            <div>
                                                <span className={`block text-[13px] font-black uppercase tracking-tight mb-1 ${checklist[item.id as keyof typeof checklist] ? 'text-white' : 'text-slate-400'}`}>
                                                    {item.label}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1 h-3 rounded-full ${checklist[item.id as keyof typeof checklist] ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.ref}</span>
                                                </div>
                                            </div>
                                            <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/5 shadow-inner">
                                                <span className="text-xs font-mono text-indigo-300 tracking-wider">
                                                    {item.value}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`
                                        ml-8 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shrink-0
                                        ${checklist[item.id as keyof typeof checklist]
                                            ? 'bg-indigo-500 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                                            : 'border-white/10 group-hover:border-indigo-500/50'
                                        }
                                    `}>
                                        <FaCheck className={`text-sm transition-transform ${checklist[item.id as keyof typeof checklist] ? 'scale-110' : 'scale-0'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                        <div className="space-y-6 bg-slate-950/40 p-8 rounded-3xl border border-white/5">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                                <FaExclamationTriangle className="text-amber-500" /> Integrity Risk Analysis
                            </h3>
                            <div className="space-y-6">
                                <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                    <span>Minimal Risk</span>
                                    <span className="text-red-500">Critical Threat</span>
                                </div>
                                <div className="relative group/range py-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={riskLevel}
                                        onChange={(e) => setRiskLevel(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all border border-white/5 shadow-inner"
                                    />
                                    <div
                                        className="absolute -top-4 w-fit px-3 py-1.5 bg-indigo-600 text-[10px] font-black text-white rounded-lg shadow-xl translate-x-[-50%]"
                                        style={{ left: `${(riskLevel - 1) * 11}%` }}
                                    >
                                        LVL {riskLevel}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Agent Strategic Notes</h3>
                            <textarea
                                value={internalNotes}
                                onChange={(e) => setInternalNotes(e.target.value)}
                                placeholder="Verification insights for this agent node..."
                                className="w-full h-full min-h-[180px] bg-slate-950/60 border border-white/5 rounded-3xl p-6 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/30 transition-all resize-none shadow-inner font-medium"
                            />
                        </div>
                    </div>

                </div>

                <div className="p-10 border-t border-white/10 bg-slate-950 relative z-10 flex items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        {showRejectReason ? (
                            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
                                <select
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="bg-slate-900 border border-red-500/20 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl px-6 py-4 outline-none focus:border-red-500/50 shadow-inner"
                                >
                                    <option value="doc_missing">Documentation Incomplete</option>
                                    <option value="invalid_license">Invalid License Data</option>
                                    <option value="suspended">Previous Blacklist detected</option>
                                    <option value="other">General Validation Failure</option>
                                </select>
                                <button
                                    onClick={handleReject}
                                    disabled={isSubmitting}
                                    className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-2xl transition-all shadow-[0_10px_30px_rgba(220,38,38,0.2)]"
                                >
                                    {isSubmitting ? 'SYNCING...' : 'CONFIRM DENIAL'}
                                </button>
                                <button
                                    onClick={() => setShowRejectReason(false)}
                                    className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest px-4 transition-colors"
                                >
                                    Abort
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowRejectReason(true)}
                                className="px-8 py-4 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 text-slate-500 hover:text-red-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all flex items-center gap-3"
                            >
                                <FaBan /> Deny Signal
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleApprove}
                            disabled={isSubmitting}
                            className={`
                                group relative px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all flex items-center gap-3 overflow-hidden
                                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'}
                            `}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <FaBolt className="text-white group-hover:animate-pulse" />
                            {isSubmitting ? 'AUTHORIZING...' : 'STRATEGIC APPROVAL'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
