'use client';

import React from 'react';
import {
    Target, Brain, BarChart3, Satellite, PenTool,
    Search, TrendingUp, ArrowRight, Menu
} from 'lucide-react';

export default function MarsLandingPageWithBackground() {
    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-orange-500/30 overflow-hidden relative">

            {/* ================= BACKGROUND LAYERS ================= */}

            {/* Layer 1: Imaginea de fundal (Marte / Spațiu) */}
            {/* Folosim o imagine de stoc dramatică și o întunecăm semnificativ */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1636819488537-a9b1ffb315ce?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.0.3"
                    alt="Mars Trading Background"
                    className="w-full h-full object-cover opacity-40 blur-[2px] scale-105"
                />
                {/* Un overlay gradient puternic pentru a asigura contrastul textului */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/90 via-[#030712]/80 to-[#030712]"></div>
            </div>

            {/* Layer 2: Grafică subtilă de trading (Grid Overlay) */}
            {/* Adăugăm un model de grilă foarte fin pentru a da senzația de interfață tehnică */}
            <div
                className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Layer 3: Ambient Glows (Luminile Neon originale) */}
            {/* Acestea rămân peste imagine pentru a da efectul volumetric */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-600/20 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="absolute top-[30%] left-[-20%] w-[600px] h-[600px] bg-red-700/10 blur-[150px] rounded-full pointer-events-none z-0" />

            {/* ================= FOREGROUND CONTENT ================= */}

            {/* --- Navbar --- */}
            {/* Am crescut puțin opacitatea fundalului la navbar pentru separare mai bună */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto border-b border-slate-800/40 backdrop-blur-xl bg-[#030712]/60">
                <div className="flex items-center gap-2">
                    {/* Logo Marte */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-red-500 shadow-[0_0_20px_rgba(234,88,12,0.6)] flex items-center justify-center border border-orange-400/20">
                        <div className="w-6 h-1 border-t-2 border-white/50 rounded-full transform -rotate-12" />
                    </div>
                    <span className="text-xl font-bold tracking-widest text-white drop-shadow-md">MARS <span className="text-orange-500/80 font-medium">TRADING</span></span>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <a href="#" className="hover:text-orange-400 transition-colors">How it works</a>
                    <a href="#" className="hover:text-orange-400 transition-colors">Features</a>
                    <a href="#" className="hover:text-orange-400 transition-colors">Pricing</a>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4">
                    <button className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-full shadow-[0_0_25px_rgba(234,88,12,0.4)]">
                        Get Started
                    </button>
                    <button className="md:hidden text-slate-300">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6">

                {/* --- Hero Section --- */}
                <section className="pt-24 pb-32 flex flex-col items-center text-center relative">

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-950/30 mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(234,88,12,0.1)]">
                        <Satellite className="w-4 h-4 text-orange-400 mr-1" />
                        <span className="text-xs font-bold tracking-[0.2em] text-orange-300 uppercase">Mission Control for your Capital</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-extrabold text-white tracking-tight mb-8 max-w-5xl drop-shadow-xl leading-tight">
                        Trade with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 drop-shadow-[0_0_25px_rgba(234,88,12,0.5)]">Precision</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-12 leading-relaxed drop-shadow-sm">
                        Master your execution with the journal built for elite performance. Track trades, analyze psychology, and visualize your edge against the backdrop of the market data across the cosmos.
                    </p>

                    <button className="group relative px-8 py-4 bg-white text-slate-950 text-base font-bold rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all hover:scale-105 active:scale-95">
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-200 to-red-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center gap-2">
                            Start Journaling Sequence <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>

                    {/* Piețele (Markets) cu un look mai "tehnic" */}
                    <div className="mt-20 flex items-center justify-center gap-4 sm:gap-8 text-slate-400 font-medium tracking-widest uppercase text-sm border-t border-slate-800/50 pt-8 w-full max-w-md mx-auto">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" /> INDICES</span>
                        <span className="hidden sm:block text-slate-700">|</span>
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse delay-75" /> FOREX</span>
                        <span className="hidden sm:block text-slate-700">|</span>
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse delay-150" /> CRYPTO</span>
                    </div>
                </section>

                {/* --- Features Grid Section --- */}
                <section className="py-20 relative z-20">
                    {/* O linie subtilă de demarcație */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">

                        {/* Card 1 (Highlighted) */}
                        <div className="p-8 rounded-3xl bg-[#0A101C]/70 backdrop-blur-md border border-orange-500/40 shadow-[0_0_40px_rgba(234,88,12,0.1)] relative overflow-hidden group transition-all hover:-translate-y-2 hover:shadow-[0_0_60px_rgba(234,88,12,0.2)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Icon Glow */}
                            <div className="relative w-14 h-14 mb-8">
                                <div className="absolute inset-0 bg-orange-600/30 blur-[20px] rounded-full" />
                                <div className="relative w-full h-full bg-gradient-to-br from-orange-950 to-[#0A101C] rounded-2xl flex items-center justify-center border border-orange-500/30">
                                    <Target className="w-7 h-7 text-orange-400" />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4">Trade Mentor AI</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Get instant feedback on your hidden flaws—like a high win rate but a terrible Risk:Reward. Fix your math and stop bleeding capital.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="p-8 rounded-3xl bg-[#0A101C]/40 backdrop-blur-md border border-slate-800/60 hover:border-pink-500/40 transition-all hover:-translate-y-1 hover:bg-[#0A101C]/60 group">
                            <div className="relative w-14 h-14 mb-8">
                                <div className="absolute inset-0 bg-pink-600/20 blur-[20px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative w-full h-full bg-[#0A101C] rounded-2xl flex items-center justify-center border border-slate-700 group-hover:border-pink-500/30 transition-colors">
                                    <Brain className="w-7 h-7 text-pink-500" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Strategy Edge</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Track performance and compare setups side-by-side. Uncover exactly which strategy prints money and which is draining your account.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="p-8 rounded-3xl bg-[#0A101C]/40 backdrop-blur-md border border-slate-800/60 hover:border-cyan-500/40 transition-all hover:-translate-y-1 hover:bg-[#0A101C]/60 group">
                            <div className="relative w-14 h-14 mb-8">
                                <div className="absolute inset-0 bg-cyan-600/20 blur-[20px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative w-full h-full bg-[#0A101C] rounded-2xl flex items-center justify-center border border-slate-700 group-hover:border-cyan-500/30 transition-colors">
                                    <BarChart3 className="w-7 h-7 text-cyan-500" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Smart Statistics</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Go beyond basic P&L. Get institutional-grade clarity with advanced metrics like Profit Factor, Sharpe Ratio, and Expectancy.
                            </p>
                        </div>

                    </div>
                </section>
                {/* Spațiu extra jos pentru a vedea fundalul */}
                <div className="h-40"></div>
            </main>
        </div>
    );
}