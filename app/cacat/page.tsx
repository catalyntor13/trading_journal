import React from 'react';
import { Twitter, TrendingUp, Code, ArrowRight, Github, LineChart, Terminal } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">

            {/* Navbar Minimalist */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-800">
                <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
                    <Terminal className="text-blue-500" size={24} />
                    <span>NumeleTău<span className="text-blue-500">.dev</span></span>
                </div>
                <div className="flex gap-4">
                    <a href="https://twitter.com/contul_tau" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                        <Twitter size={24} />
                    </a>
                    <a href="https://github.com/contul_tau" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                        <Github size={24} />
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="container mx-auto px-6 py-24 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 border border-blue-500/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Building Trading App v1.0 in Public
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500">
                    Code Meets <span className="text-blue-500">Markets.</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
                    Sunt web developer și trader. Construiesc aplicații de trading de înaltă performanță și documentez absolut tot procesul pe Twitter. Învață din greșelile mele, folosește tool-urile mele și hai să batem piața împreună.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    {/* Buton stil shadcn (Primary) */}
                    <a href="https://twitter.com/contul_tau" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 py-2 gap-2 shadow-lg shadow-blue-900/20">
                        <Twitter size={18} />
                        Urmărește-mă pe Twitter
                    </a>

                    {/* Buton stil shadcn (Outline) */}
                    <a href="#proiecte" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-800 hover:bg-slate-900 hover:text-slate-100 h-12 px-8 py-2 gap-2">
                        Vezi ce construiesc
                        <ArrowRight size={18} />
                    </a>
                </div>
            </main>

            {/* Stats/Value Proposition */}
            <section className="border-y border-slate-800 bg-slate-900/50">
                <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <Code className="text-blue-500 mb-2" size={32} />
                        <h3 className="text-3xl font-bold">100%</h3>
                        <p className="text-slate-400 text-sm">Cod sursă deschis & documentat</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <TrendingUp className="text-emerald-500 mb-2" size={32} />
                        <h3 className="text-3xl font-bold">+24%</h3>
                        <p className="text-slate-400 text-sm">Win Rate îmbunătățit prin unelte proprii</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <LineChart className="text-purple-500 mb-2" size={32} />
                        <h3 className="text-3xl font-bold">Zilnic</h3>
                        <p className="text-slate-400 text-sm">Updates & insights pe Twitter</p>
                    </div>
                </div>
            </section>

            {/* Proiecte - Build in Public */}
            <section id="proiecte" className="container mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Unelte construite în public</h2>
                    <p className="text-slate-400 max-w-xl mx-auto">De la algoritmi de execuție la dashboard-uri de analiză a sentimentului. Urmărește dezvoltarea lor live.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* Card Proiect 1 - Stil shadcn */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950 text-slate-50 shadow p-6 hover:border-slate-700 transition-colors group">
                        <div className="flex flex-col space-y-1.5 mb-4">
                            <h3 className="font-semibold leading-none tracking-tight text-xl group-hover:text-blue-400 transition-colors">TradeJournal Pro</h3>
                            <p className="text-sm text-slate-400 pt-2">Aplicație web pentru monitorizarea automată a profitului și pierderilor prin API-uri de exchange.</p>
                        </div>
                        <div className="flex gap-2 mb-6">
                            <span className="inline-flex items-center rounded-full border border-slate-800 px-2.5 py-0.5 text-xs font-semibold bg-slate-900 text-slate-300">Next.js</span>
                            <span className="inline-flex items-center rounded-full border border-slate-800 px-2.5 py-0.5 text-xs font-semibold bg-slate-900 text-slate-300">Supabase</span>
                        </div>
                        <div className="flex items-center pt-0 mt-auto">
                            <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1">
                                Urmărește progresul (Ziua 14) <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Card Proiect 2 - Stil shadcn */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950 text-slate-50 shadow p-6 hover:border-slate-700 transition-colors group">
                        <div className="flex flex-col space-y-1.5 mb-4">
                            <h3 className="font-semibold leading-none tracking-tight text-xl group-hover:text-blue-400 transition-colors">Sentiment Algo</h3>
                            <p className="text-sm text-slate-400 pt-2">Un bot care analizează sentimentul pe Twitter pentru anumite tickere și trimite alerte pe Discord.</p>
                        </div>
                        <div className="flex gap-2 mb-6">
                            <span className="inline-flex items-center rounded-full border border-slate-800 px-2.5 py-0.5 text-xs font-semibold bg-slate-900 text-slate-300">Python</span>
                            <span className="inline-flex items-center rounded-full border border-slate-800 px-2.5 py-0.5 text-xs font-semibold bg-slate-900 text-slate-300">Tailwind</span>
                        </div>
                        <div className="flex items-center pt-0 mt-auto">
                            <a href="#" className="text-sm font-medium text-slate-400 flex items-center gap-1">
                                În curând...
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA / Newsletter */}
            <section className="container mx-auto px-6 py-24 mb-12">
                <div className="max-w-3xl mx-auto rounded-2xl border border-blue-900/50 bg-blue-950/20 p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">Fii parte din proces.</h2>
                    <p className="text-slate-400 mb-8 max-w-lg mx-auto">Abonează-te pentru a primi update-uri săptămânale despre codul scris, trade-urile executate și lecțiile învățate pe pielea mea.</p>

                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        {/* Input stil shadcn */}
                        <input
                            type="email"
                            placeholder="Adresa ta de email"
                            className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                        />
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-slate-50 text-slate-950 hover:bg-slate-200 h-10 px-4 py-2 whitespace-nowrap">
                            Abonează-te
                        </button>
                    </form>
                    <p className="text-xs text-slate-500 mt-4">Fără spam. Doar alpha despre tech & trading.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
                <p>© {new Date().getFullYear()} NumeleTău. Toate drepturile rezervate.</p>
            </footer>
        </div>
    );
}