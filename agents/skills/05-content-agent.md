# SKILL: Content Agent
## Role
You write all website copy, package details, SEO meta tags, and structured data. You know Islamic travel deeply.

## Brand Voice
- Warm, trustworthy, reverent
- Professional but personal
- Mix English with key Arabic/Urdu phrases naturally
- Avoid generic tourism speak — speak to the spiritual journey

## All Page Content to Write

### HOME PAGE

**Hero:**
- Bismillah: بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
- Headline: "Your Sacred Journey Begins Here"
- Sub: "Premium Hajj & Umrah services from Lahore, Pakistan. Trusted by thousands of pilgrims since 2005."

**Services Strip (6 items):**
1. Visa Processing — "Hassle-free Saudi visa with 100% approval rate"
2. Flights — "Economy & Business class from all Pakistani cities"
3. Hotels — "4-star & 5-star hotels steps from Haram"
4. Transport — "Private AC coaches throughout your journey"
5. Local Guide — "Experienced Urdu-speaking guides in Makkah & Madinah"
6. Food — "Halal Pakistani & Arabic cuisine included"

**Why Choose Us (4 points):**
1. 18+ Years Experience — "Since 2005, we have served over 25,000 pilgrims"
2. Licensed & Certified — "Ministry of Religious Affairs registered, Saudi approved"
3. Affordable Excellence — "Premium service at transparent, honest pricing"
4. 24/7 Support — "Our team is with you every step of the journey"

**Section headings use this pattern:**
```
[Arabic phrase small gold]
BIG ENGLISH HEADING
short description text
```

### PACKAGES PAGE

**Economy Umrah — PKR 185,000/person**
- 14 nights (7 Makkah + 7 Madinah)
- 3-star hotels (800m–1km from Haram)
- Economy class flights
- Shared AC transport
- Visa included
- Group guide (Urdu)

**Premium Umrah — PKR 285,000/person**
- 14 nights (7 Makkah + 7 Madinah)
- 4-star hotels (500m from Haram)
- Economy+ flights
- Semi-private transport
- Ziyarah tours included
- Dedicated guide

**VIP Umrah — PKR 450,000/person**
- 14 nights
- 5-star hotels (Hilton/Pullman/Makkah Clock Tower)
- Business class flights
- Private car transfers
- All ziyarah + full concierge
- Personal Urdu/Arabic guide

**Ramadan Umrah — PKR 550,000/person**
- Last 10 days of Ramadan
- 5-star hotels
- Iftar & Suhoor arrangements
- Laylat-ul-Qadr experience package

**Hajj Package 2025 — On Request**
- Full Hajj service (Economy & VIP)
- Government quota applied
- All pillars arranged

### ABOUT PAGE

**Our Story:**
"Karwan-e-Usmania was founded in Lahore with a single mission: to make the sacred journey of Hajj and Umrah accessible, comfortable, and spiritually fulfilling for every Muslim family. Named in honour of the revered traditions of Islamic travel, we have spent 18 years perfecting every detail of the pilgrimage experience..."

**Team section:** [Placeholder for actual team names/photos]

**Certifications:**
- Ministry of Religious Affairs, Pakistan — License No. [XXX]
- Saudi Arabia Hajj Mission approved operator
- IATA member

### CONTACT PAGE

**Office Address:** [Insert full Lahore address]
**Phone:** [Insert number]
**WhatsApp:** [Insert WhatsApp number]
**Email:** info@keusmania.com
**Hours:** Mon–Sat 9am–7pm, Sun 11am–4pm

**Form fields:** Name, Phone, Email, Package Interest (dropdown), Message, Preferred contact (WhatsApp/Call/Email)

## SEO Meta Tags (add to each page)

```html
<!-- index.html -->
<meta name="description" content="Karwan-e-Usmania offers premium Hajj and Umrah packages from Lahore, Pakistan. 18+ years experience, 25,000+ pilgrims served. Book your sacred journey today.">
<meta name="keywords" content="Hajj packages Pakistan, Umrah packages Lahore, Karwan-e-Usmania, Hajj 2025, Umrah packages 2024, cheap umrah packages Pakistan">
```

## Schema.org Structured Data (add to index.html)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Karwan-e-Usmania",
  "description": "Premium Hajj and Umrah services from Lahore, Pakistan",
  "url": "https://keusmania.vercel.app",
  "telephone": "+92-XXX-XXXXXXX",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lahore",
    "addressCountry": "PK"
  },
  "areaServed": "Pakistan",
  "priceRange": "PKR 185,000 - PKR 550,000"
}
</script>
```

## Output Required
- All copy written and inserted into respective HTML files
- SEO meta tags on all pages
- Schema.org JSON-LD on index.html
- Package data also exported as `src/data/packages.json` for JS filtering
- Update `agents/project-state.json` → `status.content = "done"`
