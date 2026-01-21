'use client'

import React, { useState } from 'react'
import { FaSave, FaArrowLeft, FaGlobe, FaPhone, FaMapMarkerAlt, FaInfoCircle, FaInstagram, FaFacebook, FaLinkedin, FaTripadvisor, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import ProfileConfirmationModal from './ProfileConfirmationModal'
import { updateSupplierProfile } from '@/app/actions/update-supplier'
import SupplierSidebar from '@/components/supplier/dashboard/SupplierSidebar'

// Language options based on constants.ts
const LANGUAGES = [
    'English', 'Mandarin', 'Malay', 'Tamil', 'Japanese', 'Korean', 'Arabic', 'French', 'Spanish', 'German'
]

interface EditProfileFormProps {
    supplier: any // Ideally typed with Supplier interface
    userEmail?: string
}

export default function EditProfileForm({ supplier, userEmail }: EditProfileFormProps) {
    const router = useRouter()

    // Initial State derived from supplier prop
    const [formData, setFormData] = useState({
        // Read-only / disabled
        contact_email: supplier?.contact_email || userEmail || '',
        company_name: supplier?.company_name || '',
        company_reg_no: supplier?.company_reg_no || '',
        license_no: supplier?.license_no || '',
        tax_id: supplier?.tax_id || '',
        supplier_type: supplier?.supplier_type || '',

        // Editable
        phone_number: supplier?.phone_number || '',
        address_line_1: supplier?.address_line_1 || '',
        city: supplier?.city || '',
        postcode: supplier?.postcode || '',
        website_url: supplier?.website_url || '',
        whatsapp_business_url: supplier?.whatsapp_business_url || '',
        description: supplier?.description || '',
        languages_spoken: supplier?.languages_spoken || [], // Array

        // Socials
        social_instagram: supplier?.social_instagram || '',
        social_facebook: supplier?.social_facebook || '',
        social_tiktok: supplier?.social_tiktok || '',
        social_linkedin: supplier?.social_linkedin || '',
        social_tripadvisor: supplier?.social_tripadvisor || '',
    })

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Handle text inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Handle languages checkbox
    const handleLanguageToggle = (lang: string) => {
        setFormData(prev => {
            const current = prev.languages_spoken || []
            if (current.includes(lang)) {
                return { ...prev, languages_spoken: current.filter((l: string) => l !== lang) }
            } else {
                return { ...prev, languages_spoken: [...current, lang] }
            }
        })
    }

    const handleSubmit = async () => {
        setIsSaving(true)
        try {
            const result = await updateSupplierProfile(formData)
            if (result.error) {
                alert(result.error)
            } else {
                // Success
                router.push('/supplier/dashboard')
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            alert('An unexpected error occurred.')
        } finally {
            setIsSaving(false)
            setIsModalOpen(false)
        }
    }

    const handleSidebarNavigation = (tab: string) => {
        router.push('/supplier/dashboard')
    }

    return (
        <div className="min-h-screen relative flex font-sans text-white bg-slate-950 overflow-hidden">
            {/* Background Atmosphere (Borrowed from Dashboard for Consistency) */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-slate-950/40 z-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-slate-950/90 z-20" />
                <div className="absolute top-0 right-[-10%] w-[60%] h-[60%] bg-amber-600/10 blur-[150px] z-20 pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] z-20 pointer-events-none" />

                <img
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                    alt="Global Business Travel"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>

            {/* Sidebar Navigation */}
            <SupplierSidebar activeTab="account" setActiveTab={handleSidebarNavigation} />

            {/* Main Content Area */}
            <div className="relative z-20 flex-1 ml-0 lg:ml-20 xl:ml-64 transition-all duration-300">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen flex flex-col">

                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors group mb-4"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium tracking-wide">Back to Dashboard</span>
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400 drop-shadow-md mb-2">My Profile</h1>
                            <p className="text-slate-400">Manage your business identity and contact information.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Core Identity (Read-Only) */}
                        <div className="space-y-6">
                            <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                                    <FaInfoCircle className="mr-3 text-amber-500" />
                                    Core Identity
                                </h3>
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-xs font-bold text-amber-500/80 uppercase tracking-widest block mb-2">Legal Name</label>
                                        <input
                                            type="text"
                                            value={formData.company_name}
                                            disabled
                                            className="glass-input-locked w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-amber-500/80 uppercase tracking-widest block mb-2">Registration No.</label>
                                        <input
                                            type="text"
                                            value={formData.company_reg_no}
                                            disabled
                                            className="glass-input-locked w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-amber-500/80 uppercase tracking-widest block mb-2">License No.</label>
                                        <input
                                            type="text"
                                            value={formData.license_no}
                                            disabled
                                            className="glass-input-locked w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-amber-500/80 uppercase tracking-widest block mb-2">Tax ID</label>
                                        <input
                                            type="text"
                                            value={formData.tax_id}
                                            disabled
                                            className="glass-input-locked w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-amber-500/80 uppercase tracking-widest block mb-2">Contact Email</label>
                                        <input
                                            type="text"
                                            value={formData.contact_email}
                                            disabled
                                            className="glass-input-locked w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-amber-500/80 uppercase tracking-widest block mb-2">Supplier Type</label>
                                        <div className="mt-1 inline-flex px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wide">
                                            {formData.supplier_type || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-6 italic bg-white/5 p-3 rounded-lg border border-white/5">
                                    * These fields are verified and cannot be edited. Please contact support if changes are required.
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Editable Fields */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Contact & Location */}
                            <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                                    <FaMapMarkerAlt className="mr-3 text-amber-500" />
                                    Contact & Location
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
                                        <input
                                            name="address_line_1"
                                            value={formData.address_line_1}
                                            onChange={handleChange}
                                            className="glass-input w-full"
                                            placeholder="Street address"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="glass-input w-full"
                                            placeholder="City"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Postcode</label>
                                        <input
                                            name="postcode"
                                            value={formData.postcode}
                                            onChange={handleChange}
                                            className="glass-input w-full"
                                            placeholder="Postal Code"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-sm z-10" />
                                            <input
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                                className="glass-input w-full !pl-14"
                                                placeholder="+1 234 567 890"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">WhatsApp Business</label>
                                        <div className="relative">
                                            <FaWhatsapp className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 text-lg z-10" />
                                            <input
                                                name="whatsapp_business_url"
                                                value={formData.whatsapp_business_url}
                                                onChange={handleChange}
                                                className="glass-input w-full !pl-14"
                                                placeholder="wa.me/..."
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Website URL</label>
                                        <div className="relative">
                                            <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 text-sm z-10" />
                                            <input
                                                name="website_url"
                                                value={formData.website_url}
                                                onChange={handleChange}
                                                className="glass-input w-full !pl-14"
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About & Languages */}
                            <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
                                <h3 className="text-lg font-bold text-white mb-6">About Business</h3>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            className="glass-input w-full resize-none"
                                            placeholder="Tell potential partners about your business..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-3">Languages Spoken</label>
                                        <div className="flex flex-wrap gap-2">
                                            {LANGUAGES.map(lang => (
                                                <button
                                                    key={lang}
                                                    type="button"
                                                    onClick={() => handleLanguageToggle(lang)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${formData.languages_spoken.includes(lang)
                                                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
                                <h3 className="text-lg font-bold text-white mb-6">Social Media</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {[
                                        { name: 'social_instagram', icon: FaInstagram, label: 'Instagram', color: 'text-pink-500' },
                                        { name: 'social_facebook', icon: FaFacebook, label: 'Facebook', color: 'text-blue-600' },
                                        { name: 'social_tiktok', icon: FaTiktok, label: 'TikTok', color: 'text-pink-400' },
                                        { name: 'social_linkedin', icon: FaLinkedin, label: 'LinkedIn', color: 'text-blue-500' },
                                        { name: 'social_tripadvisor', icon: FaTripadvisor, label: 'TripAdvisor', color: 'text-green-500' },
                                    ].map((social) => (
                                        <div key={social.name} className="group">
                                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-hover:text-slate-300 transition-colors">{social.label}</label>
                                            <div className="relative">
                                                <social.icon className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors z-10 ${social.color}`} />
                                                <input
                                                    name={social.name}
                                                    value={(formData as any)[social.name]}
                                                    onChange={handleChange}
                                                    className="glass-input w-full !pl-14 group-hover:border-white/20"
                                                    placeholder={`${social.label} URL or Handle`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:to-amber-500 text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all flex items-center transform hover:-translate-y-0.5"
                                >
                                    <FaSave className="mr-2" />
                                    Save Changes
                                </button>
                            </div>

                        </div>
                    </div>

                    <style jsx global>{`
                        .glass-input {
                            background-color: rgba(15, 23, 42, 0.6) !important;
                            border: 1px solid rgba(255, 255, 255, 0.1) !important;
                            color: white !important;
                            padding: 0.75rem 1rem;
                            border-radius: 0.75rem;
                            transition: all 0.3s ease;
                        }
                        .glass-input:focus {
                            outline: none;
                            border-color: rgba(245, 158, 11, 0.5) !important;
                            box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.5);
                            background-color: rgba(15, 23, 42, 0.8) !important;
                        }
                        .glass-input::placeholder {
                            color: rgba(148, 163, 184, 0.5);
                        }
                        .glass-input-locked {
                            background-color: rgba(255, 255, 255, 0.03) !important;
                            border: 1px solid rgba(255, 255, 255, 0.05) !important;
                            color: rgba(255, 255, 255, 0.5) !important;
                            padding: 0.75rem 1rem;
                            border-radius: 0.75rem;
                            cursor: not-allowed;
                        }
                    `}</style>
                </div>
            </div>

            <ProfileConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleSubmit}
                originalData={supplier}
                newData={formData}
                isSaving={isSaving}
            />
        </div>
    )
}
