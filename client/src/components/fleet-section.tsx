import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, CarFront } from "lucide-react";
import { vehicles as fallbackVehicles } from "@/lib/data";
import { getPublicBookingContext, type PublicFleetOption } from "@/lib/tss";
import { trackEvent } from "@/lib/analytics";

function makeAssetUrl(value?: string) {
  if (!value) {
    return "";
  }
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  const base = (import.meta.env.VITE_FRAPPE_URL as string | undefined)?.replace(/\/$/, "") || "";
  return `${base}${value}`;
}

export function FleetSection() {
  const [fleet, setFleet] = useState<PublicFleetOption[]>([]);

  useEffect(() => {
    getPublicBookingContext(import.meta.env.VITE_TSS_BASE_COMPANY as string | undefined)
      .then((context) => setFleet(context.fleet || []))
      .catch(() => setFleet([]));
  }, []);

  const handleBookVehicle = (vehicleName: string) => {
    trackEvent("vehicle_book_click", "conversion", vehicleName);
    if (typeof window !== "undefined") {
      window.location.hash = "#home";
    }
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
            Vehicle categories and starting prices now come from the live TSS pricing and vehicle type setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {fleet.length
            ? fleet.map((vehicle) => (
                <Card
                  key={vehicle.name}
                  className="group overflow-visible transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  data-testid={`card-vehicle-${vehicle.name}`}
                >
                  {vehicle.image ? (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-muted">
                      <img
                        src={makeAssetUrl(vehicle.image)}
                        alt={vehicle.vehicle_model || vehicle.vehicle_type}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null}
                  <CardContent className="p-5 md:p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{vehicle.vehicle_type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.vehicle_make && vehicle.vehicle_model
                            ? `${vehicle.vehicle_make} ${vehicle.vehicle_model}`
                            : vehicle.vehicle_type_ar || vehicle.description}
                        </p>
                      </div>
                      <Badge className="bg-primary/90 backdrop-blur-sm">
                        {vehicle.category || "Transport"}
                      </Badge>
                    </div>

                    <div className="rounded-xl border bg-muted/30 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CarFront className="w-4 h-4 text-primary" />
                        <span>{vehicle.category || "Service Vehicle"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{vehicle.seating_capacity || "-"} seats</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {vehicle.description}
                    </p>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Starting from</p>
                        <p className="text-lg font-bold text-foreground">
                          {vehicle.starting_price} {vehicle.currency || "SAR"}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleBookVehicle(vehicle.vehicle_type)}
                        className="shrink-0"
                        data-testid={`button-book-${vehicle.name}`}
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            : fallbackVehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="group overflow-visible transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  data-testid={`card-vehicle-${vehicle.id}`}
                >
                  <CardContent className="p-5 md:p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{vehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">{vehicle.description}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{vehicle.category}</span>
                      <span>{vehicle.seats} seats</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{vehicle.pricePerKm} SAR/km</p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
}
