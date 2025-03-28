import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ServiceCard } from "@/components/ui/service-card";
import { Service } from "@shared/schema";
import { serviceTypeLabels } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

export default function Services() {
  const { type } = useParams<{ type: string }>();
  const { toast } = useToast();
  
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: [`/api/services/${type}`],
  });
  
  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load services. Please try again.",
    });
  }
  
  // If type is invalid, redirect to 404
  if (type && !["jet", "yacht", "car"].includes(type)) {
    return (
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-playfair font-bold text-center mb-6">Invalid Service Type</h2>
        <p className="text-center mb-6">Please select a valid service type.</p>
        <div className="flex justify-center">
          <Link href="/">
            <a className="text-[#D4AF37] hover:underline">Return to Home</a>
          </Link>
        </div>
      </div>
    );
  }
  
  const serviceTypeLabel = type ? serviceTypeLabels[type as keyof typeof serviceTypeLabels] : "";
  
  return (
    <div className="bg-[#F4F4F4] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <a className="inline-flex items-center text-[#0D0D0D] hover:text-[#D4AF37] transition-300 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </a>
          </Link>
          <h1 className="text-[#0D0D0D] text-3xl md:text-4xl font-playfair font-bold">
            Our {serviceTypeLabel} Collection
          </h1>
          <Separator className="mt-4 mb-6 bg-[#D4AF37] w-24 h-0.5" />
          <p className="text-[#333333] max-w-3xl">
            Discover our exclusive fleet of {type === 'jet' ? 'private jets' : type === 'yacht' ? 'luxury yachts' : 'exotic cars'} available for your next journey. Each has been carefully selected to provide an exceptional experience.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-[#333333]">No services found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
