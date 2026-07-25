import { useState } from 'react'
import { Plus, Search, MessageCircle, Copy, Phone, Filter, Pencil, Trash2, Archive, X, Check } from 'lucide-react'
import type { Customer, Status } from '../types'
import { formatDate, isOverdue, isDueSoon, whatsappUrl, copyToClipboard, statusLabels, getInitials } from '../lib/utils'
import { cn } from '../lib/utils'
import { useBusinessHub } from '../contexts/BusinessHubContext'

const statusColors: Record<Status, string> = {
  active: 'badge-green',
  inactive: 'badge-gray',
  archived: 'badge-amber',
}

type FollowUpFilter = 'all' | 'upcoming' | 'overdue' | 'none'

function CustomerModal({
  customer,
  onClose,
  onSave,
}: {
  customer: Partial<Customer> | null
  onClose: () => void
  onSave: (c: Partial<Customer>) => void
}) {
  const [form, setForm] = useState<Partial<Customer>>(customer ?? {
    fullName: '', phone: '', country: '', city: '', notes: '',
    interestedProducts: [], purchasedProducts: [], status: 'active',
    tags: [], nextFollowUp: '', purchaseHistory: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newPurchase, setNewPurchase] = useState({ product: '', amount: '', date: '' })

  const set = (k: keyof Customer, v: any) => setForm(f => ({ ...f, [k]: v }))

  const handleValidationAndSave = () => {
    const newErrors: Record<string, string> = {}
    if (!form.fullName?.trim()) {
      newErrors.fullName = 'El nombre completo es requerido'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSave(form)
  }

  const handleAddPurchase = () => {
    if (!newPurchase.product.trim() || !newPurchase.amount || !newPurchase.date) return
    const record = {
      id: Date.now().toString(),
      product: newPurchase.product.trim(),
      amount: parseFloat(newPurchase.amount),
      date: newPurchase.date,
    }
    const updatedHistory = [...(form.purchaseHistory || []), record]
    const updatedPurchased = Array.from(new Set([...(form.purchasedProducts || []), record.product]))
    
    setForm(f => ({
      ...f,
      purchaseHistory: updatedHistory,
      purchasedProducts: updatedPurchased,
      lastPurchaseDate: record.date,
    }))
    setNewPurchase({ product: '', amount: '', date: '' })
  }

  const handleRemovePurchase = (pId: string) => {
    const updatedHistory = (form.purchaseHistory || []).filter(p => p.id !== pId)
    const updatedPurchased = Array.from(new Set(updatedHistory.map(h => h.product)))
    const lastP = updatedHistory.length > 0 ? updatedHistory[updatedHistory.length - 1].date : null

    setForm(f => ({
      ...f,
      purchaseHistory: updatedHistory,
      purchasedProducts: updatedPurchased,
      lastPurchaseDate: lastP,
    }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-lg text-white">
            {customer?.id ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h3>
          <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="input-label">Nombre completo *</label>
              <input
                className={cn('input', errors.fullName && 'border-red-500 focus:ring-red-500/50 focus:border-red-500')}
                value={form.fullName ?? ''}
                onChange={e => {
                  set('fullName', e.target.value)
                  if (errors.fullName) setErrors(errs => ({ ...errs, fullName: '' }))
                }}
                placeholder="Ej: María González López"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="input-label">Teléfono</label>
              <input className="input" value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} placeholder="+52 55 1234 5678" />
            </div>
            <div>
              <label className="input-label">País</label>
              <input className="input" value={form.country ?? ''} onChange={e => set('country', e.target.value)} placeholder="México" />
            </div>
            <div>
              <label className="input-label">Ciudad</label>
              <input className="input" value={form.city ?? ''} onChange={e => set('city', e.target.value)} placeholder="Ciudad de México" />
            </div>
            <div>
              <label className="input-label">Próximo Seguimiento</label>
              <input type="date" className="input" value={form.nextFollowUp ?? ''}
                onChange={e => set('nextFollowUp', e.target.value)} />
            </div>
            <div>
              <label className="input-label">Estado</label>
              <select className="input" value={form.status ?? 'active'} onChange={e => set('status', e.target.value as Status)}>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
            <div>
              <label className="input-label">Última compra</label>
              <input type="date" className="input" value={form.lastPurchaseDate ?? ''} disabled
                placeholder="Calculado automáticamente" />
            </div>
            <div className="col-span-2">
              <label className="input-label">Notas</label>
              <textarea className="input resize-none" rows={3} value={form.notes ?? ''}
                onChange={e => set('notes', e.target.value)} placeholder="Observaciones sobre el cliente..." />
            </div>
            <div className="col-span-2">
              <label className="input-label">Productos de interés (separados por coma)</label>
              <input className="input" value={(form.interestedProducts ?? []).join(', ')}
                onChange={e => set('interestedProducts', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="Xango, XFuel, Ade" />
            </div>
            <div className="col-span-2">
              <label className="input-label">Etiquetas (separadas por coma)</label>
              <input className="input" value={(form.tags ?? []).join(', ')}
                onChange={e => set('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="VIP, Energía, Referido" />
            </div>

            {/* Purchase History Management Sub-form */}
            <div className="col-span-2 border-t pt-4 mt-2" style={{ borderColor: '#3d2e7a' }}>
              <h4 className="text-sm font-semibold text-fuxion-100 mb-2">Historial de Compras</h4>
              
              {/* Existing Purchases List */}
              <div className="space-y-1.5 mb-3 max-h-[160px] overflow-y-auto">
                {(form.purchaseHistory || []).length === 0 ? (
                  <p className="text-xs text-muted">Sin compras registradas.</p>
                ) : (
                  (form.purchaseHistory || []).map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-surface-2/40 text-xs">
                      <span>🛍️ <strong>{p.product}</strong> · ${p.amount} · {formatDate(p.date)}</span>
                      <button onClick={() => handleRemovePurchase(p.id)} className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Log new purchase form */}
              <div className="grid grid-cols-3 gap-2 items-end bg-surface-2/20 p-3 rounded-xl border" style={{ borderColor: '#2d1e5a' }}>
                <div>
                  <label className="text-[10px] text-muted block mb-1">Producto</label>
                  <input className="input py-1.5 px-2 text-xs" value={newPurchase.product}
                    onChange={e => setNewPurchase(p => ({ ...p, product: e.target.value }))} placeholder="Xango" />
                </div>
                <div>
                  <label className="text-[10px] text-muted block mb-1">Monto ($)</label>
                  <input type="number" className="input py-1.5 px-2 text-xs" value={newPurchase.amount}
                    onChange={e => setNewPurchase(p => ({ ...p, amount: e.target.value }))} placeholder="1200" />
                </div>
                <div>
                  <label className="text-[10px] text-muted block mb-1">Fecha</label>
                  <input type="date" className="input py-1.5 px-2 text-xs" value={newPurchase.date}
                    onChange={e => setNewPurchase(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div className="col-span-3 text-right">
                  <button onClick={handleAddPurchase} className="btn-secondary py-1 px-3 text-xs flex items-center gap-1 ml-auto">
                    <Plus className="w-3 h-3" /> Registrar Compra
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-5 pt-5 border-t" style={{ borderColor: '#3d2e7a' }}>
          <button onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={handleValidationAndSave} className="btn-primary flex-1">
            <Check className="w-4 h-4" />
            {customer?.id ? 'Guardar cambios' : 'Crear cliente'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CustomersPage() {
  const { customers, setCustomers } = useBusinessHub()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all')
  const [followUpFilter, setFollowUpFilter] = useState<FollowUpFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (phone: string, id: string) => {
    copyToClipboard(phone)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleSave = (form: Partial<Customer>) => {
    if (!form.fullName) return
    if (form.id) {
      setCustomers(cs => cs.map(c => c.id === form.id ? { ...c, ...form, updatedAt: new Date().toISOString() } : c))
    } else {
      const newC: Customer = {
        ...form as Customer,
        id: Date.now().toString(),
        userId: '1',
        purchaseHistory: [],
        purchasedProducts: form.purchasedProducts ?? [],
        interestedProducts: form.interestedProducts ?? [],
        tags: form.tags ?? [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setCustomers(cs => [newC, ...cs])
    }
    setModalOpen(false)
    setEditingCustomer(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este cliente?')) {
      setCustomers(cs => cs.filter(c => c.id !== id))
    }
  }

  const filtered = customers.filter(c => {
    const matchSearch = search === '' ||
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.country.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    let matchFollowUp = true
    if (followUpFilter === 'overdue') matchFollowUp = isOverdue(c.nextFollowUp)
    if (followUpFilter === 'upcoming') matchFollowUp = isDueSoon(c.nextFollowUp)
    if (followUpFilter === 'none') matchFollowUp = !c.nextFollowUp
    return matchSearch && matchStatus && matchFollowUp
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Clientes CRM</h1>
          <p className="text-sm text-muted">{filtered.length} clientes encontrados</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingCustomer(null); setModalOpen(true) }}>
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            className="input pl-9"
            placeholder="Buscar por nombre, teléfono, país..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted flex-shrink-0" />
          <select className="input w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
            <option value="archived">Archivados</option>
          </select>
          <select className="input w-44" value={followUpFilter} onChange={e => setFollowUpFilter(e.target.value as any)}>
            <option value="all">Todos los seguimientos</option>
            <option value="overdue">Vencidos</option>
            <option value="upcoming">Próximos (2 días)</option>
            <option value="none">Sin seguimiento</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th className="hidden md:table-cell">País / Ciudad</th>
              <th className="hidden lg:table-cell">Último pedido</th>
              <th>Próx. Seguimiento</th>
              <th>Estado</th>
              <th className="hidden md:table-cell">Etiquetas</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const overdue = isOverdue(c.nextFollowUp)
              const soon = isDueSoon(c.nextFollowUp)
              return (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar w-8 h-8 text-xs flex-shrink-0">
                        {getInitials(c.fullName)}
                      </div>
                      <div>
                        <p className="font-medium text-fuxion-100 whitespace-nowrap">{c.fullName}</p>
                        <p className="text-xs text-muted">{c.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className="text-fuxion-200">{c.country}</span>
                    {c.city && <span className="text-muted text-xs">, {c.city}</span>}
                  </td>
                  <td className="hidden lg:table-cell text-fuxion-200">
                    {formatDate(c.lastPurchaseDate)}
                  </td>
                  <td>
                    <span className={cn(
                      'text-sm font-medium whitespace-nowrap',
                      overdue ? 'text-red-400' : soon ? 'text-amber-400' : 'text-fuxion-200'
                    )}>
                      {overdue && '⚠️ '}{soon && !overdue && '📅 '}
                      {formatDate(c.nextFollowUp)}
                    </span>
                  </td>
                  <td>
                    <span className={cn('badge', statusColors[c.status])}>
                      {statusLabels[c.status]}
                    </span>
                  </td>
                  <td className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="badge-purple badge text-xs">{tag}</span>
                      ))}
                      {c.tags.length > 2 && <span className="text-xs text-muted">+{c.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      {/* WhatsApp */}
                      <a href={whatsappUrl(c.phone)} target="_blank" rel="noopener noreferrer"
                        className="btn-ghost p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                        title="WhatsApp">
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      {/* Copy phone */}
                      <button onClick={() => handleCopy(c.phone, c.id)}
                        className="btn-ghost p-1.5 hover:text-fuxion-300" title="Copiar teléfono">
                        {copiedId === c.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      {/* Edit */}
                      <button onClick={() => { setEditingCustomer(c); setModalOpen(true) }}
                        className="btn-ghost p-1.5 hover:text-fuxion-300" title="Editar">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {/* Archive */}
                      <button onClick={() => setCustomers(cs => cs.map(cc => cc.id === c.id ? { ...cc, status: 'archived' } : cc))}
                        className="btn-ghost p-1.5 hover:text-amber-400" title="Archivar">
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      {/* Delete */}
                      <button onClick={() => handleDelete(c.id)}
                        className="btn-ghost p-1.5 hover:text-red-400" title="Eliminar">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted">
                  No se encontraron clientes con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <CustomerModal
          customer={editingCustomer}
          onClose={() => { setModalOpen(false); setEditingCustomer(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
