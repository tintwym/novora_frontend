import type { ReactNode } from 'react'
import type { NavIcon } from '../../config/nav'

type SidebarNavIconProps = {
  name: NavIcon
}

export function SidebarNavIcon({ name }: SidebarNavIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="sidebar-link-icon">
      {ICONS[name] ?? ICONS.settings}
    </svg>
  )
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const ICONS: Record<string, ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" {...stroke} />
      <rect x="14" y="3" width="7" height="7" rx="1" {...stroke} />
      <rect x="3" y="14" width="7" height="7" rx="1" {...stroke} />
      <rect x="14" y="14" width="7" height="7" rx="1" {...stroke} />
    </>
  ),
  employees: (
    <>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" {...stroke} />
      <circle cx="9" cy="7" r="4" {...stroke} />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" {...stroke} />
    </>
  ),
  recruitment: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" {...stroke} />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" {...stroke} />
    </>
  ),
  onboarding: (
    <>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" {...stroke} />
      <circle cx="9" cy="7" r="4" {...stroke} />
      <line x1="19" y1="8" x2="19" y2="14" {...stroke} />
      <line x1="22" y1="11" x2="16" y2="11" {...stroke} />
    </>
  ),
  attendance: (
    <>
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="M12 7v5l3 3" {...stroke} />
    </>
  ),
  leave: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" {...stroke} />
      <line x1="16" y1="2" x2="16" y2="6" {...stroke} />
      <line x1="8" y1="2" x2="8" y2="6" {...stroke} />
      <line x1="3" y1="10" x2="21" y2="10" {...stroke} />
    </>
  ),
  disciplinary: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...stroke} />
      <line x1="12" y1="8" x2="12" y2="12" {...stroke} />
      <line x1="12" y1="16" x2="12.01" y2="16" {...stroke} />
    </>
  ),
  payroll: (
    <>
      <line x1="12" y1="1" x2="12" y2="23" {...stroke} />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" {...stroke} />
    </>
  ),
  claims: (
    <>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" {...stroke} />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" {...stroke} />
    </>
  ),
  benefits: (
    <>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" {...stroke} />
    </>
  ),
  helpdesk: (
    <>
      <path d="M3 11h3a2 2 0 012 2v3a2 2 0 01-2 2H3v-7z" {...stroke} />
      <path d="M21 11h-3a2 2 0 00-2 2v3a2 2 0 002 2h3v-7z" {...stroke} />
      <path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z" {...stroke} />
    </>
  ),
  performance: (
    <>
      <path d="M3 3v18h18" {...stroke} />
      <path d="M7 16l4-4 4 4 5-6" {...stroke} />
    </>
  ),
  engagement: (
    <>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" {...stroke} />
    </>
  ),
  training: (
    <>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" {...stroke} />
      <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" {...stroke} />
    </>
  ),
  learning: (
    <>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" {...stroke} />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" {...stroke} />
    </>
  ),
  assets: (
    <>
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" {...stroke} />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" {...stroke} />
    </>
  ),
  reports: (
    <>
      <line x1="18" y1="20" x2="18" y2="10" {...stroke} />
      <line x1="12" y1="20" x2="12" y2="4" {...stroke} />
      <line x1="6" y1="20" x2="6" y2="14" {...stroke} />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" {...stroke} />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        {...stroke}
      />
    </>
  ),
}
