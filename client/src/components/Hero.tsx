import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen">
      <div className="absolute inset-0 bg-[#0D0D0D]">
        <img
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LXlhY2h0c3x8fHx8fDE3MTY1MDU3MjQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080"
          alt="Luxury yacht at sunset"
          className="object-cover w-full h-full opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/20 to-[#0D0D0D]/80"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#D4AF37] font-cormorant text-xl md:text-2xl mb-4 tracking-wide"
          >
            Elevate Your Journey
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#F4F4F4] text-4xl md:text-5xl lg:text-6xl font-playfair font-bold leading-tight mb-6"
          >
            Experience Unparalleled{" "}
            <span className="text-[#D4AF37]">Luxury Travel</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[#F4F4F4] md:text-lg mb-8 max-w-2xl"
          >
            Indulge in the epitome of luxury with our exclusive fleet of private
            jets, yachts, and exotic cars. Where every journey becomes a
            statement.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link href="#booking">
              <Button className="bg-[#D4AF37] hover:bg-opacity-80 text-[#0D0D0D] px-8 py-6 rounded text-sm uppercase font-medium tracking-wider w-full sm:w-auto">
                Book Now
              </Button>
            </Link>
            <Link href="#services">
              <Button variant="outline" className="border-2 border-[#F4F4F4] hover:border-[#D4AF37] text-[#F4F4F4] hover:text-[#D4AF37] bg-transparent px-8 py-6 rounded text-sm uppercase font-medium tracking-wider w-full sm:w-auto">
                Explore Services
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center"
      >
        <Link href="#services">
          <a className="text-[#F4F4F4] hover:text-[#D4AF37] transition-colors duration-300">
            <p className="text-sm uppercase tracking-widest mb-2">
              Discover More
            </p>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown className="mx-auto h-6 w-6" />
            </motion.div>
          </a>
        </Link>
      </motion.div>
    </section>
  );
}
