import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { popularRoutes, companyInfo } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";

export function RoutesSection() {
  const handleBookRoute = (from: string, to: string, vehicleName: string, price: number) => {
    trackEvent("route_book_click", "conversion", `${from}-${to}`);
    const message = encodeURIComponent(
      `Hello! I would like to book the ${from} to ${to} route.\n\nVehicle: ${vehicleName}\nPrice: ${price} SAR`
    );
    window.open(`https://wa.me/${companyInfo.whatsapp}?text=${message}`, "_blank");
  };

  return (
    <section id="routes" className="py-16 md:py-24 bg-muted/30" data-testid="section-routes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="secondary" className="mb-4" data-testid="badge-routes">Popular Routes</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Most Requested Journeys
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pre-configured routes with fixed pricing. No hidden charges. Book instantly and travel with peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularRoutes.map((route) => (
            <Card
              key={route.id}
              className="group overflow-visible transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              data-testid={`card-route-${route.id}`}
            >
              <CardContent className="p-5 md:p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-200" />
                    <div className="w-0.5 h-8 bg-border" />
                    <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary/20" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">From</p>
                      <p className="font-semibold text-foreground" data-testid={`text-route-from-${route.id}`}>{route.from}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">To</p>
                      <p className="font-semibold text-foreground" data-testid={`text-route-to-${route.id}`}>{route.to}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-3 border-y border-border text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{route.distance}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                    <img
                      src={route.vehicleImage}
                      alt={route.vehicleName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{route.vehicleName}</p>
                    <p className="text-xs text-muted-foreground">Recommended vehicle</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <div>
                    <p className="text-2xl font-bold text-foreground" data-testid={`text-route-price-${route.id}`}>
                      {route.price} <span className="text-sm font-normal text-muted-foreground">SAR</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Fixed price</p>
                  </div>
                  <Button
                    onClick={() => handleBookRoute(route.from, route.to, route.vehicleName, route.price)}
                    className="gap-2"
                    data-testid={`button-book-route-${route.id}`}
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
