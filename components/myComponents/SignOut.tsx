"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const SignOut = ({ collapsed, className }: { collapsed?: boolean, className?: string }) => {

  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({    // Functia de signOut din Betterauth
      fetchOptions: {
        onSuccess: () => {
          router.push("/login?message=logged-out");
        }
      }
    })
  }

  return (
    <>

      <div className={cn("px-2 py-4", !collapsed && "border-t border-slate-800/60 mt-4", className)}>
        <button
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-3 w-full transition-all duration-200 cursor-pointer group rounded-xl",
            collapsed
              ? "justify-center p-2 text-slate-400 hover:text-red-400"
              : "px-3 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0 transition-colors group-hover:text-red-400" />
          {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
        </button>
      </div>
    </>
  )
}

export default SignOut