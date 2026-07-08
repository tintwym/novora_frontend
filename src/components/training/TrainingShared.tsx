import type { ReactNode } from 'react'
import { EditIconBtn } from '../ui/EditIconBtn'
import { ViewIconBtn } from '../ui/ViewIconBtn'
import { RecruitHBar, RecruitPill } from '../recruitment/RecruitmentPrimitives'

export function TrainIcon({ name, className = '' }: { name: string; className?: string }) {
  const cls = `train-icon${className ? ` ${className}` : ''}`
  if (name === 'search') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m21 21-4.35-4.35" fill="none" stroke="currentColor" strokeWidth="2" />
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
  if (name === 'chart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M3 3v18h18M7 16l4-4 4 4 5-6" fill="none" stroke="currentColor" strokeWidth="2" />
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
  if (name === 'graduation') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'dollar') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'trend') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M3 17l6-6 4 4 8-8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 7h7v7" fill="none" stroke="currentColor" strokeWidth="2" />
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
  if (name === 'check') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    )
  }
  if (name === 'x') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'download') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cls}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function TrainProgressKpi({
  title,
  value,
  subtext,
  icon,
  iconColor,
  progress,
  segments,
}: {
  title: string
  value: string
  subtext: string
  icon: string
  iconColor: string
  progress?: number
  segments?: { pct: number; color: string }[]
}) {
  return (
    <article className="recruit-kpi-card train-progress-kpi">
      <div className="recruit-kpi-top">
        <div>
          <span className="recruit-kpi-title">{title}</span>
          <strong>{value}</strong>
          <span className="muted">{subtext}</span>
        </div>
        <span className="recruit-kpi-icon" style={{ background: `${iconColor}1f`, color: iconColor }}>
          <TrainIcon name={icon} />
        </span>
      </div>
      <div className="train-progress-track">
        {segments ? (
          segments.map((seg, i) => (
            <span key={i} style={{ width: `${seg.pct}%`, background: seg.color }} />
          ))
        ) : (
          <span style={{ width: `${progress ?? 0}%`, background: iconColor }} />
        )}
      </div>
    </article>
  )
}

export function TrainHBar({ label, pct, color, trailing }: { label: string; pct: number; color: string; trailing: string }) {
  return <RecruitHBar label={label} value={pct} max={100} color={color} trailing={trailing} />
}

export function TrainToolbarCard({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div className="train-toolbar-card">
      <div className="train-toolbar-left">{left}</div>
      {right ? <div className="train-toolbar-right">{right}</div> : null}
    </div>
  )
}

export function TrainTableCard({ children }: { children: ReactNode }) {
  return <div className="train-table-card">{children}</div>
}

export function TrainSearchInput({ placeholder, className = '' }: { placeholder: string; className?: string }) {
  return (
    <div className={`train-search${className ? ` ${className}` : ''}`}>
      <TrainIcon name="search" className="train-search-icon" />
      <input type="search" placeholder={placeholder} aria-label={placeholder} />
    </div>
  )
}

export function TrainSelect({ defaultValue, options, className = '', label }: { defaultValue: string; options: string[]; className?: string; label?: string }) {
  return (
    <select className={`train-select${className ? ` ${className}` : ''}`} defaultValue={defaultValue} aria-label={label ?? defaultValue}>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}

export function TrainEmpCell({ initials, name, color }: { initials: string; name: string; color: string }) {
  return (
    <span className="train-emp-cell">
      <span className="train-avatar" style={{ background: `${color}33`, color }}>
        {initials}
      </span>
      <strong>{name}</strong>
    </span>
  )
}

export function TrainStatusPill({ label, tone }: { label: string; tone: Parameters<typeof RecruitPill>[0]['tone'] }) {
  return <RecruitPill label={label} tone={tone} />
}

export function TrainEditBtn({ onClick, label = 'Edit' }: { onClick?: () => void; label?: string }) {
  if (label === 'View') {
    return <ViewIconBtn onClick={onClick} label={label} className="train-edit-btn" />
  }
  if (label !== 'Edit') {
    return (
      <button type="button" className="train-link-btn" onClick={onClick}>
        {label}
      </button>
    )
  }

  return <EditIconBtn onClick={onClick} label={label} className="train-edit-btn" />
}

export function TrainOutlineBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" className="train-outline-btn" onClick={onClick}>
      {children}
    </button>
  )
}

export function TrainPrimaryBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" className="train-primary-btn" onClick={onClick}>
      {children}
    </button>
  )
}

export function TrainField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="train-field">
      <span>
        {label}
        {required ? <em className="train-req"> *</em> : null}
      </span>
      {children}
    </label>
  )
}

export function TrainFieldRow({ children }: { children: ReactNode }) {
  return <div className="train-field-row">{children}</div>
}

export function TrainSectionPill({ children }: { children: ReactNode }) {
  return <span className="train-section-pill">{children}</span>
}

export function TrainTableScroll({ children }: { children: ReactNode }) {
  return <div className="train-table-scroll">{children}</div>
}

export function TrainApprovers({ approvers }: { approvers: { name: string; approved: boolean }[] }) {
  return (
    <div className="train-approvers">
      {approvers.map((a) => (
        <span key={a.name} className={a.approved ? 'approved' : 'pending'}>
          <span className="train-approver-dot" aria-hidden />
          {a.approved ? (
            <>
              {a.name} <TrainIcon name="check" className="train-inline-check" />
            </>
          ) : (
            a.name
          )}
        </span>
      ))}
    </div>
  )
}
