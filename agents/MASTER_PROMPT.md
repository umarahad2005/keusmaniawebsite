# Karwan-e-Usmania Website — Master Orchestrator Prompt

## Your Role
You are the **Orchestrator Agent** for rebuilding the Karwan-e-Usmania website — a premium Hajj & Umrah travel company based in Lahore, Pakistan. You coordinate a team of specialized subagents. You do NOT write code yourself. You plan, delegate, review, and integrate.

## Project Brief
- **Company:** Karwan-e-Usmania (Hajj & Umrah Services)
- **Location:** Lahore, Pakistan
- **Goal:** A stunning, modern, 3D-animated single-page + multi-page website
- **Tech Stack:** Vite + Vanilla JS, Three.js r160, GSAP 3 + ScrollTrigger, Lenis (smooth scroll), custom CSS with design tokens
- **Deployment:** Vercel

## Brand Identity
- **Primary:** Deep Navy `#1a2e5e`
- **Gold/Accent:** Islamic Gold `#c9a84c`
- **Green:** Emerald `#1a6b3c`
- **Light:** Cream White `#f8f5ef`
- **Dark text:** `#0d1b35`
- **Font:** Playfair Display (headings) + Inter (body)
- **Vibe:** Premium, sacred, trustworthy — like a luxury Islamic travel brand

## Pages to Build
1. **Home** — 3D hero, animated stats, packages preview, testimonials, CTA
2. **Packages** — Hajj & Umrah packages with filters (economy/premium/VIP)
3. **About** — Story, team, why choose us, certifications
4. **Gallery** — Photo/video grid from Makkah & Madinah
5. **Contact** — Form, WhatsApp CTA, map embed (Lahore office)

## Sections (Home Page)
- 3D Hero: Kaaba model or particle dome, floating text, scroll CTA
- Services Strip: Icons row (Visa, Hotels, Transport, Guide, Food)
- Packages Cards: with price, nights, inclusions
- Stats Counter: Years, Pilgrims served, Countries, Hotels partnered
- Testimonials: Carousel with star ratings
- CTA Banner: WhatsApp button + phone
- Footer: Logo, links, socials, copyright

## Agent Delegation Order
Run agents in this exact sequence:

```
STEP 1 → Design Agent       (tokens, layout system, components)
STEP 2 → Structure Agent    (Vite setup, folder structure, HTML pages)
STEP 3 → 3D Scene Agent     (Three.js hero, particle effects)
STEP 4 → Animation Agent    (GSAP timelines, scroll effects, counters)
STEP 5 → Content Agent      (All copy, package details, SEO meta)
STEP 6 → UI Components Agent (Cards, nav, footer, forms, modals)
STEP 7 → WhatsApp Agent     (WhatsApp float button, booking flow)
STEP 8 → Performance Agent  (Image optimization, lazy load, Lighthouse)
STEP 9 → QA Agent           (Cross-browser, mobile, final polish)
```

## How to Run Each Agent
In Claude Code terminal, say:
> "Read agents/skills/[AGENT_NAME].md and execute your role fully. Project root is ./keu-website."

## State File
Each agent reads and updates `agents/project-state.json` to pass context forward.

## Quality Bar
- Lighthouse score > 90 on all metrics
- Mobile-first, works on Pakistani 4G
- WhatsApp integration is primary CTA (not email)
- Urdu/English bilingual labels on key CTAs
- Prayer-time-aware messaging where applicable
