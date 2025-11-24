'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useWizard } from './WizardContext'
import { FaFacebook, FaInstagram, FaTiktok, FaLinkedin, FaTripadvisor, FaWhatsapp } from 'react-icons/fa'

export default function Step4Review() {
    const { formData, setStep } = useWizard()
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)

        try {
            // 1. Sign Up User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        company_name: formData.company_name,
                        country_code: formData.country_code,
                        base_currency: formData.base_currency,
                    },
                },
            })

            if (authError) throw authError
            if (!authData.user) throw new Error('Registration failed')

            // 2. Insert Full Profile Data
            const { error: dbError } = await supabase
                .from('suppliers')
                .upsert({
                    id: authData.user.id,
                    company_name: formData.company_name,
                    trading_name: formData.trading_name,
                    country_code: formData.country_code,
                    address_line_1: formData.address_line_1,
                    city: formData.city,
                    postcode: formData.postcode,
                    timezone: formData.timezone,
                    base_currency: formData.base_currency,

                    company_reg_no: formData.company_reg_no,
                    license_no: formData.license_no,
                    tax_id: formData.tax_id,
                    contact_email: formData.contact_email,
                    phone_number: formData.phone_number,

                    supplier_type: formData.supplier_type,
                    description: formData.description,
                    website_url: formData.website_url,

                    // New Social Fields
                    social_instagram: formData.social_instagram,
                    social_facebook: formData.social_facebook,
                    social_tiktok: formData.social_tiktok,
                    social_linkedin: formData.social_linkedin,
                    social_tripadvisor: formData.social_tripadvisor,
                    whatsapp_business_url: formData.whatsapp_business_url,

                    languages_spoken: formData.languages_spoken,
                    logo_url: formData.logo_url,
                    cover_image_url: formData.cover_image_url,

                    subscription_status: 'pending_payment',
                })

            if (dbError) throw dbError

            // 3. Redirect to Payment
            router.push('/payment')

        } catch (err: any) {
            console.error('Registration error:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Review & Submit</h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-6 text-sm text-gray-300">
                {/* Identity Section */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-teal-400">Identity & Location</h3>
                        <button onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-white">Edit</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <p><span className="text-gray-500">Company:</span> {formData.company_name}</p>
                        <p><span className="text-gray-500">Country:</span> {formData.country_code}</p>
                        <p><span className="text-gray-500">Email:</span> {formData.email}</p>
                        <p><span className="text-gray-500">Currency:</span> {formData.base_currency}</p>
                    </div>
                </div>

                {/* Legal Section */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-teal-400">Legal & Verification</h3>
                        <button onClick={() => setStep(2)} className="text-xs text-gray-400 hover:text-white">Edit</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <p><span className="text-gray-500">Reg No:</span> {formData.company_reg_no}</p>
                        <p><span className="text-gray-500">Official Email:</span> {formData.contact_email}</p>
                        <p><span className="text-gray-500">Phone:</span> {formData.phone_number}</p>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-teal-400">Business Profile</h3>
                        <button onClick={() => setStep(3)} className="text-xs text-gray-400 hover:text-white">Edit</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <p><span className="text-gray-500">Type:</span> {formData.supplier_type}</p>
                        <p><span className="text-gray-500">Website:</span> {formData.website_url}</p>
                    </div>

                    {/* Social Icons Display */}
                    <div className="flex space-x-3 mt-2">
                        {formData.social_facebook && <FaFacebook className="text-blue-500" title="Facebook" />}
                        {formData.social_instagram && <FaInstagram className="text-pink-500" title="Instagram" />}
                        {formData.social_tiktok && <FaTiktok className="text-white" title="TikTok" />}
                        {formData.social_linkedin && <FaLinkedin className="text-blue-400" title="LinkedIn" />}
                        {formData.social_tripadvisor && <FaTripadvisor className="text-green-500" title="TripAdvisor" />}
                        {formData.whatsapp_business_url && <FaWhatsapp className="text-green-400" title="WhatsApp" />}
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="rounded-md border border-gray-600 px-6 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none"
                >
                    Previous
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="rounded-md bg-teal-600 px-8 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Submit & Pay'}
                </button>
            </div>
        </div>
    )
}
