'use client'

import Link from 'next/link'
import { FaClock, FaCheckCircle, FaArrowRight, FaShieldAlt, FaCreditCard } from 'react-icons/fa'
import Image from 'next/image'
import { Suspense, useEffect, useState } from 'react'
import DevPaymentFulfillment from '@/components/debug/DevPaymentFulfillment'
import { createClient } from '@/utils/supabase/client'

export default function ApprovalPendingPage() {
    const [status, setStatus] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [queueId, setQueueId] = useState<number | null>(null)
    const supabase = createClient()

    useEffect(() => {
        setQueueId(Math.floor(Math.random() * 90000) + 10000)
    }, [])

    useEffect(() => {
        const checkStatus = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                const { data } = await supabase
                    .from('suppliers')
                    .select('subscription_status')
                    .eq('id', session.user.id)
                    .single()
                if (data) setStatus(data.subscription_status)
            }
            setLoading(false)
        }
        checkStatus()
    }, [supabase])

    const isPendingPayment = status === 'pending_payment'

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 font-sans overflow-hidden bg-slate-950 text-white selection:bg-amber-500/30">
            <Suspense fallback={null}>
                <DevPaymentFulfillment />
            </Suspense>
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/80 z-20" />
                <div className="absolute inset-0 bg-slate-950/50 z-20" />
                <img
                    src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop"
                    alt="City Command"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>

            <div className="relative z-20 w-full max-w-lg">
                <div className="text-center mb-8 animate-in fade-in-50 duration-700">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-[0_0_40px_rgba(245,158,11,0.15)] mb-6 group hover:scale-105 transition-transform duration-500">
                        <Image
                            src="/ark-logo-icon.jpg"
                            alt="ArkAlliance"
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain drop-shadow-lg"
                        />
                    </div>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group animate-in slide-in-from-bottom-8 duration-700">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex flex-col items-center text-center">
                        <div className="mb-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wide mb-6">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse relative">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping"></span>
                                </span>
                                {isPendingPayment ? 'Action Required: Payment' : 'Step 2: Verification Protocol'}
                            </div>
                        </div>

                        <h1 className="text-3xl font-black text-white mb-4 tracking-tight">
                            {isPendingPayment ? 'Finalize Your Access' : 'Application Received'}
                        </h1>
                        <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                            {isPendingPayment
                                ? 'Your profile is created, but your founding membership is not yet active. Complete payment to enter the verification queue.'
                                : 'Your Founding Member application has been securely transmitted to our review team.'
                            }
                        </p>

                        {!loading && isPendingPayment ? (
                            <Link href="/payment-init" className="w-full mb-4">
                                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 border border-amber-500/50 text-white font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.2)] group/btn">
                                    <FaCreditCard className="text-lg" />
                                    Complete Verification
                                    <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        ) : (
                            <div className="w-full bg-slate-950/50 rounded-2xl p-6 border border-white/5 mb-8 text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <FaShieldAlt className="text-6xl text-white" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Next Steps</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mt-0.5 flex-shrink-0">
                                            <FaClock className="text-xs" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-sm">Review in Progress</div>
                                            <div className="text-slate-500 text-xs mt-1">Our team validates all IATA/CLIA credentials manually.</div>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-500 mt-0.5 flex-shrink-0">
                                            <FaCheckCircle className="text-xs" />
                                        </div>
                                        <div>
                                            <div className="text-slate-400 font-bold text-sm">Access Grant</div>
                                            <div className="text-slate-600 text-xs mt-1">You will receive an activation email upon approval.</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        )}

                        <Link href="/" className="w-full mb-3">
                            <button className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all duration-200 flex items-center justify-center gap-2 group/btn">
                                Return to Command Center <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </Link>

                        <button
                            onClick={async () => {
                                await supabase.auth.signOut()
                                window.location.href = '/'
                            }}
                            className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                            Sign Out Account
                        </button>
                    </div>
                </div>

                <p className="text-center text-[10px] text-slate-600 mt-8 font-medium">
                    Queue ID: #{queueId ?? '-----'} &bull; ArkAlliance Secure Protocol
                </p>
            </div>
        </div>
    )
}
