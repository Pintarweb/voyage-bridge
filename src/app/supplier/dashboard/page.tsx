'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    FaHome, FaUserCircle, FaCreditCard, FaBox, FaChartLine, FaSignOutAlt, FaComments
} from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'

// Tab Components
import OverviewTab from '@/components/supplier/dashboard/tabs/OverviewTab'
import AccountTab from '@/components/supplier/dashboard/tabs/AccountTab'
import BillingTab from '@/components/supplier/dashboard/tabs/BillingTab'
import ProductTab from '@/components/supplier/dashboard/tabs/ProductTab'
import SupplierReports from './reports/page' // Import the report page as a component
import { ChangeSlotsModal, CancelSubscriptionModal } from '@/components/supplier/dashboard/SubscriptionModals'
import FeatureWishlist from '@/components/feedback/FeatureWishlist'
import SupplierSidebar from '@/components/supplier/dashboard/SupplierSidebar'

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const [supplier, setSupplier] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState('overview')

    // Add these state variables inside the component
    const [isSlotsModalOpen, setIsSlotsModalOpen] = useState(false)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

    const router = useRouter()
    const supabase = createClient()
    const { language } = useLanguage()

    const t = {
        'en-US': {
            welcomeBack: 'Welcome back',
            logout: 'Logout',
            tabs: {
                overview: 'Overview',
                account: 'Account',
                billing: 'Billing',
                products: 'Products',
                reports: 'Reports'
            }
        },
    }

    const content = (t as any)[language] || t['en-US']

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    // Hoisted fetch function wrapped in useCallback
    const fetchDashboardData = useCallback(async () => {
        try {
            // 1. Get User
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) {
                router.push('/auth/supplier')
                return
            }
            setUser(user)

            // 2. Get Supplier Details
            const { data: supplierData, error: supplierError } = await supabase
                .from('suppliers')
                .select('*')
                .eq('id', user.id)
                .single()

            if (supplierError) throw supplierError
            setSupplier(supplierData)

            // 3. Get Products
            // Note: We fetch ALL products here, and let tabs filter them
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .eq('supplier_id', user.id)
                .order('created_at', { ascending: false })

            if (productsError) throw productsError
            setProducts(productsData || [])
        } catch (error) {
            console.error('Error loading dashboard:', error)
        } finally {
            setLoading(false)
        }
    }, [router, supabase])

    useEffect(() => {
        fetchDashboardData()
    }, [fetchDashboardData])

    if (loading) return (
        <div className="min-h-screen bg-blue-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
        </div>
    )

    const tabs = [
        { id: 'overview', label: content.tabs.overview, icon: FaHome },
        { id: 'account', label: content.tabs.account, icon: FaUserCircle },
        { id: 'billing', label: content.tabs.billing, icon: FaCreditCard },
        { id: 'products', label: content.tabs.products, icon: FaBox },
        { id: 'reports', label: content.tabs.reports, icon: FaChartLine },
        { id: 'community', label: 'Community', icon: FaComments },
    ]

    return (
        <div className="min-h-screen relative flex font-sans text-white bg-slate-950 overflow-hidden">

            {/* Background Atmosphere */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-slate-950/40 z-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-slate-950/90 z-20" />
                <div className="absolute top-0 right-[-10%] w-[60%] h-[60%] bg-amber-600/10 blur-[150px] z-20 pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] z-20 pointer-events-none" />

                <img
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                    alt="Global Business Travel"
                    className="w-full h-full object-cover opacity-60"
                />
            </div>

            {/* Sidebar Navigation */}
            <SupplierSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <div className="relative z-20 flex-1 ml-0 lg:ml-20 xl:ml-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen flex flex-col">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white drop-shadow-md">
                                {content.welcomeBack}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">{supplier?.company_name || 'Partner'}</span>
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">Manage your global inventory and performance.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setActiveTab('community')}
                                className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                            >
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
                                Vote Ideas
                            </button>

                            <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block"></div>

                            {/* User Badge */}
                            <div className="flex items-center gap-3 bg-white/10 pl-2 pr-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center text-xs font-extrabold shadow-lg">
                                    {(user?.email || 'S')[0]?.toUpperCase()}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-slate-200 text-xs font-bold leading-none">{user?.email || 'Supplier'}</p>
                                    <p className="text-amber-500/80 text-[10px] uppercase tracking-wider font-bold leading-none mt-1">Verified Partner</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="px-5 py-2.5 bg-slate-900/50 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2 backdrop-blur-md shadow-lg group"
                                title="Sign Out"
                            >
                                <FaSignOutAlt className="text-amber-500 group-hover:text-red-400 transition-colors" />
                                <span className="group-hover:text-red-400 transition-colors uppercase tracking-wider">{content.logout}</span>
                            </button>
                        </div>
                    </div>

                    {/* Content Views */}
                    <div className="flex-1 pb-20 fade-in">
                        {activeTab === 'overview' && (
                            <OverviewTab
                                supplier={supplier}
                                products={products}
                                content={content}
                                handleLogout={handleLogout}
                            />
                        )}
                        {activeTab === 'products' && (
                            <ProductTab
                                products={products}
                                supplier={supplier}
                                content={content}
                                onProductUpdate={fetchDashboardData}
                                onOpenSlotModal={() => setIsSlotsModalOpen(true)}
                            />
                        )}
                        {activeTab === 'reports' && (
                            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in-up">
                                <SupplierReports />
                            </div>
                        )}
                        {activeTab === 'account' && (
                            <AccountTab
                                supplier={supplier}
                                user={user}
                                handleLogout={handleLogout}
                            />
                        )}
                        {activeTab === 'billing' && (
                            <BillingTab
                                supplier={supplier}
                                user={user}
                            />
                        )}
                        {activeTab === 'community' && (
                            <div className="max-w-4xl mx-auto">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2">Community Wishlist</h2>
                                    <p className="text-slate-400">Vote on features you want to see next in ArkAlliance.</p>
                                </div>
                                <FeatureWishlist />
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Modals placed correctly at the end of the root div */}
            <ChangeSlotsModal
                isOpen={isSlotsModalOpen}
                onClose={() => setIsSlotsModalOpen(false)}
                currentSlots={supplier?.total_slots || 1}
                onUpdate={async (newSlots) => {
                    try {
                        const response = await fetch('/api/stripe/manage-subscription', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'update_slots', newSlotCount: newSlots, userId: user.id }),
                        })
                        if (!response.ok) throw new Error('Failed')
                        fetchDashboardData()
                        setIsSlotsModalOpen(false)
                    } catch (e) {
                        alert('Error updating slots')
                    }
                }}
            />
            <CancelSubscriptionModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={async () => {
                    router.push('/api/stripe/create-portal-session')
                }}
            />

        </div>
    )
}
