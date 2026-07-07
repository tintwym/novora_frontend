import type { ReactNode } from 'react'
import type { RecruitPillTone } from '../../types/recruitment'

const PILL_STYLES: Record<RecruitPillTone, { bg: string; fg: string }> = {
  success: { bg: '#d1fae5', fg: '#065f46' },
  info: { bg: '#dbeafe', fg: '#2563eb' },
  warning: { bg: '#ffedd5', fg: '#c2410c' },
  danger: { bg: '#fee2e2', fg: '#991b1b' },
  purple: { bg: '#ede9fe', fg: '#5b21b6' },
  pink: { bg: '#fce7f3', fg: '#9d174d' },
  neutral: { bg: '#f1f5f9', fg: '#475569' },
}

export function RecruitPill({ label, tone = 'neutral' }: { label: string; tone?: RecruitPillTone }) {
  const s = PILL_STYLES[tone]
  return (
    <span className="recruit-pill" style={{ background: s.bg, color: s.fg }}>
      {label}
    </span>
  )
}

export function RecruitKpiIcon({ name }: { name: string }) {
  if (name === 'clipboard') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="2" width="8" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'check') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M22 4 12 14.01l-3-3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'users') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'chart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M3 3v18h18M7 16l4-4 4 4 5-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'clock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6v6l4 2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'percent') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="7" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m5 19 14-14" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'wallet') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 12h4M18 10v4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'alert') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 9v4M12 17h.01" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'building') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 9h.01M15 9h.01M9 13h.01M15 13h.01" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'coins') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M18.09 10.37A6 6 0 1 1 10.37 2.91" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M7 6h4M7 10h2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'file') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 2v6h6M16 13H8M16 17H8" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'infinity') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.356-8-5.095 0-5.095 8 0 8 5.096 0 7.133-8 12.356-8z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'refresh') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M21 12a9 9 0 1 1-2.64-6.36" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M21 3v6h-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'heart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'ticket') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M13 5v2M13 17v2M13 11v2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'inbox') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M22 12h-6l-2 3h-4l-2-3H2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'flame') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17h2a2.5 2.5 0 0 0 2.5-2.5V9a6 6 0 1 0-12 0v5.5" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'smile') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'target') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'message') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'book') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'medal') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 21l4-4 4 4M9 14H7v7M15 14h2v7" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'play') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <polygon points="5 3 19 12 5 21 5 3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'star') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'box') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'layers') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="m12 2 9 4.5v7L3 9.5 12 2zM21 9.5l-9 4.5-9-4.5M3 14.5 12 19l9-4.5" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'wrench') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'clock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6v6l4 2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function RecruitIconKpi({
  title,
  value,
  subtext,
  icon,
  iconColor,
  valueTone,
  trend,
  trendTone,
}: {
  title: string
  value: string
  subtext: string
  icon: string
  iconColor: string
  valueTone?: string
  trend?: string
  trendTone?: string
}) {
  return (
    <article className="recruit-kpi-card">
      <div className="recruit-kpi-top">
        <div>
          <span className="recruit-kpi-title">{title}</span>
          <strong className={valueTone ? `tone-${valueTone}` : ''}>{value}</strong>
          {trend ? <em className={trendTone ? `tone-${trendTone}` : 'tone-success'}>{trend}</em> : null}
          <span className="muted">{subtext}</span>
        </div>
        <span className="recruit-kpi-icon" style={{ background: `${iconColor}1f`, color: iconColor }}>
          <RecruitKpiIcon name={icon} />
        </span>
      </div>
    </article>
  )
}

export function RecruitHBar({
  label,
  value,
  max,
  color,
  trailing,
}: {
  label: string
  value: number
  max: number
  color: string
  trailing: string
}) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="recruit-hbar">
      <div className="recruit-hbar-head">
        <span>{label}</span>
        <em>{trailing}</em>
      </div>
      <div className="recruit-hbar-track">
        <span style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export function RecruitScoreBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div className="recruit-score-bar">
      <span>{label}</span>
      <div className="recruit-score-track">
        <span style={{ width: `${percent}%`, background: color }} />
      </div>
      <em>{percent}%</em>
    </div>
  )
}

export function RecruitCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`recruit-card${className ? ` ${className}` : ''}`}>{children}</section>
}

export function FunnelPills({ counts }: { counts: number[] }) {
  const labels = ['A', 'S', 'I', 'O', 'H']
  const colors = ['#2563eb', '#60a5fa', '#8b5cf6', '#f59e0b', '#10b981']
  return (
    <div className="recruit-funnel-pills">
      {counts.map((c, i) => (
        <span key={labels[i]} style={{ background: `${colors[i]}26`, color: colors[i], borderColor: `${colors[i]}66` }}>
          {c} {labels[i]}
        </span>
      ))}
    </div>
  )
}
