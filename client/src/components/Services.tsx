import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@shared/schema";
import { ServiceCard } from "@/components/ui/service-card";
import { Link } from "wouter";
import { MagicButton } from "@/components/ui/magic-button";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Services() {
  const { toast } = useToast();
  
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });
  
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load services. Please try again.",
      });
    }
  }, [error, toast]);
  
  // Filter services by type
  const jets = services?.filter(service => service.type === 'jet').slice(0, 1);
  const yachts = services?.filter(service => service.type === 'yacht').slice(0, 1);
  const cars = services?.filter(service => service.type === 'car').slice(0, 1);
  
  // Combine the filtered services
  const featuredServices = [...(jets || []), ...(yachts || []), ...(cars || [])];
  
  return (
    <section id="services" className="py-20 bg-[#0D0D0D]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#D4AF37] font-cormorant text-xl uppercase tracking-widest mb-3">
            Our Services
          </p>
          <h2 className="text-[#F4F4F4] text-3xl md:text-4xl font-playfair font-bold">
            Exceptional Luxury Experiences
          </h2>
        </motion.div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#333333] rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : featuredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="booking-option"
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-[#F4F4F4]">No services found.</p>
          </div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/services/jet" className="block">
              <MagicButton 
                variant="outline" 
                className="w-full uppercase tracking-widest text-sm"
                glowColor="rgba(212, 175, 55, 0.4)"
              >
                View All Jets
              </MagicButton>
            </Link>
            <Link href="/services/yacht" className="block">
              <MagicButton 
                variant="outline" 
                className="w-full uppercase tracking-widest text-sm"
                glowColor="rgba(112, 175, 232, 0.4)"
              >
                View All Yachts
              </MagicButton>
            </Link>
            <Link href="/services/car" className="block">
              <MagicButton 
                variant="outline" 
                className="w-full uppercase tracking-widest text-sm"
                glowColor="rgba(212, 55, 55, 0.4)"
              >
                View All Cars
              </MagicButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
