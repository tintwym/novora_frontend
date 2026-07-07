import type { ReactNode } from 'react'
import { RecruitHBar, RecruitKpiIcon } from '../recruitment/RecruitmentPrimitives'

export function BenefIcon({ name, className = '' }: { name: string; className?: string }) {
  const cls = `ben-icon${className ? ` ${className}` : ''}`
  if (name === 'enrollment') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <rect x="3" y="3" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'wellness') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 12h4M18 10v4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'dependents') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'payroll') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M21 12a9 9 0 1 1-2.64-6.36" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M21 3v6h-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'vendor') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 9h.01M15 9h.01M9 13h.01M15 13h.01" fill="none" stroke="currentColor" strokeWidth="2" />
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
  if (name === 'sync') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M21 12a9 9 0 1 1-2.64-6.36" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M21 3v6h-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'users-empty') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'shield-alert') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v4M12 16h.01" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cls}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function BenCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`ben-card${className ? ` ${className}` : ''}`}>{children}</section>
}

export function BenSectionTitle({ title, subtitle, trailing }: { title: string; subtitle?: string; trailing?: ReactNode }) {
  return (
    <div className="ben-section-head">
      <div>
        <span className="ben-section-title">{title}</span>
        {subtitle ? <p className="ben-muted">{subtitle}</p> : null}
      </div>
      {trailing}
    </div>
  )
}

export function BenField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="ben-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function BenCheckItem({ label }: { label: string }) {
  return (
    <div className="ben-check-item">
      <svg viewBox="0 0 24 24" aria-hidden className="ben-check-icon">
        <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      {label}
    </div>
  )
}

export function BenRatioBar({ label, pct, color, trailing }: { label: string; pct: number; color: string; trailing: string }) {
  return <RecruitHBar label={label} value={pct} max={100} color={color} trailing={trailing} />
}

export function BenWalletKpi({
  title,
  value,
  subtext,
  utilization,
  utilizationLabel,
  color,
  icon,
}: {
  title: string
  value: string
  subtext: string
  utilization: number
  utilizationLabel: string
  color: string
  icon: string
}) {
  return (
    <article className="ben-wallet-kpi">
      <div>
        <span className="ben-section-title">{title}</span>
        <strong style={{ color }}>{value}</strong>
        <p className="ben-muted">{subtext}</p>
        <div className="ben-util-head">
          <span>Fund Utilization</span>
          <em>{utilizationLabel}</em>
        </div>
        <div className="ben-util-track">
          <span style={{ width: `${utilization * 100}%`, background: color }} />
        </div>
      </div>
      <span className="ben-wallet-icon" style={{ background: `${color}1f`, color }}>
        <RecruitKpiIcon name={icon} />
      </span>
    </article>
  )
}

export function BenReportKpi({
  title,
  value,
  subtext,
  utilization,
  color,
  icon,
  valueClassName = '',
}: {
  title: string
  value: string
  subtext: string
  utilization: number
  color: string
  icon: string
  valueClassName?: string
}) {
  return (
    <article className="ben-report-kpi">
      <div className="ben-report-kpi-head">
        <div>
          <span className="recruit-kpi-title">{title}</span>
          <strong className={valueClassName}>{value}</strong>
          <span className="muted">{subtext}</span>
        </div>
        <span className="recruit-kpi-icon" style={{ background: `${color}1f`, color }}>
          <RecruitKpiIcon name={icon} />
        </span>
      </div>
      <div className="ben-util-track">
        <span style={{ width: `${utilization}%`, background: color }} />
      </div>
    </article>
  )
}

export function BenTableScroll({ children }: { children: ReactNode }) {
  return <div className="ben-table-scroll">{children}</div>
}
