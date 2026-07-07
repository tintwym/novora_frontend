import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useMinDesktopWidth } from '../../config/shell'
import { DesktopOnlyNotice } from './DesktopOnlyNotice'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

const SIDEBAR_COLLAPSED_KEY = 'novora-sidebar-collapsed'

function readSidebarCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

export function AppShell() {
  const isDesktop = useMinDesktopWidth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readSidebarCollapsed)

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [sidebarCollapsed])

  if (!isDesktop) {
    return <DesktopOnlyNotice />
  }

  return (
    <div className="app-shell">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="app-main">
        <TopBar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
