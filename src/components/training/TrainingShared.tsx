import type { ReactNode } from 'react'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'

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
      <span aria-hidden>🔍</span>
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
  return (
    <button type="button" className="train-edit-btn" onClick={onClick}>
      {label}
    </button>
  )
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
          {a.approved ? '✓ ' : ''}
          {a.name}
        </span>
      ))}
    </div>
  )
}
