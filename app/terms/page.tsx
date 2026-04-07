
import Footer from "@/components/landing/Footer";

export default function TermsPage() {
    return (
        <div className="bg-slate-950 min-h-screen text-slate-300 selection:bg-orange-500/30">


            <main className="max-w-4xl mx-auto pt-32 pb-24 px-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Terms and Conditions</h1>
                    <p className="text-slate-500 mb-10 pb-6 border-b border-slate-800">Last updated: 25 March 2026</p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                            <span className="bg-orange-500/10 text-orange-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            Acceptance of Terms
                        </h2>
                        <p className="leading-relaxed text-slate-400">
                            By accessing and using <strong>MARS Trading Journal</strong>, operated by <strong>IDTORO SRL</strong>, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our service.
                        </p>
                    </section>

                    <section className="mb-10 bg-slate-950/80 border border-red-500/20 p-6 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                        <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            2. NO FINANCIAL ADVICE (Disclaimer of Liability)
                        </h2>
                        <h3 className="text-red-400 font-semibold mb-3">THIS IS STRICTLY A DATA LOGGING AND ANALYTICS TOOL.</h3>
                        <p className="leading-relaxed text-slate-400 mb-3">
                            <strong>MARS Trading Journal</strong> and its creators are NOT financial advisors. The metrics, calculations, and &quot;Trade Mentor&quot; features provided by the application are for informational and educational purposes only. We do not recommend buying, selling, or holding any financial instruments.
                        </p>
                        <p className="leading-relaxed text-slate-400">
                            Trading in financial markets (Forex, Crypto, Stocks) involves a high degree of risk. <strong className="text-white">You are solely responsible for your trading decisions.</strong> We are not liable for any financial losses, account liquidations, or damages resulting from the use of our software, calculations, or bugs within the application.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                            <span className="bg-orange-500/10 text-orange-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                            Subscriptions and Payments
                        </h2>
                        <p className="leading-relaxed text-slate-400">
                            Premium features are billed on a subscription basis via our merchant of record, Polar. By subscribing, you agree to Polar&apos;s terms of service. You may cancel your subscription at any time. We do not offer refunds for partial months of service.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                            <span className="bg-orange-500/10 text-orange-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                            User Data and Content
                        </h2>
                        <p className="leading-relaxed text-slate-400">
                            You are responsible for the accuracy of the manual trade data you input. We reserve the right to suspend or terminate accounts that attempt to abuse our systems, inject malicious code, or violate our terms.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                            <span className="bg-orange-500/10 text-orange-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                            Service Availability
                        </h2>
                        <p className="leading-relaxed text-slate-400">
                            While we strive for extreme speed and 99.9% uptime, <strong>MARS Trading Journal</strong> is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We are not liable for temporary downtimes caused by server upgrades or third-party outages (e.g., Vercel, Neon).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                            <span className="bg-orange-500/10 text-orange-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                            Contact
                        </h2>
                        <p className="leading-relaxed text-slate-400">
                            For any questions regarding these terms, contact us at: <a href="mailto:torobuisnessro@yahoo.com" className="text-orange-400 hover:text-orange-300 transition-colors">torobuisnessro@yahoo.com</a>
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}