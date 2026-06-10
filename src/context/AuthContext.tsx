import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AuthResponse } from '../types'

interface AuthContextType {
  token: string | null
  user: { name: string; lastName: string; email: string } | null
  login: (data: AuthResponse) => void
  logout: () => void
}

function safeGetItem(key: string): string | null {
  try { return localStorage.getItem(key) } catch { return null }
}

function safeSetItem(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* Safari private browsing */ }
}

function safeRemoveItem(key: string) {
  try { localStorage.removeItem(key) } catch { /* noop */ }
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => safeGetItem('token'))
  const [user, setUser] = useState<{ name: string; lastName: string; email: string } | null>(() => {
    const stored = safeGetItem('user')
    return stored ? JSON.parse(stored) : null
  })

  function login(data: AuthResponse) {
    safeSetItem('token', data.token)
    safeSetItem('user', JSON.stringify({ name: data.name, lastName: data.lastName, email: data.email }))
    setToken(data.token)
    setUser({ name: data.name, lastName: data.lastName, email: data.email })
  }

  function logout() {
    safeRemoveItem('token')
    safeRemoveItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
