import { useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Service } from "@shared/schema";
import { servicePricing, serviceBookingText } from "@/lib/constants";
import { MagicCard } from "@/components/ui/magic-card";
import { MagicButton } from "@/components/ui/magic-button";

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

  // Different glow colors for different service types
  const glowColors = {
    jet: "rgba(212, 175, 55, 0.4)",
    yacht: "rgba(112, 175, 232, 0.4)",
    car: "rgba(212, 55, 55, 0.4)",
  };
  
  return (
    <MagicCard 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aspectRatio="portrait"
      glowColor={glowColors[service.type as keyof typeof glowColors] || glowColors.jet}
      className="h-full"
    >
      {/* Type Label */}
      <div className="absolute top-4 left-0 z-10">
        <div className="magic-border bg-black/80 backdrop-blur-sm px-4 py-1 border-r border-[#D4AF37]/30">
          <span className="text-xs tracking-widest font-montserrat magic-text">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80"></div>
        
        {/* Gold decorative line */}
        <motion.div 
          className="absolute bottom-0 left-0 h-px w-0 bg-[#D4AF37]"
          animate={{ width: isHovered ? '100%' : '30%' }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        <div className="absolute bottom-4 left-6">
          <h3 className="text-white text-2xl font-playfair font-medium mb-1 magic-text">
            {service.name}
          </h3>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex-grow p-6 sm:p-8 flex flex-col justify-between bg-black/30 backdrop-blur-sm">
        {/* Description */}
        <p className="text-white/80 mb-6 font-montserrat text-sm leading-relaxed">
          {service.description}
        </p>
        
        {/* Divider */}
        <div className="divider-gold my-6 w-20 ml-0 transition-all duration-500 group-hover:w-32"></div>
        
        {/* Details */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <span className="text-white/60 text-xs uppercase tracking-widest font-montserrat">Starting from</span>
            <span className="magic-text text-xl font-medium font-cormorant">{priceLabel}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-white/70 font-montserrat">
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
        <Link href={`/service/${service.id}`} className="block">
          <MagicButton
            variant="outline"
            className="w-full justify-between uppercase tracking-widest text-sm"
            glowColor={glowColors[service.type as keyof typeof glowColors]}
          >
            <span>{bookingText}</span>
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </MagicButton>
        </Link>
      </div>
    </MagicCard>
  );
}
