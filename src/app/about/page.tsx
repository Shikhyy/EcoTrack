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
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function AboutPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#F4F3F0] text-[#1c1c1c] overflow-hidden selection:bg-black/10">
      <GlobalNav />
      
      {/* Background ambient gradient */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#E3E1D9]/60 to-[#F4F3F0]/0 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-[#E3E1D9]/40 to-[#F4F3F0]/0 blur-3xl -z-10 pointer-events-none" />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="pt-40 px-6 md:px-12 max-w-6xl mx-auto pb-32"
      >
        <motion.h1 variants={item} className="text-6xl md:text-8xl font-light tracking-tight mb-16">
          <span className="block text-black/40 text-2xl font-medium tracking-widest uppercase mb-6">About Us</span>
          Measure.<br/>
          <span className="italic text-black/60">Improve.</span><br/>
          Transform.
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-24">
          <motion.div variants={item} className="md:col-span-5">
            <h2 className="text-3xl font-medium mb-6">Our Mission</h2>
            <p className="text-xl font-light text-black/70 leading-relaxed">
              EcoTrack was founded on a simple premise: you cannot improve what you cannot measure. We believe that individual action, when aggregated and informed by data, has the power to shift markets and reduce global emissions.
            </p>
          </motion.div>
          
          <motion.div variants={item} className="md:col-span-6 md:col-start-7">
            <h2 className="text-3xl font-medium mb-6">The Approach</h2>
            <p className="text-xl font-light text-black/70 leading-relaxed">
              Our team of climate scientists, designers, and engineers are building the infrastructure to make carbon tracking as seamless as checking your bank balance. We combine beautifully crafted generative UI with rigorous data models to create an experience that feels alive.
            </p>
          </motion.div>
        </div>

        <motion.div variants={item} className="mt-32">
          <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center group">
            {/* Ambient image placeholder overlay */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-80 mix-blend-multiply group-hover:scale-105 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="relative z-10 text-center">
              <span className="text-[#F4F3F0] text-sm font-medium tracking-widest uppercase mb-4 block opacity-80">The Team</span>
              <h3 className="text-4xl text-white font-light">Driven by Nature.</h3>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
