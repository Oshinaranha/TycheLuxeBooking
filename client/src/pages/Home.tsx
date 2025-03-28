import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Destinations from "@/components/Destinations";
import BookingForm from "@/components/BookingForm";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import LuxuryVehicleShowcase from "@/components/LuxuryVehicleShowcase";
import LuxuryVehicleImageShowcase from "@/components/LuxuryVehicleImageShowcase";

export default function Home() {
  return (
    <div>
      <Hero />
      <Services />
      <LuxuryVehicleImageShowcase />
      <About />
      <Destinations />
      <BookingForm />
      <Testimonials />
      <Contact />
    </div>
  );
}
