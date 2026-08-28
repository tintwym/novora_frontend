import React, { useEffect, useRef, useState } from 'react'
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  ShieldCheck,
  Briefcase,
} from 'lucide-react'
import type { AuthSession } from '@/types'
import { primaryRole, roleDisplayLabel } from '@/lib/roles'
import { sidebarLabel } from '@/lib/navLabels'
import { formatPersonDisplayName } from '@/lib/personName'

interface TopbarProps {
  activeTabName: string
  onSearchChange?: (val: string) => void
  searchValue?: string
  addToast: (text: string, type: 'success' | 'info' | 'error' | 'loading') => void
  session?: AuthSession | null
  onLogout?: () => void | Promise<void>
}

function RoleIcon({ roles, className }: { roles: string[] | undefined; className?: string }) {
  const raw = primaryRole(roles)
  if (raw === 'SUPER_ADMIN' || raw === 'HR_ADMIN') {
    return <ShieldCheck className={className} />
  }
  if (raw === 'HR_MANAGER' || raw === 'MANAGER') {
    return <Briefcase className={className} />
  }
  return <User className={className} />
}

function sectionTitle(tab: string): string {
  return sidebarLabel(tab)
}

export default function Topbar({
  activeTabName,
  onSearchChange,
  searchValue = '',
  addToast,
  session,
  onLogout,
}: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notifyRef = useRef<HTMLDivElement>(null)

  const displayName = formatPersonDisplayName(session?.fullName || 'pinky')
  const displayEmail = session?.email || 'pinky.sharma@novora.com'
  const displayRole = roleDisplayLabel(session?.roles)
  const initial = displayName.trim().charAt(0).toUpperCase() || 'P'
  const title = sectionTitle(activeTabName)

  const notifications = [
    { id: 1, title: 'Leave Approval', msg: 'Sarah Lim applied for 3 days annual leave', time: '10 min ago' },
    { id: 2, title: 'Onboarding Update', msg: 'System prepared accounts for new developer', time: '1 hour ago' },
    { id: 3, title: 'Claim Pending', msg: 'Travel claim uploaded by Raj Kumar', time: '3 hours ago' },
    { id: 4, title: 'Performance Review', msg: 'Daily feedback logs summarized', time: '1 day ago' },
    { id: 5, title: 'System Alert', msg: 'Automatic backup completed successfully', time: '1 day ago' },
  ]

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false)
      }
      if (notifyRef.current && !notifyRef.current.contains(target)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const handleNotificationClick = (itemTitle: string) => {
    addToast(`Opened notification: "${itemTitle}"`, 'info')
    setNotificationsOpen(false)
  }

  return (
    <header
      id="app-topbar"
      className="sticky top-0 z-40 h-16 nv-glass px-6 md:px-8 flex items-center justify-between shrink-0"
    >
      <div className="flex items-center gap-2 min-w-0">
        <h1
          id="topbar-section-title"
          className="nv-page-title text-lg md:text-xl truncate"
          title={activeTabName}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div id="topbar-search-container" className="relative w-48 sm:w-64 md:w-80 hidden sm:block">
          <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            id="topbar-search-input"
            type="text"
            placeholder="Search employees, modules..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full text-sm text-slate-800 nv-input py-1.5 pl-10 pr-4"
          />
        </div>

        <div id="topbar-notification-bell" className="relative" ref={notifyRef}>
          <button
            id="topbar-notification-btn"
            type="button"
            onClick={() => {
              setNotificationsOpen((open) => !open)
              setProfileOpen(false)
            }}
            className="p-2.5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-white transition-colors relative cursor-pointer"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell className="h-4.5 w-4.5 text-slate-600" />
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {notifications.length}
            </span>
          </button>

          {notificationsOpen && (
            <div
              id="topbar-notifications-dropdown"
              className="absolute right-0 mt-2.5 w-80 nv-card shadow-xl py-2 z-50 animate-soft-fade-up"
            >
              <div className="px-4 py-2.5 border-b border-slate-50 flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm">Notifications</span>
                <button
                  type="button"
                  className="text-[11px] text-novora font-semibold cursor-pointer hover:underline"
                  onClick={() => addToast('Cleared all alerts', 'success')}
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleNotificationClick(n.title)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50/50 last:border-0"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-xs text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11.5px] text-slate-500 mt-0.5 leading-relaxed truncate">{n.msg}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div id="topbar-user-profile" className="relative" ref={profileRef}>
          <button
            id="topbar-profile-btn"
            type="button"
            onClick={() => {
              setProfileOpen((open) => !open)
              setNotificationsOpen(false)
            }}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-white transition-colors cursor-pointer"
            title={displayRole}
            aria-expanded={profileOpen}
          >
            <div className="h-7 w-7 bg-novora/10 border border-novora/20 rounded-lg flex items-center justify-center text-sm font-bold text-novora">
              {initial}
            </div>
            <span className="text-xs font-bold text-slate-700 tracking-tight max-w-28 truncate hidden md:inline">
              {displayName}
            </span>
            <RoleIcon roles={session?.roles} className="h-3.5 w-3.5 text-slate-500 shrink-0 hidden sm:block" />
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {profileOpen && (
            <div
              id="topbar-profile-dropdown"
              className="absolute right-0 mt-2.5 w-56 nv-card shadow-xl py-1.5 z-50 animate-soft-fade-up"
            >
              <div className="px-4 py-3 border-b border-slate-50">
                <div className="font-bold text-xs text-slate-800 truncate">{displayName}</div>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-semibold text-slate-500">
                  <RoleIcon roles={session?.roles} className="h-3 w-3 shrink-0" />
                  <span className="truncate">{displayRole}</span>
                </div>
                <div className="text-[10px] font-medium text-slate-400 truncate mt-1">{displayEmail}</div>
                {session?.companyName && (
                  <div className="text-[10px] font-semibold text-novora mt-1 truncate">
                    {session.companyName}
                  </div>
                )}
              </div>
              <div className="border-t border-slate-50 my-1" />
              <button
                type="button"
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left cursor-pointer"
                onMouseDown={(e) => {
                  // Avoid document mousedown-outside closing the menu before click fires.
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setProfileOpen(false)
                  void onLogout?.()
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
