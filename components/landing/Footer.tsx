"use client"
import { motion } from 'framer-motion'

import Logo from "../myComponents/Logo"

const Footer = () => {

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-12 bg-slate-950 border-t border-white/5 px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <a href="/"> <Logo /></a>

        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Mars Systems. Built for elite traders.
        </p>
        <div className="flex gap-8 text-slate-400 text-sm">
          <a href="/privacy" className="hover:text-orange-500 transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-orange-500 transition-colors">Terms</a>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer