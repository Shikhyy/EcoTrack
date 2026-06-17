"use client";
import { CATEGORY_MAX, barColor } from '../../lib/emissions';
import { SLIDERS } from '../../constants/sliders';
import { motion } from 'framer-motion';

export default function TreeProgress({ values }) {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-sm mt-8">
      <h3 className="text-xl font-medium text-[#1c1c1c] mb-6">Emissions Breakdown</h3>
      <div className="flex flex-col gap-6">
        {SLIDERS.map((slider, index) => {
          const val = values[slider.key];
          const percent = (val / slider.max) * 100;
          const color = barColor(percent);
          
          return (
            <motion.div 
              key={slider.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-[#1c1c1c] flex items-center gap-2">
                  <span className="text-xl">{slider.icon}</span> 
                  {slider.label}
                </span>
                <span className="font-bold text-[#1c1c1c]">{val} <span className="text-xs text-black/50 font-normal">kg</span></span>
              </div>
              <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ backgroundColor: color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
