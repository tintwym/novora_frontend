import type { ReactNode } from 'react'

export function ClaimCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`claim-card${className ? ` ${className}` : ''}`}>{children}</section>
}

export function ClaimSectionTitle({ title, trailing }: { title: string; trailing?: ReactNode }) {
  return (
    <div className="claim-section-head">
      <span className="claim-section-title">{title}</span>
      {trailing}
    </div>
  )
}

export function ClaimField({ label, children, required }: { label: string; children: ReactNode; required?: boolean }) {
  return (
    <label className="claim-field">
      <span>
        {label}
        {required ? <em>*</em> : null}
      </span>
      {children}
    </label>
  )
}

export function ClaimAvatar({ initials, name, sub }: { initials: string; name: string; sub?: string }) {
  return (
    <span className="claim-avatar-cell">
      <span className="claim-avatar">{initials}</span>
      <span>
        <strong>{name}</strong>
        {sub ? <em>{sub}</em> : null}
      </span>
    </span>
  )
}

export function ClaimTableScroll({ children }: { children: ReactNode }) {
  return <div className="claim-table-scroll">{children}</div>
}

export function ClaimToolbarRow({ children }: { children: ReactNode }) {
  return <ClaimCard className="claim-toolbar-row">{children}</ClaimCard>
}

export function ClaimLinkBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button type="button" className="claim-link-btn" onClick={onClick}>
      {label}
    </button>
  )
}
