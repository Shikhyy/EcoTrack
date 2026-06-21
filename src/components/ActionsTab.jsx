"use client";
import { useMemo } from 'react';
import { getPersonalizedTips } from '../lib/tipsEngine';
import TipCard from './tips/TipCard';
import { motion } from 'framer-motion';

export default function ActionsTab({ values, score }) {
  // Memoize tips so they only recalculate when values change, not on every parent render
  const tips = useMemo(() => getPersonalizedTips(values, score), [values, score]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-5xl font-medium text-[#1c1c1c] mb-4">Action Plan</h2>
        <p className="text-xl text-black/50">Personalized steps based on your highest impact areas.</p>
      </motion.div>

      <div className="flex flex-col gap-6">
        {tips.map((tip, index) => (
          <motion.div 
            key={tip.key} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <TipCard 
              icon={tip.icon} 
              title={tip.title} 
              desc={tip.desc} 
              impact={tip.impact} 
              color={tip.color} 
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
