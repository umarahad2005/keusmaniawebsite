/* Direct-to-Cloudinary upload widget. Asks the API for a signature,
   then POSTs the file straight to Cloudinary. Returns the secure URL via onUpload. */
import { useState } from 'react'
import { api } from '../../lib/api.js'

export default function CloudinaryUpload({ onUpload, folder = 'keu', label = 'Upload image' }) {
  const [busy,    setBusy]    = useState(false)
  const [error,   setError]   = useState(null)

  const handle = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const sig = await api.get(`/api/upload-signature?folder=${encodeURIComponent(folder)}`)
      const fd = new FormData()
      fd.append('file',      file)
      fd.append('api_key',   sig.api_key)
      fd.append('timestamp', sig.timestamp)
      fd.append('signature', sig.signature)
      fd.append('folder',    sig.folder)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`, {
        method: 'POST', body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message || `Upload failed (${res.status})`)
      onUpload?.(data.secure_url, data)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <label className="cloudinary-upload">
      <input type="file" accept="image/*" onChange={handle} disabled={busy} hidden />
      <span className="btn btn--ghost btn--sm">{busy ? 'Uploading…' : label}</span>
      {error && <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginLeft: 8 }}>{error}</span>}
    </label>
  )
}
