"use client"



const Features = () => {

  const feats = [
    { title: "SMC Logic", desc: "Tag-uri automate pentru BOS, CHoCH și FVG la fiecare trade.", icon: "🚀" },
    { title: "Psychology Log", desc: "Monitorizează-ți starea emoțională și elimină Overtrading-ul.", icon: "🧠" },
    { title: "Smart Statistics", desc: "Calcul instantaneu de R:R, Win Rate și Drawdown.", icon: "📊" },
  ];

  return (
    <section className="py-24 bg-slate-950 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {feats.map((f) => (
            <div key={f.title} className="group p-10 rounded-3xl bg-white/5 border border-white/5 hover:border-orange-500/50 transition-all duration-500">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

 
  
}

export default Features