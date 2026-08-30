import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserPlus,
  CalendarCheck2,
  FileMinus,
  ShieldAlert,
  CreditCard,
  Receipt,
  HeartHandshake,
  LifeBuoy,
  TrendingDown,
  Smile,
  GraduationCap,
  BookOpen,
  Package,
  FileBarChart,
  Settings,
  Building2,
  Blocks,
  MapPin,
  GitBranch,
  ShieldCheck,
  CheckSquare,
  Bell,
  Puzzle,
  Shield,
  FileText,
  Contrast,
  Globe,
  Mail,
  Database,
} from 'lucide-react'
import type { SidebarTab } from '@/types'

export type NavItem = {
  name: SidebarTab
  icon: LucideIcon
}

export type NavSection = {
  id: string
  items: NavItem[]
  /** Show a divider line above this section (except the first). */
  divider?: boolean
}

/** Three clean blocks: home, modules, system — no noisy section labels in the rail. */
export const MAIN_NAV_SECTIONS: NavSection[] = [
  {
    id: 'home',
    items: [{ name: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    id: 'modules',
    divider: true,
    items: [
      { name: 'Employees Management', icon: Users },
      { name: 'Recruitment Management', icon: Briefcase },
      { name: 'On/Off-boarding Management', icon: UserPlus },
      { name: 'Attendance Management', icon: CalendarCheck2 },
      { name: 'Leave Management', icon: FileMinus },
      { name: 'Payroll Management', icon: CreditCard },
      { name: 'Claims Management', icon: Receipt },
      { name: 'Benefits Management', icon: HeartHandshake },
      { name: 'Disciplinary Management', icon: ShieldAlert },
      { name: 'Helpdesk & Inquiries Management', icon: LifeBuoy },
      { name: 'Performance Management', icon: TrendingDown },
      { name: 'Training Management', icon: GraduationCap },
      { name: 'Learning Management', icon: BookOpen },
      { name: 'Engagement Management', icon: Smile },
      { name: 'Assets Management', icon: Package },
    ],
  },
  {
    id: 'system',
    divider: true,
    items: [
      { name: 'Reports', icon: FileBarChart },
      { name: 'Settings', icon: Settings },
    ],
  },
]

export type SettingsNavItem = {
  name: string
  icon: LucideIcon
}

export type SettingsNavSection = {
  group: string
  items: SettingsNavItem[]
}

export const SETTINGS_NAV_SECTIONS: SettingsNavSection[] = [
  {
    group: 'Organisation',
    items: [
      { name: 'Company profile', icon: Building2 },
      { name: 'Modules', icon: Blocks },
      { name: 'Branch & location', icon: MapPin },
      { name: 'Department & position', icon: GitBranch },
    ],
  },
  {
    group: 'Access control',
    items: [
      { name: 'Users & accounts', icon: Users },
      { name: 'Roles & permissions', icon: ShieldCheck },
      { name: 'Approval workflow', icon: CheckSquare },
    ],
  },
  {
    group: 'System',
    items: [
      { name: 'Notifications', icon: Bell },
      { name: 'Integrations', icon: Puzzle },
      { name: 'Security', icon: Shield },
      { name: 'Audit log', icon: FileText },
    ],
  },
  {
    group: 'Preferences',
    items: [
      { name: 'Appearance', icon: Contrast },
      { name: 'Language', icon: Globe },
      { name: 'Email templates', icon: Mail },
      { name: 'Backup & data', icon: Database },
    ],
  },
]

export const REPORTS_SUB_NAV = [
  { id: 'centre' as const, label: 'Report centre' },
  { id: 'scheduled' as const, label: 'Scheduled reports', badge: '3' },
  { id: 'builder' as const, label: 'Custom builder' },
]
