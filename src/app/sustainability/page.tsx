"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import GlobalNav from "../../components/GlobalNav";

export default function SustainabilityPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <main className="relative w-full min-h-screen bg-[#F4F3F0] text-[#1c1c1c] selection:bg-black/10">
      <GlobalNav />
      
      {/* Background ambient gradient */}
      <div className="fixed top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-bl from-[#E3E1D9]/40 to-[#F4F3F0]/0 blur-3xl -z-10 pointer-events-none" />

      <div className="pt-40 px-6 md:px-12 max-w-6xl mx-auto min-h-screen flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="block text-black/40 text-sm font-medium tracking-widest uppercase mb-6">Sustainability Report</span>
          <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-8 max-w-4xl">
            Our commitment to a <span className="italic">net-zero</span> world.
          </h1>
          <p className="text-xl md:text-2xl text-black/60 font-light max-w-2xl leading-relaxed">
            We hold ourselves to the same rigorous standards that we provide our customers. Our operations have been carbon neutral since day one.
          </p>
        </motion.div>
      </div>

      <div ref={containerRef} className="relative w-full bg-[#1c1c1c] text-[#F4F3F0] py-40 px-6 md:px-12 overflow-hidden rounded-t-[3rem]">
        {/* Parallax background elements */}
        <motion.div style={{ y: y2, opacity }} className="absolute top-40 right-20 text-[20rem] font-bold text-white/[0.02] pointer-events-none">
          CO₂
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <motion.div style={{ y: y1 }}>
              <h2 className="text-4xl font-medium mb-8">Scope 1 & 2 Emissions</h2>
              <div className="text-7xl font-light mb-4 text-emerald-400">0.0<span className="text-3xl text-white/40 ml-2">tCO2e</span></div>
              <p className="text-xl text-white/60 font-light leading-relaxed">
                By operating entirely on renewable energy grids and maintaining a fully remote workforce, we&apos;ve eliminated our direct operational emissions.
              </p>
            </motion.div>

            <motion.div style={{ y: y2 }}>
              <h2 className="text-4xl font-medium mb-8">Server Infrastructure</h2>
              <div className="text-7xl font-light mb-4">100<span className="text-3xl text-white/40 ml-2">%</span></div>
              <p className="text-xl text-white/60 font-light leading-relaxed">
                Our data centers are powered by 100% wind and solar energy. We actively shift compute workloads to regions where the sun is shining or the wind is blowing.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1 }}
            className="mt-40 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" 
          />

          <div className="mt-40 text-center max-w-3xl mx-auto">
            <span className="block text-white/40 text-sm font-medium tracking-widest uppercase mb-6">Transparency</span>
            <h2 className="text-4xl font-medium mb-8">Read the Full 2026 Report</h2>
            <button className="relative overflow-hidden rounded-full bg-[#F4F3F0] text-[#1c1c1c] px-8 py-4 text-sm font-medium tracking-wide transition-transform hover:scale-105 active:scale-95">
              <span className="relative z-10">Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
