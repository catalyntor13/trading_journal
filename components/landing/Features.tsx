"use client"



const Features = () => {

  const feats = [
    { title: "Trade Mentor", desc: "Get instant feedback on your hidden flaws—like a high win rate but a terrible Risk:Reward—so you can fix your math and stop bleeding capital.", icon: "🎯" },
    { title: "Strategy Performance", desc: "Track your strategy performance and compare your setups side-by-side to uncover exactly which strategy actually prints money and which one is secretly draining your account.", icon: "🧠" },
    { title: "Smart Statistics", desc: "See your true stats and go beyond a basic P&L. Get institutional-grade clarity on your true Edge with advanced metrics like Profit Factor, Sharpe Ratio, and Net Profit. Trade with mathematical confidence", icon: "📊" },
  ];

  return (
    <section id="features" className="py-24 bg-slate-950 px-6">
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