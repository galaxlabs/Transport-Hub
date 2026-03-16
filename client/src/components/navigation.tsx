import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Car } from "lucide-react";
import { companyInfo } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#vehicles", label: "Our Fleet" },
  { href: "#routes", label: "Popular Routes" },
  { href: "#services", label: "Services" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (href: string) => {
    trackEvent("navigation_click", "navigation", href);
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWhatsAppClick = () => {
    trackEvent("whatsapp_header_click", "conversion", "header");
    const message = encodeURIComponent("Hello! I would like to book a taxi service.");
    window.open(`https://wa.me/${companyInfo.whatsapp}?text=${message}`, "_blank");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border"
          : "bg-transparent"
      }`}
      data-testid="header-navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 md:h-20">
          <a
            href="#home"
            className="flex items-center gap-2 group"
            onClick={(e) => { e.preventDefault(); handleNavClick("#home"); }}
            data-testid="link-logo"
          >
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-lg leading-tight ${isScrolled ? "text-foreground" : "text-white"}`}>
                Al-Haramain
              </span>
              <span className={`text-xs ${isScrolled ? "text-muted-foreground" : "text-white/80"}`}>
                Transport
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors hover-elevate ${
                  isScrolled
                    ? "text-foreground hover:text-primary"
                    : "text-white/90 hover:text-white"
                }`}
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="outline" className="gap-2 border-white/30 bg-white/90 text-slate-900 hover:bg-white" data-testid="button-signup-open">
              <Link href="/signup">Sign Up</Link>
            </Button>
            <a
              href={`tel:${companyInfo.phone}`}
              className={`flex items-center gap-2 text-sm font-medium ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
              data-testid="link-header-phone"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">{companyInfo.phone}</span>
            </a>
            <Button
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
              data-testid="button-header-whatsapp"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={isScrolled ? "text-foreground" : "text-white"}
                aria-label="Open menu"
                data-testid="button-mobile-menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0" data-testid="sheet-mobile-menu">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between gap-2 p-4 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <Car className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold" data-testid="text-mobile-brand">Al-Haramain Transport</span>
                  </div>
                </div>
                <nav className="flex flex-col p-4 gap-1" data-testid="nav-mobile">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className="flex items-center px-4 py-3 text-left font-medium rounded-lg hover-elevate"
                      data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
                <div className="mt-auto p-4 border-t space-y-3">
                  <Button asChild className="w-full" data-testid="button-mobile-signup">
                    <Link href="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                  </Button>
                  <a
                    href={`tel:${companyInfo.phone}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary"
                    data-testid="link-mobile-phone"
                  >
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="font-medium" data-testid="text-mobile-phone">{companyInfo.phone}</span>
                  </a>
                  <Button
                    onClick={handleWhatsAppClick}
                    className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                    data-testid="button-mobile-whatsapp"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Book via WhatsApp
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
