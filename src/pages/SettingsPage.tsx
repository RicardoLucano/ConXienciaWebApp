import {
  Settings, User, Shield, Globe, Bell, Palette, Database,
  Zap, ChevronRight, Lock, Smartphone, Monitor
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const sections = [
  {
    label: 'Perfil',
    icon: User,
    items: [
      { label: 'Nombre completo', value: 'Riccardo FuXion', type: 'text' },
      { label: 'Email', value: 'riccardo@fuxion.com', type: 'text' },
      { label: 'Rol', value: 'Propietario', type: 'badge' },
    ],
  },
  {
    label: 'Notificaciones',
    icon: Bell,
    items: [
      { label: 'Seguimientos próximos (2 días)', value: 'Activado', type: 'toggle' },
      { label: 'Seguimientos vencidos', value: 'Activado', type: 'toggle' },
      { label: 'Resumen diario', value: 'Desactivado', type: 'toggle' },
    ],
  },
  {
    label: 'Apariencia',
    icon: Palette,
    items: [
      { label: 'Tema', value: 'Oscuro (FuXion Dark)', type: 'badge' },
      { label: 'Idioma', value: 'Español', type: 'badge' },
    ],
  },
  {
    label: 'Seguridad',
    icon: Shield,
    items: [
      { label: 'Autenticación', value: 'Google OAuth 2.0', type: 'badge' },
      { label: 'Sesión activa', value: 'Este dispositivo', type: 'text' },
    ],
  },
  {
    label: 'Integraciones',
    icon: Database,
    items: [
      { label: 'Google Calendar', value: 'No conectado', type: 'badge-warning' },
      { label: 'WhatsApp API', value: 'No conectado', type: 'badge-warning' },
      { label: 'Backend / API', value: 'Mock data (desarrollo)', type: 'badge-warning' },
    ],
  },
]

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-fuxion-400" />
          Configuración
        </h1>
        <p className="text-sm text-muted mt-0.5">Gestiona tu cuenta y preferencias</p>
      </div>

      {/* Profile card */}
      <div className="card p-6 flex items-center gap-5">
        <div className="avatar w-16 h-16 text-xl flex-shrink-0">
          {user?.fullName?.split(' ').slice(0, 2).map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-xl text-white">{user?.fullName}</p>
          <p className="text-sm text-muted">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="badge badge-purple">
              <Zap className="w-3 h-3 mr-1" />
              Propietario
            </span>
            <span className="badge badge-green text-xs">Cuenta activa</span>
          </div>
        </div>
      </div>

      {/* Settings sections */}
      {sections.map(section => {
        const Icon = section.icon
        return (
          <div key={section.label} className="card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: '#3d2e7a', background: '#1a1035' }}>
              <Icon className="w-4 h-4 text-fuxion-400" />
              <h2 className="font-semibold text-fuxion-100 text-sm">{section.label}</h2>
            </div>
            <div className="divide-y" style={{ borderColor: '#2a1f50' }}>
              {section.items.map(item => (
                <div key={item.label} className="flex items-center justify-between px-5 py-4 hover:bg-surface-2/30 transition-colors">
                  <span className="text-sm text-fuxion-200">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.type === 'badge' && (
                      <span className="badge badge-gray text-xs">{item.value}</span>
                    )}
                    {item.type === 'badge-warning' && (
                      <span className="badge badge-amber text-xs">{item.value}</span>
                    )}
                    {item.type === 'text' && (
                      <span className="text-sm text-muted">{item.value}</span>
                    )}
                    {item.type === 'toggle' && (
                      <div className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${item.value === 'Activado' ? 'bg-fuxion-600' : 'bg-surface-2'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.value === 'Activado' ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted opacity-40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Roadmap notice */}
      <div className="card p-5 border-dashed" style={{ borderStyle: 'dashed' }}>
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-fuxion-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-fuxion-200 text-sm">Panel de configuración completo — próximamente</p>
            <p className="text-xs text-muted mt-1">
              Gestión de roles, permisos multi-tenant, integraciones de Google Calendar y WhatsApp API,
              y configuración de notificaciones avanzadas estarán disponibles en la versión con backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
