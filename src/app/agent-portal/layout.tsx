import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import PortalHeader from '@/components/portal/PortalHeader'

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/agent')
    }

    return (
        <>
            <PortalHeader userEmail={user.email} />
            {children}
        </>
    )
}
