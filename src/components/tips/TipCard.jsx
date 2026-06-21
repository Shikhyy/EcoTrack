"use client";
import { motion } from 'framer-motion';

export default function TipCard({ icon, title, desc, impact, color }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white/40 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all flex gap-6 items-center"
    >
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 bg-white/60 shadow-inner"
        style={{ color }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-xl font-bold text-[#1c1c1c] mb-2">{title}</h4>
        <p className="text-black/60 text-sm leading-relaxed mb-3">
          {desc}
        </p>
        <div className="inline-flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full border border-black/5">
          <span className="text-xs font-bold text-black/40 uppercase tracking-wider">Impact</span>
          <span className="text-sm font-bold" style={{ color }}>{impact} kg</span>
        </div>
      </div>
    </motion.div>
  );
}
