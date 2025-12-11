"use client"

import { 
  Sparkles, 
  ArrowRight, 
  Link as LinkIcon, 
  CheckCircle2, 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="container mx-auto px-6 pt-32 pb-24 relative flex flex-col items-center text-center bg-violet-500/10 border border-violet-500/20">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8 animate-fade-in-up">
      <Sparkles className="w-4 h-4" />
      <span className="font-medium text-slate-200">Powered by GPT-4o & Claude 3.5</span>
    </div>

    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] max-w-5xl bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400">
      Turn any YouTube video into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">viral Thread </span>
    </h1>

    <p className="text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed font-light">
    Stop wasting hours writing. Our advanced AI extracts the essence and gold from your favorite videos in less than 30 seconds
    </p>

    <div className="w-full max-w-2xl relative group z-10">
      <div className="absolute -inset-7 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
      <div className="relative flex items-center bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 pr-3 shadow-2xl">
        <div className="pl-4 pr-3 text-slate-500">
          <LinkIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Paste YouTube Link (ex: https://youtu.be/...)"
          className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-slate-200 h-12 text-lg text-white w-full"
        />
        <Button className="h-12 px-8 rounded-xl cursor-pointer">
          Generate
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <p className="mt-4 text-sm text-slate-500 flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-slate-200" />
        No credit card required for first 3 videos
      </p>
    </div>
  </div>
  )
}

export default Hero