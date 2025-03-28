import { motion } from "framer-motion";
import { testimonials } from "@/lib/constants";
import { TestimonialCard } from "@/components/ui/testimonial-card";

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#0D0D0D]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#D4AF37] font-cormorant text-xl uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="text-[#F4F4F4] text-3xl md:text-4xl font-playfair font-bold">
            What Our Clients Say
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
