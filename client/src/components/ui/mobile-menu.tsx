import React, { useEffect } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-80 bg-[#0D0D0D] border-l border-[#333333] px-4 py-8"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-[#D4AF37] font-playfair text-2xl font-bold tracking-wider">
            TYCHE LUXE
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#F4F4F4] hover:text-[#D4AF37] hover:bg-transparent"
          >
            <X className="h-6 w-6" />
          </Button>
        </SheetHeader>

        <div className="space-y-6">
          <NavItem href="/" label="HOME" onClick={onClose} />
          <NavItem href="/#services" label="SERVICES" onClick={onClose} />
          <NavItem href="/#about" label="ABOUT" onClick={onClose} />
          <NavItem href="/#destinations" label="DESTINATIONS" onClick={onClose} />
          <NavItem href="/#booking" label="BOOK NOW" onClick={onClose} />
          <div className="pt-4">
            <Link href="/#contact">
              <Button
                onClick={onClose}
                className="w-full bg-[#D4AF37] hover:bg-opacity-80 text-[#0D0D0D] rounded text-sm font-medium"
              >
                CONTACT US
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-[#333333]">
          <p className="text-[#F4F4F4] opacity-60 text-sm">
            &copy; {new Date().getFullYear()} Tyche Luxe
          </p>
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
    <Link href={href}>
      <a
        className="block py-2 text-[#F4F4F4] hover:text-[#D4AF37] text-base font-medium transition-colors duration-300"
        onClick={onClick}
      >
        {label}
      </a>
    </Link>
  );
}
