"use client"

const HowWorks = () => {

  const steps = [
    {
      number: "01",
      title: "Sync Your Mission",
      desc: "Conectează-ți contul sau setează-ți parametrii de risc. Definește-ți strategiile SMC preferate pentru a le avea pregătite de journaling.",
      icon: "📡"
    },
    {
      number: "02",
      title: "Precision Logging",
      desc: "După fiecare trade, bifează tag-urile de lichiditate (BOS, CHoCH, FVG) și starea emoțională. Durează sub 30 de secunde.",
      icon: "✍️"
    },
    {
      number: "03",
      title: "Data Analysis",
      desc: "Motorul nostru procesează datele și îți arată unde pierzi bani: e vorba de setup-ul tehnic sau de psihologia ta?",
      icon: "🔍"
    },
    {
      number: "04",
      title: "Scale to Orbit",
      desc: "Elimină erorile repetitive și concentrează-te pe setup-urile cu win-rate mare. Urmărește-ți curba de equity cum crește constant.",
      icon: "📈"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Decorative Light Effect */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-orange-500 font-bold tracking-[0.3em] uppercase text-xs mb-4">The Protocol</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-white">How Mars Works</h3>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                {/* Number Circle */}
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mb-6 group-hover:border-orange-500/50 transition-all duration-500 shadow-xl relative">
                  <span className="text-orange-500 font-black text-xl">{step.number}</span>
                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 rounded-full bg-orange-500/0 group-hover:bg-orange-500/10 blur-md transition-all"></div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm group-hover:bg-white/[0.08] transition-all">
                  <div className="text-3xl mb-4">{step.icon}</div>
                  <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action for Steps */}
        <div className="mt-20 flex justify-center">
          <div className="p-1 rounded-full bg-gradient-to-r from-orange-500/20 to-transparent">
             <button className="px-8 py-3 bg-slate-950 text-white rounded-full border border-orange-500/30 hover:border-orange-500 transition-all flex items-center gap-3 group">
               Start Your First Mission 
               <span className="group-hover:translate-x-1 transition-transform">→</span>
             </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowWorks