import { useState } from 'react';
import { motion } from 'framer-motion';
import { SimpleJetViewer } from '../ui/simple-jet-viewer';
import { AnimatedPrivateJet } from '../AnimatedPrivateJet';
import { AnimatedYacht } from '../AnimatedYacht';

interface LuxuryVehicleModelProps {
  vehicleType: 'jet' | 'yacht' | 'helicopter' | 'car';
  className?: string;
}

export function LuxuryVehicleModel({ vehicleType, className = '' }: LuxuryVehicleModelProps) {
  const [isPremiumLoaded, setIsPremiumLoaded] = useState(false);
  
  if (vehicleType === 'jet') {
    return (
      <div className={`relative w-full h-full ${className}`}>
        {/* Use our premium jet viewer with luxury styling */}
        <div className="absolute inset-0" style={{ zIndex: isPremiumLoaded ? 10 : 0 }}>
          <SimpleJetViewer 
            className="w-full h-full" 
            onLoad={() => setIsPremiumLoaded(true)} 
          />
        </div>
        
        {/* Use the enhanced animation as fallback while premium content loads */}
        <motion.div 
          className="absolute inset-0" 
          style={{ zIndex: isPremiumLoaded ? 0 : 10 }}
          initial={{ opacity: 1 }}
          animate={{ opacity: isPremiumLoaded ? 0 : 1 }}
          transition={{ duration: 0.8 }}
        >
          <AnimatedPrivateJet className="w-full h-full" />
        </motion.div>
      </div>
    );
  }
  
  if (vehicleType === 'yacht') {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <AnimatedYacht className="w-full h-full" />
      </div>
    );
  }
  
  // Fallback for vehicle types without 3D/animated components
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <div className="text-gray-400">
        {vehicleType === 'helicopter' ? 'Helicopter visualization' : 'Car visualization'}
      </div>
    </div>
  );
}