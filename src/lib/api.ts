import type { Customer, PurchaseRecord, CustomerLead, Partner, PartnerLead, Notification, Resource } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('fuxion_auth_token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errPayload = await response.json().catch(() => ({}))
    throw new Error(errPayload.message || `Request failed with status ${response.status}`)
  }

  return response.json()
}

// ===== API Endpoint Services =====
export const customerApi = {
  list: () => apiRequest<Customer[]>('/api/customers'),
  get: (id: string) => apiRequest<Customer>(`/api/customers/${id}`),
  create: (data: Partial<Customer>) => apiRequest<Customer>('/api/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<Customer>) => apiRequest<Customer>(`/api/customers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<void>(`/api/customers/${id}`, {
    method: 'DELETE',
  }),
  recordPurchase: (id: string, data: { product: string; amount: number; date: string }) =>
    apiRequest<PurchaseRecord>(`/api/customers/${id}/purchases`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

export const customerLeadApi = {
  list: () => apiRequest<CustomerLead[]>('/api/customer-leads'),
  create: (data: Partial<CustomerLead>) => apiRequest<CustomerLead>('/api/customer-leads', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<CustomerLead>) => apiRequest<CustomerLead>(`/api/customer-leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<void>(`/api/customer-leads/${id}`, {
    method: 'DELETE',
  }),
}

export const partnerApi = {
  list: () => apiRequest<Partner[]>('/api/partners'),
  create: (data: Partial<Partner>) => apiRequest<Partner>('/api/partners', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<Partner>) => apiRequest<Partner>(`/api/partners/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<void>(`/api/partners/${id}`, {
    method: 'DELETE',
  }),
}

export const partnerLeadApi = {
  list: () => apiRequest<PartnerLead[]>('/api/partner-leads'),
  create: (data: Partial<PartnerLead>) => apiRequest<PartnerLead>('/api/partner-leads', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<PartnerLead>) => apiRequest<PartnerLead>(`/api/partner-leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<void>(`/api/partner-leads/${id}`, {
    method: 'DELETE',
  }),
}

export const notificationApi = {
  list: () => apiRequest<Notification[]>('/api/notifications'),
  read: (id: string) => apiRequest<Notification>(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  }),
  archive: (id: string) => apiRequest<Notification>(`/api/notifications/${id}/archive`, {
    method: 'PATCH',
  }),
  readAll: () => apiRequest<void>('/api/notifications/read-all', {
    method: 'POST',
  }),
  delete: (id: string) => apiRequest<void>(`/api/notifications/${id}`, {
    method: 'DELETE',
  }),
}

export const resourceApi = {
  list: () => apiRequest<Resource[]>('/api/resources'),
  create: (data: Partial<Resource>) => apiRequest<Resource>('/api/resources', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<Resource>) => apiRequest<Resource>(`/api/resources/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<void>(`/api/resources/${id}`, {
    method: 'DELETE',
  }),
}

export const authApi = {
  syncProfile: () => apiRequest('/auth/login', {
    method: 'POST',
  }),
}

