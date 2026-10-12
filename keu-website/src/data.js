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
    { icon: 'visa',  label: 'Visa Processing', sublabel: '100% approval rate' },
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
    { value: 100,   suffix: '%', label: 'Visa Success Rate', icon: 'check'    },
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
      quote: 'VIP package was worth every rupee. The hotel was right next to the Haram and the guide was incredibly knowledgeable. Highly recommend.',
      name: 'Imran Sheikh',
      location: 'Islamabad',
      trip: 'VIP Umrah · 2023',
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

  // Corrected text (docs/rebrand/content-corrections.md §2, owner-approved 2026-10-10).
  faqs: [
    {
      q: 'How much does an Umrah package from Pakistan cost?',
      a: 'Prices depend on the hotels, the number of nights and whether flights are included. Our current packages are listed with their prices on the Packages page, and every cost is explained in writing before you commit.',
    },
    {
      q: 'How long does Saudi Umrah visa processing take?',
      a: 'Saudi Umrah visas are typically processed within 5–7 working days, and we have a 100% approval rate. The visa fee, biometric appointment and document attestation are all handled by our team, so you do not need to visit the consulate.',
    },
    {
      q: 'What is included in an Umrah package?',
      a: 'Every package includes Saudi visa processing, insurance, documentation and 24/7 on-ground support. Hotels, transport, flights and ziyarah depend on the package: each package lists exactly what it includes, and some are offered without an air ticket.',
    },
    {
      q: 'When is the best time for Umrah?',
      a: 'Umrah can be performed at any time of year except during the Hajj season. The last 10 nights of Ramadan are the most sought-after time, so ask us early about Ramadan dates. The cooler months, November to February, are gentler for elderly pilgrims.',
    },
    {
      q: 'Can children travel for Umrah?',
      a: 'Yes. Families and children are welcome. Tell us who is travelling when you message us, and we will suggest the right rooms and schedule.',
    },
    {
      q: 'Is Karwan e Usmania International an established Umrah operator?',
      a: 'Yes. Karwan e Usmania International is a Lahore-based travel operator that has served pilgrims since 2005. We work with established Saudi partners on the ground in Makkah and Madinah for hotels, transport and guides.',
    },
    {
      q: 'Where is your office?',
      a: 'Office No. 2, 1st Floor, Usman Plaza, 436-G1, Opposite Butt Sweets, Johar Town, Lahore. We are open Monday to Friday 11 am to 7 pm and Saturday 11 am to 5 pm (Pakistan time), and closed on Sunday. WhatsApp is the fastest way to reach us: +92 333 4883578. You can also call +92 42 35136177.',
    },
    {
      q: 'What is Qafila e Shoq?',
      a: 'Qafila e Shoq is a spiritual journey programme led by Pirzada Burhan uddin Ahmed Usmani Sahib (Islamic Scholar). It is built around four pillars: Ibadah (worship), Riyazat (spiritual discipline), Tarbiyat (development) and Siyahat (sacred travel). It is not a regular travel package: seats are limited and by application only.',
    },
    {
      q: 'How do I book?',
      a: 'WhatsApp is our main booking channel. Message +92 333 4883578 with your preferred package and travel dates. You can also call +92 42 35136177, email keusmania@gmail.com, or visit our office in Johar Town.',
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

export const PACKAGES = [
  {
    id: 'economy-umrah',
    name: 'Economy Umrah',
    category: 'umrah',
    tier: 'economy',
    icon: '🕋',
    price: 185000,
    priceLabel: 'PKR 185,000',
    perPerson: true,
    nights: 14,
    subtitle: '14 Nights · 3-Star Hotels',
    summary: '7 nights Makkah · 7 nights Madinah',
    badge: null,
    inclusions: [
      'Economy class flights',
      '3-star hotels (800m–1km from Haram)',
      'Visa processing included',
      'Shared AC transport',
      'Group guide (Urdu)',
      'Halal meals on arrival days',
    ],
    waMessage: 'Assalamu Alaikum! I am interested in the Economy Umrah package (PKR 185,000). Please share details, available dates, and the booking process.',
  },
  {
    id: 'premium-umrah',
    name: 'Premium Umrah',
    category: 'umrah',
    tier: 'premium',
    icon: '🕌',
    price: 285000,
    priceLabel: 'PKR 285,000',
    perPerson: true,
    nights: 14,
    subtitle: '14 Nights · 4-Star Hotels',
    summary: '7 nights Makkah · 7 nights Madinah',
    badge: 'Most Popular',
    inclusions: [
      'Economy+ class flights',
      '4-star hotels (500m from Haram)',
      'Visa processing included',
      'Semi-private AC transport',
      'Ziyarah tours included',
      'Dedicated Urdu-speaking guide',
    ],
    waMessage: 'Assalamu Alaikum! I am interested in the Premium Umrah package (PKR 285,000). Please share details, available dates, and hotel options.',
  },
  {
    id: 'vip-umrah',
    name: 'VIP Umrah',
    category: 'umrah',
    tier: 'vip',
    icon: '✨',
    price: 450000,
    priceLabel: 'PKR 450,000',
    perPerson: true,
    nights: 14,
    subtitle: '14 Nights · 5-Star Hotels',
    summary: 'Hilton · Pullman · Makkah Clock Tower tier',
    badge: 'VIP',
    inclusions: [
      'Business class flights',
      '5-star hotels (Hilton/Pullman/Clock Tower)',
      'Private car transfers',
      'Full ziyarah programme',
      'Personal Urdu/Arabic guide',
      'Concierge & 24/7 support',
    ],
    waMessage: 'Assalamu Alaikum! I am interested in the VIP Umrah package (PKR 450,000). Please share details, hotel choices, and dates.',
  },
  {
    id: 'ramadan-umrah',
    name: 'Ramadan Umrah',
    category: 'ramadan_umrah',
    tier: 'premium',
    icon: '🌙',
    price: 550000,
    priceLabel: 'PKR 550,000',
    perPerson: true,
    nights: 10,
    subtitle: 'Last 10 Nights of Ramadan',
    summary: 'Laylat-ul-Qadr experience package',
    badge: 'Limited Seats',
    inclusions: [
      '5-star hotels close to Haram',
      'Iftar & Suhoor arrangements',
      'Laylat-ul-Qadr night programme',
      'Private transport',
      'Senior scholar ziyarah talk',
      'All visa & flights included',
    ],
    waMessage: 'Assalamu Alaikum! I am interested in the Ramadan Umrah package. Please share 2025 dates, pricing, and hotel options.',
  },
  // Hajj removed: the karwan offers Umrah only for now (owner, 2026-10-10).
  {
    id: 'family-umrah',
    name: 'Family Umrah',
    category: 'family',
    tier: 'premium',
    icon: '👨‍👩‍👧‍👦',
    price: 240000,
    priceLabel: 'PKR 240,000',
    perPerson: true,
    nights: 12,
    subtitle: 'Designed for families with children',
    summary: 'Family rooms · Easy schedule · Kids welcome',
    badge: 'Family',
    inclusions: [
      'Family rooms (4-pax)',
      'Direct flights (less stopover)',
      '4-star hotels — pram friendly',
      'Lighter ziyarah schedule',
      'Female attendants on request',
      'Free seat for under-2 children',
    ],
    waMessage: 'Assalamu Alaikum! I am interested in the Family Umrah package. We are travelling with children — please share details.',
  },
]
