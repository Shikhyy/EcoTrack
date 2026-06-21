"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CommunityTabProps {
  acceptedChallenges: number[];
  setAcceptedChallenges: (challenges: number[]) => void;
}

interface CommunityData {
  globalGoal: { title: string; description: string; targetKg: number; currentKg: number };
  challenges: { id: number; title: string; impact: string; joined: number; goal: number }[];
  localInitiatives: { title: string; distance: string; description: string }[];
}

export default function CommunityTab({ acceptedChallenges, setAcceptedChallenges }: CommunityTabProps) {
  const [data, setData] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [showLocalProjects, setShowLocalProjects] = useState(false);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const res = await fetch('/api/community');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch community data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunityData();
  }, []);

  const toggleChallenge = (id: number) => {
    if (acceptedChallenges.includes(id)) {
      setAcceptedChallenges(acceptedChallenges.filter(c => c !== id));
    } else {
      setAcceptedChallenges([...acceptedChallenges, id]);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-5xl font-medium text-[#1c1c1c] mb-4">Collective Impact</h2>
        <p className="text-xl text-black/50">Sustainability is a team effort. Complete challenges to amplify our global social good.</p>
      </motion.div>

      {/* Global Impact Goal */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1a6b8a] to-[#0d4a6b] text-white p-8 rounded-3xl shadow-xl mb-12 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1">
            <span className="uppercase tracking-widest text-sm font-bold text-white/60 mb-2 block">Monthly Global Goal</span>
            {loading ? (
              <div className="h-10 bg-white/20 rounded animate-pulse w-3/4 mb-2"></div>
            ) : (
              <h3 className="text-3xl font-medium mb-2">{data?.globalGoal?.title || 'Loading goal...'}</h3>
            )}
            {loading ? (
              <div className="h-4 bg-white/20 rounded animate-pulse w-full"></div>
            ) : (
              <p className="text-white/80">{data?.globalGoal?.description}</p>
            )}
          </div>
          <div className="w-full md:w-1/3">
            {loading ? (
              <div className="h-4 bg-white/20 rounded animate-pulse w-1/2 ml-auto mb-2"></div>
            ) : (
              <div className="flex justify-between text-sm mb-1 text-white/60">
                <span>Progress</span>
                <span>{((data?.globalGoal?.currentKg || 0) / (data?.globalGoal?.targetKg || 1) * 100).toFixed(1)}% Funded</span>
              </div>
            )}
            <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: loading ? '0%' : `${((data?.globalGoal?.currentKg || 0) / (data?.globalGoal?.targetKg || 1) * 100).toFixed(1)}%` }}></div>
            </div>
          </div>
        </div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      </motion.div>

      {/* Interactive Challenges */}
      <div className="mb-12">
        <h3 className="text-2xl font-medium text-[#1c1c1c] mb-6">Active Challenges</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="border bg-white/40 border-black/10 p-6 rounded-3xl animate-pulse h-[250px]"></div>
            ))
          ) : (
            data?.challenges?.map((challenge) => {
              const isAccepted = acceptedChallenges.includes(challenge.id);
              const progress = (challenge.joined / challenge.goal) * 100;
              return (
                <motion.div 
                  key={challenge.id}
                  whileHover={{ y: -4 }}
                  className={`border p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between ${
                    isAccepted ? "bg-[#2d8a4e]/10 border-[#2d8a4e]" : "bg-white/40 border-black/10 hover:border-black/30"
                  }`}
                >
                  <div>
                    <h4 className="text-xl font-medium text-[#1c1c1c] mb-1">{challenge.title}</h4>
                    <p className="text-sm font-bold text-[#2d8a4e] mb-4">{challenge.impact}</p>
                    
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-black/50 font-medium mb-1">
                        <span>{challenge.joined.toLocaleString()} joined</span>
                        <span>Goal: {challenge.goal.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1a6b8a] rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => toggleChallenge(challenge.id)}
                    className={`mt-4 w-full py-3 rounded-full text-sm font-medium transition-colors ${
                      acceptedChallenges.includes(challenge.id) 
                        ? 'bg-black text-white' 
                        : 'bg-white text-black hover:bg-black/5'
                    }`}
                    aria-label={acceptedChallenges.includes(challenge.id) ? `Opt out of ${challenge.title}` : `Join challenge: ${challenge.title}`}
                  >
                    {acceptedChallenges.includes(challenge.id) ? 'Joined (Tap to Leave)' : 'Join Challenge'}
                  </button>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/40 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-sm">
          <h3 className="text-2xl font-medium text-[#1c1c1c] mb-2 flex items-center gap-2">🌍 Global Pledges</h3>
          <p className="text-black/60 mb-6">Users worldwide committing to long-term sustainability habits.</p>
          <div className="text-5xl font-bold text-[#2d8a4e]">24,592 <span className="text-lg font-medium text-black/40">active pledges</span></div>
        </div>

        <div className="bg-[#1c1c1c] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-medium mb-2 flex items-center gap-2">🤝 Local Initiatives</h3>
            <p className="text-white/60 mb-8">Join community-driven reforestation and urban clean-up projects near you.</p>
          </div>
          
          <div className="relative z-10">
            {!showLocalProjects ? (
              <button 
                onClick={() => {
                  setIsLocating(true);
                  setTimeout(() => {
                    setIsLocating(false);
                    setShowLocalProjects(true);
                  }, 1500);
                }}
                className="w-full py-4 bg-white text-[#1c1c1c] rounded-full font-bold hover:bg-white/90 transition-colors disabled:opacity-70"
                disabled={isLocating}
              >
                {isLocating ? "Locating nearby projects..." : "Find Projects Near Me"}
              </button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-col gap-4"
              >
                {loading || !data?.localInitiatives ? (
                  <div className="text-white/60 text-sm">Loading local initiatives...</div>
                ) : (
                  data.localInitiatives.map((init, idx) => (
                    <div key={idx} className="bg-white/10 p-4 rounded-2xl border border-white/20">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">{init.title}</h4>
                        <span className="text-xs bg-[#2d8a4e] px-2 py-1 rounded-md font-bold">{init.distance}</span>
                      </div>
                      <p className="text-sm text-white/60 mb-3">{init.description}</p>
                      <button 
                        className="text-sm font-bold text-[#2d8a4e] hover:text-white transition-colors"
                        aria-label={`RSVP to ${init.title}`}
                      >
                        RSVP Now &rarr;
                      </button>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
