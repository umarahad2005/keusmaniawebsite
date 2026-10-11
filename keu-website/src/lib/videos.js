/* Cloudinary video URL builder for admin-uploaded video reviews.

   Uploads sign an eager, asynchronous transformation (api/upload-signature.js),
   so Cloudinary prepares these two derived files in the background. Using the
   exact same transformation strings here means visitors are served those
   prepared files instead of triggering on-the-fly processing. Until the
   background job finishes (a minute or two after upload), fall back to the
   original upload URL. */

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() || 'dpmnlysdt'
const BASE = `https://res.cloudinary.com/${CLOUD}/video/upload`

/* Keep in sync with VIDEO_EAGER in api/upload-signature.js. */
export const VIDEO_TRANSFORM = 'c_limit,h_720,q_auto'
export const POSTER_TRANSFORM = 'so_2,c_limit,w_960,q_auto'

/** 720p MP4 for playback. */
export function reviewVideoUrl(publicId) {
  return publicId ? `${BASE}/${VIDEO_TRANSFORM}/${publicId}.mp4` : ''
}

/** Poster frame (2 s in) as JPG. */
export function reviewPosterUrl(publicId) {
  return publicId ? `${BASE}/${POSTER_TRANSFORM}/${publicId}.jpg` : ''
}

/** Format a duration in seconds as m:ss. */
export function formatDuration(sec) {
  if (!Number.isFinite(sec) || sec <= 0) return ''
  const s = Math.round(sec)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
