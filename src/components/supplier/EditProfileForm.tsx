'use client'

import React, { useState } from 'react'
import { FaSave, FaArrowLeft, FaGlobe, FaPhone, FaMapMarkerAlt, FaInfoCircle, FaInstagram, FaFacebook, FaLinkedin, FaTripadvisor, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import ProfileConfirmationModal from './ProfileConfirmationModal'
import { updateSupplierProfile } from '@/app/actions/update-supplier'

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

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                    <FaArrowLeft className="text-muted-foreground" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
                    <p className="text-sm text-muted-foreground">Update your business details and public information.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Core Identity (Read-Only) */}
                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                            <FaInfoCircle className="mr-2 text-primary" />
                            Core Identity
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Legal Name</label>
                                <input
                                    type="text"
                                    value={formData.company_name}
                                    disabled
                                    className="w-full mt-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registration No.</label>
                                <input
                                    type="text"
                                    value={formData.company_reg_no}
                                    disabled
                                    className="w-full mt-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">License No.</label>
                                <input
                                    type="text"
                                    value={formData.license_no}
                                    disabled
                                    className="w-full mt-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tax ID</label>
                                <input
                                    type="text"
                                    value={formData.tax_id}
                                    disabled
                                    className="w-full mt-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email (Login/Contact)</label>
                                <input
                                    type="text"
                                    value={formData.contact_email}
                                    disabled
                                    className="w-full mt-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Supplier Type</label>
                                <div className="mt-1 inline-flex px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold">
                                    {formData.supplier_type || 'N/A'}
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 italic">
                            * These fields cannot be edited directly. Please contact support if changes are required.
                        </p>
                    </div>
                </div>

                {/* Right Column: Editable Fields */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Contact & Location */}
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-primary" />
                            Contact & Location
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-foreground mb-1">Address</label>
                                <input
                                    name="address_line_1"
                                    value={formData.address_line_1}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="Street address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">City</label>
                                <input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="City"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Postcode</label>
                                <input
                                    name="postcode"
                                    value={formData.postcode}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="Postal Code"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-3 text-muted-foreground text-xs" />
                                    <input
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">WhatsApp Business</label>
                                <div className="relative">
                                    <FaWhatsapp className="absolute left-3 top-3 text-muted-foreground text-xs" />
                                    <input
                                        name="whatsapp_business_url"
                                        value={formData.whatsapp_business_url}
                                        onChange={handleChange}
                                        className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder="wa.me/..."
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-foreground mb-1">Website URL</label>
                                <div className="relative">
                                    <FaGlobe className="absolute left-3 top-3 text-muted-foreground text-xs" />
                                    <input
                                        name="website_url"
                                        value={formData.website_url}
                                        onChange={handleChange}
                                        className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About & Languages */}
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-lg font-bold text-foreground mb-4">About Business</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                                    placeholder="Tell potential partners about your business..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Languages Spoken</label>
                                <div className="flex flex-wrap gap-2">
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang}
                                            type="button"
                                            onClick={() => handleLanguageToggle(lang)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${formData.languages_spoken.includes(lang)
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-background text-muted-foreground border-border hover:border-primary/50'
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
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-lg font-bold text-foreground mb-4">Social Media</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'social_instagram', icon: FaInstagram, label: 'Instagram' },
                                { name: 'social_facebook', icon: FaFacebook, label: 'Facebook' },
                                { name: 'social_tiktok', icon: FaTiktok, label: 'TikTok' },
                                { name: 'social_linkedin', icon: FaLinkedin, label: 'LinkedIn' },
                                { name: 'social_tripadvisor', icon: FaTripadvisor, label: 'TripAdvisor' },
                            ].map((social) => (
                                <div key={social.name}>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">{social.label}</label>
                                    <div className="relative">
                                        <social.icon className="absolute left-3 top-3 text-muted-foreground text-xs" />
                                        <input
                                            name={social.name}
                                            value={(formData as any)[social.name]}
                                            onChange={handleChange}
                                            className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
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
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center"
                        >
                            <FaSave className="mr-2" />
                            Save Changes
                        </button>
                    </div>

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
