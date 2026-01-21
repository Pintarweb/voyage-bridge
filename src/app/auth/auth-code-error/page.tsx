'use client'

import React from 'react'
import Link from 'next/link'
import { FaExclamationTriangle, FaArrowRight } from 'react-icons/fa'

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-white">
            <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <FaExclamationTriangle className="text-3xl text-red-500" />
                </div>

                <h1 className="text-2xl font-bold mb-3">Authentication Error</h1>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    We encountered an issue verifying your secure login link. This usually happens if the link has expired or has already been used.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/auth/forgot-password"
                        className="block w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all duration-200 shadow-lg"
                    >
                        Resend Recovery Link
                    </Link>

                    <Link
                        href="/"
                        className="block w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                        Return Home <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
