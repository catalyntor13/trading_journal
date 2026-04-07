"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
    const router = useRouter();

    useEffect(() => {
        // Așteptăm 5 secunde pentru a lăsa Webhook-ul să proceseze datele
        const timer = setTimeout(() => {
            router.push("/dashboard");
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-slate-950 text-center px-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full"></div>

            <div className="z-10 bg-slate-900/40 backdrop-blur-sm border border-white/5 p-12 rounded-3xl flex flex-col items-center shadow-2xl max-w-sm w-full">
                <div className="bg-orange-500/20 p-4 rounded-full mb-6 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                    <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Payment successful!</h1>
                <p className="text-slate-400 mt-2">We're setting up your PRO profile. Redirecting you immediately...</p>
                <div className="mt-8 animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        </div>
    );
}