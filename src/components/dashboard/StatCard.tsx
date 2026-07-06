import type { ReactElement } from 'react'
import type { DashboardStatItem, StatIcon } from '../../types/dashboard'

const ICONS: Record<StatIcon, ReactElement> = {
  groups: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  personAdd: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  ),
  leave: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4.5 8-12V5l-8-3-8 3v5c0 7.5 8 12 8 12z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  sync: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  event: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  trend: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  payments: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  task: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
}

export function StatCard({ item }: { item: DashboardStatItem }) {
  return (
    <article className="dash-stat-card">
      <div className="dash-stat-top">
        <div>
          <p className="dash-stat-label">{item.label}</p>
          <p className="dash-stat-value">{item.value}</p>
        </div>
        <span className="dash-stat-icon" style={{ color: item.color, background: `${item.color}1f` }}>
          {ICONS[item.icon]}
        </span>
      </div>
      {item.showTrend && item.change ? (
        <p className={`dash-stat-trend ${item.isPositive ? 'positive' : 'negative'}`}>
          <span aria-hidden>{item.isPositive ? '↑' : '↓'}</span>
          {item.change}
          <span className="dash-stat-trend-muted">vs last month</span>
        </p>
      ) : null}
    </article>
  )
}

export function StatGrid({ items }: { items: DashboardStatItem[] }) {
  return (
    <div className="dash-stat-grid">
      {items.map((item) => (
        <StatCard key={item.label} item={item} />
      ))}
    </div>
  )
}
