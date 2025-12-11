"use client"

import { Zap } from "lucide-react"
const Footer = () => {

  return (
     <footer className="border-t border-slate-800/50 bg-slate-950 py-12 mt-auto relative z-10">
    <div className="lg:w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 ">

        <div className="lg:col-span-2">

          {/* Logo */}
                <div className='flex items-center gap-2 cursor-pointer select-none'>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
      <Zap className="w-5 h-5 text-white fill-white" />
    </div>
    <span className="font-bold text-xl tracking-tight text-white">
      Thread<span className="text-violet-400">Tube</span>
    </span>
  </div>

   {/* Logo */}
          <p className="mt-4 text-slate-400 max-w-sm leading-relaxed text-sm">
      
            Transforming long-form content into viral social media threads using advanced AI. Built for creators, by creators.
          </p>
        </div>
        <div className="col-span-1">
          <h4 className="font-semibold text-white mb-4 text-sm">Product</h4>
          <ul className="space-y-2 text-slate-400 text-xs">
            <li className="hover:text-violet-400 cursor-pointer">Pricing</li>
            <li className="hover:text-violet-400 cursor-pointer">Changelog</li>
          </ul>
        </div>
        <div className="col-span-1">
          <h4 className="font-semibold text-white mb-4 text-sm">Legal</h4>
          <ul className="space-y-2 text-slate-400 text-xs">
            <li className="hover:text-violet-400 cursor-pointer">Privacy</li>
            <li className="hover:text-violet-400 cursor-pointer">Terms</li>
          </ul>
        </div>
        
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400 text-xs lg:text-sm">
        © 2025 ThreadTube Inc. All rights reserved.
      </div>
    </div>
  </footer>
  )
}

export default Footer