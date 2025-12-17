'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { FiLogOut } from 'react-icons/fi'

interface PortalHeaderProps {
    userEmail: string | undefined
}

export default function PortalHeader({ userEmail }: PortalHeaderProps) {
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/auth/agent')
    }

    return (
        <div className="fixed top-24 right-0 z-50 p-6 w-full flex justify-end pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-white/50 flex items-center gap-4 pointer-events-auto transition-all hover:shadow-xl hover:bg-white">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Logged in as</span>
                    <span className="text-sm font-bold text-gray-800 leading-tight">
                        {userEmail}
                    </span>
                </div>

                <div className="h-8 w-px bg-gray-200 mx-1"></div>

                <button
                    onClick={handleLogout}
                    className="group bg-gray-50 hover:bg-red-50 p-2 rounded-full transition-colors duration-200"
                    title="Logout"
                >
                    <FiLogOut className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-colors" />
                </button>
            </div>
        </div>
    )
}
