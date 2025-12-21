'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { FaTimes, FaUser, FaBuilding, FaEnvelope, FaMapMarkerAlt, FaPhone, FaGlobe, FaHistory, FaBan, FaUnlock, FaTrash, FaKey, FaFileInvoiceDollar, FaBoxOpen, FaExternalLinkAlt, FaIdCard, FaPlane } from 'react-icons/fa'

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
                title = 'Reset Password?'
                description = `Are you sure you want to send a password reset email to ${user.email}? They will be prompted to create a new password upon clicking the link.`
                break
            case 'freeze':
                title = 'Freeze Account?'
                description = `This will temporarily disable access for ${user.company_name || user.agency_name}. You can unfreeze it later. Are you sure?`
                break
            case 'deactivate':
                title = 'Deactivate User?'
                description = `WARNING: This action is destructive. It will permanently disable the account for ${user.company_name || user.agency_name} and may cascade to their listings. Are you sure?`
                break
        }

        setConfirmation({ isOpen: true, action, title, description })
    }

    const executeAction = async () => {
        if (!confirmation.action) return

        setIsLoading(true)
        setConfirmation({ ...confirmation, isOpen: false }) // Close confirm modal immediately or wait? Better wait or show loading in it. Let's close and show specific loading UI if needed, but existing isLoading handles it.

        try {
            // Call parent handler which will call Server Actions
            await onUpdateStatus(user.id, confirmation.action)
            // alert(`Action ${confirmation.action} completed successfully`) // Parent should handle notifications or we do it here. Let's rely on parent or just log.
            onClose()
        } catch (error) {
            console.error(error)
            alert('Action failed')
        } finally {
            setIsLoading(false)
            setConfirmation({ isOpen: false, action: null, title: '', description: '' })
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">

                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${type === 'Agent' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {type === 'Agent' ? <FaUser /> : <FaBuilding />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{user.company_name || user.agency_name || 'Unnamed User'}</h2>
                            <div className="flex items-center gap-2 text-sm text-white/50">
                                <span className="uppercase tracking-wider font-bold text-xs">{type}</span>
                                <span>•</span>
                                {(() => {
                                    let status = 'Pending'
                                    let colorClass = 'text-amber-400'

                                    if (user.is_approved) {
                                        status = 'Active'
                                        colorClass = 'text-green-400'
                                    } else if (type === 'Agent') {
                                        if (user.verification_status === 'rejected') {
                                            status = 'Rejected'
                                            colorClass = 'text-red-400'
                                        }
                                    } else {
                                        // Supplier
                                        if (user.subscription_status === 'canceled') {
                                            status = 'Deactivated'
                                            colorClass = 'text-gray-400'
                                        } else if (user.subscription_status === 'past_due') {
                                            status = 'Frozen'
                                            colorClass = 'text-blue-400 animate-pulse'
                                        } else if (user.rejection_reason) {
                                            status = 'Rejected'
                                            colorClass = 'text-red-400'
                                        }
                                    }

                                    return <span className={colorClass}>{status}</span>
                                })()}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                        <FaTimes />
                    </button>
                </div>

                {/* Tabs, if we had more sections. For now just content. */}
                <div className="flex border-b border-white/10 bg-black/20">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-cyan-500 text-white' : 'border-transparent text-white/40 hover:text-white'}`}
                    >
                        Details
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'history' ? 'border-cyan-500 text-white' : 'border-transparent text-white/40 hover:text-white'}`}
                    >
                        Billing
                    </button>
                    {type === 'Supplier' && (
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'products' ? 'border-cyan-500 text-white' : 'border-transparent text-white/40 hover:text-white'}`}
                        >
                            Products
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab('actions')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'actions' ? 'border-cyan-500 text-white' : 'border-transparent text-white/40 hover:text-white'}`}
                    >
                        Actions
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            {/* Entity Specific Header */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-start gap-4">
                                <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center text-lg ${type === 'Agent' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {type === 'Agent' ? <FaIdCard /> : <FaBuilding />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white mb-2">{type === 'Agent' ? 'Agency Information' : 'Company Information'}</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {type === 'Agent' ? (
                                            <>
                                                <div>
                                                    <div className="text-[10px] uppercase text-white/40 font-bold">Agency Name</div>
                                                    <div className="text-sm text-white/80">{user.agency_name || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase text-white/40 font-bold">License #</div>
                                                    <div className="text-sm text-white/80">{user.license_number || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase text-white/40 font-bold">IATA #</div>
                                                    <div className="text-sm text-white/80">{user.iata_number || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase text-white/40 font-bold">CLIA #</div>
                                                    <div className="text-sm text-white/80">{user.clia_number || 'N/A'}</div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="col-span-2">
                                                    <div className="text-[10px] uppercase text-white/40 font-bold">Business Name</div>
                                                    <div className="text-sm text-white/80">{user.company_name || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase text-white/40 font-bold">Supplier Type</div>
                                                    <div className="text-sm text-white/80">{user.supplier_type || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase text-white/40 font-bold">Tax/Reg ID</div>
                                                    <div className="text-sm text-white/80">{user.tax_id || user.company_reg_no || 'N/A'}</div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-white/40 uppercase">Email</label>
                                    <div className="flex items-center gap-2 text-white/80">
                                        <FaEnvelope className="text-cyan-500/50" />
                                        {user.email || user.contact_email}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-white/40 uppercase">Location</label>
                                    <div className="flex items-center gap-2 text-white/80">
                                        <FaMapMarkerAlt className="text-cyan-500/50" />
                                        {user.city ? `${user.city}, ` : ''}{user.country || user.country_code}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-white/40 uppercase">Phone</label>
                                    <div className="flex items-center gap-2 text-white/80">
                                        <FaPhone className="text-cyan-500/50" />
                                        {user.phone_number || user.contact_phone || 'N/A'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-white/40 uppercase">Website</label>
                                    <div className="flex items-center gap-2 text-white/80">
                                        <FaGlobe className="text-cyan-500/50" />
                                        <a href={user.website_url} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 truncate flex items-center gap-1">
                                            {user.website_url ? (user.website_url.replace(/^https?:\/\//, '').split('/')[0]) : 'N/A'}
                                            {user.website_url && <FaExternalLinkAlt className="text-[10px]" />}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <label className="text-xs font-bold text-white/40 uppercase block mb-2">Registration ID</label>
                                <code className="font-mono text-xs text-amber-500/80">{user.id}</code>
                            </div>
                        </div>
                    )}

                    {activeTab === 'actions' && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white mb-4">Account Management</h3>

                            <button
                                onClick={() => handleActionClick('reset_password')}
                                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <FaKey />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-white text-sm">Reset Password</div>
                                        <div className="text-xs text-white/40">Send password reset email to user</div>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleActionClick('freeze')}
                                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                                        <FaBan />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-white text-sm">Freeze Account</div>
                                        <div className="text-xs text-white/40">Temporarily disable access</div>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleActionClick('deactivate')}
                                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                                        <FaTrash />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-white group-hover:text-red-400 text-sm">Deactivate / Delete</div>
                                        <div className="text-xs text-white/40 group-hover:text-red-400/60">Permanently remove user</div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white mb-4">Billing & Subscription History</h3>
                            {type === 'Supplier' && user.payment_status === 'completed' ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                                <FaFileInvoiceDollar />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">Founding Member Subscription</div>
                                                <div className="text-xs text-white/40">Paid via Stripe</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-white">$149.00</div>
                                            <div className="text-xs text-green-400">Paid</div>
                                            <div className="text-[10px] text-white/30">{new Date(user.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    {user.current_period_end && (
                                        <div className="text-right text-[10px] text-emerald-400 font-mono">
                                            Active until: {new Date(user.current_period_end).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-white/40 text-sm bg-white/5 rounded-xl border border-dashed border-white/10">
                                    No billing history available.
                                </div>
                            )}

                            <div className="mt-8">
                                <h3 className="text-sm font-bold text-white mb-4">System Logistics</h3>
                                <div className="space-y-3 bg-white/5 rounded-xl p-4 border border-white/5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white/40">Joined Platform</span>
                                        <span className="text-white/80">{new Date(user.created_at).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white/40">Last Login</span>
                                        <span className="text-white/80">Never</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white/40">Verification Status</span>
                                        <span className="text-white/80 uppercase">
                                            {(() => {
                                                if (user.is_approved) return 'Verified'
                                                if (type === 'Agent' && user.verification_status) return user.verification_status
                                                if (user.rejection_reason) return 'Rejected'
                                                if (user.subscription_status === 'canceled') return 'Deactivated'
                                                if (user.subscription_status === 'past_due') return 'Frozen'
                                                return 'Pending'
                                            })()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white mb-4">Product History</h3>

                            {isLoadingProducts ? (
                                <div className="text-center py-8 text-white/40 animate-pulse">Loading products...</div>
                            ) : products.length > 0 ? (
                                <div className="space-y-2">
                                    {products.map(product => (
                                        <div key={product.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs">
                                                    <FaBoxOpen />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{product.product_name}</div>
                                                    <div className="text-[10px] text-white/40 uppercase">{product.product_category} • {product.country_code}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-[10px] px-2 py-1 rounded border ${product.status === 'active' ? 'border-green-500/20 text-green-400 bg-green-500/10' : 'border-white/10 text-white/30 bg-white/5'}`}>
                                                    {product.status || 'Draft'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-white/40 bg-white/5 rounded-xl border border-dashed border-white/10">
                                    <FaBoxOpen className="mx-auto text-2xl mb-2 opacity-30" />
                                    No products found for this supplier.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Confirmation Modal Overlay */}
                {confirmation.isOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="bg-[#1A1A20] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-up">
                            <h3 className="text-xl font-bold text-white mb-2">{confirmation.title}</h3>
                            <p className="text-white/60 text-sm mb-6">{confirmation.description}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmation({ ...confirmation, isOpen: false })}
                                    className="flex-1 py-3 text-sm font-bold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={executeAction}
                                    className={`flex-1 py-3 text-sm font-bold text-white rounded-xl transition-all shadow-lg ${confirmation.action === 'deactivate' ? 'bg-red-500 hover:bg-red-400' : 'bg-cyan-500 hover:bg-cyan-400'}`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}
