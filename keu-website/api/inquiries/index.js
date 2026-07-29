/* GET /api/inquiries?status=unread&limit=50 — admin only
   List inquiries newest first. */
import { connectDB, Inquiry } from '../_lib/db.js'
import { requireAdmin } from '../_lib/auth.js'
import { methodNotAllowed, withErrors } from '../_lib/http.js'

async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  if (!requireAdmin(req, res)) return

  const { status, limit = '100' } = req.query || {}
  const filter = {}
  if (status && ['unread','read','replied','archived'].includes(status)) filter.status = status

  await connectDB()
  const docs = await Inquiry.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(parseInt(limit, 10) || 100, 500))
    .lean()

  const counts = await Inquiry.aggregate([
    { $group: { _id: '$status', n: { $sum: 1 } } },
  ])
  const byStatus = Object.fromEntries(counts.map(c => [c._id, c.n]))

  res.status(200).json({ inquiries: docs, counts: byStatus })
}

export default withErrors(handler)
