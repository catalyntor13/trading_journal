"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  Target
} from "lucide-react"
import { SiGoogleanalytics } from "react-icons/si";
import Link from "next/link"
import { usePathname } from "next/navigation" // Added for active state
import SignOut from "../myComponents/SignOut"
import { cn } from "@/lib/utils"
import Logo from "../myComponents/Logo";

export default function AsideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname() // Get current path

  const asideItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: '/dashboard' },
    { name: "Accounts", icon: Users, href: '/accounts' }, // Placeholder href
    { name: "Strategies", icon: Target, href: '/strategies' },
    { name: "Analytics", icon: SiGoogleanalytics, href: '/analytics' },
    { name: "Settings", icon: Settings, href: '/settings' },
  ]

  return (
    <aside className={cn(
      "bg-[#0A101C] rounded-[24px] border border-slate-800/60 p-5 shrink-0 hidden md:flex flex-col relative overflow-hidden transition-all duration-300",
      isCollapsed ? "w-[80px]" : "w-64"
    )}>
      {/* Glow ambient fundal meniu */}
      <div className="absolute top-0 left-0 w-full h-32 bg-cyan-500/5 blur-[80px] pointer-events-none" />
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 cursor-pointer top-8 bg-[#060B14] border border-slate-700 text-slate-400 rounded-full p-1 hover:text-white hover:bg-slate-800 transition-colors z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className={cn("flex items-center gap-3 mb-10 mt-3", isCollapsed ? "justify-center px-0" : "px-2")}>
        <Logo collapsed={isCollapsed} />
      </div>

      <div className="flex-1 px-4 space-y-6 mt-4">

        <ul className="space-y-2">
          {asideItems.map((asideItem) => {
            const isActive = pathname === asideItem.href;
            return (
              <li key={asideItem.name}>
                <Link
                  className={cn(
                    "flex items-center rounded-xl transition-all duration-200 group relative",
                    isCollapsed ? "justify-center p-2" : "px-3 py-2.5 gap-2",
                    isActive
                      ? (isCollapsed ? "text-cyan-400" : "bg-slate-800/50 text-cyan-400 border border-slate-700/50 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]")
                      : (isCollapsed ? "text-slate-400 hover:text-cyan-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30")
                  )}
                  href={asideItem.href}
                >


                  <asideItem.icon className={cn("transition-colors shrink-0", isCollapsed ? "w-5 h-5" : "w-5 h-5", isActive ? "text-cyan-400" : "group-hover:text-slate-200")} />
                  {!isCollapsed && <span className="font-medium text-sm">{asideItem.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>

      </div>
      <div className={cn("p-4 mb-4", isCollapsed && "items-center flex justify-center p-1")}>
        {isCollapsed ? (
          <div className="w-full flex justify-center">
            <SignOut collapsed={isCollapsed} />
          </div>

        ) : (
          <SignOut />
        )}
      </div>

    </aside>
  )
}