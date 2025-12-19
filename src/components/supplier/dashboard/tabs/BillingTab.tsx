'use client'

import React, { useState } from 'react'
import { FaCreditCard, FaEdit, FaTimes, FaPause, FaPlay, FaHistory, FaFileInvoiceDollar } from 'react-icons/fa'
import { ChangeSlotsModal, CancelSubscriptionModal } from '../SubscriptionModals'

export default function BillingTab({ supplier, user }) {
    const [isSlotsModalOpen, setIsSlotsModalOpen] = useState(false)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

    // Reuse manageSubscription logic from page.tsx props or reimplement?
    // Better to reimplement locally or pass as prop. Let's reimplement for self-containment or pass.
    // Passing is cleaner but prop drilling. Reimplementing is cleaner for component isolation.
    const manageSubscription = async (action: 'update_slots' | 'pause' | 'resume', payload: any = {}) => {
        try {
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
            window.location.reload()
        } catch (e) {
            console.error(e)
            alert('Failed to update subscription')
        }
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

    const baseFee = 30
    const slotFee = 20
    const additionalSlots = Math.max(0, (supplier?.total_slots || 1) - 1)
    const monthlyTotal = baseFee + (additionalSlots * slotFee)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Current Plan Card */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <FaCreditCard size={100} />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaCreditCard className="text-amber-400" /> Your Subscription
                    </h2>

                    <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <span className="text-white/60">Plan</span>
                            <span className="font-bold text-white text-lg">Founding Member</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <span className="text-white/60">Status</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${supplier?.subscription_status === 'active' ? 'bg-green-500/20 text-green-400' :
                                supplier?.subscription_status === 'trialing' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                {supplier?.subscription_status || 'Inactive'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <span className="text-white/60">Product Slots</span>
                            <span className="font-bold text-white text-lg">{supplier?.total_slots || 1}</span>
                        </div>

                        {/* Trial Info */}
                        {supplier?.trial_end && new Date(supplier.trial_end) > new Date() && (
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-white/60">Trial Ends</span>
                                <div className="text-right">
                                    <div className="font-bold text-white text-lg">
                                        {new Date(supplier.trial_end).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-amber-400 font-bold">
                                        {Math.ceil((new Date(supplier.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} Days Remaining
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Next Billing */}
                        {supplier?.current_period_end && (
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-white/60">Next Billing</span>
                                <span className="font-bold text-white text-lg">
                                    {new Date(supplier.current_period_end).toLocaleDateString()}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <span className="text-white/60">Monthly Total</span>
                            <span className="font-bold text-amber-400 text-2xl">${monthlyTotal}/mo</span>
                        </div>
                    </div>
                </div>

                {/* Actions Query */}
                <div className="space-y-6">
                    <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-2">Need more slots?</h3>
                        <p className="text-sm text-white/60 mb-4">Add more product slots to your plan instantly.</p>
                        <button onClick={() => setIsSlotsModalOpen(true)} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-colors flex items-center justify-center gap-2">
                            <FaEdit /> Modify Slots
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-2">Billing Portal</h3>
                        <p className="text-sm text-white/60 mb-4">Download invoices and update payment methods.</p>
                        <button onClick={openStripePortal} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-white transition-colors flex items-center justify-center gap-2">
                            <FaFileInvoiceDollar /> Manage Billing on Stripe
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2"><FaTimes /> Danger Zone</h3>
                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex justify-between items-center">
                    <div>
                        <div className="text-white font-bold mb-1">Cancel Subscription</div>
                        <div className="text-sm text-white/40">This will deactivate your products immediately.</div>
                    </div>
                    <button onClick={() => setIsCancelModalOpen(true)} className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold transition-colors">
                        Cancel Plan
                    </button>
                </div>
            </div>

            <ChangeSlotsModal
                isOpen={isSlotsModalOpen}
                onClose={() => setIsSlotsModalOpen(false)}
                currentSlots={supplier?.total_slots || 1}
                onUpdate={(newSlots) => manageSubscription('update_slots', { newSlotCount: newSlots })}
            />
            <CancelSubscriptionModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={openStripePortal}
            />
        </div>
    )
}
