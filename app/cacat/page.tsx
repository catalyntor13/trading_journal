'use client';

import React from 'react';
import {
    LayoutDashboard, Calendar as CalendarIcon, Users, MessageSquare,
    Briefcase, BookOpen, Settings, Search, Bell, Cloud, MoreHorizontal, Star
} from 'lucide-react';

export default function EduvoDashboard() {
    return (
        // Setăm un fundal foarte închis (Dark Blue/Black) specific designului
        <div className="min-h-screen bg-[#060B14] text-slate-200 font-sans p-4 md:p-6 flex gap-6">

            {/* --- Sidebar (Stânga) --- */}
            <aside className="hidden lg:flex flex-col w-64 bg-[#0A101C] rounded-2xl border border-slate-800/60 p-5 shrink-0 relative overflow-hidden">
                {/* Un glow subtil de fundal în meniu */}
                <div className="absolute top-0 left-0 w-full h-32 bg-cyan-500/5 blur-[80px] pointer-events-none" />

                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-wide text-white">Eduvo</span>
                </div>

                <nav className="flex flex-col gap-2">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                    <NavItem icon={<CalendarIcon size={20} />} label="Calendar" />
                    <NavItem icon={<Users size={20} />} label="Elevi" />
                    <NavItem icon={<MessageSquare size={20} />} label="Mesaje" />
                    <NavItem icon={<Briefcase size={20} />} label="Booking" />
                    <NavItem icon={<BookOpen size={20} />} label="Resurse" />
                    <NavItem icon={<Settings size={20} />} label="Setări" />
                </nav>
            </aside>

            {/* --- Main Content (Dreapta) --- */}
            <main className="flex-1 flex flex-col min-w-0 gap-6">

                {/* Topbar */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0A101C] p-4 rounded-2xl border border-slate-800/60">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Caută..."
                            className="w-full bg-[#111827] border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-4 self-end sm:self-auto">
                        <button className="relative text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0A101C]"></span>
                        </button>
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <Cloud size={20} />
                        </button>
                        <div className="w-9 h-9 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden ml-2">
                            <img src="https://i.pravatar.cc/150?img=47" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Greeting */}
                <div className="mt-2">
                    <h1 className="text-2xl md:text-3xl font-medium text-slate-300">
                        Bun venit, <span className="text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Profesor!</span>
                    </h1>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Coloana Stânga (Stats + Calendar) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#0A101C] border border-slate-800/60 rounded-2xl p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">Lecții Azi</p>
                                    <p className="text-3xl font-bold text-white">12</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                                    <CalendarIcon size={24} />
                                </div>
                            </div>
                            <div className="bg-[#0A101C] border border-slate-800/60 rounded-2xl p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">Mesaje</p>
                                    <p className="text-3xl font-bold text-white">8</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                                    <MessageSquare size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Calendar View */}
                        <div className="bg-[#0A101C] border border-slate-800/60 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-white">Calendar</h2>
                                <div className="flex bg-[#111827] rounded-lg p-1 border border-slate-800">
                                    <button className="px-4 py-1 text-sm rounded-md bg-slate-800 text-white font-medium shadow-sm">Zi</button>
                                    <button className="px-4 py-1 text-sm rounded-md text-slate-400 hover:text-white transition-colors">Săptămână</button>
                                    <button className="px-4 py-1 text-sm rounded-md text-slate-400 hover:text-white transition-colors">Lună</button>
                                </div>
                            </div>

                            {/* Styled Timeline Grid (Simplified representation) */}
                            <div className="relative h-64 border-l border-slate-800 ml-4 flex flex-col justify-between py-4">
                                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between opacity-20 pointer-events-none">
                                    {[...Array(5)].map((_, i) => <div key={i} className="w-full border-b border-slate-700 h-0"></div>)}
                                </div>

                                {/* Class Cards */}
                                <div className="relative h-full w-full ml-4">
                                    {/* Card Matematică */}
                                    <div className="absolute top-[0%] left-0 w-3/4 md:w-1/2 p-3 rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-500/20 to-transparent">
                                        <div className="w-1 h-full bg-orange-500 absolute left-0 top-0 rounded-l-xl"></div>
                                        <p className="font-bold text-white text-sm">Matematică</p>
                                        <p className="text-xs text-orange-300/80">10:00</p>
                                    </div>

                                    {/* Card Română */}
                                    <div className="absolute top-[30%] left-[10%] w-3/4 md:w-1/2 p-3 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-transparent">
                                        <div className="w-1 h-full bg-blue-500 absolute left-0 top-0 rounded-l-xl"></div>
                                        <p className="font-bold text-white text-sm">Română</p>
                                        <p className="text-xs text-blue-300/80">11:30</p>
                                    </div>

                                    {/* Card Engleză */}
                                    <div className="absolute top-[70%] left-0 w-1/3 p-3 rounded-xl border border-rose-500/30 bg-gradient-to-r from-rose-500/20 to-transparent">
                                        <div className="w-1 h-full bg-rose-500 absolute left-0 top-0 rounded-l-xl"></div>
                                        <p className="font-bold text-white text-sm">Engleză</p>
                                        <p className="text-xs text-rose-300/80">13:00</p>
                                    </div>

                                    {/* Card Evaluare */}
                                    <div className="absolute top-[80%] right-[10%] w-1/3 p-3 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 to-transparent">
                                        <div className="w-1 h-full bg-emerald-500 absolute left-0 top-0 rounded-l-xl"></div>
                                        <p className="font-bold text-white text-sm">Evaluare</p>
                                        <p className="text-xs text-emerald-300/80">17:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coloana Dreapta (Progres + Recenzii) */}
                    <div className="space-y-6">

                        {/* Progres Profil Circular */}
                        <div className="bg-[#0A101C] border border-slate-800/60 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                            {/* Ambient Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 blur-[60px] pointer-events-none" />

                            <div className="w-full flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-white z-10">Progres Profil</h2>
                            </div>

                            <div className="relative w-40 h-40 flex items-center justify-center z-10">
                                {/* SVG Circle Background */}
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" stroke="#1E293B" strokeWidth="8" fill="none" />
                                    {/* SVG Circle Progress (85% of 251 circumference = ~213) */}
                                    <circle
                                        cx="50" cy="50" r="40"
                                        stroke="url(#gradient)"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray="251"
                                        strokeDashoffset="38"
                                        className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#00F0FF" />
                                            <stop offset="100%" stopColor="#A855F7" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold text-white">85%</span>
                                </div>
                            </div>
                        </div>

                        {/* Recenzii */}
                        <div className="bg-[#0A101C] border border-slate-800/60 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-white">Recenzii</h2>
                                <button className="text-slate-400 hover:text-white"><MoreHorizontal size={20} /></button>
                            </div>

                            <div className="flex items-end gap-2 mb-6 border-b border-slate-800/80 pb-6">
                                <span className="text-5xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">4.9</span>
                                <div className="mb-1">
                                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                </div>
                                <span className="text-slate-400 mb-1 ml-1">(127)</span>
                            </div>

                            <div className="space-y-5">
                                {/* Review 1 */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-700">
                                        <img src="https://i.pravatar.cc/150?img=5" alt="Andreea" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">Andreea M.</h4>
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />)}
                                        </div>
                                    </div>
                                </div>

                                {/* Review 2 */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-700">
                                        <img src="https://i.pravatar.cc/150?img=11" alt="Vlad" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">Vlad S.</h4>
                                        <div className="flex gap-1 mt-1 mb-1.5">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />)}
                                        </div>
                                        <p className="text-sm text-slate-400">Recomand!</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

// Sub-componentă simplă pentru itemii din meniul lateral
function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <a href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${active
                ? 'bg-slate-800/50 text-cyan-400 border border-slate-700/50 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}>
            {icon}
            <span className="font-medium text-sm">{label}</span>
        </a>
    );
}