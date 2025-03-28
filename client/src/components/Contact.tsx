import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { contactFormSchema, ContactFormValues } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { companyContact, socialLinks } from "@/lib/constants";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await apiRequest('POST', '/api/contact', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We'll get back to you shortly.",
        variant: "success",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while sending your message. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: ContactFormValues) => {
    mutate(data);
  };
  
  return (
    <section id="contact" className="py-20 bg-[#F4F4F4]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#D4AF37] font-cormorant text-xl uppercase tracking-widest mb-3">
              Contact Us
            </p>
            <h2 className="text-[#0D0D0D] text-3xl md:text-4xl font-playfair font-bold mb-6">
              Get In Touch
            </h2>
            <p className="text-[#333333] mb-8">
              Our dedicated concierge team is available 24/7 to assist with your inquiries and ensure your luxury experience exceeds all expectations.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <MapPin className="text-[#D4AF37] h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h4 className="text-[#0D0D0D] font-medium">Headquarters</h4>
                  <p className="text-[#333333]">{companyContact.address}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Phone className="text-[#D4AF37] h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h4 className="text-[#0D0D0D] font-medium">Phone</h4>
                  <p className="text-[#333333]">{companyContact.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="text-[#D4AF37] h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h4 className="text-[#0D0D0D] font-medium">Email</h4>
                  <p className="text-[#333333]">{companyContact.email}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h4 className="text-[#0D0D0D] font-medium mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href={socialLinks.instagram} 
                  className="w-10 h-10 rounded-full bg-[#0D0D0D] text-[#F4F4F4] flex items-center justify-center hover:bg-[#D4AF37] transition-colors duration-300"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a 
                  href={socialLinks.facebook} 
                  className="w-10 h-10 rounded-full bg-[#0D0D0D] text-[#F4F4F4] flex items-center justify-center hover:bg-[#D4AF37] transition-colors duration-300"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a 
                  href={socialLinks.twitter} 
                  className="w-10 h-10 rounded-full bg-[#0D0D0D] text-[#F4F4F4] flex items-center justify-center hover:bg-[#D4AF37] transition-colors duration-300"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a 
                  href={socialLinks.linkedin} 
                  className="w-10 h-10 rounded-full bg-[#0D0D0D] text-[#F4F4F4] flex items-center justify-center hover:bg-[#D4AF37] transition-colors duration-300"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <h3 className="text-[#0D0D0D] text-2xl font-playfair font-bold mb-6">
              Send Us a Message
            </h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-[#333333] font-medium mb-2">
                        Subject
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="How can we help you?"
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
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-[#333333] font-medium mb-2">
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="Your message here..."
                          {...field}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full bg-[#D4AF37] hover:bg-opacity-80 text-[#0D0D0D] px-6 py-3 rounded font-medium uppercase tracking-wider"
                >
                  {isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
