"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import TrackTab from '../components/TrackTab';
import DashboardTab from '../components/DashboardTab';
import ActionsTab from '../components/ActionsTab';
import AIAssistant from '../components/ai/AIAssistant';
import { DEFAULT_VALUES } from '../constants/sliders';
import { totalScore } from '../lib/emissions';

export default function AppShell() {
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [currentTab, setCurrentTab] = useState('dashboard');

  const score = totalScore(values);

  const renderTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardTab values={values} score={score} onNext={() => setCurrentTab('track')} />;
      case 'track':
        return <TrackTab values={values} setValues={setValues} onNext={() => setCurrentTab('actions')} />;
      case 'actions':
        return <ActionsTab values={values} score={score} />;
      case 'ai':
        return <AIAssistant values={values} score={score} />;
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'track', label: 'Track Emissions' },
    { id: 'actions', label: 'Action Plan' },
    { id: 'ai', label: 'EcoGuide AI' }
  ];

  return (
    <div className="flex w-full min-h-screen bg-[#F4F3F0] text-[#1c1c1c] font-sans selection:bg-[#2d8a4e] selection:text-white overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-72 border-r border-black/10 bg-white/40 backdrop-blur-3xl flex flex-col justify-between py-10 px-8 z-20">
        <div>
          <Link href="/" className="block font-bold text-2xl tracking-widest text-[#1c1c1c] mb-16">
            ECOTRACK
          </Link>
          
          <nav className="flex flex-col gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`text-left text-lg font-medium py-3 px-4 rounded-2xl transition-all duration-300 ${
                  currentTab === tab.id 
                    ? 'bg-[#1c1c1c] text-[#F4F3F0] shadow-lg scale-105' 
                    : 'text-black/50 hover:text-black hover:bg-black/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Global Live Score */}
        <div className="bg-white/60 p-6 rounded-3xl border border-black/5 shadow-sm">
          <p className="text-sm font-bold text-[#2d8a4e] uppercase tracking-wider mb-2">Live Footprint</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{score}</span>
            <span className="text-black/50 font-medium">kg CO₂</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full p-12 max-w-6xl mx-auto"
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
