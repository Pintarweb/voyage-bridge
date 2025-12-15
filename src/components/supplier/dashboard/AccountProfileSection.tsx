'use client'

import React, { useState } from 'react'
import { FaUserCircle, FaSignOutAlt, FaEdit, FaCreditCard, FaPause, FaTimes, FaPlus, FaPlay, FaExclamationTriangle } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { ChangeSlotsModal, PauseModal, ResumeModal, CancelSubscriptionModal } from './SubscriptionModals'

interface AccountProfileSectionProps {
    user: any
    supplier: any
    content: any
    handleLogout: () => void
}

export default function AccountProfileSection({ user, supplier, content, handleLogout }: AccountProfileSectionProps) {
    const router = useRouter()
    const [isSlotsModalOpen, setIsSlotsModalOpen] = useState(false)
    const [isPauseModalOpen, setIsPauseModalOpen] = useState(false)
    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

    // Helper to call our new API
    const manageSubscription = async (action: 'update_slots' | 'pause' | 'resume', payload: any = {}) => {
        const res = await fetch('/api/stripe/manage-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                action,
                ...payload
            })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Request failed')
        // Refresh page to show new state
        window.location.reload()
    }

    const openStripePortal = async () => {
        try {
            const res = await fetch('/api/stripe/create-portal-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                alert('Could not open billing portal. Please contact support.')
            }
        } catch (e) {
            console.error(e)
            alert('Error opening billing portal.')
        }
    }

    const isPaused = supplier?.subscription_status === 'paused' || supplier?.subscription_status === 'canceled'

    return (
        <div className="space-y-6">
            {/* Personalize Title / Welcome Message */}
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                    {content.welcomeBack}, {supplier?.company_name || supplier?.name || 'Partner'}
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account and subscription preferences here.
                </p>
            </div>

            {supplier?.is_paused && (
                <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-8 border-yellow-500 p-6 rounded-r-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-start gap-5">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex-shrink-0">
                            <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400 text-2xl" />
                        </div>
                        <div>
                            <h4 className="font-bold text-yellow-900 dark:text-yellow-100 text-xl mb-2">Action Required: Scheduled Pause</h4>
                            <p className="text-base text-yellow-800 dark:text-yellow-200 leading-relaxed">
                                Your account is scheduled to be paused on <strong className="text-yellow-950 dark:text-yellow-50">{new Date(supplier?.current_period_end).toLocaleDateString()}</strong> at the end of your billing cycle.
                                <br />
                                <span className="font-semibold mt-1 block">Cancel the pause to prevent your products from being hidden.</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsResumeModalOpen(true)}
                        className="flex-shrink-0 px-6 py-3 bg-yellow-600 text-white rounded-xl text-base font-bold hover:bg-yellow-700 transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
                    >
                        Cancel Pause
                    </button>
                </div>
            )}


            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Profile Info */}
                    <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            {/* You might want a real avatar here if available */}
                            <span className="text-2xl font-bold">
                                {(supplier?.company_name || supplier?.name || user?.email || 'S').charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">
                                {supplier?.company_name || supplier?.name || 'Supplier'}
                            </h2>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                                <span>{user?.email}</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="capitalize">{supplier?.role?.replace('_', ' ') || 'Supplier'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => alert("Profile editing page coming soon.")}
                            className="flex items-center px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors"
                        >
                            <FaEdit className="mr-2" />
                            {content.edit || 'Edit Profile'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <FaSignOutAlt className="mr-2" />
                            {content.logout}
                        </button>
                    </div>
                </div>
            </div>

            {/* Subscription Management */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-foreground flex items-center">
                        <FaCreditCard className="mr-2 text-primary" />
                        Subscription & Plan
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Current Plan Info */}
                    <div className="col-span-1 md:col-span-2 bg-muted/50 rounded-xl p-4 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
                        <div className="flex items-center gap-3">
                            <p className="text-xl font-bold text-foreground">
                                {supplier?.subscription_status === 'active' ? 'Pro Plan' : 'Inactive / Paused'}
                            </p>
                            {supplier?.subscription_status === 'active' && (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">Active</span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {supplier?.total_slots || 0} Slots Included
                        </p>
                    </div>

                    {/* Actions - COMBINED BUTTONS */}
                    <button
                        onClick={() => setIsSlotsModalOpen(true)}
                        className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm col-span-1"
                    >
                        <FaEdit className="mr-2" />
                        Modify Plan / Slots
                    </button>

                    {supplier?.subscription_status === 'active' ? (
                        <button
                            onClick={() => setIsPauseModalOpen(true)}
                            className="flex items-center justify-center px-4 py-3 bg-yellow-500/10 text-yellow-600 rounded-xl hover:bg-yellow-500/20 transition-colors font-medium text-sm border border-yellow-500/20"
                        >
                            <FaPause className="mr-2" />
                            Pause
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsResumeModalOpen(true)}
                            className="flex items-center justify-center px-4 py-3 bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-500/20 transition-colors font-medium text-sm border border-emerald-500/20"
                        >
                            <FaPlay className="mr-2" />
                            Resume
                        </button>
                    )}
                    <button
                        onClick={() => setIsCancelModalOpen(true)}
                        className="flex items-center justify-center px-4 py-3 bg-red-500/10 text-red-600 rounded-xl hover:bg-red-500/20 transition-colors font-medium text-sm border border-red-500/20"
                    >
                        <FaTimes className="mr-2" />
                        Cancel
                    </button>
                </div>
            </div>

            {/* Modals */}
            <ChangeSlotsModal
                isOpen={isSlotsModalOpen}
                onClose={() => setIsSlotsModalOpen(false)}
                currentSlots={supplier?.total_slots || 1}
                onUpdate={(newSlots) => manageSubscription('update_slots', { newSlotCount: newSlots })}
            />

            <PauseModal
                isOpen={isPauseModalOpen}
                onClose={() => setIsPauseModalOpen(false)}
                onPause={() => manageSubscription('pause')}
            />

            <ResumeModal
                isOpen={isResumeModalOpen}
                onClose={() => setIsResumeModalOpen(false)}
                onResume={() => manageSubscription('resume')}
            />

            <CancelSubscriptionModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={() => openStripePortal()}
            />
        </div>
    )
}
