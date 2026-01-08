import PulseWidget from '@/components/feedback/PulseWidget'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Supplier Command Center | ArkAlliance",
}

export default function SupplierLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
            <PulseWidget />
        </>
    )
}
