import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Destinations from "@/components/Destinations";
import BookingForm from "@/components/BookingForm";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div>
      <Hero />
      <Services />
      <About />
      <Destinations />
      <BookingForm />
      <Testimonials />
      <Contact />
    </div>
  );
}
