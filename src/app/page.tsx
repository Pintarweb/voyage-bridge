'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import HomeHero from '@/components/landing/HomeHero'
import HomeStats from '@/components/landing/HomeStats'
import HowItWorks from '@/components/landing/HowItWorks'
import FoundingMemberCTA from '@/components/landing/FoundingMemberCTA'

export default function Home() {
    const [stats, setStats] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchStats = async () => {
            const { data } = await supabase.rpc('get_landing_stats')
            setStats(data)
        }
        fetchStats()
    }, [supabase])

    const supplierCount = stats?.suppliers || 120
    const productCount = stats?.products || 450
    const agentCount = stats?.agents || 85

    const content = {
        ctaAgent: 'Start Trading',
        ctaSupplier: 'For Suppliers'
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-x-hidden selection:bg-amber-500/30">
            <HomeHero
                ctaAgentText={content.ctaAgent}
                ctaSupplierText={content.ctaSupplier}
                statsComponent={
                    <HomeStats
                        supplierCount={supplierCount}
                        productCount={productCount}
                        agentCount={agentCount}
                    />
                }
            />

            <HowItWorks />

            <FoundingMemberCTA />
        </div>
    )
}
