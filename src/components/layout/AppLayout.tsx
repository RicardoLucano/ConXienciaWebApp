import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/customers': 'Clientes CRM',
  '/customer-leads': 'Prospectos Clientes',
  '/partners': 'Socios CRM',
  '/partner-leads': 'Prospectos Socios',
  '/notifications': 'Notificaciones',
  '/calendar': 'Calendario',
  '/reports': 'Reportes',
  '/resources': 'Centro de Recursos',
  '/settings': 'Configuración',
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] ?? 'FuXion Business Hub'

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} pageTitle={pageTitle} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
