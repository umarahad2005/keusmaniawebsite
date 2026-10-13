/* Tiny fetch wrapper — credentials always included so the JWT cookie travels.
   getFresh() adds a ?t=<timestamp> cache-buster and skips the browser cache, for
   reads that must bypass the CDN copy (the admin editing content). */

async function request(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const text = await res.text()
  let body = null
  try { body = text ? JSON.parse(text) : null } catch { body = text }
  if (!res.ok) {
    const err = new Error((body && body.error) || `HTTP ${res.status}`)
    err.status = res.status
    err.body = body
    throw err
  }
  return body
}

export const api = {
  get:    (path)        => request(path),
  getFresh: (path)      => request(`${path}${path.includes('?') ? '&' : '?'}t=${Date.now()}`, { cache: 'no-store' }),
  post:   (path, data)  => request(path, { method: 'POST',  body: JSON.stringify(data) }),
  put:    (path, data)  => request(path, { method: 'PUT',   body: JSON.stringify(data) }),
  patch:  (path, data)  => request(path, { method: 'PATCH', body: JSON.stringify(data) }),
  del:    (path)        => request(path, { method: 'DELETE' }),
}
