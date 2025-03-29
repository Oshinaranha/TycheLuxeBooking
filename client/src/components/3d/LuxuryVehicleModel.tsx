import { useState } from 'react';
import { motion } from 'framer-motion';
import { LuxuryJet3DViewer } from './LuxuryJet3DViewer';
import { AnimatedPrivateJet } from '../AnimatedPrivateJet';
import { AnimatedYacht } from '../AnimatedYacht';

interface LuxuryVehicleModelProps {
  vehicleType: 'jet' | 'yacht' | 'helicopter' | 'car';
  className?: string;
}

export function LuxuryVehicleModel({ vehicleType, className = '' }: LuxuryVehicleModelProps) {
  const [is3DLoaded, setIs3DLoaded] = useState(false);
  
  if (vehicleType === 'jet') {
    return (
      <div className={`relative w-full h-full ${className}`}>
        {/* Since 3D is having issues, we'll add a forceShowFallback flag */}
        {/* Use both components, with direct condition on opacity and z-index reversed */}
        <div className="absolute inset-0" style={{ zIndex: is3DLoaded ? 10 : 0 }}>
          <LuxuryJet3DViewer 
            className="w-full h-full" 
            onLoad={() => setIs3DLoaded(true)} 
          />
        </div>
        
        {/* Always show the 2D animation as fallback with opacity tied to 3D load state */}
        <motion.div 
          className="absolute inset-0" 
          style={{ zIndex: is3DLoaded ? 0 : 10 }}
          initial={{ opacity: 1 }}
          animate={{ opacity: is3DLoaded ? 0 : 1 }}
          transition={{ duration: 0.5 }}
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