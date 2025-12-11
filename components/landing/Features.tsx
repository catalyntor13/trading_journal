"use client"

import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card"
import { Zap, Type, Share2 } from "lucide-react"
 

const Features = () => {

 const benefitItems = [
  { name: 'Smart Context', description: `It doesn't just transcribe. It understands nuances, jokes, and key points of the video`, icon: Zap, background: "bg-amber-400/10", color: 'text-amber-400'},
  { name: 'Viral Hooks', description: `Automatically generates 3 'Hook' variations that stop the scroll instantly.`, icon: Type, background: "bg-violet-400/10", color: 'text-violet-400'},
  { name: 'Auto-Formatting', description: `Numbers tweets, adds correct spacing, and relevant hashtags automatically`, icon: Share2, background: "bg-cyan-400/10", color: 'text-cyan-400'},
 ]

  return (
     <section className="container mx-auto px-6 py-24 border border-slate-800/50 bg-slate-950/30 backdrop-blur-sm">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-white mb-4">Why choose ThreadTube?</h2>
      <p className="text-slate-400 max-w-xl mx-auto">Built specifically for creators who want speed without sacrificing quality.</p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
       
       { benefitItems.map((item) => (
         <Card className={`group hover:-translate-y-1 bg-slate-900/50 hover:border-violet-500/30 hover:bg-slate-800/50 duration-300 cursor-pointer`} key={item.name}>
            <CardTitle className={`flex flex-col px-6 gap-2 text-white`}>
               <div className={`w-14 h-14 rounded-2xl mb-3 ${item.background} flex items-center justify-center group-hover:scale-110 transition-transform`}>
    <item.icon className={`w-7 h-7  ${item.color}`}/>
               </div>
          
              {item.name}
            </CardTitle>
            <CardContent className='text-slate-400'>
              {item.description}
            </CardContent>  
         </Card>
       ))}

    </div>
  </section>
  )
}

export default Features