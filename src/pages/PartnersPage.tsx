import { useState } from 'react'
import { Plus, Search, MessageCircle, Copy, Pencil, Trash2, X, Check, Users, Award } from 'lucide-react'
import type { Partner } from '../types'
import { formatDate, isOverdue, isDueSoon, whatsappUrl, copyToClipboard, getInitials, cn } from '../lib/utils'
import { useBusinessHub } from '../contexts/BusinessHubContext'

const rankColors: Record<string, string> = {
  'Socio': 'badge-gray',
  'Rubí': 'badge-red',
  'Zafiro': 'badge-blue',
  'Diamante': 'badge-purple',
  'Corona': 'badge-amber',
}

function PartnerModal({ partner, onClose, onSave }: {
  partner: Partial<Partner> | null; onClose: () => void; onSave: (p: Partial<Partner>) => void
}) {
  const [form, setForm] = useState<Partial<Partner>>(partner ?? {
    name: '', phone: '', country: '', notes: '', currentRank: 'Socio', teamSize: 0, tags: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const set = (k: keyof Partner, v: any) => setForm(f => ({ ...f, [k]: v }))

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
          <h3 className="font-display font-bold text-lg text-white">{partner?.id ? 'Editar Socio' : 'Nuevo Socio'}</h3>
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
            <div><label className="input-label">País</label>
              <input className="input" value={form.country ?? ''} onChange={e => set('country', e.target.value)} /></div>
            <div><label className="input-label">Rango Actual</label>
              <select className="input" value={form.currentRank ?? 'Socio'} onChange={e => set('currentRank', e.target.value)}>
                {['Socio', 'Rubí', 'Zafiro', 'Diamante', 'Corona'].map(r => <option key={r} value={r}>{r}</option>)}
              </select></div>
            <div><label className="input-label">Tamaño del Equipo</label>
              <input type="number" className="input" value={form.teamSize ?? 0} onChange={e => set('teamSize', +e.target.value)} /></div>
            <div><label className="input-label">Último Contacto</label>
              <input type="date" className="input" value={form.lastContact ?? ''} onChange={e => set('lastContact', e.target.value)} /></div>
            <div><label className="input-label">Próx. Seguimiento</label>
              <input type="date" className="input" value={form.nextFollowUp ?? ''} onChange={e => set('nextFollowUp', e.target.value)} /></div>
          </div>
          <div><label className="input-label">Notas</label>
            <textarea className="input resize-none" rows={3} value={form.notes ?? ''} onChange={e => set('notes', e.target.value)} /></div>
          <div><label className="input-label">Etiquetas</label>
            <input className="input" value={(form.tags ?? []).join(', ')} onChange={e => set('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} /></div>
        </div>
        <div className="flex gap-3 mt-5 pt-5 border-t" style={{ borderColor: '#3d2e7a' }}>
          <button onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={handleValidationAndSave} className="btn-primary flex-1">
            <Check className="w-4 h-4" />{partner?.id ? 'Guardar' : 'Crear Socio'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PartnersPage() {
  const { partners, setPartners } = useBusinessHub()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<Partner> | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (phone: string, id: string) => {
    copyToClipboard(phone); setCopiedId(id); setTimeout(() => setCopiedId(null), 1500)
  }

  const handleSave = (form: Partial<Partner>) => {
    if (!form.name) return
    if (form.id) {
      setPartners(ps => ps.map(p => p.id === form.id ? { ...p, ...form, updatedAt: new Date().toISOString() } : p))
    } else {
      setPartners(ps => [{
        ...form as Partner, id: Date.now().toString(), userId: '1',
        tags: form.tags ?? [], teamSize: form.teamSize ?? 0,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      }, ...ps])
    }
    setModal(false); setEditing(null)
  }

  const filtered = partners.filter(p =>
    search === '' || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.country.toLowerCase().includes(search.toLowerCase()) ||
    p.currentRank.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Socios CRM</h1>
          <p className="text-sm text-muted">{filtered.length} socios registrados</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setModal(true) }}>
          <Plus className="w-4 h-4" />Nuevo Socio
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input className="input pl-9" placeholder="Buscar por nombre, país, rango..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(p => {
          const overdue = isOverdue(p.nextFollowUp)
          const soon = isDueSoon(p.nextFollowUp)
          const rankClass = rankColors[p.currentRank] ?? 'badge-gray'
          return (
            <div key={p.id} className="card-hover p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="avatar w-10 h-10 text-sm">{getInitials(p.name)}</div>
                  <div>
                    <p className="font-semibold text-fuxion-100">{p.name}</p>
                    <p className="text-xs text-muted">{p.country} · {p.phone}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn('badge', rankClass)}>
                    <Award className="w-3 h-3 mr-1" />{p.currentRank}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Users className="w-3 h-3" /> {p.teamSize} en equipo
                  </span>
                </div>
              </div>

              {p.notes && <p className="text-xs text-muted line-clamp-2">{p.notes}</p>}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted">Último contacto</span>
                  <p className="font-medium text-fuxion-200">{formatDate(p.lastContact)}</p>
                </div>
                <div>
                  <span className="text-muted">Próx. Seguimiento</span>
                  <p className={cn('font-medium', overdue ? 'text-red-400' : soon ? 'text-amber-400' : 'text-fuxion-200')}>
                    {overdue ? '⚠️ ' : soon ? '📅 ' : ''}{formatDate(p.nextFollowUp)}
                  </p>
                </div>
              </div>

              {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.tags.map(t => <span key={t} className="badge-purple badge text-xs">{t}</span>)}
                </div>
              )}

              <div className="flex items-center gap-1 pt-2 border-t" style={{ borderColor: '#3d2e7a' }}>
                <a href={whatsappUrl(p.phone)} target="_blank" rel="noopener noreferrer"
                  className="btn-ghost p-2 text-emerald-400 hover:bg-emerald-500/10 flex-1 justify-center">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <button onClick={() => handleCopy(p.phone, p.id)} className="btn-ghost p-2 flex-1 justify-center">
                  {copiedId === p.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={() => { setEditing(p); setModal(true) }} className="btn-ghost p-2 flex-1 justify-center">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { if (confirm('¿Eliminar socio?')) setPartners(ps => ps.filter(x => x.id !== p.id)) }}
                  className="btn-ghost p-2 flex-1 justify-center hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16 text-muted">No se encontraron socios.</div>
        )}
      </div>

      {modal && <PartnerModal partner={editing} onClose={() => { setModal(false); setEditing(null) }} onSave={handleSave} />}
    </div>
  )
}
