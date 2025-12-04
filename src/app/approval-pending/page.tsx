import Link from 'next/link'
import { FaClock } from 'react-icons/fa'

export default function ApprovalPendingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaClock className="text-4xl text-blue-400" />
                </div>

                <h1 className="text-3xl font-bold mb-4">Application Under Review</h1>

                <p className="text-blue-100 mb-8 leading-relaxed">
                    Thank you for registering with ArkAlliance. Your application is currently under review by our team.
                </p>

                <div className="bg-blue-900/40 rounded-xl p-4 mb-8 border border-blue-500/30">
                    <p className="text-sm text-blue-200">
                        We will notify you via email when access is granted.
                    </p>
                </div>

                <Link
                    href="/"
                    className="inline-block w-full py-3 px-6 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    )
}
