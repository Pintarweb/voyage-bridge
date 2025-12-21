'use client'

import { useState, useEffect } from 'react'
import { FaTimes, FaCheck, FaBuilding, FaFileContract, FaIdCard, FaImage, FaAlignLeft, FaTag, FaPhone, FaExclamationTriangle, FaPaperPlane, FaBan, FaBolt } from 'react-icons/fa'
import confetti from 'canvas-confetti'

interface VerificationModalProps {
    isOpen: boolean
    onClose: () => void
    supplier: any
    onApprove: (id: string, data: any) => Promise<void>
    onReject: (id: string, data: any) => Promise<void>
    onRequestInfo: (id: string, data: any) => Promise<void>
}

export default function SupplierVerificationModal({ isOpen, onClose, supplier, onApprove, onReject, onRequestInfo }: VerificationModalProps) {
    const [checklist, setChecklist] = useState({
        legalName: false,
        regNumber: false,
        taxId: false,
        license: false,
        contactReachability: false
    })

    const [riskLevel, setRiskLevel] = useState(1) // 1-10
    const [internalNotes, setInternalNotes] = useState('')
    const [showRejectReason, setShowRejectReason] = useState(false)
    const [rejectReason, setRejectReason] = useState('doc_missing')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Reset state when supplier changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setChecklist({
                legalName: false,
                regNumber: false,
                taxId: false,
                license: false,
                contactReachability: false
            })
            setRiskLevel(1)
            setInternalNotes('')
            setShowRejectReason(false)
        }
    }, [isOpen, supplier])

    if (!isOpen || !supplier) return null

    const toggleCheck = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleApprove = async () => {
        // 1. Confirmation Message
        if (!confirm(`Are you sure you want to approve ${supplier.company_name}?\n\nThis will:\n- Activate their account\n- Send a welcome email\n- Trigger password setup`)) {
            return
        }

        setIsSubmitting(true)
        // Confetti effect
        const duration = 3000
        const end = Date.now() + duration

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#eab308', '#22d3ee', '#ffffff']
            })
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#eab308', '#22d3ee', '#ffffff']
            })

            if (Date.now() < end) {
                requestAnimationFrame(frame)
            }
        }
        frame()

        try {
            // 3. Update Database & Send Email (Handled by Parent via Server Action)
            await onApprove(supplier.id, { riskLevel, internalNotes, checklist })
        } catch (error) {
            console.error('Approval failed', error)
            alert('Approval process failed. Please try again.')
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
        await onReject(supplier.id, { reason: rejectReason, internalNotes })
        setIsSubmitting(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-4xl bg-[#0F172A]/90 backdrop-blur-2xl border-[1.5px] border-white/20 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">

                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/10 bg-white/5">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                            {supplier.company_name}
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Pending Verification
                            </span>
                        </h2>
                        <div className="text-sm text-white/50 font-mono">
                            Pending Since: {new Date(supplier.created_at || Date.now()).toLocaleDateString()}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">

                    <div className="space-y-6">
                        {/* Section 1: Identity & Legal */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FaBuilding /> Identity & Legal Verification
                            </h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        id: 'legalName',
                                        label: 'Legal Name vs. Trading Name',
                                        icon: FaFileContract,
                                        value: supplier.company_name,
                                        subValue: 'Trading Name'
                                    },
                                    {
                                        id: 'regNumber',
                                        label: 'Registration No. Check',
                                        icon: FaIdCard,
                                        value: supplier.company_reg_no || 'N/A',
                                        subValue: 'Official Registry'
                                    },
                                    {
                                        id: 'taxId',
                                        label: 'Tax / Location Verification',
                                        icon: FaTag,
                                        value: supplier.country || supplier.country_code || 'N/A',
                                        subValue: 'Tax Jurisdiction'
                                    },
                                    {
                                        id: 'license',
                                        label: 'Operating License Valid',
                                        icon: FaCheck,
                                        value: supplier.license_number || 'Pending Submission',
                                        subValue: 'Travel/Transport License'
                                    },
                                    {
                                        id: 'contactReachability',
                                        label: 'Contact Reachability',
                                        icon: FaPhone,
                                        value: supplier.contact_email,
                                        subValue: supplier.phone_number || 'No Phone'
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleCheck(item.id as keyof typeof checklist)}
                                        className={`
                                            group flex items-center justify-between p-5 rounded-xl border cursor-pointer transition-all
                                            ${checklist[item.id as keyof typeof checklist]
                                                ? 'bg-green-500/10 border-green-500/30'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-500/30'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-6 flex-1">
                                            {/* Icon */}
                                            <div className={`text-xl p-3 rounded-lg bg-black/20 ${checklist[item.id as keyof typeof checklist] ? 'text-green-400' : 'text-white/40 group-hover:text-cyan-400'}`}>
                                                <item.icon />
                                            </div>

                                            {/* Label & Details */}
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <span className={`block text-sm font-bold mb-1 ${checklist[item.id as keyof typeof checklist] ? 'text-white' : 'text-white/70'}`}>
                                                        {item.label}
                                                    </span>
                                                    <span className="text-xs text-white/30 uppercase tracking-widest">{item.subValue}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="bg-black/20 px-3 py-2 rounded-lg border border-white/5 w-full">
                                                        <span className="text-xs font-mono text-cyan-300 break-all">
                                                            {item.value || 'Not Provided'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Checkbox */}
                                        <div className={`
                                            ml-6 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0
                                            ${checklist[item.id as keyof typeof checklist]
                                                ? 'bg-green-500 border-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                                                : 'border-white/20 group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                                            }
                                        `}>
                                            {checklist[item.id as keyof typeof checklist] && <FaCheck className="text-sm" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Risk Assessment */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-4">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <FaExclamationTriangle className="text-amber-400" /> Risk Assessment
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-white/50">
                                        <span>Low Risk</span>
                                        <span className="text-amber-400">Moderate</span>
                                        <span className="text-red-500">High Risk</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={riskLevel}
                                        onChange={(e) => setRiskLevel(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gradient-to-r from-green-500 via-amber-400 to-red-600 rounded-lg appearance-none cursor-pointer accent-white"
                                    />
                                    <div className="text-center font-mono text-cyan-400 font-bold">
                                        Level: {riskLevel}/10
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Internal Notes</label>
                                <textarea
                                    value={internalNotes}
                                    onChange={(e) => setInternalNotes(e.target.value)}
                                    placeholder="Add admin-only notes here..."
                                    className="w-full h-24 bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl flex items-center justify-between gap-4">

                    {/* Reject Side */}
                    <div className="flex items-center gap-3">
                        {showRejectReason ? (
                            <div className="flex items-center gap-2 animate-fade-in-right">
                                <select
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="bg-black/30 border border-red-500/30 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-red-500"
                                >
                                    <option value="doc_missing">Documentation Missing</option>
                                    <option value="low_quality">Content Quality Issues</option>
                                    <option value="suspicious">Suspicious Activity</option>
                                    <option value="other">Other (See Notes)</option>
                                </select>
                                <button
                                    onClick={handleReject}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 rounded-xl font-bold transition-all"
                                >
                                    Confirm Reject
                                </button>
                                <button onClick={() => setShowRejectReason(false)} className="text-white/40 hover:text-white px-2">Cancel</button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowRejectReason(true)}
                                className="px-6 py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 text-white/60 hover:text-red-400 rounded-xl font-bold transition-all flex items-center gap-2"
                            >
                                <FaBan /> Reject
                            </button>
                        )}
                    </div>

                    {/* Approve Side */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onRequestInfo(supplier.id, { internalNotes })}
                            className="px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl font-bold transition-all flex items-center gap-2"
                        >
                            <FaPaperPlane /> Request Info
                        </button>
                        <button
                            onClick={handleApprove}
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-bold rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-1 flex items-center gap-2 animate-pulse hover:animate-none"
                        >
                            <FaBolt /> Approve & Activate
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
