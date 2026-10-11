/* GET /api/upload-signature — admin only.
   Returns a Cloudinary signed payload the client uses for direct uploads.

   ?folder=keu/...      target folder (default 'keu')
   ?resource=video      also signs an eager, asynchronous transformation so
                        Cloudinary prepares a 720p MP4 and a poster frame in the
                        background (video reviews). Must match src/lib/videos.js.
   ?resource=audio      background sound track: Cloudinary keeps audio under the
                        'video' resource type; no transformation is signed. */
import { v2 as cloudinary } from 'cloudinary'
import { requireAdmin } from './_lib/auth.js'
import { methodNotAllowed, withErrors } from './_lib/http.js'

/* Keep in sync with VIDEO_TRANSFORM and POSTER_TRANSFORM in src/lib/videos.js. */
const VIDEO_EAGER = 'c_limit,h_720,q_auto/mp4|so_2,c_limit,w_960,q_auto/jpg'

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
  const isVideo = req.query.resource === 'video'
  const isAudio = req.query.resource === 'audio'
  const timestamp = Math.floor(Date.now() / 1000)

  // Every parameter sent with the upload (except file, api_key and resource type) must be signed.
  const params = isVideo
    ? { timestamp, folder, eager: VIDEO_EAGER, eager_async: 'true' }
    : { timestamp, folder }
  const signature = cloudinary.utils.api_sign_request(params, secret)

  res.status(200).json({
    cloud_name: cloud,
    api_key: key,
    signature,
    resource_type: isVideo || isAudio ? 'video' : 'image',
    ...params,
  })
}

export default withErrors(handler)
