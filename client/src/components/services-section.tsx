import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Star, CreditCard, MapPin, HeadphonesIcon } from "lucide-react";
import { companyInfo } from "@/lib/data";

const services = [
  {
    icon: Shield,
    title: "Licensed Drivers",
    description: "All our drivers are professionally licensed, background-checked, and trained to provide safe and courteous service.",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "We operate around the clock. Early morning flights or late night arrivals - we're always here for you.",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: Star,
    title: "Top Rated Service",
    description: `Rated ${companyInfo.rating}/5 by over ${companyInfo.reviews.toLocaleString()} happy pilgrims. Our reputation speaks for itself.`,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    icon: CreditCard,
    title: "Transparent Pricing",
    description: "No hidden fees or surge pricing. Get a fixed quote before booking and pay exactly what you see.",
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    icon: MapPin,
    title: "Meet & Greet",
    description: "Our drivers will meet you at the airport with a name board. Easy identification and quick pickup.",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "Multilingual customer support available via WhatsApp, phone, and email for all your queries.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 bg-background" data-testid="section-services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="secondary" className="mb-4" data-testid="badge-services">Why Choose Us</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Excellence in Every Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We go above and beyond to make your pilgrimage comfortable and stress-free. Here's what sets us apart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group overflow-visible transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              data-testid={`card-service-${index}`}
            >
              <CardContent className="p-6 md:p-8 text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl ${service.bgColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <service.icon className={`w-8 h-8 ${service.color}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground" data-testid={`text-service-title-${index}`}>{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed" data-testid={`text-service-desc-${index}`}>{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Ready to Book Your Ride?
            </h3>
            <p className="text-lg text-muted-foreground">
              Contact us now via WhatsApp for instant quotes and booking. Our team responds within minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-foreground font-medium">Instant Response</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-foreground font-medium">No Booking Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-foreground font-medium">Free Cancellation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
