'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    FaArchive, FaTrashRestore, FaPlus, FaChartLine, FaCrown, FaSearch,
    FaFilter, FaEye, FaHeart, FaEdit, FaBox, FaMapMarkerAlt, FaStar, FaSignOutAlt
} from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'
import { ChangeSlotsModal, CancelSubscriptionModal } from '@/components/supplier/dashboard/SubscriptionModals'

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const [supplier, setSupplier] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<any[]>([])
    const [totalWishlisted, setTotalWishlisted] = useState(0) // New state for wishlists
    const [filterStatus, setFilterStatus] = useState<string>('active')
    const [searchQuery, setSearchQuery] = useState('')

    // Archive/Restore State
    const [productToArchive, setProductToArchive] = useState<string | null>(null)
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
    const [productToRestore, setProductToRestore] = useState<string | null>(null)
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)

    // Subscription Modal States
    const [isSlotsModalOpen, setIsSlotsModalOpen] = useState(false)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

    const router = useRouter()
    const supabase = createClient()
    const { language } = useLanguage()

    // Reduced translation object for brevity 
    const t = {
        'en-US': {
            welcomeBack: 'Welcome back',
            totalProducts: 'Total Products',
            totalViews: 'Total Views (30d)',
            activePlan: 'Active Plan',
            addNew: 'Add New Product',
            reports: 'View Reports',
            yourSubscription: 'Your Subscription',
            upgrade: 'Upgrade Plan',
            performance: 'Performance Overview',
            yourProducts: 'Your Products',
            searchPlaceholder: 'Search products...',
            status: { all: 'All Status', active: 'Active', archived: 'Archived', draft: 'Draft' },
            edit: 'Edit',
            archive: 'Archive',
            restore: 'Restore',
            location: 'Location',
            logout: 'Logout'
        },
    }

    const content = (t as any)[language] || t['en-US']

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    // Helper to call our new API
    const manageSubscription = async (action: 'update_slots' | 'pause' | 'resume', payload: any = {}) => {
        try {
            const res = await fetch('/api/stripe/manage-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    action,
                    ...payload
                })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Request failed')
            window.location.reload()
        } catch (e) {
            console.error(e)
            alert('Failed to update subscription')
        }
    }

    const openStripePortal = async () => {
        try {
            const res = await fetch('/api/stripe/create-portal-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                alert('Could not open billing portal. Please contact support.')
            }
        } catch (e) {
            console.error(e)
            alert('Error opening billing portal.')
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error: authError } = await supabase.auth.getUser()
                if (authError || !data?.user) {
                    console.error('Auth error:', authError)
                    router.push('/auth/supplier')
                    return
                }
                const user = data.user
                setUser(user)

                const { data: supplierData } = await supabase
                    .from('suppliers')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (supplierData) setSupplier(supplierData)

                const { data: productsData, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('supplier_id', user.id)
                    .order('created_at', { ascending: false })

                if (error) throw error
                if (productsData) {
                    setProducts(productsData)

                    // Fetch total wishlists count for these products
                    if (productsData.length > 0) {
                        const productIds = productsData.map(p => p.id)
                        const { count } = await supabase
                            .from('wishlists')
                            .select('*', { count: 'exact', head: true })
                            .in('product_id', productIds)

                        setTotalWishlisted(count || 0)
                    }
                }

            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleArchive = (id: string) => {
        setProductToArchive(id); setIsArchiveModalOpen(true)
    }

    const confirmArchive = async () => {
        if (!productToArchive) return
        const { error } = await supabase.from('products').update({ status: 'archived' }).eq('id', productToArchive)
        if (!error) {
            setProducts(products.map(p => p.id === productToArchive ? { ...p, status: 'archived' } : p))
            setIsArchiveModalOpen(false)
        }
    }

    const handleRestore = (id: string) => {
        setProductToRestore(id); setIsRestoreModalOpen(true)
    }

    const confirmRestore = async () => {
        if (!productToRestore) return

        const activeCount = products.filter(p => p.status === 'active').length
        const totalSlots = supplier?.total_slots || 0
        const hasSlot = activeCount < totalSlots

        const newStatus = hasSlot ? 'active' : 'draft'

        if (!hasSlot) {
            alert('No active slots available. Product will be restored to Draft.')
        }

        const { error } = await supabase.from('products').update({ status: newStatus }).eq('id', productToRestore)
        if (!error) {
            setProducts(products.map(p => p.id === productToRestore ? { ...p, status: newStatus } : p))
            setIsRestoreModalOpen(false)
        }
    }

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === 'all' || p.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const totalViews = products.reduce((acc, curr) => acc + (curr.views || 0), 0)

    const getMainImage = (urls: any) => {
        try {
            if (Array.isArray(urls) && urls.length > 0) return urls[0]
            if (typeof urls === 'string') {
                const parsed = JSON.parse(urls)
                return parsed[0] || null
            }
        } catch (e) { return null }
        return null
    }

    if (loading) return <div className="min-h-screen bg-blue-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div></div>

    return (
        <div className="min-h-screen bg-blue-950 font-sans text-white relative selection:bg-amber-500/30">
            {/* Background Pattern - World Map Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-blue-950/75 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                    alt="World Map Background"
                    className="w-full h-full object-cover opacity-50 animate-pulse-slow"
                />
            </div>

            <div className="relative z-10">

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                    {/* Hero Section */}
                    <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {content.welcomeBack}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">{supplier?.company_name || 'Partner'}</span>
                                </h1>
                                <p className="text-white/60">Here is what’s happening with your inventory today.</p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/supplier/dashboard/products/create"
                                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-blue-950 font-bold rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all transform hover:-translate-y-1 flex items-center gap-2">
                                    <FaPlus /> {content.addNew}
                                </Link>
                                <Link href="/supplier/dashboard/reports" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl backdrop-blur-md transition-all flex items-center gap-2">
                                    <FaChartLine /> {content.reports}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold rounded-xl backdrop-blur-md transition-all flex items-center gap-2"
                                >
                                    <FaSignOutAlt /> {content.logout}
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                            <div className="bg-blue-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-amber-500/30 transition-colors">
                                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                                    <FaBox className="text-xl" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{products.length}</div>
                                    <div className="text-xs text-blue-200 uppercase tracking-wider">{content.totalProducts}</div>
                                </div>
                            </div>
                            <div className="bg-blue-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-amber-500/30 transition-colors">
                                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                                    <FaEye className="text-xl" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</div>
                                    <div className="text-xs text-emerald-200 uppercase tracking-wider">{content.totalViews}</div>
                                </div>
                            </div>
                            <div className="bg-blue-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-amber-500/30 transition-colors">
                                <div className="p-3 bg-pink-500/20 rounded-xl text-pink-400">
                                    <FaHeart className="text-xl" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{totalWishlisted}</div>
                                    <div className="text-xs text-pink-200 uppercase tracking-wider">Total Wishlisted</div>
                                </div>
                            </div>
                            <div className="bg-blue-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-amber-500/30 transition-colors">
                                <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
                                    <FaCrown className="text-xl" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">Founder's Plan</div>
                                    <div className="text-xs text-amber-200 uppercase tracking-wider">{content.activePlan}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Performance & Subscription */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Performance Chart Mock */}
                        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FaChartLine className="text-amber-400" /> {content.performance}
                                </h2>
                                <select className="bg-black/20 border border-white/10 text-xs text-white rounded-lg px-3 py-1 outline-none">
                                    <option>Last 30 Days</option>
                                    <option>Last 7 Days</option>
                                </select>
                            </div>
                            {/* CSS-only simple graph mock */}
                            <div className="h-48 w-full flex items-end gap-2 px-4 py-4 md:px-8 border-b border-white/10 relative" title="Live data visualization coming soon">
                                {/* Grid lines */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                    <div className="border-t border-white" />
                                    <div className="border-t border-white" />
                                    <div className="border-t border-white" />
                                </div>
                                {/* Bars */}
                                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95, 60, 70, 80].map((h, i) => (
                                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-500/50 to-teal-400/80 rounded-t-sm hover:opacity-100 opacity-80 transition-all duration-300 relative group" style={{ height: `${h}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {h * 12} Views
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-xs text-white/40 mt-3 pt-2">Real-time performance analytics module loaded.</p>
                        </div>

                        {/* Subscription Card */}
                        <div className="bg-white/5 backdrop-blur-md border border-amber-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <FaCrown className="text-amber-400" /> {content.yourSubscription}
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                                        <span className="text-white/60 text-sm">Plan</span>
                                        <span className="font-bold text-amber-400">Founding Member</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                                        <span className="text-white/60 text-sm">Status</span>
                                        <span className={`px-2 py-0.5 rounded text-xs border font-bold uppercase ${supplier?.subscription_status === 'active'
                                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                            }`}>
                                            {supplier?.subscription_status || 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                                        <span className="text-white/60 text-sm">Billing</span>
                                        <span className="text-white font-medium">
                                            {(() => {
                                                const slots = supplier?.total_slots || 1
                                                const fee = 30 + (Math.max(0, slots - 1) * 20)
                                                return `$${fee.toFixed(2)} / mo`
                                            })()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                                        <span className="text-white/60 text-sm">Next Charge</span>
                                        <div className="text-right">
                                            <div className="text-white font-medium">
                                                {supplier?.current_period_end
                                                    ? new Date(supplier.current_period_end).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                                                    : 'N/A'}
                                            </div>
                                            {(supplier?.subscription_status === 'trialing' || (supplier?.trial_end && new Date(supplier.trial_end) > new Date())) && (
                                                <div className="text-amber-400 text-xs mt-1">
                                                    Trial Ends in {Math.ceil((new Date(supplier.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} Days
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button onClick={() => setIsSlotsModalOpen(true)} className="w-full mt-6 py-3 rounded-xl border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold transition-all text-sm shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                    {content.upgrade}
                                </button>
                                <button onClick={() => setIsCancelModalOpen(true)} className="w-full mt-3 py-2 text-xs text-red-400/60 hover:text-red-400 underline decoration-red-500/30 transition-colors">
                                    Cancel Plan
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Management */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 min-h-[500px]">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FaBox className="text-blue-400" /> {content.yourProducts}
                            </h2>
                            <div className="flex gap-4 w-full md:w-auto">
                                <div className="relative flex-grow md:flex-grow-0">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                    <input
                                        type="text"
                                        placeholder={content.searchPlaceholder}
                                        className="w-full md:w-64 bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50 transition-colors"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                    <select
                                        className="bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-8 text-white appearance-none outline-none cursor-pointer focus:border-amber-500/50 transition-colors"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="draft">Draft</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="bg-blue-950/40 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all group">
                                    {/* Thumbnail */}
                                    <div className="h-40 bg-black/50 relative">
                                        {getMainImage(product.photo_urls) ? (
                                            <img src={getMainImage(product.photo_urls)} alt={product.product_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                                <FaBox className="text-3xl" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${product.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                                product.status === 'archived' ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' :
                                                    'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                                }`}>
                                                {product.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="font-bold text-white mb-1 truncate" title={product.product_name}>{product.product_name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-white/60 mb-4">
                                            <FaMapMarkerAlt /> {product.city || 'Unknown Location'}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            <div className="bg-white/5 rounded-lg p-2 text-center">
                                                <div className="text-xs text-white/40 mb-1 flex justify-center items-center gap-1"><FaEye /> Views</div>
                                                <div className="font-bold text-white">{product.views || 0}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-2 text-center">
                                                <div className="text-xs text-white/40 mb-1 flex justify-center items-center gap-1"><FaHeart /> Saves</div>
                                                <div className="font-bold text-white">{0}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => router.push(`/supplier/dashboard/products/create?id=${product.id}`)}
                                                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white transition-colors flex items-center justify-center gap-1">
                                                <FaEdit /> {content.edit || 'Edit'}
                                            </button>
                                            {product.status === 'archived' ? (
                                                <button
                                                    onClick={() => handleRestore(product.id)}
                                                    className="px-3 py-2 bg-green-600/20 border border-green-600/50 hover:bg-green-600/30 rounded-lg text-xs font-bold text-green-400 transition-colors" title="Restore">
                                                    <FaTrashRestore />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleArchive(product.id)}
                                                    className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 rounded-lg text-xs font-bold text-white transition-colors" title="Archive">
                                                    <FaArchive />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Empty Slots */}
                            {(filterStatus === 'all' || filterStatus === 'active') && (() => {
                                const totalSlots = supplier?.total_slots || 0
                                const activeProductsCount = products.filter(p => p.status === 'active').length
                                const emptySlots = Math.max(0, totalSlots - activeProductsCount)

                                return Array.from({ length: emptySlots }).map((_, i) => (
                                    <div key={`empty-${i}`} className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[350px] hover:border-amber-500/30 hover:bg-white/5 transition-all group cursor-pointer" onClick={() => router.push('/supplier/dashboard/products/create')}>
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-4 group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-all">
                                            <FaPlus className="text-2xl" />
                                        </div>
                                        <h3 className="font-bold text-white mb-2">Empty Slot</h3>
                                        <p className="text-sm text-white/50 mb-6">You have an available slot to publish a new product.</p>
                                        <button className="px-6 py-2 bg-white/10 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors">
                                            Add Product
                                        </button>
                                    </div>
                                ))
                            })()}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals reused logic */}
            {isArchiveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-blue-950 border border-white/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-2">Archive Product?</h3>
                        <p className="text-white/60 mb-6">This product will be moved to archives. You can restore it later.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setIsArchiveModalOpen(false)} className="px-4 py-2 text-white/60 hover:text-white">Cancel</button>
                            <button onClick={confirmArchive} className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-bold">Archive</button>
                        </div>
                    </div>
                </div>
            )}

            {isRestoreModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-blue-950 border border-white/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-2">Restore Product?</h3>
                        <p className="text-white/60 mb-6">
                            {(() => {
                                const activeCount = products.filter(p => p.status === 'active').length
                                const totalSlots = supplier?.total_slots || 0
                                return activeCount < totalSlots
                                    ? "This product will be restored and automatically activated."
                                    : "This product will be restored to Drafts because you have reached your active slot limit."
                            })()}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setIsRestoreModalOpen(false)} className="px-4 py-2 text-white/60 hover:text-white">Cancel</button>
                            <button onClick={confirmRestore} className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-bold">Restore</button>
                        </div>
                    </div>
                </div>
            )}

            <ChangeSlotsModal
                isOpen={isSlotsModalOpen}
                onClose={() => setIsSlotsModalOpen(false)}
                currentSlots={supplier?.total_slots || 1}
                onUpdate={(newSlots) => manageSubscription('update_slots', { newSlotCount: newSlots })}
            />

            <CancelSubscriptionModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={() => openStripePortal()}
            />
        </div>
    )
}
