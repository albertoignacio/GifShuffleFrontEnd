import { useState } from 'react'
import client from '../api/client'
import { isAxiosError } from 'axios'
import type { FriendResponse, CreateFriendRequest, UpdateFriendRequest } from '../types'

interface FriendFormProps {
  friend: FriendResponse | null
  onSave: () => void
  onClose: () => void
}

export default function FriendForm({ friend, onSave, onClose }: FriendFormProps) {
  const [form, setForm] = useState<CreateFriendRequest>({
    name: friend?.name ?? '',
    lastName: friend?.lastName ?? '',
    email: friend?.email ?? ''
  })
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      if (friend) {
        await client.put<FriendResponse>(`/friends/${friend.id}`, form as UpdateFriendRequest)
      } else {
        await client.post<FriendResponse>('/friends/create', form)
      }
      onSave()
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('Error al guardar')
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}>
      <form onSubmit={handleSubmit}
        className="bg-warm-900 border border-warm-700/50 rounded-2xl p-8 w-full max-w-sm mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl" aria-hidden="true">{friend ? '✏️' : '➕'}</span>
          <h3 className="font-display text-lg text-cream-100">
            {friend ? 'Editar amigo' : 'Agregar amigo'}
          </h3>
        </div>
        {error && (
          <p className="text-crimson-400 text-sm text-center bg-crimson-600/10 rounded-lg py-2 mb-4">{error}</p>
        )}
        <div className="space-y-3">
          <div className="flex gap-3">
            <input type="text" placeholder="Nombre" required
              className="w-full bg-warm-800/60 border border-warm-700/50 rounded-lg px-4 py-2.5 text-cream-50 placeholder:text-cream-200/30 focus:outline-none focus:border-gold-400/50 transition-colors text-sm"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="text" placeholder="Apellido" required
              className="w-full bg-warm-800/60 border border-warm-700/50 rounded-lg px-4 py-2.5 text-cream-50 placeholder:text-cream-200/30 focus:outline-none focus:border-gold-400/50 transition-colors text-sm"
              value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <input type="email" placeholder="Email" required
            className="w-full bg-warm-800/60 border border-warm-700/50 rounded-lg px-4 py-2.5 text-cream-50 placeholder:text-cream-200/30 focus:outline-none focus:border-gold-400/50 transition-colors text-sm"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 border border-warm-700/50 rounded-lg text-sm text-cream-200/70 hover:text-cream-50 hover:border-warm-600 transition-colors cursor-pointer">
            Cancelar
          </button>
          <button type="submit"
            className="px-5 py-2.5 bg-crimson-600 hover:bg-crimson-500 text-cream-50 rounded-lg transition-colors cursor-pointer text-sm font-medium">
            {friend ? 'Guardar' : 'Agregar'}
          </button>
        </div>
      </form>
    </div>
  )
}
