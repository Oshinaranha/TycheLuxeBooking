import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
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
  
  return (
    <Card 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-[#333333] rounded-lg overflow-hidden shadow-lg transition-all duration-300 h-full border-0"
    >
      <div className="relative h-64">
        <motion.img
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
          src={service.imageUrl}
          alt={service.name}
          className="object-cover h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-[#F4F4F4] text-2xl font-playfair font-bold">{service.name}</h3>
        </div>
      </div>
      <div className="p-6">
        <p className="text-[#F4F4F4] mb-6">{service.description}</p>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-[#F4F4F4] text-sm">Starting from</span>
            <span className="text-[#D4AF37] font-medium">{priceLabel}</span>
          </div>
          <div className="flex justify-between text-xs text-[#F4F4F4]">
            <span>{capacityLabel}</span>
            <span>{featureLabel}</span>
          </div>
        </div>
        <Link href={`/service/${service.id}`}>
          <a className="block text-center bg-[#D4AF37] hover:bg-opacity-80 text-[#0D0D0D] px-6 py-2 rounded text-sm font-medium transition-all duration-300 uppercase tracking-wider">
            {bookingText}
          </a>
        </Link>
      </div>
    </Card>
  );
}
