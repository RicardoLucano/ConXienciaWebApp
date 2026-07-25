import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | null, locale = 'es-MX'): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString(locale, {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export function formatPhone(phone: string): string {
  return phone || '—'
}

export function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export function isOverdue(date: string | null): boolean {
  if (!date) return false
  return new Date(date) < new Date()
}

export function isDueSoon(date: string | null, days = 2): boolean {
  if (!date) return false
  const d = new Date(date)
  const now = new Date()
  const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return diff >= 0 && diff <= days
}

export function whatsappUrl(phone: string, message = ''): string {
  const cleaned = phone.replace(/\D/g, '')
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${cleaned}${message ? `?text=${encoded}` : ''}`
}

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  })
}

export const statusLabels: Record<string, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  archived: 'Archivado',
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Calificado',
  lost: 'Perdido',
  interested: 'Interesado',
  declined: 'Rechazado',
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
}
