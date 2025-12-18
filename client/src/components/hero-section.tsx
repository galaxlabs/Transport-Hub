import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, MapPin, Users, Plus, Star, Shield, Headphones, X } from "lucide-react";
import { locations, companyInfo } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";
import heroImage from "@assets/generated_images/makkah_holy_mosque_hero.png";

export function HeroSection() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [returnTrip, setReturnTrip] = useState(false);
  const [additionalStops, setAdditionalStops] = useState<string[]>([]);

  const handleAddStop = () => {
    if (additionalStops.length < 3) {
      setAdditionalStops([...additionalStops, ""]);
    }
  };

  const handleRemoveStop = (index: number) => {
    setAdditionalStops(additionalStops.filter((_, i) => i !== index));
  };

  const handleStopChange = (index: number, value: string) => {
    const newStops = [...additionalStops];
    newStops[index] = value;
    setAdditionalStops(newStops);
  };

  const handleGetQuote = () => {
    trackEvent("quote_request", "conversion", "hero_form");
    const message = encodeURIComponent(
      `Hello! I need a quote for:\n\nPickup: ${pickupLocation}\nDropoff: ${dropoffLocation}\nDate: ${date}\nTime: ${time}\nPassengers: ${passengers}\nReturn Trip: ${returnTrip ? "Yes" : "No"}${additionalStops.length > 0 ? `\nAdditional Stops: ${additionalStops.join(", ")}` : ""}`
    );
    window.open(`https://wa.me/${companyInfo.whatsapp}?text=${message}`, "_blank");
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="section-hero"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>Rated {companyInfo.rating}/5 by {companyInfo.reviews.toLocaleString()}+ pilgrims</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Premium <span className="text-primary">Umrah Taxi</span> Services in Saudi Arabia
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto lg:mx-0">
              Trusted transport for your sacred journey. Comfortable vehicles, licensed drivers, and 24/7 service from Jeddah to Makkah and Madinah.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Licensed Drivers</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">Top Rated</span>
              </div>
            </div>
          </div>

          <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-0">
            <CardContent className="p-6 md:p-8 space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Get Instant Quote</h2>
                <p className="text-sm text-muted-foreground">Book your ride in minutes</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup" className="text-sm font-medium">Pickup Location</Label>
                  <Select value={pickupLocation} onValueChange={setPickupLocation}>
                    <SelectTrigger id="pickup" className="w-full" data-testid="select-pickup">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select pickup location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {additionalStops.map((stop, index) => (
                  <div key={index} className="space-y-2 relative">
                    <Label className="text-sm font-medium">Stop {index + 1}</Label>
                    <div className="flex gap-2">
                      <Select value={stop} onValueChange={(value) => handleStopChange(index, value)}>
                        <SelectTrigger className="w-full" data-testid={`select-stop-${index}`}>
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Select stop location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStop(index)}
                        className="shrink-0"
                        data-testid={`button-remove-stop-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {additionalStops.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddStop}
                    className="w-full gap-2"
                    data-testid="button-add-stop"
                  >
                    <Plus className="w-4 h-4" />
                    Add Stop
                  </Button>
                )}

                <div className="space-y-2">
                  <Label htmlFor="dropoff" className="text-sm font-medium">Drop-off Location</Label>
                  <Select value={dropoffLocation} onValueChange={setDropoffLocation}>
                    <SelectTrigger id="dropoff" className="w-full" data-testid="select-dropoff">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select drop-off location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="pl-10"
                        data-testid="input-date"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm font-medium">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="pl-10"
                        data-testid="input-time"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="passengers" className="text-sm font-medium">Passengers</Label>
                    <Select value={passengers} onValueChange={setPassengers}>
                      <SelectTrigger id="passengers" className="w-full" data-testid="select-passengers">
                        <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Passenger" : "Passengers"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg border bg-background">
                    <Label htmlFor="return-trip" className="text-sm font-medium cursor-pointer">
                      Return Trip
                    </Label>
                    <Switch
                      id="return-trip"
                      checked={returnTrip}
                      onCheckedChange={setReturnTrip}
                      data-testid="switch-return-trip"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleGetQuote}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                  data-testid="button-get-quote"
                >
                  Get Quote via WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
