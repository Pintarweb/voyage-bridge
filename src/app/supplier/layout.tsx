import PulseWidget from '@/components/feedback/PulseWidget'

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
