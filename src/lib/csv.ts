type Cell = string | number | boolean | null | undefined

function escapeCell(value: Cell): string {
  let text = value == null ? '' : String(value)
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** Downloads rows as a UTF-8 CSV (with BOM so Excel keeps non-ASCII names intact). Returns false when there is nothing to export. */
export function downloadCsv(filename: string, headers: string[], rows: Cell[][]): boolean {
  if (rows.length === 0) return false
  const csv = [headers, ...rows].map((r) => r.map(escapeCell).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
  return true
}

/**
 * Exports the table closest to `origin` (the first ancestor that contains a table) exactly as shown,
 * so filters and search already applied on screen carry into the file.
 */
export function downloadNearestTableCsv(origin: Element | null, filename: string): number {
  let node: Element | null = origin
  let table: HTMLTableElement | null = null
  while (node && !table) {
    table = node.querySelector('table')
    node = node.parentElement
  }
  if (!table) return 0
  const text = (cell: Element) => (cell as HTMLElement).innerText.replace(/\s+/g, ' ').trim()
  const headerRow = table.tHead?.rows[0] ?? null
  const headers = headerRow ? Array.from(headerRow.cells).map(text) : []
  const bodyRows = Array.from(table.tBodies)
    .flatMap((b) => Array.from(b.rows))
    .filter((r) => r !== headerRow && r.cells.length > 1)
    .map((r) => Array.from(r.cells).map(text))
  return downloadCsv(filename, headers, bodyRows) ? bodyRows.length : 0
}

export function dateStamp(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
