# SKILL: UI Components Agent
## Role
You build all reusable UI components: navigation, package cards, testimonials, gallery, footer. Pixel-perfect, animated, responsive.

## Components to Build

### 1. Navigation (`src/js/nav.js`)
```js
export function initNav() {
  const nav = document.querySelector('.nav')
  const hamburger = document.querySelector('.nav-hamburger')
  const drawer = document.querySelector('.nav-drawer')

  hamburger?.addEventListener('click', () => {
    drawer.classList.toggle('open')
    hamburger.classList.toggle('active')
    document.body.classList.toggle('no-scroll')
  })

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) drawer.classList.remove('open')
  })
}
```

### 1. Navigation HTML
```html
<nav class="nav">
  <div class="nav-inner container">
    <a href="/index.html" class="nav-logo">
      <img src="/logo.png" alt="Karwan-e-Usmania" height="50">
    </a>
    <ul class="nav-links">
      <li><a href="/index.html">Home</a></li>
      <li><a href="/packages.html">Packages</a></li>
      <li><a href="/about.html">About</a></li>
      <li><a href="/gallery.html">Gallery</a></li>
      <li><a href="/contact.html">Contact</a></li>
    </ul>
    <div class="nav-actions">
      <a href="https://wa.me/923XXXXXXXXX" class="btn-whatsapp-nav" target="_blank">
        WhatsApp بک کریں
      </a>
    </div>
    <button class="nav-hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="nav-drawer">
    <!-- Mobile links clone -->
  </div>
</nav>
```

### 1. Navigation CSS
```css
.nav {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 100;
  padding: var(--space-4) 0;
  transition: background 0.4s, box-shadow 0.4s, padding 0.4s;
}
.nav--scrolled {
  background: var(--color-navy);
  box-shadow: 0 4px 30px rgba(13,27,53,0.4);
  padding: var(--space-2) 0;
}
.nav-inner {
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-6);
}
.nav-links {
  display: flex; list-style: none; gap: var(--space-8);
}
.nav-links a {
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.03em;
  transition: color 0.2s;
  position: relative;
}
.nav-links a::after {
  content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
  height: 1.5px; background: var(--color-gold);
  transform: scaleX(0); transition: transform 0.25s;
}
.nav-links a:hover { color: var(--color-gold); }
.nav-links a:hover::after { transform: scaleX(1); }
.btn-whatsapp-nav {
  background: #25d366; color: white; padding: 10px 20px;
  border-radius: 999px; font-size: var(--text-sm); font-weight: 600;
  text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
}
.btn-whatsapp-nav:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,211,102,0.4); }
.nav-hamburger { display: none; /* shown on mobile via media query */ }
```

### 2. Package Card HTML Template
```html
<div class="package-card" data-type="premium">
  <div class="package-badge">Most Popular</div>
  <div class="package-top">
    <div class="package-icon">🕋</div>
    <h3 class="package-name">Premium Umrah</h3>
    <p class="package-nights">14 Nights · 4-Star Hotels</p>
  </div>
  <div class="package-price">
    <span class="price-from">Starting from</span>
    <span class="price-amount">PKR 285,000</span>
    <span class="price-per">per person</span>
  </div>
  <ul class="package-features">
    <li>✓ Economy+ Class Flights</li>
    <li>✓ 4-Star Hotel (500m from Haram)</li>
    <li>✓ Visa Processing Included</li>
    <li>✓ Semi-Private Transport</li>
    <li>✓ Ziyarah Tours</li>
    <li>✓ Urdu-Speaking Guide</li>
  </ul>
  <a href="https://wa.me/923XXXXXXXXX?text=I'm interested in Premium Umrah" class="btn-primary btn-full">
    Book Now — بک کریں
  </a>
</div>
```

### 2. Package Card CSS
```css
.package-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--space-8);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-top: 4px solid var(--color-gold);
}
.package-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(26,46,94,0.12), 0 0 0 1px rgba(201,168,76,0.2);
}
.package-badge {
  position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
  background: var(--color-gold); color: var(--color-navy-dark);
  font-size: var(--text-xs); font-weight: 700;
  padding: 6px 20px; border-radius: 999px;
  text-transform: uppercase; letter-spacing: 0.08em;
  white-space: nowrap;
}
.package-price { margin: var(--space-6) 0; border-top: 1px dashed var(--color-border); padding-top: var(--space-6); }
.price-amount { display: block; font-family: var(--font-heading); font-size: var(--text-3xl); font-weight: 700; color: var(--color-navy); }
.price-from, .price-per { font-size: var(--text-xs); color: var(--color-text-muted); }
.package-features { list-style: none; padding: 0; margin: 0 0 var(--space-6); }
.package-features li { padding: var(--space-2) 0; font-size: var(--text-sm); border-bottom: 1px solid rgba(0,0,0,0.04); color: var(--color-text-dark); }
.btn-full { width: 100%; display: block; text-align: center; }
```

### 3. Testimonial Card
```html
<div class="testimonial-card">
  <div class="stars">★★★★★</div>
  <p class="testimonial-text">"Alhamdulillah, our Umrah with Karwan-e-Usmania was a dream. Everything was perfect from the visa to the hotel. May Allah reward this team."</p>
  <div class="testimonial-author">
    <div class="author-avatar">MH</div>
    <div>
      <strong>Muhammad Hassan</strong>
      <span>Lahore · Umrah 2024</span>
    </div>
  </div>
</div>
```

### 4. WhatsApp Float Button
```html
<a href="https://wa.me/923XXXXXXXXX?text=Assalamu Alaikum, I would like to enquire about Hajj/Umrah packages."
   class="whatsapp-float" target="_blank" aria-label="Chat on WhatsApp">
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
  <span class="wa-label">Book Now</span>
</a>
```

### 4. Footer HTML
```html
<footer class="footer">
  <div class="footer-top container">
    <div class="footer-brand">
      <img src="/logo.png" alt="Karwan-e-Usmania" height="56">
      <p>Your trusted partner for Hajj & Umrah from Lahore, Pakistan since 2005.</p>
      <p class="footer-arabic">اللّٰهُمَّ اجْعَلْ هَذَا الْبَيْتَ حَجًّا مَبْرُوراً</p>
    </div>
    <div class="footer-links">
      <h4>Quick Links</h4>
      <ul><li><a href="/packages.html">Hajj Packages</a></li><li><a href="/packages.html">Umrah Packages</a></li><li><a href="/about.html">About Us</a></li><li><a href="/contact.html">Contact</a></li></ul>
    </div>
    <div class="footer-contact">
      <h4>Contact Us</h4>
      <p>📍 Lahore, Pakistan</p>
      <p>📞 <a href="tel:+92XXXXXXXXXX">+92-XXX-XXXXXXX</a></p>
      <p>💬 <a href="https://wa.me/923XXXXXXXXX">WhatsApp</a></p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2024 Karwan-e-Usmania. All rights reserved.</p>
    <p>Ministry of Religious Affairs Licensed Operator</p>
  </div>
</footer>
```

## Output Required
- All component HTML inserted into all relevant pages
- All component CSS added to `components.css`
- `src/js/nav.js` complete with mobile drawer
- Update `agents/project-state.json` → `status.ui_components = "done"`
