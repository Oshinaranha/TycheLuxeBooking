import { Card } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  location: string;
  avatar: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="bg-[#333333] rounded-lg p-8 relative h-full border-0">
      <div className="text-[#D4AF37] text-5xl absolute -top-5 left-6 opacity-50">
        <QuoteIcon className="h-12 w-12" strokeWidth={1} />
      </div>
      <p className="text-[#F4F4F4] italic mb-6 relative z-10">
        {testimonial.quote}
      </p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-[#D4AF37]">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name}
            className="object-cover w-full h-full" 
          />
        </div>
        <div>
          <p className="text-[#F4F4F4] font-medium">{testimonial.name}</p>
          <p className="text-[#F4F4F4] opacity-70 text-sm">{testimonial.location}</p>
        </div>
      </div>
    </Card>
  );
}
