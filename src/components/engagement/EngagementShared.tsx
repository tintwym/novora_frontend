import type { ReactNode } from 'react'
import { RecruitHBar } from '../recruitment/RecruitmentPrimitives'

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
