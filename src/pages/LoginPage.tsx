import { useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { LoginRequest, AuthResponse } from '../types'

export default function LoginPage() {
  const { login } = useAuth()
  const [form, setForm] = useState<LoginRequest>({ email: '', password: '' })
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await client.post<AuthResponse>('/auth/login', form)
      login(data)
    } catch {
      setError('Credenciales inválidas')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-950 px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-2" aria-hidden="true">🎁</span>
          <h1 className="font-display text-3xl text-cream-100">Amigo Invisible</h1>
          <p className="text-cream-200/50 text-sm mt-1">Iniciar sesión</p>
        </div>
        <form onSubmit={handleSubmit}
          className="bg-warm-900/80 backdrop-blur-sm border border-warm-700/50 rounded-2xl p-8 space-y-4">
          {error && (
            <p className="text-crimson-400 text-sm text-center bg-crimson-600/10 rounded-lg py-2">{error}</p>
          )}
          <input type="email" placeholder="Email" required
            className="w-full bg-warm-800/60 border border-warm-700/50 rounded-lg px-4 py-2.5 text-cream-50 placeholder:text-cream-200/30 focus:outline-none focus:border-gold-400/50 transition-colors text-sm"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Contraseña" required
            className="w-full bg-warm-800/60 border border-warm-700/50 rounded-lg px-4 py-2.5 text-cream-50 placeholder:text-cream-200/30 focus:outline-none focus:border-gold-400/50 transition-colors text-sm"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="submit"
            className="w-full bg-crimson-600 hover:bg-crimson-500 text-cream-50 py-2.5 rounded-lg transition-colors cursor-pointer font-medium text-sm tracking-wide">
            Ingresar
          </button>
          <p className="text-sm text-center text-cream-200/50 pt-2">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="text-gold-400 hover:text-gold-300 underline underline-offset-2 transition-colors">Registrate</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
