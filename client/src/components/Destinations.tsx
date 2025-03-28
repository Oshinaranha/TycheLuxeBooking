import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Destination } from "@shared/schema";
import { DestinationCard } from "@/components/ui/destination-card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Destinations() {
  const { toast } = useToast();
  
  const { data: destinations, isLoading, error } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });
  
  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load destinations. Please try again.",
    });
  }
  
  return (
    <section id="destinations" className="py-20 bg-[#0F2C4D]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#D4AF37] font-cormorant text-xl uppercase tracking-widest mb-3">
            Premium Destinations
          </p>
          <h2 className="text-[#F4F4F4] text-3xl md:text-4xl font-playfair font-bold">
            Explore The Extraordinary
          </h2>
        </motion.div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#333333] rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : destinations && destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.slice(0, 3).map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <DestinationCard destination={destination} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-[#F4F4F4]">No destinations found.</p>
          </div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button className="border-2 border-[#D4AF37] hover:bg-[#D4AF37] text-[#F4F4F4] hover:text-[#0D0D0D] px-8 py-6 rounded text-sm uppercase font-medium tracking-wider bg-transparent">
            View All Destinations
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
