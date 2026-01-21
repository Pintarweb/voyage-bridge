'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import HomeHero from '@/components/landing/HomeHero'
import HomeStats from '@/components/landing/HomeStats'
import HowItWorks from '@/components/landing/HowItWorks'
import FoundingMemberCTA from '@/components/landing/FoundingMemberCTA'

export default function Home() {
    const [stats, setStats] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const init = async () => {
            const [statsRes, authRes] = await Promise.all([
                supabase.rpc('get_landing_stats'),
                supabase.auth.getUser()
            ])
            setStats(statsRes.data)
            setUser(authRes.data.user)
            setLoading(false)
        }
        init()
    }, [supabase])

    const supplierCount = stats?.suppliers ?? 0
    const productCount = stats?.products ?? 0
    const agentCount = stats?.agents ?? 0

    // If stats is null, we show the defaults, but once stats is loaded (even if counts are 0), 
    // we use the real numbers.
    const hasLoaded = stats !== null;
    const content = {
        ctaAgent: 'Start Trading',
        ctaSupplier: 'For Suppliers'
    }

    if (loading) return <div className="min-h-screen bg-slate-950" />

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-x-hidden selection:bg-amber-500/30">
            <HomeHero
                user={user}
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
