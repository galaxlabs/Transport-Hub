# Al-Haramain Transport - Premium Umrah Taxi Service

## Overview
A production-ready, beautiful single-page website for an Umrah and airport taxi service operating in Saudi Arabia. The website features a modern design inspired by successful transport booking platforms, with integrated WhatsApp booking, Google Analytics tracking, and comprehensive SEO optimization.

## Recent Changes
- **December 18, 2025**: Initial complete implementation
  - Created stunning hero section with quote calculator
  - Built vehicle fleet showcase with 6 vehicle types
  - Added popular routes booking grid with fixed pricing
  - Implemented testimonials carousel with customer reviews
  - Added services/features section highlighting key offerings
  - Created contact section with form and contact info
  - Implemented WhatsApp floating action button
  - Added Google Analytics 4 integration
  - Comprehensive SEO with meta tags, Open Graph, and JSON-LD structured data
  - Full responsive design with mobile menu

## Tech Stack
- **Frontend**: React 18 with TypeScript, Wouter for routing
- **Styling**: Tailwind CSS with custom design tokens, Shadcn UI components
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **State**: TanStack Query for data fetching
- **Analytics**: Google Analytics 4
- **Backend**: Express.js (minimal, ready for Frappe integration)

## Project Structure
```
client/
├── src/
│   ├── components/       # React components
│   │   ├── navigation.tsx
│   │   ├── hero-section.tsx
│   │   ├── fleet-section.tsx
│   │   ├── routes-section.tsx
│   │   ├── services-section.tsx
│   │   ├── testimonials-section.tsx
│   │   ├── contact-section.tsx
│   │   ├── footer.tsx
│   │   ├── whatsapp-fab.tsx
│   │   └── ui/           # Shadcn UI components
│   ├── hooks/
│   │   └── use-analytics.tsx
│   ├── lib/
│   │   ├── analytics.ts  # Google Analytics integration
│   │   ├── data.ts       # Mock data (vehicles, routes, testimonials)
│   │   └── queryClient.ts
│   ├── pages/
│   │   ├── home.tsx      # Main landing page
│   │   └── not-found.tsx
│   └── App.tsx
├── index.html            # SEO meta tags, structured data
└── env.d.ts             # TypeScript env types
server/
├── routes.ts            # API endpoints (contact, quote)
└── index.ts
shared/
└── schema.ts            # TypeScript types and Zod schemas
```

## Key Features
1. **Instant Quote Calculator**: Pickup/dropoff selection, date/time, multiple stops, return trip toggle
2. **Vehicle Fleet**: 6 vehicle types with specs (seats, luggage capacity, pricing)
3. **Popular Routes**: Pre-configured routes with fixed pricing
4. **WhatsApp Integration**: Floating button + header button for instant booking
5. **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, JSON-LD structured data
6. **Google Analytics**: Page view tracking, event tracking for conversions
7. **Responsive Design**: Mobile-first with hamburger menu

## Configuration
### Google Analytics
Set `VITE_GA_MEASUREMENT_ID` in Secrets tab with your GA4 Measurement ID (e.g., "G-XXXXXXXXXX")

### WhatsApp Number
Edit `client/src/lib/data.ts` to update the WhatsApp number in `companyInfo.whatsapp`

### Company Details
All company information (name, phone, email) is in `client/src/lib/data.ts`

## Development
```bash
npm run dev    # Start development server on port 5000
```

## Future Integration
The frontend is ready to connect to a Frappe framework backend:
- API endpoints are stubbed in `server/routes.ts`
- Form data is validated with Zod schemas in `shared/schema.ts`
- Replace WhatsApp links with API calls to Frappe when ready

## User Preferences
- Modern, professional design with blue/white color scheme
- WhatsApp as primary booking channel
- No backend database required initially
- Ready for Frappe framework integration later
