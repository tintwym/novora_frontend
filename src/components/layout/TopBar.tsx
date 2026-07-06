import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { shellTitle } from '../../config/nav'
import { useLocation, useNavigate } from 'react-router-dom'
import { LogoutConfirmModal } from './LogoutConfirmModal'
import { ShellMenuIcon } from './ShellIcons'

type TopBarProps = {
  sidebarCollapsed?: boolean
  onExpandSidebar?: () => void
}

export function TopBar({ sidebarCollapsed = false, onExpandSidebar }: TopBarProps) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const title = shellTitle(location.pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const initials = user?.displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || '?'

  const dateLabel =
    location.pathname === '/dashboard'
      ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : null

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  return (
    <header className="topbar">
      {sidebarCollapsed ? (
        <button
          type="button"
          className="topbar-menu-btn"
          aria-label="Expand sidebar"
          aria-expanded={false}
          onClick={onExpandSidebar}
        >
          <svg viewBox="0 0 24 24" aria-hidden className="topbar-menu-icon">
            <ShellMenuIcon />
          </svg>
        </button>
      ) : null}

      <div className="topbar-titles">
        <h1>{title}</h1>
      </div>

      <div className="topbar-search">
        <svg viewBox="0 0 24 24" aria-hidden className="topbar-search-icon">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
        </svg>
        <input type="search" placeholder="Search employees, modules..." aria-label="Search" />
      </div>

      <div className="topbar-actions">
        <button type="button" className="topbar-icon-btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path
              d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <span className="topbar-badge" aria-hidden />
        </button>

        <div className="topbar-user-menu" ref={menuRef}>
          <button
            type="button"
            className="topbar-user-trigger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
          >
            <span className="user-avatar">{initials}</span>
            <span className="user-name">{user?.displayName ?? 'Signed in'}</span>
            <span className="topbar-chevron" aria-hidden>
              ▾
            </span>
          </button>
          {menuOpen ? (
            <div className="topbar-dropdown" role="menu">
              <div className="topbar-dropdown-header">
                <strong>{user?.displayName}</strong>
                {user?.email ? <span>{user.email}</span> : null}
              </div>
              <button type="button" role="menuitem" onClick={() => navigate('/settings')}>
                Settings
              </button>
              <button
                type="button"
                role="menuitem"
                className="danger"
                onClick={() => {
                  setMenuOpen(false)
                  setLogoutOpen(true)
                }}
              >
                Log out
              </button>
            </div>
          ) : null}
        </div>

        {dateLabel ? (
          <div className="topbar-date">
            <svg viewBox="0 0 24 24" aria-hidden>
              <rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
            </svg>
            {dateLabel}
          </div>
        ) : null}
      </div>

      <LogoutConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={async () => {
          await logout()
          setLogoutOpen(false)
          navigate('/login', { replace: true })
        }}
      />
    </header>
  )
}
