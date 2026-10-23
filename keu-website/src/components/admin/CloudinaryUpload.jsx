/* Direct-to-Cloudinary upload widget. Asks the API for a signature,
   then POSTs the file straight to Cloudinary. Returns the secure URL via onUpload.

   resourceType="video" uploads in 20 MB chunks (needed above 100 MB, and kinder
   to slow connections), shows progress, and asks Cloudinary to prepare a 720p
   copy and a poster in the background.
   resourceType="audio" uploads one sound file (MP3/M4A, up to 20 MB) to the
   'video' resource type, where Cloudinary keeps audio.
   crop={{ aspect, output, guides }} opens PhotoCropper on the chosen image and
   uploads the edited JPEG instead; with editSrc it also offers "Adjust photo"
   to re-frame the current image without choosing a file again. */
import { useState } from 'react'
import { api } from '../../lib/api.js'
import { cldUrl } from '../../lib/images.js'
import PhotoCropper from './PhotoCropper.jsx'

const CHUNK = 20 * 1024 * 1024
const MAX_VIDEO_BYTES = 500 * 1024 * 1024
const MAX_AUDIO_BYTES = 20 * 1024 * 1024

function signedForm(sig, file) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('api_key', sig.api_key)
  fd.append('timestamp', sig.timestamp)
  fd.append('signature', sig.signature)
  fd.append('folder', sig.folder)
  if (sig.eager) fd.append('eager', sig.eager)
  if (sig.eager_async) fd.append('eager_async', sig.eager_async)
  return fd
}

async function readJson(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error?.message || `Upload failed (${res.status})`)
  return data
}

async function uploadChunked(sig, file, onProgress) {
  const url = `https://api.cloudinary.com/v1_1/${sig.cloud_name}/video/upload`
  const uploadId = `keu-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  let result = null
  for (let start = 0; start < file.size; start += CHUNK) {
    const end = Math.min(start + CHUNK, file.size)
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Unique-Upload-Id': uploadId,
        'Content-Range': `bytes ${start}-${end - 1}/${file.size}`,
      },
      body: signedForm(sig, file.slice(start, end)),
    })
    result = await readJson(res)
    onProgress(Math.round((end / file.size) * 100))
  }
  return result
}

export default function CloudinaryUpload({ onUpload, folder = 'keu', label, resourceType = 'image', crop = null, editSrc = '' }) {
  const isVideo = resourceType === 'video'
  const isAudio = resourceType === 'audio'
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [cropSrc, setCropSrc] = useState(null)

  const closeCropper = () => {
    if (cropSrc?.startsWith('blob:')) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
  }

  const handle = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    if (crop && !isVideo && !isAudio) {
      setCropSrc(URL.createObjectURL(file))
      e.target.value = ''
      return
    }
    await upload(file)
    e.target.value = ''
  }

  const upload = async (file) => {
    setError(null)
    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      setError('This video is larger than 500 MB. Please export it smaller (for example by sending it to yourself on WhatsApp) and try again.')
      return
    }
    if (isAudio && file.size > MAX_AUDIO_BYTES) {
      setError('This sound file is larger than 20 MB. Please use an MP3 of a few minutes (about 3–5 MB) and try again.')
      return
    }
    setBusy(true)
    setProgress(0)
    try {
      const sig = await api.get(`/api/upload-signature?folder=${encodeURIComponent(folder)}${isVideo ? '&resource=video' : isAudio ? '&resource=audio' : ''}`)
      let data
      if (isVideo) {
        data = await uploadChunked(sig, file, setProgress)
      } else {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud_name}/${sig.resource_type || 'image'}/upload`, {
          method: 'POST', body: signedForm(sig, file),
        })
        data = await readJson(res)
      }
      onUpload?.(data.secure_url, data)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const text = label || (isVideo ? 'Upload video' : isAudio ? 'Upload sound' : 'Upload image')
  return (
    <>
      <span className="cluster" style={{ gap: 'var(--space-2)' }}>
        <label className="cloudinary-upload">
          <input type="file" accept={isVideo ? 'video/*' : isAudio ? 'audio/mpeg,audio/mp4,audio/aac,audio/*' : 'image/*'} onChange={handle} disabled={busy} hidden />
          <span className="btn btn--ghost btn--sm">{busy ? (isVideo ? `Uploading… ${progress}%` : 'Uploading…') : text}</span>
        </label>
        {crop && editSrc && !busy && (
          // A large copy of the current image; Cloudinary serves it with CORS so the canvas can export it.
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setCropSrc(cldUrl(editSrc, { w: 2000, crop: 'limit' }))}>
            Adjust photo
          </button>
        )}
        {error && <span role="alert" style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)' }}>{error}</span>}
      </span>
      {cropSrc && (
        <PhotoCropper
          src={cropSrc}
          aspect={crop.aspect}
          output={crop.output}
          guides={crop.guides}
          onCancel={closeCropper}
          onDone={(file) => { closeCropper(); upload(file) }}
        />
      )}
    </>
  )
}
