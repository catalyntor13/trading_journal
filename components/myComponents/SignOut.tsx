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

      <div className={cn("p-3", !collapsed && "border-t border-sidebar-border", className)}>
        <button
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-2 hover:bg-sidebar-accent w-full justify-start p-2 rounded-lg transition-colors cursor-pointer hover:text-red-500",
            collapsed ? "text-sidebar-foreground" : "text-muted-foreground"
          )}


        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </>
  )
}

export default SignOut