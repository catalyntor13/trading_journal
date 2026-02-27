"use client"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, LayoutDashboard, History, Settings, Users, Target, LogOut } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Logo from "../myComponents/Logo"
import { authClient } from "@/lib/auth-client"
import SignOut from "../myComponents/SignOut"


export function MobileNav() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    setOpen(false)
                    router.push("/login?message=logged-out")
                }
            }
        })
    }



    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800/50">
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] border-r border-slate-800/60 bg-[#0A101C] p-0 text-slate-200 flex flex-col h-full">
                <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                <div className="p-6 border-b border-slate-800/60 flex justify-between items-center relative overflow-hidden shrink-0">
                    {/* Glow ambient fundal meniu */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-cyan-500/10 blur-[60px] pointer-events-none" />
                    <Logo />
                </div>
                <div className="p-4 relative z-10 flex flex-col flex-1 pb-8">
                    <div className="text-xs font-semibold text-slate-500 px-4 mb-2 uppercase tracking-wider">Menu</div>
                    <ul className="space-y-2 flex flex-col">
                        <li>
                            <Link
                                href="/dashboard"
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex gap-3 items-center px-3 py-3 rounded-xl transition-all duration-200 group",
                                    pathname === "/dashboard"
                                        ? "bg-slate-800/50 text-cyan-400 border border-slate-700/50 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                                )}
                            >
                                <LayoutDashboard className={cn("transition-colors shrink-0 w-5 h-5", pathname === "/dashboard" ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200")} />
                                <span className="font-medium text-sm">Dashboard</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/accounts"
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex gap-3 items-center px-3 py-3 rounded-xl transition-all duration-200 group",
                                    pathname === "/accounts"
                                        ? "bg-slate-800/50 text-cyan-400 border border-slate-700/50 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                                )}
                            >
                                <Users className={cn("transition-colors shrink-0 w-5 h-5", pathname === "/accounts" ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200")} />
                                <span className="font-medium text-sm">Accounts</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/strategies"
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex gap-3 items-center px-3 py-3 rounded-xl transition-all duration-200 group",
                                    pathname === "/strategies"
                                        ? "bg-slate-800/50 text-cyan-400 border border-slate-700/50 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                                )}
                            >
                                <Target className={cn("transition-colors shrink-0 w-5 h-5", pathname === "/strategies" ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200")} />
                                <span className="font-medium text-sm">Strategies</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/analytics"
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex gap-3 items-center px-3 py-3 rounded-xl transition-all duration-200 group",
                                    pathname === "/analytics"
                                        ? "bg-slate-800/50 text-cyan-400 border border-slate-700/50 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                                )}
                            >
                                <History className={cn("transition-colors shrink-0 w-5 h-5", pathname === "/analytics" ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200")} />
                                <span className="font-medium text-sm">Analytics</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/settings"
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex gap-3 items-center px-3 py-3 rounded-xl transition-all duration-200 group",
                                    pathname === "/settings"
                                        ? "bg-slate-800/50 text-cyan-400 border border-slate-700/50 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                                )}
                            >
                                <Settings className={cn("transition-colors shrink-0 w-5 h-5", pathname === "/settings" ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200")} />
                                <span className="font-medium text-sm">Settings</span>
                            </Link>
                        </li>

                        <li>
                            <SignOut />
                        </li>
                    </ul>
                </div>
            </SheetContent>
        </Sheet>
    )
}
