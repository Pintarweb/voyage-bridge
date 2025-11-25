import { CurrencyProvider } from '@/context/CurrencyContext'
import { LanguageProvider } from '@/context/LanguageContext'
import GlobalHeader from '@/components/layout/GlobalHeader'

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <LanguageProvider>
            <CurrencyProvider>
                <div className="min-h-screen bg-[#101015]">
                    <GlobalHeader type="portal" />
                    <main>{children}</main>
                </div>
            </CurrencyProvider>
        </LanguageProvider>
    )
}
