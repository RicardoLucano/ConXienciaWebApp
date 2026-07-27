// ===== Core Domain Types =====

export type Status = 'active' | 'inactive' | 'archived'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost'
export type PartnerLeadStatus = 'new' | 'contacted' | 'interested' | 'declined'
export type InterestLevel = 'low' | 'medium' | 'high'
export type NotificationType = 'upcoming_followup' | 'overdue_followup' | 'system'
export type NotificationRef = 'customer' | 'customer_lead' | 'partner' | 'partner_lead'

export interface Customer {
  id: string
  userId: string
  fullName: string
  phone: string
  country: string
  city: string
  notes: string
  interestedProducts: string[]
  purchasedProducts: string[]
  purchaseHistory: PurchaseRecord[]
  lastPurchaseDate: string | null
  nextFollowUp: string | null
  status: Status
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface PurchaseRecord {
  id: string
  product: string
  amount: number
  date: string
}

export interface CustomerLead {
  id: string
  userId: string
  name: string
  phone: string
  interest: string
  notes: string
  followUpDate: string | null
  status: LeadStatus
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Partner {
  id: string
  userId: string
  name: string
  phone: string
  country: string
  notes: string
  currentRank: string
  teamSize: number
  lastContact: string | null
  nextFollowUp: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface PartnerLead {
  id: string
  userId: string
  name: string
  phone: string
  notes: string
  interestLevel: InterestLevel
  followUpDate: string | null
  status: PartnerLeadStatus
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  referenceType: NotificationRef
  referenceId: string
  referenceName: string
  title: string
  body: string
  read: boolean
  archived: boolean
  scheduledAt: string
  createdAt: string
}

export interface Resource {
  id: string
  userId: string
  title: string
  url: string
  icon: string
  category: string
  orderIndex: number
  isDefault?: boolean
}

export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl: string
  role: 'owner' | 'admin' | 'team_leader' | 'member'
}

export interface DashboardStats {
  totalCustomers: number
  newCustomersThisMonth: number
  upcomingFollowUps: number
  missedFollowUps: number
  totalPartners: number
  activePartners: number
  totalCustomerLeads: number
  totalPartnerLeads: number
  conversionRate: number
}
