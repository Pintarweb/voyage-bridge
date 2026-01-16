'use client'

import React from 'react'
import Image from 'next/image'
import { FaTimes, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaGlobe } from 'react-icons/fa'

interface Supplier {
    id: string
    company_name: string
    contact_email: string
    website_url?: string
    description?: string
    phone_number?: string
    city?: string
    country_code?: string
    logo_url?: string
}

interface SupplierContactModalProps {
    isOpen: boolean
    onClose: () => void
    supplier: Supplier
}

const SupplierContactModal: React.FC<SupplierContactModalProps> = ({ isOpen, onClose, supplier }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-slate-900 border border-white/10 rounded-2xl p-0 max-w-2xl w-full shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
                onClick={e => e.stopPropagation()}
            >
                {/* Supplier Side Panel */}
                <div className="bg-slate-950 p-8 md:w-1/3 border-r border-white/5 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-slate-800 mb-6 flex items-center justify-center text-3xl font-bold text-amber-500 border-2 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.2)] overflow-hidden relative">
                        {supplier.logo_url ? (
                            <Image
                                src={supplier.logo_url}
                                alt={supplier.company_name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            supplier.company_name?.[0]
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">{supplier.company_name}</h2>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mb-6">
                        <FaMapMarkerAlt /> {supplier.city || 'Global'}, {supplier.country_code || 'Supplier'}
                    </div>

                    <div className="flex gap-2 w-full justify-center">
                        <button className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors"><FaFacebook size={14} /></button>
                        <button className="p-2 bg-slate-800 rounded-full hover:bg-pink-600 transition-colors"><FaInstagram size={14} /></button>
                        <button className="p-2 bg-slate-800 rounded-full hover:bg-blue-500 transition-colors"><FaLinkedin size={14} /></button>
                    </div>
                </div>

                {/* Details Content */}
                <div className="p-8 md:w-2/3 bg-slate-900">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                    >
                        <FaTimes />
                    </button>

                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Contact & Details</h3>

                    {supplier.description && (
                        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                            {supplier.description}
                        </p>
                    )}

                    <div className="space-y-3">
                        <a
                            href={`mailto:${supplier.contact_email}`}
                            className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 hover:border-amber-500/50 border border-transparent transition-all group"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <FaEnvelope size={12} />
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Email</p>
                                <p className="text-white text-sm font-medium truncate">{supplier.contact_email}</p>
                            </div>
                        </a>

                        {supplier.phone_number && (
                            <a
                                href={`tel:${supplier.phone_number}`}
                                className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 hover:border-green-500/50 border border-transparent transition-all group"
                            >
                                <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                                    <FaPhone size={12} />
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Phone</p>
                                    <p className="text-white text-sm font-medium truncate">{supplier.phone_number}</p>
                                </div>
                            </a>
                        )}

                        {supplier.website_url && (
                            <a
                                href={supplier.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 hover:border-purple-500/50 border border-transparent transition-all group"
                            >
                                <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                    <FaGlobe size={12} />
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Website</p>
                                    <p className="text-white text-sm font-medium truncate">{supplier.website_url}</p>
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SupplierContactModal
