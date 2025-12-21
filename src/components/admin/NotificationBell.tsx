'use client'

import { FaBell } from 'react-icons/fa'

export default function NotificationBell() {
    return (
        <button
            onClick={() => alert('Work in Progress')}
            className="relative p-2 text-white/60 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
        >
            <FaBell />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F172A]"></span>
        </button>
    )
}
