'use client'

import React from 'react'
import { FaTimes, FaCheck } from 'react-icons/fa'

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-foreground">Review Changes</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="space-y-4 mb-8 max-h-[60vh] overflow-y-auto pr-2">
                    {changes.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No changes detected.</p>
                    ) : (
                        changes.map((change, idx) => (
                            <div key={idx} className="bg-muted/50 p-3 rounded-lg border border-border/50 text-sm">
                                <p className="font-semibold text-foreground mb-1">{change.field}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-red-500/80 line-through text-xs break-all">
                                        {change.oldVal}
                                    </div>
                                    <div className="text-green-600 dark:text-green-400 font-medium text-xs break-all">
                                        {change.newVal}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isSaving || changes.length === 0}
                        className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    )
}
