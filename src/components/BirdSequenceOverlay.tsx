"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type SequenceState = "entrada" | "idle" | "idle2";

interface BirdSequenceOverlayProps {
  className?: string;
}

export default function BirdSequenceOverlay({ className = "" }: BirdSequenceOverlayProps) {
  const [activeSequence, setActiveSequence] = useState<SequenceState>("entrada");
  
  const entradaRef = useRef<HTMLVideoElement>(null);
  const idleRef = useRef<HTMLVideoElement>(null);
  const idle2Ref = useRef<HTMLVideoElement>(null);

  // Scroll animations for flying away
  const { scrollYProgress } = useScroll();
  // As the user scrolls from 60% to 90% (near the end of the hero section), 
  // the bird flies up and to the left, scaling down slightly
  const flyAwayX = useTransform(scrollYProgress, [0.6, 0.9], [0, -1500]);
  const flyAwayY = useTransform(scrollYProgress, [0.6, 0.9], [0, -800]);
  const flyAwayOpacity = useTransform(scrollYProgress, [0.7, 0.9], [1, 0]);
  const flyAwayScale = useTransform(scrollYProgress, [0.6, 0.9], [2.0, 1.0]);

  // We rely on the autoPlay attribute on the video tag for the initial entrance
  // to avoid browser autoplay restrictions, rather than calling play() in a useEffect.

  const handleEntradaEnd = () => {
    setActiveSequence("idle");
    if (idleRef.current) {
      idleRef.current.currentTime = 0;
      idleRef.current.muted = true;
      idleRef.current.play().catch(console.error);
    }
  };

  const handleIdleEnd = () => {
    // 30% chance to play idle2 instead of looping idle
    if (Math.random() > 0.7) {
      setActiveSequence("idle2");
      if (idle2Ref.current) {
        idle2Ref.current.currentTime = 0;
        idle2Ref.current.muted = true;
        idle2Ref.current.play().catch(console.error);
      }
    } else {
      if (idleRef.current) {
        idleRef.current.currentTime = 0;
        idleRef.current.muted = true;
        idleRef.current.play().catch(console.error);
      }
    }
  };

  const handleIdle2End = () => {
    setActiveSequence("idle");
    if (idleRef.current) {
      idleRef.current.currentTime = 0;
      idleRef.current.muted = true;
      idleRef.current.play().catch(console.error);
    }
  };

  const videoClass = "absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-2xl transition-opacity duration-500 -scale-x-100";

  return (
    <motion.div 
      className={`pointer-events-none z-20 ${className}`}
      style={{ x: flyAwayX, y: flyAwayY, opacity: flyAwayOpacity, scale: flyAwayScale }}
    >
      <video 
        ref={entradaRef}
        src="/imgs/bird-sequence-webm/bird-entrada.webm" 
        className={`${videoClass} ${activeSequence === "entrada" ? "opacity-100" : "opacity-0"}`} 
        playsInline 
        preload="auto" 
        autoPlay
        muted 
        onEnded={handleEntradaEnd}
      />
      <video 
        ref={idleRef}
        src="/imgs/bird-sequence-webm/bird-idle.webm" 
        className={`${videoClass} ${activeSequence === "idle" ? "opacity-100" : "opacity-0"}`} 
        playsInline 
        preload="auto" 
        muted 
        onEnded={handleIdleEnd}
      />
      <video 
        ref={idle2Ref}
        src="/imgs/bird-sequence-webm/bird-idle2.webm" 
        className={`${videoClass} ${activeSequence === "idle2" ? "opacity-100" : "opacity-0"}`} 
        playsInline 
        preload="auto" 
        muted 
        onEnded={handleIdle2End}
      />
    </motion.div>
  );
}
