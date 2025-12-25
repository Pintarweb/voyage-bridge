import { FaTools } from 'react-icons/fa'

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg rotate-3 hover:rotate-6 transition-transform">
                        <FaTools className="text-3xl text-white" />
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">System Under Maintenance</h1>
                    <p className="text-lg text-white/60 mb-8 leading-relaxed">
                        We are currently performing scheduled maintenance to improve your experience. Access to the platform is temporarily paused.
                    </p>

                    <div className="bg-black/30 rounded-xl p-4 border border-white/5 mb-8">
                        <div className="flex items-center gap-3 justify-center text-sm font-mono text-cyan-400">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
                            Estimated uptime: Very Soon
                        </div>
                    </div>

                    <button disabled className="px-6 py-3 bg-white/5 text-white/40 font-bold rounded-xl cursor-not-allowed border border-white/5">
                        Please check back later
                    </button>

                    <div className="mt-8 text-xs text-white/20">
                        Reference ID: MNT-2025-X89
                    </div>
                </div>
            </div>
        </div>
    )
}
