"use client"

import Link from "next/link";
import Logo from "../myComponents/Logo";


interface AuthCardProps {
  children: React.ReactNode;
  subtitle: string;
  footerText: string;
  footerActionText: string;
  footerActionHref: string; // URL-ul unde duce linkul (ex: /register)
}

export function AuthCard({
  children,
  subtitle,
  footerText,
  footerActionText,
  footerActionHref,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md relative animate-in zoom-in-95 duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl blur-2xl opacity-20 -z-10 transform rotate-3 scale-105"></div>

      {/* Card Content */}
      <div className="bg-slate-950/70 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">

          <div className="text-orange-500 gap-2 flex justify-center font-bold mb-2">

            <Logo />
          </div>

          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>

        {children}

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">

          <p className="text-slate-400 text-sm">
            {footerText}{" "}
            {/* Folosim Link, nu button onClick */}
            <Link
              href={footerActionHref}
              className="text-orange-500 hover:text-orange-300 font-medium transition-colors hover:underline"
            >
              {footerActionText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}