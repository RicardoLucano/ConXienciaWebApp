import { useState } from 'react'
import { Bell, Check, CheckCheck, Archive, Search, Filter, Trash2, X } from 'lucide-react'
import type { Notification, NotificationRef } from '../types'
import { cn } from '../lib/utils'
import { formatDate } from '../lib/utils'
import { useBusinessHub } from '../contexts/BusinessHubContext'

const typeConfig = {
  upcoming_followup: { label: 'Próximo', class: 'badge-purple', dot: '#7c3aed' },
  overdue_followup: { label: 'Vencido', class: 'badge-red', dot: '#ef4444' },
  system: { label: 'Sistema', class: 'badge-gray', dot: '#8b7ec8' },
}

const refLabels: Record<NotificationRef, string> = {
  customer: 'Cliente',
  customer_lead: 'Prospecto Cliente',
  partner: 'Socio',
  partner_lead: 'Prospecto Socio',
}

type RefFilter = 'all' | NotificationRef

export default function NotificationsPage() {
  const { notifications, setNotifications } = useBusinessHub()
  const [search, setSearch] = useState('')
  const [refFilter, setRefFilter] = useState<RefFilter>('all')
  const [showArchived, setShowArchived] = useState(false)

  const markRead = (id: string) =>
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))

  const archiveOne = (id: string) =>
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, archived: true } : n))

  const deleteOne = (id: string) =>
    setNotifications(ns => ns.filter(n => n.id !== id))

  const markAllRead = () =>
    setNotifications(ns => ns.map(n => ({ ...n, read: true })))

  const filtered = notifications.filter(n => {
    if (!showArchived && n.archived) return false
    if (showArchived && !n.archived) return false
    if (refFilter !== 'all' && n.referenceType !== refFilter) return false
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) &&
        !n.body.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-fuxion-400" />
            Notificaciones
          </h1>
          <p className="text-sm text-muted mt-0.5">
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día ✅'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowArchived(s => !s)}
            className={cn('btn-secondary text-sm', showArchived && 'border-fuxion-600/50 text-fuxion-300')}
          >
            <Archive className="w-4 h-4" />
            {showArchived ? 'Ver activas' : 'Archivadas'}
          </button>
          {unreadCount > 0 && !showArchived && (
            <button onClick={markAllRead} className="btn-secondary text-sm">
              <CheckCheck className="w-4 h-4" />
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            className="input pl-9"
            placeholder="Buscar notificación..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted flex-shrink-0" />
          <select className="input w-44" value={refFilter} onChange={e => setRefFilter(e.target.value as RefFilter)}>
            <option value="all">Todos los tipos</option>
            <option value="customer">Clientes</option>
            <option value="customer_lead">Prospectos Clientes</option>
            <option value="partner">Socios</option>
            <option value="partner_lead">Prospectos Socios</option>
          </select>
        </div>
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="card p-12 text-center text-muted">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>{showArchived ? 'No hay notificaciones archivadas.' : 'No hay notificaciones activas.'}</p>
          </div>
        )}
        {filtered.map(n => {
          const cfg = typeConfig[n.type]
          return (
            <div
              key={n.id}
              className={cn(
                'card p-4 flex items-start gap-4 transition-all duration-200',
                !n.read && !n.archived && 'border-fuxion-600/30'
              )}
              style={!n.read && !n.archived ? { borderColor: 'rgba(124,58,237,0.3)' } : {}}
            >
              {/* Dot */}
              <div className="flex-shrink-0 mt-1">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: n.read ? '#3d2e7a' : cfg.dot, boxShadow: n.read ? 'none' : `0 0 6px ${cfg.dot}80` }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className={cn('font-semibold text-sm', n.read ? 'text-muted' : 'text-fuxion-100')}>{n.title}</p>
                    <p className="text-xs text-muted mt-0.5">{n.body}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={cn('badge text-xs', cfg.class)}>{cfg.label}</span>
                    {n.referenceType && <span className="badge badge-gray text-xs">{refLabels[n.referenceType]}</span>}
                  </div>
                </div>
                <p className="text-xs text-muted/60 mt-2">{formatDate(n.scheduledAt)}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {!n.read && (
                  <button onClick={() => markRead(n.id)} className="btn-ghost p-1.5" title="Marcar como leída">
                    <Check className="w-3.5 h-3.5 text-fuxion-400" />
                  </button>
                )}
                {!n.archived && (
                  <button onClick={() => archiveOne(n.id)} className="btn-ghost p-1.5" title="Archivar">
                    <Archive className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                )}
                <button onClick={() => deleteOne(n.id)} className="btn-ghost p-1.5 hover:text-red-400" title="Eliminar">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
