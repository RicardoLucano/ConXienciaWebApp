import { useState } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, X, Check, GripVertical } from 'lucide-react'
import type { Resource } from '../types'
import { useBusinessHub } from '../contexts/BusinessHubContext'

const categoryColors: Record<string, string> = {
  'Corporativo': 'badge-purple',
  'Capacitación': 'badge-blue',
  'Soporte': 'badge-green',
  'Documentos': 'badge-gray',
  'Productos': 'badge-amber',
  'Negocio': 'badge-amber',
}

function ResourceModal({ resource, onClose, onSave }: {
  resource: Partial<Resource> | null
  onClose: () => void
  onSave: (r: Partial<Resource>) => void
}) {
  const [form, setForm] = useState<Partial<Resource>>(resource ?? {
    title: '', url: '', icon: '🔗', category: 'Corporativo',
  })
  const set = (k: keyof Resource, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-lg text-white">
            {resource?.id ? 'Editar Recurso' : 'Nuevo Recurso'}
          </h3>
          <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="input-label">Ícono</label>
              <input className="input text-center text-xl" value={form.icon ?? '🔗'}
                onChange={e => set('icon', e.target.value)} maxLength={2} />
            </div>
            <div className="col-span-3">
              <label className="input-label">Título *</label>
              <input className="input" value={form.title ?? ''} onChange={e => set('title', e.target.value)}
                placeholder="Nombre del recurso" />
            </div>
          </div>
          <div>
            <label className="input-label">URL *</label>
            <input className="input" value={form.url ?? ''} onChange={e => set('url', e.target.value)}
              placeholder="https://..." />
          </div>
          <div>
            <label className="input-label">Categoría</label>
            <select className="input" value={form.category ?? 'Corporativo'}
              onChange={e => set('category', e.target.value)}>
              {['Corporativo', 'Capacitación', 'Soporte', 'Documentos', 'Productos', 'Negocio'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-5 pt-5 border-t" style={{ borderColor: '#3d2e7a' }}>
          <button onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={() => onSave(form)} className="btn-primary flex-1">
            <Check className="w-4 h-4" />
            {resource?.id ? 'Guardar' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  const { resources, setResources } = useBusinessHub()
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<Resource> | null>(null)

  const grouped = resources.reduce<Record<string, Resource[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = []
    acc[r.category].push(r)
    return acc
  }, {})

  const handleSave = (form: Partial<Resource>) => {
    if (!form.title || !form.url) return
    if (form.id) {
      setResources(rs => rs.map(r => r.id === form.id ? { ...r, ...form } : r))
    } else {
      setResources(rs => [...rs, {
        ...form as Resource,
        id: Date.now().toString(),
        userId: '1',
        orderIndex: rs.length + 1,
      }])
    }
    setModal(false); setEditing(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este recurso?')) setResources(rs => rs.filter(r => r.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Centro de Recursos</h1>
          <p className="text-sm text-muted">{resources.length} accesos directos configurados</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setModal(true) }}>
          <Plus className="w-4 h-4" />
          Agregar Recurso
        </button>
      </div>

      {/* Grouped resources */}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="font-semibold text-fuxion-200 text-sm">{category}</h2>
            <div className="flex-1 h-px" style={{ background: '#3d2e7a' }} />
            <span className="badge badge-gray text-xs">{items.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map(r => (
              <div key={r.id} className="card-hover p-4 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: 'rgba(124,58,237,0.15)' }}>
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-fuxion-100 text-sm truncate">{r.title}</p>
                  <p className="text-xs text-muted truncate">{r.url}</p>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    className="btn-ghost p-1.5 text-fuxion-400 hover:text-fuxion-300" title="Abrir">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {!r.isDefault && (
                    <>
                      <button onClick={() => { setEditing(r); setModal(true) }}
                        className="btn-ghost p-1.5" title="Editar">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(r.id)}
                        className="btn-ghost p-1.5 hover:text-red-400" title="Eliminar">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Add card */}
            <button
              onClick={() => { setEditing({ category }); setModal(true) }}
              className="card border-dashed p-4 flex items-center justify-center gap-2 text-muted hover:text-fuxion-300 hover:border-fuxion-600/40 transition-all duration-200"
              style={{ borderStyle: 'dashed', minHeight: '80px' }}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Agregar</span>
            </button>
          </div>
        </div>
      ))}

      {modal && (
        <ResourceModal
          resource={editing}
          onClose={() => { setModal(false); setEditing(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
