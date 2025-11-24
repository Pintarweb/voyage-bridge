import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { FaBuilding, FaGlobeAmericas, FaUserTie } from 'react-icons/fa'

export default async function Home() {
  const supabase = await createClient()

  // Fetch stats
  const { data: stats } = await supabase.rpc('get_landing_stats')

  const supplierCount = stats?.suppliers || 0
  const productCount = stats?.products || 0
  const agentCount = stats?.agents || 0

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-8 py-6 flex justify-between items-center border-b border-white/10">
        <div className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          VoyageBridge
        </div>
        <div className="flex gap-6 text-sm font-medium text-gray-400">
          <Link href="/auth/supplier" className="hover:text-white transition-colors">Supplier Access</Link>
          <Link href="/auth/agent" className="hover:text-white transition-colors">Agent Access</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-black to-black z-0" />

        <div className="z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-sm font-medium mb-4">
            Exclusive B2B Tourism Portal
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            The Global Bridge for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Premium Travel Trade</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Connect directly with verified suppliers and access exclusive inventory.
            A closed ecosystem for professional travel agents.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/auth/agent"
              className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105"
            >
              Travel Agent Access
            </Link>
            <Link
              href="/auth/supplier"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-all"
            >
              Supplier Access
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/10 bg-white/5 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-4xl font-bold text-teal-400 mb-2">{supplierCount || 0}+</div>
            <div className="text-gray-400 flex items-center justify-center gap-2">
              <FaBuilding /> Verified Suppliers
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-4xl font-bold text-blue-400 mb-2">{productCount || 0}+</div>
            <div className="text-gray-400 flex items-center justify-center gap-2">
              <FaGlobeAmericas /> Active Products
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-4xl font-bold text-purple-400 mb-2">{agentCount || 0}+</div>
            <div className="text-gray-400 flex items-center justify-center gap-2">
              <FaUserTie /> Partner Agents
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
