"use client";
import { SLIDERS } from '../constants/sliders';
import { barColor } from '../lib/emissions';
import { motion } from 'framer-motion';

export default function TrackTab({ values, setValues, onNext }) {
  const handleChange = (key, val) => {
    setValues(prev => ({ ...prev, [key]: Number(val) }));
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-5xl font-medium text-[#1c1c1c] mb-4">Your Footprint</h2>
        <p className="text-xl text-black/50">Adjust the sliders to estimate your monthly impact.</p>
      </motion.div>

      <div className="flex flex-col gap-10 flex-1">
        {SLIDERS.map((slider, index) => {
          const val = values[slider.key];
          const percent = (val / slider.max) * 100;
          const color = barColor(percent);

          return (
            <motion.div 
              key={slider.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/40 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-sm"
            >
              <div className="flex justify-between items-end mb-6">
                <span className="text-2xl font-medium text-[#1c1c1c] flex items-center gap-3">
                  <span className="text-3xl">{slider.icon}</span> 
                  {slider.label}
                </span>
                <span className="text-3xl font-bold transition-colors duration-300" style={{ color }}>
                  {val} <span className="text-sm text-black/40 font-semibold uppercase tracking-wider">kg CO₂</span>
                </span>
              </div>
              
              <div className="relative pt-2 pb-6">
                <input
                  type="range"
                  min="0"
                  max={slider.max}
                  value={val}
                  onChange={(e) => handleChange(slider.key, e.target.value)}
                  className="w-full absolute top-0 left-0 h-4 opacity-0 cursor-pointer z-20"
                  aria-label={`Adjust your ${slider.label} usage`}
                />
                {/* Custom Slider Track */}
                <div className="w-full h-4 bg-black/5 rounded-full overflow-hidden absolute top-0 left-0 pointer-events-none z-0">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ width: `${percent}%`, backgroundColor: color }}
                    layout
                  />
                </div>
                {/* Custom Slider Thumb */}
                <motion.div 
                  className="w-8 h-8 bg-white rounded-full shadow-md border border-black/10 absolute top-[-8px] pointer-events-none z-10 flex items-center justify-center"
                  style={{ left: `calc(${percent}% - 16px)` }}
                  layout
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                </motion.div>
                
                <div className="flex justify-between mt-8 text-xs font-bold text-black/30 uppercase tracking-wider">
                  <span>{slider.lowLabel}</span>
                  <span>{slider.highLabel}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-end">
        <button 
          className="bg-[#1c1c1c] text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-colors hover:scale-105 transform duration-300 shadow-xl"
          onClick={onNext}
        >
          See My Dashboard &rarr;
        </button>
      </div>
    </div>
  );
}
