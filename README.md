# Karwan e Usmania International · Travel & Tours

Website of **Karwan e Usmania International**, an Umrah travel operator in Johar Town, Lahore, serving pilgrims since 2005.

**Live:** https://usmania.vercel.app · **Admin:** https://usmania.vercel.app/admin

The site follows the design language *"The Letter and the Film"* ([docs/rebrand/DESIGN-LANGUAGE.md](docs/rebrand/DESIGN-LANGUAGE.md)). It opens with a short logo intro and a film of Masjid al-Haram, then presents the karwan's letterhead in paper and green: packages, booking steps, services, a Makkah-to-Madinah chapter, video reviews, FAQs and a closing WhatsApp call to action. WhatsApp is the main booking channel.

---

## Contents

- [Stack](#stack)
- [Repository layout](#repository-layout)
- [Run it locally](#run-it-locally)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Content and the admin](#content-and-the-admin)
- [Deploying](#deploying)
- [Performance and accessibility notes](#performance-and-accessibility-notes)
- [Documentation](#documentation)

---

## Stack

| Layer | Technology |
|---|---|
| Front end | React 18, React Router 6, Vite 5, plain CSS with design tokens |
| Motion | GSAP 3 (ScrollTrigger, SplitText, Flip, DrawSVG), Lenis smooth scroll |
| API | Vercel serverless functions in `keu-website/api/` (Node) |
| Content | MongoDB (one `site` document plus `packages`), edited in the admin |
| Media | Cloudinary (photos, video reviews, background sound); the hero films ship as static assets |
| Hosting | Vercel (`main` deploys to production) |

Fonts are self-hosted: Cormorant Garamond (display), Manrope (text), IBM Plex Sans Arabic ("KEU Arabic") and Noto Nastaliq Urdu (Qafila e Shoq only).

## Repository layout

```
.
├── README.md                     this file
├── docs/rebrand/                 design language, research, phase reports, launch log
│   ├── DESIGN-LANGUAGE.md        the binding design spec (§8.1 = owner decisions)
│   ├── PHASE-0.md … PHASE-7.md   what each build phase shipped and how it was tested
│   ├── content-corrections.md    approved copy changes
│   ├── KEUI-FAQ-Questionnaire.pdf  FAQ questions for the client to answer
│   └── faq-questionnaire/        generator for that PDF
└── keu-website/                  the website (Vite project)
    ├── index.html                page shell: meta tags, JSON-LD, inline logo intro
    ├── vercel.json               SPA rewrite, cache and security headers
    ├── api/                      serverless API (content, auth, contact, uploads)
    ├── public/                   fonts, hero posters, icons, share cards (og/)
    ├── scripts/                  build and maintenance scripts (see below)
    └── src/
        ├── App.jsx               routes; admin screens are code-split
        ├── data.js               default content (used when the API is unreachable)
        ├── pages/                Home, Packages, About, Gallery, Contact, TeamMember, admin/
        ├── components/           page sections, chrome/ (nav, sound), motion/, brand/
        ├── hooks/                reveal registry, Lenis, scroll restoration
        ├── lib/                  brand, schemas (SEO), whatsapp, images, team, loopPlayer …
        └── styles/               tokens, chrome, sections, home, pages, admin
```

## Run it locally

Requirements: Node 20 or newer.

```bash
cd keu-website
npm install
cp .env.example .env      # then fill in the values (see below)
npm run dev               # web on http://localhost:5173 + API on :3001
```

- `npm run dev` starts the Vite site and the local API together (Vite proxies `/api` to it).
- **The local API uses the database in `MONGODB_URI`.** If that is the production database, saving in the local admin changes the live site.
- Useful address flags for testing motion: `?motion=full`, `?motion=reduce`, `?motion=lowend`, `?motion=savedata`.

## Environment variables

Set these in `keu-website/.env` for local work, and in **Vercel → Project → Settings → Environment Variables** for the live site.

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | signs admin sessions |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | the admin login. There is no default password in the code. Changing them signs existing sessions out |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | signed uploads from the admin |
| `CLOUDINARY_UPLOAD_PRESET`, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary settings used by the browser |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO` | contact-form notification emails |
| `VITE_SITE_URL` *(optional)* | canonical address if the site moves from `https://usmania.vercel.app` |
| `VITE_ANALYTICS=vercel` *(optional)* | turns on Vercel Web Analytics + Speed Insights (switch them on in Vercel first) |

Never commit `.env` (it is in `.gitignore`).

## Scripts

Run from `keu-website/`.

| Command | What it does |
|---|---|
| `npm run dev` | local site + API |
| `npm run build` | production build, then `sitemap.xml`, `robots.txt`, `llms.txt` |
| `npm run preview` | serve the production build locally |
| `npm run warm:images` | **run after adding photos in the admin.** Pre-generates every photo size and format on Cloudinary so no visitor waits for a first-time resize |
| `npm run generate:icons` | favicons, app icons and `site.webmanifest` from the KU mark |
| `npm run generate:og` | 1200×630 share cards in `public/og/` |
| `npm run hero:safe` | recomputes where the hero copy can sit clear of the Kaaba (`src/styles/hero-safe.css`) |
| `node scripts/build-intro.js` | regenerates the inline logo intro in `index.html` |
| `node scripts/apply-content-corrections.mjs` | previews approved content fixes; add `--apply` to write them (backs up first) |

## Content and the admin

Everything visitors read comes from the admin at `/admin` (stored in MongoDB); `src/data.js` holds the defaults used only if the API cannot be reached.

| Admin screen | Controls |
|---|---|
| Company | name, tagline, WhatsApp number, phones, address, hours, social links |
| Packages | package cards and prices |
| Testimonials | written quotes (shown until a video review is published) |
| Video reviews | uploaded pilgrim videos; shown only with consent + "Show on website", they replace the written quotes and play on the page |
| Background sound | one looping track behind the "Sound" button in the menu bar (short clips loop with no gap) |
| Team | members, photos and digital-card details (designation, Arabic name and title, numbers). Each member gets a card page at `/team/<name>`; their numbers also appear in the footer |
| Gallery, Sanctuaries, Why choose us, FAQs | the matching sections |

After uploading new photos, run `npm run warm:images` once.

## Deploying

- Pushing to **`main`** deploys to production on Vercel automatically. Work on a short-lived branch and merge it with a pull request.
- If a production deploy shows **Error** without building, open it in Vercel to read the reason, then use **Redeploy** on the latest commit.
- **Rollback:** Vercel → Deployments → promote the previous production deployment.
- Content backups taken before scripted database changes are kept locally in `docs/rebrand/backups/` (not committed: they contain production data).

## Performance and accessibility notes

- Google PageSpeed (mobile): Home 94, Packages 82; desktop 99. Accessibility, best practices and SEO 100 on both pages.
- Motion set-up (smooth scroll, background stage, pinned chapter, reveals) waits until the page is idle; the hero entrance is pure CSS.
- The hero film loads only on desktops and tablets; phones, Save-Data, slow connections and "reduce motion" get the still poster. The film plays without a control by owner decision; reduced-motion users never get moving video.
- Photos stay on Cloudinary: Vercel serves Pakistan from Singapore, Cloudinary's CDN from nearby.
- The remaining mobile LCP gap needs pre-rendered HTML; see `docs/rebrand/PHASE-7.md`.

## Documentation

- [Design language](docs/rebrand/DESIGN-LANGUAGE.md) and [research](docs/rebrand/RESEARCH.md)
- Phase reports: [0](docs/rebrand/PHASE-0.md) · [1](docs/rebrand/PHASE-1.md) · [2](docs/rebrand/PHASE-2.md) · [3](docs/rebrand/PHASE-3.md) · [4](docs/rebrand/PHASE-4.md) · [5](docs/rebrand/PHASE-5.md) · [6](docs/rebrand/PHASE-6.md) · [7 — launch log](docs/rebrand/PHASE-7.md)
- [Content corrections](docs/rebrand/content-corrections.md)
- [FAQ questionnaire (PDF)](docs/rebrand/KEUI-FAQ-Questionnaire.pdf)
