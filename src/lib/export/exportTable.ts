import type { Column, RecordWithValues } from '@/types/app'

export function buildCsv(columns: Column[], records: RecordWithValues[]): string {
  const headers = columns.map((c) => `"${c.name.replace(/"/g, '""')}"`).join(',')
  const rows = records.map((r) =>
    columns.map((c) => {
      const val = r.values[c.id] ?? ''
      return `"${val.replace(/"/g, '""')}"`
    }).join(',')
  )
  return [headers, ...rows].join('\n')
}

export function downloadCsv(listName: string, columns: Column[], records: RecordWithValues[]) {
  const csv = buildCsv(columns, records)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${listName}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function exportToExcel(listName: string, columns: Column[], records: RecordWithValues[]) {
  const XLSX = await import('xlsx')

  const header = columns.map((c) => c.name)
  const rows = records.map((r) => columns.map((c) => r.values[c.id] ?? ''))
  const data = [header, ...rows]

  const ws = XLSX.utils.aoa_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, listName.slice(0, 31))
  XLSX.writeFile(wb, `${listName}.xlsx`)
}
