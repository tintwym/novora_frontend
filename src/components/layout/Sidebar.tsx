import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { navGroupsFor, navLabel, navSettingsItem, type NavItem } from '../../config/nav'
import { useAuth } from '../../auth/AuthContext'
import { NovoraBrand, NovoraLogoMark } from '../brand/NovoraLogo'
import { SidebarNavIcon } from './SidebarNavIcon'

const SIDEBAR_GROUPS_KEY = 'novora-sidebar-groups'

type SidebarProps = {
  collapsed?: boolean
}

function readExpandedGroups(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(SIDEBAR_GROUPS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, boolean>
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function NavItemLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const label = navLabel(item)

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
      title={collapsed ? label : undefined}
    >
      <SidebarNavIcon name={item.icon} />
      <span className="sidebar-link-label">{label}</span>
    </NavLink>
  )
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const { user } = useAuth()
  const location = useLocation()
  const groups = useMemo(() => navGroupsFor(user), [user])
  const settingsItem = useMemo(() => navSettingsItem(user), [user])
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(readExpandedGroups)

  useEffect(() => {
    const activeGroup = groups.find((group) =>
      group.items.some(
        (item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`),
      ),
    )
    if (!activeGroup) return

    setExpandedGroups((prev) => {
      if (prev[activeGroup.id] !== false) return prev
      const next = { ...prev, [activeGroup.id]: true }
      try {
        localStorage.setItem(SIDEBAR_GROUPS_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [location.pathname, groups])

  function toggleGroup(groupId: string) {
    setExpandedGroups((prev) => {
      const isOpen = prev[groupId] !== false
      const next = { ...prev, [groupId]: !isOpen }
      try {
        localStorage.setItem(SIDEBAR_GROUPS_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const flatItems = useMemo(() => groups.flatMap((group) => group.items), [groups])

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`} aria-label="Main navigation">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          {collapsed ? (
            <span className="sidebar-mark-wrap" role="img" aria-label="Novora">
              <NovoraLogoMark className="sidebar-mark" />
            </span>
          ) : (
            <NovoraBrand size="xs" tone="dark" className="sidebar-brand-full" />
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {collapsed
          ? flatItems.map((item) => <NavItemLink key={item.path} item={item} collapsed />)
          : groups.map((group) => {
              const isOpen = expandedGroups[group.id] !== false
              const isSingleLink = group.items.length === 1

              if (isSingleLink) {
                return <NavItemLink key={group.id} item={group.items[0]} collapsed={false} />
              }

              return (
                <div key={group.id} className={`sidebar-group${isOpen ? ' open' : ''}`}>
                  <button
                    type="button"
                    className="sidebar-group-toggle"
                    aria-expanded={isOpen}
                    onClick={() => toggleGroup(group.id)}
                  >
                    <span className="sidebar-group-label">{group.label}</span>
                    <svg viewBox="0 0 24 24" aria-hidden className="sidebar-group-chevron">
                      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                  {isOpen ? (
                    <div className="sidebar-group-items">
                      {group.items.map((item) => (
                        <NavItemLink key={item.path} item={item} collapsed={false} />
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
      </nav>

      {settingsItem ? (
        <div className="sidebar-footer">
          <NavItemLink item={settingsItem} collapsed={collapsed} />
        </div>
      ) : null}
    </aside>
  )
}
