import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@shared/schema";
import { servicePricing, serviceTypeLabels } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingForm from "@/components/BookingForm";

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const { data: service, isLoading, error } = useQuery<Service>({
    queryKey: [`/api/services/detail/${id}`],
  });
  
  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load service details. Please try again.",
    });
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        </div>
      </div>
    );
  }
  
  if (!service) {
    return (
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-playfair font-bold text-center mb-6">Service Not Found</h2>
        <p className="text-center mb-6">The service you are looking for does not exist or has been removed.</p>
        <div className="flex justify-center">
          <Link href="/">
            <a className="text-[#D4AF37] hover:underline">Return to Home</a>
          </Link>
        </div>
      </div>
    );
  }
  
  const serviceTypeLabel = serviceTypeLabels[service.type as keyof typeof serviceTypeLabels];
  const priceLabel = service.type === 'jet' 
    ? `$${servicePricing.jet.toLocaleString()}/hour` 
    : `$${(service.type === 'yacht' ? servicePricing.yacht : servicePricing.car).toLocaleString()}/day`;
  
  return (
    <div className="bg-[#F4F4F4]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-8">
          <Link href={`/services/${service.type}`}>
            <a className="inline-flex items-center text-[#0D0D0D] hover:text-[#D4AF37] transition-300 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {serviceTypeLabel}s
            </a>
          </Link>
          <h1 className="text-[#0D0D0D] text-3xl md:text-4xl font-playfair font-bold">
            {service.name}
          </h1>
          <Separator className="mt-4 mb-6 bg-[#D4AF37] w-24 h-0.5" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src={service.imageUrl} 
                alt={service.name}
                className="w-full h-[400px] object-cover"
              />
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-playfair font-bold mb-4">Description</h2>
              <p className="text-[#333333] mb-6">{service.description}</p>
              
              <h2 className="text-xl font-playfair font-bold mb-4">Features</h2>
              <ul className="space-y-2 mb-6">
                {service.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {service.capacity && (
                <div className="flex items-center text-[#333333] mb-6">
                  <Users className="h-5 w-5 mr-2 text-[#D4AF37]" />
                  <span>Capacity: {service.capacity} passengers</span>
                </div>
              )}
              
              <div className="flex items-center text-[#333333]">
                <Star className="h-5 w-5 mr-2 text-[#D4AF37]" />
                <span>5-star rated service</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg p-6 shadow-md mb-8">
              <h2 className="text-xl font-playfair font-bold mb-4">Booking Details</h2>
              
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <span className="text-[#333333]">Starting Price:</span>
                <span className="text-2xl font-bold text-[#D4AF37]">{priceLabel}</span>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">What's Included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0 mt-0.5" />
                    <span>Premium concierge service</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0 mt-0.5" />
                    <span>Dedicated customer support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0 mt-0.5" />
                    <span>Flexible scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#D4AF37] mr-2 flex-shrink-0 mt-0.5" />
                    <span>Luxury amenities</span>
                  </li>
                </ul>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-[#333333]">
                  Fill in the booking form below to begin your luxury experience with {service.name}.
                </p>
              </div>
              
              <a href="#booking-form">
                <Button className="w-full bg-[#D4AF37] hover:bg-opacity-80 text-[#0D0D0D] uppercase tracking-wider">
                  Book Now
                </Button>
              </a>
            </div>
            
            <div id="booking-form">
              <BookingForm preselectedType={service.type} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
