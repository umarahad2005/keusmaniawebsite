# Social feed (/updates): owner steps

The website page **/updates** shows Karwan e Usmania International's posts:

- **Instagram posts**, copied in once a day by the website (and whenever you press **Sync now**). Each image is copied to the site's own Cloudinary storage (`keu/social/ig-<id>`), so it keeps working even if the post is later removed from Instagram. The contact lines (WhatsApp numbers, links, the office address, hours) and the hashtags are left out of the text on the website.
- **Posts you add by hand** in Admin → Social feed → **+ Add post**.
- **The designed posts from the `social/` folder**, imported once with a script (step 4). Each appears on the site at its scheduled time.

If Instagram is not connected, or the connection breaks, the page still works: it shows the posts already copied plus the ones added by hand.

Everything below happens in your own accounts. The website never posts to Instagram or Facebook; it only reads.

---

## 1. Set two values in Vercel

Vercel → the project → **Settings → Environment Variables** (Production):

| Name | Value | Why |
|---|---|---|
| `CRON_SECRET` | a long random string (for example 40 letters and numbers from a password manager) | Vercel's daily job uses it to ask the site to sync. Without it the daily sync is off; **Sync now** still works. |
| `VERCEL_DEPLOY_HOOK_URL` | the Deploy Hook URL (Settings → Git → Deploy Hooks → create one for `main`) | After new posts arrive, the site rebuilds so Google and AI assistants see them in the page. It is probably set already (admin saves use it too). |

Then redeploy once (Deployments → the latest → Redeploy) so the new values and the daily job take effect. The daily job runs at about **8 pm Pakistan time** (`vercel.json` → `crons`, 15:00 UTC). On the Hobby plan Vercel may run it any time within that hour.

## 2. Make a Meta app (one time)

The site uses the **Instagram API with Instagram Login** and only the **`instagram_business_basic`** permission (read your profile and your posts).

1. The Instagram account **keusmania_international** must be a **Professional account** (Business or Creator). In the Instagram app: Settings → Account type and tools → Switch to professional account.
2. Go to **developers.facebook.com** → sign in → **My Apps → Create app**.
3. Choose the use case **"Manage messaging & content on Instagram"** (in some versions of the dashboard: app type **Business**, then add the **Instagram** product). Name the app, for example "KEUI website".
4. In the app: **Instagram → API setup with Instagram login**.
5. If the dashboard asks for it, add the Instagram account under **App roles → Roles → Instagram testers**, then accept the invitation in Instagram (Settings → Website permissions → Apps and websites → Tester invites). An app that stays in Development mode can read the accounts that have a role on it, which is all the website needs; you do not have to submit the app for review.

## 3. Get a token and paste it in the admin

1. In the app: **Instagram → API setup with Instagram login → Generate access tokens → Add account**, and sign in as **keusmania_international**.
2. Press **Generate token** next to the account, allow the permissions, and copy the whole token (it usually starts with `IGAA`).
3. On the website: **/admin → Social feed**, paste it into **Paste the access token** and press **Save token**. The site checks it with Instagram and shows **Connected · @keusmania_international**.
4. Press **Sync now**. The first sync copies posts oldest first, as many as fit in about 40 seconds (at most 40 images per run). If it says "more waiting", press **Sync now** again until it says 0 waiting (the daily job also carries on by itself).

The token lasts **60 days**. The daily sync renews it once it is a week old, so as long as the daily job runs it never runs out. The admin page shows when it runs out and any error. If it ever says the token was rejected (for example after you change the Instagram password or remove the app), repeat step 3.

The token is stored in the database and is never sent to visitors or shown again in the admin. **Disconnect** forgets it; the posts already copied stay.

## 4. Import the designed posts (one time, on your computer)

The approved batches in the `social/` folder can be put on the site with their scheduled dates, so each one shows on /updates from its scheduled time:

- `social/2026-10-21-launch`: 5 posts (introduction, Jumu'ah, our story, and the two carousels), from **Thu 22 Oct, 8 pm**.
- `social/2026-10-28-urdu-30-days`: 30 posts (`export/day-NN.png`), **Fri 23 Oct to Sat 21 Nov**, at the times in its `schedule.md`.

Captions come from `captions.md` / each carousel's `caption.md` (launch) and `_build/captions.json` (30 days), with the contact lines and hashtags removed as for Instagram. Alt text comes from the captions files (launch) or from the theme and photo in `_build/plan.json` (30 days).

In a terminal, in the `keu-website` folder (the `.env` file must have `MONGODB_URI` and the three `CLOUDINARY_*` values):

```
node scripts/import-social-exports.mjs            # dry run: lists the 35 posts and their dates; changes nothing
node scripts/import-social-exports.mjs --apply    # uploads the PNGs to Cloudinary (keu/social) and adds the posts
```

Options: `--only=launch` or `--only=urdu30` imports one batch. Running it again is safe: posts already imported are skipped, and images already in Cloudinary are not overwritten.

After the import, check **/admin → Social feed**: the posts show a "From <date>" badge until their time comes. Each day's posts appear on /updates at their scheduled time; the daily job then rebuilds the page so search engines see them too.

**Duplicates:** these posts are also published on Instagram by Meta Business Suite. Once Instagram is connected, the sync copies them in again as Instagram posts (the website cannot tell they are the same). Keep one of each pair: in Admin → Social feed press **Hide** (or **Delete**) on either copy. The Instagram copy links to the post on Instagram; the imported one has better alt text. To avoid the duplicates entirely, skip step 4 and rely on the sync.

## 5. Day to day

- **Hide** takes a post off the site, **Show** puts it back. **Pin** keeps a post at the top (up to 6; unpin one to pin another). **Save alt text** stores the description read out to blind visitors, one per image. **Delete** removes it from the website only (it stays on Instagram, and a deleted Instagram post is not copied back).
- Each change rebuilds the site in a minute or two. Alt text alone waits for the next daily sync, so tidying several posts starts one build, not one per post.
- The page link is in the site menu, the mobile menu and the footer ("Updates").

## For the developer

- API: `api/social/index.js` (public `GET`, `?action=admin|sync|token|disconnect`, `POST` to add) and `api/social/[id].js` (`PATCH`, `DELETE`). 10 of the 12 Hobby-plan functions are now used.
- Models: `SocialPost` and `Integration` in `api/_lib/db.js`; Instagram, Cloudinary and caption helpers in `api/_lib/social.js`.
- Page: `src/pages/Updates.jsx` with `src/lib/social.js`. The build pre-renders /updates with the posts from `GET /api/social` and inlines them as `window.__KEU_SOCIAL__` on that page only.
- Admin: `src/pages/admin/EditSocial.jsx`.
- Cron: `vercel.json` → `crons` calls `GET /api/social?action=sync`, authorised by `Authorization: Bearer $CRON_SECRET` (an admin session also works).
