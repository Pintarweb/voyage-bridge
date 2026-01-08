import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import PortalHeader from '@/components/portal/PortalHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Agent Discovery Hub | ArkAlliance",
}

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
        <div className="relative min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500/30">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden fixed">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-slate-950 z-10" /> {/* Softer Vignette */}
                <img
                    src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop"
                    alt="City Command"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>

            <div className="relative z-10">
                <PortalHeader userEmail={user.email} />
                {children}
            </div>
        </div>
    )
}
