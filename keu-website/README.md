# Karwan-e-Usmania

Premium Hajj & Umrah travel website — Lahore, Pakistan.

## Stack
Vite · Vanilla JS · Three.js r160 · GSAP 3 + ScrollTrigger · Lenis · custom design tokens.

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
├── index.html / packages.html / about.html / gallery.html / contact.html
├── public/                     static assets served at /
├── src/
│   ├── main.js                 entry — boots all modules
│   ├── styles/                 tokens · global · components
│   ├── js/                     scene · animations · nav · counter · packages · gallery · whatsapp · contact
│   ├── components/             HTML snippets (nav · footer · package-card)
│   ├── data/                   packages.json
│   └── assets/                 patterns · images · icons
└── scripts/                    image optimizer
```
