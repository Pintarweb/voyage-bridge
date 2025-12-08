import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CountrySearchView from '@/components/portal/CountrySearchView'
import TourismBackground from '@/components/ui/TourismBackground'
import PortalHeader from '@/components/portal/PortalHeader'

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

    return (
        <div className="relative min-h-screen flex flex-col">
            <TourismBackground />
            <PortalHeader userEmail={user.email} />
            <div className="relative z-10 flex-grow">
                <CountrySearchView countries={countryOptions} />
            </div>
        </div>
    )
}
