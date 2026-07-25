import { useState } from 'react'
import { Plus, Search, MessageCircle, Copy, Pencil, Trash2, X, Check } from 'lucide-react'
import type { PartnerLead, PartnerLeadStatus, InterestLevel } from '../types'
import { formatDate, isOverdue, isDueSoon, whatsappUrl, copyToClipboard, statusLabels, getInitials, cn } from '../lib/utils'
import { useBusinessHub } from '../contexts/BusinessHubContext'

const interestConfig: Record<InterestLevel, { label: string; class: string; icon: string }> = {
  low: { label: 'Bajo', class: 'badge-gray', icon: '🔵' },
  medium: { label: 'Medio', class: 'badge-amber', icon: '🟡' },
  high: { label: 'Alto', class: 'badge-green', icon: '🟢' },
}

function Modal({ lead, onClose, onSave }: {
  lead: Partial<PartnerLead> | null; onClose: () => void; onSave: (l: Partial<PartnerLead>) => void
}) {
  const [form, setForm] = useState<Partial<PartnerLead>>(lead ?? {
    name: '', phone: '', notes: '', interestLevel: 'medium', followUpDate: '', status: 'new',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const set = (k: keyof PartnerLead, v: any) => setForm(f => ({ ...f, [k]: v }))

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
          <h3 className="font-display font-bold text-lg text-white">{lead?.id ? 'Editar' : 'Nuevo Prospecto Socio'}</h3>
          <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="input-label">Nombre *</label>
            <input className={cn('input', errors.name && 'border-red-500 focus:ring-red-500/50 focus:border-red-500')} value={form.name ?? ''} onChange={e => { set('name', e.target.value); if (errors.name) setErrors({}) }} placeholder="Nombre completo" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="input-label">Teléfono</label>
              <input className="input" value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} /></div>
            <div><label className="input-label">Nivel de Interés</label>
              <select className="input" value={form.interestLevel ?? 'medium'} onChange={e => set('interestLevel', e.target.value as InterestLevel)}>
                <option value="low">Bajo</option><option value="medium">Medio</option><option value="high">Alto</option>
              </select></div>
            <div><label className="input-label">Estado</label>
              <select className="input" value={form.status ?? 'new'} onChange={e => set('status', e.target.value as PartnerLeadStatus)}>
                <option value="new">Nuevo</option><option value="contacted">Contactado</option>
                <option value="interested">Interesado</option><option value="declined">Rechazado</option>
              </select></div>
            <div><label className="input-label">Próx. Seguimiento</label>
              <input type="date" className="input" value={form.followUpDate ?? ''} onChange={e => set('followUpDate', e.target.value)} /></div>
          </div>
          <div><label className="input-label">Notas</label>
            <textarea className="input resize-none" rows={3} value={form.notes ?? ''} onChange={e => set('notes', e.target.value)} /></div>
        </div>
        <div className="flex gap-3 mt-5 pt-5 border-t" style={{ borderColor: '#3d2e7a' }}>
          <button onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={handleValidationAndSave} className="btn-primary flex-1">
            <Check className="w-4 h-4" />{lead?.id ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PartnerLeadsPage() {
  const { partnerLeads: leads, setPartnerLeads: setLeads } = useBusinessHub()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<PartnerLead> | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (phone: string, id: string) => {
    copyToClipboard(phone); setCopiedId(id); setTimeout(() => setCopiedId(null), 1500)
  }
  const handleSave = (form: Partial<PartnerLead>) => {
    if (!form.name) return
    if (form.id) {
      setLeads(ls => ls.map(l => l.id === form.id ? { ...l, ...form, updatedAt: new Date().toISOString() } : l))
    } else {
      setLeads(ls => [{
        ...form as PartnerLead, id: Date.now().toString(), userId: '1',
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      }, ...ls])
    }
    setModal(false); setEditing(null)
  }

  const filtered = leads.filter(l =>
    search === '' || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search)
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Prospectos Socios</h1>
          <p className="text-sm text-muted">{filtered.length} prospectos</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setModal(true) }}>
          <Plus className="w-4 h-4" />Nuevo Prospecto Socio
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input className="input pl-9" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Interés</th>
              <th>Próx. Seguimiento</th>
              <th>Estado</th>
              <th>Notas</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => {
              const { class: cls, icon } = interestConfig[l.interestLevel]
              const overdue = isOverdue(l.followUpDate)
              const soon = isDueSoon(l.followUpDate)
              return (
                <tr key={l.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar w-7 h-7 text-xs">{getInitials(l.name)}</div>
                      <span className="font-medium text-fuxion-100">{l.name}</span>
                    </div>
                  </td>
                  <td className="text-fuxion-200">{l.phone}</td>
                  <td><span className={cn('badge', cls)}>{icon} {interestConfig[l.interestLevel].label}</span></td>
                  <td>
                    <span className={cn('text-sm font-medium', overdue ? 'text-red-400' : soon ? 'text-amber-400' : 'text-fuxion-200')}>
                      {overdue ? '⚠️ ' : soon ? '📅 ' : ''}{formatDate(l.followUpDate)}
                    </span>
                  </td>
                  <td><span className="badge badge-purple">{statusLabels[l.status]}</span></td>
                  <td className="text-xs text-muted max-w-[180px] truncate">{l.notes}</td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <a href={whatsappUrl(l.phone)} target="_blank" rel="noopener noreferrer"
                        className="btn-ghost p-1.5 text-emerald-400 hover:bg-emerald-500/10">
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <button onClick={() => handleCopy(l.phone, l.id)} className="btn-ghost p-1.5">
                        {copiedId === l.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button onClick={() => { setEditing(l); setModal(true) }} className="btn-ghost p-1.5">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { if (confirm('¿Eliminar?')) setLeads(ls => ls.filter(x => x.id !== l.id)) }}
                        className="btn-ghost p-1.5 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-muted">No hay prospectos de socios.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && <Modal lead={editing} onClose={() => { setModal(false); setEditing(null) }} onSave={handleSave} />}
    </div>
  )
}
