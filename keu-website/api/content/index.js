/* GET /api/content       → returns ALL content keyed by type
   PUT /api/content       → admin-only, body: { type, data } */
import { connectDB, Content } from '../_lib/db.js'
import { requireAdmin } from '../_lib/auth.js'
import { readJSON, methodNotAllowed, withErrors } from '../_lib/http.js'

async function handler(req, res) {
  if (req.method === 'GET') {
    await connectDB()
    const docs = await Content.find({}).lean()
    const map = {}
    docs.forEach(d => { map[d.type] = d.data })
    return res.status(200).json(map)
  }

  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return
    const { type, data } = await readJSON(req)
    if (!type || data === undefined) return res.status(400).json({ error: 'type + data required' })
    await connectDB()
    const doc = await Content.findOneAndUpdate(
      { type },
      { type, data },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean()
    return res.status(200).json({ ok: true, content: doc })
  }

  return methodNotAllowed(res, ['GET', 'PUT'])
}

export default withErrors(handler)
