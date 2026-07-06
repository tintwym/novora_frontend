import type { ReactNode } from 'react'
import { RecruitHBar } from '../recruitment/RecruitmentPrimitives'

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
      <span aria-hidden>✓</span>
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
        {icon}
      </span>
    </article>
  )
}

export function BenTableScroll({ children }: { children: ReactNode }) {
  return <div className="ben-table-scroll">{children}</div>
}
