import { useEffect } from 'react';

interface SimpleJetViewerProps {
  className?: string;
  onLoad?: () => void;
}

export function SimpleJetViewer({ className = '', onLoad }: SimpleJetViewerProps) {
  // Use our premium jet image for the high-quality display
  const premiumJetImage = '/images/vehicles/jet/premium-jet.jpg'; // Updated path to use image from jet directory
  
  // Simple load effect
  useEffect(() => {
    // Notify when component is loaded
    if (onLoad) onLoad();
  }, [onLoad]);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Sleek background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#16213e]"></div>
      
      {/* Dynamic lighting effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#d4af37] opacity-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-5%] left-[-10%] w-[30%] h-[30%] bg-blue-400 opacity-10 blur-3xl rounded-full"></div>
      
      {/* Jet display area */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Jet image */}
        <div
          className="w-[80%] h-[80%] bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage: `url(${premiumJetImage})`
          }}
        />
        
        {/* Reflection effect */}
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[70%] h-[20%] bg-center bg-no-repeat bg-contain opacity-20 blur-[1px]"
          style={{
            backgroundImage: `url(${premiumJetImage})`,
            transform: "scaleY(-1)",
            backgroundPosition: "center top"
          }}
        />
        
        {/* Runways/stand markings */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-600 opacity-40" />
        <div className="absolute bottom-[1px] left-1/2 transform -translate-x-1/2 w-[40%] h-[1px] bg-[#D4AF37] opacity-30" />
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