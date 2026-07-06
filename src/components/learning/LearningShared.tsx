import type { ReactNode } from 'react'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'

export function LrnCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`lrn-card${className ? ` ${className}` : ''}`}>{children}</section>
}

export function LrnSectionHead({ title, subtitle, trailing }: { title: string; subtitle?: string; trailing?: ReactNode }) {
  return (
    <div className="lrn-section-head">
      <div>
        <span className="lrn-section-title">{title}</span>
        {subtitle ? <p className="lrn-muted">{subtitle}</p> : null}
      </div>
      {trailing}
    </div>
  )
}

export function LrnField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="lrn-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function LrnLiveSyncPill() {
  return (
    <div className="lrn-live-sync">
      <span aria-hidden />
      SCORM 2004 V4 / XAPI STANDARD SYNCED
    </div>
  )
}

export function LrnPill({ label, tone = 'neutral' }: { label: string; tone?: Parameters<typeof RecruitPill>[0]['tone'] }) {
  return <RecruitPill label={label} tone={tone} />
}

export function LrnSearchInput({ placeholder, value, onChange }: { placeholder: string; value?: string; onChange?: (v: string) => void }) {
  return (
    <div className="lrn-search">
      <span aria-hidden>🔍</span>
      <input type="search" placeholder={placeholder} value={value} onChange={(e) => onChange?.(e.target.value)} aria-label={placeholder} />
    </div>
  )
}

export function LrnSelect({ defaultValue, options, label }: { defaultValue: string; options: string[]; label?: string }) {
  return (
    <select className="lrn-select" defaultValue={defaultValue} aria-label={label ?? defaultValue}>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}

export function LrnPrimaryBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" className="lrn-primary-btn" onClick={onClick}>
      {children}
    </button>
  )
}

export function LrnOutlineBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" className="lrn-outline-btn" onClick={onClick}>
      {children}
    </button>
  )
}

export function LrnTableScroll({ children }: { children: ReactNode }) {
  return <div className="lrn-table-scroll">{children}</div>
}

export function LrnFieldRow({ children }: { children: ReactNode }) {
  return <div className="lrn-field-row">{children}</div>
}

export function LrnProgressBar({ pct }: { pct: number }) {
  return (
    <div className="lrn-progress-track">
      <span style={{ width: `${pct}%` }} />
    </div>
  )
}
