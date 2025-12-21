'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
    const router = useRouter()
    const supabase = createClient()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center space-x-2 p-2 rounded bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <span>🚪</span>
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
    )
}
