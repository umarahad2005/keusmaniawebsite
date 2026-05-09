/* GET /api/upload-signature — admin only.
   Returns a Cloudinary signed payload the client uses for direct uploads. */
import { v2 as cloudinary } from 'cloudinary'
import { requireAdmin } from './_lib/auth.js'
import { methodNotAllowed } from './_lib/http.js'

export default function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  if (!requireAdmin(req, res)) return

  const cloud = process.env.CLOUDINARY_CLOUD_NAME
  const key   = process.env.CLOUDINARY_API_KEY
  const secret= process.env.CLOUDINARY_API_SECRET
  if (!cloud || !key || !secret) {
    return res.status(500).json({ error: 'Cloudinary env vars not set' })
  }

  cloudinary.config({ cloud_name: cloud, api_key: key, api_secret: secret })

  const folder = (req.query.folder || 'keu').toString()
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, secret)

  res.status(200).json({
    cloud_name: cloud,
    api_key: key,
    timestamp,
    signature,
    folder,
  })
}
