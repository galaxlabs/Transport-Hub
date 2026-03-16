import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { popularRoutes } from "@/lib/data";
import { getPublicBookingContext, type PublicRouteOption } from "@/lib/tss";
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

function formatDuration(minutes?: number) {
  if (!minutes) {
    return "On request";
  }
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (!hours) {
    return `${remaining} min`;
  }
  if (!remaining) {
    return `${hours}h`;
  }
  return `${hours}h ${remaining}m`;
}

function formatDistance(distance?: number) {
  if (!distance) {
    return "Custom route";
  }
  return `${distance} km`;
}

export function RoutesSection() {
  const [routes, setRoutes] = useState<PublicRouteOption[]>([]);

  useEffect(() => {
    getPublicBookingContext(import.meta.env.VITE_TSS_BASE_COMPANY as string | undefined)
      .then((context) => setRoutes(context.routes || []))
      .catch(() => setRoutes([]));
  }, []);

  const liveRoutes = routes.filter((route) => route.price || route.vehicle_type).slice(0, 6);

  const handleBookRoute = (route: PublicRouteOption) => {
    trackEvent("route_book_click", "conversion", `${route.source}-${route.destination}`);
    const target = typeof window !== "undefined" ? "#home" : "";
    if (target) {
      window.location.hash = target;
    }
  };

  const fallbackRoutes = popularRoutes.map((route) => ({
    id: route.id,
    from: route.from,
    to: route.to,
    price: route.price,
    duration: route.duration,
    distance: route.distance,
    vehicleName: route.vehicleName,
  }));

  return (
    <section id="routes" className="py-16 md:py-24 bg-muted/30" data-testid="section-routes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="secondary" className="mb-4" data-testid="badge-routes">Popular Routes</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Most Requested Journeys
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Live routes and pricing from TSS. Customers can sign up, select their trip, and save the booking on the same domain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveRoutes.length
            ? liveRoutes.map((route) => (
                <Card
                  key={route.name}
                  className="group overflow-visible transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  data-testid={`card-route-${route.name}`}
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
                          <p className="font-semibold text-foreground">{route.source}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">To</p>
                          <p className="font-semibold text-foreground">{route.destination}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 py-3 border-y border-border text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(route.estimated_duration_minutes)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{formatDistance(route.distance_km)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {route.vehicle_make && route.vehicle_model
                            ? `${route.vehicle_make} ${route.vehicle_model}`
                            : route.vehicle_type || route.vehicle_category || "Transport Service"}
                        </p>
                        <p className="text-xs text-muted-foreground">Live TSS pricing</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          {route.price || 0} <span className="text-sm font-normal text-muted-foreground">{route.currency || "SAR"}</span>
                        </p>
                      </div>
                    </div>

                    {route.vehicle_image ? (
                      <div className="rounded-xl border bg-muted/30 p-2">
                        <img
                          src={makeAssetUrl(route.vehicle_image)}
                          alt={route.vehicle_model || route.vehicle_type || route.route_title}
                          className="h-32 w-full rounded-lg object-cover"
                        />
                      </div>
                    ) : null}

                    <Button
                      onClick={() => handleBookRoute(route)}
                      className="w-full gap-2"
                      data-testid={`button-book-route-${route.name}`}
                    >
                      Book From Website
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            : fallbackRoutes.map((route) => (
                <Card
                  key={route.id}
                  className="group overflow-visible transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  data-testid={`card-route-${route.id}`}
                >
                  <CardContent className="p-5 md:p-6 space-y-4">
                    <div>
                      <p className="font-semibold text-foreground">{route.from}</p>
                      <p className="text-sm text-muted-foreground">{route.to}</p>
                    </div>
                    <div className="flex items-center gap-4 py-3 border-y border-border text-sm text-muted-foreground">
                      <span>{route.duration}</span>
                      <span>{route.distance}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 pt-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{route.vehicleName}</p>
                        <p className="text-xs text-muted-foreground">Fallback website data</p>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{route.price} <span className="text-sm font-normal text-muted-foreground">SAR</span></p>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
}
