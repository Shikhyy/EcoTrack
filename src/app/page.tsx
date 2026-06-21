"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import GlobalNav from "../components/GlobalNav";
import AppInterface from "../components/AppInterface";
import BirdSequenceOverlay from "../components/BirdSequenceOverlay";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transformations
  const textY = useTransform(scrollYProgress, [0, 1], ["0vh", "20vh"]);
  
  // The E starts smaller (scale 0.7) and pushed down (y: "25vh") so exactly ~50% is visible.
  // As you scroll down (0 to 0.8), it moves up and scales up to full size.
  const imageY = useTransform(scrollYProgress, [0, 0.8], ["25vh", "0vh"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.8], [0.7, 1.05]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <main ref={containerRef} className="relative w-full h-[200vh] bg-[#F4F3F0]">
        {/* Sticky Hero Container */}
        <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
          
          {/* Background Typography */}
          <motion.div 
            className="absolute inset-0 flex items-start justify-center pt-[10vh] pointer-events-none z-0"
            style={{ y: textY }}
          >
            <h1 
              className="text-[14vw] font-bold tracking-tighter text-[#1c1c1c] select-none leading-none"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 50%, transparent 80%)',
                maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 50%, transparent 80%)'
              }}
            >
              ECOTRACK
            </h1>
          </motion.div>

          {/* Leaf Shadows Overlay */}
          <motion.div 
            className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply"
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 0.3 : 0 }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <motion.div
              className="relative w-full h-full"
              animate={{ 
                x: ["0%", "-1%", "0.5%", "0%"],
                y: ["0%", "0.5%", "-0.5%", "0%"],
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Image 
                src="/leaf-shadows.png" 
                alt="Leaf shadows" 
                fill
                priority
                className="object-cover object-top"
              />
            </motion.div>
          </motion.div>

          {/* E Image with Transparent Background */}
          <motion.div 
            className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none pb-[5vh]"
            style={{ y: imageY, scale: imageScale, transformOrigin: "bottom center" }}
          >
            <div className="relative w-full max-w-[85vh] aspect-square">
              <Image
                src="/eco_letter_e_1781797380669-removebg-preview.png"
                alt="EcoTrack Mossy Letter"
                fill
                priority
                className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.35)]"
              />
              {/* Bird sequence positioned on the top right ledge of the E */}
              <BirdSequenceOverlay className="absolute -top-[45%] -right-[38%] w-[100%] h-[100%]" />
            </div>
          </motion.div>

          {/* Foreground UI Layer */}
          <motion.div
            className="absolute inset-0 z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          >
            <GlobalNav />

            {/* Floema-style Hero Copy (Left Center/Bottom) */}
            <div className="absolute bottom-32 left-12 max-w-[320px] pointer-events-auto">
              <motion.h2 
                className="text-[26px] font-normal leading-snug text-[#1c1c1c] mb-12 tracking-tight"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: loaded ? 0 : 50, opacity: loaded ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Track, understand, and reduce your carbon footprint.
              </motion.h2>
              <motion.button 
                onClick={() => document.getElementById('app-interface')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center text-sm font-medium tracking-wide text-[#1c1c1c] border-b border-[#1c1c1c]/30 pb-2 hover:border-[#1c1c1c] transition-colors"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: loaded ? 0 : 20, opacity: loaded ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                Calculate your impact ↓
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Landing Page Explanatory Sections */}
      <section id="dashboard" className="w-full bg-white py-32 px-4 md:px-12 z-40 relative flex flex-col items-center border-t border-black/5">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#1c1c1c] mb-6">Visualizing Your <span className="font-serif italic text-black/50">Impact</span></h2>
            <p className="text-lg text-[#1c1c1c]/70 leading-relaxed mb-8">
              The EcoTrack Dashboard transforms abstract emissions numbers into tangible, beautiful 3D visualizations. Explore an interactive globe showcasing your footprint and discover exactly how many trees are needed to offset your lifestyle. 
            </p>
          </div>
          <div className="bg-[#F4F3F0] rounded-[40px] aspect-square flex items-center justify-center p-8 shadow-inner overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a6b8a]/20 to-transparent"></div>
            <div className="text-6xl text-[#1a6b8a]/30 font-serif italic relative z-10">Data</div>
          </div>
        </div>
      </section>

      <section id="methodology" className="w-full bg-[#F4F3F0] py-32 px-4 md:px-12 z-40 relative flex flex-col items-center">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 bg-white rounded-[40px] aspect-square flex items-center justify-center p-8 shadow-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f0a500]/10 to-transparent"></div>
            <div className="text-6xl text-[#f0a500]/30 font-serif italic relative z-10">Science</div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#1c1c1c] mb-6">Open-Source <span className="font-serif italic text-black/50">Methodology</span></h2>
            <p className="text-lg text-[#1c1c1c]/70 leading-relaxed mb-8">
              Transparency is at the core of EcoTrack. Our calculations are strictly based on peer-reviewed open-source data regarding global averages for transport, diet, and household energy.
            </p>
          </div>
        </div>
      </section>

      <section id="ecoguide" className="w-full bg-white py-32 px-4 md:px-12 z-40 relative flex flex-col items-center">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#1c1c1c] mb-6">Meet <span className="font-serif italic text-black/50">EcoGuide AI</span></h2>
            <p className="text-lg text-[#1c1c1c]/70 leading-relaxed mb-8">
              Powered by Groq's blazing-fast Llama 3 API, the EcoGuide AI acts as your personal sustainability coach. It analyzes your active pledges and footprint score to offer custom, actionable advice on reducing your emissions.
            </p>
          </div>
          <div className="bg-[#1c1c1c] text-white rounded-[40px] aspect-square flex items-center justify-center p-8 shadow-xl overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-bl from-[#2d8a4e]/20 to-transparent"></div>
             <div className="text-6xl text-white/20 font-serif italic relative z-10">Intelligence</div>
          </div>
        </div>
      </section>

      {/* Interactive Application Interface */}
      <AppInterface />
    </>
  );
}
