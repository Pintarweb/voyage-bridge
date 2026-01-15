'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { FaTimes, FaUser, FaBuilding, FaEnvelope, FaMapMarkerAlt, FaPhone, FaGlobe, FaBan, FaTrash, FaKey, FaFileInvoiceDollar, FaBoxOpen, FaExternalLinkAlt, FaIdCard, FaHistory, FaFingerprint, FaShieldAlt, FaCircle } from 'react-icons/fa'

interface UserManagementModalProps {
    isOpen: boolean
    onClose: () => void
    user: any
    type: 'Agent' | 'Supplier'
    onUpdateStatus: (userId: string, status: string) => Promise<void>
}

export default function UserManagementModal({ isOpen, onClose, user, type, onUpdateStatus }: UserManagementModalProps) {
    const [activeTab, setActiveTab] = useState<'details' | 'actions' | 'history' | 'products'>('details')
    const [isLoading, setIsLoading] = useState(false)
    const [products, setProducts] = useState<any[]>([])
    const [isLoadingProducts, setIsLoadingProducts] = useState(false)

    const [confirmation, setConfirmation] = useState<{ isOpen: boolean, action: string | null, title: string, description: string }>({
        isOpen: false,
        action: null,
        title: '',
        description: ''
    })
    const supabase = createClient()

    useEffect(() => {
        if (activeTab === 'products' && type === 'Supplier' && user?.id) {
            const fetchProducts = async () => {
                setIsLoadingProducts(true)
                const { data, error } = await supabase
                    .from('products')
                    .select('id, product_name, status, created_at, product_category, country_code')
                    .eq('supplier_id', user.id)
                    .order('created_at', { ascending: false })

                if (!error && data) {
                    setProducts(data)
                }
                setIsLoadingProducts(false)
            }
            fetchProducts()
        }
    }, [activeTab, type, user?.id])

    if (!isOpen || !user) return null

    const handleActionClick = (action: string) => {
        let title = ''
        let description = ''

        switch (action) {
            case 'reset_password':
                title = 'REAUTHORIZE SYSTEM ACCESS?'
                description = `Initialize secure password reset protocol for ${user.email}. This will invalidate current credentials and require new biometric-equivalent setup.`
                break
            case 'freeze':
                title = 'SUSPEND NODE ACTIVITY?'
                description = `Initiate temporary freeze on ${user.company_name || user.agency_name}. All mission logic will be paused until manual override.`
                break
            case 'deactivate':
                title = 'TERMINATE PROTOCOL?'
                description = `CRITICAL: Permanent deactivation of ${user.company_name || user.agency_name}. This operation is irreversible and will purge all active signals and pipeline data.`
                break
        }

        setConfirmation({ isOpen: true, action, title, description })
    }

    const executeAction = async () => {
        if (!confirmation.action) return

        setIsLoading(true)
        try {
            await onUpdateStatus(user.id, confirmation.action)
            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
            setConfirmation({ isOpen: false, action: null, title: '', description: '' })
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-[2rem] shadow-[0_32px_128px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-500">

                {/* Visual Accent Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] pointer-events-none" />

                {/* Header Section */}
                <div className="p-8 border-b border-white/5 relative bg-slate-950/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border border-white/5 shadow-2xl ${type === 'Agent' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                {type === 'Agent' ? <FaUser /> : <FaBuilding />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight uppercase mb-1">
                                    {user.company_name || user.agency_name || 'UNIDENTIFIED UNIT'}
                                </h2>
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${type === 'Agent' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                        <FaFingerprint className="text-[10px]" />
                                        {type} NODE
                                    </div>
                                    <FaCircle className="text-[4px] text-slate-700" />
                                    {(() => {
                                        let status = 'pending'
                                        let statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]'

                                        if (user.is_approved) {
                                            status = 'active'
                                            statusColor = 'text-green-400 bg-green-500/10 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                                        } else if (type === 'Agent') {
                                            if (user.verification_status === 'rejected') {
                                                status = 'rejected'
                                                statusColor = 'text-red-400 bg-red-500/10 border-red-500/20'
                                            }
                                        } else {
                                            if (user.subscription_status === 'canceled') {
                                                status = 'offline'
                                                statusColor = 'text-slate-500 bg-white/5 border-white/10'
                                            } else if (user.subscription_status === 'past_due') {
                                                status = 'frozen'
                                                statusColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                                            } else if (user.rejection_reason) {
                                                status = 'rejected'
                                                statusColor = 'text-red-400 bg-red-500/10 border-red-500/20'
                                            }
                                        }

                                        return (
                                            <div className={`
                                                inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest
                                                ${statusColor}
                                            `}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-current shadow-sm'}`} />
                                                {status}
                                            </div>
                                        )
                                    })()}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* Tactical Tab Navigation */}
                <div className="flex p-2 bg-slate-950/40 border-b border-white/5 backdrop-blur-xl">
                    {[
                        { id: 'details', label: 'Node Intel', icon: FaIdCard },
                        { id: 'history', label: 'Logistics', icon: FaHistory },
                        ...(type === 'Supplier' ? [{ id: 'products', label: 'Asset Bank', icon: FaBoxOpen }] : []),
                        { id: 'actions', label: 'Protocol Override', icon: FaShieldAlt }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                                flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                ${activeTab === tab.id
                                    ? 'bg-indigo-500 text-white shadow-[0_8px_32px_rgba(99,102,241,0.2)] scale-100'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                }
                            `}
                        >
                            <tab.icon className={activeTab === tab.id ? 'text-white' : 'text-slate-600'} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 overflow-y-auto no-scrollbar bg-slate-900/40">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === 'details' && (
                            <div className="space-y-8">
                                {/* Core Data Card */}
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Strategic Email', value: user.email || user.contact_email, icon: FaEnvelope },
                                        { label: 'Intelligence Sector', value: `${user.city ? `${user.city}, ` : ''}${user.country || user.country_code}`, icon: FaMapMarkerAlt },
                                        { label: 'Signal Link', value: user.phone_number || user.contact_phone || 'DISCONNECTED', icon: FaPhone },
                                        { label: 'Public Portal', value: user.website_url || 'N/A', icon: FaGlobe, isLink: true }
                                    ].map((field, i) => (
                                        <div key={i} className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 group hover:border-white/10 transition-all">
                                            <div className="flex items-center gap-3 mb-2">
                                                <field.icon className="text-indigo-400 text-xs" />
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{field.label}</span>
                                            </div>
                                            {field.isLink && field.value !== 'N/A' ? (
                                                <a href={field.value} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-white hover:text-indigo-400 flex items-center gap-2 truncate">
                                                    {field.value.replace(/^https?:\/\//, '').split('/')[0]}
                                                    <FaExternalLinkAlt className="text-[10px] opacity-40" />
                                                </a>
                                            ) : (
                                                <div className="text-sm font-bold text-white truncate">{field.value}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Registry Metadata */}
                                <div className="bg-slate-950/20 rounded-3xl border border-white/5 p-6 shadow-inner">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="w-1 h-3 bg-indigo-500 rounded-full" />
                                        Entity Metadata Registry
                                    </h4>
                                    <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                                        {type === 'Agent' ? (
                                            <>
                                                <div>
                                                    <div className="text-[10px] uppercase text-slate-600 font-bold tracking-widest mb-1">Protocol ID</div>
                                                    <div className="text-[13px] text-white font-black uppercase">{user.license_number || 'UNVERIFIED'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase text-slate-600 font-bold tracking-widest mb-1">Network Authority</div>
                                                    <div className="text-[13px] text-white font-black uppercase">{user.iata_number ? `IATA ${user.iata_number}` : (user.clia_number ? `CLIA ${user.clia_number}` : 'GENERAL NODE')}</div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <div className="text-[10px] uppercase text-slate-600 font-bold tracking-widest mb-1">Asset Category</div>
                                                    <div className="text-[13px] text-white font-black uppercase">{user.supplier_type || 'GENERAL PROVIDER'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase text-slate-600 font-bold tracking-widest mb-1">Tax Residency</div>
                                                    <div className="text-[13px] text-white font-black uppercase">{user.tax_id || user.company_reg_no || 'NOT DECLARED'}</div>
                                                </div>
                                            </>
                                        )}
                                        <div className="col-span-2 pt-4 mt-4 border-t border-white/5">
                                            <div className="text-[10px] uppercase text-slate-600 font-bold tracking-widest mb-2">Global UUID</div>
                                            <code className="text-indigo-400 font-mono text-[11px] block bg-white/5 p-3 rounded-xl border border-white/5 select-all">{user.id}</code>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'actions' && (
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Security & Node Management</h3>

                                {[
                                    { id: 'reset_password', label: 'Password Reset', desc: 'Secure protocol to refresh unit access', icon: FaKey, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                                    { id: 'freeze', label: 'Suspend Node', desc: 'Temporary halt of all platform permissions', icon: FaBan, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                                    { id: 'deactivate', label: 'Purge Registry', desc: 'Permanently remove node from global registry', icon: FaTrash, color: 'text-red-400', bg: 'bg-red-500/10' }
                                ].map((action) => (
                                    <button
                                        key={action.id}
                                        onClick={() => handleActionClick(action.id)}
                                        className="w-full flex items-center justify-between p-5 bg-slate-950/40 hover:bg-white/5 border border-white/5 rounded-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border border-white/5 group-hover:scale-110 transition-transform ${action.bg} ${action.color}`}>
                                                <action.icon />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-black text-white text-[13px] uppercase tracking-tight">{action.label}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{action.desc}</div>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-slate-600 group-hover:text-white transition-colors">
                                            <FaFingerprint />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="space-y-8">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Billing & Operational Logistics</h3>
                                {type === 'Supplier' && user.payment_status === 'completed' ? (
                                    <div className="bg-slate-950/40 border border-white/5 rounded-3xl p-6 shadow-2xl">
                                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-xl">
                                                    <FaFileInvoiceDollar />
                                                </div>
                                                <div>
                                                    <div className="font-black text-white text-[13px] uppercase tracking-tight">Founding Member Subscription</div>
                                                    <div className="text-[10px] text-green-400/60 font-black uppercase tracking-widest">Pipeline Active • Verified via Stripe</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-white">$149.00</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(user.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>

                                        {user.current_period_end && (
                                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                <span>Protocol Expiry</span>
                                                <span className="text-emerald-400">{new Date(user.current_period_end).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-slate-950/20 rounded-3xl border border-dashed border-white/5">
                                        <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No strategic billing history located in core files.</div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">System Logistics Data</h3>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Registry Date', value: new Date(user.created_at).toLocaleString() },
                                            { label: 'Last Data Sync', value: 'Never Recorded' },
                                            { label: 'Authority Level', value: user.is_approved ? 'Level 4 (Verified)' : 'Level 1 (Unverified)' }
                                        ].map((log, i) => (
                                            <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{log.label}</span>
                                                <span className="text-[11px] text-white font-bold uppercase tracking-tight">{log.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Strategic Asset Bank</h3>

                                {isLoadingProducts ? (
                                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                                        <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanning Asset Vault...</div>
                                    </div>
                                ) : products.length > 0 ? (
                                    <div className="space-y-3">
                                        {products.map(product => (
                                            <div key={product.id} className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                                        <FaBoxOpen />
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] font-black text-white uppercase tracking-tight">{product.product_name}</div>
                                                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{product.product_category} • Hub: {product.country_code}</div>
                                                    </div>
                                                </div>
                                                <div className={`text-[9px] px-3 py-1 rounded-full border font-black uppercase tracking-widest ${product.status === 'active' ? 'border-green-500/20 text-green-400 bg-green-500/10' : 'border-white/10 text-slate-500 bg-white/5'}`}>
                                                    {product.status || 'Draft'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-24 bg-slate-950/20 rounded-3xl border border-dashed border-white/5">
                                        <FaBoxOpen className="mx-auto text-3xl mb-4 text-slate-800" />
                                        <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No strategic assets secured in bank.</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Overdrive Action Confirmation Modal */}
                {confirmation.isOpen && (
                    <div className="absolute inset-0 z-[110] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
                        <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 max-w-sm w-full shadow-[0_32px_128px_rgba(0,0,0,0.8)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

                            <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 text-3xl mx-auto mb-8 shadow-2xl">
                                <FaShieldAlt />
                            </div>

                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">{confirmation.title}</h3>
                            <p className="text-slate-500 text-xs font-bold leading-relaxed mb-10 uppercase tracking-widest opacity-80">{confirmation.description}</p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setConfirmation({ ...confirmation, isOpen: false })}
                                    className="flex-1 py-4 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
                                >
                                    Abort
                                </button>
                                <button
                                    onClick={executeAction}
                                    disabled={isLoading}
                                    className={`
                                        flex-1 py-4 text-[10px] font-black text-white uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl
                                        ${confirmation.action === 'deactivate' ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'}
                                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    {isLoading ? 'SYNCING...' : 'CONFIRM'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
