import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  Users, UserPlus, Handshake,
  TrendingUp, AlertTriangle, Calendar,
  ArrowUpRight, Zap, Bell
} from 'lucide-react'
import { mockActivityData, mockMonthlyData } from '../data/mockData'
import { formatDate, isOverdue } from '../lib/utils'
import { Link } from 'react-router-dom'
import { useBusinessHub } from '../contexts/BusinessHubContext'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="card p-3 text-sm" style={{ border: '1px solid #3d2e7a' }}>
        <p className="font-semibold text-fuxion-100 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const { stats, customers, notifications } = useBusinessHub()
  const urgentFollowUps = customers.filter(c => c.nextFollowUp && isOverdue(c.nextFollowUp))
  const unreadNotifs = notifications.filter(n => !n.read && !n.archived)

  const kpiCards = [
    {
      label: 'Clientes Totales', value: stats.totalCustomers,
      sub: `+${stats.newCustomersThisMonth} este mes`,
      icon: Users, color: '#7c3aed', bg: 'rgba(124,58,237,0.15)',
    },
    {
      label: 'Seguimientos Próximos', value: stats.upcomingFollowUps,
      sub: 'En los próximos 2 días',
      icon: Calendar, color: '#10b981', bg: 'rgba(16,185,129,0.15)',
    },
    {
      label: 'Seguimientos Vencidos', value: stats.missedFollowUps,
      sub: 'Requieren acción inmediata',
      icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.15)',
    },
    {
      label: 'Socios Activos', value: stats.activePartners,
      sub: `de ${stats.totalPartners} socios totales`,
      icon: Handshake, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',
    },
    {
      label: 'Prospectos Clientes', value: stats.totalCustomerLeads,
      sub: 'En pipeline activo',
      icon: UserPlus, color: '#a855f7', bg: 'rgba(168,85,247,0.15)',
    },
    {
      label: 'Tasa de Conversión', value: `${stats.conversionRate}%`,
      sub: 'Prospectos a clientes',
      icon: TrendingUp, color: '#06b6d4', bg: 'rgba(6,182,212,0.15)',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            ¡Buen día! 👋
          </h1>
          <p className="text-muted text-sm mt-1">Aquí está el resumen de tu negocio FuXion</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium badge-purple">
            <Zap className="w-3 h-3" />
            Datos actualizados
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="kpi-card card-hover animate-slide-up">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: kpi.bg }}>
                  <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted opacity-50" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-white">{kpi.value}</p>
                <p className="text-sm font-medium text-fuxion-200 mt-0.5">{kpi.label}</p>
                <p className="text-xs text-muted mt-0.5">{kpi.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly activity */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-fuxion-100">Actividad Semanal</h3>
            <span className="badge-gray badge text-xs">Esta semana</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockActivityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gClientes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gProspectos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3d2e7a" opacity={0.5} />
              <XAxis dataKey="day" stroke="#8b7ec8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#8b7ec8" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#8b7ec8' }} />
              <Area type="monotone" dataKey="clientes" name="Clientes"
                stroke="#7c3aed" strokeWidth={2} fill="url(#gClientes)" />
              <Area type="monotone" dataKey="prospectos" name="Prospectos"
                stroke="#f59e0b" strokeWidth={2} fill="url(#gProspectos)" />
              <Area type="monotone" dataKey="socios" name="Socios"
                stroke="#10b981" strokeWidth={2} fill="none" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly growth */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-fuxion-100">Crecimiento Mensual</h3>
            <span className="badge-gray badge text-xs">Últimos 6 meses</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockMonthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#3d2e7a" opacity={0.5} />
              <XAxis dataKey="month" stroke="#8b7ec8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#8b7ec8" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#8b7ec8' }} />
              <Bar dataKey="clientes" name="Clientes" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="socios" name="Socios" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Urgent follow-ups */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-fuxion-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Seguimientos Urgentes
            </h3>
            <Link to="/customers" className="text-xs text-fuxion-400 hover:text-fuxion-300">Ver todos →</Link>
          </div>
          {urgentFollowUps.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">✅ No hay seguimientos vencidos</p>
          ) : (
            <div className="space-y-2">
              {urgentFollowUps.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2/50 transition-colors">
                  <div className="avatar w-8 h-8 text-xs flex-shrink-0">
                    {c.fullName.split(' ').slice(0, 2).map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fuxion-100 truncate">{c.fullName}</p>
                    <p className="text-xs text-red-400">Venció: {formatDate(c.nextFollowUp)}</p>
                  </div>
                  <div className="status-dot lost" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent notifications */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-fuxion-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-fuxion-400" />
              Notificaciones Recientes
            </h3>
            <Link to="/notifications" className="text-xs text-fuxion-400 hover:text-fuxion-300">Ver todas →</Link>
          </div>
          <div className="space-y-2">
            {unreadNotifs.slice(0, 4).map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-2/50 transition-colors">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: n.type === 'overdue_followup' ? '#ef4444' : '#7c3aed' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-fuxion-100">{n.title}</p>
                  <p className="text-xs text-muted truncate">{n.body}</p>
                </div>
              </div>
            ))}
            {unreadNotifs.length === 0 && (
              <p className="text-sm text-muted text-center py-4">✅ Todo al día</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
