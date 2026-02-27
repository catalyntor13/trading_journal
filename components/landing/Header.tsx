"use client"
import Link from 'next/link'
import Logo from '../myComponents/Logo'

const Header = () => {

  const navItems = [
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
  ]

  return (
    <header className="text-slate-200 z-50 fixed w-full backdrop-blur-md border-b border-white/5">
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

          <div className="flex items-center gap-4">
            <Link href='/login'>
              <button className="bg-gradient-to-r cursor-pointer from-orange-500 to-red-600 text-white font-semibold py-2 px-6 rounded-full text-sm hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all transform hover:scale-105 active:scale-95">Get Started</button>
            </Link>

          </div>
        </div>
      </div>
    </header>
  )
}

export default Header