"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client"; // Presupunem că folosești clientul Better-Auth
import { useRouter } from "next/navigation";

export default function SubscribePage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // 1. Verificăm dacă userul este logat pe partea de client
    // Dacă nu e logat, îl trimitem la login înainte să vadă prețul
    const session = authClient.useSession();

    useEffect(() => {
        if (session.isPending) return;
        if (!session.data) {
            // Îl trimitem la login și îi spunem să se întoarcă aici după
            router.push("/login?callbackUrl=/subscribe");
        }
    }, [session, router]);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            // Apelăm API-ul nostru de checkout
            const response = await fetch("/api/billing/checkout", { method: "POST" });
            const data = await response.json();

            if (data.checkoutUrl) {
                // Trimitem userul pe pagina securizată Mollie
                window.location.href = data.checkoutUrl;
            }
        } catch (err) {
            console.error("Eroare la checkout:", err);
            setIsLoading(false);
        }
    };

    if (session.isPending) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 relative overflow-hidden px-4">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full"></div>

            <div className="p-8 rounded-3xl border-2 border-orange-500 bg-slate-900 relative shadow-2xl shadow-orange-500/10 max-w-sm w-full z-10">
                <div className="absolute -top-4 right-8 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Recommended</div>
                <h1 className="text-white text-2xl font-bold mb-2">PRO Plan</h1>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black text-white">20$</span>
                    <span className="text-slate-500 text-lg font-normal"> / month</span>
                </div>

                <ul className="space-y-4 mb-8 text-slate-300">
                    <li className="flex items-center gap-2">✓ Unlimited Trades</li>
                    <li className="flex items-center gap-2">✓ Advanced  Analytics</li>
                    <li className="flex items-center gap-2">✓ Psychological Bias Detection</li>
                    <li className="flex items-center gap-2">✓ Trading Mentor</li>
                </ul>

                <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50"
                >
                    {isLoading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div> : "Pay now"}
                </button>
            </div>
        </div>
    );
}