"use client"
import Link from 'next/link'
import Logo from '../myComponents/Logo'
import { MenuIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet'
import { useState } from 'react'
import { motion } from 'framer-motion'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },

  ]

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-slate-200 z-50 fixed w-full backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Logo />

          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.name} className="text-sm cursor-pointer font-medium text-slate-300 hover:text-orange-400 transition-colors">
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center hidden md:block gap-4">
            <Link href='/login'>
              <button className="bg-gradient-to-r cursor-pointer from-orange-500 to-red-600 text-white font-semibold py-2 px-6 rounded-full text-sm hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all transform hover:scale-105 active:scale-95">Get Started</button>
            </Link>




          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <MenuIcon className='cursor-pointer block lg:hidden text-slate-200' />
            </SheetTrigger>
            <SheetContent side="left" className="bg-slate-950 border-r border-white/10 flex flex-col sm:w-[350px]">
              <SheetHeader className="mt-4 px-2">
                <div onClick={() => setIsOpen(false)} className="cursor-pointer">
                  <Logo />
                </div>
              </SheetHeader>
              <div className="flex flex-col justify-between flex-1 mt-8">
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                      <div className="w-full text-left py-4 px-4 rounded-xl text-lg font-medium text-slate-300 hover:bg-white/5 hover:text-orange-400 transition-all">
                        {item.name}
                      </div>
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 mb-8 px-4">
                  <Link href='/login' onClick={() => setIsOpen(false)}>
                    <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}

export default Header