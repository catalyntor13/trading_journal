
import Footer from "@/components/landing/Footer";

export default function PrivacyPage() {
    return (
        <div className="bg-slate-950 min-h-screen text-slate-300 selection:bg-orange-500/30">


            <main className="max-w-4xl mx-auto pt-32 pb-24 px-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Privacy Policy</h1>
                    <p className="text-slate-500 mb-10 pb-6 border-b border-slate-800">Last updated: 25 March 2026</p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                            <span className="bg-orange-500/10 text-orange-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            Introduction
                        </h2>
                        <p className="leading-relaxed text-slate-400">
                            Welcome to <strong>MARS Trading Journal</strong>. This Privacy Policy explains how <strong>IDTORO SRL</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects your personal information when you use our trading journal application. We are committed to ensuring your privacy is protected and compliant with the General Data Protection Regulation (GDPR).
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                            <span className="bg-orange-500/10 text-orange-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            Information We Collect
                        </h2>
                        <p className="leading-relaxed text-slate-400 mb-4">We collect the minimum amount of data necessary to provide our services:</p>
                        <ul className="space-y-3 list-none pl-4">
                            <li className="text-slate-400 flex items-start">
                                <span className="text-orange-500 mr-2 mt-1">•</span>
                                <div><strong className="text-slate-200">Account Data:</strong> Name, email address, and passwords (securely hashed and handled via Better-Auth and Google OAuth).</div>
                            </li>
                            <li className="text-slate-400 flex items-start">
                                <span className="text-orange-500 mr-2 mt-1">•</span>
                                <div><strong className="text-slate-200">Trading Data:</strong> Manual trade entries, metrics, and links to external chart images (e.g., TradingView) that you manually input into the platform.</div>
                            </li>
                            <li className="text-slate-400 flex items-start">
                                <span className="text-orange-500 mr-2 mt-1">•</span>
                                <div><strong className="text-slate-200">Usage Data:</strong> Anonymous analytics data (via Vercel Analytics) to help us improve page load speeds and user experience.</div>
                            </li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                            <span className="bg-orange-500/10 text-orange-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                            Third-Party Services
                        </h2>
                        <p className="leading-relaxed text-slate-400 mb-4">
                            We do not sell your data. We share your data only with essential third-party service providers to operate our app:
                        </p>
                        <ul className="space-y-3 list-none pl-4">
                            <li className="text-slate-400 flex items-start"><span className="text-orange-500 mr-2 mt-1">•</span><div><strong className="text-slate-200">Authentication:</strong> Better-Auth and Google OAuth.</div></li>
                            <li className="text-slate-400 flex items-start"><span className="text-orange-500 mr-2 mt-1">•</span><div><strong className="text-slate-200">Database & Hosting:</strong> Neon (PostgreSQL database) and Vercel.</div></li>
                            <li className="text-slate-400 flex items-start"><span className="text-orange-500 mr-2 mt-1">•</span><div><strong className="text-slate-200">Payments:</strong> Polar (we do not store your credit card information on our servers).</div></li>
                            <li className="text-slate-400 flex items-start"><span className="text-orange-500 mr-2 mt-1">•</span><div><strong className="text-slate-200">Transactional Emails:</strong> Resend.</div></li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                            <span className="bg-orange-500/10 text-orange-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                            Your Data, Your Rights (GDPR)
                        </h2>
                        <p className="leading-relaxed text-slate-400 mb-4">You own your trading data. Under GDPR, you have the right to:</p>
                        <ul className="space-y-3 list-none pl-4 mb-4">
                            <li className="text-slate-400 flex items-start"><span className="text-orange-500 mr-2 mt-1">•</span><div>Access the personal data we hold about you.</div></li>
                            <li className="text-slate-400 flex items-start"><span className="text-orange-500 mr-2 mt-1">•</span><div>Request correction of inaccurate data.</div></li>
                            <li className="text-slate-400 flex items-start"><span className="text-orange-500 mr-2 mt-1">•</span><div>Request deletion of all your data (Right to be Forgotten).</div></li>
                        </ul>
                        <p className="leading-relaxed text-slate-400">
                            To exercise these rights, please contact us at: <a href="mailto:torobuisnessro@yahoo.com" className="text-orange-400 hover:text-orange-300 transition-colors">torobuisnessro@yahoo.com</a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                            <span className="bg-orange-500/10 text-orange-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                            Cookies
                        </h2>
                        <p className="leading-relaxed text-slate-400">
                            We use essential cookies required for user authentication (session management via Better-Auth) and security. We do not use intrusive tracking or advertising cookies.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
