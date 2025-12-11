"use client"

const HowWorks = () => {
  return (
    <section className="container mx-auto px-6 py-24 border-t border-slate-800/50">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-white mb-4">How it works?</h2>
      <p className="text-slate-400">Three simple steps from link to virality.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
      <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent -z-10"></div>
      
      {[
        { step: "01", title: "Copy & Paste", desc: "Copy the link of any YouTube video." },
        { step: "02", title: "AI Magic", desc: "Our engine analyzes and extracts the best ideas." },
        { step: "03", title: "Publish", desc: "Copy the formatted thread and post it." }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl font-bold text-white mb-6 shadow-xl relative z-10">
            {item.step}
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
          <p className="text-slate-400 text-sm max-w-[250px]">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
  )
}

export default HowWorks