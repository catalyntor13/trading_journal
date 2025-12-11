"use client"


import { Logo, SignOutButton } from "../myComponents/customComponents"
import { 

  LayoutDashboard,
  History,
  Settings,
  CreditCard,


  FileText,

} from "lucide-react";
import Link from "next/link"


export default function AsideNav() {


const asideItems = [
 
    { name: "Generator", icon: LayoutDashboard, href: 'dashboard/generator' },
    { name: "History", icon: History, href: 'dashboard/history' },
    { name: "Templates", icon: FileText, href: 'dashboard/templates' },
   

]


 const accountItems = [
 { name: "Subscription", icon: CreditCard, href: 'dashboard/subscription' },
 { name: "Settings", icon: Settings, href: 'dashboard/settings' },
  
 ]

    return (
        <aside className="w-64 border-r border-slate-800 bg-slate-950 text-slate-300 backdrop-blur-xl  h-full hidden md:flex flex-col">
        <div className="p-6">
          <span><Logo/></span>
        </div>
        
        <div className="flex-1 px-4 space-y-2 mt-4">
          <div className="text-xs font-semibold text-slate-600 px-4 mb-2 uppercase tracking-wider">Main</div>
             
            <ul>
                {asideItems.map((asideItem) => (
                    <li key={asideItem.name}>
                        <Link className="flex gap-3 items-center p-3 rounded-lg hover:bg-slate-800 transition-colors" href={asideItem.href}>
                         <asideItem.icon className="w-5 h-5"/>
                         <span>{asideItem.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
           
          <div className="text-xs font-semibold text-slate-600 px-4 mb-2 mt-8 uppercase tracking-wider">Account</div>
            <ul>
                {accountItems.map((accountItem) => (
                    <li key={accountItem.name}>
                        <Link className="flex gap-3 items-center p-3 rounded-lg hover:bg-slate-800 transition-colors" href={accountItem.href}>
                         <accountItem.icon className="w-5 h-5"/>
                         <span>{accountItem.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-400">Credits</span>
              <span className="text-xs font-bold text-white">3 / 5</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-violet-500 h-full w-[60%]"></div>
            </div>
            <button className="w-full mt-3 py-1.5 text-xs font-medium text-violet-300 bg-violet-500/10 rounded-lg hover:bg-violet-500/20 transition-colors">
              Upgrade Plan
            </button>
          </div>
          <SignOutButton/>
        </div>
      </aside>
    )
}