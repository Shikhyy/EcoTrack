"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function GlobalNav() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header 
      className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50 pointer-events-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      aria-label="Site Header"
    >
      <Link href="/" className="font-bold text-xl tracking-widest text-[#1c1c1c] hover:opacity-60 transition-opacity" aria-label="EcoTrack Home">
        ECOTRACK
      </Link>
      <nav className="hidden md:flex gap-8 text-sm font-medium text-[#1c1c1c] items-center" aria-label="Main Navigation">
        <button onClick={() => scrollTo('dashboard')} className="hover:opacity-60 transition-opacity" aria-label="Scroll to Dashboard Features">Dashboard</button>
        <button onClick={() => scrollTo('methodology')} className="hover:opacity-60 transition-opacity" aria-label="Scroll to Methodology">Methodology</button>
        <button onClick={() => scrollTo('ecoguide')} className="hover:opacity-60 transition-opacity" aria-label="Scroll to EcoGuide AI Features">EcoGuide AI</button>
        <button onClick={() => scrollTo('app-interface')} className="bg-[#1c1c1c] text-white px-5 py-2.5 rounded-full hover:bg-black transition-colors shadow-md" aria-label="Scroll down to Calculate Footprint">
          Calculate Footprint
        </button>
      </nav>
    </motion.header>
  );
}
