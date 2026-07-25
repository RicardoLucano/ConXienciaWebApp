import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserPlus, Handshake, UserSearch,
  Bell, BookOpen, BarChart3, Calendar, Settings,
  ChevronLeft, Zap, X
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'
import { useBusinessHub } from '../../contexts/BusinessHubContext'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/customers', label: 'Clientes CRM', icon: Users },
  { to: '/customer-leads', label: 'Prospectos Clientes', icon: UserPlus },
  { to: '/partners', label: 'Socios CRM', icon: Handshake },
  { to: '/partner-leads', label: 'Prospectos Socios', icon: UserSearch },
  { to: '/notifications', label: 'Notificaciones', icon: Bell, badge: true },
  { to: '/calendar', label: 'Calendario', icon: Calendar },
  { to: '/reports', label: 'Reportes', icon: BarChart3 },
  { to: '/resources', label: 'Recursos', icon: BookOpen },
  { to: '/settings', label: 'Configuración', icon: Settings },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const { notifications } = useBusinessHub()
  const location = useLocation()
  const unreadCount = notifications.filter(n => !n.read && !n.archived).length

  const initials = user?.fullName?.split(' ').slice(0, 2).map(n => n[0]).join('') ?? 'FX'

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300',
          'w-[260px] border-r',
          'lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          background: 'linear-gradient(180deg, #0f0a1e 0%, #150e30 100%)',
          borderColor: '#3d2e7a',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b" style={{ borderColor: '#3d2e7a' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center glow-purple"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-sm text-fuxion-100 leading-none">FuXion</h1>
              <p className="text-xs text-muted">Business Hub</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden btn-ghost p-1.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 hide-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to)

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn('nav-item group', isActive && 'active')}
              >
                <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-fuxion-400' : 'text-muted group-hover:text-fuxion-400')} />
                <span className="flex-1">{item.label}</span>
                {item.badge && unreadCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full text-white"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* User profile */}
        <div className="p-3 border-t" style={{ borderColor: '#3d2e7a' }}>
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-2 transition-colors cursor-pointer">
            <div className="avatar w-8 h-8 text-xs">{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-fuxion-100 truncate">{user?.fullName}</p>
              <p className="text-xs text-muted truncate capitalize">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="btn-ghost p-1.5 opacity-0 group-hover:opacity-100"
              title="Cerrar sesión"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
