import { useState } from 'react'
import { Plus, Search, MessageCircle, Copy, Pencil, Trash2, X, Check, Filter } from 'lucide-react'
import type { CustomerLead, LeadStatus } from '../types'
import { formatDate, isOverdue, isDueSoon, whatsappUrl, copyToClipboard, statusLabels, getInitials, cn } from '../lib/utils'
import { useBusinessHub } from '../contexts/BusinessHubContext'

const statusColors: Record<LeadStatus, string> = {
  new: 'badge-blue',
  contacted: 'badge-purple',
  qualified: 'badge-green',
  lost: 'badge-red',
}

function LeadModal({ lead, onClose, onSave }: {
  lead: Partial<CustomerLead> | null
  onClose: () => void
  onSave: (l: Partial<CustomerLead>) => void
}) {
  const [form, setForm] = useState<Partial<CustomerLead>>(lead ?? {
    name: '', phone: '', interest: '', notes: '', followUpDate: '', status: 'new', tags: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const set = (k: keyof CustomerLead, v: any) => setForm(f => ({ ...f, [k]: v }))

  const handleValidationAndSave = () => {
    if (!form.name?.trim()) {
      setErrors({ name: 'El nombre es requerido' })
      return
    }
    onSave(form)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-lg text-white">{lead?.id ? 'Editar Prospecto' : 'Nuevo Prospecto'}</h3>
          <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="input-label">Nombre *</label>
            <input className={cn('input', errors.name && 'border-red-500 focus:ring-red-500/50 focus:border-red-500')} value={form.name ?? ''} onChange={e => { set('name', e.target.value); if (errors.name) setErrors({}) }} placeholder="Nombre del prospecto" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="input-label">Teléfono</label>
              <input className="input" value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} placeholder="+52 55..." /></div>
            <div><label className="input-label">Estado</label>
              <select className="input" value={form.status ?? 'new'} onChange={e => set('status', e.target.value as LeadStatus)}>
                <option value="new">Nuevo</option>
                <option value="contacted">Contactado</option>
                <option value="qualified">Calificado</option>
                <option value="lost">Perdido</option>
              </select></div>
          </div>
          <div><label className="input-label">Interés / Necesidad</label>
            <input className="input" value={form.interest ?? ''} onChange={e => set('interest', e.target.value)} placeholder="Ej: Pérdida de peso, energía..." /></div>
          <div><label className="input-label">Próx. Seguimiento</label>
            <input type="date" className="input" value={form.followUpDate ?? ''} onChange={e => set('followUpDate', e.target.value)} /></div>
          <div><label className="input-label">Notas</label>
            <textarea className="input resize-none" rows={3} value={form.notes ?? ''} onChange={e => set('notes', e.target.value)} placeholder="Observaciones..." /></div>
          <div><label className="input-label">Etiquetas (separadas por coma)</label>
            <input className="input" value={(form.tags ?? []).join(', ')} onChange={e => set('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Instagram, Referido..." /></div>
        </div>
        <div className="flex gap-3 mt-5 pt-5 border-t" style={{ borderColor: '#3d2e7a' }}>
          <button onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={handleValidationAndSave} className="btn-primary flex-1">
            <Check className="w-4 h-4" />{lead?.id ? 'Guardar' : 'Crear Prospecto'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CustomerLeadsPage() {
  const { customerLeads: leads, setCustomerLeads: setLeads } = useBusinessHub()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<CustomerLead> | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (phone: string, id: string) => {
    copyToClipboard(phone); setCopiedId(id); setTimeout(() => setCopiedId(null), 1500)
  }

  const handleSave = (form: Partial<CustomerLead>) => {
    if (!form.name) return
    if (form.id) {
      setLeads(ls => ls.map(l => l.id === form.id ? { ...l, ...form, updatedAt: new Date().toISOString() } : l))
    } else {
      setLeads(ls => [{ ...form as CustomerLead, id: Date.now().toString(), userId: '1', tags: form.tags ?? [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...ls])
    }
    setModal(false); setEditing(null)
  }

  const filtered = leads.filter(l =>
    (statusFilter === 'all' || l.status === statusFilter) &&
    (search === '' || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search))
  )

  const statCounts = {
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    lost: leads.filter(l => l.status === 'lost').length,
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Prospectos Clientes</h1>
          <p className="text-sm text-muted">{filtered.length} prospectos</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setModal(true) }}>
          <Plus className="w-4 h-4" />Nuevo Prospecto
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {([['all', 'Todos', leads.length], ['new', 'Nuevos', statCounts.new], ['contacted', 'Contactados', statCounts.contacted], ['qualified', 'Calificados', statCounts.qualified], ['lost', 'Perdidos', statCounts.lost]] as const).map(([val, label, count]) => (
          <button key={val} onClick={() => setStatusFilter(val as any)}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              statusFilter === val
                ? 'bg-fuxion-600/30 text-fuxion-300 border border-fuxion-600/40'
                : 'text-muted hover:text-fuxion-200 hover:bg-surface-2')}>
            {label} <span className="ml-1 text-xs opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input className="input pl-9" placeholder="Buscar prospecto..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map(l => {
          const overdue = isOverdue(l.followUpDate)
          const soon = isDueSoon(l.followUpDate)
          return (
            <div key={l.id} className="card-hover p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="avatar w-9 h-9 text-sm">{getInitials(l.name)}</div>
                  <div>
                    <p className="font-semibold text-fuxion-100">{l.name}</p>
                    <p className="text-xs text-muted">{l.phone}</p>
                  </div>
                </div>
                <span className={cn('badge', statusColors[l.status])}>{statusLabels[l.status]}</span>
              </div>

              {l.interest && (
                <p className="text-sm text-fuxion-200 bg-surface-2/50 rounded-lg px-3 py-2">
                  💡 {l.interest}
                </p>
              )}

              {l.notes && <p className="text-xs text-muted line-clamp-2">{l.notes}</p>}

              <div className="flex items-center justify-between text-xs">
                <span className={cn('font-medium', overdue ? 'text-red-400' : soon ? 'text-amber-400' : 'text-muted')}>
                  {overdue ? '⚠️ Vencido: ' : '📅 Seguimiento: '}
                  {formatDate(l.followUpDate)}
                </span>
              </div>

              {l.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {l.tags.map(t => <span key={t} className="badge-purple badge text-xs">{t}</span>)}
                </div>
              )}

              <div className="flex items-center gap-1 pt-1 border-t" style={{ borderColor: '#3d2e7a' }}>
                <a href={whatsappUrl(l.phone)} target="_blank" rel="noopener noreferrer"
                  className="btn-ghost p-1.5 text-emerald-400 hover:bg-emerald-500/10 flex-1 justify-center" title="WhatsApp">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <button onClick={() => handleCopy(l.phone, l.id)}
                  className="btn-ghost p-1.5 flex-1 justify-center" title="Copiar">
                  {copiedId === l.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={() => { setEditing(l); setModal(true) }}
                  className="btn-ghost p-1.5 flex-1 justify-center" title="Editar">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { if (confirm('¿Eliminar?')) setLeads(ls => ls.filter(x => x.id !== l.id)) }}
                  className="btn-ghost p-1.5 flex-1 justify-center hover:text-red-400" title="Eliminar">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-muted">
            No hay prospectos con esos filtros.
          </div>
        )}
      </div>

      {modal && <LeadModal lead={editing} onClose={() => { setModal(false); setEditing(null) }} onSave={handleSave} />}
    </div>
  )
}
