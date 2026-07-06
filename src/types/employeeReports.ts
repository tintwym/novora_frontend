export type StaffingRegisterEntry = {
  employeeCode: string
  firstName: string
  lastName: string
  email: string
  position: string
  sector: string
  employmentType: string
  hireDate: string
  identityDoc: string
  phone: string
  emergencyContact: string
  dependents: string
  status: string
  avatarColor: string
}

export type DeptDistribution = {
  label: string
  count: number
  fraction: number
  color: string
}

export type ContractSlice = {
  label: string
  count: number
  color: string
}

export type TenureBar = {
  label: string
  count: number
  fraction: number
  color: string
}

export const REPORT_SECTORS = [
  'All Departments + Consolidated',
  'Engineering',
  'Finance',
  'HR',
  'Marketing',
  'Operations',
] as const

export const REPORT_EMPLOYMENT_TYPES = [
  'All Types (Permanent & Temp)',
  'Permanent',
  'Contract',
  'Intern',
  'Part-Time',
] as const

export const DEPT_DISTRIBUTION: DeptDistribution[] = [
  { label: 'Operations Team', count: 4, fraction: 0.31, color: '#f59e0b' },
  { label: 'Engineering Team', count: 3, fraction: 0.23, color: '#3b82f6' },
  { label: 'Finance Team', count: 2, fraction: 0.15, color: '#10b981' },
  { label: 'HR Team', count: 2, fraction: 0.15, color: '#a855f7' },
  { label: 'Marketing Team', count: 2, fraction: 0.15, color: '#e11d48' },
]

export const TENURE_BREAKDOWN: TenureBar[] = [
  { label: '5+ Years Veteran', count: 8, fraction: 0.62, color: '#6d28d9' },
  { label: '3–5 Years Experienced', count: 5, fraction: 0.38, color: '#818cf8' },
]

export const CONTRACT_MIX: ContractSlice[] = [
  { label: 'Permanent', count: 12, color: '#2563eb' },
  { label: 'Contract', count: 1, color: '#8b5cf6' },
  { label: 'Intern', count: 0, color: '#10b981' },
  { label: 'Part-Time', count: 0, color: '#f59e0b' },
]

export function staffingFullName(e: StaffingRegisterEntry): string {
  return `${e.firstName} ${e.lastName}`.trim()
}

export function staffingInitials(e: StaffingRegisterEntry): string {
  const f = e.firstName[0] ?? ''
  const l = e.lastName[0] ?? ''
  return `${f}${l}`.toUpperCase()
}

export function formatHireDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
