import Link from 'next/link'
import { FaTimesCircle } from 'react-icons/fa'

export default function RejectedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white p-4">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaTimesCircle className="text-4xl text-red-400" />
                </div>

                <h1 className="text-3xl font-bold mb-4">Application Declined</h1>

                <p className="text-red-100 mb-8 leading-relaxed">
                    We regret to inform you that your application to ArkAlliance has been declined at this time.
                </p>

                <div className="bg-red-900/40 rounded-xl p-4 mb-8 border border-red-500/30">
                    <p className="text-sm text-red-200">
                        If you believe this is an error or would like to re-apply with updated information, please contact our support team.
                    </p>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/auth/register"
                        className="block w-full py-3 px-6 bg-white text-red-900 font-bold rounded-xl hover:bg-red-50 transition-colors"
                    >
                        Re-Register
                    </Link>
                    <Link
                        href="/"
                        className="block w-full py-3 px-6 bg-transparent border border-white/20 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
