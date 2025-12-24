'use client'

import FeatureWishlist from '@/components/feedback/FeatureWishlist'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-[#0f111a] pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto mb-8">
                <Link href="/portal" className="inline-flex items-center text-white/50 hover:text-white transition-colors mb-6 text-sm">
                    <FaArrowLeft className="mr-2" /> Back to Search
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2">Community & Roadmap</h1>
                <p className="text-white/60">Vote on features and help shape the future of Voyage Bridge.</p>
            </div>

            <FeatureWishlist />
        </div>
    )
}
