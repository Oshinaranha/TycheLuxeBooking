import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { companyContact, socialLinks } from "@/lib/constants";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin,
  ArrowRight
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-[#F4F4F4]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-6">
              <span className="text-[#D4AF37] font-playfair text-2xl font-bold tracking-wider">
                TYCHE LUXE
              </span>
            </Link>
            <p className="text-[#F4F4F4] opacity-70 mb-6">
              Redefining luxury travel with exclusive access to the world's finest private jets, yachts, and exotic cars.
            </p>
            <div className="flex space-x-4">
              <SocialLink href={socialLinks.instagram} icon={<Instagram className="h-4 w-4" />} />
              <SocialLink href={socialLinks.facebook} icon={<Facebook className="h-4 w-4" />} />
              <SocialLink href={socialLinks.twitter} icon={<Twitter className="h-4 w-4" />} />
              <SocialLink href={socialLinks.linkedin} icon={<Linkedin className="h-4 w-4" />} />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <FooterLink href="/" label="Home" />
              <FooterLink href="/#services" label="Services" />
              <FooterLink href="/#about" label="About Us" />
              <FooterLink href="/#destinations" label="Destinations" />
              <FooterLink href="/#booking" label="Booking" />
              <FooterLink href="/#contact" label="Contact" />
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <ul className="space-y-4">
              <FooterLink href="/services/jet" label="Private Jets" />
              <FooterLink href="/services/yacht" label="Luxury Yachts" />
              <FooterLink href="/services/car" label="Exotic Cars" />
              <FooterLink href="/#booking" label="Concierge Services" />
              <FooterLink href="/#booking" label="Custom Experiences" />
              <FooterLink href="/#contact" label="VIP Events" />
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Subscribe</h4>
            <p className="text-[#F4F4F4] opacity-70 mb-4">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <div className="flex mb-4">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-[#333333] text-[#F4F4F4] border-0 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button className="bg-[#D4AF37] hover:bg-opacity-80 text-[#0D0D0D] rounded-l-none">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[#F4F4F4] opacity-70 text-sm">
              By subscribing, you agree to our{" "}
              <Link href="#" className="text-[#D4AF37] hover:underline">
                Privacy Policy
              </Link>{" "}
              and consent to receive updates from Tyche Luxe.
            </p>
          </div>
        </div>

        <div className="border-t border-[#333333] mt-12 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-[#F4F4F4] opacity-70 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Tyche Luxe. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link 
              href="#" 
              className="text-[#F4F4F4] opacity-70 hover:text-[#D4AF37] text-sm transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              className="text-[#F4F4F4] opacity-70 hover:text-[#D4AF37] text-sm transition-colors duration-300"
            >
              Terms of Service
            </Link>
            <Link 
              href="#" 
              className="text-[#F4F4F4] opacity-70 hover:text-[#D4AF37] text-sm transition-colors duration-300"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

function SocialLink({ href, icon }: SocialLinkProps) {
  return (
    <a
      href={href}
      className="text-[#F4F4F4] hover:text-[#D4AF37] transition-colors duration-300"
    >
      {icon}
    </a>
  );
}

interface FooterLinkProps {
  href: string;
  label: string;
}

function FooterLink({ href, label }: FooterLinkProps) {
  return (
    <li>
      <Link 
        href={href}
        className="text-[#F4F4F4] opacity-70 hover:text-[#D4AF37] transition-colors duration-300"
      >
        {label}
      </Link>
    </li>
  );
}
