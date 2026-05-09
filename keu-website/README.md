# Karwan-e-Usmania

Premium Hajj & Umrah travel website — Lahore, Pakistan.
**Single-page React app** (Vite + React Router) with Three.js hero, GSAP animations, and Lenis smooth scroll.

## Stack
React 18 · React Router 6 · Vite · Three.js r160 · GSAP 3 + ScrollTrigger · Lenis · custom design tokens (no Tailwind).

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy
```bash
vercel --prod
```

## Project structure
```
keu-website/
├── index.html                    SPA shell (loads /src/main.jsx)
├── public/                       Static assets served at /
│   ├── images/{makkah,madinah,team}/
│   ├── patterns/{geometric.svg,islamic-pattern.webp}
│   ├── logo.png · favicon.svg
├── src/
│   ├── main.jsx                  ReactDOM root + BrowserRouter
│   ├── App.jsx                   Route table + Nav/Footer/FAB shell
│   ├── data.js                   Hardcoded SITE & PACKAGES (single source of truth)
│   ├── icons.jsx                 SVG icon library + <Icon /> component
│   ├── styles/                   tokens · global · components (all custom CSS)
│   ├── components/
│   │   ├── Nav.jsx · Footer.jsx · WhatsAppFAB.jsx
│   │   ├── Hero.jsx · ServicesStrip.jsx · SanctuariesSection.jsx
│   │   ├── WhyChooseUs.jsx · PackagesGrid.jsx · PackageCard.jsx
│   │   ├── StatsSection.jsx · TestimonialsSection.jsx · CTABanner.jsx
│   │   ├── GalleryGrid.jsx · TeamGrid.jsx
│   │   └── ContactInfo.jsx · ContactForm.jsx · SectionHeading.jsx
│   ├── pages/                    Home · Packages · About · Gallery · Contact
│   ├── hooks/                    useThreeScene · useGsapAnimations · useLenis
│   └── lib/                      whatsapp (URL builder) · useDocumentHead (SEO)
├── scripts/optimize-images.js    Image optimizer
└── vercel.json                   SPA rewrite + cache headers
```

## Where to edit content
- **Phone, WhatsApp, address, packages, testimonials, team, gallery, sanctuaries** → `src/data.js`
- **Icons** → `src/icons.jsx` (24×24 SVGs)
- **Brand colours, type, spacing, motion** → `src/styles/tokens.css`
- **Component styling** → `src/styles/components.css`

Vite HMR reloads instantly when you save any of these.
