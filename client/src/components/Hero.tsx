import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { HeroBackground } from "@/components/3d/HeroBackground";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Transform values for parallax effect
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  
  return (
    <section ref={heroRef} className="relative h-screen">
      <div className="absolute inset-0 bg-[#0D0D0D]">
        {/* 3D Background */}
        <HeroBackground />
        
        {/* Overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/30 to-[#0D0D0D]/70 z-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#0D0D0D] to-transparent z-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#0D0D0D] to-transparent z-20"></div>
        <div className="absolute top-10 right-10 hidden lg:block z-20">
          <div className="h-56 w-px bg-[#D4AF37] opacity-60"></div>
          <div className="h-px w-56 mt-2 bg-[#D4AF37] opacity-60"></div>
        </div>
        <div className="absolute bottom-10 left-10 hidden lg:block z-20">
          <div className="h-px w-56 mb-2 bg-[#D4AF37] opacity-60"></div>
          <div className="h-56 w-px bg-[#D4AF37] opacity-60"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative h-full flex flex-col justify-center z-30">
        <motion.div 
          className="vertical-text text-[#D4AF37] opacity-40 font-cormorant text-xl hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2"
          style={{ opacity: textOpacity }}
        >
          ESTABLISHED 2008 • EXCELLENCE IN LUXURY
        </motion.div>
        
        <motion.div 
          className="max-w-3xl"
          style={{ 
            y: textY,
            opacity: textOpacity
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 0.8 }}
            className="divider-gold mb-8"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-gold-gradient font-cormorant text-xl md:text-2xl mb-4 tracking-wide"
          >
            Elevate Your Journey
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#F4F4F4] text-4xl md:text-5xl lg:text-7xl font-playfair font-bold leading-tight mb-6"
          >
            Experience <span className="text-gold-gradient italic">Unparalleled</span> <br />
            <span className="relative">
              Luxury Travel
              <svg className="absolute -bottom-4 left-0 w-full h-3 opacity-60" viewBox="0 0 200 9">
                <path d="M0,5 Q40,0 80,5 T160,5 T240,5" fill="none" stroke="#D4AF37" strokeWidth="2" />
              </svg>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-[#F4F4F4] opacity-80 md:text-lg mb-8 max-w-2xl font-montserrat"
          >
            Indulge in the epitome of luxury with our exclusive fleet of private
            jets, yachts, and exotic cars. Where every journey becomes an
            interactive experience of distinction and refined elegance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <div className="magic-button relative overflow-hidden rounded-none inline-block group">
              <Link href="#booking">
                <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0D0D0D] px-8 py-6 rounded-none text-sm uppercase font-medium tracking-wider w-full sm:w-auto border-2 border-[#D4AF37] transition-all duration-300 z-10 relative">
                  Book Now
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <span className="absolute inset-0 bg-white/20 transform translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0"></span>
            </div>
            <div className="magic-border relative rounded-none overflow-hidden group">
              <Link href="#services">
                <Button variant="outline" className="border-2 border-[#F4F4F4] hover:border-[#D4AF37] text-[#F4F4F4] hover:text-[#D4AF37] bg-transparent px-8 py-6 rounded-none text-sm uppercase font-medium tracking-wider w-full sm:w-auto transition-all duration-300 relative z-10">
                  Explore Services
                </Button>
              </Link>
              <span className="absolute inset-0 border-2 border-[#D4AF37]/0 group-hover:border-[#D4AF37] transition-colors duration-500 rounded-none pointer-events-none"></span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-14 left-1/2 transform -translate-x-1/2 text-center z-30"
      >
        <div className="text-[#F4F4F4] hover:text-[#D4AF37] transition-colors duration-300 flex flex-col items-center">
          <p className="text-sm uppercase tracking-widest mb-2 font-montserrat">
            Discover More
          </p>
          <Link href="#services">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-[#D4AF37]/10 p-2 rounded-full cursor-pointer"
            >
              <ChevronDown className="h-6 w-6 text-[#D4AF37]" />
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
