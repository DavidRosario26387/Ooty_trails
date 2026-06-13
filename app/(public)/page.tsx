import Hero from "@/components/public/Hero";
import Services from "@/components/public/Services";
import WhyUs from "@/components/public/WhyUs";
import VehicleCategories from "@/components/public/VehicleCategories";
import FleetAvailability from "@/components/public/FleetAvailability";
import Destinations from "@/components/public/Destinations";
import Testimonials from "@/components/public/Testimonials";
import CTASection from "@/components/public/CTASection";
import ContactSection from "@/components/public/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <WhyUs />
      <VehicleCategories />
      <FleetAvailability compact />
      <Destinations />
      <Testimonials />
      <CTASection />
      <ContactSection />
    </>
  );
}
