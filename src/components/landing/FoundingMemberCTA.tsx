'use client'

import React from 'react'
import Link from 'next/link'

const FoundingMemberCTA = () => {
    return (
        <section className="py-24 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="relative rounded-3xl overflow-hidden p-8 md:p-16 text-center border border-amber-500/30">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 to-slate-950 z-0" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0" />

                    <div className="relative z-10 space-y-6">
                        <span className="inline-block px-4 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-sm mb-2">
                            LIMITED TIME OFFER
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white">
                            Become a Founding Member
                        </h2>
                        <p className="text-xl text-slate-100 max-w-2xl mx-auto font-medium drop-shadow-md">
                            Lock in the exclusive rate of <span className="text-amber-400 font-bold">$30/month</span> for a full year. No payment required for trial.
                        </p>
                        <div className="pt-6">
                            <Link href="/auth/register">
                                <button className="px-10 py-5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xl rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all transform hover:scale-105">
                                    Claim Early Bird Status
                                </button>
                            </Link>
                        </div>
                        <p className="text-sm text-slate-300 font-semibold mt-4 drop-shadow-md">
                            Only 15 spots left in this batch.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FoundingMemberCTA
