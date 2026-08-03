import type { SidebarTab } from '@/types'

/** Roles that operate the full HRMS (admin + HR). */
export const FULL_SYSTEM_ROLES = ['SUPER_ADMIN', 'HR_ADMIN', 'HR_MANAGER'] as const

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

export function defaultTabFor(roles: string[] | undefined | null): SidebarTab {
  return 'Dashboard'
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
