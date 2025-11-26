import React from 'react'

export default function TourismBackground() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Gradient Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-orange-300/20 to-rose-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-gradient-to-tl from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl" />
            <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-gradient-to-bl from-yellow-200/30 to-amber-300/30 rounded-full blur-3xl" />

            {/* Geometric Shapes */}
            <div className="absolute top-[10%] left-[5%] w-32 h-32 border-8 border-rose-100/30 rounded-full animate-bounce delay-700 opacity-60" />
            <div className="absolute bottom-[15%] right-[10%] w-48 h-48 border-[12px] border-blue-100/30 rounded-full animate-bounce delay-1000 opacity-60" />
            <div className="absolute top-[40%] right-[20%] w-20 h-20 bg-gradient-to-r from-orange-200/40 to-amber-200/40 rotate-45 rounded-xl animate-spin-slow duration-[10s]" />
            <div className="absolute bottom-[20%] left-[15%] w-16 h-16 bg-gradient-to-r from-cyan-200/40 to-blue-200/40 rounded-full animate-ping delay-500" />

            {/* Dot Pattern Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
        </div>
    )
}
