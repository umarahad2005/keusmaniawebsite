# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are Muslim pilgrims — Pakistani families and overseas / international clients — who need to book Hajj or Umrah with a trusted operator. They arrive deciding whether this karwan will handle visa, flights, hotels, transport, and guidance for a sacred journey they may take once in a lifetime.

Secondary users: family decision-makers comparing packages on WhatsApp; office staff answering inquiries; an admin editing packages, testimonials, team, and company details.

## Product Purpose

The website is the public face and booking front door for Karwan e Usmania International, a Hajj & Umrah travel operator based in Lahore. Success is a pilgrim (or their family) trusting the karwan enough to enquire or book — usually on WhatsApp — and finding accurate identity, contact, packages, and spiritual programme information without calling first.

## Positioning

A Lahore-based karwan that treats pilgrims as Mehmaan-e-Khuda (guests of Allah), pairing licensed Hajj/Umrah logistics with a scholar-led spiritual programme (Qafila e Shoq). The claim a generic travel agency cannot copy is this combination of on-ground Haramain partners, Urdu-speaking guidance, and the Usmania spiritual lineage — now operating as an international travel & tours brand.

## Operating Context

- Booking channel of record: WhatsApp (`+92 333 4883578`). Phone and email are secondary.
- Office visits at Johar Town, Lahore (Usman Plaza).
- Public marketing site plus a private `/admin` CMS for company, packages, testimonials, team, gallery, FAQs.
- Letterhead identity (`letter_head.pdf`) and mark (`newlogo.png`) are the brand source of truth for name, tagline, contact, and visual cues.
- Sacred-journey language (Hajj, Umrah, Haramain, ziyarah, karwan) is factual terminology, not decoration.

## Capabilities and Constraints

- Public routes: Home, Packages, About, Gallery, Contact.
- Packages (keep): Economy / Premium / VIP / Ramadan / Family Umrah and Hajj 2025–2027 (government quota; price on request).
- Qafila e Shoq remains a limited, application-only spiritual journey led by Pirzada Burhan uddin Ahmed Usmani Sahib.
- Admin CMS and inquiry inbox remain; this rebrand does not change those workflows.
- Content defaults live in `keu-website/src/data.js` and may be overridden by `/api/content`. Identity updates must land in the defaults so the site is correct even when the API is down.
- Existing claims to preserve: founded 2008 (owner, 2026-10-10; was 2005); 18+ years; 25,000+ pilgrims; 100% visa success; Saudi partners on the ground.
- Undecided: canonical production domain. Letterhead prints `www.Usmania.vercel.app`; the live site today is `keusmania.vercel.app`. Do not invent a custom domain.
- Hours on the current site (Mon–Sat 9am–7pm, Sunday 11am–4pm) were not on the letterhead; keep until changed.

## Brand Commitments

- Legal / display name: **Karwan e Usmania International**.
- Descriptor: **Travel & Tours**.
- English tagline: **Your Journey to the Holy Land Our Priority**.
- Arabic line (as on letterhead): **خدمات ضيف الرحمن**.
- Motto: **Faith × Journey × Together**.
- Binding assets: `newlogo.png` (KU mark with Kaaba, green dome, gold orbit, aircraft, crescent) and `letter_head.pdf` (green + gold stationery).
- Contact (letterhead is source of truth):
  - Address: Office No. 2, 1st Floor, Usman Plaza, 436-G1, Opposite Butt Sweets, Johar Town, Lahore, Pakistan
  - Landline: +92 42 35136177
  - Mobile / WhatsApp: +92 333 4883578
  - Email: keusmania@gmail.com
- Voice: respectful, clear, hospitable; English with authentic Arabic/Urdu sacred phrases; no fake piety, no invented endorsements.
- Personality: professional international travel house rooted in faith — not a luxury fashion brand, not a budget aggregator.
- Standing visual preference (user, 2026-09-17): clean and premium. Letterhead composure — paper field, gold hairlines, green lockup, green footer. No costume worlds (book covers, imperial decrees, silk canopies, split-flap boards, posters, arcade).
- Craft bar (user, 2026-09-17): sit alongside **Nusuk** (nusuk.sa / Nusuk Hajj), **Visit Saudi**, and **Aman** — official pilgrimage digital, cinematic destination photography, quiet luxury chrome. Not a typical navy-gold Umrah template.

## Evidence on Hand

- Logo: `newlogo.png` (repo root).
- Letterhead: `letter_head.pdf` (repo root and `keu-website/letter_head.pdf`).
- Existing site content in `keu-website/src/data.js`: packages, FAQs, testimonials, team, gallery, Qafila e Shoq copy.
- Testimonials and team names already on the site; do not invent additional ones.
- Letterhead lists no registration numbers, licenses, or awards; do not fabricate them.

## Product Principles

1. Identity matches the letterhead — name, tagline, motto, and contact must never drift from the stationery.
2. The sacred journey is the product; logistics exist to protect it, not to outshine it.
3. WhatsApp is the conversion path; every public surface should make contacting the karwan obvious.
4. Preserve proven content (packages, proof, team, Qafila e Shoq); rebrand look and identity, not the offering.
5. Serve both Pakistani and international pilgrims with clear, trustworthy information — never provincial inaccessibility, never generic global-agency emptiness.
