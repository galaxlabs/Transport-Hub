import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, Package } from "lucide-react";
import { vehicles, companyInfo } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";

export function FleetSection() {
  const handleBookVehicle = (vehicleName: string) => {
    trackEvent("vehicle_book_click", "conversion", vehicleName);
    const message = encodeURIComponent(`Hello! I would like to book a ${vehicleName} for my trip.`);
    window.open(`https://wa.me/${companyInfo.whatsapp}?text=${message}`, "_blank");
  };

  return (
    <section id="vehicles" className="py-16 md:py-24 bg-background" data-testid="section-fleet">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="secondary" className="mb-4" data-testid="badge-fleet">Our Fleet</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Perfect Vehicle
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From comfortable sedans to luxury SUVs, we have the perfect vehicle for every journey. All vehicles are well-maintained and air-conditioned.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {vehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="group overflow-visible transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              data-testid={`card-vehicle-${vehicle.id}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-muted">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  data-testid={`img-vehicle-${vehicle.id}`}
                />
                <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm" data-testid={`badge-vehicle-category-${vehicle.id}`}>
                  {vehicle.category}
                </Badge>
              </div>
              <CardContent className="p-5 md:p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1" data-testid={`text-vehicle-name-${vehicle.id}`}>{vehicle.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-vehicle-desc-${vehicle.id}`}>{vehicle.description}</p>
                </div>

                <div className="flex items-center justify-between py-3 border-y border-border">
                  <div className="flex items-center gap-1.5" title="Passengers">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{vehicle.seats}</span>
                  </div>
                  <div className="flex items-center gap-1.5" title="Checked Luggage">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{vehicle.checkedLuggage}</span>
                  </div>
                  <div className="flex items-center gap-1.5" title="Cabin Bags">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{vehicle.cabinBags}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Starting from</p>
                    <p className="text-lg font-bold text-foreground" data-testid={`text-vehicle-price-${vehicle.id}`}>
                      {vehicle.pricePerKm} SAR<span className="text-sm font-normal text-muted-foreground">/km</span>
                    </p>
                  </div>
                  <Button
                    onClick={() => handleBookVehicle(vehicle.name)}
                    className="shrink-0"
                    data-testid={`button-book-${vehicle.id}`}
                  >
                    Book Now
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
