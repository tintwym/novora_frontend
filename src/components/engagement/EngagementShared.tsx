import type { ReactNode } from 'react'
import { RecruitHBar, RecruitKpiIcon } from '../recruitment/RecruitmentPrimitives'

export function EngIcon({ name, className = '' }: { name: string; className?: string }) {
  const cls = `eng-icon${className ? ` ${className}` : ''}`
  if (name === 'pulse') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'sentiment') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'shoutout') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22M18 2H6v7a6 6 0 0 0 12 0V2z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'manager') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <rect x="2" y="7" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12v2M8 12v2M16 12v2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'reports') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M18 20V10M12 20V4M6 20v-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'send') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="m22 2-7 20-4-9-9-4 20-7z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'lightbulb') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'pen') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'heart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'sparkle') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1zM19 13l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'clap') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M7 11V7a2 2 0 0 1 4 0v4M11 9V5a2 2 0 0 1 4 0v6M15 11V7a2 2 0 0 1 4 0v8a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5v-4z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'target') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'warning') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v4M12 16h.01" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'medal-diamond') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M6 3h12l4 6-10 13L2 9l4-6z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'medal-bulb') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-3 11v1h6v-1a6 6 0 0 0-3-11z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'medal-rocket') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'medal-heart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'medal-trophy') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4zM5 4H3v2a3 3 0 0 0 3 3M19 4h2v2a3 3 0 0 1-3 3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'ribbon') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="12" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 21l4-4 4 4M9 14H7v7M15 14h2v7" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'pulse-line') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M3 12h4l3-8 4 16 3-8h4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cls}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function EngCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`eng-card${className ? ` ${className}` : ''}`}>{children}</section>
}

export function EngSectionTitle({ title, subtitle, trailing }: { title: string; subtitle?: string; trailing?: ReactNode }) {
  return (
    <div className="eng-section-head">
      <div>
        <span className="eng-section-title">{title}</span>
        {subtitle ? <p className="eng-muted italic">{subtitle}</p> : null}
      </div>
      {trailing}
    </div>
  )
}

export function EngField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="eng-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function EngLiveSyncPill() {
  return (
    <div className="eng-live-sync">
      <span aria-hidden />
      LIVE SENTIMENT INDEX SYNC ACTIVE
    </div>
  )
}

export function EngHBar({ label, pct, color, trailing }: { label: string; pct: number; color: string; trailing: string }) {
  return <RecruitHBar label={label} value={pct} max={100} color={color} trailing={trailing} />
}

export function EngAvatar({ initials }: { initials: string }) {
  return <span className="eng-avatar">{initials}</span>
}

export function EngTableScroll({ children }: { children: ReactNode }) {
  return <div className="eng-table-scroll">{children}</div>
}

export function EngProgressKpi({
  title,
  value,
  subtext,
  icon,
  iconColor,
  progress,
  valueClassName = '',
}: {
  title: string
  value: string
  subtext: string
  icon: string
  iconColor: string
  progress: number
  valueClassName?: string
}) {
  return (
    <article className="recruit-kpi-card eng-progress-kpi">
      <div className="recruit-kpi-top">
        <div>
          <span className="recruit-kpi-title">{title}</span>
          <strong className={valueClassName}>{value}</strong>
          <span className="muted">{subtext}</span>
        </div>
        <span className="recruit-kpi-icon" style={{ background: `${iconColor}1f`, color: iconColor }}>
          <RecruitKpiIcon name={icon} />
        </span>
      </div>
      <div className="eng-progress-track">
        <span style={{ width: `${progress}%`, background: iconColor }} />
      </div>
    </article>
  )
}
