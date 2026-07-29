/* GET /api/upload-signature — admin only.
   Returns a Cloudinary signed payload the client uses for direct uploads. */
import { v2 as cloudinary } from 'cloudinary'
import { requireAdmin } from './_lib/auth.js'
import { methodNotAllowed, withErrors } from './_lib/http.js'

function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  if (!requireAdmin(req, res)) return

  /* trim(): dashboard-pasted values often carry a stray space or newline, which
     would otherwise land in the upload URL and make Cloudinary reject the request. */
  const cloud = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const key   = process.env.CLOUDINARY_API_KEY?.trim()
  const secret= process.env.CLOUDINARY_API_SECRET?.trim()
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

export default withErrors(handler)
