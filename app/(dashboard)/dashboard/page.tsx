import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Link as LinkIcon, 
  CheckCircle2, 
  Mail, 
  Twitter,
  PlayCircle,
  ChevronRight
} from "lucide-react";

export default function DashboardHome() {



    return (
        
 <div className="space-y-8 animate-in fade-in duration-500 bg-slate-900 h-full p-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-white">Create New Content</h2>
        <p className="text-slate-400 text-sm">Paste a URL and let AI do the heavy lifting.</p>
      </div>
    </div>

    {/* Generator Box */}
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl">
      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-slate-300 ml-1">YouTube URL</label>
        <div className="flex gap-3">
          <Input  placeholder="https://youtube.com/watch?v=..." />
          <Button variant="default" className="shrink-0 h-[46px]">
            <Sparkles className="w-4 h-4" /> Generate
          </Button>
        </div>
      </div>
      
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/50">
        {[
          { icon: Twitter, label: "Twitter Thread", active: true },
          { icon: LinkIcon, label: "LinkedIn Post", active: false },
          { icon: Mail, label: "Newsletter", active: false },
        ].map((opt, i) => (
          <button key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${opt.active ? 'bg-violet-500/10 border-violet-500/30 text-white' : 'bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
            <opt.icon className={`w-4 h-4 ${opt.active ? 'text-violet-400' : 'text-slate-500'}`} />
            <span className="text-sm font-medium">{opt.label}</span>
            {opt.active && <CheckCircle2 className="w-4 h-4 text-violet-500 ml-auto" />}
          </button>
        ))}
      </div>
    </div>

    {/* Recent Activity Mini-Table */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Recent Generations</h3>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {[
          { title: "How to Build a SaaS in 2024", type: "Twitter Thread", date: "2 mins ago", status: "Ready" },
          { title: "The Future of AI Marketing", type: "LinkedIn Post", date: "1 hour ago", status: "Ready" },
          { title: "Huberman Lab Summary", type: "Newsletter", date: "Yesterday", status: "Draft" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200 group-hover:text-white">{item.title}</div>
                <div className="text-xs text-slate-500">{item.type} • {item.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
       
              <button className="p-2 text-slate-500 hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
    )
    
}