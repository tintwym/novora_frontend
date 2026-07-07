import type { ReactNode } from 'react'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'

export function LrnIcon({ name, className = '' }: { name: string; className?: string }) {
  const cls = `lrn-icon${className ? ` ${className}` : ''}`
  if (name === 'search') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m21 21-4.35-4.35" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'upload') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'external') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'play') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <polygon points="5 3 19 12 5 21 5 3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'check') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    )
  }
  if (name === 'star') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
      </svg>
    )
  }
  if (name === 'settings') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'close') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2" />
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
  if (name === 'warning') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 9v4M12 17h.01" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'clock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6v6l4 2" fill="none" stroke="currentColor" strokeWidth="2" />
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
  if (name === 'trophy') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4zM5 4H3v2a3 3 0 0 0 3 3M19 4h2v2a3 3 0 0 1-3 3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'cloud') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cls}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

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
      <LrnIcon name="search" className="lrn-search-icon" />
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

export function LrnPrimaryBtn({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button type="button" className={`lrn-primary-btn${className ? ` ${className}` : ''}`} onClick={onClick}>
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
