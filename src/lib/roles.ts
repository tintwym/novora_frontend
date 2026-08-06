import type { SidebarTab } from '@/types'

/** Roles that operate the full HRMS (admin + HR). */
export const FULL_SYSTEM_ROLES = ['SUPER_ADMIN', 'HR_ADMIN', 'HR_MANAGER'] as const

export type PortalId = 'admin' | 'hr' | 'employee'

/** Modules regular employees may use (self-service). */
export const EMPLOYEE_ALLOWED_TABS: readonly SidebarTab[] = [
  'Dashboard',
  'Attendance Management',
  'Leave Management',
  'Claims Management',
  'Benefits Management',
  'Helpdesk & Inquiries Management',
  'Performance Management',
  'Engagement Management',
  'Training Management',
  'Learning Management',
  'Assets Management',
] as const

const TAB_SLUGS: Record<SidebarTab, string> = {
  Dashboard: 'dashboard',
  'Employees Management': 'employees',
  'Recruitment Management': 'recruitment',
  'On/Off-boarding Management': 'onboarding',
  'Attendance Management': 'attendance',
  'Leave Management': 'leave',
  'Disciplinary Management': 'disciplinary',
  'Payroll Management': 'payroll',
  'Claims Management': 'claims',
  'Benefits Management': 'benefits',
  'Helpdesk & Inquiries Management': 'helpdesk',
  'Performance Management': 'performance',
  'Engagement Management': 'engagement',
  'Training Management': 'training',
  'Learning Management': 'learning',
  'Assets Management': 'assets',
  Reports: 'reports',
  Settings: 'settings',
}

const SLUG_TO_TAB = Object.fromEntries(
  Object.entries(TAB_SLUGS).map(([tab, slug]) => [slug, tab]),
) as Record<string, SidebarTab>

export function normalizeRole(role: string | undefined | null): string {
  return (role ?? 'EMPLOYEE').trim().toUpperCase()
}

export function primaryRole(roles: string[] | undefined | null): string {
  return normalizeRole(roles?.[0])
}

/** Super Admin, HR Admin, or HR Manager — full system control. */
export function canManageFullSystem(roles: string[] | undefined | null): boolean {
  const role = primaryRole(roles)
  return (FULL_SYSTEM_ROLES as readonly string[]).includes(role)
}

export function isEmployeeRole(roles: string[] | undefined | null): boolean {
  return !canManageFullSystem(roles)
}

export function canAccessTab(roles: string[] | undefined | null, tab: SidebarTab): boolean {
  if (canManageFullSystem(roles)) return true
  return (EMPLOYEE_ALLOWED_TABS as readonly string[]).includes(tab)
}

export function allowedTabsFor(roles: string[] | undefined | null): SidebarTab[] {
  if (canManageFullSystem(roles)) {
    return [
      'Dashboard',
      'Employees Management',
      'Recruitment Management',
      'On/Off-boarding Management',
      'Attendance Management',
      'Leave Management',
      'Disciplinary Management',
      'Payroll Management',
      'Claims Management',
      'Benefits Management',
      'Helpdesk & Inquiries Management',
      'Performance Management',
      'Engagement Management',
      'Training Management',
      'Learning Management',
      'Assets Management',
      'Reports',
      'Settings',
    ]
  }
  return [...EMPLOYEE_ALLOWED_TABS]
}

export function defaultTabFor(_roles: string[] | undefined | null): SidebarTab {
  return 'Dashboard'
}

/** Home portal after login. */
export function resolvePortal(roles: string[] | undefined | null): PortalId {
  const role = primaryRole(roles)
  if (role === 'SUPER_ADMIN') return 'admin'
  if (role === 'HR_ADMIN' || role === 'HR_MANAGER') return 'hr'
  return 'employee'
}

/** Whether the user may open a given portal prefix. */
export function canAccessPortal(roles: string[] | undefined | null, portal: PortalId): boolean {
  const home = resolvePortal(roles)
  if (portal === home) return true
  // Elevated roles may open lower portals.
  if (home === 'admin') return true
  if (home === 'hr' && portal === 'employee') return true
  return false
}

export function portalHomePath(roles: string[] | undefined | null): string {
  return `/${resolvePortal(roles)}/dashboard`
}

export function tabToSlug(tab: SidebarTab): string {
  return TAB_SLUGS[tab] ?? 'dashboard'
}

export function slugToTab(slug: string | undefined | null): SidebarTab | null {
  if (!slug) return null
  return SLUG_TO_TAB[slug] ?? null
}

export function portalPath(portal: PortalId, tab: SidebarTab): string {
  return `/${portal}/${tabToSlug(tab)}`
}

export function parsePortalId(value: string | undefined): PortalId | null {
  if (value === 'admin' || value === 'hr' || value === 'employee') return value
  return null
}

export function roleDisplayLabel(roles: string[] | undefined | null): string {
  const raw = primaryRole(roles)
  if (raw === 'SUPER_ADMIN') return 'Super Admin'
  if (raw === 'HR_ADMIN') return 'HR Admin'
  if (raw === 'HR_MANAGER') return 'HR Manager'
  if (raw === 'MANAGER') return 'Manager'
  if (raw === 'EMPLOYEE') return 'Employee'
  return raw
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
