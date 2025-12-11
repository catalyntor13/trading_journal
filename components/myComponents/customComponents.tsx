"use client"
import { Zap } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";


export const Logo = () => (

    <div className='flex items-center gap-2 cursor-pointer select-none'>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
      <Zap className="w-5 h-5 text-white fill-white" />
    </div>
    <span className="font-bold text-xl tracking-tight text-white">
      Thread<span className="text-violet-400">Tube</span>
    </span>
  </div>

)


// Logout Function and Button

export const SignOutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login"); // Redirect către login după succes
          },
        },
      });
    } catch (error) {
      console.error("Eroare la delogare:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSignOut} 
      disabled={isLoading}
      className="w-full flex items-center cursor-pointer gap-3 px-4 py-3 mt-2 text-slate-400 hover:text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
    >
      <LogOut className="w-4 h-4" /> 
      {isLoading ? <LoaderCircle className="animate-spin"/> : "Sign Out"}
    </button>
  );
};

    
