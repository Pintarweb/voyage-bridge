'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { FaTimes } from 'react-icons/fa'

type BookingModalProps = {
    isOpen: boolean
    onClose: () => void
    product: {
        id: string
        title: string
        agent_price: number
    }
}

export default function BookingModal({ isOpen, onClose, product }: BookingModalProps) {
    const [clientName, setClientName] = useState('')
    const [numTravelers, setNumTravelers] = useState(1)
    const [travelDate, setTravelDate] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    if (!isOpen) return null

    const totalAgentPrice = product.agent_price * numTravelers

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                alert('You must be logged in to book.')
                return
            }

            const { error } = await supabase
                .from('bookings')
                .insert({
                    product_id: product.id,
                    agent_id: user.id,
                    client_name: clientName,
                    num_travelers: numTravelers,
                    travel_start_date: travelDate,
                    total_agent_price: totalAgentPrice,
                    inquiry_status: 'pending'
                })

            if (error) throw error

            // Trigger Webhook (Placeholder)
            try {
                await fetch('https://n8n.example.com/webhook/new-booking', {
                    method: 'POST',
                    body: JSON.stringify({
                        product: product.title,
                        agent_id: user.id,
                        client_name: clientName,
                        date: travelDate
                    })
                })
            } catch (e) {
                console.error('Webhook failed', e)
            }

            alert('Booking inquiry sent successfully!')
            onClose()
        } catch (error: any) {
            console.error('Booking error:', error)
            alert('Failed to submit booking: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900/50">
                    <h3 className="text-lg font-semibold text-white">Request Booking</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <p className="text-sm text-teal-400 font-medium mb-1">{product.title}</p>
                        <p className="text-xs text-gray-400">Agent Price: ${product.agent_price} / person</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Client Name</label>
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            required
                            className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">Travelers</label>
                            <input
                                type="number"
                                min="1"
                                value={numTravelers}
                                onChange={(e) => setNumTravelers(parseInt(e.target.value))}
                                required
                                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={travelDate}
                                onChange={(e) => setTravelDate(e.target.value)}
                                required
                                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 flex justify-between items-center">
                        <span className="text-sm text-gray-300">Total Agent Price:</span>
                        <span className="text-lg font-bold text-teal-400">${totalAgentPrice.toLocaleString()}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting...' : 'Submit Inquiry'}
                    </button>
                </form>
            </div>
        </div>
    )
}
