"use client"

import { Button } from "@/components/ui/button"
import { 


CheckCircle2, 

} from "lucide-react";

const Pricing = () => {
  return (
   <section className="container mx-auto px-6 py-24 border-t border-slate-800/50 bg-slate-950/30">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-white mb-4">Simple Pricing
</h2>
      <p className="text-slate-400">Start for free, upgrade only if you love it.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Free Plan */}
      <div className="p-8 rounded-3xl bg-slate-900/20 border border-slate-800 flex flex-col">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-slate-300">Starter</h3>
          <div className="text-4xl font-bold text-white mt-4">$0 <span className="text-lg font-normal text-slate-500">/ forever</span></div>
          <p className="text-slate-400 text-sm mt-2">Perfect for testing the waters.

</p>
        </div>
        <ul className="space-y-4 mb-8 flex-1">
          {['3 Video-uri gratuite', 'Formatare Basic', 'Doar Thread-uri Twitter'].map((feat, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
              <CheckCircle2 className="w-4 h-4 text-slate-500" /> {feat}
            </li>
          ))}
        </ul>
        <Button variant="secondary" className="w-full">Începe Gratuit</Button>
      </div>

      {/* Pro Plan */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-violet-500/30 relative flex flex-col">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg">
          Most Popular
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white">Creator Pro</h3>
          <div className="text-4xl font-bold text-white mt-4">$9 <span className="text-lg font-normal text-slate-500">/ lună</span></div>
          <p className="text-slate-400 text-sm mt-2">Pentru creatori serioși.</p>
        </div>
        <ul className="space-y-4 mb-8 flex-1">
          {['50 Video-uri / lună', 'LinkedIn & Newsletter', 'Arhivă nelimitată', 'Prioritate la procesare'].map((feat, i) => (
            <li key={i} className="flex items-center gap-3 text-white text-sm">
              <CheckCircle2 className="w-4 h-4 text-violet-400" /> {feat}
            </li>
          ))}
        </ul>
        <Button className="w-full">Upgrade to Pro</Button>
      </div>
    </div>
  </section>
  )
}

export default Pricing