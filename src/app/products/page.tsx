"use client";

import { motion } from "framer-motion";
import GlobalNav from "../../components/GlobalNav";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } },
};

export default function ProductsPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#F4F3F0] text-[#1c1c1c] overflow-hidden selection:bg-black/10">
      <GlobalNav />
      
      {/* Background ambient gradient */}
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#E3E1D9]/60 to-[#F4F3F0]/0 blur-3xl -z-10 pointer-events-none" />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="pt-40 px-6 md:px-12 max-w-7xl mx-auto pb-32"
      >
        <motion.div variants={item} className="mb-24 text-center max-w-3xl mx-auto">
          <span className="block text-black/40 text-sm font-medium tracking-widest uppercase mb-6">Our Ecosystem</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8">
            Tools for a <span className="italic">sustainable</span> future.
          </h1>
          <p className="text-xl text-black/60 font-light">
            Whether you're an individual looking to reduce your footprint, or an enterprise scaling green initiatives, we have the right platform for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Product Card */}
          <motion.div variants={item} className="group relative w-full rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-white/40 p-12 overflow-hidden hover:bg-white/80 transition-colors duration-700">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-black/5 text-xs font-medium tracking-wide uppercase mb-8">Personal</span>
            <h2 className="text-4xl font-medium mb-4">EcoTrack App</h2>
            <p className="text-lg text-black/60 leading-relaxed mb-12 max-w-sm">
              Your personal carbon footprint companion. Connect your bank accounts, track your transit, and get AI-powered insights to reduce your emissions daily.
            </p>
            <button className="relative overflow-hidden rounded-full bg-[#1c1c1c] text-[#F4F3F0] px-8 py-4 text-sm font-medium tracking-wide transition-transform hover:scale-105 active:scale-95">
              <span className="relative z-10">Download iOS App</span>
            </button>
            <div className="mt-16 w-full aspect-[4/3] rounded-2xl bg-black/5 overflow-hidden flex items-center justify-center">
               <div className="w-2/3 h-4/5 bg-white shadow-2xl rounded-xl border border-black/5 flex flex-col items-center pt-8">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 flex items-center justify-center mb-4">
                     <span className="text-xl font-medium">8.2</span>
                  </div>
                  <div className="w-3/4 h-2 bg-black/5 rounded-full mb-2" />
                  <div className="w-1/2 h-2 bg-black/5 rounded-full" />
               </div>
            </div>
          </motion.div>

          {/* Enterprise Product Card */}
          <motion.div variants={item} className="group relative w-full rounded-[2.5rem] bg-[#1c1c1c] text-[#F4F3F0] p-12 overflow-hidden hover:bg-black transition-colors duration-700">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700 text-white">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium tracking-wide uppercase mb-8">Enterprise</span>
            <h2 className="text-4xl font-medium mb-4">EcoTrack Pro</h2>
            <p className="text-lg text-white/60 leading-relaxed mb-12 max-w-sm">
              Comprehensive ESG reporting and supply chain carbon tracking. Empower your organization to hit net-zero targets with rigorous data analytics.
            </p>
            <button className="relative overflow-hidden rounded-full bg-[#F4F3F0] text-[#1c1c1c] px-8 py-4 text-sm font-medium tracking-wide transition-transform hover:scale-105 active:scale-95">
              <span className="relative z-10">Contact Sales</span>
            </button>
            <div className="mt-16 w-full aspect-[4/3] rounded-2xl bg-white/5 overflow-hidden flex items-center justify-center p-8">
               <div className="w-full h-full bg-[#2a2a2a] shadow-2xl rounded-xl border border-white/5 p-6 flex flex-col gap-4">
                  <div className="w-full h-1/2 flex items-end gap-2">
                     <div className="flex-1 bg-white/10 h-1/3 rounded-t-sm" />
                     <div className="flex-1 bg-white/20 h-2/3 rounded-t-sm" />
                     <div className="flex-1 bg-emerald-500/50 h-full rounded-t-sm" />
                     <div className="flex-1 bg-white/10 h-1/2 rounded-t-sm" />
                  </div>
                  <div className="w-full h-px bg-white/10" />
                  <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-white/10" />
                     <div className="flex-1">
                        <div className="w-full h-2 bg-white/10 rounded-full mb-2" />
                        <div className="w-2/3 h-2 bg-white/10 rounded-full" />
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
