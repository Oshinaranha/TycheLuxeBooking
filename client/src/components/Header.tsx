import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/ui/mobile-menu";
import { Menu, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#D4AF37]/30 py-2" 
          : "bg-gradient-to-b from-[#0D0D0D]/90 to-transparent border-b border-transparent py-4"
      }`}
    >
      {/* Top bar with phone and language */}
      {!isScrolled && (
        <div className="hidden lg:block absolute top-0 left-0 w-full bg-[#0D0D0D]/80 backdrop-blur-md py-1">
          <div className="container mx-auto px-8 flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <a href="tel:+12345678900" className="flex items-center text-xs text-[#F4F4F4] hover:text-[#D4AF37] transition-colors duration-300">
                <PhoneCall className="h-3 w-3 mr-2" />
                <span>+1 (234) 567-8900</span>
              </a>
              <div className="h-3 w-px bg-[#D4AF37]/30"></div>
              <span className="text-xs text-[#F4F4F4]/60">24/7 CONCIERGE SERVICE</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-xs text-[#F4F4F4] hover:text-[#D4AF37] transition-colors duration-300">EN</a>
              <a href="#" className="text-xs text-[#F4F4F4]/60 hover:text-[#D4AF37] transition-colors duration-300">FR</a>
              <a href="#" className="text-xs text-[#F4F4F4]/60 hover:text-[#D4AF37] transition-colors duration-300">DE</a>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center relative z-10">
            <div className="overflow-hidden">
              <motion.span 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="font-cormorant text-gold-gradient text-2xl md:text-3xl font-bold tracking-wider flex items-center"
              >
                <span className="mr-2">TYCHE</span>
                <div className="hidden md:block h-px w-6 bg-[#D4AF37]"></div>
                <span className="ml-2">LUXE</span>
              </motion.span>
            </div>
          </Link>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-[#F4F4F4] hover:text-[#D4AF37] hover:bg-transparent"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center space-x-8 px-6 relative">
              {/* Golden background line that expands on hover */}
              <div className="absolute bottom-0 left-0 h-px w-full bg-[#D4AF37]/10"></div>
              
              <NavLink href="/" label="HOME" active={location === "/"} />
              <NavLink
                href="/#services"
                label="SERVICES"
                active={location.includes("/services") || location.includes("/service/")}
              />
              <NavLink href="/#about" label="ABOUT" active={false} />
              <NavLink href="/#destinations" label="DESTINATIONS" active={false} />
              <NavLink href="/#booking" label="BOOK NOW" active={false} />
            </div>
            
            <div className="ml-8">
              <Link href="/#contact" className="gold-shine">
                <Button className="bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 px-6 py-2 rounded-none text-sm uppercase tracking-wider font-medium">
                  CONTACT US
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  active: boolean;
}

function NavLink({ href, label, active }: NavLinkProps) {
  return (
    <Link 
      href={href}
      className={`relative group py-2 text-[#F4F4F4] hover:text-[#D4AF37] text-xs font-medium tracking-widest transition-colors duration-300 ${
        active ? "text-[#D4AF37]" : ""
      }`}
    >
      {label}
      <span className={`absolute -bottom-[1px] left-0 h-px bg-[#D4AF37] transition-all duration-500 ${
        active ? "w-full" : "w-0 group-hover:w-full"
      }`} />
    </Link>
  );
}
