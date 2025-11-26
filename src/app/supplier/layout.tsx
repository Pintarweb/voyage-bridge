import { CurrencyProvider } from '@/context/CurrencyContext'
import { LanguageProvider } from '@/context/LanguageContext'
import GlobalHeader from '@/components/layout/GlobalHeader'

export default function SupplierLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background">
            <GlobalHeader type="supplier" />
            <main>{children}</main>
        </div>
    )
}
