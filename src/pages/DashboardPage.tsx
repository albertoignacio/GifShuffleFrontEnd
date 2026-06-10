import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import FriendList from '../components/FriendList'
import ShufflePanel from '../components/ShufflePanel'
import type { FriendResponse } from '../types'

const FriendForm = lazy(() => import('../components/FriendForm'))

export default function DashboardPage() {
  const { user } = useAuth()
  const [friends, setFriends] = useState<FriendResponse[]>([])
  const [editingFriend, setEditingFriend] = useState<FriendResponse | null>(null)
  const [showForm, setShowForm] = useState(false)

  const loadFriends = useCallback(async () => {
    const { data } = await client.get<FriendResponse[]>('/friends/getAll')
    setFriends(data)
  }, [])

  useEffect(() => { loadFriends() }, [loadFriends])

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este amigo?')) return
    await client.delete(`/friends/${id}`)
    setFriends((prev) => prev.filter((f) => f.id !== id))
  }

  function handleEdit(friend: FriendResponse) {
    setEditingFriend(friend)
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditingFriend(null)
  }

  async function handleSave() {
    handleCloseForm()
    await loadFriends()
  }

  return (
    <div className="min-h-screen bg-warm-950">
      <Navbar userName={`${user?.name} ${user?.lastName}`} />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in-up">
          <div>
            <h2 className="font-display text-2xl text-cream-100">Mis amigos</h2>
            <p className="text-cream-200/40 text-sm mt-1">{friends.length} participante{friends.length !== 1 && 's'}</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-crimson-600 hover:bg-crimson-500 text-cream-50 px-5 py-2.5 rounded-lg transition-all duration-300 cursor-pointer text-sm font-medium tracking-wide shadow-lg shadow-crimson-600/20 flex items-center gap-2">
            <span>+</span> Agregar amigo
          </button>
        </header>

        <div className="space-y-8">
          <FriendList friends={friends} onEdit={handleEdit} onDelete={handleDelete} />
          <ShufflePanel friends={friends} onShuffle={loadFriends} />
        </div>
      </main>
      {showForm && (
        <Suspense fallback={null}>
          <FriendForm friend={editingFriend} onSave={handleSave} onClose={handleCloseForm} />
        </Suspense>
      )}
    </div>
  )
}
