/* The /updates feed (src/pages/Updates.jsx, admin → Social feed).

   GET  /api/social                    public: visible posts whose publishAt has
                                       passed, pinned first, then newest first.
                                       ?limit= (1–48, default 24) and ?before=<next>
                                       for the next page → { posts, next }; next
                                       is "<ISO publishAt>_<id>" of the last post
   GET  /api/social?action=admin       admin: connection status and every post
   GET  /api/social?action=sync        the daily Vercel cron (vercel.json), sent
                                       with Authorization: Bearer <CRON_SECRET>;
                                       an admin session works too
   POST /api/social?action=sync        admin: "Sync now"
   POST /api/social?action=token       admin, body { token }: save a pasted
                                       Instagram long-lived token
   POST /api/social?action=disconnect  admin: forget the token (posts stay)
   POST /api/social                    admin, body { images: [{ src, alt }], text,
                                       publishAt?, permalink? }: add a post by hand

   One file for all of these keeps the project inside the Vercel Hobby limit of
   12 functions; PATCH and DELETE of one post are in api/social/[id].js.

   Sync: reads the newest Instagram media until it meets a post it already has,
   mirrors every image to Cloudinary (keu/social/ig-<id>[-n], never
   overwritten), strips the contact footer and hashtags from the caption, and
   stores the posts oldest first. A run stops taking new posts after
   TIME_BUDGET_MS or MAX_IMAGES_PER_RUN uploads, so it ends well inside the
   function's 60 s and still records its status (the next run picks up the
   rest). The token is refreshed once it is a week old and saved at once. The
   site is rebuilt only when posts were stored since the last recorded run
   (including any a cut-off run stored), a scheduled post became due, or an
   edit asked for a rebuild later (api/social/[id].js). Without a token the
   sync still checks scheduled posts, and the feed shows the manual posts.

   The token is never returned by this or any other endpoint. */
import { timingSafeEqual } from 'node:crypto'
import mongoose from 'mongoose'
import { connectDB, SocialPost, Integration } from '../_lib/db.js'
import { requireAdmin, readToken, verifyToken } from '../_lib/auth.js'
import { readJSON, methodNotAllowed, withErrors, isPrivateRead, triggerRebuild, PUBLIC_CACHE, NO_STORE } from '../_lib/http.js'
import {
  InstagramError, REFRESH_AFTER_MS, PINNED_MAX, igAccount, igRefresh, igRecentMedia, igImageSources,
  mirrorMedia, cleanCaption, estimatedExpiry, publicPost,
} from '../_lib/social.js'

const TIME_BUDGET_MS = 40 * 1000
const MAX_IMAGES_PER_RUN = 40

function isCron(req) {
  const secret = process.env.CRON_SECRET?.trim()
  const got = Buffer.from(String(req.headers.authorization || ''))
  const want = Buffer.from(`Bearer ${secret}`)
  return !!secret && got.length === want.length && timingSafeEqual(got, want)
}

const isAdmin = (req) => verifyToken(readToken(req))?.role === 'admin'

const actionOf = (req) => String(req.query?.action || '')

async function instagramRow() {
  return (await Integration.findOne({ provider: 'instagram' }).select('+token'))
    || new Integration({ provider: 'instagram' })
}

/* What the admin sees about the connection. Built field by field so the token
   can never ride along. */
function statusOf(row) {
  return {
    connected: !!row?.token,
    username: row?.account?.username || '',
    tokenSetAt: row?.tokenSetAt || null,
    expiresAt: row?.expiresAt || null,
    lastSyncAt: row?.lastSyncAt || null,
    lastSyncAdded: row?.lastSyncAdded || 0,
    lastError: row?.lastError || '',
    lastErrorAt: row?.lastErrorAt || null,
    cronSecretSet: !!process.env.CRON_SECRET?.trim(),
    deployHookSet: !!process.env.VERCEL_DEPLOY_HOOK_URL,
  }
}

/* ---------- Public feed ---------- */

/* "<ISO>_<id>" → { at, id }; a bare ISO date (older pages) → { at }. */
function parseCursor(raw) {
  const [iso, id] = String(raw).split('_')
  const at = new Date(iso)
  if (Number.isNaN(at.getTime()) || (id && !mongoose.isValidObjectId(id))) return null
  return { at, id: id ? new mongoose.Types.ObjectId(id) : null }
}

async function publicFeed(req, res) {
  res.setHeader('Cache-Control', NO_STORE)
  const limit = Math.min(48, Math.max(1, parseInt(req.query?.limit, 10) || 24))
  const before = req.query?.before ? parseCursor(req.query.before) : null
  if (req.query?.before && !before) return res.status(400).json({ error: 'Invalid before' })

  await connectDB()
  const now = new Date()
  const visible = { hidden: false, removed: false }
  const pinned = before ? [] : await SocialPost
    .find({ ...visible, pinned: true, publishAt: { $lte: now } })
    .sort({ publishAt: -1 }).limit(PINNED_MAX).lean()
  // Same order as the sort, so posts sharing the last publishAt are not skipped.
  const older = !before ? []
    : before.id ? [{ $or: [{ publishAt: { $lt: before.at } }, { publishAt: before.at, _id: { $lt: before.id } }] }]
    : [{ publishAt: { $lt: before.at } }]
  const rest = await SocialPost
    .find({ ...visible, pinned: { $ne: true }, $and: [{ publishAt: { $lte: now } }, ...older] })
    .sort({ publishAt: -1, _id: -1 }).limit(limit + 1).lean()

  const page = rest.slice(0, limit)
  const last = page[page.length - 1]
  const next = rest.length > limit ? `${new Date(last.publishAt).toISOString()}_${last._id}` : null
  if (!isPrivateRead(req)) {
    res.setHeader('Cache-Control', PUBLIC_CACHE)
    res.removeHeader('Set-Cookie')
  }
  return res.status(200).json({ posts: [...pinned, ...page].map(publicPost), next })
}

/* ---------- Sync ---------- */

async function sync() {
  const started = Date.now()
  await connectDB()
  const row = await instagramRow()
  const now = new Date()
  const since = row.lastSyncAt
  let added = 0, remaining = 0

  if (row.token) {
    try {
      if (!row.tokenSetAt || now - row.tokenSetAt > REFRESH_AFTER_MS) {
        const r = await igRefresh(row.token)
        row.token = r.token
        row.tokenSetAt = now
        row.expiresAt = r.expiresAt
        // The old token may stop working: never lose the new one to a cut-off run.
        await row.save()
      }
      const fresh = await igRecentMedia(row.token, async (id) => !!(await SocialPost.exists({ igId: id })))
      // Newest first from Instagram; store the oldest first so "stop at the
      // first known post" still finds the rest on the next run.
      const batch = fresh.slice().reverse()
      let uploads = 0, stored = 0
      for (const m of batch) {
        // Always at least one post per run, so one large carousel cannot stall the feed.
        const n = igImageSources(m).length
        if (stored && (Date.now() - started > TIME_BUDGET_MS || uploads + n > MAX_IMAGES_PER_RUN)) break
        uploads += n
        stored++
        const images = await mirrorMedia(m)
        const at = new Date(m.timestamp)
        const r = await SocialPost.updateOne(
          { igId: String(m.id) },
          { $setOnInsert: {
            source: 'instagram',
            igId: String(m.id),
            mediaType: m.media_type || 'IMAGE',
            images,
            caption: m.caption || '',
            text: cleanCaption(m.caption || ''),
            permalink: m.permalink || '',
            postedAt: at,
            publishAt: at,
          } },
          { upsert: true },
        )
        if (r.upsertedCount) added++
      }
      remaining = batch.length - stored
      row.lastError = ''
      row.lastErrorAt = undefined
    } catch (err) {
      // Keep the posts stored so far; the next run carries on from them.
      row.lastError = err instanceof InstagramError ? err.message : `Sync stopped: ${err?.message || err}`
      row.lastErrorAt = now
      console.error('[social] sync —', row.lastError)
    }
  }

  // Posts stored since the last recorded run: this run's, plus any that a run
  // cut off before it could record itself stored.
  if (since) added = Math.max(added, await SocialPost.countDocuments({ source: 'instagram', createdAt: { $gt: since } }))
  // Imported posts scheduled for a day that has now arrived.
  const due = since
    ? await SocialPost.countDocuments({ hidden: false, removed: false, publishAt: { $gt: since, $lte: now } })
    : 0
  const pending = !!row.rebuildPending

  row.lastSyncAt = now
  row.lastSyncAdded = added
  row.rebuildPending = undefined
  await row.save()
  if (added || due || pending) await triggerRebuild('social feed changed')
  return { ok: !row.lastError, added, remaining, due, status: statusOf(row) }
}

/* ---------- Admin ---------- */

async function adminView(res) {
  await connectDB()
  const row = await Integration.findOne({ provider: 'instagram' }).select('+token').lean()
  const posts = await SocialPost.find({ removed: false }).sort({ pinned: -1, publishAt: -1 }).limit(300).lean()
  return res.status(200).json({ status: statusOf(row), posts })
}

async function saveToken(req, res) {
  const { token } = await readJSON(req)
  const t = String(token || '').trim()
  if (!/^[A-Za-z0-9_.|-]{20,}$/.test(t)) return res.status(400).json({ error: 'That does not look like an access token. Copy the whole token from the Meta app dashboard.' })

  await connectDB()
  let account
  try { account = await igAccount(t) } catch (err) {
    return res.status(400).json({ error: err instanceof InstagramError ? err.message : 'Instagram could not check the token' })
  }
  // A refresh tells us the real expiry; a token made in the last 24 h cannot be
  // refreshed yet, so it is dated 60 days from now instead.
  let saved = { token: t, expiresAt: estimatedExpiry() }
  try { saved = await igRefresh(t) } catch { /* too new to refresh: keep the estimate */ }

  const row = await instagramRow()
  row.token = saved.token
  row.tokenSetAt = new Date()
  row.expiresAt = saved.expiresAt
  row.account = account
  row.lastError = ''
  row.lastErrorAt = undefined
  await row.save()
  return res.status(200).json({ ok: true, status: statusOf(row) })
}

async function disconnect(res) {
  await connectDB()
  const row = await instagramRow()
  row.token = undefined
  row.tokenSetAt = undefined
  row.expiresAt = undefined
  row.account = undefined
  await row.save()
  return res.status(200).json({ ok: true, status: statusOf(row) })
}

/* Images come from CloudinaryUpload (secure_url) or are public_ids under keu/. */
const isOurImage = (src) => typeof src === 'string' && (/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(src) || /^keu\/[\w/-]+$/.test(src))

async function addPost(req, res) {
  const body = await readJSON(req)
  const images = (Array.isArray(body.images) ? body.images : [])
    .filter(i => i && isOurImage(i.src)).slice(0, 10)
    .map(i => ({ src: i.src, alt: String(i.alt || '').trim().slice(0, 500), width: Number(i.width) || undefined, height: Number(i.height) || undefined }))
  if (!images.length) return res.status(400).json({ error: 'Upload at least one image' })
  const publishAt = body.publishAt ? new Date(body.publishAt) : new Date()
  if (Number.isNaN(publishAt.getTime())) return res.status(400).json({ error: 'Invalid publish date' })
  const permalink = String(body.permalink || '').trim()
  if (permalink && !/^https:\/\//.test(permalink)) return res.status(400).json({ error: 'The post link must start with https://' })

  const caption = String(body.text || '').slice(0, 5000)
  await connectDB()
  const doc = await SocialPost.create({
    source: 'manual',
    mediaType: images.length > 1 ? 'CAROUSEL_ALBUM' : 'IMAGE',
    images,
    caption,
    text: cleanCaption(caption),
    permalink,
    postedAt: publishAt,
    publishAt,
  })
  await triggerRebuild('social post added')
  return res.status(201).json({ ok: true, post: doc.toObject() })
}

async function handler(req, res) {
  const action = actionOf(req)

  if (req.method === 'GET' && (action === 'sync' || (!action && isCron(req)))) {
    res.setHeader('Cache-Control', NO_STORE)
    if (!isCron(req) && !isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
    return res.status(200).json(await sync())
  }
  if (req.method === 'GET' && !action) return publicFeed(req, res)

  res.setHeader('Cache-Control', NO_STORE)
  if (req.method === 'GET' && action === 'admin') {
    if (!requireAdmin(req, res)) return
    return adminView(res)
  }
  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return
    if (action === 'sync')       return res.status(200).json(await sync())
    if (action === 'token')      return saveToken(req, res)
    if (action === 'disconnect') return disconnect(res)
    if (!action || action === 'add') return addPost(req, res)
    return res.status(400).json({ error: 'Unknown action' })
  }
  if (req.method === 'GET') return res.status(400).json({ error: 'Unknown action' })
  return methodNotAllowed(res, ['GET', 'POST'])
}

export default withErrors(handler)
