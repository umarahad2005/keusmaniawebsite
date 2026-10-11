# Staged content corrections (Phase 0)

Prepared 2026-10-10 from the live content at `https://usmania.vercel.app/api/content` and `keu-website/src/data.js`. Owner approved the copy clean-up on 2026-10-10.

**How these get applied**
- **Live site (Phase 7):** the owner re-saves each admin screen with the values below. The database `site` row overrides `data.js` on production, so this step is what changes the live site. **Never delete the `site` row**: it holds the real team, testimonials and Qafila text.
- **Code defaults (Phase 5):** the same values go into `src/data.js`, `index.html`, `src/lib/schemas.js` and `scripts/generate-seo.js`, so the site is correct even if the API is down.

Items marked **[confirm]** need a one-line answer from the owner before launch.

---

## 1. Company (`/admin/company`)

| Field | Live value now | Corrected value |
|---|---|---|
| name | `Karwan-e-Usmania  Travel's & Tours` | `Karwan e Usmania International` |
| tagline | `Premium Hajj & Umrah from Paksitan` | `Your Journey to the Holy Land, Our Priority` |
| founded | `2005` | `2008` (owner decision) |
| phone | `+92-333-4883578` | `+92-333-4883578` (unchanged) |
| whatsapp | `+923304211900` | `923334883578` (owner decision; digits only) |
| email | `keusmania@gmail.com` | unchanged |
| address.street | `Office# 2 , 1st Floor Usman Plaza, Opposite Butt Sweat, near Lamb House G1 Market, Johar Town ` | `Office No. 2, 1st Floor, Usman Plaza, 436-G1, Opposite Butt Sweets, Johar Town` (letterhead) |
| address.city / country | Lahore / Pakistan | unchanged |
| address.postalCode | `54600` | empty (not on the letterhead and unverified; owner did not supply one) |
| landline (new optional key, code default) | — | `+924235136177` (letterhead landline; the admin keeps unknown keys) |
| hours | Mon–Sat 9:00 am – 7:00 pm · Sunday 11:00 am – 4:00 pm | **Monday–Friday 11:00 am – 7:00 pm · Saturday 11:00 am – 5:00 pm · Sunday closed** (owner, 2026-10-10). In the admin: two rows, `Mon – Fri` / `11:00 am – 7:00 pm` and `Saturday` / `11:00 am – 5:00 pm`; the site adds "Sunday: closed". All times are Pakistan time. |
| socials | Facebook `https://www.facebook.com/p/Karwan-e-Usmania-61552498595314/`, Instagram `keusmania?utm_source=…`, YouTube `@karwaneusmania`, TikTok `@keusmania` | **Facebook `https://www.facebook.com/profile.php?id=61552498595314`** and **Instagram `https://www.instagram.com/keusmania`** (owner, 2026-10-10; tracking parameters removed). YouTube and TikTok unchanged. |

## 2. FAQs (`/admin/faqs`)

The live FAQs contradict the packages (old price range, flights promised on a package sold without an air ticket), list three different phone numbers and a different office number, and promise a reply "within an hour". Corrected text, keeping the owner's facts and adding none:

1. **How much does an Umrah package from Pakistan cost?**
   Prices depend on the hotels, the number of nights and whether flights are included. Our current packages are listed with their prices on the Packages page, and every cost is explained in writing before you commit.
2. **How long does Saudi Umrah visa processing take?**
   Saudi Umrah visas are typically processed within 5–7 working days, and we have a 100% approval rate. The visa fee, biometric appointment and document attestation are all handled by our team, so you do not need to visit the consulate.
3. **What is included in an Umrah package?**
   Every package includes Saudi visa processing, insurance, documentation and 24/7 on-ground support. Hotels, transport, flights and ziyarah depend on the package: each package lists exactly what it includes, and some are offered without an air ticket.
4. **When is the best time for Umrah?**
   Umrah can be performed at any time of year except during the Hajj season. The last 10 nights of Ramadan are the most sought-after time, so ask us early about Ramadan dates. The cooler months, November to February, are gentler for elderly pilgrims.
5. **Can children travel for Umrah?**
   Yes. Families and children are welcome. Tell us who is travelling when you message us, and we will suggest the right rooms and schedule.
6. **Is Karwan e Usmania International an established Umrah operator?**
   Yes. Karwan e Usmania International is a Lahore-based travel operator that has served pilgrims since 2008. We work with established Saudi partners on the ground in Makkah and Madinah for hotels, transport and guides.
7. **Where is your office?**
   Office No. 2, 1st Floor, Usman Plaza, 436-G1, Opposite Butt Sweets, Johar Town, Lahore. We are open Monday to Friday 11 am to 7 pm and Saturday 11 am to 5 pm (Pakistan time), and closed on Sunday. WhatsApp is the fastest way to reach us: +92 333 4883578. You can also call +92 42 35136177.
8. **What is Qafila e Shoq?** (unchanged)
   Qafila e Shoq is a spiritual journey programme led by Pirzada Burhan uddin Ahmed Usmani Sahib (Islamic Scholar). It is built around four pillars: Ibadah (worship), Riyazat (spiritual discipline), Tarbiyat (development) and Siyahat (sacred travel). It is not a regular travel package: seats are limited and by application only.
9. **How do I book?**
   WhatsApp is our main booking channel. Message +92 333 4883578 with your preferred package and travel dates. You can also call +92 42 35136177, email keusmania@gmail.com, or visit our office in Johar Town.

Removed on purpose: the "PKR 275,000 to 600,000" range, the shop comparison, "return flights from Pakistan or anywhere in the world", the Ramadan package reference (no Ramadan package is live), "Office#3", the numbers +92-331-4950665 and +92-331-4211935, and the "within an hour" promise.

## 3. Testimonials (`/admin/testimonials`)

Quotes stay word for word. Only the labels change. The new design shows no stars and no initials.

| Live | Corrected |
|---|---|
| name `Vick Pandaa - Waqas Saleem ` | `Waqas Saleem` (owner, 2026-10-10) |
| Zahid Rauf: initials `AK`, location `Lahore ` | initials `ZR`, location `Lahore` |
| Imran Sheikh, Muhammad Hassan | unchanged |

## 4. Why choose us, About, Stats

| Where | Now | Corrected |
|---|---|---|
| whyChooseUs[0].body | "Since 2005, we have served over 25,000 pilgrims…" | "Since 2008, we have served over 5,000 pilgrims…" |
| whyChooseUs[0].title | "18+ Years of Experience" | unchanged (owner: keep 18+) |
| stats | 18+ · 25,000+ · 15+ · 100% | **18+ · 5,000+ · 15+ · 100%** (owner, 2026-10-11) |
| about.story[1] | "…we have spent 18 years perfecting…" | unchanged |

## 5. Live packages (`/admin/packages`) — APPLIED 2026-10-10

Owner approved; applied directly to the live database on 2026-10-10 (backup: `backups/packages-2026-10-10.json`). Typos and trailing spaces only: name, badge, priceLabel, subtitle and inclusions. The summaries (including their closing contact block) and the package ids were left untouched.

| Package | Field | Now | Suggested |
|---|---|---|---|
| Rab Ul Awal Umrah | name | `21 days ` | `Rabi ul Awal Umrah · 21 days` |
| Rab Ul Awal Umrah | badge | `limited time offer ` | `Limited time offer` |
| Rab Ul Awal Umrah | priceLabel | `PKR  78,500/-` | `PKR 78,500` |
| Star Package | badge | `Bumber Offer` | `Bumper offer` |
| Star Package | priceLabel | `PKR 375000` | `PKR 375,000` |
| Star Package | subtitle | `Shuttle Package ` | `Shuttle package` |
| both | summary | ends with "Book Your Journey: Call/WhatsApp: +924235136177 Website: usmania.vercel.app Karwan-E-Usmania: Your Trusted Partner…" | drop the closing block; the card already has the WhatsApp button and it lists a different booking number |

Package `id` values contain spaces. Keep them as they are: shared links and WhatsApp message keys already use them.

## 6. Code defaults to change in Phase 5 (founding year 2008)

| File:line | Now | Change to |
|---|---|---|
| `src/data.js:12` | `founded: 2005` | `founded: 2008` |
| `src/data.js:47` | "Since 2005, we have served…" | "Since 2008, we have served…" |
| `src/data.js:151` | "…served pilgrims since 2005." | "…served pilgrims since 2008." (FAQ text replaced by section 2) |
| `src/lib/schemas.js:21` | `foundingDate: '2005'` | `foundingDate: '2008'` |
| `index.html:14` | "…since 2005." | "…since 2008." |
| `src/components/Footer.jsx:23` | "…since 2005." | rewritten in Phase 2 |
| `src/components/Hero.jsx:22,31` | "Since 2005" | deleted with Hero.jsx in Phase 3 (new eyebrow: "KARWAN E USMANIA INTERNATIONAL · SINCE 2008") |
| `src/pages/About.jsx:18` | "since 2005" | "since 2008" |
| `src/pages/Home.jsx:23` | "(since 2005)" | "(since 2008)" |
| `scripts/generate-seo.js:89,93` | "since 2005", "founded in 2005" | "since 2008", "founded in 2008" |

## 7. Umrah only: remove the Hajj offering (owner, 2026-10-10)

Karwan e Usmania International currently offers **Umrah only**. Nothing on the public site may offer, price or invite enquiries for Hajj. Factual timing notes ("Umrah can be performed any time except during the Hajj season") stay.

| Where | Change |
|---|---|
| `src/data.js` package `hajj-2025` | delete the package object |
| `src/data.js` FAQ lines 142–143 (Hajj answer) | delete; the live FAQ in section 2 already has no Hajj item |
| `src/components/PackagesGrid.jsx:8` filter chip `hajj` | remove the chip (the grid already hides chips with no packages) |
| `src/components/ContactForm.jsx:11` option "Hajj 2025–2027" | remove; options come from the live packages plus "General enquiry" |
| `src/lib/whatsapp.js:5` general message | "…enquire about your Hajj/Umrah packages." → "…enquire about your Umrah packages." |
| `src/lib/schemas.js:15,61,88` | descriptions say Umrah; `touristType` is always "Umrah pilgrimage" |
| `index.html` (5 mentions), `scripts/generate-seo.js` (3) | titles, descriptions, keywords and llms.txt say Umrah, not Hajj & Umrah |
| Page heads `Home.jsx:23-25`, `Packages.jsx:18-20,47`, `About.jsx:19`, `Contact.jsx:16-17`, `Gallery.jsx:15-16` | drop Hajj from titles, descriptions and keywords; the Packages header becomes "Umrah, the way it should be." |
| `Footer.jsx:23`, `Hero.jsx:30` | rewritten in Phases 2–3 without Hajj |
| Design: CTA band chips, WhatsApp FAB list | Umrah / Qafila e Shoq / General (no Hajj) |
| Design: PackageCard "price on request" variant | kept as a defensive state for any package without a figure, but no Hajj copy |

The Qafila e Shoq programme is unaffected.
