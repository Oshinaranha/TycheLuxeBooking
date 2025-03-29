import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import gsap from 'gsap';
import luxuryJetImage from '@assets/image_1743231367967.png';

interface AnimatedPrivateJetProps {
  className?: string;
}

export function AnimatedPrivateJet({ className = '' }: AnimatedPrivateJetProps) {
  const controls = useAnimation();
  const jetRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  
  // Enhanced animation sequence
  useEffect(() => {
    // Create more elegant flying motion
    controls.start({
      y: [0, -8, 0, 8, 0],
      rotate: [0, -1, 0, 1, 0],
      transition: { 
        duration: 10, 
        repeat: Infinity, 
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1]
      }
    });
    
    // Enhanced cloud animations with staggered timing
    if (cloudsRef.current) {
      const cloudElements = Array.from(cloudsRef.current.children);
      
      cloudElements.forEach((cloud, index) => {
        const element = cloud as HTMLElement;
        const startX = element.style.right || '0px';
        const startValue = parseInt(startX) || 0;
        
        // Different speeds for different clouds
        const duration = 30 + (index % 3) * 8;
        
        gsap.fromTo(
          element,
          { right: startValue + '%' }, 
          { 
            right: '-100%', 
            duration: duration, 
            repeat: -1,
            ease: "power1.inOut",
            delay: index * 1.5
          }
        );
      });
    }
    
    // Add subtle rotation to the jet for more realism
    if (jetRef.current) {
      gsap.to(jetRef.current, {
        rotateY: 5,
        rotateX: 2,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
    
    // Simulate image loading
    const img = new Image();
    img.src = luxuryJetImage;
    img.onload = () => setLoaded(true);
    
    return () => {
      controls.stop();
      if (cloudsRef.current) {
        const cloudElements = Array.from(cloudsRef.current.children);
        gsap.killTweensOf(cloudElements);
      }
      if (jetRef.current) {
        gsap.killTweensOf(jetRef.current);
      }
    };
  }, [controls]);
  
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Premium sky gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2c3e50] via-[#3498db] to-[#9bc9ff]" />
      
      {/* Luxury ambiance overlay - golden hour effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f39c12] to-transparent opacity-20" />
      
      {/* Cloud layers with more natural shapes */}
      <div ref={cloudsRef} className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[55%] h-[18%] bg-white opacity-90 rounded-full blur-[10px]" style={{ right: '-55%', top: '15%' }} />
        <div className="absolute w-[65%] h-[15%] bg-white opacity-85 rounded-full blur-[12px]" style={{ right: '-35%', top: '50%' }} />
        <div className="absolute w-[75%] h-[22%] bg-white opacity-95 rounded-full blur-[8px]" style={{ right: '-75%', top: '30%' }} />
        <div className="absolute w-[60%] h-[20%] bg-white opacity-80 rounded-full blur-[15px]" style={{ right: '-60%', top: '70%' }} />
        <div className="absolute w-[50%] h-[16%] bg-white opacity-90 rounded-full blur-[10px]" style={{ right: '-50%', top: '25%' }} />
        <div className="absolute w-[45%] h-[12%] bg-white opacity-85 rounded-full blur-[10px]" style={{ right: '-45%', top: '85%' }} />
        <div className="absolute w-[70%] h-[20%] bg-white opacity-90 rounded-full blur-[12px]" style={{ right: '-70%', top: '40%' }} />
      </div>
      
      {/* Ambient lighting effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.2)]" />
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-yellow-100 rounded-full blur-3xl opacity-20" />
      </div>
      
      {/* Jet container with enhanced animations */}
      <motion.div
        ref={jetRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%]"
        animate={controls}
        initial={{ rotate: 0, y: 0 }}
        style={{ perspective: "1000px" }}
      >
        {/* Luxury Jet Image with fade-in effect */}
        <motion.div
          className="w-full h-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: loaded ? 1 : 0,
            scale: loaded ? 1 : 0.95
          }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src={luxuryJetImage} 
            alt="Luxury Private Jet"
            className="w-full h-full object-contain"
          />
        </motion.div>
        
        {/* Engine effects - enhanced with animated glow */}
        <motion.div 
          className="absolute left-[25%] top-[55%] w-[10%] h-[5%] bg-blue-200 rounded-full blur-lg"
          animate={{ 
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute left-[25%] top-[45%] w-[10%] h-[5%] bg-blue-200 rounded-full blur-lg"
          animate={{ 
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        />
        
        {/* Enhanced contrails with animated movement */}
        <div className="absolute left-0 top-1/2 w-full h-1 transform -translate-y-1/2">
          <motion.div 
            className="absolute left-[10%] h-full bg-white blur-sm"
            animate={{ 
              width: ["20%", "30%", "20%"],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Add reflection for water effect below */}
        <motion.div
          className="absolute bottom-[-50%] left-1/2 transform -translate-x-1/2 w-[70%] h-[50%] opacity-20 blur-[1px] flex justify-center"
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img 
            src={luxuryJetImage} 
            alt="" 
            className="h-full object-contain transform scale-y-[-1]"
          />
        </motion.div>
      </motion.div>
      
      {/* Gold accents for premium look */}
      <div className="absolute top-4 left-4 w-[20%] h-[1px] bg-[#D4AF37] opacity-70" />
      <div className="absolute top-4 right-4 w-[20%] h-[1px] bg-[#D4AF37] opacity-70" />
      <div className="absolute bottom-4 left-4 w-[20%] h-[1px] bg-[#D4AF37] opacity-70" />
      <div className="absolute bottom-4 right-4 w-[20%] h-[1px] bg-[#D4AF37] opacity-70" />
      
      {/* Luxurious text element */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs text-white font-light opacity-70">
          <span className="text-[#D4AF37]">Pilatus PC-24</span> Super Versatile Jet
        </div>
      </div>
    </div>
  );
}