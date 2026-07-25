import { Menu, Bell, Search, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useBusinessHub } from '../../contexts/BusinessHubContext'

interface TopbarProps {
  onMenuClick: () => void
  pageTitle: string
}

export default function Topbar({ onMenuClick, pageTitle }: TopbarProps) {
  const { user, logout } = useAuth()
  const { notifications } = useBusinessHub()
  const unreadCount = notifications.filter(n => !n.read && !n.archived).length
  const initials = user?.fullName?.split(' ').slice(0, 2).map(n => n[0]).join('') ?? 'FX'

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6 h-16 border-b"
      style={{
        background: 'rgba(15, 10, 30, 0.85)',
        backdropFilter: 'blur(16px)',
        borderColor: '#3d2e7a',
      }}
    >
      {/* Mobile menu btn */}
      <button
        onClick={onMenuClick}
        className="btn-ghost p-2 lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h2 className="font-display font-semibold text-lg text-fuxion-100 hidden md:block">{pageTitle}</h2>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Buscar..."
          className="search-input w-52 text-sm"
          style={{ paddingLeft: '2.25rem' }}
        />
      </div>

      {/* Notifications */}
      <Link to="/notifications" className="relative btn-ghost p-2.5" aria-label="Notificaciones">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-xs font-bold text-white rounded-full"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            {unreadCount}
          </span>
        )}
      </Link>

      {/* Avatar + logout */}
      <div className="flex items-center gap-2">
        <div className="avatar w-8 h-8 text-xs flex-shrink-0">{initials}</div>
        <button onClick={logout} className="btn-ghost p-2" title="Cerrar sesión">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
