import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileNav } from "./mobile-nav"
export default function TopNav({ user }: { user: { name: string; image?: string | null; email?: string | null } }) {
    const initials = user.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    return (
        <header className="flex flex-row justify-between items-center gap-4 bg-[#0A101C] p-4 rounded-2xl border border-slate-800/60 transition-all relative z-50 mb-6">
            <div className="flex gap-4 items-center">
                <MobileNav />

            </div>

            {/* Right side - User Profile & Actions */}
            <div className="flex items-center gap-4">

                <div className="flex items-center gap-3">

                    <span>{user.name}</span>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>{initials}</AvatarFallback>

                    </Avatar>
                </div>
            </div>
        </header>
    )
}