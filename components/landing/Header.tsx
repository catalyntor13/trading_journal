"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link";

const Header = () => {


  const [open, isOpen] = useState(false)


 const navItems = [
  { name: 'How it works', href: "howitworks"},
  { name: 'Pricing', href: 'pricing'},
  { name: 'Testimoniale', href: 'testimonials'}
 ]



  return (
    <header className='w-full fixed z-50 transition-all duration-300 ' >
      <div className="container mx-auto p-6 flex items-center justify-around">
        {/* Logo */}
                <div className='flex items-center gap-2 cursor-pointer select-none'>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
      <Zap className="w-5 h-5 text-white fill-white" />
    </div>
    <span className="font-bold text-xl tracking-tight text-white">
      Thread<span className="text-violet-400">Tube</span>
    </span>
  </div>

   {/* Logo */}
           

           {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
           { navItems.map((navItem) =>(
            <button className="text-slate-300 hover:text-slate-200 cursor-pointer" key={navItem.name}>
              {navItem.name}
            </button>
           ) )}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link href='/login'>
          <Button className="text-sm font-medium text-slate-200 cursor-pointer hover:text-white px-4 py-2">
            Sign in
          </Button>
          </Link>
          <Link href='/register'>
          <Button variant='outline' className="h-9 px-5 text-sm cursor-pointer font-medium hover:bg-slate-200">
            Get Started
          </Button>
          </Link>
        </div>
                   {/* Desktop Nav */}


                          {/* Mobile Nav */}
    <Sheet open={open} onOpenChange={isOpen}>
  <SheetTrigger className="lg:hidden  text-white">
    { open ? <X/> : <Menu/> }
  </SheetTrigger>
  <SheetContent className="bg-slate-800 w-full" side="left">
   <nav className="lg:hidden flex flex-col items-center gap-6 my-10 ">
           { navItems.map((navItem) =>(
            <button className="text-slate-300 hover:text-slate-200 cursor-pointer" key={navItem.name}>
              {navItem.name}
            </button>
           ) )}
        </nav>
  </SheetContent>
</Sheet>
      </div>
      
     {/* Mobile Nav */}
    </header>
  )
}

export default Header