import type { ReactNode } from 'react'
import { EditIconBtn } from '../ui/EditIconBtn'
import { RecruitHBar, RecruitPill } from '../recruitment/RecruitmentPrimitives'

export function PerfIcon({ name, className = '' }: { name: string; className?: string }) {
  const cls = `perf-icon${className ? ` ${className}` : ''}`
  if (name === 'level') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'grade') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="7" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m5 19 14-14" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'kpi') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'evalType') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 2v4M8 2v4M3 10h18" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'evalCategory') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'evalSetup') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'grant') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M9 12 11 14l4-4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'evaluation') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="2" width="8" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M9 14l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'result') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M18 20V10M12 20V4M6 20v-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'competency') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'review') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 2v6h6M16 13H8M16 17H8" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'profile') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'search') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m21 21-4.35-4.35" fill="none" stroke="currentColor" strokeWidth="2" />
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
  if (name === 'close') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cls}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function PerfCheckMark({ checked }: { checked: boolean }) {
  return (
    <span className={`perf-check-mark${checked ? ' checked' : ''}`} aria-hidden>
      {checked ? <PerfIcon name="check" /> : null}
    </span>
  )
}

export function PerfCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`perf-card${className ? ` ${className}` : ''}`}>{children}</section>
}

export function PerfToolbarRow({ leading, trailing }: { leading?: ReactNode; trailing?: ReactNode }) {
  return (
    <div className="perf-toolbar-row">
      <div className="perf-toolbar-leading">{leading}</div>
      <div className="perf-toolbar-trailing">{trailing}</div>
    </div>
  )
}

export function PerfSectionTitle({ title, trailing }: { title: string; trailing?: ReactNode }) {
  return (
    <div className="perf-section-head">
      <span className="perf-section-title">{title}</span>
      {trailing}
    </div>
  )
}

export function PerfSearch({ placeholder, className = '' }: { placeholder: string; className?: string }) {
  return (
    <label className={`perf-search-wrap${className ? ` ${className}` : ''}`}>
      <PerfIcon name="search" className="perf-search-icon" />
      <input type="search" className="perf-search" placeholder={placeholder} />
    </label>
  )
}

export function PerfSelect({ children, defaultValue, className = '', 'aria-label': ariaLabel }: { children: ReactNode; defaultValue?: string; className?: string; 'aria-label'?: string }) {
  return (
    <select className={`perf-select${className ? ` ${className}` : ''}`} defaultValue={defaultValue} aria-label={ariaLabel}>
      {children}
    </select>
  )
}

export function PerfPrimaryBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" className="perf-primary-btn" onClick={onClick}>
      {children}
    </button>
  )
}

export function PerfLinkBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" className="perf-link-btn" onClick={onClick}>
      {children}
    </button>
  )
}

export function PerfEditBtn({ onClick, label = 'Edit' }: { onClick?: () => void; label?: string }) {
  return <EditIconBtn onClick={onClick} label={label} className="perf-icon-btn" />
}

export function PerfTableScroll({ children }: { children: ReactNode }) {
  return <div className="perf-table-scroll">{children}</div>
}

export function PerfAvatarName({ initials, name, bg }: { initials: string; name: string; bg: string }) {
  return (
    <span className="perf-avatar-name">
      <span className="perf-avatar" style={{ background: bg }}>
        {initials}
      </span>
      <strong>{name}</strong>
    </span>
  )
}

export function PerfGradeBox({ letter, bg }: { letter: string; bg: string }) {
  return (
    <span className="perf-grade-box" style={{ background: bg }}>
      {letter}
    </span>
  )
}

export function PerfYesNoPill({ yes }: { yes: boolean }) {
  return <RecruitPill label={yes ? 'Yes' : 'No'} tone={yes ? 'success' : 'neutral'} />
}

export function PerfActivePill() {
  return <RecruitPill label="Active" tone="success" />
}

export function PerfKpiScoreCircle({ score, tone }: { score: string; tone: 'success' | 'primary' | 'warning' | 'danger' }) {
  const colors = {
    success: { bg: '#d1fae5', fg: '#065f46' },
    primary: { bg: '#dbeafe', fg: '#2563eb' },
    warning: { bg: '#fef3c7', fg: '#c2410c' },
    danger: { bg: '#fee2e2', fg: '#991b1b' },
  }
  const c = colors[tone]
  return (
    <span className="perf-kpi-score" style={{ background: c.bg, color: c.fg }}>
      {score}
    </span>
  )
}

export function PerfScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return <RecruitHBar label={label} value={value} max={100} color={color} trailing={String(value)} />
}

export function PerfField({ label, children, required }: { label: string; children: ReactNode; required?: boolean }) {
  return (
    <label className="perf-field">
      <span>
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
    </label>
  )
}

export function PerfFieldRow({ children }: { children: ReactNode }) {
  return <div className="perf-field-row">{children}</div>
}
