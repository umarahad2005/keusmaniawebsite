import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api.js'

const Ctx = createContext({
  admin: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
})

export function useAuth() { return useContext(Ctx) }

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const r = await api.get('/api/auth/me')
      setAdmin(r.admin || null)
    } catch {
      // 401 / 503 / network — treat as "not signed in"; never throw to UI
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const r = await api.post('/api/auth/login', { email, password })
    setAdmin(r.admin)
    return r
  }

  const logout = async () => {
    try { await api.post('/api/auth/logout', {}) } catch {}
    setAdmin(null)
  }

  useEffect(() => { refresh() }, [])

  return <Ctx.Provider value={{ admin, loading, login, logout, refresh }}>{children}</Ctx.Provider>
}
