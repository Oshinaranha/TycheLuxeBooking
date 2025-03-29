import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';

interface PremiumJetViewerProps {
  className?: string;
  onLoad?: () => void;
}

export function PremiumJetViewer({ className = '', onLoad }: PremiumJetViewerProps) {
  const [currentAngle, setCurrentAngle] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);
  const controls = useAnimation();
  
  // Define the jet images for each angle (16 angles for smooth rotation)
  const jetImages = [
    '/images/vehicles/jet/angle-1.jpg',
    '/images/vehicles/jet/angle-2.jpg',
    '/images/vehicles/jet/angle-3.jpg',
    '/images/vehicles/jet/angle-4.jpg',
    '/images/vehicles/jet/angle-5.jpg',
    '/images/vehicles/jet/angle-6.jpg',
    '/images/vehicles/jet/angle-7.jpg',
    '/images/vehicles/jet/angle-8.jpg',
    '/images/vehicles/jet/angle-9.jpg',
    '/images/vehicles/jet/angle-10.jpg',
    '/images/vehicles/jet/angle-11.jpg',
    '/images/vehicles/jet/angle-12.jpg',
    '/images/vehicles/jet/angle-13.jpg',
    '/images/vehicles/jet/angle-14.jpg',
    '/images/vehicles/jet/angle-15.jpg',
    '/images/vehicles/jet/angle-16.jpg',
  ];
  
  // Use our premium jet image for the high-quality display
  const premiumJetImage = '/images/vehicles/jet/premium-jet.jpg';
  
  // Preload images and track loading progress
  useEffect(() => {
    let mounted = true;
    const totalImages = jetImages.length;
    let loadedCount = 0;
    
    // Use the premium jet image for now
    jetImages.forEach((src, index) => {
      const img = new Image();
      img.src = premiumJetImage; // Using our high-quality image
      
      img.onload = () => {
        if (!mounted) return;
        
        loadedCount++;
        setLoadedImages(loadedCount);
        
        // When all images are loaded
        if (loadedCount === totalImages) {
          setLoading(false);
          if (onLoad) onLoad();
          
          // Start auto-rotation
          controls.start({
            rotate: 360,
            transition: {
              duration: 30,
              ease: "linear",
              repeat: Infinity
            }
          });
        }
      };
      
      img.onerror = () => {
        if (!mounted) return;
        
        loadedCount++;
        setLoadedImages(loadedCount);
        
        if (loadedCount === totalImages) {
          setLoading(false);
          if (onLoad) onLoad();
        }
      };
    });
    
    return () => {
      mounted = false;
      controls.stop();
    };
  }, [jetImages, onLoad, controls]);
  
  // Handle drag to rotate
  const handleDragEnd = (info: any) => {
    const dragDistance = info.offset.x;
    const containerWidth = containerRef.current?.clientWidth || 1000;
    
    // Calculate how much to rotate based on drag distance
    const rotationChange = (dragDistance / containerWidth) * 360;
    
    // Update the current angle
    setCurrentAngle((prev) => {
      let newAngle = prev + rotationChange;
      
      // Ensure angle stays within 0-360 range
      while (newAngle >= 360) newAngle -= 360;
      while (newAngle < 0) newAngle += 360;
      
      return newAngle;
    });
  };
  
  // Calculate which image to show based on current angle
  const currentImageIndex = Math.floor((currentAngle / 360) * jetImages.length) % jetImages.length;
  
  // Custom controls with gold accents
  const ControlButton = ({ 
    icon, 
    onClick, 
    label 
  }: { 
    icon: React.ReactNode; 
    onClick: () => void; 
    label: string 
  }) => (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-2 bg-black bg-opacity-50 rounded-full backdrop-blur-sm group"
    >
      <div className="text-white group-hover:text-[#D4AF37] transition-colors duration-200">
        {icon}
      </div>
      <span className="text-xs mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">{label}</span>
    </button>
  );
  
  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Sleek background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#16213e]"></div>
      
      {/* Dynamic lighting effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#d4af37] opacity-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-5%] left-[-10%] w-[30%] h-[30%] bg-blue-400 opacity-10 blur-3xl rounded-full"></div>
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFF5CC]"
              initial={{ width: "0%" }}
              animate={{ width: `${(loadedImages / jetImages.length) * 100}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          <p className="text-[#D4AF37] mt-4 font-light">
            Loading Premium Jet View... {Math.round((loadedImages / jetImages.length) * 100)}%
          </p>
        </div>
      )}
      
      {/* Interactive jet display area */}
      <motion.div 
        className="relative w-full h-full flex items-center justify-center"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x: dragX }}
        animate={controls}
      >
        {/* Jet image */}
        <div
          className="w-[80%] h-[80%] bg-center bg-no-repeat bg-contain transform"
          style={{
            backgroundImage: `url(${premiumJetImage})`,
            transform: `rotate(${currentAngle}deg)`
          }}
        />
        
        {/* Reflection effect */}
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[70%] h-[20%] bg-center bg-no-repeat bg-contain opacity-20 blur-[1px]"
          style={{
            backgroundImage: `url(${premiumJetImage})`,
            transform: `rotate(${currentAngle}deg) scaleY(-1)`,
            backgroundPosition: "center top"
          }}
        />
        
        {/* Runways/stand markings */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-600 opacity-40" />
        <div className="absolute bottom-[1px] left-1/2 transform -translate-x-1/2 w-[40%] h-[1px] bg-[#D4AF37] opacity-30" />
      </motion.div>
      
      {/* Interactive controls */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-6 z-30">
        <div className="bg-black bg-opacity-30 backdrop-blur-sm px-4 py-2 rounded-full text-xs text-white">
          <span className="text-[#D4AF37]">Drag</span> to rotate
        </div>
      </div>
      
      {/* Jet specifications that appear as elegant overlays */}
      <div className="absolute top-6 left-6 max-w-[200px] bg-black bg-opacity-30 backdrop-blur-sm p-3 rounded-lg text-white opacity-70 hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-[#D4AF37] text-sm font-medium mb-1">Pilatus PC-24</h3>
        <div className="space-y-1 text-xs">
          <p>Range: <span className="text-[#D4AF37]">2,000 miles</span></p>
          <p>Speed: <span className="text-[#D4AF37]">440 knots</span></p>
          <p>Passengers: <span className="text-[#D4AF37]">8-10</span></p>
        </div>
      </div>
      
      {/* Luxurious golden accent lines */}
      <div className="absolute top-0 left-0 w-[30%] h-[2px] bg-gradient-to-r from-transparent to-[#D4AF37] opacity-70" />
      <div className="absolute top-0 right-0 w-[30%] h-[2px] bg-gradient-to-l from-transparent to-[#D4AF37] opacity-70" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[2px] bg-gradient-to-r from-transparent to-[#D4AF37] opacity-70" />
      <div className="absolute bottom-0 right-0 w-[30%] h-[2px] bg-gradient-to-l from-transparent to-[#D4AF37] opacity-70" />
    </div>
  );
}