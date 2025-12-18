import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { FleetSection } from "@/components/fleet-section";
import { RoutesSection } from "@/components/routes-section";
import { ServicesSection } from "@/components/services-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { WhatsAppFAB } from "@/components/whatsapp-fab";

export default function Home() {
  return (
    <div className="min-h-screen bg-background" data-testid="page-home">
      <Navigation />
      <main>
        <HeroSection />
        <FleetSection />
        <RoutesSection />
        <ServicesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
