# Gap fill 3: hosting the hero video (Cloudinary, Vercel, Bunny, Cloudflare Stream)

Researched 2026-10-10. This file covers codebase.md risk R12 and the open questions in footage.md section 7 ("Cloudinary's free-plan limits for video size and on-the-fly transformation were not checked") and codebase.md line 266 ("That the Cloudinary cloud `dpmnlysdt` has video delivery enabled / enough credits"). Every figure below was fetched today unless it is marked UNVERIFIED.

---

## 0. Bottom line

1. **On Cloudinary Free, the hero video uses up the 25 monthly credits at about 13,000 home views a month.** At 20k views it needs about 38 credits, and at 50k about 95. The only paid step is Plus at **$89/mo (yearly) or $99/mo (monthly)** for 225 credits. That is a poor price for one 14-second loop.
2. **Vercel Hobby is "personal or non-commercial use" only** (Terms, section 4). Vercel's own list of commercial uses includes "Advertising the sale of a product or service", and this site sells Umrah and Hajj packages. So the site breaks Hobby terms if it is on Hobby, with or without the video. I could not check which plan `keusmania.vercel.app` is on (see section 6).
3. **Recommendation:** serve the pre-encoded MP4s **from Vercel as Vite-hashed assets** (`import heroUrl from './assets/video/hero-1080.mp4'`, which Vite emits as `/assets/hero-1080-[hash].mp4`) **on Vercel Pro ($20/mo, 1 TB Fast Data Transfer included)**. The owner needs Pro anyway for a commercial site. The video adds **95 GB/month at 50k views, under 10% of the included 1 TB, so it costs $0 extra**. The existing `vercel.json` rule for `/assets/(.*)` (`public, max-age=31536000, immutable`) already covers these files, so **no change to the cache headers is needed**. Leave images and the poster on Cloudinary.
   - If the owner will not move to Pro, put the MP4s on **Bunny CDN** (Storage plus a Pull Zone). It costs **$1 to $3 a month** at these volumes and has no commercial-use restriction. This fixes only the video cost, not the Hobby terms problem.

---

## 1. Cloudinary: what the docs say (fetched 2026-10-10)

| Item | Value | Source |
|---|---|---|
| Free plan credits | **25 monthly credits**, 3 users / 1 account | https://cloudinary.com/pricing |
| 1 credit = | "1,000 transformations" OR "1GB managed storage" OR "1GB image bandwidth" | https://cloudinary.com/pricing |
| Video bandwidth per credit | "**1 GB** on the Free plan, or **2 GB** on self-service paid plans" | https://cloudinary.com/documentation/billing_and_plans |
| Video seconds per credit (compare-plans FAQ) | "500 SD video seconds, or 250 HD video processing seconds" | https://cloudinary.com/pricing/compare-plans |
| Bandwidth meaning | "1 GB generally comes to ~500 seconds of delivered SD video or ~250 seconds of HD video". For images, bandwidth is "based on the *delivered* image file size" | https://cloudinary.com/documentation/developer_onboarding_faq_credits |
| Max video upload (Free) | **100 MB** | compare-plans; also a Cloudinary staff answer on support.cloudinary.com |
| Max image file / raw file / image MP (Free) | 10 MB / 10 MB / 25 MP (multi-frame 50 MP) | compare-plans |
| **On-the-fly video transformation cap** | "Video exceeds the size limit for on-the-fly transformations (**40MB for Free plans**, 300MB for paid plans)". Fix: eager transformation with `eager_async=true` | https://cloudinary.com/documentation/ts_troubleshooting_video_transformation_errors |
| Overage behaviour | "Cloudinary's limits are soft limits", followed by warning emails and an upgrade prompt. "Cloudinary won't immediately disable your account or disrupt production without warning". If no action is taken after repeated notices, the account is "eventually disabled automatically" | compare-plans FAQ; billing_and_plans |
| Cheapest paid plan | **Plus: $99/mo monthly, $89/mo yearly, 225 credits** | pricing |
| Admin API | 500 requests/hour (Free) | compare-plans |

### 1.1 How video transformations are counted (https://cloudinary.com/documentation/transformation_counts)

Transformations per second of output video:

| Output | h264 | h265 / VP9 | AV1 |
|---|---|---|---|
| SD (≤ 921,600 px, e.g. 1280x720) | 2 | 2 | 16 |
| HD (≤ 2,073,600 px, e.g. 1920x1080) | 4 | 4 | 32 |
| 4K (≤ 8,294,400 px) | 8 | 8 | 64 |
| > 4K | 120 | 120 | 960 |

- "Parts of seconds are counted as one second." Audio adds nothing. HDR costs 2x.
- **f_auto / q_auto / vc_auto have no listed surcharge.** They are counted like any other derived output. Each unique derived video is counted once, however many times it is viewed (developer FAQ, via search summary). Each codec or format that `f_auto` creates is a separate derived output.
- Worst case for our 14 s loop: one AV1 1080p derivative costs 14 x 32 = 448 transformations and one 720p AV1 derivative costs 224, so about 0.7 credits once. H.264 and VP9 cost 56 (HD) and 28 (SD). **Transformations are a one-off cost. Bandwidth is what grows every month.**
- Delivering a pre-encoded upload with **no transformation segment** (`/video/upload/v123/keu/hero/hero-1080.mp4`) costs zero transformations. Only storage and bandwidth count.
- The docs do not say whether a poster frame taken with `so_0` (an image derived from a video) costs more. UNVERIFIED. Treat it as an ordinary transformation.

### 1.2 Things that would break the plans in footage.md and codebase.md

- **Uploading the 4K Pexels originals to Cloudinary and transforming them on the fly will fail on Free.** #1 35110835 is 42.4 MB and #2 35110822 is 43.4 MB, both over the **40 MB** on-the-fly cap. #4 31208756 is 228 MB, over the **100 MB** upload cap. footage.md section 5.1 ("pre-process offline, do not rely on on-the-fly transforms") is therefore required, not optional.
- `q_auto` on video creates a new derived encode, and its byte size may not match our 3.71 MB cap (footage.md section 5.2). If Cloudinary is used at all, upload the final ffmpeg output and deliver it **without a transform segment** so the bytes stay the ones we measured.
- Video and image share the same 25 credits. The site's current image bandwidth (Cloudinary dashboard) is **UNVERIFIED** because I have no console access. Every GB of video bandwidth means less headroom for images.

---

## 2. Is the cloud live? (curl, 2026-10-10 10:51 UTC)

```
curl -sI 'https://res.cloudinary.com/dpmnlysdt/image/upload/f_auto,q_auto,w_1600/keu/makkah/kaaba'
HTTP/1.1 200 OK
Content-Type: image/jpeg
Content-Length: 340725
Cache-Control: private, no-transform, max-age=2592000
Vary: Accept,User-Agent,Save-Data
server-timing: ... desc=miss ... content-info;desc="width=1600,height=1200,bytes=340725,format="jpg",owidth=1200,oheight=900,obytes=364718,oformat="jpg" ...
```

- **The cloud is live (200).** It is served through Cloudflare (`Server: cloudflare`, `CF-Ray ...-SIN`, i.e. the Singapore edge for this request).
- **New finding: the stored `keu/makkah/kaaba` original is only 1200x900** (`owidth=1200,oheight=900`). Cloudinary **upscales** it to 1600x1200 when `w_1600` is requested. The poster plan in codebase.md section 214 (`keu/makkah/kaaba` at 1600 w) and in motion.md (`w_1920`) would therefore serve a blurry upscale. Either take the poster from the video's first frame (exported locally as a 1920 px still) or cap the request at `w_1200`.
- Without an `Accept` header the response was 340,725 B (333 KB) of JPEG. A browser that sends `image/avif,image/webp` will get a smaller AVIF or WebP. I did not measure that size, so it is UNVERIFIED. The brief's 150 KB poster assumption only holds for AVIF/WebP at about 1200 to 1600 px.
- Cloudinary sets `Cache-Control: private, max-age=2592000` (30 days) on images, so repeat visitors are served from the browser cache.
- Video delivery: `curl -sI https://res.cloudinary.com/dpmnlysdt/video/upload/sample.mp4` returned **404**. That only shows there is no asset named `sample`. It does not show video delivery is off. **No video exists in this cloud today.** Whether video delivery is enabled is UNVERIFIED until a video is uploaded (codebase.md also notes the admin uploader handles images only).

---

## 3. Monthly bandwidth and cost model

**Assumptions (from the task):** desktop loop 3.7 MB (footage.md: 3,706,931 B, 14.0 s 1080p), mobile loop 1.8 MB (720p), poster 150 KB on every view; 60% mobile and 40% desktop; **70% of home views download the bytes** (the other 30% are served from the browser cache). 1 GB = 1000 MB. With GiB the numbers are about 7% lower.

Per home view: mobile = 1.8 + 0.15 = 1.95 MB, desktop = 3.7 + 0.15 = 3.85 MB.
Weighted = 0.6 x 1.95 + 0.4 x 3.85 = **2.71 MB**. After the 70% miss rate: **1.897 MB per view** (1.792 MB video + 0.105 MB poster).

| Home views / month | Video GB | Poster GB | **Total GB** | Cloudinary credits (1 GB = 1 credit, Free) | Fits Cloudinary Free (25)? | Vercel Hobby (100 GB FDT) | Vercel Pro (1 TB incl.) | Bunny Standard, Asia $0.03/GB | Cloudflare Stream |
|---|---|---|---|---|---|---|---|---|---|
| 5,000 | 8.96 | 0.53 | **9.49** | **≈ 9.5** (+< 1 one-off tx) | Yes (38% of the allowance, before images) | 9.5% of 100 GB | ~1%, $0 extra | $0.28, so **$1.00** (monthly minimum) | 933 min, **$0.93 + $5** storage block = $5.93 |
| 20,000 | 35.84 | 2.10 | **37.94** | **≈ 37.9** | **No.** 152% of the allowance, so Plus at $89–99/mo | 38% | ~4%, $0 extra | **$1.14** | 3,733 min, $3.73 + $5 = **$8.73** |
| 50,000 | 89.60 | 5.25 | **94.85** | **≈ 94.9** | **No.** Plus at $89–99/mo (225 credits, video at 2 GB/credit on paid) | **95%, with nothing left for the rest of the site** | ~9.5%, $0 extra | **$2.85** | 9,333 min, $9.33 + $5 = **$14.33** |

- **Cloudinary Free runs out at 25 / 1.897 MB ≈ 13,200 home views a month** from the hero alone. Any image traffic lowers that number.
- On Cloudinary paid plans video bandwidth is "2 GB" per credit, so Plus covers about 225 x 2 / 1.79 MB ≈ 250k views of video. That is plenty, but **$1,068–1,188 a year** is far more than any alternative.
- Bunny region: I assumed Pakistani visitors are billed at the **Asia & Oceania $0.03/GB** rate. Bunny's docs do not map Pakistan to a zone (UNVERIFIED). At the **Middle East & Africa $0.06/GB** rate the 50k row costs $5.69. Storage is $0.01/GB/month (HDD, 1 region) for about 6 MB, so effectively $0 (the $1 monthly minimum applies to the account).
- Cloudflare Stream: "$1 per 1,000 minutes delivered". Delivery is counted per HLS segment, "rounded up to the segment length (four seconds)", so one 14 s pass = 16 s ≈ 0.267 min. Storage is "$5 per month for each 1,000 minutes" (bought in blocks, so the minimum is $5). "Content played from the browser cache is not billable … a short looping video". Encoding is free. Stream delivers **HLS/DASH**, so Chrome and Firefox need **hls.js** (about 60 KB+ gz, UNVERIFIED size) or the Stream player iframe. That adds weight and complexity a 14 s muted loop does not need.
- Vercel Hobby, if the limit is exceeded: "In most cases, if you exceed your usage limits on the Hobby plan, you will have to wait until 30 days have passed before you can use the feature again." At 50k views the site would be one traffic spike away from that.

---

## 4. Vercel terms (fetched 2026-10-10)

**Terms of Service, section 4 (https://vercel.com/legal/terms):**
> "You shall only use the Services under a Hobby plan for your personal or non-commercial use."

**Fair Use Guidelines, Commercial usage (https://vercel.com/docs/limits/fair-use-guidelines, last_updated 2026-09-14):**
> "**Hobby teams** are restricted to non-commercial personal use only. All commercial usage of the platform requires either a Pro or Enterprise plan."
> "Commercial usage is defined as any Deployment that is used for the purpose of financial gain of **anyone** involved in **any part of the production** of the project, including a paid employee or consultant writing the code. Examples … include … Any method of requesting or processing payment from visitors of the site · **Advertising the sale of a product or service** · Receiving payment to create, update, or host the site · Affiliate linking … · The inclusion of advertisements".
> "Asking for Donations **does not** fall under commercial usage."
> "Circumventing or otherwise misusing Vercel's limits or usage guidelines is a violation of our fair use guidelines."

**Hobby included usage (https://vercel.com/docs/plans/hobby):** Fast Data Transfer "First 100 GB", Fast Origin Transfer "First 10 GB", CDN Requests "First 1,000,000", Function Invocations "First 1,000,000", Image Transformations "First 5,000".

**Pro (https://vercel.com/pricing):** "$20/mo", "$20 included credit", Fast Data Transfer "1TB / month included; then starting at $0.15 per GB". Extra developer seats cost $20/user/mo, and Viewer seats are free.

**What this means here:** KEUI's site advertises paid Umrah and Hajj packages and uses WhatsApp as its sales path, which is plainly "advertising the sale of a product or service". **Self-hosting MP4s on Vercel is fine on Pro.** On Hobby the problem is the whole site, not only the video. The plan is UNVERIFIED (section 6).

---

## 5. Current `vercel.json` (keu-website/vercel.json, read-only)

```json
"headers": [
  { "source": "/assets/(.*)",   "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
  { "source": "/patterns/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
]
```
The live HTML response is `Cache-Control: public, max-age=0, must-revalidate`, `Accept-Ranges: bytes`, `X-Vercel-Cache: HIT`, edge `bom1` (Mumbai). Vercel serves byte ranges, which Safari requires for `<video>`.

### Cache-header change needed
- **Option A (recommended): import the MP4 through Vite.** Vite 5.4.21 is installed in the repo, and its `node_modules/vite/dist/node/constants.js` line 71 lists `"mp4"` among the known asset types (webm is in the same list). `import hero1080 from '../assets/video/hero-1080.mp4'` emits `/assets/hero-1080-<hash>.mp4`. **The existing `/assets/(.*)` immutable rule already covers it, so vercel.json needs no change.** The hash in the file name busts the cache whenever the clip is re-encoded.
- **Option B: files in `public/video/`.** Add this rule and **put a version in the file name** (`hero-1080.v2.mp4`), because `immutable` stops browsers from ever revalidating:
  ```json
  { "source": "/video/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ```
  Without the rule, Vercel's default for static files is `public, max-age=0, must-revalidate` (seen on the HTML here; for non-HTML static files the default is UNVERIFIED), so browsers would revalidate on every visit.
- The SPA rewrite `/((?!api/).*)` → `/index.html` does not interfere: Vercel serves files that exist in the filesystem before applying rewrites (standard Vercel behaviour, not re-checked today).
- Repo weight: about 5.5 MB of MP4 plus a WebM is acceptable in git. codebase.md's "do not commit MP4s" warning was about the missing cache rule and bloat from 40 MB+ originals. **Commit only the final encodes and never the 4K sources.** Add `*.mov` and `/footage-src/` to `.gitignore` when implementing.

---

## 6. Recommendation

**Host: Vercel (Pro), with the pre-encoded MP4s imported as Vite-hashed assets. Keep images and the poster on Cloudinary.**

| | Vercel Pro + Vite assets (**pick**) | Cloudinary (pre-encoded, no transform) | Bunny CDN (Storage + Pull Zone) | Cloudflare Stream |
|---|---|---|---|---|
| Cost at 5k / 20k / 50k views | $0 extra over the $20 plan needed anyway | Free / **$89–99** / **$89–99** | $1.00 / $1.14 / $2.85 | $5.93 / $8.73 / $14.33 |
| Commercial use allowed | Yes (Pro) | Yes | Yes | Yes |
| Cache header work | None (existing `/assets/` rule) | None (Cloudinary sets 30 days) | Set an Edge Rule to `max-age=31536000` | Managed |
| Extra JS | None | None | None | hls.js or iframe player |
| New vendor / account | No | No | Yes | Yes |
| Byte control (our measured 3.71 MB) | Exact | Exact only without `q_auto`/`f_auto` | Exact | Re-encoded ABR ladder |

Why:
1. The owner needs Pro anyway, because a site that sells packages cannot stay on Hobby under section 4. The video then costs $0 extra up to about 500k views a month (1 TB / 1.897 MB ≈ 527k).
2. No new vendor, no new env vars, no admin/api change (the CMS stays untouched), and no Cloudinary video uploader to build.
3. Cloudinary's 25 credits stay for images, which is what the existing `Img.jsx` / `images.js` pipeline uses.
4. Byte sizes stay exactly as footage.md measured them.

**Fallback if the owner stays on Hobby or refuses $20/mo:** Bunny Storage (1 region, $0.01/GB) plus a Standard Pull Zone. Expect **about $1–3 a month** at 5k–50k views ($1 monthly minimum). Set an Edge Rule `Cache-Control: public, max-age=31536000, immutable` and version the file names. Do not count on Cloudinary Free above about 13k home views a month.

**Implementation notes for the build phase** (these add to codebase.md section 214):
- `<video autoplay muted loop playsinline preload="metadata" poster=...>` with `<source media="(max-width: 767px)" ...720p.mp4>` and the 1080p source. Note that `media` on `<source>` inside `<video>` is honoured by Chromium again since 2023 and by Safari and Firefox, but **set `src` in JS from `matchMedia` as a safety net** (UNVERIFIED cross-browser today). Use poster-only when `prefers-reduced-motion` or `navigator.connection.saveData` is set. This also lowers the cache-miss bytes in the model above.
- Pause off-screen with IntersectionObserver. This does not cut bandwidth after load but saves decode CPU.
- Poster: export the first frame locally and upload it to Cloudinary as `keu/hero/poster` at **1920 px or more**, then request `f_auto,q_auto,w_1600`. Do not upscale the 1200 px `keu/makkah/kaaba`.
- Add a Vercel Pro **spend management** cap (Pro has "Spend Management: Configurable") as protection against hotlinking.

---

## 7. UNVERIFIED / could not check

- **Which Vercel plan `keusmania.vercel.app` uses.** The response headers do not say, and the repo has no `.vercel/` directory. The owner must check Dashboard → Settings → Billing.
- Current Cloudinary credit use for `dpmnlysdt` (needs console access) and whether video delivery is enabled (no video asset exists yet; `video/upload/sample.mp4` → 404).
- Whether a `so_0` video-to-image poster costs more than a standard transformation.
- The actual AVIF/WebP byte size of the poster in a browser (curl without `Accept` gave 333 KB of JPEG).
- Which Bunny pricing zone covers Pakistan (assumed Asia & Oceania $0.03/GB) and whether there is a Pakistan PoP.
- Vercel's default `Cache-Control` for non-HTML files in `public/` that no header rule covers.
- The 70% cache-miss rate and the 60/40 device split are task assumptions, not analytics. The repo has no analytics data.
- hls.js bundle size (only relevant to the Cloudflare Stream option).

## Sources
- https://cloudinary.com/pricing · https://cloudinary.com/pricing/compare-plans · https://cloudinary.com/documentation/billing_and_plans · https://cloudinary.com/documentation/developer_onboarding_faq_credits · https://cloudinary.com/documentation/transformation_counts · https://cloudinary.com/documentation/ts_troubleshooting_video_transformation_errors · https://support.cloudinary.com/hc/en-us/community/posts/360009789299-Not-able-to-upload-more-than-100MB-video-in-cloudinary
- https://vercel.com/legal/terms · https://vercel.com/docs/limits/fair-use-guidelines · https://vercel.com/docs/plans/hobby · https://vercel.com/pricing
- https://bunny.net/pricing/ · https://bunny.net/pricing/storage/ · https://bunny.net/pricing/stream/ · https://developers.cloudflare.com/stream/pricing/
- Local: keu-website/vercel.json; keu-website/node_modules/vite/dist/node/constants.js:71; research/footage.md section 4; research/codebase.md sections 1.3, 214, 226, R12
