'use client'

import React from 'react'
import { FaShieldAlt, FaHandshake, FaCoins } from 'react-icons/fa'

const HowItWorks = () => {
    const steps = [
        { icon: FaShieldAlt, title: "1. Verified Access", desc: "Strict vetting ensures only legitimate suppliers and active agents enter the ecosystem.", color: "blue" },
        { icon: FaHandshake, title: "2. Direct Connection", desc: "No middlemen. Chat, negotiate, and agree on rates directly using our secure comms suite.", color: "amber" },
        { icon: FaCoins, title: "3. Instant Transact", desc: "One-click payments and contract generation. Get paid faster and book confidently.", color: "emerald" }
    ]

    return (
        <section className="py-24 px-4 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Streamlined Success</h2>
                    <p className="text-slate-200 font-medium drop-shadow-sm">The modern way to transact in the travel industry.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((item, i) => (
                        <div key={i} className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform ${item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                                item.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                <item.icon />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-slate-300 font-medium leading-relaxed drop-shadow-sm group-hover:text-slate-100 transition-colors">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
