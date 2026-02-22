"use client"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, LayoutDashboard, History, FileText, Settings, Users, Package } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Logo from "../myComponents/Logo"

export function MobileNav() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    const asideItems = [
        { name: "Dashboard", icon: LayoutDashboard, href: '/dashboard' },
        { name: "Accounts", icon: Users, href: '/accounts' },
        { name: "Strategies", icon: History, href: '/strategies' },
        { name: "Analytics", icon: History, href: '/analytics' },
        { name: "Settings", icon: Settings, href: '/settings' },
    ]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden p-2 text-foreground hover:bg-muted">
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] border-r border-sidebar-border bg-sidebar p-0 text-sidebar-foreground">
                <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                <div className="p-6 border-b border-sidebar-border flex justify-between items-center">
                    <Logo />
                </div>
                <div className="p-4">
                    <div className="text-xs font-semibold text-muted-foreground px-4 mb-2 uppercase tracking-wider">Menu</div>
                    <ul className="space-y-1">
                        {asideItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-lg transition-colors",
                                        pathname === item.href
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </SheetContent>
        </Sheet>
    )
}
