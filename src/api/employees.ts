import { apiRequest } from './client'
import { Endpoints } from './endpoints'
import type { EmployeeDirectoryRow } from '../types/employeeDirectory'
import type { StaffingRegisterEntry } from '../types/employeeReports'
import type { DeptKey, OrgChartNode } from '../types/orgChart'

/** Mirror of the backend HrDtos.EmployeeResponse record. */
export type EmployeeApiRecord = {
  id: string
  firstName: string
  lastName: string
  email: string
  departmentId: string | null
  departmentName: string
  positionId: string | null
  positionTitle: string
  employeeCode: string
  hireDate: string | null
  status: string
  phone: string
  employmentType: string
  city: string
  country: string
  managerName: string
}

function str(v: unknown, fallback = ''): string {
  if (v == null) return fallback
  return String(v)
}

function fullName(first: string, last: string): string {
  return `${first} ${last}`.trim()
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) {
    return parts[0].length >= 2 ? parts[0].slice(0, 2).toUpperCase() : parts[0].toUpperCase()
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

/** Format an ISO date (yyyy-MM-dd) as e.g. "12 Mar 2022"; passes through anything else. */
function formatJoinDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const INACTIVE_STATUSES = new Set(['inactive', 'terminated', 'resigned', 'suspended', 'ended'])

function normalizeStatus(status: string): 'active' | 'inactive' {
  return INACTIVE_STATUSES.has(status.trim().toLowerCase()) ? 'inactive' : 'active'
}

/** Backend department names → the 5 palette buckets used by the org chart / reports. */
function departmentToSector(departmentName: string): string {
  const name = departmentName.trim().toLowerCase()
  if (name.includes('human') || name === 'hr') return 'HR'
  if (name.includes('engineer')) return 'Engineering'
  if (name.includes('financ') || name.includes('account')) return 'Finance'
  if (name.includes('market')) return 'Marketing'
  if (name.includes('operation') || name.includes('ops')) return 'Operations'
  return departmentName || 'Operations'
}

function sectorToDeptKey(sector: string): DeptKey {
  switch (sector) {
    case 'Engineering':
      return 'engineering'
    case 'Finance':
      return 'finance'
    case 'HR':
      return 'hr'
    case 'Marketing':
      return 'marketing'
    case 'Operations':
      return 'operations'
    default:
      return 'operations'
  }
}

const AVATAR_PALETTE = ['#0f172a', '#1e40af', '#0d9488', '#059669', '#d97706', '#e11d48', '#7c3aed', '#2563eb']

function avatarColorFor(name: string): string {
  let hash = 0
  for (const c of name) hash = (hash + c.charCodeAt(0)) % AVATAR_PALETTE.length
  return AVATAR_PALETTE[hash]
}

function parseEmployee(row: Record<string, unknown>): EmployeeApiRecord {
  return {
    id: str(row.id),
    firstName: str(row.firstName),
    lastName: str(row.lastName),
    email: str(row.email),
    departmentId: row.departmentId != null ? str(row.departmentId) : null,
    departmentName: str(row.departmentName),
    positionId: row.positionId != null ? str(row.positionId) : null,
    positionTitle: str(row.positionTitle),
    employeeCode: str(row.employeeCode),
    hireDate: row.hireDate != null ? str(row.hireDate) : null,
    status: str(row.status, 'active'),
    phone: str(row.phone),
    employmentType: str(row.employmentType),
    city: str(row.city),
    country: str(row.country),
    managerName: str(row.managerName),
  }
}

/** GET /api/admin/employees — throws ApiError on failure. */
export async function fetchEmployees(): Promise<EmployeeApiRecord[]> {
  const data = await apiRequest<Record<string, unknown>[]>(Endpoints.adminEmployees)
  if (!Array.isArray(data)) return []
  return data.map(parseEmployee)
}

export function toDirectoryRow(e: EmployeeApiRecord): EmployeeDirectoryRow {
  return {
    id: e.id,
    firstName: e.firstName,
    lastName: e.lastName,
    email: e.email,
    // Normalize to the short department buckets the directory filter uses
    // (backend seeds names like "Human Resources"/"Sales").
    departmentName: e.departmentName ? departmentToSector(e.departmentName) : '—',
    positionTitle: e.positionTitle || '—',
    employeeCode: e.employeeCode || '—',
    hireDate: formatJoinDate(e.hireDate),
    status: normalizeStatus(e.status),
  }
}

export function toStaffingEntry(e: EmployeeApiRecord): StaffingRegisterEntry {
  const name = fullName(e.firstName, e.lastName)
  const location = [e.city, e.country].filter(Boolean).join(', ')
  return {
    employeeCode: e.employeeCode || '—',
    firstName: e.firstName,
    lastName: e.lastName,
    email: e.email,
    position: e.positionTitle || '—',
    sector: departmentToSector(e.departmentName),
    employmentType: e.employmentType || 'Permanent',
    hireDate: e.hireDate ?? '',
    identityDoc: '—',
    phone: e.phone || '—',
    emergencyContact: e.managerName ? `Reports to ${e.managerName}` : '—',
    dependents: location ? `Location: ${location}` : '—',
    status: normalizeStatus(e.status) === 'active' ? 'Active' : 'Inactive',
    avatarColor: avatarColorFor(name),
  }
}

/**
 * Directory rows from the live API. Returns `null` (rather than throwing) so callers can
 * gracefully fall back to demo data when the API is unavailable/empty.
 */
export async function fetchEmployeeDirectory(): Promise<EmployeeDirectoryRow[] | null> {
  try {
    const employees = await fetchEmployees()
    if (employees.length === 0) return null
    return employees.map(toDirectoryRow)
  } catch {
    return null
  }
}

export async function fetchStaffingRegister(): Promise<StaffingRegisterEntry[] | null> {
  try {
    const employees = await fetchEmployees()
    if (employees.length === 0) return null
    return employees.map(toStaffingEntry)
  } catch {
    return null
  }
}

export type OrgChartData = {
  root: OrgChartNode
  summary: Record<string, number>
  total: number
  deptCount: number
  deptFilters: string[]
}

type OrgApiNode = {
  employeeId: string
  name: string
  jobTitle: string
  departmentName: string
  managerEmployeeId: string | null
}

function parseOrgNode(row: Record<string, unknown>): OrgApiNode {
  return {
    employeeId: str(row.employeeId),
    name: str(row.name, 'Unnamed'),
    jobTitle: str(row.jobTitle),
    departmentName: str(row.departmentName),
    managerEmployeeId: row.managerEmployeeId != null ? str(row.managerEmployeeId) : null,
  }
}

function countDescendants(node: OrgChartNode): number {
  let total = 0
  for (const child of node.children ?? []) {
    total += 1 + countDescendants(child)
  }
  return total
}

function buildOrgTree(apiNodes: OrgApiNode[]): OrgChartData | null {
  if (apiNodes.length < 2) return null

  const nodeById = new Map<string, OrgChartNode>()
  for (const n of apiNodes) {
    const sector = departmentToSector(n.departmentName)
    nodeById.set(n.employeeId, {
      id: n.employeeId,
      name: n.name,
      role: n.jobTitle || sector,
      initials: initialsFrom(n.name),
      deptKey: sectorToDeptKey(sector),
      deptLabel: sector,
      children: [],
    })
  }

  const roots: OrgChartNode[] = []
  for (const n of apiNodes) {
    const node = nodeById.get(n.employeeId)!
    const parent = n.managerEmployeeId ? nodeById.get(n.managerEmployeeId) : undefined
    if (parent && parent.id !== node.id) {
      parent.children!.push(node)
    } else {
      roots.push(node)
    }
  }

  let root: OrgChartNode
  if (roots.length === 1) {
    root = roots[0]
  } else {
    root = {
      id: 'org-root',
      name: 'Organisation',
      role: 'Company',
      initials: 'ORG',
      deptKey: 'ceo',
      deptLabel: 'Executive',
      children: roots,
    }
  }

  for (const head of root.children ?? []) {
    head.memberCount = countDescendants(head)
  }

  const summary: Record<string, number> = {}
  for (const n of apiNodes) {
    if (root.id !== 'org-root' && n.employeeId === root.id) continue
    const sector = departmentToSector(n.departmentName)
    summary[sector] = (summary[sector] ?? 0) + 1
  }

  const deptLabels = Object.keys(summary)
  return {
    root,
    summary,
    total: apiNodes.length,
    deptCount: deptLabels.length,
    deptFilters: ['All', ...deptLabels],
  }
}

/** GET /api/org-chart mapped into a renderable tree; `null` when there isn't enough data. */
export async function fetchOrgChart(): Promise<OrgChartData | null> {
  try {
    const data = await apiRequest<Record<string, unknown>>(Endpoints.orgChart)
    const rawNodes = (data?.nodes as Record<string, unknown>[] | undefined) ?? []
    if (!Array.isArray(rawNodes)) return null
    return buildOrgTree(rawNodes.map(parseOrgNode))
  } catch {
    return null
  }
}
