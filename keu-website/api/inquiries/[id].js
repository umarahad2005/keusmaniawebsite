/* PATCH /api/inquiries/:id  body: { status }
   DELETE /api/inquiries/:id */
import { connectDB, Inquiry } from '../_lib/db.js'
import { requireAdmin } from '../_lib/auth.js'
import { readJSON, methodNotAllowed } from '../_lib/http.js'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return
  const { id } = req.query

  if (req.method === 'PATCH') {
    const { status } = await readJSON(req)
    if (!['unread','read','replied','archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    await connectDB()
    const doc = await Inquiry.findByIdAndUpdate(id, { status }, { new: true }).lean()
    if (!doc) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json({ ok: true, inquiry: doc })
  }

  if (req.method === 'DELETE') {
    await connectDB()
    const r = await Inquiry.findByIdAndDelete(id)
    if (!r) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json({ ok: true })
  }

  return methodNotAllowed(res, ['PATCH', 'DELETE'])
}
