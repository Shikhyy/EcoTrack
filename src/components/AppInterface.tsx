"use client";
import { useState } from "react";
import TrackTab from "./TrackTab";
import DashboardTab from "./DashboardTab";
import AIAssistant from "./ai/AIAssistant";
import CommunityTab from "./CommunityTab";

export default function AppInterface() {
  const [activeTab, setActiveTab] = useState("track");
  const [acceptedChallenges, setAcceptedChallenges] = useState<number[]>([]);
  
  // State to hold the current values from Track Tab
  const [values, setValues] = useState({
    transport: 20,
    diet: 50,
    energy: 30,
    shopping: 40
  });
  
  const score = Object.values(values).reduce((a, b) => a + b, 0);

  return (
    <section id="app-interface" className="w-full bg-[#F4F3F0] text-[#1c1c1c] py-32 px-4 md:px-12 z-40 relative flex flex-col items-center border-t border-black/5" aria-label="Interactive Carbon Tracker">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-16">
        
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-[#1c1c1c]/10 pb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Calculate & <span className="font-serif italic text-black/50">Reduce</span>
            </h2>
            <p className="text-[#1c1c1c]/50 mt-4 text-lg">Interactive carbon intelligence platform.</p>
          </div>
          
          <nav className="flex bg-black/5 rounded-full p-2 border border-black/10 overflow-x-auto max-w-full" aria-label="App Navigation">
            {["track", "dashboard", "community", "ai"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-current={activeTab === tab ? "page" : undefined}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab ? "bg-[#1c1c1c] text-white shadow-md" : "text-[#1c1c1c]/60 hover:text-[#1c1c1c] hover:bg-black/5"
                }`}
              >
                {tab === "track" ? "1. Track" : tab === "dashboard" ? "2. Insights" : tab === "community" ? "3. Social Good" : "4. EcoGuide AI"}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px] w-full" aria-live="polite">
          {activeTab === "track" && <TrackTab values={values} setValues={setValues} onNext={() => setActiveTab("dashboard")} />}
          {activeTab === "dashboard" && <DashboardTab values={values} score={score} onNext={() => setActiveTab("community")} />}
          {activeTab === "community" && <CommunityTab acceptedChallenges={acceptedChallenges} setAcceptedChallenges={setAcceptedChallenges} />}
          {activeTab === "ai" && <AIAssistant values={values} score={score} acceptedChallenges={acceptedChallenges} />}
        </div>
        
      </div>
    </section>
  );
}
