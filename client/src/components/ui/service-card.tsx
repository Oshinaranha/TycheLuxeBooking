import { useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Service } from "@shared/schema";
import { servicePricing, serviceBookingText } from "@/lib/constants";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const priceLabel = service.type === 'jet' 
    ? `$${servicePricing.jet.toLocaleString()}/hour` 
    : `$${(service.type === 'yacht' ? servicePricing.yacht : servicePricing.car).toLocaleString()}/day`;
  
  const capacityLabel = service.capacity 
    ? `Up to ${service.capacity} ${service.type === 'jet' ? 'passengers' : 'guests'}`
    : 'Unlimited mileage';
  
  const featureLabel = service.type === 'jet' 
    ? 'Global range' 
    : service.type === 'yacht' 
      ? 'Full crew included' 
      : 'Driver optional';
  
  const bookingText = serviceBookingText[service.type as keyof typeof serviceBookingText];
  
  // Service type label with appropriate icon
  const typeLabel = {
    jet: "PRIVATE JET",
    yacht: "LUXURY YACHT", 
    car: "EXOTIC CAR"
  }[service.type];

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative glass-card rounded-none overflow-hidden transition-all duration-500 h-full border-0 shadow-xl flex flex-col"
    >
      {/* Type Label */}
      <div className="absolute top-4 left-0 z-10">
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm px-4 py-1 border-r border-[#D4AF37]/30">
          <span className="text-xs tracking-widest font-montserrat text-[#D4AF37]/80">
            {typeLabel}
          </span>
        </div>
      </div>
      
      {/* Image Section */}
      <div className="relative h-72 overflow-hidden">
        {/* Gold corner decoration */}
        <div className="absolute top-0 right-0 w-16 h-16 z-10 overflow-hidden opacity-60">
          <div className="absolute top-0 right-0 w-px h-12 bg-[#D4AF37]"></div>
          <div className="absolute top-0 right-0 h-px w-12 bg-[#D4AF37]"></div>
        </div>
        
        <motion.img
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            y: isHovered ? -5 : 0 
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          src={service.imageUrl}
          alt={service.name}
          className="object-cover h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent opacity-80"></div>
        
        {/* Gold decorative line */}
        <motion.div 
          className="absolute bottom-0 left-0 h-px w-0 bg-[#D4AF37]"
          animate={{ width: isHovered ? '100%' : '30%' }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        <div className="absolute bottom-4 left-6">
          <h3 className="text-[#F4F4F4] text-2xl font-playfair font-medium mb-1">
            {service.name}
          </h3>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex-grow p-6 sm:p-8 flex flex-col justify-between">
        {/* Description */}
        <p className="text-[#F4F4F4]/80 mb-6 font-montserrat text-sm leading-relaxed">
          {service.description}
        </p>
        
        {/* Divider */}
        <div className="divider-gold my-6 w-20 ml-0 transition-all duration-500 group-hover:w-32"></div>
        
        {/* Details */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[#F4F4F4]/60 text-xs uppercase tracking-widest font-montserrat">Starting from</span>
            <span className="text-gold-gradient text-xl font-medium font-cormorant">{priceLabel}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-[#F4F4F4]/70 font-montserrat">
            <div className="flex items-center">
              <div className="w-1 h-1 rounded-full bg-[#D4AF37] mr-2"></div>
              <span>{capacityLabel}</span>
            </div>
            <div className="flex items-center">
              <div className="w-1 h-1 rounded-full bg-[#D4AF37] mr-2"></div>
              <span>{featureLabel}</span>
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <Link 
          href={`/service/${service.id}`}
          className="group inline-flex items-center justify-between bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 px-6 py-3 text-sm uppercase tracking-wider font-medium transition-all duration-500 overflow-hidden relative"
        >
          <span className="z-10">{bookingText}</span>
          <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
          
          {/* Animated shine effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
        </Link>
      </div>
    </div>
  );
}
