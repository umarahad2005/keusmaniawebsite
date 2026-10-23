/* PATCH  /api/social/:id  admin, body any of { hidden, pinned, alts: [..], text, publishAt }
   DELETE /api/social/:id  admin

   alts sets each image's alt text in order. Deleting an Instagram post keeps a
   tombstone (removed, no images or text) so the next sync does not bring it
   back; a manual post is deleted outright. The Cloudinary copies are kept.
   At most PINNED_MAX posts can be pinned (the feed shows no more than that).

   Rebuilds, so the pre-rendered /updates catches up: a change to what a
   visitor sees (hidden, pinned, text, publish date) or a delete asks for one
   at once; an alt-text-only edit marks one as pending and the daily sync
   (api/social) starts it, so tidying alt text does not start a build per
   post; a save that changes nothing starts none. */
import { connectDB, SocialPost, Integration } from '../_lib/db.js'
import { requireAdmin } from '../_lib/auth.js'
import { readJSON, methodNotAllowed, withErrors, triggerRebuild, NO_STORE } from '../_lib/http.js'
import { cleanCaption, PINNED_MAX } from '../_lib/social.js'

const SEEN = ['hidden', 'pinned', 'text', 'publishAt']

async function handler(req, res) {
  res.setHeader('Cache-Control', NO_STORE)
  if (!requireAdmin(req, res)) return
  const { id } = req.query

  if (req.method === 'PATCH') {
    const body = await readJSON(req)
    await connectDB()
    const doc = await SocialPost.findById(id)
    if (!doc || doc.removed) return res.status(404).json({ error: 'Not found' })
    if (typeof body.hidden === 'boolean') doc.hidden = body.hidden
    if (body.pinned === true && !doc.pinned
      && await SocialPost.countDocuments({ pinned: true, removed: false }) >= PINNED_MAX) {
      return res.status(400).json({ error: `Up to ${PINNED_MAX} posts can be pinned. Unpin one first.` })
    }
    if (typeof body.pinned === 'boolean') doc.pinned = body.pinned
    if (Array.isArray(body.alts)) {
      doc.images.forEach((img, i) => { if (typeof body.alts[i] === 'string') img.alt = body.alts[i].trim().slice(0, 500) })
    }
    if (typeof body.text === 'string') doc.text = cleanCaption(body.text.slice(0, 5000))
    if (body.publishAt) {
      const at = new Date(body.publishAt)
      if (Number.isNaN(at.getTime())) return res.status(400).json({ error: 'Invalid publish date' })
      doc.publishAt = at
    }
    const seen = SEEN.some(f => doc.isModified(f))
    const later = !seen && doc.isModified('images')
    await doc.save()
    if (seen) await triggerRebuild('social post changed')
    else if (later) await Integration.updateOne({ provider: 'instagram' }, { $set: { rebuildPending: new Date() } }, { upsert: true })
    return res.status(200).json({ ok: true, post: doc.toObject() })
  }

  if (req.method === 'DELETE') {
    await connectDB()
    const doc = await SocialPost.findById(id)
    if (!doc || doc.removed) return res.status(404).json({ error: 'Not found' })
    if (doc.source === 'instagram') {
      doc.set({ removed: true, hidden: true, pinned: false, images: [], caption: '', text: '' })
      await doc.save()
    } else {
      await doc.deleteOne()
    }
    await triggerRebuild('social post deleted')
    return res.status(200).json({ ok: true })
  }

  return methodNotAllowed(res, ['PATCH', 'DELETE'])
}

export default withErrors(handler)
