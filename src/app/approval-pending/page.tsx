import Link from 'next/link'

export default function ApprovalPending() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-900/30 text-yellow-500 mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Verification Pending</h1>
                <p className="text-lg text-gray-400">
                    Thank you for registering your agency. Our team is currently reviewing your license details.
                </p>
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-left">
                    <p className="text-sm text-gray-400 mb-2">What happens next?</p>
                    <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
                        <li>We verify your license number with local authorities.</li>
                        <li>This process typically takes 24-48 hours.</li>
                        <li>You will receive an email once approved.</li>
                    </ul>
                </div>
                <div className="pt-4">
                    <Link href="/" className="text-teal-400 hover:text-teal-300 font-medium">
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
