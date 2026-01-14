'use client'
// Force recompile: Agent Profile Page Updated with new fields 2026-01-14

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { FaUser, FaBuilding, FaMapMarkerAlt, FaSave, FaCheck, FaExclamationTriangle, FaLock, FaGlobe } from 'react-icons/fa'
import PortalSidebar from '@/components/portal/PortalSidebar'
import toast from 'react-hot-toast'

export default function AgentProfilePage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>({
        first_name: '',
        last_name: '',
        agency_name: '',
        license_number: '',
        website_url: '',
        phone_number: '',
        address: '',
        city: '',
        country_code: '',
    })

    const supabase = createClient()

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                setUser(user)

                const { data, error } = await supabase
                    .from('agent_profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching profile:', error)
                    toast.error('Failed to load profile')
                }

                if (data) {
                    setProfile({
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        agency_name: data.agency_name || '',
                        license_number: data.license_number || '',
                        website_url: data.website_url || '',
                        phone_number: data.phone_number || '',
                        address: data.address || '',
                        city: data.city || '',
                        country_code: data.country_code || '',
                    })
                }
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProfile((prev: any) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const { error } = await supabase
                .from('agent_profiles')
                .update({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    agency_name: profile.agency_name,
                    license_number: profile.license_number,
                    website_url: profile.website_url,
                    phone_number: profile.phone_number,
                    address: profile.address,
                    city: profile.city,
                    country_code: profile.country_code,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id)

            if (error) throw error

            toast.success('Profile updated successfully')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const handlePasswordReset = async () => {
        if (!user?.email) return
        try {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
            const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${siteUrl}/auth/callback?next=/auth/reset-password`,
            })
            if (error) throw error
            toast.success('Password reset email sent')
        } catch (error) {
            console.error('Error sending reset email:', error)
            toast.error('Failed to send reset email')
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen pt-16 bg-slate-950 text-white">
                <PortalSidebar />
                <main className="flex-1 lg:ml-20 xl:ml-64 p-8 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen pt-16 bg-transparent text-white">
            <PortalSidebar />

            <main className="flex-1 lg:ml-20 xl:ml-64 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)]">
                <div className="max-w-4xl mx-auto space-y-8 pb-12">

                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Agent Settings</h1>
                        <p className="text-slate-400">Manage your agency profile, contact details, and account security.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* 1. Account Info (Read Only) */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <FaUser className="text-amber-500" /> Account Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold !text-white uppercase mb-2">Email Address</label>
                                    <div className="bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-slate-300 flex items-center justify-between">
                                        <span>{user?.email}</span>
                                        <FaLock className="text-slate-600" />
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-2">Email cannot be changed directly for security reasons.</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold !text-white uppercase mb-2">Account ID</label>
                                    <div className="bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-slate-500 font-mono text-xs truncate">
                                        {user?.id}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Personal & Agency Info */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <FaBuilding className="text-blue-500" /> Agency Profile
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold !text-white uppercase mb-2">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={profile.first_name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
                                        placeholder="Agent First Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold !text-white uppercase mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={profile.last_name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
                                        placeholder="Agent Last Name"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold !text-white uppercase mb-2">Agency Name</label>
                                    <input
                                        type="text"
                                        name="agency_name"
                                        value={profile.agency_name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
                                        placeholder="Global Travels Ltd."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold !text-white uppercase mb-2">IATA / License Number</label>
                                    <input
                                        type="text"
                                        name="license_number"
                                        value={profile.license_number}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
                                        placeholder="e.g. IATA-1234567"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold !text-white uppercase mb-2">Website</label>
                                    <div className="relative">
                                        <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            name="website_url"
                                            value={profile.website_url}
                                            onChange={handleChange}
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
                                            placeholder="https://www.example.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Location & Contact */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-emerald-500" /> Location & Contact
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Address field removed per user request */}
                                <div>
                                    <label className="block text-xs font-bold !text-white uppercase mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={profile.city}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-slate-600"
                                        placeholder="City"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold !text-white uppercase mb-2">Country Code (ISO)</label>
                                    <input
                                        type="text"
                                        name="country_code"
                                        value={profile.country_code}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-slate-600"
                                        placeholder="e.g. US, UK, MY, JP"
                                        maxLength={2}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold !text-white uppercase mb-2">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={profile.phone_number}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-slate-600"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={handlePasswordReset}
                                className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <FaLock /> Send Password Reset Email
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all transform hover:-translate-y-1 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>Saving...</>
                                ) : (
                                    <>
                                        <FaSave /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    )
}
