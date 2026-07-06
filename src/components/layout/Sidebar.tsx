import { NavLink } from 'react-router-dom'
import { navItemsFor } from '../../config/nav'
import { useAuth } from '../../auth/AuthContext'
import novoraLogo from '../../assets/novora-logo.svg'
import novoraMark from '../../assets/novora-mark.svg'
import { ShellMenuIcon } from './ShellIcons'
import { SidebarNavIcon } from './SidebarNavIcon'

type SidebarProps = {
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const { user } = useAuth()
  const items = navItemsFor(user)

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`} aria-label="Main navigation">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          {collapsed ? (
            <img src={novoraMark} alt="Novora" className="sidebar-mark" width={38} height={38} />
          ) : (
            <img src={novoraLogo} alt="Novora HRMS Software" className="sidebar-logo-img" />
          )}
        </div>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          <svg viewBox="0 0 24 24" aria-hidden className="sidebar-toggle-icon">
            <ShellMenuIcon />
          </svg>
        </button>
      </div>
      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <SidebarNavIcon name={item.icon} />
            <span className="sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
