import { createClient } from '@/utils/supabase/server'
import PortalSidebar from '@/components/portal/PortalSidebar'
import Image from 'next/image'
import Link from 'next/link'
import { FaBuilding, FaMapMarkerAlt, FaEnvelope, FaGlobe } from 'react-icons/fa'

export default async function SavedSuppliersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: savedItems } = await supabase
        .from('saved_suppliers')
        .select(`
            *,
            supplier:suppliers (
                id,
                company_name,
                contact_email,
                website_url,
                logo_url,
                city,
                country_code,
                supplier_type,
                description
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="flex flex-col lg:flex-row min-h-screen pt-16 bg-slate-950">
            <PortalSidebar />

            <main className="flex-1 lg:ml-20 xl:ml-64 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-black text-white mb-8 tracking-tight flex items-center gap-3">
                        <span className="text-amber-500">Saved</span> Suppliers
                    </h1>

                    {(!savedItems || savedItems.length === 0) ? (
                        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5">
                            <h3 className="text-xl text-slate-400 font-bold mb-2">No Saved Suppliers Yet</h3>
                            <p className="text-slate-500">Explore products and click the heart icon or view profiles to save them here.</p>
                            <Link href="/agent-portal" className="inline-block mt-6 px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-full hover:bg-amber-400 transition-colors">
                                Browse Marketplace
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedItems.map((item: any) => {
                                const supplier = item.supplier
                                return (
                                    <div key={item.id} className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300">
                                        <div className="p-6 relative">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 overflow-hidden">
                                                    {supplier.logo_url ? (
                                                        <Image src={supplier.logo_url} alt={supplier.company_name} width={64} height={64} className="object-cover w-full h-full" />
                                                    ) : (
                                                        <FaBuilding className="text-2xl text-slate-600" />
                                                    )}
                                                </div>
                                                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-500/20">
                                                    {supplier.supplier_type}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{supplier.company_name}</h3>

                                            <div className="space-y-2 mb-6">
                                                <p className="flex items-center gap-2 text-sm text-slate-400">
                                                    <FaMapMarkerAlt className="text-amber-500" /> {supplier.city}, {supplier.country_code}
                                                </p>
                                                {supplier.contact_email && (
                                                    <p className="flex items-center gap-2 text-sm text-slate-400">
                                                        <FaEnvelope className="text-slate-600" /> {supplier.contact_email}
                                                    </p>
                                                )}
                                                {supplier.website_url && (
                                                    <p className="flex items-center gap-2 text-sm text-slate-400">
                                                        <FaGlobe className="text-slate-600" />
                                                        <a href={supplier.website_url} target="_blank" className="hover:text-amber-400 hover:underline cursor-pointer">Visit Website</a>
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex gap-3 mt-auto">
                                                <a href={`mailto:${supplier.contact_email}`} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold text-center rounded-xl transition-colors border border-white/5">
                                                    Email
                                                </a>
                                                {/* Could add a 'View Products' button linking to a filter view eventually */}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
