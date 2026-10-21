/* =========================================================
   Karwan e Usmania International — Hardcoded site data (single source of truth)
   Edit this file to update phone, WhatsApp, address, packages,
   testimonials, gallery, etc. Vite HMR will reflect changes
   instantly during dev; a rebuild is required for production.
   ========================================================= */

export const SITE = {
  company: {
    name: 'Karwan e Usmania International',
    tagline: 'Your Journey to the Holy Land, Our Priority',
    founded: 2005,   // owner decision 2026-10-12 (was 2008)
    phone: '+92-333-4883578',
    whatsapp: '923334883578',   // owner decision 2026-10-10 (letterhead mobile)
    email: 'keusmania@gmail.com',
    address: {
      // Letterhead address (content-corrections §1). No postcode: none supplied.
      street: 'Office No. 2, 1st Floor, Usman Plaza, 436-G1, Opposite Butt Sweets, Johar Town',
      city: 'Lahore',
      country: 'Pakistan',
      postalCode: '',
    },
    // Owner hours (2026-10-10), Pakistan time. Sunday closed.
    hours: [
      { days: 'Mon – Fri', time: '11:00 am – 7:00 pm' },
      { days: 'Saturday',  time: '11:00 am – 5:00 pm' },
      { days: 'Sunday',    time: 'Closed' },
    ],
    // Letterhead landline. Optional key: the admin keeps unknown keys on save.
    landline: '+924235136177',
    socials: [
      { name: 'Facebook',  url: 'https://www.facebook.com/profile.php?id=61552498595314', icon: 'facebook'  },
      { name: 'Instagram', url: 'https://www.instagram.com/keusmania', icon: 'instagram' },
      { name: 'YouTube',   url: 'https://youtube.com/@karwaneusmania',                         icon: 'youtube'   },
      { name: 'TikTok',    url: 'https://www.tiktok.com/@keusmania',                          icon: 'tiktok'    },
    ],
  },

  services: [
    { icon: 'visa',  label: 'Visa Processing', sublabel: 'Handled end to end' },
    { icon: 'plane', label: 'Flights',          sublabel: 'Economy & Business' },
    { icon: 'hotel', label: 'Hotels',           sublabel: '4★ & 5★ near Haram' },
    { icon: 'bus',   label: 'Transport',        sublabel: 'Private AC coaches' },
    { icon: 'guide', label: 'Local Guide',      sublabel: 'Urdu-speaking' },
    { icon: 'food',  label: 'Food',             sublabel: 'Halal Pak & Arabic' },
  ],

  whyChooseUs: [
    {
      icon: 'award',
      title: '21+ Years of Experience',
      body: 'Since 2005, we have served over 25,000 pilgrims with care, integrity, and attention to every detail of the sacred journey.',
    },
    {
      icon: 'kaaba',
      title: 'Saudi Partners on Ground',
      body: 'Our trusted partners in Makkah and Madinah handle every detail — hotels, transport, ziyarah — so your karwan never travels alone.',
    },
    {
      icon: 'shield',
      title: 'Affordable Excellence',
      body: 'Premium service at transparent, honest pricing. No hidden fees — every cost is explained upfront, in writing, before you commit.',
    },
    {
      icon: 'support',
      title: '24/7 Support',
      body: 'Our team is with you every step — from your first call to your safe return. WhatsApp us anytime, even from the Haram itself.',
    },
  ],

  stats: [
    { value: 21,    suffix: '+', label: 'Years of Service',  icon: 'calendar' },
    { value: 25000, suffix: '+', label: 'Pilgrims Served',   icon: 'users'    },
    { value: 80,    suffix: '+', label: 'Partner Hotels',    icon: 'building' },
    { value: 24,    suffix: '/7', label: 'On-ground Support', icon: 'check'   },
  ],

  sanctuaries: [
    {
      title: 'Makkah al-Mukarramah',
      subtitle: 'Where the journey of every Muslim heart begins',
      body: 'Tawaf around the Kaaba, Sa\'i between Safa and Marwa, and the deepening of faith inside Masjid al-Haram. We place you steps from the Haram so every prayer is a short walk away.',
      image: 'keu/makkah/masjid-al-haram',
      alt: 'Masjid al-Haram with the Kaaba at its centre',
    },
    {
      title: 'Madinah al-Munawwarah',
      subtitle: 'The radiant city of the Prophet ﷺ',
      body: 'Salaam at Riyadh-ul-Jannah, prayer in Masjid an-Nabawi, and ziyarah of the historic battlefields. A few days here change a lifetime — we make sure those days are spent in peace and reflection.',
      image: 'keu/madinah/prophets-mosque',
      alt: 'Masjid an-Nabawi — the green dome at sunset',
    },
  ],

  testimonials: [
    {
      quote: 'Alhamdulillah, our Umrah with Karwan-e-Usmania was a dream. Everything was perfect — visa, hotel, transport. May Allah reward this team.',
      name: 'Muhammad Hassan',
      location: 'Lahore',
      trip: 'Premium Umrah · 2024',
      rating: 5,
      initials: 'MH',
    },
    {
      quote: 'We took our parents for Umrah. The team handled everything with such care that my mother cried tears of gratitude. JazakAllah Khair.',
      name: 'Ayesha Khan',
      location: 'Karachi',
      trip: 'Family Umrah · 2024',
      rating: 5,
      initials: 'AK',
    },
    {
      quote: 'Our package was worth every rupee. The hotel was right next to the Haram and the guide was incredibly knowledgeable. Highly recommend.',
      name: 'Imran Sheikh',
      location: 'Islamabad',
      trip: 'Premium Umrah · 2023',
      rating: 5,
      initials: 'IS',
    },
  ],

  // Video reviews are uploaded from /admin/video-reviews; none ship by default.
  videoReviews: [],
  // Background sound (admin: /admin/sound). Off until a track is uploaded.
  ambience: { enabled: false, src: '', publicId: '', title: '', credit: '', volume: 0.35, duration: 0 },

  // Team (owner's printed cards, folder card/, 2026-10-11). Card fields feed
  // the digital card on About and /team/<name>. Photos already uploaded are
  // kept; Abdul Rahman Khan's photo is still to come (admin → Team).
  team: [
    { name: 'Pirzada Burhan ud Din Ahmed Usmani', role: 'Chairman', nameAr: 'پیرزادہ برہان الدین احمد عثمانی', roleAr: 'رئيس مجلس الإدارة',
      phone: '+92 333 4883578', whatsapp: '+92 333 4883578', email: 'keusmania@gmail.com', photo: 'https://res.cloudinary.com/dpmnlysdt/image/upload/v1785332497/keu/team/esqu3zqg9z4hvqz38k8f.png' },
    { name: 'Moeed Usmani', role: 'Director Sales Management', nameAr: 'معيد عثماني', roleAr: 'مدير إدارة المبيعات',
      phone: '+92 331 4950665', whatsapp: '+92 331 4950665', email: 'keusmania@gmail.com', photo: 'https://res.cloudinary.com/dpmnlysdt/image/upload/v1785332544/keu/team/cm2cjlgxiabwl3hud4tf.jpg' },
    { name: 'Muaz Usmani', role: 'Director Business Relations', nameAr: 'معاذ عثمانی', roleAr: 'مدير العلاقات التجارية',
      phone: '+92 330 4211900', whatsapp: '+92 330 4211900', email: 'keusmania@gmail.com', photo: 'https://res.cloudinary.com/dpmnlysdt/image/upload/v1785332679/keu/team/tsuj5dhx1qzbgnzthkzh.png' },
    { name: 'Usman Aman Uddin Ahmed Usmani', role: 'Director Operations & Finance', nameAr: 'عثمان امان الدین احمد عثمانی', roleAr: 'مدير المالية والعمليات',
      phone: '+92 331 4211935', whatsapp: '+92 331 4211935', email: 'keusmania@gmail.com', photo: 'https://res.cloudinary.com/dpmnlysdt/image/upload/v1785332823/keu/team/nytx4x504jbkwb4nt3vp.jpg' },
    { name: 'Muhammad Mawiz Usmani', role: 'Director Commercial Operations', nameAr: 'محمد معوذ عثمانی', roleAr: 'مدير العمليات التجارية',
      phone: '+92 302 8133456', whatsapp: '+92 302 8133456', email: 'keusmania@gmail.com', photo: 'https://res.cloudinary.com/dpmnlysdt/image/upload/v1785332837/keu/team/bn1vrdoyt7xvgdtaiykw.jpg' },
    { name: 'Umer Ahad Ud Din Ahmed Usmani', role: 'Logistics Manager', photo: 'https://res.cloudinary.com/dpmnlysdt/image/upload/v1785332852/keu/team/boyvqcdlo0pqcpxzvctm.jpg' },
    { name: 'Abubakar Moeen Ud Din Ahmed Usmani', role: 'Graphics Manager', photo: 'https://res.cloudinary.com/dpmnlysdt/image/upload/v1785334560/keu/team/b7wmbghp0a3ausqp50qx.jpg' },
    { name: 'Abdul Rahman Khan', role: 'Administrative Assistant', nameAr: 'عبد الرحمن خان', roleAr: 'مساعد إداري',
      phone: '+92 347 5165469', whatsapp: '+92 347 5165469', email: 'keusmania@gmail.com', photo: '' },
  ],

  // FAQ: Part A (live) + owner-approved Part B answers (docs/rebrand/FAQ-draft-answers.md, 2026-10-12).
  faqs: [
    {
      q: "How much does an Umrah package from Pakistan cost?",
      a: "Prices depend on the hotels, the number of nights and whether flights are included. Our current packages are listed with their prices on the Packages page, and every cost is explained in writing before you commit.",
    },
    {
      q: "How do I book?",
      a: "WhatsApp is our main booking channel. Message +92 333 4883578 with your preferred package and travel dates. You can also call +92 42 35136177, email keusmania@gmail.com, or visit our office in Johar Town.",
    },
    {
      q: "What is included in an Umrah package?",
      a: "Every package includes Saudi visa processing, insurance, documentation and 24/7 on-ground support. Hotels, transport, flights and ziyarah depend on the package: each package lists exactly what it includes, and some are offered without an air ticket.",
    },
    {
      q: "How much deposit is needed to confirm a booking?",
      a: "A 50% deposit confirms your booking, and the remaining balance must be cleared before you travel. Every cost is explained in writing before you pay.",
    },
    {
      q: "How far in advance should I book Umrah?",
      a: "For a regular Umrah, we suggest booking at least 3–4 weeks before you want to travel. This leaves time for the visa, which usually takes 5–7 working days, and for hotel confirmation. For Ramadan, especially the last ten nights, please book as early as possible, as seats and hotels near the Haram fill quickly.",
    },
    {
      q: "How long does Saudi Umrah visa processing take?",
      a: "Saudi Umrah visas are typically processed within 5–7 working days. The visa fee, biometric appointment and document attestation are all handled by our team, so you do not need to visit the consulate.",
    },
    {
      q: "Which documents do I need for an Umrah visa?",
      a: "You will need: a passport valid for at least six months from your travel date; recent passport-size photographs with a white background; and your polio vaccination certificate. Our team handles the rest of the visa process for you and will confirm the current list when you book.",
    },
    {
      q: "When is the best time for Umrah?",
      a: "Umrah can be performed at any time of year except during the Hajj season: the Umrah season runs from Muharram to Shawwal. The last 10 nights of Ramadan are the most sought-after time, so ask us early about Ramadan dates.",
    },
    {
      q: "Which payment methods do you accept?",
      a: "We prefer online payment by bank transfer, and we also accept cash at our office in Johar Town, Lahore.",
    },
    {
      q: "Can families pay in instalments?",
      a: "Yes. Families can pay in instalments, as long as the full amount is cleared before departure for Umrah.",
    },
    {
      q: "Can I change my travel dates or traveller names after booking?",
      a: "It depends on the booking. Changes may be possible, and any penalty depends on the airline, hotel and visa rules at the time of the change. Please message us as early as possible and we will tell you what applies.",
    },
    {
      q: "Is the Umrah visa included in every package?",
      a: "Yes. Complete visa processing is included in every package, along with insurance, documentation and 24/7 on-ground support.",
    },
    {
      q: "Can you arrange Umrah for pilgrims living outside Pakistan?",
      a: "Yes. We can arrange Umrah for pilgrims living outside Pakistan, for example in the UAE or the UK. Message us with your country of residence and travel dates, and we will arrange the package from there.",
    },
    {
      q: "Can women perform Umrah without a mahram?",
      a: "Under current Saudi rules, women can perform Umrah without a mahram. Many women travel with our groups. Please tell us when you enquire so we can plan the right arrangement for you.",
    },
    {
      q: "Which vaccinations are required for Umrah?",
      a: "Pakistani travellers need a polio vaccination certificate for Umrah. We will tell you the current health requirements when you book.",
    },
    {
      q: "Which cities can I fly from?",
      a: "We can arrange flights to Saudi Arabia from anywhere in the world, in economy or business class.",
    },
    {
      q: "Do you offer packages without an air ticket?",
      a: "Yes. Some packages are offered without an air ticket, for pilgrims who prefer to book their own flights. For example, our 21-day Rabi ul Awal package includes the visa, hotels in Makkah and Madinah, transport and documentation, without the flight. If you choose a package without an air ticket, we will need a copy of your confirmed air ticket.",
    },
    {
      q: "What is the baggage allowance? Can I bring Zamzam water home?",
      a: "The baggage and Zamzam water allowance depends on the airline's policy. We will tell you the allowance for your flight.",
    },
    {
      q: "Are airport transfers in Saudi Arabia included?",
      a: "Yes. Transport is included in our packages, including transfers from the airport to your hotel and back. Some packages, such as our Star package, include private luxury transport.",
    },
    {
      q: "How far are your hotels from the Haram?",
      a: "We use 4-star and 5-star hotels close to the Haram. The distance depends on the package; ask us on WhatsApp and we will tell you the walking distance for each hotel. For example, our Star package uses the 5-star Le Méridien in Makkah and the 4-star Al Ansar Golden Tulip in Madinah, and our 21-day package includes hotels with a free shuttle to the Haram.",
    },
    {
      q: "Are meals included in the package?",
      a: "Meals are not included as standard. On request, we can add breakfast, half board or full board in 4-star and 5-star hotels.",
    },
    {
      q: "What room sharing options are available?",
      a: "Different room sharing options are available, and the price depends on the room type you choose. Tell us who is travelling and we will suggest the right rooms.",
    },
    {
      q: "Can I upgrade my hotel after choosing a package?",
      a: "Yes. Upgrades are possible before you travel, subject to availability. Any price difference is payable at the time of the change.",
    },
    {
      q: "Do you have Urdu-speaking guides?",
      a: "Yes. Our guides speak Urdu, and our partners in Makkah and Madinah support the group throughout the journey.",
    },
    {
      q: "Is ziyarah included?",
      a: "Ziyarah of the historic sites of Makkah and Madinah is arranged by our partners on the ground, and our Star package includes a historical tour of both holy cities.",
    },
    {
      q: "How do pilgrims travel between Makkah and Madinah?",
      a: "It depends on the package: we offer both shared coaches and private luxury transport. Some packages, such as our Star package, also include a journey on the Haramain high-speed train.",
    },
    {
      q: "Is there a 24/7 contact number while we are in Saudi Arabia?",
      a: "Yes. 24/7 on-ground support is included in every package. You can WhatsApp us anytime on +92 333 4883578, even from the Haram itself.",
    },
    {
      q: "Do you arrange women-only groups?",
      a: "Yes, when we are running a dedicated women's group. Ask us about upcoming women's groups when you enquire.",
    },
    {
      q: "Is insurance included? What happens if a pilgrim falls ill?",
      a: "Yes, insurance is included in every package. If a pilgrim falls ill, our team on the ground helps arrange medical care.",
    },
    {
      q: "Do you offer Ramadan Umrah and the last ten nights?",
      a: "Yes. We offer Ramadan Umrah packages, including the last ten nights. This is the most sought-after time of the year, so please ask us early.",
    },
    {
      q: "Can children travel for Umrah?",
      a: "Yes. Families and children are welcome. Tell us who is travelling when you message us, and we will suggest the right rooms and schedule.",
    },
    {
      q: "Is Karwan e Usmania International an established Umrah operator?",
      a: "Yes. Karwan e Usmania International is a Lahore-based travel operator that has served pilgrims since 2005. We work with established Saudi partners on the ground in Makkah and Madinah for hotels, transport and guides.",
    },
    {
      q: "Is Karwan e Usmania International a registered company?",
      a: "Yes. Karwan e Usmania International is registered in Pakistan and has been serving pilgrims since 2005.",
    },
    {
      q: "How many pilgrims have you served?",
      a: "Since 2005, we have served more than 25,000 pilgrims.",
    },
    {
      q: "What makes Karwan e Usmania International different?",
      a: "More than 21 years of experience since 2005, trusted partners on the ground in Makkah and Madinah, every cost explained in writing before you commit, and 24/7 support from your first call to your safe return.",
    },
    {
      q: "Where is your office?",
      a: "Office No. 2, 1st Floor, Usman Plaza, 436-G1, Opposite Butt Sweets, Johar Town, Lahore. We are open Monday to Friday 11 am to 7 pm and Saturday 11 am to 5 pm (Pakistan time), and closed on Sunday. WhatsApp is the fastest way to reach us: +92 333 4883578. You can also call +92 42 35136177.",
    },
    {
      q: "Do I need an appointment to visit your office?",
      a: "No appointment is needed. You are welcome at our office in Usman Plaza, Johar Town, Lahore, Monday to Friday 11 am – 7 pm and Saturday 11 am – 5 pm (closed Sunday). If you message us on WhatsApp first, we can make sure the right person is there to meet you.",
    },
    {
      q: "What is Qafila e Shoq?",
      a: "Qafila e Shoq is a spiritual journey programme led by Pirzada Burhan uddin Ahmed Usmani Sahib (Islamic Scholar). It is built around four pillars: Ibadah (worship), Riyazat (spiritual discipline), Tarbiyat (development) and Siyahat (sacred travel). It is not a regular travel package: seats are limited and by application only.",
    },
    {
      q: "How do I apply for Qafila e Shoq?",
      a: "Apply by WhatsApp; seats are limited and by application only. Qafila e Shoq is led by Pirzada Burhan uddin Ahmed Usmani Sahib (Islamic Scholar) and is for those who want a spiritual journey built around worship, spiritual discipline, personal development and sacred travel, not only a regular Umrah.",
    },
  ],

  qafila: {
    name: 'Qafila e Shoq',
    tagline: 'A Sacred Caravan of Devotion',
    urduTagline: 'قافلہ شوق',
    logo: '/qafila-logo.png',
    leader: 'Pirzada Burhan uddin Ahmed Usmani Sahib',
    leaderTitle: 'Islamic Scholar',
    intro: 'Led under the guidance of Pirzada Burhan uddin Ahmed Usmani Sahib (Islamic Scholar), Qafila e Shoq is your path to spiritual growth, meaningful companionship, and unforgettable connection with the sacred.',
    body: 'Qafila e Shoq is more than a travel group — it is a transformative spiritual journey for seekers of closeness to Allah ﷻ. Rooted in tradition and guided by scholars, the experience is structured around four sacred pillars:',
    pillars: [
      {
        icon: 'crescent',
        urdu: 'عبادت',
        title: 'Ibadah — Acts of Worship',
        body: 'Deepen your connection with Allah ﷻ through structured worship in the holy cities. Participate in collective prayers, tahajjud, and dhikr circles designed to nourish the soul in sacred spaces.',
      },
      {
        icon: 'shield',
        urdu: 'ریاضت',
        title: 'Riyazat — Spiritual Discipline',
        body: "Engage in self-purification and inner reform through routine, reflection, and spiritual exercises. This pillar focuses on building consistency, humility, and sincerity in one's relationship with the Creator.",
      },
      {
        icon: 'guide',
        urdu: 'تربیت',
        title: 'Tarbiyat — Personal & Spiritual Development',
        body: 'Benefit from daily spiritual sessions, lectures, and mentorship by qualified scholars. The focus is on improving character, understanding deen, and living Islam with purpose.',
      },
      {
        icon: 'kaaba',
        urdu: 'سیاحت',
        title: 'Siyahat — Sacred Travel & Reflection',
        body: 'Visit holy sites with spiritual context and purpose. This journey is not tourism — it is sacred exploration filled with reflection, learning, and love for the Prophet ﷺ and his legacy.',
      },
    ],
    waMessage: 'Assalamu Alaikum! I would like to know more about the Qafila e Shoq spiritual journey programme led by Pirzada Burhan uddin Ahmed Usmani Sahib.',
  },

  about: {
    story: [
      'Karwan e Usmania International was founded in Lahore with a single mission: to make the sacred journey of Umrah accessible, comfortable, and spiritually fulfilling for every Muslim family.',
      'Named in honour of the revered traditions of Islamic travel, we have spent 21 years perfecting every detail of the pilgrimage experience — from the moment you call us, to the day you return home with a heart full of duas.',
      'Our team in Lahore and our partners in Makkah and Madinah work as one Karwan, walking with you through every stage of your spiritual journey.',
      'We do not see our pilgrims as customers — we see them as Mehmaan-e-Khuda, the guests of Allah. That is the standard we hold ourselves to.',
    ],
    storyImage: 'keu/makkah/masjid-al-haram',
    storyImageAlt: 'Masjid al-Haram during Tawaf',
  },

  gallery: [
    { src: 'keu/makkah/masjid-al-haram',         alt: 'Masjid al-Haram during Tawaf',                  size: 'wide' },
    { src: 'keu/madinah/prophets-mosque',        alt: 'Masjid an-Nabawi — the green dome at sunset',   size: 'tall' },
    { src: 'keu/makkah/kaaba',                   alt: 'The Kaaba surrounded by pilgrims',              size: ''     },
    { src: 'keu/madinah/madinah-city',           alt: 'Madinah city view at golden hour',              size: ''     },
    { src: 'keu/makkah/haram-exterior',          alt: 'Masjid al-Haram exterior at night',             size: 'tall' },
    { src: 'keu/madinah/masjid-nabawi-exterior', alt: "Prophet's Mosque courtyard with umbrellas",     size: 'wide' },
    { src: 'keu/makkah/makkah-city',             alt: 'Makkah skyline with Clock Tower',               size: ''     },
    { src: 'keu/makkah/haram-reference',        alt: 'Tawaf around the Kaaba — aerial view',          size: ''     },
  ],

  heroImages: {
    primary:  'keu/makkah/kaaba',
    fallback: 'keu/makkah/masjid-al-haram',
  },
}

/* Placeholder packages, shown only until /api/content answers (or when the API
   is unreachable). The live packages are managed in the admin. These carry no
   prices, nights or hotel names, so the first paint never advertises an offer
   that does not exist: both cards read "Price on request" and point to
   WhatsApp. Two cards, like the live list, so the grid does not reflow when the
   real ones arrive. Umrah only (owner, 2026-10-10): no Hajj or VIP defaults. */
export const PACKAGES = [
  {
    id: 'umrah-package',
    name: 'Umrah Package',
    category: 'umrah',
    tier: 'economy',
    icon: '🕋',
    price: 0,
    priceLabel: 'On request',
    perPerson: true,
    nights: 0,
    subtitle: 'Makkah and Madinah · dates on request',
    summary: 'Tell us your dates and who is travelling, and we will share the current packages and prices in writing.',
    badge: null,
    featured: true,
    inclusions: [
      'Visa processing included',
      'Hotels close to the Haram',
      'Airport and intercity transport',
      'Insurance and documentation',
      '24/7 on-ground support',
    ],
    waMessage: 'Assalamu Alaikum! I would like details about your Umrah packages, dates and hotels.',
  },
  {
    id: 'premium-umrah',
    name: 'Premium Umrah',
    category: 'umrah',
    tier: 'premium',
    icon: '🕌',
    price: 0,
    priceLabel: 'On request',
    perPerson: true,
    nights: 0,
    subtitle: '4 and 5-star hotels · dates on request',
    summary: 'Tell us your dates and who is travelling, and we will share the current premium packages and prices in writing.',
    badge: null,
    featured: true,
    inclusions: [
      'Visa processing included',
      '4 and 5-star hotels close to the Haram',
      'Private transport on request',
      'Insurance and documentation',
      '24/7 on-ground support',
    ],
    waMessage: 'Assalamu Alaikum! I would like details about your premium Umrah packages, dates and hotels.',
  },
]
