"use client";
import { useState, useMemo, useCallback } from "react";
import TrackTab from "./TrackTab";
import DashboardTab from "./DashboardTab";
import AIAssistant from "./ai/AIAssistant";
import CommunityTab from "./CommunityTab";

const TABS = [
  { id: "track", label: "1. Track" },
  { id: "dashboard", label: "2. Insights" },
  { id: "community", label: "3. Social Good" },
  { id: "ai", label: "4. EcoGuide AI" },
];

const DEFAULT_VALUES = {
  transport: 120,
  diet: 80,
  energy: 90,
  shopping: 50,
};

export default function AppInterface() {
  const [activeTab, setActiveTab] = useState("track");
  const [acceptedChallenges, setAcceptedChallenges] = useState<number[]>([]);
  const [values, setValues] = useState(DEFAULT_VALUES);

  // useMemo: only recalculate total score when values change
  const score = useMemo(
    () => Object.values(values).reduce((a, b) => a + b, 0),
    [values]
  );

  // useCallback: stable references for navigation handlers
  const goToDashboard = useCallback(() => setActiveTab("dashboard"), []);
  const goToCommunity = useCallback(() => setActiveTab("community"), []);

  return (
    <section
      id="app-interface"
      className="w-full bg-[#F4F3F0] text-[#1c1c1c] py-32 px-4 md:px-12 z-40 relative flex flex-col items-center border-t border-black/5"
      aria-label="Interactive Carbon Tracker"
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-16">
        
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-[#1c1c1c]/10 pb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Calculate &amp; <span className="font-serif italic text-black/50">Reduce</span>
            </h2>
            <p className="text-[#1c1c1c]/50 mt-4 text-lg">Interactive carbon intelligence platform.</p>
          </div>
          
          <nav
            className="flex bg-black/5 rounded-full p-2 border border-black/10 overflow-x-auto max-w-full"
            aria-label="App Navigation"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? "page" : undefined}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#1c1c1c] text-white shadow-md"
                    : "text-[#1c1c1c]/60 hover:text-[#1c1c1c] hover:bg-black/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px] w-full" aria-live="polite">
          {activeTab === "track" && (
            <TrackTab values={values} setValues={setValues} onNext={goToDashboard} />
          )}
          {activeTab === "dashboard" && (
            <DashboardTab values={values} score={score} onNext={goToCommunity} />
          )}
          {activeTab === "community" && (
            <CommunityTab
              acceptedChallenges={acceptedChallenges}
              setAcceptedChallenges={setAcceptedChallenges}
            />
          )}
          {activeTab === "ai" && (
            <AIAssistant values={values} score={score} acceptedChallenges={acceptedChallenges} />
          )}
        </div>
        
      </div>
    </section>
  );
}
