import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuxuryVehicleModel } from '@/components/3d/LuxuryVehicleModel';
import { MagicButton } from '@/components/ui/magic-button';
import { useIsMobile } from '@/hooks/use-mobile';

export default function LuxuryVehicleShowcase() {
  const [activeVehicle, setActiveVehicle] = useState<'jet' | 'yacht' | 'helicopter' | 'car'>('jet');
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const vehicles = [
    { 
      id: 'jet', 
      name: 'Private Jets',
      description: 'Experience unparalleled luxury in the skies with our private jet fleet, featuring the latest models from Gulfstream, Bombardier, and Dassault.',
      color: 'rgba(212, 175, 55, 0.4)'
    },
    { 
      id: 'yacht', 
      name: 'Luxury Yachts',
      description: 'Cruise the world\'s most beautiful waters in style aboard our collection of prestigious yachts from builders like Azimut, Ferretti, and Sunseeker.',
      color: 'rgba(112, 175, 232, 0.4)'
    },
    { 
      id: 'helicopter', 
      name: 'Helicopters',
      description: 'Avoid traffic and reach your destination with speed and elegance in our executive helicopters from Bell, Airbus, and Agusta.',
      color: 'rgba(104, 232, 176, 0.4)'
    },
    { 
      id: 'car', 
      name: 'Supercars',
      description: 'Turn heads on arrival with our exclusive collection of supercars from Ferrari, Lamborghini, Bugatti, and more.',
      color: 'rgba(232, 112, 112, 0.4)'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const scrollPosition = window.scrollY + window.innerHeight;
      
      // Add a parallax effect
      if (rect.top < scrollPosition) {
        const parallaxOffset = (scrollPosition - rect.top) * 0.1;
        containerRef.current.style.transform = `translateY(${Math.min(parallaxOffset, 50)}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <section className="py-24 bg-gradient-to-b from-[#0D0D0D] to-[#111111] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 mix-blend-overlay">
        <div className="absolute inset-0 bg-grid-pattern rotate-45 scale-150" />
      </div>
      
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#D4AF37] font-cormorant text-xl uppercase tracking-widest mb-3">
            Our Fleet
          </p>
          <h2 className="text-[#F4F4F4] text-3xl md:text-4xl font-playfair font-bold mb-6">
            Luxury Transportation
          </h2>
          <p className="text-[#A0A0A0] max-w-3xl mx-auto">
            Experience the epitome of luxury travel with our exceptional fleet of private jets, 
            yachts, helicopters, and supercars. Each vehicle is meticulously maintained and 
            comes with a professional crew dedicated to your comfort and safety.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-1 bg-gradient-to-r from-[#333333] via-[#D4AF37] to-[#333333] rounded-lg">
              <div className="bg-[#111111] rounded-lg p-8 h-[500px] flex items-center justify-center">
                <LuxuryVehicleModel vehicleType={activeVehicle} className="h-full" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-8"
          >
            {vehicles.map((vehicle, index) => (
              <motion.div 
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className={`p-6 rounded-lg transition-all duration-300 ${
                  activeVehicle === vehicle.id as any
                    ? 'bg-[#1A1A1A] shadow-lg transform -translate-x-2'
                    : 'bg-transparent'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <MagicButton
                    onClick={() => setActiveVehicle(vehicle.id as any)}
                    variant={activeVehicle === vehicle.id as any ? "default" : "outline"}
                    size="lg"
                    glowColor={vehicle.color}
                    className="min-w-[120px]"
                  >
                    {vehicle.name}
                  </MagicButton>
                  
                  <div className={`transition-opacity duration-300 ${
                    activeVehicle === vehicle.id as any ? 'opacity-100' : 'opacity-70'
                  }`}>
                    <p className={`text-[#F4F4F4] transition-opacity duration-300 ${
                      activeVehicle === vehicle.id as any ? 'opacity-100' : 'opacity-60'
                    }`}>
                      {vehicle.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <MagicButton
            size="lg"
            className="px-8 uppercase tracking-widest text-sm"
            glowColor="rgba(212, 175, 55, 0.4)"
          >
            Book Your Luxury Experience
          </MagicButton>
        </motion.div>
      </div>
    </section>
  );
}