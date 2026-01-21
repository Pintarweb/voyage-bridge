'use client'

import React from 'react'
import Image from 'next/image'
import { FaColumns, FaUserCircle, FaCreditCard, FaBox, FaChartLine, FaComments } from 'react-icons/fa'

export default function SupplierSidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {

    return (
        <aside className="hidden lg:flex flex-col w-20 xl:w-64 bg-slate-950/40 backdrop-blur-xl border-r border-white/5 pt-8 pb-4 transition-all duration-300 h-screen fixed top-0 left-0 z-40">
            {/* Logo Area */}
            <div className="px-6 mb-8 flex items-center gap-3">
                <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                        src="/ark-logo-icon.jpg"
                        alt="ArkAlliance"
                        fill
                        className="object-contain rounded-md"
                    />
                </div>
                <span className="font-bold text-white tracking-tight hidden xl:block">Ark<span className="text-amber-500">Alliance</span></span>
            </div>

            <nav className="flex-1 space-y-2 px-3">
                <SidebarItem
                    icon={<FaColumns />}
                    label="Overview"
                    active={activeTab === 'overview'}
                    onClick={() => setActiveTab('overview')}
                />
                <SidebarItem
                    icon={<FaBox />}
                    label="Products"
                    active={activeTab === 'products'}
                    onClick={() => setActiveTab('products')}
                />
                <SidebarItem
                    icon={<FaChartLine />}
                    label="Reports"
                    active={activeTab === 'reports'}
                    onClick={() => setActiveTab('reports')}
                />
                <div className="h-px bg-white/5 my-2 mx-4 hidden xl:block"></div>
                <SidebarItem
                    icon={<FaUserCircle />}
                    label="Account"
                    active={activeTab === 'account'}
                    onClick={() => setActiveTab('account')}
                />
                <SidebarItem
                    icon={<FaCreditCard />}
                    label="Billing"
                    active={activeTab === 'billing'}
                    onClick={() => setActiveTab('billing')}
                />
                <SidebarItem
                    icon={<FaComments />}
                    label="Community"
                    active={activeTab === 'community'}
                    onClick={() => setActiveTab('community')}
                />
            </nav>

            <div className="px-6 py-4 mt-auto">
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 text-center animate-shine">
                    <p className="text-xs text-amber-200 font-medium hidden xl:block">Premium Partner</p>
                </div>
            </div>
        </aside>
    )
}

function SidebarItem({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${active ? 'bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
            <span className={`text-xl ${active ? 'text-amber-400' : 'text-slate-500 group-hover:text-white transition-colors'}`}>
                {icon}
            </span>
            <span className={`text-sm font-medium hidden xl:block ${active ? 'font-bold' : ''}`}>
                {label}
            </span>
            {active && <div className="ml-auto w-1 h-1 rounded-full bg-amber-400 hidden xl:block shadow-[0_0_5px_#fbbf24]"></div>}
        </button>
    )
}
