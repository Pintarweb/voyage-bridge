import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CountrySearchView from '@/components/portal/CountrySearchView'
import TourismBackground from '@/components/ui/TourismBackground'
import AgentDashboard from '@/components/dashboard/AgentDashboard'

export default async function PortalPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/agent')
    }

    // Fetch distinct countries with product counts
    const { data: countries } = await supabase
        .from('products')
        .select('country_code')
        .eq('status', 'active')

    // Group by country and count
    const countryMap = new Map<string, number>()
    countries?.forEach((p: any) => {
        const count = countryMap.get(p.country_code) || 0
        countryMap.set(p.country_code, count + 1)
    })

    // Convert to array with names
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const countryOptions = Array.from(countryMap.entries())
        .map(([code, count]) => {
            let name = code;
            try {
                name = displayNames.of(code) || code;
            } catch (e) {
                // Fallback to code if invalid
            }
            return {
                code,
                name,
                productCount: count
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name))

    // Fetch random trending products (simulated by fetching active products)
    const { data: trendingProducts } = await supabase
        .from('products')
        .select(`
            id,
            product_name,
            product_category,
            photo_urls,
            supplier:suppliers (
                company_name
            )
        `)
        .eq('status', 'active')
        .limit(4)

    // Fetch latest suppliers
    const { data: latestSuppliers } = await supabase
        .from('suppliers')
        .select(`
            company_name,
            supplier_type,
            products:products(count)
        `)
        .eq('subscription_status', 'active')
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <div className="relative min-h-screen flex flex-col bg-slate-950 text-white font-sans selection:bg-amber-500/30">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-slate-950/20 z-10 mix-blend-multiply" /> {/* Tint */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/50 to-slate-950 z-10" /> {/* Vignette */}
                <img
                    src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop"
                    alt="City Command"
                    className="w-full h-full object-cover opacity-40"
                />
            </div>

            <div className="relative z-10 flex-grow">
                <AgentDashboard
                    userName={user.email?.split('@')[0] || 'Agent'}
                    countries={countryOptions}
                    trendingProducts={trendingProducts || []}
                    latestSuppliers={latestSuppliers || []}
                />
            </div>
        </div>
    )
}

