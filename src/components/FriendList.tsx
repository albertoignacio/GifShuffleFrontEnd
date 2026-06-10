import type { FriendResponse } from '../types'

interface FriendListProps {
  friends: FriendResponse[]
  onEdit: (friend: FriendResponse) => void
  onDelete: (id: string) => void
}

export default function FriendList({ friends, onEdit, onDelete }: FriendListProps) {
  if (!friends.length) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <span className="text-3xl block mb-3" aria-hidden="true">👥</span>
        <p className="text-cream-200/50 text-sm">No tenés amigos cargados todavía.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
      {friends.map((f, i) => (
        <div key={f.id}
          className="group bg-warm-900/60 border border-warm-700/40 rounded-xl p-4 hover:border-gold-400/30 hover:bg-warm-900/80 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: `${i * 60}ms` }}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-cream-100 text-lg leading-tight">{f.name} {f.lastName}</h3>
              <p className="text-cream-200/40 text-xs mt-1">{f.email}</p>
            </div>
            <span className="text-lg opacity-40 group-hover:opacity-70 transition-opacity" aria-hidden="true">🎄</span>
          </div>
          <div className="flex gap-3 mt-3 pt-3 border-t border-warm-700/30">
            <button onClick={() => onEdit(f)}
              className="text-xs text-gold-400/70 hover:text-gold-300 transition-colors cursor-pointer">
              Editar
            </button>
            <button onClick={() => onDelete(f.id)}
              className="text-xs text-crimson-400/70 hover:text-crimson-300 transition-colors cursor-pointer">
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
