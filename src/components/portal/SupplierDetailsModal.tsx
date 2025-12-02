'use client'

import { FaExternalLinkAlt, FaTimes, FaBuilding, FaEnvelope, FaGlobe } from 'react-icons/fa'

type Supplier = {
    id: string
    company_name: string
    description: string | null
    website_url: string | null
    contact_email: string | null
}

type SupplierDetailsModalProps = {
    supplier: Supplier
    isOpen: boolean
    onClose: () => void
}

export default function SupplierDetailsModal({ supplier, isOpen, onClose }: SupplierDetailsModalProps) {
    if (!isOpen) return null

    const handleVisitWebsite = () => {
        if (supplier.website_url) {
            window.open(supplier.website_url, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-600 text-white p-6 rounded-t-2xl flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <FaBuilding className="text-2xl" />
                        <div>
                            <h2 className="text-2xl font-bold">{supplier.company_name}</h2>
                            <p className="text-blue-100 text-sm">Supplier Information</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Description */}
                    {supplier.description && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">About</h3>
                            <p className="text-slate-600 leading-relaxed">{supplier.description}</p>
                        </div>
                    )}

                    {/* Contact Information */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>

                        {supplier.contact_email && (
                            <div className="flex items-center gap-3 text-slate-600">
                                <FaEnvelope className="text-blue-600" />
                                <a
                                    href={`mailto:${supplier.contact_email}`}
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    {supplier.contact_email}
                                </a>
                            </div>
                        )}

                        {supplier.website_url && (
                            <div className="flex items-center gap-3 text-slate-600">
                                <FaGlobe className="text-blue-600" />
                                <span className="truncate">{supplier.website_url}</span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        {supplier.website_url ? (
                            <button
                                onClick={handleVisitWebsite}
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <FaExternalLinkAlt />
                                Visit Website
                            </button>
                        ) : (
                            <div className="flex-1 py-3 px-6 bg-slate-100 text-slate-400 font-semibold rounded-lg text-center">
                                Website not available
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
