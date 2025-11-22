import Link from 'next/link'

export default function PaymentSuccessPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 text-center">
            <div className="rounded-lg bg-slate-800 p-8 shadow-xl max-w-md w-full border border-slate-700">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 mb-6">
                    <svg
                        className="h-8 w-8 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
                <p className="text-gray-400 mb-8">
                    Your account has been created. In a real scenario, you would have been redirected to a payment gateway.
                </p>
                <Link
                    href="/supplier/dashboard"
                    className="inline-flex w-full justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    )
}
