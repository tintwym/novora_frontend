import { apiRequest } from './apiClient'
import type { Department, Employee, EmployeeStatus, EmploymentStatus } from '@/types'

export interface EmployeeApiRow {
  id: string
  firstName: string
  lastName: string
  email: string
  departmentId: string | null
  departmentName: string | null
  positionId: string | null
  positionTitle: string | null
  userId: string | null
  accountRoles: string[] | null
  employeeCode: string | null
  hireDate: string | null
  status: string | null
  phone: string | null
  employmentType: string | null
  city: string | null
  country: string | null
  managerName: string | null
}

const AVATAR_COLORS = [
  'bg-blue-600 text-white',
  'bg-indigo-600 text-white',
  'bg-emerald-600 text-white',
  'bg-teal-600 text-white',
  'bg-slate-800 text-white',
  'bg-violet-600 text-white',
  'bg-orange-500 text-white',
  'bg-rose-500 text-white',
] as const

const DEPARTMENTS: readonly Department[] = [
  'Engineering',
  'Finance',
  'HR',
  'Marketing',
  'Operations',
]

function mapDepartment(name: string | null | undefined): Department {
  const raw = (name ?? '').trim()
  const hit = DEPARTMENTS.find((d) => d.toLowerCase() === raw.toLowerCase())
  if (hit) return hit
  if (/human\s*resources?/i.test(raw)) return 'HR'
  return 'Operations'
}

function mapEmploymentStatus(raw: string | null | undefined): EmploymentStatus {
  const v = (raw ?? '').trim().toLowerCase()
  if (v.includes('contract')) return 'Contract'
  if (v.includes('intern')) return 'Intern'
  if (v.includes('part')) return 'Part-time'
  return 'Permanent'
}

function mapStatus(raw: string | null | undefined): EmployeeStatus {
  const v = (raw ?? '').trim().toLowerCase()
  if (v.includes('leave')) return 'On Leave'
  if (v.includes('inactive') || v.includes('terminated') || v.includes('resign')) return 'Inactive'
  return 'Active'
}

function formatHireDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function avatarFor(key: string): string {
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

export function mapEmployeeRow(row: EmployeeApiRow): Employee {
  const name = [row.firstName, row.lastName].filter(Boolean).join(' ').trim() || row.email
  const code = row.employeeCode?.trim() || row.id
  const location = [row.city, row.country].filter(Boolean).join(', ')

  return {
    id: code,
    name,
    department: mapDepartment(row.departmentName),
    position: row.positionTitle?.trim() || '—',
    employmentStatus: mapEmploymentStatus(row.employmentType),
    status: mapStatus(row.status),
    joinDate: formatHireDate(row.hireDate),
    nric: '—',
    mobile: row.phone?.trim() || '—',
    email: row.email,
    address: location || '—',
    avatarColor: avatarFor(code),
    dependents: '—',
    emergencyContact: '—',
    reportsTo: undefined,
  }
}

export async function listEmployees(): Promise<Employee[]> {
  const rows = await apiRequest<EmployeeApiRow[]>('/api/admin/employees', {
    method: 'GET',
    skipCsrf: true,
  })
  return (rows ?? []).map(mapEmployeeRow)
}
