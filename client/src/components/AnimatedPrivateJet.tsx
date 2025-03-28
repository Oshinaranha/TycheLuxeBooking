import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import gsap from 'gsap';

interface AnimatedPrivateJetProps {
  className?: string;
}

export function AnimatedPrivateJet({ className = '' }: AnimatedPrivateJetProps) {
  const controls = useAnimation();
  const jetRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  
  // Animation sequence
  useEffect(() => {
    const animateJet = async () => {
      // Initial state - jet slightly tilted
      await controls.start({
        rotate: -2,
        y: 10,
        transition: { duration: 2 }
      });
      
      // Smooth flight motion - slight banking and elevation changes
      controls.start({
        rotate: [-2, 0, 2, 0, -2] as any,
        y: [10, 0, -10, 0, 10] as any,
        transition: { 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }
      });
    };
    
    animateJet();
    
    // Animate clouds using GSAP for more complex animations
    if (cloudsRef.current) {
      const cloudElements = Array.from(cloudsRef.current.children);
      
      // Create different speeds for different cloud layers
      cloudElements.forEach((cloud, index) => {
        gsap.fromTo(
          cloud,
          { 
            x: index % 2 === 0 ? '100%' : '110%',
            y: `${10 + (index * 5)}%`,
            opacity: 0.6
          },
          { 
            x: '-110%', 
            opacity: 0.6, // Using a single opacity value to avoid type error
            duration: 20 + (index * 5), 
            repeat: -1,
            ease: "none",
            delay: index * 2
          }
        );
      });
    }
    
    return () => {
      controls.stop();
      if (cloudsRef.current) {
        const cloudElements = Array.from(cloudsRef.current.children);
        gsap.killTweensOf(cloudElements);
      }
    };
  }, [controls]);
  
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#a1c4fd] to-[#c2e9fb]" />
      
      {/* Cloud layers */}
      <div ref={cloudsRef} className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[60%] h-[15%] bg-white opacity-80 rounded-full blur-md" />
        <div className="absolute w-[40%] h-[10%] bg-white opacity-70 rounded-full blur-md" />
        <div className="absolute w-[70%] h-[20%] bg-white opacity-90 rounded-full blur-md" />
        <div className="absolute w-[50%] h-[15%] bg-white opacity-60 rounded-full blur-md" />
        <div className="absolute w-[45%] h-[12%] bg-white opacity-75 rounded-full blur-md" />
      </div>
      
      {/* Jet */}
      <motion.div
        ref={jetRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%]"
        animate={controls}
        initial={{ rotate: 0, y: 0 }}
      >
        {/* Jet image - use an actual private jet image */}
        <img 
          src="/images/jet-1.svg" 
          alt="Luxury Private Jet" 
          className="w-full h-full object-contain"
        />
        
        {/* Engine effects - subtle light glow */}
        <div className="absolute left-[25%] top-[55%] w-[10%] h-[5%] bg-blue-200 rounded-full blur-lg opacity-40" />
        <div className="absolute left-[25%] top-[45%] w-[10%] h-[5%] bg-blue-200 rounded-full blur-lg opacity-40" />
        
        {/* Contrails */}
        <div className="absolute left-0 top-1/2 w-full h-1 transform -translate-y-1/2">
          <div className="absolute left-[10%] w-[20%] h-full bg-white opacity-30 blur-sm" />
        </div>
      </motion.div>
      
      {/* Subtle sunlight effect */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-yellow-100 rounded-full blur-3xl opacity-20" />
    </div>
  );
}