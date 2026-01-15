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

    // Fetch a pool of products
    const { data: rawProducts } = await supabase
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
        .order('created_at', { ascending: false })
        .limit(20)

    // Simplified selection logic (Diversity + Recency)
    const trendingProducts: any[] = []
    const seenCategories = new Set()

    if (rawProducts) {
        // Step 1: Fill slots with category-diverse products
        rawProducts.forEach(p => {
            if (trendingProducts.length < 4 && !trendingProducts.find(tp => tp.id === p.id)) {
                if (!seenCategories.has(p.product_category)) {
                    trendingProducts.push(p)
                    seenCategories.add(p.product_category)
                }
            }
        })

        // Step 2: Fill remaining slots with any available recent products
        rawProducts.forEach(p => {
            if (trendingProducts.length < 4 && !trendingProducts.find(tp => tp.id === p.id)) {
                trendingProducts.push(p)
            }
        })
    }

    // Fetch latest suppliers
    const { data: latestSuppliers } = await supabase
        .from('suppliers')
        .select(`
            id,
            company_name,
            supplier_type,
            products:products(count)
        `)
        .eq('subscription_status', 'active')
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <AgentDashboard
            userName={user.email?.split('@')[0] || 'Agent'}
            countries={countryOptions}
            trendingProducts={trendingProducts || []}
            latestSuppliers={latestSuppliers || []}
        />
    )
}

