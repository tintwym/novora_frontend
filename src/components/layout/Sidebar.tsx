import { Fragment, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  TrendingDown,
  Smile,
  GraduationCap,
  BookOpen,
  Package,
  FileBarChart,
  Settings,
  ChevronDown,
  HelpCircle,
  LifeBuoy,
  LayoutGrid,
  Clock,
  SlidersHorizontal,
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
  Search,
  type LucideIcon,
} from 'lucide-react'
import { navItemsFor } from '../../config/nav'
import { useAuth } from '../../auth/AuthContext'
import { useShellNav } from '../../context/ShellNavContext'
import { NovoraBrand, NovoraLogoMark } from '../brand/NovoraLogo'
import type { ReportsSubTab } from '../../context/ShellNavContext'
import { settingsSectionsFor } from '../../data/mockSettings'

type SidebarProps = {
  collapsed?: boolean
}

type MainNavItem = {
  path: string
  name: string
  icon: LucideIcon
}

const MAIN_NAV: MainNavItem[] = [
  { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/employees', name: 'Employees Management', icon: Users },
  { path: '/recruitment', name: 'Recruitment Management', icon: Briefcase },
  { path: '/onboarding', name: 'On/Off-boarding Management', icon: UserPlus },
  { path: '/attendance', name: 'Attendance Management', icon: CalendarCheck2 },
  { path: '/leave', name: 'Leave Management', icon: FileMinus },
  { path: '/disciplinary', name: 'Disciplinary Management', icon: ShieldAlert },
  { path: '/payroll', name: 'Payroll Management', icon: CreditCard },
  { path: '/claims', name: 'Claims Management', icon: Receipt },
  { path: '/benefits', name: 'Benefits Management', icon: HeartHandshake },
  { path: '/helpdesk', name: 'Helpdesk & Inquiries Management', icon: LifeBuoy },
  { path: '/performance', name: 'Performance Management', icon: TrendingDown },
  { path: '/engagement', name: 'Engagement Management', icon: Smile },
  { path: '/training', name: 'Training Management', icon: GraduationCap },
  { path: '/learning', name: 'Learning Management', icon: BookOpen },
  { path: '/assets', name: 'Assets Management', icon: Package },
  { path: '/reports', name: 'Reports', icon: FileBarChart },
  { path: '/settings', name: 'Settings', icon: Settings },
]

const SETTINGS_ICONS: Record<string, LucideIcon> = {
  'Company profile': Building2,
  Modules: Blocks,
  'Branch & location': MapPin,
  'Department & position': GitBranch,
  'Users & accounts': Users,
  'Roles & permissions': ShieldCheck,
  'Approval workflow': CheckSquare,
  Notifications: Bell,
  Integrations: Puzzle,
  Security: Shield,
  'Audit log': FileText,
  Appearance: Contrast,
  Language: Globe,
  'Email templates': Mail,
  'Backup & data': Database,
}

const REPORT_SUBTABS: { id: ReportsSubTab; label: string; icon: LucideIcon; badge?: string }[] = [
  { id: 'centre', label: 'Report centre', icon: LayoutGrid },
  { id: 'scheduled', label: 'Scheduled reports', icon: Clock, badge: '3' },
  { id: 'builder', label: 'Custom builder', icon: SlidersHorizontal },
]

function pathMatches(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`)
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { reportsPanel, setReportsPanel, settingsPanel, setSettingsPanel } = useShellNav()
  const [mainMenuOpen, setMainMenuOpen] = useState(false)
  const [settingsSearch, setSettingsSearch] = useState('')

  const allowedPaths = useMemo(
    () => new Set(navItemsFor(user).map((item) => item.path)),
    [user],
  )

  const mainNavItems = useMemo(
    () => MAIN_NAV.filter((item) => allowedPaths.has(item.path)),
    [allowedPaths],
  )

  const isHrAdmin = Boolean(user?.canAccessHrAdmin)
  const settingsSections = useMemo(() => settingsSectionsFor(isHrAdmin), [isHrAdmin])
  const isSettings = pathMatches(location.pathname, '/settings')
  const isReports = pathMatches(location.pathname, '/reports')

  const filteredSettingsSections = useMemo(() => {
    const q = settingsSearch.trim().toLowerCase()
    if (!q) return settingsSections
    return settingsSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.label.toLowerCase().includes(q)),
      }))
      .filter((section) => section.items.length > 0)
  }, [settingsSections, settingsSearch])

  function goTo(path: string) {
    navigate(path)
    setMainMenuOpen(false)
  }

  const navButtonClass = (active: boolean) =>
    `w-full flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3.5 px-3'} py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
      active
        ? 'bg-[#2f66e0] text-white shadow-xs'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`

  return (
    <aside
      id="app-sidebar"
      className={`${collapsed ? 'w-19' : 'w-68'} min-h-screen bg-white border-r border-slate-100 flex flex-col shrink-0 sticky top-0 self-start h-screen overflow-hidden z-120 transition-[width] duration-200`}
      aria-label="Main navigation"
    >
      {isSettings ? (
        <Fragment>
          <div id="settings-sidebar-header" className="p-4 border-b border-[#f8fafc]">
            <div className="relative">
              <button
                id="btn-settings-mode-selector"
                type="button"
                onClick={() => setMainMenuOpen((open) => !open)}
                className={`w-full bg-[#2f66e0] text-white ${collapsed ? 'px-2 justify-center' : 'px-4 justify-between'} py-3 rounded-xl font-bold text-xs flex items-center shadow-xs hover:bg-[#2557cb] transition-all cursor-pointer`}
                title="Settings"
              >
                <div className={`flex items-center ${collapsed ? '' : 'gap-2.5'}`}>
                  <Settings className="h-4.5 w-4.5 text-white" />
                  {!collapsed ? <span className="tracking-wide">Settings</span> : null}
                </div>
                {!collapsed ? (
                  <ChevronDown
                    className={`h-4 w-4 text-white transition-transform duration-200 ${mainMenuOpen ? 'rotate-180' : ''}`}
                  />
                ) : null}
              </button>

              {mainMenuOpen ? (
                <div
                  id="settings-sidebar-dropdown-menu"
                  className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl py-2 max-h-[360px] overflow-y-auto z-50"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    Switch Module
                  </div>
                  {mainNavItems
                    .filter((item) => item.path !== '/settings')
                    .map((item) => {
                      const ItemIcon = item.icon
                      return (
                        <button
                          key={item.path}
                          type="button"
                          onClick={() => goTo(item.path)}
                          className="w-full flex items-center gap-3 px-3.5 py-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors text-left cursor-pointer"
                        >
                          <ItemIcon className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="text-[11.5px] font-bold">{item.name}</span>
                        </button>
                      )
                    })}
                </div>
              ) : null}
            </div>

            {!collapsed ? (
              <div className="relative mt-3">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  id="sidebar-settings-search-input"
                  type="text"
                  placeholder="Search settings..."
                  value={settingsSearch}
                  onChange={(e) => setSettingsSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-[11px] font-bold text-slate-700 bg-slate-50/75 border border-slate-200 focus:border-[#2f66e0] focus:bg-white rounded-xl outline-none"
                />
              </div>
            ) : null}
          </div>

          <div
            id="settings-sidebar-scroll-container"
            className={`flex-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-4'} py-4 space-y-5 select-none`}
          >
            {filteredSettingsSections.map((section) => (
              <div key={section.title} className="space-y-1.5">
                {!collapsed ? (
                  <div className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {section.title}
                  </div>
                ) : null}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const SubIcon = SETTINGS_ICONS[item.label]
                    const isSubActive = settingsPanel === item.label
                    return (
                      <button
                        key={item.id}
                        type="button"
                        title={item.label}
                        onClick={() => {
                          setSettingsPanel(item.label)
                          if (!pathMatches(location.pathname, '/settings')) navigate('/settings')
                        }}
                        className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                          isSubActive
                            ? 'bg-blue-50 text-[#2f66e0] font-bold border-l-2 border-[#2f66e0]/80'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <SubIcon className={`h-4 w-4 ${isSubActive ? 'text-[#2f66e0]' : 'text-slate-500'}`} />
                        {!collapsed ? <span className="truncate">{item.label}</span> : null}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            {filteredSettingsSections.length === 0 ? (
              <div className="text-center py-4 text-[11px] text-slate-400 font-medium">
                No matching settings found
              </div>
            ) : null}
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div
            id="sidebar-logo-header"
            className={`h-16 ${collapsed ? 'px-2 justify-center' : 'px-6'} border-b border-[#f8fafc] flex items-center gap-2.5`}
          >
            {collapsed ? (
              <span className="block w-7 h-7" role="img" aria-label="Novora">
                <NovoraLogoMark className="w-7 h-7" />
              </span>
            ) : (
              <NovoraBrand size="xs" tone="dark" />
            )}
          </div>

          <div
            id="sidebar-nav-container"
            className={`flex-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-4'} py-4 space-y-1`}
          >
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathMatches(location.pathname, item.path)

              if (item.path === '/reports') {
                return (
                  <div key={item.path} className="flex flex-col">
                    <button
                      id="nav-reports"
                      type="button"
                      title={item.name}
                      onClick={() => goTo('/reports')}
                      className={navButtonClass(isActive)}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      {!collapsed ? <span className="truncate">{item.name}</span> : null}
                    </button>

                    {isActive && isReports && !collapsed ? (
                      <div className="pl-6.5 pr-1 mt-1.5 mb-1 space-y-1 select-none">
                        {REPORT_SUBTABS.map((sub) => {
                          const SubIcon = sub.icon
                          const subActive = reportsPanel === sub.id
                          return (
                            <button
                              key={sub.id}
                              id={`subnav-${sub.id}`}
                              type="button"
                              onClick={() => setReportsPanel(sub.id)}
                              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all text-left cursor-pointer ${
                                subActive
                                  ? 'bg-[#2f66e0]/8 text-[#2f66e0] font-extrabold border border-[#2f66e0]/10'
                                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <SubIcon className="h-3.5 w-3.5 shrink-0" />
                                <span>{sub.label}</span>
                              </div>
                              {sub.badge ? (
                                <span
                                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                    subActive
                                      ? 'bg-[#2f66e0]/15 text-[#2f66e0]'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {sub.badge}
                                </span>
                              ) : null}
                            </button>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                )
              }

              return (
                <button
                  id={`nav-${item.name.replace(/\s+/g, '-').replace(/\//g, '').toLowerCase()}`}
                  key={item.path}
                  type="button"
                  title={item.name}
                  onClick={() => goTo(item.path)}
                  className={navButtonClass(isActive)}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {!collapsed ? <span className="truncate">{item.name}</span> : null}
                </button>
              )
            })}
          </div>
        </Fragment>
      )}

      {!collapsed ? (
        <div id="sidebar-footer-help" className="p-4 border-t border-slate-50">
          <div className="bg-[#f0f5ff] hover:bg-[#e4eeff] transition-all p-4 rounded-xl flex gap-3 relative overflow-hidden group border border-[#dce7ff]">
            <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-blue-400/10 rounded-full group-hover:scale-110 transition-transform" />
            <HelpCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Need Help?</div>
              <div className="text-[10.5px] font-medium text-slate-500 mt-1 leading-snug">
                Visit our support center
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  )
}
