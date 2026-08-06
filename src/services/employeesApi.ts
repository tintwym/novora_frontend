import { apiRequest } from './apiClient'
import { formatPersonDisplayName } from '@/lib/personName'
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

export type CreateEmployeePayload = {
  firstName: string
  lastName: string
  email: string
  departmentId: string
  positionId?: string | null
  employeeCode?: string
  hireDate?: string
}

export type UpdateEmployeePayload = {
  firstName: string
  lastName: string
  email: string
  departmentId: string
  positionId?: string | null
  employeeCode?: string
  hireDate?: string
  status?: string
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
  const first = row.firstName?.trim() || ''
  const last = row.lastName?.trim() || ''
  const lastClean = /^employee$/i.test(last) ? '' : last
  const name =
    formatPersonDisplayName([first, lastClean].filter(Boolean).join(' ').trim() || row.email)
  const code = row.employeeCode?.trim() || row.id
  const location = [row.city, row.country].filter(Boolean).join(', ')

  return {
    id: code,
    apiId: row.id,
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
    reportsTo: row.managerName?.trim() || undefined,
    departmentId: row.departmentId ?? undefined,
    positionId: row.positionId ?? undefined,
  }
}

export async function listEmployees(): Promise<Employee[]> {
  const rows = await apiRequest<EmployeeApiRow[]>('/api/admin/employees', {
    method: 'GET',
    skipCsrf: true,
  })
  return (rows ?? []).map(mapEmployeeRow)
}

export async function getEmployee(id: string): Promise<Employee> {
  const row = await apiRequest<EmployeeApiRow>(`/api/admin/employees/${id}`, {
    method: 'GET',
    skipCsrf: true,
  })
  return mapEmployeeRow(row)
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
  const row = await apiRequest<EmployeeApiRow>('/api/admin/employees', {
    method: 'POST',
    body: payload,
  })
  return mapEmployeeRow(row)
}

export async function updateEmployee(id: string, payload: UpdateEmployeePayload): Promise<Employee> {
  const row = await apiRequest<EmployeeApiRow>(`/api/admin/employees/${id}`, {
    method: 'PUT',
    body: payload,
  })
  return mapEmployeeRow(row)
}

export async function deleteEmployee(id: string): Promise<void> {
  await apiRequest<void>(`/api/admin/employees/${id}`, { method: 'DELETE' })
}
