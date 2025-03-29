import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { MagicButton } from '@/components/ui/magic-button';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedPrivateJet } from '@/components/AnimatedPrivateJet';
import { AnimatedYacht } from '@/components/AnimatedYacht';

// Real luxury vehicle images
const vehicleImages = {
  jet: [
    '/images/jet-1.png',
    '/images/jet-2.png',
  ],
  yacht: [
    '/images/yacht-1.png',
  ],
  helicopter: [
    '/images/helicopter-1.png',
  ],
  car: [
    '/images/car-1.png',
  ],
};

export default function LuxuryVehicleImageShowcase() {
  const [activeVehicle, setActiveVehicle] = useState<'jet' | 'yacht' | 'helicopter' | 'car'>('jet');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  // Auto-rotate through images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === vehicleImages[activeVehicle].length - 1 ? 0 : prev + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeVehicle]);

  // Reset image index when changing vehicle type
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeVehicle]);
  
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
            <div className="p-1 bg-gradient-to-r from-[#333333] via-[#D4AF37] to-[#333333] rounded-lg shadow-2xl">
              <div className="bg-[#111111] rounded-lg p-8 h-[600px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-grid-white-pattern rotate-12"></div>
                </div>
                
                {/* Show different animated vehicles based on selection */}
                {activeVehicle === 'jet' ? (
                  <motion.div 
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <AnimatedPrivateJet className="w-full h-full" />
                    
                    {/* Jet info overlay - positioned to not obscure the jet image */}
                    <div className="absolute bottom-12 left-8 right-8 p-5 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl text-white">
                      <h3 className="text-[#D4AF37] font-semibold mb-2 text-lg">Gulfstream G650</h3>
                      <p className="text-xs md:text-sm opacity-90">Experience unmatched comfort and speed with our flagship private jet. Travel up to 8,000 miles non-stop at Mach 0.9 with 14 passengers in ultimate luxury.</p>
                      <div className="flex justify-between mt-3 items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-[#D4AF37] text-xs">Range:</span>
                          <span className="text-white text-xs">8,000 miles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#D4AF37] text-xs">Speed:</span>
                          <span className="text-white text-xs">Mach 0.9</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#D4AF37] text-xs">Capacity:</span>
                          <span className="text-white text-xs">14 passengers</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : activeVehicle === 'yacht' ? (
                  <motion.div 
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <AnimatedYacht className="w-full h-full" />
                    
                    {/* Yacht info overlay */}
                    <div className="absolute bottom-12 left-8 right-8 p-5 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl text-white">
                      <h3 className="text-[#70AFE8] font-semibold mb-2 text-lg">Azimut Grande 35M</h3>
                      <p className="text-xs md:text-sm opacity-90">Indulge in maritime luxury with our flagship yacht. Featuring 5 luxurious cabins, expansive entertainment areas, and a crew of 6 dedicated to your comfort.</p>
                      <div className="flex justify-between mt-3 items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-[#70AFE8] text-xs">Length:</span>
                          <span className="text-white text-xs">35 meters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#70AFE8] text-xs">Cabins:</span>
                          <span className="text-white text-xs">5 luxury suites</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#70AFE8] text-xs">Max Speed:</span>
                          <span className="text-white text-xs">26 knots</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  // Show regular vehicle images for other types
                  vehicleImages[activeVehicle].map((src, index) => (
                    <motion.div 
                      key={src}
                      className="absolute inset-0 w-full h-full"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: index === currentImageIndex ? 1 : 0,
                        scale: index === currentImageIndex ? 1 : 1.05
                      }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    >
                      {/* Vehicle image */}
                      <div 
                        className="w-full h-full bg-center bg-no-repeat bg-cover rounded-lg"
                        style={{ 
                          backgroundImage: `url(${src})`,
                          filter: 'saturate(1.1) contrast(1.1)'
                        }}
                      />
                      
                      {/* Image loading fallback */}
                      <div className="absolute inset-0 flex items-center justify-center text-[#D4AF37] text-opacity-50">
                        {activeVehicle === 'helicopter' && 'Executive Helicopter Image'}
                        {activeVehicle === 'car' && 'Premium Supercar Image'}
                      </div>
                    </motion.div>
                  ))
                )}
                
                {/* Image navigation dots - only show for non-animated vehicles */}
                {activeVehicle !== 'jet' && activeVehicle !== 'yacht' && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {vehicleImages[activeVehicle].map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? 'bg-[#D4AF37] w-4' : 'bg-white bg-opacity-50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
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