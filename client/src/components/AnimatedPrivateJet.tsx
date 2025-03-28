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
  
  // Animation sequence - simplified for reliability
  useEffect(() => {
    // Simple flight animation with subtle movement
    controls.start({
      y: [0, -5, 0, 5, 0],
      rotate: [0, -0.5, 0, 0.5, 0],
      transition: { 
        duration: 12, 
        repeat: Infinity, 
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1]
      }
    });
    
    // Simple cloud animations with explicit positioning
    if (cloudsRef.current) {
      const cloudElements = Array.from(cloudsRef.current.children);
      
      cloudElements.forEach((cloud, index) => {
        const element = cloud as HTMLElement;
        const startX = element.style.right || '0px';
        const startValue = parseInt(startX) || 0;
        
        gsap.fromTo(
          element,
          { right: startValue + '%' }, 
          { 
            right: '-100%', 
            duration: 20 + (index * 5), 
            repeat: -1,
            ease: "none",
            delay: index
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
      
      {/* Cloud layers - properly positioned at different starting points */}
      <div ref={cloudsRef} className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[55%] h-[18%] bg-white opacity-90 rounded-full blur-[10px]" style={{ right: '-55%', top: '15%' }} />
        <div className="absolute w-[65%] h-[15%] bg-white opacity-85 rounded-full blur-[12px]" style={{ right: '-35%', top: '50%' }} />
        <div className="absolute w-[75%] h-[22%] bg-white opacity-95 rounded-full blur-[8px]" style={{ right: '-75%', top: '30%' }} />
        <div className="absolute w-[60%] h-[20%] bg-white opacity-80 rounded-full blur-[15px]" style={{ right: '-60%', top: '70%' }} />
        <div className="absolute w-[50%] h-[16%] bg-white opacity-90 rounded-full blur-[10px]" style={{ right: '-50%', top: '25%' }} />
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
            backgroundImage: "url('/images/vehicles/private-jet.png')",
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