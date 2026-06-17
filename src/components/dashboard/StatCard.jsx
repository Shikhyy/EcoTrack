"use client";
import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, unit, color }) {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white/40 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
    >
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 bg-white/60 shadow-inner"
        style={{ color }}
      >
        {icon}
      </div>
      <div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl font-bold text-[#1c1c1c]">{value}</span>
          {unit && <span className="text-sm font-medium text-black/50">{unit}</span>}
        </div>
        <p className="text-sm font-semibold text-black/40 uppercase tracking-wider">
          {label}
        </p>
      </div>
    </motion.div>
  );
}
