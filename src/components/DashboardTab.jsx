"use client";
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import EarthGlobe from './nature/EarthGlobe';
import StatCard from './dashboard/StatCard';
import TreeProgress from './dashboard/TreeProgress';
import { getTier, tierColor, treesNeeded, flightEquivalent, vsGlobalAverage } from '../lib/emissions';
import { FACTS } from '../constants/facts';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardTab({ values, score, onNext }) {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % FACTS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const tier = getTier(score);
  const color = tierColor(tier);
  const statusLabel = tier === 'low' ? 'Eco Hero' : tier === 'mid' ? 'Aware' : 'At Risk';

  const trees = treesNeeded(score);
  const flights = flightEquivalent(score);
  const vsGlobal = vsGlobalAverage(score);
  const energyShare = score > 0 ? ((values.energy / score) * 100).toFixed(0) : 0;

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Globe Visualization */}
        <div className="h-[400px] bg-white/30 backdrop-blur-3xl rounded-[40px] border border-white/50 p-4 shadow-sm relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-8 left-8 z-10">
            <h3 className="text-2xl font-bold text-[#1c1c1c] mb-1">Status</h3>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-white">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm font-bold uppercase tracking-wider" style={{ color }}>{statusLabel}</span>
            </div>
          </div>
          <div className="w-full h-full scale-110">
            <EarthGlobe tier={tier} color={color} statusLabel={statusLabel} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-6">
          <StatCard 
            icon={<svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21V11M8 14l4-4 4 4M10 8l2-4 2 4M14 8l-2-4-2 4" /></svg>} 
            label="Trees Needed/Yr" value={trees} unit="trees" color="#2d8a4e" />
          <StatCard 
            icon={<svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12Zm0 0h7.5" /></svg>} 
            label="Flight Equivalent" value={flights} unit="flights" color="#1a6b8a" />
          <StatCard 
            icon={<svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>} 
            label="Vs Global Avg" value={vsGlobal} unit="" color="#f0a500" />
          <StatCard 
            icon={<svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>} 
            label="Energy Share" value={energyShare} unit="%" color="#0d4a6b" />
        </div>
      </div>

      {/* Footprint Breakdown Chart */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[40px] p-8 shadow-sm mb-12 w-full h-[400px] flex flex-col">
        <h3 className="text-2xl font-bold text-[#1c1c1c] mb-2 text-center">Footprint Breakdown</h3>
        <p className="text-center text-black/50 text-sm mb-4">Visualize where your emissions come from.</p>
        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Transport', value: values.transport || 1, color: '#1a6b8a' },
                  { name: 'Energy', value: values.energy || 1, color: '#f0a500' },
                  { name: 'Food', value: values.food || 1, color: '#2d8a4e' },
                ]}
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {[
                  { name: 'Transport', value: values.transport, color: '#1a6b8a' },
                  { name: 'Energy', value: values.energy, color: '#f0a500' },
                  { name: 'Food', value: values.food, color: '#2d8a4e' },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value) => [`${value} kg`, 'Emissions']}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#1c1c1c', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-12">
        <TreeProgress values={values} />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-black/5 rounded-3xl p-8 border border-black/5">
        <div className="flex-1 relative h-16 overflow-hidden w-full">
          <AnimatePresence mode="wait">
            <motion.p 
              key={factIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-lg font-medium text-black/60 italic absolute inset-0 flex items-center"
            >
              &quot;{FACTS[factIndex]}&quot;
            </motion.p>
          </AnimatePresence>
        </div>
        <button 
          className="shrink-0 bg-[#1c1c1c] text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-colors hover:scale-105 transform duration-300 shadow-xl"
          onClick={onNext}
        >
          View Action Plan &rarr;
        </button>
      </div>
    </div>
  );
}
