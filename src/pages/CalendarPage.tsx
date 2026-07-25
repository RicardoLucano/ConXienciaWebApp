import { Calendar, ChevronLeft, ChevronRight, Clock, Users, Handshake, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { formatDate } from '../lib/utils'
import { cn } from '../lib/utils'
import { useBusinessHub } from '../contexts/BusinessHubContext'
import type { Customer, CustomerLead, Partner, PartnerLead } from '../types'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

interface CalEvent {
  date: string
  label: string
  type: 'customer' | 'partner' | 'customer_lead' | 'partner_lead'
}

function buildEvents(
  customers: Customer[],
  partners: Partner[],
  customerLeads: CustomerLead[],
  partnerLeads: PartnerLead[]
): CalEvent[] {
  const events: CalEvent[] = []
  customers.forEach(c => {
    if (c.nextFollowUp) events.push({ date: c.nextFollowUp, label: c.fullName, type: 'customer' })
  })
  partners.forEach(p => {
    if (p.nextFollowUp) events.push({ date: p.nextFollowUp, label: p.name, type: 'partner' })
  })
  customerLeads.forEach(l => {
    if (l.followUpDate) events.push({ date: l.followUpDate, label: l.name, type: 'customer_lead' })
  })
  partnerLeads.forEach(l => {
    if (l.followUpDate) events.push({ date: l.followUpDate, label: l.name, type: 'partner_lead' })
  })
  return events
}

const typeStyle: Record<CalEvent['type'], { color: string; badge: string; Icon: any }> = {
  customer: { color: '#7c3aed', badge: 'bg-fuxion-600/80', Icon: Users },
  partner: { color: '#f59e0b', badge: 'bg-amber-500/80', Icon: Handshake },
  customer_lead: { color: '#a855f7', badge: 'bg-purple-500/80', Icon: UserPlus },
  partner_lead: { color: '#10b981', badge: 'bg-emerald-600/80', Icon: Users },
}

const typeLabel: Record<CalEvent['type'], string> = {
  customer: 'Cliente',
  partner: 'Socio',
  customer_lead: 'Prospecto Cliente',
  partner_lead: 'Prospecto Socio',
}

export default function CalendarPage() {
  const { customers, partners, customerLeads, partnerLeads } = useBusinessHub()
  const today = new Date()
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const allEvents = buildEvents(customers, partners, customerLeads, partnerLeads)

  const firstDay = new Date(current.year, current.month, 1).getDay()
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const eventsOnDay = (day: number) => {
    const dateStr = `${current.year}-${String(current.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return allEvents.filter(e => e.date === dateStr)
  }

  const isToday = (day: number) =>
    day === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear()

  const prevMonth = () => {
    setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 })
  }
  const nextMonth = () => {
    setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 })
  }

  // All events for the current month sidebar
  const monthEvents = allEvents
    .filter(e => {
      const d = new Date(e.date)
      return d.getFullYear() === current.year && d.getMonth() === current.month
    })
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-fuxion-400" />
            Calendario
          </h1>
          <p className="text-sm text-muted">Seguimientos y eventos del mes</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="btn-ghost p-2"><ChevronLeft className="w-5 h-5" /></button>
          <span className="font-display font-semibold text-fuxion-100 min-w-[160px] text-center">
            {MONTHS[current.month]} {current.year}
          </span>
          <button onClick={nextMonth} className="btn-ghost p-2"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Calendar grid */}
        <div className="xl:col-span-2 card overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b" style={{ borderColor: '#3d2e7a', background: '#1a1035' }}>
            {DAYS.map(d => (
              <div key={d} className="text-center py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const events = day ? eventsOnDay(day) : []
              return (
                <div
                  key={i}
                  className={cn(
                    'min-h-[80px] p-1.5 border-b border-r transition-colors',
                    day && 'hover:bg-surface-2/40 cursor-default',
                    !day && 'opacity-0 pointer-events-none'
                  )}
                  style={{ borderColor: '#2a1f50' }}
                >
                  {day && (
                    <>
                      <div className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-sm mb-1 mx-auto font-medium',
                        isToday(day)
                          ? 'bg-fuxion-600 text-white font-bold'
                          : 'text-fuxion-200 hover:bg-surface-2'
                      )}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {events.slice(0, 2).map((ev, j) => {
                          const s = typeStyle[ev.type]
                          return (
                            <div key={j}
                              className={cn('text-[9px] px-1.5 py-0.5 rounded-md truncate font-medium text-white', s.badge)}>
                              {ev.label}
                            </div>
                          )
                        })}
                        {events.length > 2 && (
                          <p className="text-[9px] text-muted pl-1">+{events.length - 2} más</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar events list */}
        <div className="card p-4 space-y-3">
          <h3 className="font-display font-semibold text-fuxion-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-fuxion-400" />
            Eventos de {MONTHS[current.month]}
          </h3>

          {/* Legend */}
          <div className="flex flex-wrap gap-2">
            {(Object.entries(typeLabel) as [CalEvent['type'], string][]).map(([type, label]) => {
              const s = typeStyle[type]
              return (
                <div key={type} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-xs text-muted">{label}</span>
                </div>
              )
            })}
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto hide-scrollbar">
            {monthEvents.length === 0 && (
              <p className="text-sm text-muted text-center py-8">No hay eventos este mes.</p>
            )}
            {monthEvents.map((ev, i) => {
              const s = typeStyle[ev.type]
              const Icon = s.Icon
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2/50 transition-colors">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${s.color}20` }}>
                    <Icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fuxion-100 truncate">{ev.label}</p>
                    <p className="text-xs text-muted">{typeLabel[ev.type]}</p>
                  </div>
                  <div className="text-xs text-muted text-right flex-shrink-0">
                    {formatDate(ev.date)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Google Calendar notice */}
      <div className="card p-5 border-dashed flex items-center gap-4" style={{ borderStyle: 'dashed' }}>
        <Calendar className="w-8 h-8 text-fuxion-400 flex-shrink-0" />
        <div>
          <p className="font-semibold text-fuxion-200">Sincronización con Google Calendar</p>
          <p className="text-sm text-muted">La integración bidireccional con Google Calendar estará disponible en la próxima versión del backend.</p>
        </div>
      </div>
    </div>
  )
}
