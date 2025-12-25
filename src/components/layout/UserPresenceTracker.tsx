'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function UserPresenceTracker() {
    const supabase = createClient()

    useEffect(() => {
        const trackPresence = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const channel = supabase.channel('online-users')

            channel
                .on('presence', { event: 'sync' }, () => {
                    // console.log('Presence synced', channel.presenceState())
                })
                .subscribe(async (status) => {
                    if (status === 'SUBSCRIBED') {
                        await channel.track({
                            user_id: user.id,
                            online_at: new Date().toISOString(),
                        })
                    }
                })
        }

        trackPresence()
    }, [supabase])

    return null
}
