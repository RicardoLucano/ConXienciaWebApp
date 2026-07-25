import { Zap, Globe, Shield, Users, BarChart3, Bell } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const features = [
  { icon: Users, label: 'CRM Completo', desc: 'Clientes, socios y prospectos' },
  { icon: Bell, label: 'Seguimientos', desc: 'Nunca olvides un contacto' },
  { icon: BarChart3, label: 'Analíticas', desc: 'KPIs en tiempo real' },
  { icon: Shield, label: 'Multi-tenant', desc: 'Datos seguros y privados' },
]

export default function LoginPage() {
  const { login } = useAuth()

  return (
    <div className="min-h-screen flex" style={{ background: '#0f0a1e' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse-slow"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full opacity-15 blur-3xl animate-pulse-slow"
            style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', animationDelay: '2s' }} />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 relative">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center glow-purple"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white">FuXion</h1>
            <p className="text-sm text-muted">Business Hub</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative">
          <h2 className="font-display font-bold text-5xl text-white leading-tight mb-4">
            El sistema operativo
            <br />
            <span className="gradient-text">de tu negocio</span>
          </h2>
          <p className="text-lg text-muted leading-relaxed max-w-md">
            Centraliza tu gestión de clientes, socios y prospectos. Automatiza seguimientos. Analiza resultados. Todo en un solo lugar.
          </p>
        </div>

        {/* Feature list */}
        <div className="grid grid-cols-2 gap-3 relative">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="card p-4 flex items-start gap-3 hover:border-fuxion-600/50 transition-colors">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(124, 58, 237, 0.2)' }}>
                <Icon className="w-4 h-4 text-fuxion-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-fuxion-100">{label}</p>
                <p className="text-xs text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8"
        style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #1a1035 100%)' }}>
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-white">FuXion Business Hub</h1>
            </div>
          </div>

          {/* Card */}
          <div className="card p-8 gradient-border">
            <div className="mb-8">
              <h2 className="font-display font-bold text-2xl text-white mb-2">Bienvenido</h2>
              <p className="text-muted text-sm">Inicia sesión para acceder a tu espacio de trabajo</p>
            </div>

            {/* Google login button */}
            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold text-sm
                         bg-white text-gray-800 hover:bg-gray-50 active:bg-gray-100
                         transition-all duration-200 hover:shadow-lg hover:-translate-y-px mb-4"
            >
              <Globe className="w-5 h-5 text-blue-500" />
              Continuar con Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: '#3d2e7a' }} />
              <span className="text-xs text-muted">Acceso seguro</span>
              <div className="flex-1 h-px" style={{ background: '#3d2e7a' }} />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted justify-center">
              <Shield className="w-3.5 h-3.5 text-fuxion-500" />
              <span>Autenticación OAuth 2.0 · Datos encriptados · Multi-tenant</span>
            </div>
          </div>

          <p className="text-center text-xs text-muted mt-6">
            FuXion Business Hub v1.0 · ConXiencia™
          </p>
        </div>
      </div>
    </div>
  )
}
