"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Logo from "@/components/myComponents/Logo";

const features = [
    { icon: "📊", title: "Unlimited Trades", description: "Log every single trade without any restrictions" },
    { icon: "🔍", title: "Advanced Analytics", description: "Deep insights into your trading patterns and performance" },
    { icon: "🧠", title: "Psychological Bias Detection", description: "Identify emotional patterns affecting your decisions" },
    { icon: "🎯", title: "Trading Mentor", description: "AI-powered guidance to sharpen your trading edge" },
];

export default function SubscribePage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const session = authClient.useSession();

    useEffect(() => {
        if (session.isPending) return;
        if (!session.data) {
            router.push("/login?callbackUrl=/subscribe");
        }
    }, [session, router]);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/billing/checkout", { method: "POST" });
            const data = await response.json();

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        } catch (err) {
            console.error("Checkout error:", err);
            setIsLoading(false);
        }
    };

    if (session.isPending) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    const userName = session.data?.user?.name?.split(" ")[0] || "Trader";

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/8 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-red-600/6 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/3 blur-[200px] rounded-full pointer-events-none"></div>

            {/* Top navigation bar */}
            <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-slate-800/50">
                <button onClick={() => router.push("/")} className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                    <Logo />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xs font-bold">
                        {userName[0]?.toUpperCase()}
                    </div>
                    <span className="text-slate-400 text-sm hidden sm:block">{session.data?.user?.email}</span>
                </div>
            </nav>

            {/* Main content — two column layout */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-73px)] px-6 md:px-12 lg:px-20 py-12 gap-12 lg:gap-20 max-w-7xl mx-auto">

                {/* LEFT — Welcome message */}
                <div className="flex-1 max-w-lg text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-widest mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                        Almost There
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                        Welcome,{" "}
                        <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                            {userName}
                        </span>
                        ! 🚀
                    </h1>

                    <p className="text-slate-400 text-lg leading-relaxed mb-10">
                        You&apos;re one step away from unlocking the full power of MARS Trading Journal. Upgrade to <strong className="text-slate-200">PRO</strong> and take your trading to the next level.
                    </p>

                    {/* Features grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60 hover:border-orange-500/30 transition-colors group"
                            >
                                <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">{feature.icon}</span>
                                <div>
                                    <h3 className="text-white font-semibold text-sm mb-0.5">{feature.title}</h3>
                                    <p className="text-slate-500 text-xs leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT — PRO Plan card */}
                <div className="flex-shrink-0 w-full max-w-sm">
                    <div className="relative p-8 rounded-3xl border-2 border-orange-500/80 bg-slate-900/80 backdrop-blur-sm shadow-2xl shadow-orange-500/10">
                        {/* Badge */}
                        <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-orange-500/30">
                            Recommended
                        </div>

                        {/* Plan header */}
                        <div className="mb-6">
                            <h2 className="text-white text-xl font-bold mb-1">PRO Plan</h2>
                            <p className="text-slate-500 text-sm">Everything you need to trade better</p>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-1.5 mb-8 pb-8 border-b border-slate-800">
                            <span className="text-6xl font-black text-white">$20</span>
                            <span className="text-slate-500 text-lg">/ month</span>
                        </div>

                        {/* Features list */}
                        <ul className="space-y-4 mb-8">
                            {features.map((feature) => (
                                <li key={feature.title} className="flex items-center gap-3 text-slate-300">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </span>
                                    <span className="text-sm">{feature.title}</span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA button */}
                        <button
                            id="checkout-button"
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-base hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                            ) : (
                                <>
                                    Get Started Now
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Trust indicators */}
                        <div className="mt-6 flex items-center justify-center gap-4 text-slate-600 text-xs">
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                                Secure payment
                            </span>
                            <span className="w-0.5 h-3 bg-slate-800"></span>
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}