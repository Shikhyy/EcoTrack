"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { askEcoGuide } from '../../lib/agent';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAssistant({ values, score, acceptedChallenges }) {
  const [history, setHistory] = useState([
    { role: 'assistant', content: `Hi there! Based on your footprint of ${score} kg CO₂, what would you like help with today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, isTyping, scrollToBottom]);

  const handleSend = useCallback(async (messageText) => {
    if (!messageText.trim()) return;

    const userMsg = messageText;
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const context = { totalScore: score, ...values, acceptedChallenges };
      const recentHistory = history.slice(-8);
      const response = await askEcoGuide(context, recentHistory, userMsg);
      
      setHistory(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setError(err.message || "Connection issue — try again!");
    } finally {
      setIsTyping(false);
    }
  }, [score, values, acceptedChallenges, history]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-5xl font-medium text-[#1c1c1c] mb-4">EcoGuide AI</h2>
        <p className="text-xl text-black/50">Your personal sustainability consultant.</p>
      </motion.div>

      <div className="flex-1 bg-white/40 backdrop-blur-xl border border-white/50 rounded-[40px] shadow-sm flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
          <AnimatePresence initial={false}>
            {history.map((msg, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-5 rounded-3xl text-lg leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#1c1c1c] text-white rounded-br-sm' 
                      : 'bg-white/80 border border-white text-[#1c1c1c] rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white/80 border border-white text-[#1c1c1c] p-5 rounded-3xl rounded-bl-sm shadow-sm flex gap-2 items-center">
                  <motion.div className="w-2 h-2 bg-[#1c1c1c]/40 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-2 h-2 bg-[#1c1c1c]/40 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-2 h-2 bg-[#1c1c1c]/40 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                </div>
              </motion.div>
            )}
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="self-center bg-red-100 text-red-600 px-6 py-3 rounded-full text-sm font-bold shadow-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {history.length === 1 && !isTyping && (
          <div className="px-8 pb-4 flex flex-wrap gap-3">
            {["🚗 Transport tips", "🥗 Diet tips", "🌲 Tree offsets"].map(chip => (
              <button 
                key={chip}
                onClick={() => handleSend(chip)}
                className="bg-white/50 hover:bg-white border border-black/5 px-4 py-2 rounded-full text-sm font-medium text-[#1c1c1c] transition-colors shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <div className="p-6 bg-white/60 border-t border-black/5">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask EcoGuide anything..."
              disabled={isTyping}
              aria-label="Message to EcoGuide"
              className="w-full bg-white border border-black/10 rounded-full pl-6 pr-16 py-4 text-lg text-[#1c1c1c] placeholder-black/30 outline-none focus:ring-2 focus:ring-[#1c1c1c] focus:border-transparent transition-all shadow-sm disabled:opacity-50"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={isTyping || !input.trim()}
              aria-label="Send message"
              className="absolute right-3 bg-[#1c1c1c] text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-black/20 hover:scale-105 transition-all shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
