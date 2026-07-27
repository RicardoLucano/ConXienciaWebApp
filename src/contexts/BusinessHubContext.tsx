import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Customer, CustomerLead, Partner, PartnerLead, Notification, Resource, DashboardStats } from '../types'
import { useAuth } from './AuthContext'
import {
  customerApi,
  customerLeadApi,
  partnerApi,
  partnerLeadApi,
  notificationApi,
  resourceApi,
  authApi
} from '../lib/api'
import {
  mockCustomers,
  mockCustomerLeads,
  mockPartners,
  mockPartnerLeads,
  mockNotifications,
  mockResources
} from '../data/mockData'
import { isOverdue, isDueSoon } from '../lib/utils'

interface BusinessHubContextType {
  customers: Customer[]
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
  customerLeads: CustomerLead[]
  setCustomerLeads: React.Dispatch<React.SetStateAction<CustomerLead[]>>
  partners: Partner[]
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>
  partnerLeads: PartnerLead[]
  setPartnerLeads: React.Dispatch<React.SetStateAction<PartnerLead[]>>
  notifications: Notification[]
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
  resources: Resource[]
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>
  stats: DashboardStats
  activityData: { day: string; clientes: number; socios: number; prospectos: number }[]
  monthlyData: { month: string; clientes: number; socios: number }[]
}

const BusinessHubContext = createContext<BusinessHubContextType | null>(null)

export function BusinessHubProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  // ─── Profile Synchronization ───────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      authApi.syncProfile().catch((err) => {
        console.warn('API sync profile deferred (backend offline):', err.message)
      })
    }
  }, [isAuthenticated])

  // ─── React Query Collections Fetching ──────────────────────────────────────
  const { data: serverCustomers } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: () => customerApi.list(),
    enabled: isAuthenticated,
    retry: 1,
  })

  const { data: serverCustomerLeads } = useQuery<CustomerLead[]>({
    queryKey: ['customerLeads'],
    queryFn: () => customerLeadApi.list(),
    enabled: isAuthenticated,
    retry: 1,
  })

  const { data: serverPartners } = useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: () => partnerApi.list(),
    enabled: isAuthenticated,
    retry: 1,
  })

  const { data: serverPartnerLeads } = useQuery<PartnerLead[]>({
    queryKey: ['partnerLeads'],
    queryFn: () => partnerLeadApi.list(),
    enabled: isAuthenticated,
    retry: 1,
  })

  const { data: serverNotifications } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list(),
    enabled: isAuthenticated,
    retry: 1,
  })

  const { data: serverResources } = useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: () => resourceApi.list(),
    enabled: isAuthenticated,
    retry: 1,
  })

  // ─── Local State Arrays (Fallbacks) ────────────────────────────────────────
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(() => {
    const raw = localStorage.getItem('fuxion_customers')
    return raw ? JSON.parse(raw) : []
  })

  const [localCustomerLeads, setLocalCustomerLeads] = useState<CustomerLead[]>(() => {
    const raw = localStorage.getItem('fuxion_customer_leads')
    return raw ? JSON.parse(raw) : []
  })

  const [localPartners, setLocalPartners] = useState<Partner[]>(() => {
    const raw = localStorage.getItem('fuxion_partners')
    return raw ? JSON.parse(raw) : []
  })

  const [localPartnerLeads, setLocalPartnerLeads] = useState<PartnerLead[]>(() => {
    const raw = localStorage.getItem('fuxion_partner_leads')
    return raw ? JSON.parse(raw) : []
  })

  const [localNotifications, setLocalNotifications] = useState<Notification[]>(() => {
    const raw = localStorage.getItem('fuxion_notifications')
    return raw ? JSON.parse(raw) : []
  })

  const [localResources, setLocalResources] = useState<Resource[]>(() => {
    const raw = localStorage.getItem('fuxion_resources')
    return raw ? JSON.parse(raw) : []
  })

  // Synchronize local fallback states to localStorage
  useEffect(() => {
    localStorage.setItem('fuxion_customers', JSON.stringify(localCustomers))
  }, [localCustomers])

  useEffect(() => {
    localStorage.setItem('fuxion_customer_leads', JSON.stringify(localCustomerLeads))
  }, [localCustomerLeads])

  useEffect(() => {
    localStorage.setItem('fuxion_partners', JSON.stringify(localPartners))
  }, [localPartners])

  useEffect(() => {
    localStorage.setItem('fuxion_partner_leads', JSON.stringify(localPartnerLeads))
  }, [localPartnerLeads])

  useEffect(() => {
    localStorage.setItem('fuxion_notifications', JSON.stringify(localNotifications))
  }, [localNotifications])

  useEffect(() => {
    localStorage.setItem('fuxion_resources', JSON.stringify(localResources))
  }, [localResources])

  // Resolve active lists (prioritize backend endpoints)
  const customers = serverCustomers || localCustomers
  const customerLeads = serverCustomerLeads || localCustomerLeads
  const partners = serverPartners || localPartners
  const partnerLeads = serverPartnerLeads || localPartnerLeads
  const notifications = serverNotifications || localNotifications
  const resources = serverResources || localResources

  // ─── Mutations hooks ────────────────────────────────────────────────────────
  // Customers
  const createCustomerMutation = useMutation({
    mutationFn: (newC: Partial<Customer>) => customerApi.create(newC),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })
  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) => customerApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })
  const deleteCustomerMutation = useMutation({
    mutationFn: (id: string) => customerApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })

  // Customer Leads
  const createLeadMutation = useMutation({
    mutationFn: (newL: Partial<CustomerLead>) => customerLeadApi.create(newL),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customerLeads'] }),
  })
  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerLead> }) => customerLeadApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customerLeads'] }),
  })
  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => customerLeadApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customerLeads'] }),
  })

  // Partners
  const createPartnerMutation = useMutation({
    mutationFn: (newP: Partial<Partner>) => partnerApi.create(newP),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partners'] }),
  })
  const updatePartnerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Partner> }) => partnerApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partners'] }),
  })
  const deletePartnerMutation = useMutation({
    mutationFn: (id: string) => partnerApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partners'] }),
  })

  // Partner Leads
  const createPartnerLeadMutation = useMutation({
    mutationFn: (newP: Partial<PartnerLead>) => partnerLeadApi.create(newP),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partnerLeads'] }),
  })
  const updatePartnerLeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PartnerLead> }) => partnerLeadApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partnerLeads'] }),
  })
  const deletePartnerLeadMutation = useMutation({
    mutationFn: (id: string) => partnerLeadApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partnerLeads'] }),
  })

  // Notifications mutations
  const readNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationApi.read(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
  const archiveNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationApi.archive(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
  const readAllNotificationsMutation = useMutation({
    mutationFn: () => notificationApi.readAll(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  // Resources mutations
  const createResourceMutation = useMutation({
    mutationFn: (newR: Partial<Resource>) => resourceApi.create(newR),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources'] }),
  })
  const updateResourceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Resource> }) => resourceApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources'] }),
  })
  const deleteResourceMutation = useMutation({
    mutationFn: (id: string) => resourceApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources'] }),
  })

  // ─── State Dispatchers Interceptors ─────────────────────────────────────────
  const setCustomers: React.Dispatch<React.SetStateAction<Customer[]>> = (value) => {
    if (typeof value === 'function') {
      setLocalCustomers((prev) => {
        const next = value(prev)
        if (next.length > prev.length) {
          createCustomerMutation.mutate(next[0])
        } else if (next.length < prev.length) {
          const removed = prev.find((p) => !next.some((n) => n.id === p.id))
          if (removed) deleteCustomerMutation.mutate(removed.id)
        } else {
          next.forEach((n) => {
            const p = prev.find((x) => x.id === n.id)
            if (p && JSON.stringify(p) !== JSON.stringify(n)) {
              updateCustomerMutation.mutate({ id: n.id, data: n })
            }
          })
        }
        return next
      })
    } else {
      setLocalCustomers(value)
    }
  }

  const setCustomerLeads: React.Dispatch<React.SetStateAction<CustomerLead[]>> = (value) => {
    if (typeof value === 'function') {
      setLocalCustomerLeads((prev) => {
        const next = value(prev)
        if (next.length > prev.length) {
          createLeadMutation.mutate(next[0])
        } else if (next.length < prev.length) {
          const removed = prev.find((p) => !next.some((n) => n.id === p.id))
          if (removed) deleteLeadMutation.mutate(removed.id)
        } else {
          next.forEach((n) => {
            const p = prev.find((x) => x.id === n.id)
            if (p && JSON.stringify(p) !== JSON.stringify(n)) {
              updateLeadMutation.mutate({ id: n.id, data: n })
            }
          })
        }
        return next
      })
    } else {
      setLocalCustomerLeads(value)
    }
  }

  const setPartners: React.Dispatch<React.SetStateAction<Partner[]>> = (value) => {
    if (typeof value === 'function') {
      setLocalPartners((prev) => {
        const next = value(prev)
        if (next.length > prev.length) {
          createPartnerMutation.mutate(next[0])
        } else if (next.length < prev.length) {
          const removed = prev.find((p) => !next.some((n) => n.id === p.id))
          if (removed) deletePartnerMutation.mutate(removed.id)
        } else {
          next.forEach((n) => {
            const p = prev.find((x) => x.id === n.id)
            if (p && JSON.stringify(p) !== JSON.stringify(n)) {
              updatePartnerMutation.mutate({ id: n.id, data: n })
            }
          })
        }
        return next
      })
    } else {
      setLocalPartners(value)
    }
  }

  const setPartnerLeads: React.Dispatch<React.SetStateAction<PartnerLead[]>> = (value) => {
    if (typeof value === 'function') {
      setLocalPartnerLeads((prev) => {
        const next = value(prev)
        if (next.length > prev.length) {
          createPartnerLeadMutation.mutate(next[0])
        } else if (next.length < prev.length) {
          const removed = prev.find((p) => !next.some((n) => n.id === p.id))
          if (removed) deletePartnerLeadMutation.mutate(removed.id)
        } else {
          next.forEach((n) => {
            const p = prev.find((x) => x.id === n.id)
            if (p && JSON.stringify(p) !== JSON.stringify(n)) {
              updatePartnerLeadMutation.mutate({ id: n.id, data: n })
            }
          })
        }
        return next
      })
    } else {
      setLocalPartnerLeads(value)
    }
  }

  const setNotifications: React.Dispatch<React.SetStateAction<Notification[]>> = (value) => {
    if (typeof value === 'function') {
      setLocalNotifications((prev) => {
        const next = value(prev)
        if (next.length < prev.length) {
          const removed = prev.find((p) => !next.some((n) => n.id === p.id))
          if (removed) deleteNotificationMutation.mutate(removed.id)
        } else {
          const wasReadAll = prev.some((p) => !p.read) && next.every((n) => n.read)
          if (wasReadAll) {
            readAllNotificationsMutation.mutate()
          } else {
            next.forEach((n) => {
              const p = prev.find((x) => x.id === n.id)
              if (p) {
                if (!p.read && n.read) readNotificationMutation.mutate(n.id)
                if (!p.archived && n.archived) archiveNotificationMutation.mutate(n.id)
              }
            })
          }
        }
        return next
      })
    } else {
      setLocalNotifications(value)
    }
  }

  const setResources: React.Dispatch<React.SetStateAction<Resource[]>> = (value) => {
    if (typeof value === 'function') {
      setLocalResources((prev) => {
        const next = value(prev)
        if (next.length > prev.length) {
          createResourceMutation.mutate(next[0])
        } else if (next.length < prev.length) {
          const removed = prev.find((p) => !next.some((n) => n.id === p.id))
          if (removed) deleteResourceMutation.mutate(removed.id)
        } else {
          next.forEach((n) => {
            const p = prev.find((x) => x.id === n.id)
            if (p && JSON.stringify(p) !== JSON.stringify(n)) {
              updateResourceMutation.mutate({ id: n.id, data: n })
            }
          })
        }
        return next
      })
    } else {
      setLocalResources(value)
    }
  }

  // ─── KPI Dashboard calculations ────────────────────────────────────────────
  const newCustomersThisMonth = customers.filter((c) => {
    if (!c.createdAt) return false
    const d = new Date(c.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const upcomingCustomers = customers.filter((c) => c.nextFollowUp && isDueSoon(c.nextFollowUp) && !isOverdue(c.nextFollowUp)).length
  const upcomingPartner = partners.filter((p) => p.nextFollowUp && isDueSoon(p.nextFollowUp) && !isOverdue(p.nextFollowUp)).length
  const upcomingCustomerLeads = customerLeads.filter((l) => l.followUpDate && isDueSoon(l.followUpDate) && !isOverdue(l.followUpDate)).length
  const upcomingPartnerLeads = partnerLeads.filter((l) => l.followUpDate && isDueSoon(l.followUpDate) && !isOverdue(l.followUpDate)).length
  const upcomingFollowUps = upcomingCustomers + upcomingPartner + upcomingCustomerLeads + upcomingPartnerLeads

  const missedCustomers = customers.filter((c) => c.nextFollowUp && isOverdue(c.nextFollowUp)).length
  const missedPartner = partners.filter((p) => p.nextFollowUp && isOverdue(p.nextFollowUp)).length
  const missedCustomerLeads = customerLeads.filter((l) => l.followUpDate && isOverdue(l.followUpDate)).length
  const missedPartnerLeads = partnerLeads.filter((l) => l.followUpDate && isOverdue(l.followUpDate)).length
  const missedFollowUps = missedCustomers + missedPartner + missedCustomerLeads + missedPartnerLeads

  const activePartners = partners.filter((p) => p.currentRank !== 'Socio' || p.teamSize > 0).length
  const qualifiedLeads = customerLeads.filter((l) => l.status === 'qualified').length
  const conversionRate = customerLeads.length > 0 ? Math.round((qualifiedLeads / customerLeads.length) * 100) : 0

  const stats: DashboardStats = {
    totalCustomers: customers.length,
    newCustomersThisMonth,
    upcomingFollowUps,
    missedFollowUps,
    totalPartners: partners.length,
    activePartners,
    totalCustomerLeads: customerLeads.length,
    totalPartnerLeads: partnerLeads.length,
    conversionRate,
  }

  const activityData = getWeeklyActivity(customers, partners, customerLeads)
  const monthlyData = getMonthlyGrowth(customers, partners)

  return (
    <BusinessHubContext.Provider value={{
      customers, setCustomers,
      customerLeads, setCustomerLeads,
      partners, setPartners,
      partnerLeads, setPartnerLeads,
      notifications, setNotifications,
      resources, setResources,
      stats,
      activityData,
      monthlyData
    }}>
      {children}
    </BusinessHubContext.Provider>
  )
}

function getWeeklyActivity(customers: Customer[], partners: Partner[], customerLeads: CustomerLead[]) {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const orderedDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  
  const counts: Record<string, { clientes: number; socios: number; prospectos: number }> = {}
  orderedDays.forEach(d => {
    counts[d] = { clientes: 0, socios: 0, prospectos: 0 }
  })

  const now = new Date()
  const currentDay = now.getDay()
  const monday = new Date(now)
  const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  const isThisWeek = (dateStr: string) => {
    const d = new Date(dateStr)
    return d >= monday && d <= sunday
  }

  customers.forEach(c => {
    if (c.createdAt && isThisWeek(c.createdAt)) {
      const d = new Date(c.createdAt)
      const dayName = days[d.getDay()]
      if (counts[dayName]) counts[dayName].clientes++
    }
  })

  partners.forEach(p => {
    if (p.createdAt && isThisWeek(p.createdAt)) {
      const d = new Date(p.createdAt)
      const dayName = days[d.getDay()]
      if (counts[dayName]) counts[dayName].socios++
    }
  })

  customerLeads.forEach(l => {
    if (l.createdAt && isThisWeek(l.createdAt)) {
      const d = new Date(l.createdAt)
      const dayName = days[d.getDay()]
      if (counts[dayName]) counts[dayName].prospectos++
    }
  })

  return orderedDays.map(day => ({
    day,
    clientes: counts[day].clientes,
    socios: counts[day].socios,
    prospectos: counts[day].prospectos,
  }))
}

function getMonthlyGrowth(customers: Customer[], partners: Partner[]) {
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const last6Months: { year: number; monthIdx: number; label: string }[] = []
  const now = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    last6Months.push({
      year: d.getFullYear(),
      monthIdx: d.getMonth(),
      label: monthNames[d.getMonth()],
    })
  }

  return last6Months.map(({ year, monthIdx, label }) => {
    const clientes = customers.filter(c => {
      if (!c.createdAt) return false
      const d = new Date(c.createdAt)
      return d.getFullYear() === year && d.getMonth() === monthIdx
    }).length

    const socios = partners.filter(p => {
      if (!p.createdAt) return false
      const d = new Date(p.createdAt)
      return d.getFullYear() === year && d.getMonth() === monthIdx
    }).length

    return {
      month: label,
      clientes,
      socios,
    }
  })
}

export function useBusinessHub() {
  const ctx = useContext(BusinessHubContext)
  if (!ctx) throw new Error('useBusinessHub must be used within BusinessHubProvider')
  return ctx
}
