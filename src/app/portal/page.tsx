import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CountrySearchView from '@/components/portal/CountrySearchView'

export default async function PortalPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/agent')
    }

    // Fetch distinct countries with product counts
    const { data: countries, error } = await supabase
        .from('products')
        .select('country_code')
        .eq('status', 'active')

    if (error) {
        console.error('Error fetching countries:', error)
        return <div className="text-white p-8">Error loading portal.</div>
    }

    // Group by country and count
    const countryMap = new Map<string, number>()
    countries?.forEach((p: any) => {
        const count = countryMap.get(p.country_code) || 0
        countryMap.set(p.country_code, count + 1)
    })

    // Convert to array with names (you may want to add a country names mapping)
    const countryOptions = Array.from(countryMap.entries())
        .map(([code, count]) => ({
            code,
            name: code, // TODO: Add country name mapping
            productCount: count
        }))
        .sort((a, b) => a.name.localeCompare(b.name))

    return <CountrySearchView countries={countryOptions} />
}
