import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@shared/schema";
import { ServiceCard } from "@/components/ui/service-card";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Services() {
  const { toast } = useToast();
  
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });
  
  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load services. Please try again.",
    });
  }
  
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
            <Link href="/services/jet">
              <a className="inline-block border-2 border-[#D4AF37] hover:bg-[#D4AF37] text-[#F4F4F4] hover:text-[#0D0D0D] px-6 py-3 rounded text-sm uppercase font-medium tracking-wider transition-all duration-300">
                View All Jets
              </a>
            </Link>
            <Link href="/services/yacht">
              <a className="inline-block border-2 border-[#D4AF37] hover:bg-[#D4AF37] text-[#F4F4F4] hover:text-[#0D0D0D] px-6 py-3 rounded text-sm uppercase font-medium tracking-wider transition-all duration-300">
                View All Yachts
              </a>
            </Link>
            <Link href="/services/car">
              <a className="inline-block border-2 border-[#D4AF37] hover:bg-[#D4AF37] text-[#F4F4F4] hover:text-[#0D0D0D] px-6 py-3 rounded text-sm uppercase font-medium tracking-wider transition-all duration-300">
                View All Cars
              </a>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
