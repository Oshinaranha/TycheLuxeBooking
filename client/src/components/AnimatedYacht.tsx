import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import gsap from 'gsap';

interface AnimatedYachtProps {
  className?: string;
}

export function AnimatedYacht({ className = '' }: AnimatedYachtProps) {
  const controls = useAnimation();
  const yachtRef = useRef<HTMLDivElement>(null);
  const wavesRef = useRef<HTMLDivElement>(null);
  
  // Animation sequence
  useEffect(() => {
    // Gentle yacht bobbing and rocking animation
    controls.start({
      y: [0, -4, 0, -2, 0],
      rotate: [0, 1, 0, -1, 0],
      transition: { 
        duration: 8, 
        repeat: Infinity, 
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1]
      }
    });
    
    // Animate waves
    if (wavesRef.current) {
      const waveElements = Array.from(wavesRef.current.children);
      
      waveElements.forEach((wave, index) => {
        const element = wave as HTMLElement;
        
        gsap.to(element, { 
          x: index % 2 === 0 ? '-100%' : '100%', 
          duration: 12 + index * 3, 
          repeat: -1,
          ease: "sine.inOut",
          delay: index * 0.5
        });
      });
    }
    
    return () => {
      controls.stop();
      if (wavesRef.current) {
        const waveElements = Array.from(wavesRef.current.children);
        gsap.killTweensOf(waveElements);
      }
    };
  }, [controls]);
  
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Ocean background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0077be] to-[#00308F]" />
      
      {/* Waves */}
      <div ref={wavesRef} className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-[10%] top-[60%] bg-[#5ab9ea] opacity-40 rounded-[50%/100%] blur-[2px]" />
        <div className="absolute w-full h-[15%] top-[65%] bg-[#5ab9ea] opacity-30 rounded-[50%/100%] blur-[4px]" />
        <div className="absolute w-full h-[20%] top-[70%] bg-[#5ab9ea] opacity-20 rounded-[50%/100%] blur-[6px]" />
      </div>
      
      {/* Yacht */}
      <motion.div
        ref={yachtRef}
        className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%]"
        animate={controls}
        initial={{ rotate: 0, y: 0 }}
      >
        {/* Luxury Yacht Image */}
        <div
          className="w-full h-full bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage: "url('/images/vehicles/yacht.png')",
            backgroundSize: "contain"
          }}
        />
        
        {/* Wake effect */}
        <div className="absolute left-1/2 bottom-[-5%] w-[60%] h-[20%] bg-white opacity-30 rounded-full blur-md transform -translate-x-1/2" />
      </motion.div>
      
      {/* Sun reflection */}
      <div className="absolute top-[30%] right-[20%] w-[30%] h-[10%] bg-white rounded-full blur-2xl opacity-20" />
      
      {/* Horizon subtle glow */}
      <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-[#ffffff] opacity-30 blur-sm" />
    </div>
  );
}