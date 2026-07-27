import { BarChart3, Download, FileText, Table2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts'

import { useBusinessHub } from '../contexts/BusinessHubContext'
import { exportToCSV, exportToPDF } from '../lib/exportUtils'

const PIE_COLORS = ['#7c3aed', '#f59e0b', '#10b981', '#ef4444']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="card p-3 text-sm" style={{ border: '1px solid #3d2e7a' }}>
        <p className="font-semibold text-fuxion-100 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    )
  }
  return null
}

export default function ReportsPage() {
  const { customers, partners, customerLeads, partnerLeads, monthlyData } = useBusinessHub()

  const pieData = [
    { name: 'Clientes', value: customers.length },
    { name: 'Socios', value: partners.length },
    { name: 'Prospectos Cliente', value: customerLeads.length },
    { name: 'Prospectos Socio', value: partnerLeads.length },
  ]

  const conversionData = [
    { name: 'Nuevos', value: customerLeads.filter(l => l.status === 'new').length },
    { name: 'Contactados', value: customerLeads.filter(l => l.status === 'contacted').length },
    { name: 'Calificados', value: customerLeads.filter(l => l.status === 'qualified').length },
    { name: 'Perdidos', value: customerLeads.filter(l => l.status === 'lost').length },
  ]

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (format === 'pdf') {
      exportToPDF()
    } else {
      // Default to exporting active customers list
      exportToCSV(customers, 'customers')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Reportes</h1>
          <p className="text-sm text-muted">Análisis y exportación de datos de tu negocio</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleExport('csv')} className="btn-secondary text-sm">
            <Table2 className="w-4 h-4" />
            CSV
          </button>
          <button onClick={() => handleExport('excel')} className="btn-secondary text-sm">
            <FileText className="w-4 h-4" />
            Excel
          </button>
          <button onClick={() => handleExport('pdf')} className="btn-primary text-sm">
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Clientes', value: customers.length, color: '#7c3aed', bg: 'rgba(124,58,237,0.15)' },
          { label: 'Total Socios', value: partners.length, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
          { label: 'Prospectos Clientes', value: customerLeads.length, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
          { label: 'Prospectos Socios', value: partnerLeads.length, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="kpi-card card-hover">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
              <BarChart3 className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{value}</p>
              <p className="text-sm text-fuxion-200">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly growth */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-fuxion-100 mb-5">Crecimiento Mensual</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="30%">
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

        {/* Distribution Pie */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-fuxion-100 mb-5">Distribución de Contactos</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <div>
                    <p className="text-sm text-fuxion-200">{d.name}</p>
                    <p className="text-xs text-muted">{d.value} registros</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion funnel */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-display font-semibold text-fuxion-100 mb-5">Embudo de Conversión — Prospectos Clientes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={conversionData} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3d2e7a" opacity={0.5} horizontal={false} />
              <XAxis type="number" stroke="#8b7ec8" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" stroke="#8b7ec8" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Cantidad" fill="#7c3aed" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Coming soon notice */}
      <div className="card p-6 text-center border-dashed" style={{ borderStyle: 'dashed' }}>
        <BarChart3 className="w-10 h-10 mx-auto mb-3 text-fuxion-400 opacity-60" />
        <p className="font-semibold text-fuxion-200 mb-1">Reportes avanzados próximamente</p>
        <p className="text-sm text-muted">Filtros por fecha, usuario, país y exportación completa disponibles al conectar el backend.</p>
      </div>
    </div>
  )
}
