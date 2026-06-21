"use client";

import { motion } from "framer-motion";
import GlobalNav from "../../components/GlobalNav";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const articles = [
  {
    title: "The Future of Generative UI in Climate Tech",
    category: "Design",
    date: "Oct 12, 2026",
    size: "large"
  },
  {
    title: "Understanding Scope 3 Emissions",
    category: "Education",
    date: "Sep 28, 2026",
    size: "small"
  },
  {
    title: "EcoTrack Enterprise Launch",
    category: "Product",
    date: "Sep 15, 2026",
    size: "small"
  },
  {
    title: "Why Nuclear is Part of the Solution",
    category: "Science",
    date: "Aug 30, 2026",
    size: "medium"
  },
  {
    title: "Designing for Behavior Change",
    category: "Design",
    date: "Aug 12, 2026",
    size: "medium"
  }
];

export default function JournalPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#F4F3F0] text-[#1c1c1c] overflow-hidden selection:bg-black/10">
      <GlobalNav />
      
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-gradient-to-b from-[#E3E1D9]/80 to-[#F4F3F0]/0 blur-3xl -z-10 pointer-events-none" />

      <div className="pt-40 px-6 md:px-12 max-w-7xl mx-auto pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <span className="block text-black/40 text-sm font-medium tracking-widest uppercase mb-6">Journal</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8">
            Thoughts, insights, and <br/><span className="italic">updates</span> from the team.
          </h1>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {articles.map((article, i) => {
            const colSpan = article.size === 'large' ? 'md:col-span-8' : article.size === 'medium' ? 'md:col-span-6' : 'md:col-span-4';
            const height = article.size === 'large' ? 'h-[500px]' : 'h-[300px]';
            
            return (
              <motion.div 
                key={i} 
                variants={item} 
                className={`${colSpan} group relative w-full ${height} rounded-[2rem] bg-white/40 backdrop-blur-md border border-white/40 p-8 flex flex-col justify-between overflow-hidden hover:bg-white/60 transition-colors duration-500 cursor-pointer`}
              >
                {/* Image Placeholder Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-black/[0.05] group-hover:scale-105 transition-transform duration-700 ease-out -z-10" />
                
                <div className="flex justify-between items-center">
                  <span className="px-4 py-1.5 rounded-full bg-white/60 text-xs font-medium tracking-wide uppercase">
                    {article.category}
                  </span>
                  <span className="text-sm font-medium text-black/40">
                    {article.date}
                  </span>
                </div>

                <div>
                  <h3 className={`${article.size === 'large' ? 'text-4xl md:text-5xl' : 'text-2xl'} font-medium leading-tight group-hover:underline decoration-1 underline-offset-4`}>
                    {article.title}
                  </h3>
                </div>

                {/* Arrow Icon */}
                <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <button className="rounded-full border border-black/10 bg-transparent text-[#1c1c1c] px-8 py-4 text-sm font-medium tracking-wide hover:bg-black/5 transition-colors">
            Load More Articles
          </button>
        </motion.div>
      </div>
    </main>
  );
}
