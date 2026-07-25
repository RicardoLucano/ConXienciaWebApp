import type { Customer, CustomerLead, Partner, PartnerLead } from '../types'

/**
 * Escapes fields for CSV compliance.
 */
function escapeCSVField(val: any): string {
  if (val === null || val === undefined) return ''
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Trigger download of a string content as a client-side file.
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Exports lists to standard Excel-compatible CSV.
 */
export function exportToCSV(
  data: (Customer | CustomerLead | Partner | PartnerLead)[],
  type: 'customers' | 'customer_leads' | 'partners' | 'partner_leads'
) {
  let headers: string[] = []
  let rows: string[][] = []

  if (type === 'customers') {
    headers = ['Nombre Completo', 'Teléfono', 'País', 'Ciudad', 'Productos de Interés', 'Última Compra', 'Próx Seguimiento', 'Estado', 'Etiquetas', 'Notas']
    rows = (data as Customer[]).map(c => [
      c.fullName,
      c.phone,
      c.country,
      c.city,
      c.interestedProducts.join('; '),
      c.lastPurchaseDate || '',
      c.nextFollowUp || '',
      c.status,
      c.tags.join('; '),
      c.notes
    ])
  } else if (type === 'customer_leads') {
    headers = ['Nombre', 'Teléfono', 'Interés', 'Próx Seguimiento', 'Estado', 'Etiquetas', 'Notas']
    rows = (data as CustomerLead[]).map(l => [
      l.name,
      l.phone,
      l.interest,
      l.followUpDate || '',
      l.status,
      l.tags.join('; '),
      l.notes
    ])
  } else if (type === 'partners') {
    headers = ['Nombre', 'Teléfono', 'País', 'Rango', 'Equipo', 'Último Contacto', 'Próx Seguimiento', 'Etiquetas', 'Notas']
    rows = (data as Partner[]).map(p => [
      p.name,
      p.phone,
      p.country,
      p.currentRank,
      String(p.teamSize),
      p.lastContact || '',
      p.nextFollowUp || '',
      p.tags.join('; '),
      p.notes
    ])
  } else if (type === 'partner_leads') {
    headers = ['Nombre', 'Teléfono', 'Nivel Interés', 'Próx Seguimiento', 'Estado', 'Notas']
    rows = (data as PartnerLead[]).map(l => [
      l.name,
      l.phone,
      l.interestLevel,
      l.followUpDate || '',
      l.status,
      l.notes
    ])
  }

  // Prepend UTF-8 Byte Order Mark (BOM) so Excel reads accents/special characters correctly
  const csvContent = '\uFEFF' + [
    headers.map(escapeCSVField).join(','),
    ...rows.map(row => row.map(escapeCSVField).join(','))
  ].join('\n')

  downloadFile(csvContent, `hub_export_${type}_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;')
}

/**
 * Triggers native browser print dialog (which styles reports as printable document).
 */
export function exportToPDF() {
  window.print()
}
