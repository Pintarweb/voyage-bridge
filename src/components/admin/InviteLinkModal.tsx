'use client'

import { useState } from 'react'

interface InviteLinkModalProps {
    isOpen: boolean
    onClose: () => void
    inviteLink: string
    agentEmail: string
}

export default function InviteLinkModal({ isOpen, onClose, inviteLink, agentEmail }: InviteLinkModalProps) {
    const [copied, setCopied] = useState(false)

    if (!isOpen) return null

    const handleCopy = async () => {
        await navigator.clipboard.writeText(inviteLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Agent Approved! 🎉</h2>
                        <p className="text-sm text-gray-600 mt-1">Send this invite link to: <span className="font-semibold">{agentEmail}</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800 font-medium mb-2">
                        ⚠️ Important: Email Integration Not Yet Configured
                    </p>
                    <p className="text-xs text-yellow-700">
                        Please copy this link and send it to the agent manually via email or your preferred communication method.
                    </p>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Invite Link (valid for 24 hours):
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inviteLink}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                            onClick={handleCopy}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${copied
                                    ? 'bg-green-600 text-white'
                                    : 'bg-teal-600 text-white hover:bg-teal-700'
                                }`}
                        >
                            {copied ? '✓ Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
