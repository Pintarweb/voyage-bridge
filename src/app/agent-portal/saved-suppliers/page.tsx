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
        <div className="flex flex-col lg:flex-row min-h-screen pt-16 bg-transparent">
            <PortalSidebar />

            <main className="flex-1 lg:ml-20 xl:ml-64 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-black text-white mb-8 tracking-tight flex items-center gap-3">
                        <span className="text-amber-500">Saved</span> Suppliers
                    </h1>

                    {(!savedItems || savedItems.length === 0) ? (
                        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5">
                            <h3 className="text-xl text-white font-bold mb-2">No Saved Suppliers Yet</h3>
                            <p className="text-slate-200 shadow-black/50 drop-shadow-sm">Explore products and click the heart icon or view profiles to save them here.</p>
                            <Link href="/agent-portal" className="inline-block mt-6 px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-full hover:bg-amber-400 transition-colors">
                                Browse Marketplace
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedItems.map((item: any) => {
                                const supplier = item.supplier
                                return (
                                    <div key={item.id} className="relative group bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl">
                                        <div className="p-8">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
                                                    {supplier.logo_url ? (
                                                        <Image src={supplier.logo_url} alt={supplier.company_name} width={64} height={64} className="object-cover w-full h-full" />
                                                    ) : (
                                                        <FaBuilding className="text-2xl text-amber-500" />
                                                    )}
                                                </div>
                                                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/20">
                                                    {supplier.supplier_type}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-amber-400 transition-colors uppercase tracking-tight line-clamp-1">{supplier.company_name}</h3>

                                            <div className="space-y-3 mb-8">
                                                <p className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
                                                    <FaMapMarkerAlt className="text-amber-500/70" /> {supplier.city}, {supplier.country_code}
                                                </p>
                                                {supplier.contact_email && (
                                                    <p className="flex items-center gap-2 text-xs text-slate-400 truncate">
                                                        <FaEnvelope className="text-blue-400/50" /> {supplier.contact_email}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <Link
                                                    href={`/agent-portal/supplier/${supplier.id}`}
                                                    className="inline-flex items-center justify-center py-3 bg-white text-slate-950 text-[10px] font-black uppercase tracking-tight rounded-xl hover:bg-amber-400 transition-all duration-300 transform active:scale-95"
                                                >
                                                    View Profile
                                                </Link>
                                                <a
                                                    href={`mailto:${supplier.contact_email}`}
                                                    className="inline-flex items-center justify-center py-3 bg-white/5 text-white text-[10px] font-black uppercase tracking-tight rounded-xl hover:bg-white/10 border border-white/5 transition-all"
                                                >
                                                    Contact Hub
                                                </a>
                                            </div>
                                        </div>

                                        {/* Decorative shadow at bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
