export type EmployeeDirectoryRow = {
  id: string
  firstName: string
  lastName: string
  email: string
  departmentName: string
  positionTitle: string
  employeeCode: string
  hireDate: string
  status: 'active' | 'inactive'
}

export function employeeFullName(row: EmployeeDirectoryRow): string {
  return `${row.firstName} ${row.lastName}`.trim()
}

export function employeeInitials(row: EmployeeDirectoryRow): string {
  const parts = employeeFullName(row).split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) {
    const s = parts[0]
    return s.length >= 2 ? s.slice(0, 2).toUpperCase() : s.toUpperCase()
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function avatarColor(name: string): string {
  const palette = ['#0f172a', '#1e40af', '#0d9488', '#059669', '#d97706', '#ef4444']
  let hash = 0
  for (const c of name) hash = (hash + c.charCodeAt(0)) % palette.length
  return palette[hash]
}
