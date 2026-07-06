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
  path: string
  icon: NavIcon
  hrAdminOnly?: boolean
}

const ALL_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Employees', path: '/employees', icon: 'employees', hrAdminOnly: true },
  { label: 'Recruitment', path: '/recruitment', icon: 'recruitment', hrAdminOnly: true },
  { label: 'On/Off-boarding', path: '/onboarding', icon: 'onboarding', hrAdminOnly: true },
  { label: 'Attendance', path: '/attendance', icon: 'attendance' },
  { label: 'Leave Management', path: '/leave', icon: 'leave' },
  { label: 'Disciplinary Management', path: '/disciplinary', icon: 'disciplinary', hrAdminOnly: true },
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
  { label: 'Settings', path: '/settings', icon: 'settings' },
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

export function navItemsFor(user: User | null): NavItem[] {
  if (user?.canAccessHrAdmin) return ALL_NAV
  return ALL_NAV.filter((item) => !item.hrAdminOnly)
}

export function shellTitle(pathname: string): string {
  const item = [...ALL_NAV]
    .sort((a, b) => b.path.length - a.path.length)
    .find((n) => pathname === n.path || pathname.startsWith(`${n.path}/`))
  if (!item) return 'Dashboard'
  return SHELL_TITLE_OVERRIDES[item.label] ?? item.label
}
