'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { FaSatelliteDish } from 'react-icons/fa'

interface MissionLogProps {
    refreshTrigger?: number
}

const MissionLog: React.FC<MissionLogProps> = ({ refreshTrigger = 0 }) => {
    const [userRequests, setUserRequests] = useState<any[]>([])
    const [loadingRequests, setLoadingRequests] = useState(true)

    const fetchRequests = useCallback(async () => {
        const supabase = createClient()
        const { data } = await supabase
            .from('product_requests')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setUserRequests(data)
        setLoadingRequests(false)
    }, [])

    useEffect(() => {
        fetchRequests()
    }, [fetchRequests, refreshTrigger])

    return (
        <section className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FaSatelliteDish className="text-slate-400" /> Your Mission Log
            </h3>
            {loadingRequests ? (
                <div className="text-white/30 text-xs animate-pulse">Scanning frequency...</div>
            ) : userRequests.length > 0 ? (
                <div className="space-y-3">
                    {userRequests.map(req => (
                        <div key={req.id} className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-xl hover:border-white/10 transition-colors group">
                            <div>
                                <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{req.destination}</div>
                                <div className="text-xs text-slate-300">{req.category} • {req.budget || 'No budget spec'}</div>
                            </div>
                            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${req.status === 'pending' ? 'border-amber-500/20 text-amber-400 bg-amber-500/10' :
                                req.status === 'completed' ? 'border-green-500/20 text-green-400 bg-green-500/10' :
                                    'border-white/10 text-slate-400 bg-white/5'
                                }`}>
                                {req.status}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-6 border border-dashed border-white/10 rounded-xl text-center text-xs text-white/30">
                    No active requests initiated. Start a new mission above.
                </div>
            )}
        </section>
    )
}

export default MissionLog
