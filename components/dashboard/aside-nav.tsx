"use client"

import { useState } from "react"
import Logo from "../myComponents/Logo"
import {
  LayoutDashboard,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users
} from "lucide-react"
import { SiGoogleanalytics } from "react-icons/si";
import { IoLogoTableau } from "react-icons/io5";
import Link from "next/link"
import { usePathname } from "next/navigation" // Added for active state
import SignOut from "../myComponents/SignOut"
import { cn } from "@/lib/utils"

export default function AsideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname() // Get current path

  const asideItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: '/dashboard' },
    { name: "Accounts", icon: Users, href: '/accounts' }, // Placeholder href
    { name: "Strategies", icon: IoLogoTableau, href: '/strategies' },
    { name: "Analytics", icon: SiGoogleanalytics, href: '/analytics' },
    { name: "Settings", icon: Settings, href: '/settings' },
  ]

  return (
    <aside className={cn(
      "border-r border-sidebar-border bg-sidebar text-sidebar-foreground backdrop-blur-xl h-full hidden md:flex flex-col transition-all duration-300 relative",
      isCollapsed ? "w-[80px]" : "w-64"
    )}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 cursor-pointer top-8 bg-background border border-border text-foreground rounded-full p-1 hover:bg-muted transition-colors z-20 shadow-sm"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className={cn("p-6 flex items-center h-20", isCollapsed ? "justify-center" : "justify-start")}>
        {isCollapsed ? (
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-md opacity-40 rounded-full"></div>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary relative z-10"
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M3 12c2-1 5-2 9-2s7 1 9 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ) : (
          <span><Logo /></span>
        )}
      </div>

      <div className="flex-1 px-4 space-y-6 mt-4">

        <ul className="space-y-2">
          {asideItems.map((asideItem) => {
            const isActive = pathname === asideItem.href;
            return (
              <li key={asideItem.name}>
                <Link
                  className={cn(
                    "flex items-center p-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isCollapsed ? "justify-center" : "gap-3"
                  )}
                  href={asideItem.href}
                >
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                  )}

                  <asideItem.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")} />
                  {!isCollapsed && <span>{asideItem.name}</span>}
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