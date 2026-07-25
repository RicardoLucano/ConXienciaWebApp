import type { Customer, CustomerLead, Partner, PartnerLead, Notification, Resource, DashboardStats, User } from '../types'

export const mockUser: User = {
  id: '1',
  email: 'riccardo@fuxion.com',
  fullName: 'Riccardo FuXion',
  avatarUrl: '',
  role: 'owner',
}

export const mockCustomers: Customer[] = [
  {
    id: '1', userId: '1',
    fullName: 'María González López',
    phone: '+52 55 1234 5678', country: 'México', city: 'Ciudad de México',
    notes: 'Cliente muy activa, le interesan los productos de energía.',
    interestedProducts: ['Xango', 'Xtra'], purchasedProducts: ['Xango'],
    purchaseHistory: [
      { id: 'p1', product: 'Xango', amount: 1200, date: '2025-06-15' },
      { id: 'p2', product: 'Xango', amount: 1200, date: '2025-04-10' },
    ],
    lastPurchaseDate: '2025-06-15', nextFollowUp: '2026-07-25',
    status: 'active', tags: ['VIP', 'Energía'],
    createdAt: '2025-01-10T10:00:00Z', updatedAt: '2026-07-01T10:00:00Z',
  },
  {
    id: '2', userId: '1',
    fullName: 'Carlos Ramírez Torres',
    phone: '+52 81 9876 5432', country: 'México', city: 'Monterrey',
    notes: 'Interesado en el negocio también.',
    interestedProducts: ['XFuel', 'Ade'], purchasedProducts: ['XFuel', 'Ade'],
    purchaseHistory: [
      { id: 'p3', product: 'XFuel', amount: 850, date: '2025-07-01' },
    ],
    lastPurchaseDate: '2025-07-01', nextFollowUp: '2026-07-22',
    status: 'active', tags: ['Potencial Socio'],
    createdAt: '2025-03-15T10:00:00Z', updatedAt: '2026-07-10T10:00:00Z',
  },
  {
    id: '3', userId: '1',
    fullName: 'Ana Patricia Morales',
    phone: '+502 5555 1234', country: 'Guatemala', city: 'Guatemala City',
    notes: 'Cliente nueva, en proceso de fidelización.',
    interestedProducts: ['Xango'], purchasedProducts: [],
    purchaseHistory: [],
    lastPurchaseDate: null, nextFollowUp: '2026-07-23',
    status: 'active', tags: ['Nueva'],
    createdAt: '2026-06-01T10:00:00Z', updatedAt: '2026-07-05T10:00:00Z',
  },
  {
    id: '4', userId: '1',
    fullName: 'Jorge Luis Hernández',
    phone: '+57 310 555 7890', country: 'Colombia', city: 'Bogotá',
    notes: 'Necesita seguimiento urgente, lleva 45 días sin comprar.',
    interestedProducts: ['Xtra'], purchasedProducts: ['Xtra'],
    purchaseHistory: [
      { id: 'p4', product: 'Xtra', amount: 650, date: '2025-05-20' },
    ],
    lastPurchaseDate: '2025-05-20', nextFollowUp: '2026-07-15',
    status: 'active', tags: ['Reactivar'],
    createdAt: '2025-02-28T10:00:00Z', updatedAt: '2026-05-20T10:00:00Z',
  },
  {
    id: '5', userId: '1',
    fullName: 'Lucía Fernández Vega',
    phone: '+51 984 123 456', country: 'Perú', city: 'Lima',
    notes: 'Clienta fiel, siempre compra el paquete mensual.',
    interestedProducts: ['Xango', 'XFuel', 'Ade'],
    purchasedProducts: ['Xango', 'XFuel', 'Ade'],
    purchaseHistory: [
      { id: 'p5', product: 'Xango', amount: 1200, date: '2026-07-01' },
      { id: 'p6', product: 'XFuel', amount: 850, date: '2026-06-01' },
    ],
    lastPurchaseDate: '2026-07-01', nextFollowUp: '2026-08-01',
    status: 'active', tags: ['VIP', 'Fiel'],
    createdAt: '2024-11-01T10:00:00Z', updatedAt: '2026-07-01T10:00:00Z',
  },
  {
    id: '6', userId: '1',
    fullName: 'Roberto Díaz Castro',
    phone: '+56 9 8765 4321', country: 'Chile', city: 'Santiago',
    notes: 'Se dio de baja temporalmente.',
    interestedProducts: [], purchasedProducts: ['Xango'],
    purchaseHistory: [
      { id: 'p7', product: 'Xango', amount: 1200, date: '2024-12-01' },
    ],
    lastPurchaseDate: '2024-12-01', nextFollowUp: null,
    status: 'inactive', tags: [],
    createdAt: '2024-10-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z',
  },
]

export const mockCustomerLeads: CustomerLead[] = [
  {
    id: '1', userId: '1', name: 'Sofía Martínez',
    phone: '+52 33 8888 1234', interest: 'Pérdida de peso y energía',
    notes: 'Contactada por Instagram. Muy interesada en Xango.',
    followUpDate: '2026-07-22', status: 'contacted', tags: ['Instagram', 'Peso'],
    createdAt: '2026-07-18T10:00:00Z', updatedAt: '2026-07-18T10:00:00Z',
  },
  {
    id: '2', userId: '1', name: 'Andrés Castillo',
    phone: '+57 315 234 5678', interest: 'Negocio y emprendimiento',
    notes: 'Referido por Carlos Ramírez. Quiere saber del plan de negocio.',
    followUpDate: '2026-07-24', status: 'new', tags: ['Referido'],
    createdAt: '2026-07-20T10:00:00Z', updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: '3', userId: '1', name: 'Patricia Rojas',
    phone: '+502 4444 9999', interest: 'Antienvejecimiento',
    notes: 'Vista en evento de salud. Pidió más información.',
    followUpDate: '2026-07-19', status: 'qualified', tags: ['Evento', 'Anti-aging'],
    createdAt: '2026-07-15T10:00:00Z', updatedAt: '2026-07-17T10:00:00Z',
  },
  {
    id: '4', userId: '1', name: 'Manuel Vásquez',
    phone: '+51 999 876 543', interest: 'Deporte y rendimiento',
    notes: 'No respondió el segundo mensaje.',
    followUpDate: '2026-07-10', status: 'lost', tags: ['Deporte'],
    createdAt: '2026-07-01T10:00:00Z', updatedAt: '2026-07-12T10:00:00Z',
  },
]

export const mockPartners: Partner[] = [
  {
    id: '1', userId: '1', name: 'Alexandra Fuentes',
    phone: '+52 55 7777 3333', country: 'México', notes: 'Socia estrella, equipo muy activo.',
    currentRank: 'Diamante', teamSize: 45,
    lastContact: '2026-07-18', nextFollowUp: '2026-07-25',
    tags: ['Líder', 'Top 10'],
    createdAt: '2024-06-01T10:00:00Z', updatedAt: '2026-07-18T10:00:00Z',
  },
  {
    id: '2', userId: '1', name: 'Daniel Ortega Vargas',
    phone: '+57 318 444 5555', country: 'Colombia', notes: 'En crecimiento acelerado.',
    currentRank: 'Zafiro', teamSize: 18,
    lastContact: '2026-07-15', nextFollowUp: '2026-07-22',
    tags: ['En crecimiento'],
    createdAt: '2025-01-15T10:00:00Z', updatedAt: '2026-07-15T10:00:00Z',
  },
  {
    id: '3', userId: '1', name: 'Valentina Cruz Mendoza',
    phone: '+56 9 6543 2109', country: 'Chile', notes: 'Necesita más soporte para activar equipo.',
    currentRank: 'Rubí', teamSize: 7,
    lastContact: '2026-07-05', nextFollowUp: '2026-07-21',
    tags: ['Soporte'],
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2026-07-05T10:00:00Z',
  },
  {
    id: '4', userId: '1', name: 'Fernando Salinas',
    phone: '+51 987 654 321', country: 'Perú', notes: 'Nuevo socio, recién comenzó.',
    currentRank: 'Socio', teamSize: 2,
    lastContact: '2026-07-20', nextFollowUp: '2026-07-28',
    tags: ['Nuevo'],
    createdAt: '2026-07-01T10:00:00Z', updatedAt: '2026-07-20T10:00:00Z',
  },
]

export const mockPartnerLeads: PartnerLead[] = [
  {
    id: '1', userId: '1', name: 'Isabella Romero',
    phone: '+52 81 2222 9999', notes: 'Empresaria, muy curiosa del modelo de negocio.',
    interestLevel: 'high', followUpDate: '2026-07-22', status: 'interested',
    createdAt: '2026-07-18T10:00:00Z', updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: '2', userId: '1', name: 'Miguel Torres Lira',
    phone: '+57 312 000 1111', notes: 'Vendedor con red de contactos amplia.',
    interestLevel: 'medium', followUpDate: '2026-07-25', status: 'contacted',
    createdAt: '2026-07-15T10:00:00Z', updatedAt: '2026-07-17T10:00:00Z',
  },
  {
    id: '3', userId: '1', name: 'Carmen Delgado',
    phone: '+502 5678 9012', notes: 'Maestra, interesada en ingreso extra.',
    interestLevel: 'low', followUpDate: '2026-08-01', status: 'new',
    createdAt: '2026-07-20T10:00:00Z', updatedAt: '2026-07-20T10:00:00Z',
  },
]

export const mockNotifications: Notification[] = [
  {
    id: '1', userId: '1',
    type: 'overdue_followup', referenceType: 'customer',
    referenceId: '4', referenceName: 'Jorge Luis Hernández',
    title: '⚠️ Seguimiento vencido',
    body: 'El seguimiento de Jorge Luis Hernández venció el 15 de julio.',
    read: false, archived: false,
    scheduledAt: '2026-07-15T09:00:00Z', createdAt: '2026-07-15T09:00:00Z',
  },
  {
    id: '2', userId: '1',
    type: 'upcoming_followup', referenceType: 'customer',
    referenceId: '2', referenceName: 'Carlos Ramírez Torres',
    title: '📅 Seguimiento próximo',
    body: 'Tienes un seguimiento pendiente con Carlos Ramírez Torres en 2 días.',
    read: false, archived: false,
    scheduledAt: '2026-07-20T09:00:00Z', createdAt: '2026-07-20T09:00:00Z',
  },
  {
    id: '3', userId: '1',
    type: 'upcoming_followup', referenceType: 'customer_lead',
    referenceId: '1', referenceName: 'Sofía Martínez',
    title: '📅 Seguimiento próximo — Prospecto',
    body: 'Recuerda contactar a Sofía Martínez mañana.',
    read: false, archived: false,
    scheduledAt: '2026-07-21T09:00:00Z', createdAt: '2026-07-21T09:00:00Z',
  },
  {
    id: '4', userId: '1',
    type: 'upcoming_followup', referenceType: 'partner',
    referenceId: '3', referenceName: 'Valentina Cruz Mendoza',
    title: '📅 Seguimiento con Socia',
    body: 'Valentina Cruz Mendoza necesita soporte hoy.',
    read: true, archived: false,
    scheduledAt: '2026-07-21T10:00:00Z', createdAt: '2026-07-21T10:00:00Z',
  },
  {
    id: '5', userId: '1',
    type: 'system', referenceType: 'customer',
    referenceId: '', referenceName: '',
    title: '🚀 Bienvenido a FuXion Business Hub',
    body: 'Tu cuenta está lista. Empieza agregando tus clientes y prospectos.',
    read: true, archived: false,
    scheduledAt: '2026-07-01T08:00:00Z', createdAt: '2026-07-01T08:00:00Z',
  },
]

export const mockResources: Resource[] = [
  { id: '1', userId: '1', title: 'OFFIX Login', url: 'https://offix.fuxionlatino.com', icon: '🏢', category: 'Corporativo', orderIndex: 1 },
  { id: '2', userId: '1', title: 'Portal Cliente Preferido', url: 'https://fuxionlatino.com', icon: '⭐', category: 'Corporativo', orderIndex: 2 },
  { id: '3', userId: '1', title: 'Xion Academy', url: 'https://academy.fuxionlatino.com', icon: '🎓', category: 'Capacitación', orderIndex: 3 },
  { id: '4', userId: '1', title: 'Aware FuXion', url: 'https://aware.fuxionlatino.com', icon: '🌐', category: 'Capacitación', orderIndex: 4 },
  { id: '5', userId: '1', title: 'Soporte WhatsApp', url: 'https://wa.me/5215555555555', icon: '💬', category: 'Soporte', orderIndex: 5 },
  { id: '6', userId: '1', title: 'Documentación Interna', url: '#', icon: '📄', category: 'Documentos', orderIndex: 6 },
  { id: '7', userId: '1', title: 'Catálogo de Productos', url: 'https://fuxionlatino.com/products', icon: '🛍️', category: 'Productos', orderIndex: 7 },
  { id: '8', userId: '1', title: 'Plan de Compensación', url: '#', icon: '💰', category: 'Negocio', orderIndex: 8 },
]

export const mockStats: DashboardStats = {
  totalCustomers: 6,
  newCustomersThisMonth: 1,
  upcomingFollowUps: 3,
  missedFollowUps: 1,
  totalPartners: 4,
  activePartners: 3,
  totalCustomerLeads: 4,
  totalPartnerLeads: 3,
  conversionRate: 25,
}

export const mockActivityData = [
  { day: 'Lun', clientes: 2, socios: 1, prospectos: 3 },
  { day: 'Mar', clientes: 1, socios: 2, prospectos: 1 },
  { day: 'Mié', clientes: 3, socios: 0, prospectos: 2 },
  { day: 'Jue', clientes: 2, socios: 1, prospectos: 4 },
  { day: 'Vie', clientes: 4, socios: 2, prospectos: 2 },
  { day: 'Sáb', clientes: 1, socios: 0, prospectos: 1 },
  { day: 'Dom', clientes: 0, socios: 0, prospectos: 0 },
]

export const mockMonthlyData = [
  { month: 'Feb', clientes: 3, socios: 1 },
  { month: 'Mar', clientes: 5, socios: 2 },
  { month: 'Abr', clientes: 4, socios: 1 },
  { month: 'May', clientes: 7, socios: 3 },
  { month: 'Jun', clientes: 6, socios: 2 },
  { month: 'Jul', clientes: 8, socios: 3 },
]
