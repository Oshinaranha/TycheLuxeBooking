import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { bookingFormSchema, BookingFormValues } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { serviceTypeOptions, servicePricing, serviceTypeLabels } from "@/lib/constants";
import { Check, Plane, Ship, Car } from "lucide-react";

interface BookingFormProps {
  preselectedType?: string;
}

export default function BookingForm({ preselectedType }: BookingFormProps = {}) {
  const { toast } = useToast();
  const [estimatedPrice, setEstimatedPrice] = useState<number>(
    preselectedType 
      ? (preselectedType === 'jet' 
          ? servicePricing.jet 
          : preselectedType === 'yacht' 
            ? servicePricing.yacht 
            : servicePricing.car)
      : servicePricing.jet
  );
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceType: preselectedType || "jet",
      startDate: "",
      endDate: "",
      departureLocation: "",
      destination: "",
      guests: 2,
      name: "",
      email: "",
      phone: "",
      specialRequests: "",
      estimatedPrice: estimatedPrice
    }
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      const response = await apiRequest('POST', '/api/bookings', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Submitted",
        description: "Our concierge team will contact you within 2 hours to finalize your booking.",
        variant: "success",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while submitting your booking. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: BookingFormValues) => {
    data.estimatedPrice = estimatedPrice;
    mutate(data);
  };
  
  // Update the estimated price based on service type selection
  const handleServiceTypeChange = (value: string) => {
    if (value === 'jet') {
      setEstimatedPrice(servicePricing.jet);
    } else if (value === 'yacht') {
      setEstimatedPrice(servicePricing.yacht);
    } else if (value === 'car') {
      setEstimatedPrice(servicePricing.car);
    }
  };
  
  return (
    <section id="booking" className="py-20 bg-[#F4F4F4] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#D4AF37] font-cormorant text-xl uppercase tracking-widest mb-3">
            Secure Your Experience
          </p>
          <h2 className="text-[#0D0D0D] text-3xl md:text-4xl font-playfair font-bold">
            Book Your Luxury Journey
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-1 bg-[#0F2C4D] p-8 lg:p-12">
              <h3 className="text-[#F4F4F4] text-2xl font-playfair font-bold mb-6">
                Reservation Details
              </h3>
              <p className="text-[#F4F4F4] opacity-80 mb-8">
                Complete the form to begin your journey into luxury. Our concierge
                team will contact you within 2 hours to finalize your booking.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="text-[#D4AF37] h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-[#F4F4F4] font-medium">Personalized Experience</h4>
                    <p className="text-[#F4F4F4] opacity-70 text-sm">Tailored to your preferences</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="text-[#D4AF37] h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-[#F4F4F4] font-medium">Flexible Scheduling</h4>
                    <p className="text-[#F4F4F4] opacity-70 text-sm">Travel on your terms</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="text-[#D4AF37] h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-[#F4F4F4] font-medium">Premium Concierge</h4>
                    <p className="text-[#F4F4F4] opacity-70 text-sm">24/7 dedicated service</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <p className="text-[#F4F4F4] font-medium mb-2">Have questions?</p>
                <a 
                  href="tel:+18001234567" 
                  className="text-[#D4AF37] hover:text-[#F4F4F4] transition-colors duration-300"
                >
                  +1 (800) 123-4567
                </a>
              </div>
            </div>
            
            <div className="lg:col-span-2 p-8 lg:p-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Service Type */}
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="block text-[#333333] font-medium mb-2">
                          Select Service
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleServiceTypeChange(value);
                            }}
                            defaultValue={field.value}
                            className="grid grid-cols-3 gap-4"
                          >
                            {serviceTypeOptions.map((option) => (
                              <div key={option.value} className="relative">
                                <RadioGroupItem
                                  value={option.value}
                                  id={`service-${option.value}`}
                                  className="absolute opacity-0"
                                />
                                <label
                                  htmlFor={`service-${option.value}`}
                                  className={`block text-center cursor-pointer border-2 ${
                                    field.value === option.value
                                      ? "border-[#D4AF37]"
                                      : "border-gray-200 hover:border-[#D4AF37]"
                                  } rounded p-4 transition-all duration-300`}
                                >
                                  {option.icon === "plane" && (
                                    <Plane className="h-6 w-6 mx-auto mb-2 text-[#0F2C4D]" />
                                  )}
                                  {option.icon === "ship" && (
                                    <Ship className="h-6 w-6 mx-auto mb-2 text-[#0F2C4D]" />
                                  )}
                                  {option.icon === "car" && (
                                    <Car className="h-6 w-6 mx-auto mb-2 text-[#0F2C4D]" />
                                  )}
                                  <p className="text-[#333333] font-medium">
                                    {option.label}
                                  </p>
                                </label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-[#333333] font-medium mb-2">
                            Start Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-[#333333] font-medium mb-2">
                            End Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Locations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="departureLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-[#333333] font-medium mb-2">
                            Departure Location
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="City or Airport"
                              {...field}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-[#333333] font-medium mb-2">
                            Destination
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="City or Airport"
                              {...field}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Number of People */}
                  <FormField
                    control={form.control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-[#333333] font-medium mb-2">
                          Number of Guests
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="50"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-[#333333] font-medium mb-2">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Smith"
                              {...field}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-[#333333] font-medium mb-2">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Phone Number */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-[#333333] font-medium mb-2">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 (123) 456-7890"
                            {...field}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Special Requests */}
                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-[#333333] font-medium mb-2">
                          Special Requests (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any specific requirements or preferences..."
                            rows={3}
                            {...field}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Estimated Price */}
                  <div className="bg-[#F4F4F4] rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#333333] font-medium">Estimated Price:</span>
                      <span className="text-[#D4AF37] text-xl font-bold">
                        ${estimatedPrice.toLocaleString()}
                        {form.watch("serviceType") === "jet" ? "/hour" : "/day"}
                      </span>
                    </div>
                    <p className="text-[#333333] text-xs mt-1">
                      Final price will be confirmed by our concierge team
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full bg-[#D4AF37] hover:bg-opacity-80 text-[#0D0D0D] px-6 py-6 rounded font-medium uppercase tracking-wider"
                  >
                    {isPending ? "Processing..." : "Request Booking"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
