'use client'

import React, { useState } from 'react'
import { FaRocket, FaSpinner, FaCheck, FaPaperPlane } from 'react-icons/fa'

interface RequestIntelFormProps {
    onSuccess: () => void
}

const RequestIntelForm: React.FC<RequestIntelFormProps> = ({ onSuccess }) => {
    const [requestForm, setRequestForm] = useState({
        destination: '',
        request_type: 'Hotel',
        budget: '',
        details: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/mission/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestForm)
            })
            if (res.ok) {
                setSubmitSuccess(true)
                setRequestForm({ destination: '', request_type: 'Hotel', budget: '', details: '' })
                onSuccess()
                setTimeout(() => setSubmitSuccess(false), 3000)
            }
        } catch (error) {
            console.error('Failed to submit request', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <FaRocket className="text-amber-500" /> Request Intel
                </h2>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full border border-amber-500/20">
                    Sourcing Service
                </span>
            </div>

            <p className="text-slate-200 mb-8 text-sm leading-relaxed">
                Can't find what you need? Tell us the destination and category. Our contracting team will hunt it down for you.
            </p>

            <form onSubmit={handleRequestSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase">Target Destination</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Bali, Ubud"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                            value={requestForm.destination}
                            onChange={e => setRequestForm({ ...requestForm, destination: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase">Category</label>
                        <select
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors appearance-none"
                            value={requestForm.request_type}
                            onChange={e => setRequestForm({ ...requestForm, request_type: e.target.value })}
                        >
                            <option>Hotel</option>
                            <option>Transport</option>
                            <option>Experience</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase">Client Budget / Specs</label>
                    <input
                        type="text"
                        placeholder="e.g. $500/night, 5 Star, Private Pool"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                        value={requestForm.budget}
                        onChange={e => setRequestForm({ ...requestForm, budget: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase">Mission Details</label>
                    <textarea
                        rows={3}
                        placeholder="Any specific requirements..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                        value={requestForm.details}
                        onChange={e => setRequestForm({ ...requestForm, details: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || submitSuccess}
                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${submitSuccess ? 'bg-green-500 text-white' : 'bg-white text-slate-900 hover:bg-amber-400'}`}
                >
                    {isSubmitting ? (
                        <FaSpinner className="animate-spin mx-auto" />
                    ) : submitSuccess ? (
                        <span className="flex items-center justify-center gap-2">
                            <FaCheck /> Request Transmitted
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <FaPaperPlane /> Initiate Request
                        </span>
                    )}
                </button>
            </form>
        </section>
    )
}

export default RequestIntelForm
