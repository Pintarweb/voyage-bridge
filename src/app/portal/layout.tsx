import { CurrencyProvider } from '@/context/CurrencyContext'
import { LanguageProvider } from '@/context/LanguageContext'
import GlobalHeader from '@/components/layout/GlobalHeader'

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background">
            <GlobalHeader type="portal" />
            <main>{children}</main>
        </div>
    )
}
