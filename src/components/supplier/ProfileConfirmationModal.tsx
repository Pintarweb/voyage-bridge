'use client'

import React from 'react'
import { FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa'

interface ProfileConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    originalData: any
    newData: any
    isSaving: boolean
}

export default function ProfileConfirmationModal({ isOpen, onClose, onConfirm, originalData, newData, isSaving }: ProfileConfirmationModalProps) {
    if (!isOpen) return null

    // Calculate changes
    const changes: { field: string, oldVal: string, newVal: string }[] = []

    const friendlyNames: Record<string, string> = {
        phone_number: 'Phone Number',
        address_line_1: 'Address',
        city: 'City',
        postcode: 'Postcode',
        website_url: 'Website',
        whatsapp_business_url: 'WhatsApp URL',
        description: 'About / Description',
        social_instagram: 'Instagram',
        social_facebook: 'Facebook',
        social_tiktok: 'TikTok',
        social_linkedin: 'LinkedIn',
        social_tripadvisor: 'TripAdvisor',
        languages_spoken: 'Languages Spoken'
    }

    Object.keys(newData).forEach(key => {
        let oldVal = originalData[key]
        let newVal = newData[key]

        // Handle nulls/undefined
        if (!oldVal) oldVal = ''
        if (!newVal) newVal = ''

        // Handle arrays (languages)
        if (Array.isArray(oldVal)) oldVal = oldVal.sort().join(', ')
        if (Array.isArray(newVal)) newVal = newVal.sort().join(', ')

        if (oldVal !== newVal) {
            changes.push({
                field: friendlyNames[key] || key,
                oldVal: oldVal || '(empty)',
                newVal: newVal || '(empty)'
            })
        }
    })

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl shadow-2xl shadow-amber-900/20 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 scale-100 group">

                {/* Glass Background with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-95" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />

                {/* Border Glow */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />

                <div className="relative p-1">
                    <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-xl border border-white/5">

                        {/* Header */}
                        <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                        <FaExclamationTriangle size={18} />
                                    </span>
                                    Review Updates
                                </h2>
                                <p className="text-slate-400 text-sm mt-2 ml-1">Confirm the changes before saving.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white p-2 rounded-lg transition-all border border-transparent hover:border-white/10"
                            >
                                <FaTimes size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-4 mb-8 max-h-[55vh] overflow-y-auto custom-scrollbar pr-2">
                            {changes.length === 0 ? (
                                <div className="text-center py-10 bg-white/5 rounded-xl border border-dashed border-white/10">
                                    <p className="text-slate-400 font-medium">No changes detected yet.</p>
                                </div>
                            ) : (
                                changes.map((change, idx) => (
                                    <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all group/item shadow-sm">
                                        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
                                            {change.field}
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                                <span className="text-[10px] font-bold text-red-400 uppercase block mb-1.5 opacity-80">Previous</span>
                                                <div className="text-red-300 line-through text-sm break-all">
                                                    {change.oldVal}
                                                </div>
                                            </div>
                                            <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                                                <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1.5 opacity-80">New</span>
                                                <div className="text-emerald-300 font-medium text-sm break-all">
                                                    {change.newVal}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isSaving || changes.length === 0}
                                className={`flex items-center px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5 border border-transparent ${isSaving || changes.length === 0
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border-white/5'
                                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:to-amber-500 text-white shadow-amber-500/20 hover:shadow-amber-500/40 border-amber-400/20'
                                    }`}
                            >
                                {isSaving ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaCheck className="mr-2" />
                                        Confirm Update
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.25);
                }
            `}</style>
        </div>
    )
}
