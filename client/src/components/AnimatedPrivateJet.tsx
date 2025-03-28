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
        rotate: -1,
        y: 5,
        transition: { duration: 2 }
      });
      
      // Smooth flight motion - very subtle banking and elevation changes
      // to match the sleek, stable flight of a luxury jet
      controls.start({
        rotate: [-1, 0, 1, 0, -1] as any,
        y: [5, 0, -5, 0, 5] as any,
        x: [2, 0, -2, 0, 2] as any, // Add subtle horizontal movement
        transition: { 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1]
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
      {/* Sky background that matches the image */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#bacce9] to-[#d4e5f7]" />
      
      {/* Cloud layers - more fluffy and realistic */}
      <div ref={cloudsRef} className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[55%] h-[18%] bg-white opacity-90 rounded-full blur-[10px]" />
        <div className="absolute w-[65%] h-[15%] bg-white opacity-85 rounded-full blur-[12px]" />
        <div className="absolute w-[75%] h-[22%] bg-white opacity-95 rounded-full blur-[8px]" />
        <div className="absolute w-[60%] h-[20%] bg-white opacity-80 rounded-full blur-[15px]" />
        <div className="absolute w-[50%] h-[16%] bg-white opacity-90 rounded-full blur-[10px]" />
      </div>
      
      {/* Jet */}
      <motion.div
        ref={jetRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%]"
        animate={controls}
        initial={{ rotate: 0, y: 0 }}
      >
        {/* Luxury Jet Image */}
        <div
          className="w-full h-full bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage: "url('https://i.imgur.com/WDG2mXu.png')",
            backgroundSize: "contain"
          }}
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