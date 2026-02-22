"use client"

import Logo from "../myComponents/Logo"

const Footer = () => {

  return (
    <footer className="py-12 bg-slate-950 border-t border-white/5 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <Logo />
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Mars Systems. Built for elite traders.
        </p>
        <div className="flex gap-8 text-slate-400 text-sm">
          <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer