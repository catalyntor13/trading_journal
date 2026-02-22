import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileNav } from "./mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export default function TopNav({ user }: { user: { name: string; image?: string | null; email?: string | null } }) {
    const initials = user.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    return (
        <nav className="p-4 bg-background/50 backdrop-blur-md sticky top-0 z-50 transition-all">
            <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
                {/* Left side - Mobile Menu & Title */}
                <div className="flex items-center gap-4">
                    <MobileNav />

                </div>

                {/* Right side - User Profile & Actions */}
                <div className="flex items-center gap-3 md:gap-4">
                    <ThemeToggle />

                    <div className="flex items-center gap-3 pl-2 border-l border-border">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-foreground leading-none">{user.name}</p>
                            <p className="text-xs text-muted-foreground">Trader</p>
                        </div>
                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm cursor-pointer">
                            <AvatarImage src={user.image || "https://github.com/shadcn.png"} alt="@shadcn" />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </nav>
    )
}