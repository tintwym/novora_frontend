import type { ReactNode } from 'react'
import { EditIconBtn } from '../ui/EditIconBtn'
import { ViewIconBtn } from '../ui/ViewIconBtn'

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
  if (label === 'Edit') {
    return <EditIconBtn onClick={onClick} label={label} className="claim-icon-btn" />
  }
  if (label === 'View') {
    return <ViewIconBtn onClick={onClick} label={label} className="claim-icon-btn" />
  }

  return (
    <button type="button" className="claim-link-btn" onClick={onClick}>
      {label}
    </button>
  )
}

export function ClaimIcon({ name, className = '' }: { name: string; className?: string }) {
  const cls = `claim-icon${className ? ` ${className}` : ''}`
  if (name === 'paperclip') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'receipt') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 2v6h6M16 13H8M16 17H8" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'print') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M6 14h12v8H6z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'plus') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'check') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M22 4 12 14.01l-3-3" fill="none" stroke="currentColor" strokeWidth="2" />
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
  if (name === 'payroll') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M2 10h20" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'chart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M18 20V10M12 20V4M6 20v-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'history') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M3 3v5h5M12 7v5l4 2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return null
}
