import React, { useEffect } from "react";
import { Link } from "wouter";
import { X, PhoneCall, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { motion } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Close the menu when the route changes
  useEffect(() => {
    if (isOpen) {
      const handleHashChange = () => {
        onClose();
      };

      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, [isOpen, onClose]);

  const menuItems = [
    { href: "/", label: "HOME" },
    { href: "/#services", label: "SERVICES" },
    { href: "/#about", label: "ABOUT" },
    { href: "/#destinations", label: "DESTINATIONS" },
    { href: "/#booking", label: "BOOK NOW" }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-96 bg-dark-gradient border-l border-[#D4AF37]/20 px-4 py-8 overflow-y-auto"
      >
        <SheetHeader className="mb-6 relative">
          <div className="flex items-center">
            <div className="h-10 w-px bg-[#D4AF37] opacity-60 mr-4"></div>
            <span className="font-cormorant text-gold-gradient text-2xl font-bold tracking-wider flex items-center">
              <span className="mr-2">TYCHE</span>
              <span className="ml-2">LUXE</span>
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-0 right-0 text-[#F4F4F4] hover:text-[#D4AF37] hover:bg-transparent"
          >
            <X className="h-5 w-5" />
          </Button>
        </SheetHeader>
        
        <div className="my-10">
          <div className="divider-gold mb-8" />
        </div>

        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05 * index, duration: 0.3 }}
            >
              <NavItem href={item.href} label={item.label} onClick={onClose} />
            </motion.div>
          ))}
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="pt-8"
          >
            <Link href="/#contact" className="gold-shine block">
              <Button
                onClick={onClose}
                className="w-full bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 px-8 py-6 rounded-none text-sm uppercase tracking-wider font-medium"
              >
                CONTACT US
              </Button>
            </Link>
          </motion.div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-[#D4AF37]/20">
          <div className="flex flex-col space-y-4">
            <a href="tel:+12345678900" className="flex items-center text-sm text-[#F4F4F4] hover:text-[#D4AF37] transition-colors duration-300">
              <PhoneCall className="h-4 w-4 mr-3 text-[#D4AF37]" />
              <span>+1 (234) 567-8900</span>
            </a>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="flex items-center text-sm text-[#F4F4F4] hover:text-[#D4AF37] transition-colors duration-300">
              <MapPin className="h-4 w-4 mr-3 text-[#D4AF37]" />
              <span>1234 Luxury Avenue, Beverly Hills, CA 90210</span>
            </a>
          </div>
          
          <div className="mt-8">
            <p className="text-[#F4F4F4]/40 text-xs tracking-wider font-montserrat">
              &copy; {new Date().getFullYear()} TYCHE LUXE • ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  onClick: () => void;
}

function NavItem({ href, label, onClick }: NavItemProps) {
  return (
    <Link 
      href={href}
      className="group block py-3 pl-4 border-l-2 border-transparent hover:border-[#D4AF37] transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="text-[#F4F4F4] font-cormorant text-2xl tracking-wide group-hover:text-gold-gradient transition-colors duration-300">
          {label}
        </span>
        <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500 mr-2">
          →
        </span>
      </div>
    </Link>
  );
}
