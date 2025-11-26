import GlobalHeader from '@/components/layout/GlobalHeader'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { FaBuilding, FaGlobeAmericas, FaUserTie, FaMapMarkedAlt, FaHandshake, FaPlaneDeparture } from 'react-icons/fa'
import TourismBackground from '@/components/ui/TourismBackground'

export default async function Home() {
  const supabase = await createClient()

  // Fetch stats
  const { data: stats } = await supabase.rpc('get_landing_stats')

  const supplierCount = stats?.suppliers || 0
  const productCount = stats?.products || 0
  const agentCount = stats?.agents || 0

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navbar */}
      <GlobalHeader type="public" />

      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Abstract Tourism Background */}
        <TourismBackground />

        <div className="z-10 max-w-5xl mx-auto space-y-6 relative">
          <div className="inline-block px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm text-rose-600 font-bold tracking-wide uppercase text-[10px] md:text-sm mb-2 animate-fade-in-up">
            The Future of B2B Travel
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm leading-tight">
            Connect. Trade. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500">
              Explore the World.
            </span>
          </h1>
          <p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light px-4">
            The premium ecosystem where verified global suppliers and elite travel agents build profitable partnerships.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 md:pt-10 px-4">
            <Link
              href="/auth/agent"
              className="group relative px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-base md:text-lg rounded-xl shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 transition-all transform hover:-translate-y-1 overflow-hidden w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Trading <FaPlaneDeparture />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <Link
              href="/auth/supplier"
              className="group px-6 py-3 md:px-8 md:py-4 bg-white text-slate-800 font-bold text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-slate-200 w-full sm:w-auto"
            >
              For Suppliers
            </Link>
          </div>
        </div>
      </section>

      {/* 3D Vibrant Stats Section */}
      <section className="pb-20 pt-4 relative z-10 -mt-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Stat Card 1 */}
            <div className="relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative bg-white rounded-3xl p-8 border border-white/50 shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] transform transition-all duration-500 hover:rotate-y-6 hover:scale-105 flex flex-col items-center text-center h-full justify-center">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <FaBuilding className="text-4xl text-blue-500" />
                </div>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-cyan-500 mb-2">
                  {supplierCount || 0}+
                </div>
                <div className="text-lg font-bold text-slate-600 uppercase tracking-wider">Verified Suppliers</div>
                <p className="text-slate-400 text-sm mt-2">Global partners ready to connect</p>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-orange-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative bg-white rounded-3xl p-8 border border-white/50 shadow-[0_20px_50px_rgba(244,_63,_94,_0.15)] transform transition-all duration-500 hover:rotate-y-6 hover:scale-105 flex flex-col items-center text-center h-full justify-center">
                <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <FaMapMarkedAlt className="text-4xl text-rose-500" />
                </div>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-rose-600 to-orange-500 mb-2">
                  {productCount || 0}+
                </div>
                <div className="text-lg font-bold text-slate-600 uppercase tracking-wider">Active Products</div>
                <p className="text-slate-400 text-sm mt-2">Exclusive deals and packages</p>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative bg-white rounded-3xl p-8 border border-white/50 shadow-[0_20px_50px_rgba(139,_92,_246,_0.15)] transform transition-all duration-500 hover:rotate-y-6 hover:scale-105 flex flex-col items-center text-center h-full justify-center">
                <div className="w-20 h-20 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <FaHandshake className="text-4xl text-violet-500" />
                </div>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-600 to-purple-500 mb-2">
                  {agentCount || 0}+
                </div>
                <div className="text-lg font-bold text-slate-600 uppercase tracking-wider">Partner Agents</div>
                <p className="text-slate-400 text-sm mt-2">Trusted professionals worldwide</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
