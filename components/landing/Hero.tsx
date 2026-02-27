"use client"

import Link from 'next/link'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-slate-950">
      {/* Background with Mars Aesthetic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center opacity-40 grayscale-[30%]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-slate-950 to-transparent"></div>
      </div>

      <div className="container px-6 md:px-12 relative z-10">
        <div className="max-w-6xl flex flex-col items-center justify-center ">
          <div className="inline-block px-4 py-1.5 mb-6 border border-orange-500/30 rounded-full bg-orange-500/10 backdrop-blur-md">
            <span className="text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              The Next Frontier in Trading
            </span>
          </div>


          <div className="flex">
            <h1 className="text-4xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">Trade with</h1>
            <span className="text-4xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 ml-2">Precision</span>
          </div>


          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
            Master your execution with a journal built for clarity. Track your trades, visualize your account statistics, and continuously improve your strategy through data-backed insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link href="/login">
              <button className="px-10 cursor-pointer py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-xl shadow-white/5">
                Start Journaling
              </button>
            </Link>

          </div>

          <div className="mt-16 flex items-center gap-8 opacity-50 grayscale">
            {/* Simboluri piețe - Vizual doar */}
            <span className="text-white font-bold tracking-tighter text-xl italic">INDICIES</span>
            <span className="text-white font-bold tracking-tighter text-xl italic">FOREX</span>
            <span className="text-white font-bold tracking-tighter text-xl italic">CRYPTO</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero