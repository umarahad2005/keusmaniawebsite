# Deployment — Karwan-e-Usmania

React SPA + Vercel serverless API + MongoDB Atlas + Brevo SMTP + Cloudinary.

## 1. Local setup (one-off)

```powershell
cd D:\personal\projects\keusmaniawebsite\keu-website
npm install
copy .env.example .env.local
# Fill in .env.local with the values from sections 4–7 below
```

## 2. First-time admin seeding

After setting `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` in `.env.local`:

```powershell
npm run seed:admin
```

This creates (or updates) the admin user. Re-run any time to rotate the password.

## 3. Run locally

```powershell
npm run dev
```

That single command runs **both** processes via `concurrently`:

- `dev:api` — local Express server on `:3001` that loads every handler in `api/*.js`
- `dev:web` — Vite React dev server on `:5173`, proxying `/api/*` → `:3001`

Open **http://localhost:5173** for the public site, **http://localhost:5173/admin/login** for the dashboard. If `MONGODB_URI` / `JWT_SECRET` aren't set in `.env.local`, the API still starts but Mongo-backed routes return 503; the public site falls back to the bundled `data.js` so it always renders.

### Production-parity dev (optional)

If you want to test against the real Vercel runtime (e.g. to verify edge headers):

```powershell
npm install -g vercel
npm run vercel-dev    # serves api/* via Vercel CLI on :3000
# then run:
npm run dev:web
# (manually flip vite.config.js proxy target to :3000 first, or set DEV_API_PORT=3000)
```

## 4. MongoDB Atlas (free tier)

1. Sign up at https://cloud.mongodb.com
2. Build a Database → free **M0** cluster, region close to Vercel (e.g. AWS `us-east-1`)
3. **Database Access** → add a user (`keu_admin`, strong password)
4. **Network Access** → add IP `0.0.0.0/0` (Vercel IP pool is dynamic)
5. **Connect → Drivers** → copy the `mongodb+srv://` URI
6. Paste into `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://keu_admin:<PASSWORD>@cluster.xxx.mongodb.net/keu?retryWrites=true&w=majority
   ```

Database collections (auto-created):
- `admins` — the single admin account
- `inquiries` — every contact-form submission
- `contents` — keyed by type (`site`, `packages`) — what the dashboard edits

## 5. Brevo SMTP (or SendGrid)

**Brevo** (formerly Sendinblue):
1. Sign up at https://brevo.com
2. Senders → add and verify `info@keusmania.com` (or any domain you own)
3. SMTP & API → SMTP → copy the host, port, login, master password
4. `.env.local`:
   ```
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_USER=<your-brevo-login>
   SMTP_PASS=<the-smtp-key>
   MAIL_FROM="Karwan-e-Usmania <noreply@keusmania.com>"
   MAIL_TO=itdepartpak@gmail.com
   ```

**SendGrid** alternative:
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<your-sendgrid-api-key>
```

## 6. Cloudinary

1. Sign up at https://cloudinary.com (free, 25 GB)
2. Dashboard → grab `Cloud name`, `API Key`, `API Secret`
3. **Settings → Upload → Add upload preset** → Mode: Unsigned (we sign server-side, so it's actually fine to keep signed too — the API uses the secret)
4. `.env.local`:
   ```
   CLOUDINARY_CLOUD_NAME=<cloud_name>
   CLOUDINARY_API_KEY=<key>
   CLOUDINARY_API_SECRET=<secret>
   CLOUDINARY_UPLOAD_PRESET=keu_unsigned

   VITE_CLOUDINARY_CLOUD_NAME=<cloud_name>
   VITE_CLOUDINARY_UPLOAD_PRESET=keu_unsigned
   ```

> **Paste these with no leading/trailing spaces.** `dotenv` trims values locally but
> Vercel stores them verbatim, so a stray space only breaks production — it lands in
> the upload URL and Cloudinary rejects the request. `VITE_*` vars are baked in at
> build time, so editing them in Vercel does nothing until you redeploy.

### Site images

All images under the old `public/images/` now live in Cloudinary under the `keu/`
prefix — `keu/makkah/kaaba`, `keu/team/burhan`, and so on. Content references the
bare public_id; `src/lib/images.js` turns it into a delivery URL with `f_auto,q_auto`
(AVIF/WebP negotiation + per-image quality) and `src/components/Img.jsx` adds a
responsive `srcSet`. Admin-uploaded images arrive as full `secure_url`s and flow
through the same helper.

To re-upload the originals (idempotent — same public_ids, no duplicates):

```powershell
node scripts/migrate-images-to-cloudinary.js --dry   # preview the mapping
node scripts/migrate-images-to-cloudinary.js
```

## 7. JWT + admin password

```
JWT_SECRET=<paste a 32+ char random string here, e.g. openssl rand -hex 32>
ADMIN_EMAIL=itdepartpak@gmail.com
ADMIN_PASSWORD=<your-chosen-password>
```

### Changing the admin login

**Env is the source of truth.** Edit `ADMIN_EMAIL` / `ADMIN_PASSWORD` in
Vercel → **Settings → Environment Variables**, then redeploy. The new pair works
immediately; the old one stops working the moment the deploy goes live.

Details worth knowing:

- **The old password stops working straight away.** While these vars are set, the
  `Admin` collection is never consulted to check a password — otherwise a stale
  bcrypt hash in Mongo would keep accepting the previous one.
- **Changing either var signs out every open session.** Each token carries a
  fingerprint of the current credentials; rotating them invalidates cookies that
  were issued under the old pair, so you'll be asked to log in again.
- **Changing `ADMIN_EMAIL` is safe.** The row under the previous address is
  removed on the next login, so it can't keep accepting the old credentials.
- **Leading/trailing whitespace is trimmed** from both values — Vercel stores
  what you paste verbatim, and a trailing newline would otherwise mean the
  password silently never matches.
- **Remove both vars** and the app falls back to the `Admin` collection in Mongo,
  the previous behaviour. `npm run seed:admin` still writes that row.

Redeploy is required either way: env changes only apply to new deployments.

## 8. Production deploy (Vercel)

```powershell
vercel              # first run — links the project
vercel --prod       # ship
```

In **Vercel → Project → Settings → Environment Variables**, paste every key from your `.env.local` into the production environment (and Preview, if you want preview deployments to work).

`vercel.json` is wired so all SPA routes fall back to `index.html`, except `/api/*` which hits the serverless functions.

## 9. The dashboard

Live at `https://your-domain.com/admin/login`. Sign in with `ADMIN_EMAIL` + `ADMIN_PASSWORD`.

| Section | What you can do |
| --- | --- |
| **Inbox**       | All contact-form submissions, newest first. Filter by status, mark unread/read/replied/archived, reply via WhatsApp or email, delete. |
| **Company**     | Phone, WhatsApp, email, address, founded year, social URLs |
| **Packages**    | Add / edit / delete packages — name, price, badge, inclusions, WhatsApp message |
| **Testimonials**| List of pilgrim quotes — quote, name, location, trip, rating, initials |
| **Team**        | Names, roles, photos (Cloudinary upload widget) |
| **Gallery**     | Drop-in image uploads — alt text, size hint (tall/wide) |
| **Sanctuaries** | Makkah / Madinah cards (JSON editor) |
| **Why Choose Us** | The four "why" cards (JSON editor) |

Every save writes to MongoDB (`contents` collection). The public site fetches from `/api/content` on every page load — changes go live within seconds.

## 10. Email flow

When a visitor submits the contact form:
1. POST `/api/contact` → saves an inquiry to MongoDB
2. Nodemailer sends a richly-formatted notification to `MAIL_TO`
3. WhatsApp opens client-side with the same message pre-filled (so visitors are never stuck)
4. Inquiry shows up at `/admin/inbox` — usually within 1–2 seconds

If SMTP fails, the inquiry is still saved (so you don't lose leads); the failure is logged.

## 11. QA checklist (passed at handover)

- [x] React SPA on `/`, `/packages`, `/about`, `/gallery`, `/contact`
- [x] Admin SPA on `/admin/*`, JWT cookie auth (httpOnly)
- [x] Hero with Kaaba photo backdrop + transparent Three.js dome
- [x] Dynamic content load with bundled-data fallback
- [x] Contact form → MongoDB + email + WhatsApp
- [x] Cloudinary signed direct-upload from dashboard
- [x] Real Mansoora Homes Multan Road embed in contact map
- [x] No certificate / license copy anywhere
- [x] Tier-C dashboard: inbox + 7 content editors

## 12. Lighthouse expectations

| Category       | Target |
| -------------- | ------ |
| Performance    | 90+    |
| Accessibility  | 95+    |
| Best Practices | 95+    |
| SEO            | 100    |
