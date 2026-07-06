import type { ReactNode } from 'react'
import { RecruitHBar, RecruitPill } from '../recruitment/RecruitmentPrimitives'

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
  return <input type="search" className={`perf-search${className ? ` ${className}` : ''}`} placeholder={placeholder} />
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
