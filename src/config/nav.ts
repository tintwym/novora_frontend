import type { User } from '../types/user'

export type NavIcon =
  | 'dashboard'
  | 'employees'
  | 'recruitment'
  | 'onboarding'
  | 'attendance'
  | 'leave'
  | 'disciplinary'
  | 'payroll'
  | 'claims'
  | 'benefits'
  | 'helpdesk'
  | 'performance'
  | 'engagement'
  | 'training'
  | 'learning'
  | 'assets'
  | 'reports'
  | 'settings'

export type NavItem = {
  label: string
  shortLabel?: string
  path: string
  icon: NavIcon
  hrAdminOnly?: boolean
}

export type NavGroup = {
  id: string
  label: string
  items: NavItem[]
}

const NAV_GROUP_DEFS: { id: string; label: string; paths: string[] }[] = [
  { id: 'overview', label: 'Overview', paths: ['/dashboard'] },
  { id: 'people', label: 'People', paths: ['/employees', '/recruitment', '/onboarding'] },
  { id: 'time', label: 'Time', paths: ['/attendance', '/leave'] },
  { id: 'pay', label: 'Pay & Benefits', paths: ['/payroll', '/claims', '/benefits'] },
  { id: 'talent', label: 'Talent', paths: ['/performance', '/training', '/learning', '/engagement'] },
  { id: 'operations', label: 'Operations', paths: ['/disciplinary', '/helpdesk', '/assets'] },
  { id: 'insights', label: 'Insights', paths: ['/reports'] },
]

const SETTINGS_PATH = '/settings'

const ALL_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Employees', path: '/employees', icon: 'employees', hrAdminOnly: true },
  { label: 'Recruitment', path: '/recruitment', icon: 'recruitment', hrAdminOnly: true },
  { label: 'On/Off-boarding', shortLabel: 'Onboarding', path: '/onboarding', icon: 'onboarding', hrAdminOnly: true },
  { label: 'Attendance', path: '/attendance', icon: 'attendance' },
  { label: 'Leave Management', shortLabel: 'Leave', path: '/leave', icon: 'leave' },
  { label: 'Disciplinary Management', shortLabel: 'Disciplinary', path: '/disciplinary', icon: 'disciplinary', hrAdminOnly: true },
  { label: 'Payroll', path: '/payroll', icon: 'payroll', hrAdminOnly: true },
  { label: 'Claims', path: '/claims', icon: 'claims' },
  { label: 'Benefits', path: '/benefits', icon: 'benefits', hrAdminOnly: true },
  { label: 'Helpdesk', path: '/helpdesk', icon: 'helpdesk', hrAdminOnly: true },
  { label: 'Performance', path: '/performance', icon: 'performance', hrAdminOnly: true },
  { label: 'Engagement', path: '/engagement', icon: 'engagement', hrAdminOnly: true },
  { label: 'Training', path: '/training', icon: 'training', hrAdminOnly: true },
  { label: 'Learning', path: '/learning', icon: 'learning', hrAdminOnly: true },
  { label: 'Assets', path: '/assets', icon: 'assets', hrAdminOnly: true },
  { label: 'Reports', path: '/reports', icon: 'reports', hrAdminOnly: true },
  { label: 'Settings', path: SETTINGS_PATH, icon: 'settings' },
]

const SHELL_TITLE_OVERRIDES: Record<string, string> = {
  Employees: 'Employees Management',
  Recruitment: 'Recruitment Management',
  'On/Off-boarding': 'On/Off-boarding Management',
  Attendance: 'Attendance Management',
  'Disciplinary Management': 'Disciplinary Management',
  Payroll: 'Payroll Management',
  Claims: 'Claims Management',
  Benefits: 'Benefits Management',
  Helpdesk: 'Helpdesk & Inquiries Management',
  Performance: 'Performance Management',
  Engagement: 'Engagement Management',
  Training: 'Training Management',
  Learning: 'Learning Management',
  Assets: 'Assets Management',
}

function allowedNavItems(user: User | null): NavItem[] {
  if (user?.canAccessHrAdmin) return ALL_NAV
  return ALL_NAV.filter((item) => !item.hrAdminOnly)
}

export function navLabel(item: NavItem): string {
  return item.shortLabel ?? item.label
}

export function navItemsFor(user: User | null): NavItem[] {
  return allowedNavItems(user)
}

export function navSettingsItem(user: User | null): NavItem | null {
  return allowedNavItems(user).find((item) => item.path === SETTINGS_PATH) ?? null
}

export function navGroupsFor(user: User | null): NavGroup[] {
  const allowedPaths = new Set(
    allowedNavItems(user)
      .filter((item) => item.path !== SETTINGS_PATH)
      .map((item) => item.path),
  )
  const byPath = new Map(ALL_NAV.map((item) => [item.path, item]))

  return NAV_GROUP_DEFS.map((def) => ({
    id: def.id,
    label: def.label,
    items: def.paths
      .map((path) => byPath.get(path))
      .filter((item): item is NavItem => !!item && allowedPaths.has(item.path)),
  })).filter((group) => group.items.length > 0)
}

export function shellTitle(pathname: string): string {
  const item = [...ALL_NAV]
    .sort((a, b) => b.path.length - a.path.length)
    .find((n) => pathname === n.path || pathname.startsWith(`${n.path}/`))
  if (!item) return 'Dashboard'
  return SHELL_TITLE_OVERRIDES[item.label] ?? item.label
}
