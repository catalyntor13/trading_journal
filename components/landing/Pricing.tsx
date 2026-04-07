"use client"

import { motion } from "framer-motion"


const Pricing = () => {

  return (
    <section id="pricing" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Pricing Area</h2>

        </div>

        <div className="grid md:grid-cols-1 gap-8 max-w-xl mx-auto">

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="p-8 rounded-3xl border-2 border-orange-500 bg-slate-900 relative shadow-2xl shadow-orange-500/10"
          >
            <div className="absolute -top-4 right-8 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Recommended</div>
            <h3 className="text-white text-xl font-bold mb-2">PRO</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">$20</span>
              <span className="text-slate-500">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 text-slate-200">
              <li className="flex items-center gap-2">✓ Unlimited Trades</li>
              <li className="flex items-center gap-2">✓ Advanced Analytics</li>
              <li className="flex items-center gap-2">✓ Psychologial Bias Detection</li>
              <li className="flex items-center gap-2">✓ Trade Mentor</li>
            </ul>
            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all">Go Pro Now</button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Pricing