# Design Guidelines: Premium Umrah & Airport Taxi Service

## Design Approach

**Reference-Based Approach**: Drawing inspiration from successful transport booking platforms (Uber, Lyft, Grab) combined with hospitality booking services (Booking.com, Airbnb) to create a trustworthy, professional taxi service optimized for Umrah pilgrims and travelers in Saudi Arabia.

**Core Design Principles**:
- **Trust & Credibility**: Professional, polished aesthetic that instills confidence in booking
- **Cultural Sensitivity**: Respectful design suitable for religious pilgrimage context
- **Clarity & Efficiency**: Easy navigation to book rides quickly
- **Premium Service Feel**: Elevated design reflecting quality transportation

## Typography System

**Font Families** (Google Fonts via CDN):
- **Primary**: Inter (headings, UI elements) - Clean, modern, highly readable
- **Secondary**: Open Sans (body text) - Professional, warm, excellent for longer content
- **Accent**: Poppins (pricing, CTAs) - Bold, attention-grabbing for key information

**Type Scale**:
- Hero Headline: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section Headings: text-3xl md:text-4xl, font-bold
- Subsections: text-2xl md:text-3xl, font-semibold
- Card Titles: text-xl font-semibold
- Body: text-base md:text-lg
- Small/Meta: text-sm

## Layout System

**Spacing Units**: Use Tailwind spacing: 4, 6, 8, 12, 16, 20, 24, 32 for consistency
- Component padding: p-6 md:p-8
- Section spacing: py-16 md:py-24
- Container max-width: max-w-7xl mx-auto
- Grid gaps: gap-6 md:gap-8

**Grid System**:
- Vehicle Fleet: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Popular Routes: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Features/Services: grid-cols-1 md:grid-cols-3
- Testimonials: Horizontal carousel with 1-3 visible cards

## Component Library

### Navigation
- **Sticky header** with logo (left), navigation links (center), WhatsApp/Book Now CTA (right)
- Mobile: Hamburger menu with slide-in drawer
- Include: Home, Vehicles, Routes, About, Contact

### Hero Section
**Large Background Image**: Professional photo of luxury vehicle in front of Makkah or Madinah holy sites
- Full viewport height (min-h-screen)
- Gradient overlay for text contrast
- **Embedded Quote Calculator** (prominent white card):
  - Pickup location dropdown with location icon
  - Multiple stops support (+ Add Stop button)
  - Drop-off location dropdown
  - Date picker with calendar icon
  - Time selector
  - Return trip toggle
  - Large "Get Quote" primary button
- Headline above/beside calculator: "Premium Umrah Taxi Services" or similar
- Subheading emphasizing trust: "Licensed Drivers • 24/7 Service • 4.8★ Rating"

### Vehicle Fleet Cards
Each vehicle card includes:
- **Vehicle image** (side profile, clean background)
- Vehicle name and category (e.g., "Toyota Camry - Saloon")
- Key specs with icons:
  - Seating capacity (Users icon)
  - Checked luggage (Briefcase icon)
  - Cabin bags (Backpack icon)
- Brief description of company/features
- Pricing indicator or "Book Now" button
- Clean card design with subtle shadow, rounded corners (rounded-xl)

### Popular Routes Section
- Grid of pre-configured route cards
- Each card shows:
  - Route name (e.g., "Jeddah Airport → Makkah Hotel")
  - Vehicle thumbnail image
  - Price in SAR prominently displayed
  - "Add to Cart" or "Book Now" button
- Carousel navigation (prev/next arrows) for mobile

### Services/Features
Three-column layout with icon cards:
- **Licensed Drivers**: Shield-check icon, emphasize safety and professionalism
- **24/7 Service**: Clock icon, highlight always-available booking
- **Top Rated**: Star icon, showcase 4.8/5 rating with review count

### Testimonials Carousel
- Customer testimonial cards with:
  - Star rating (5 stars displayed visually)
  - Quote text
  - Customer name and label ("Happy Customer" or "Verified Pilgrim")
  - Placeholder avatar image (user icon in circle)
- Auto-rotating carousel with manual controls
- 1 card mobile, 2-3 cards desktop

### WhatsApp Integration
- **Floating Action Button**: Fixed bottom-right position
- Green circular button with WhatsApp icon
- Subtle pulse animation to draw attention
- On click: Opens WhatsApp Web/App with pre-filled message
- Mobile: Direct app integration

### Contact Section
Two-column layout:
- **Left**: Contact form (Name, Email, Phone, Message, Submit button)
- **Right**: Contact information cards
  - Phone numbers with phone icons
  - Email with mail icon
  - Business hours with clock icon
  - WhatsApp contact button
  - Social media links (optional)

### Footer
Multi-column layout:
- Company info and logo
- Quick links (navigation)
- Popular routes
- Contact information
- Social media icons
- Copyright and links (Privacy Policy, Terms)

## Images

**Required Images**:

1. **Hero Background**: High-quality photo of premium vehicle (GMC or luxury sedan) positioned in front of recognizable Saudi landmark (Makkah Clock Tower or Prophet's Mosque in Madinah). Image should be 1920x1080px minimum, professionally shot with warm, inviting lighting. Apply 40% dark overlay for text readability.

2. **Vehicle Fleet Images** (6 vehicles):
   - Toyota Camry (side profile, white/silver)
   - Toyota Innova (side profile, white)
   - Toyota HiAce (side profile, white)
   - Hyundai Staria (side profile, white/gray)
   - GMC Yukon (side profile, black/dark)
   - Hyundai H1 (side profile, white)
   - All on clean white/light background, 800x600px

3. **Service Icons**: Use Lucide React icons instead of images (Shield-Check, Clock, Star)

4. **Testimonial Avatars**: Placeholder user icons (circular, Lucide User icon)

5. **Route Cards**: Small vehicle thumbnails (200x150px) matching fleet images

**Image Treatment**: 
- All vehicle images should have consistent lighting and angles
- Use subtle shadows (shadow-lg) on cards
- Rounded corners on all imagery (rounded-lg to rounded-xl)

## Interaction & Animation

**Minimal, Purposeful Animations**:
- Smooth scroll behavior for navigation
- Card hover: Subtle lift with shadow increase (transform translate-y-1, shadow-xl transition)
- Button hover: Slight scale (scale-105) and brightness increase
- WhatsApp FAB: Gentle continuous pulse (animate-pulse with reduced opacity)
- Carousel: Smooth slide transitions (transform transition-transform duration-500)
- Form focus states: Border highlight with subtle glow

**No Distracting Animations**: Avoid parallax, complex scroll-triggered animations, or excessive motion

## SEO & Meta Implementation

**Meta Tags Structure**:
- Title: "Premium Umrah Taxi Service Saudi Arabia | Makkah to Madinah Transport"
- Description: Compelling 155-character description emphasizing trust, 24/7 service, licensed drivers
- Open Graph tags for social sharing (og:title, og:description, og:image with vehicle/landmark)
- Twitter Card meta tags
- Canonical URL
- Language tag (en, with hreflang for future Arabic version)

**Structured Data** (JSON-LD):
- LocalBusiness schema with ratings, contact info, service areas
- Service schema for each vehicle type
- Review/Rating aggregate schema

**Google Search Console**: Add verification meta tag in <head>

**Google Analytics 4**: 
- Track page views, quote requests, booking clicks, WhatsApp interactions
- Event tracking on: Form submissions, route card clicks, vehicle selection, CTA buttons

## Accessibility

- All interactive elements have focus states with visible outline
- Form labels properly associated with inputs
- Icon buttons include aria-labels
- Images have descriptive alt text
- Color contrast meets WCAG AA standards (4.5:1 for text)
- Semantic HTML structure (header, nav, main, section, footer)