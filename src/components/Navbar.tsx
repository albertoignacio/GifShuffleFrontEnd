import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

interface NavbarProps {
  userName: string
}

export default function Navbar({ userName }: NavbarProps) {
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-warm-900/90 backdrop-blur-md border-b border-warm-700/50 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">🎁</span>
          <span className="font-display text-xl text-cream-100 tracking-wide">Amigo Invisible</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-sm text-cream-200/70 hidden sm:inline">{userName}</span>
          <button onClick={() => setOpen(!open)}
            className="lg:hidden text-cream-200 hover:text-cream-50 cursor-pointer text-xl leading-none">
            {open ? '✕' : '☰'}
          </button>
          <button onClick={logout}
            className="text-sm text-crimson-400 hover:text-crimson-300 transition-colors hidden sm:inline cursor-pointer">
            Cerrar sesión
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden px-6 pb-4 flex flex-col gap-3 items-end">
          <span className="text-sm text-cream-200/70">{userName}</span>
          <button onClick={logout}
            className="text-sm text-crimson-400 hover:text-crimson-300 transition-colors cursor-pointer">
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  )
}
