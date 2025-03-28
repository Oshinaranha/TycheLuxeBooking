import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/ui/mobile-menu";
import { Menu } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full bg-[#0D0D0D] z-50 transition-all duration-300 ${
        isScrolled ? "bg-opacity-95 shadow-md" : "bg-opacity-90"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <a className="flex items-center">
              <span className="text-[#D4AF37] font-playfair text-2xl md:text-3xl font-bold tracking-wider">
                TYCHE LUXE
              </span>
            </a>
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
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink href="/" label="HOME" active={location === "/"} />
            <NavLink
              href="/#services"
              label="SERVICES"
              active={location.includes("/services") || location.includes("/service/")}
            />
            <NavLink href="/#about" label="ABOUT" active={false} />
            <NavLink href="/#destinations" label="DESTINATIONS" active={false} />
            <NavLink href="/#booking" label="BOOK NOW" active={false} />
            <Link href="/#contact">
              <Button className="bg-[#D4AF37] hover:bg-opacity-80 text-[#0D0D0D] px-6 py-2 rounded text-sm font-medium">
                CONTACT US
              </Button>
            </Link>
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
    <Link href={href}>
      <a
        className={`relative group text-[#F4F4F4] hover:text-[#D4AF37] text-sm font-medium transition-colors duration-300 ${
          active ? "text-[#D4AF37]" : ""
        }`}
      >
        {label}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
      </a>
    </Link>
  );
}
