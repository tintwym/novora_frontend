import type { ReactNode } from 'react'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'
import type { AssetPillTone } from '../../types/assets'

export function AstToolbarCard({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div className="ast-toolbar-card">
      <div className="ast-toolbar-left">{left}</div>
      {right ? <div className="ast-toolbar-right">{right}</div> : null}
    </div>
  )
}

export function AstTableCard({ children }: { children: ReactNode }) {
  return <div className="ast-table-card">{children}</div>
}

export function AstSearchInput({
  placeholder,
  value,
  onChange,
  className = '',
}: {
  placeholder: string
  value?: string
  onChange?: (v: string) => void
  className?: string
}) {
  return (
    <div className={`module-search${className ? ` ${className}` : ''}`}>
      <svg viewBox="0 0 24 24" aria-hidden className="module-search-icon">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
      </svg>
      <input
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  )
}

export function AstSelect({
  value,
  onChange,
  options,
  className = '',
  label,
}: {
  value: string
  onChange?: (v: string) => void
  options: string[]
  className?: string
  label?: string
}) {
  return (
    <select
      className={`ast-select${className ? ` ${className}` : ''}`}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      aria-label={label ?? value}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}

export function AstFilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ast-filter-group">
      <span className="ast-filter-label">{label}</span>
      {children}
    </div>
  )
}

export function AstStatusPill({ label, tone }: { label: string; tone: AssetPillTone }) {
  return <RecruitPill label={label} tone={tone} />
}

export function AstPrefixPill({ label }: { label: string }) {
  return <span className="ast-prefix-pill">{label}</span>
}

export function AstCountPill({ label }: { label: string }) {
  return <span className="ast-count-pill">{label}</span>
}

export function AstCustodianCell({ initials, name }: { initials?: string; name: string }) {
  if (!initials) return <span className="ast-muted">{name}</span>
  return (
    <span className="ast-custodian-cell">
      <span className="ast-avatar">{initials}</span>
      <strong>{name}</strong>
    </span>
  )
}

export function AstIconBtn({ onClick, label, children }: { onClick?: () => void; label: string; children: ReactNode }) {
  return (
    <button type="button" className="ast-icon-btn" onClick={onClick} aria-label={label}>
      {children}
    </button>
  )
}

export function AstOutlineBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" className="ast-outline-btn" onClick={onClick}>
      {children}
    </button>
  )
}

export function AstPrimaryBtn({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button type="button" className={`ast-primary-btn${className ? ` ${className}` : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

export function AstField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="ast-field">
      <span>
        {label}
        {required ? <em className="ast-req"> *</em> : null}
      </span>
      {children}
    </label>
  )
}

export function AstFieldRow({ children }: { children: ReactNode }) {
  return <div className="ast-field-row">{children}</div>
}

export function AstTableScroll({ children }: { children: ReactNode }) {
  return <div className="ast-table-scroll">{children}</div>
}

export function AstCheckboxCard({ checked, onChange, title, subtext }: { checked: boolean; onChange: (v: boolean) => void; title: string; subtext: string }) {
  return (
    <label className="ast-checkbox-card">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        <strong>{title}</strong>
        <small>{subtext}</small>
      </span>
    </label>
  )
}

export const AstCloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="ast-close-icon">
    <path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

export const AstClockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="ast-clock-icon">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12 6v6l4 2" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

export const AstEyeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

export const AstEditIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

export const AstTrashIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)
