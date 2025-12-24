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
        <div className="min-h-screen relative flex flex-col font-sans text-white bg-blue-950 overflow-hidden">

            {/* Background - Copied from /auth/supplier/page.tsx */}
            {/* Background - Copied from /auth/supplier/page.tsx */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Lighter overlay for brighter background */}
                <div className="absolute inset-0 bg-blue-950/10 z-10" />
                <style jsx global>{`
                  @keyframes pan-slow {
                    0% { transform: scale(1.1) translate(0, 0); }
                    100% { transform: scale(1.25) translate(-2%, -2%); }
                  }
                  .animate-pan-slow {
                    animation: pan-slow 40s ease-in-out infinite alternate;
                  }
                  /* Autofill Transparency Fix */
                  input:-webkit-autofill,
                  input:-webkit-autofill:hover, 
                  input:-webkit-autofill:focus, 
                  input:-webkit-autofill:active {
                      -webkit-box-shadow: 0 0 0 30px rgba(23, 37, 84, 0.8) inset !important;
                      -webkit-text-fill-color: white !important;
                      caret-color: white !important;
                      transition: background-color 5000s ease-in-out 0s;
                  }
                `}</style>
                <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                    alt="Global Trade Network"
                    className="w-full h-full object-cover animate-pan-slow"
                />
            </div>

            {/* Main Layout */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col min-h-screen">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {content.welcomeBack}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">{supplier?.company_name || 'Partner'}</span>
                        </h1>
                        <p className="text-white/60 text-sm">Manage your global inventory and performance.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-bold transition-all flex items-center gap-2 backdrop-blur-md"
                    >
                        <FaSignOutAlt /> {content.logout}
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-8 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 w-fit mx-auto md:mx-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === tab.id
                                ? 'bg-amber-500 text-blue-950 shadow-lg shadow-amber-500/20'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 pb-20">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            supplier={supplier}
                            products={products}
                            content={content}
                            handleLogout={handleLogout}
                        />
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
                        // We wrap SupplierReports in a container to prevent it taking full screen over tabs if poorly styled
                        // But mostly it should be fine.
                        <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                            <SupplierReports />
                        </div>
                    )}
                    {activeTab === 'community' && (
                        <FeatureWishlist />
                    )}
                </div>

            </div>

            {/* Modals placed correctly at the end of the root div */}
            <ChangeSlotsModal
                isOpen={isSlotsModalOpen}
                onClose={() => setIsSlotsModalOpen(false)}
                currentSlots={supplier?.total_slots || 1}
                onUpdate={async (newSlots) => {
                    // Logic to update slots (API call)
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
            {/* We also need CancelSubscriptionModal if we want it to work fully, though triggers are in BillingTab currently */}
            {/* But since we imported it, we might as well render it if we lift state later. For now, it's fine. */}

        </div>
    )
}
