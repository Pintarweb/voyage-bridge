'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
            <div className="relative w-64 h-64 mb-8 animate-pulse">
                {/* You can replace this with a specific construction illustration if available */}
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl"></div>
                <Image
                    src="/ark-logo-icon.jpg"
                    alt="ArkAlliance Logo"
                    width={200}
                    height={200}
                    className="relative z-10 w-full h-full object-contain opacity-80"
                />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                Work in Progress
            </h1>

            <p className="text-lg text-muted-foreground max-w-md mb-8">
                We apologize for the inconvenience. This specific page is currently under construction as we build out the full Ark Alliance ecosystem.
            </p>

            <div className="flex gap-4">
                <Link
                    href="/"
                    className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/25"
                >
                    Return Home
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-3 rounded-lg border-2 border-border hover:bg-muted transition-all font-medium"
                >
                    Go Back
                </button>
            </div>
        </div>
    )
}
