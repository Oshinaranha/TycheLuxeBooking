import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Destination } from "@shared/schema";
import { Star, MapPin, ArrowRight } from "lucide-react";

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const ratingText = `${destination.rating/10}/5 Rating`;
  
  return (
    <Card className="bg-[#333333] rounded-lg overflow-hidden transition-all duration-300 border-0 h-full">
      <div className="relative h-64">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="object-cover h-full w-full"
        />
        <div className="absolute inset-0 gradient-overlay opacity-60 bg-gradient-to-b from-[#0D0D0D]/20 to-[#0D0D0D]/80"></div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-[#F4F4F4] text-2xl font-playfair font-bold">{destination.name}</h3>
          <p className="text-[#F4F4F4] text-sm">{destination.location}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-[#F4F4F4] text-sm mb-4">{destination.description}</p>
        <div className="flex justify-between text-xs text-[#F4F4F4] mb-6">
          <span className="flex items-center">
            <Star className="text-[#D4AF37] h-3 w-3 mr-1" />
            {ratingText}
          </span>
          <span className="flex items-center">
            <MapPin className="text-[#D4AF37] h-3 w-3 mr-1" />
            {destination.region}
          </span>
        </div>
        <a href="#" className="flex items-center justify-center text-[#D4AF37] hover:text-[#F4F4F4] font-medium transition-colors duration-300">
          <span className="mr-2">Discover More</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
}
