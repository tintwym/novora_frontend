import { type ReactNode } from 'react'
import { EditIconBtn } from '../ui/EditIconBtn'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'

export function PaySubPills({
  labels,
  selected,
  onSelect,
  badgeIndex,
  badgeCount,
}: {
  labels: string[]
  selected: number
  onSelect: (i: number) => void
  badgeIndex?: number
  badgeCount?: number
}) {
  return (
    <div className="pay-sub-pills" role="tablist">
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={selected === i}
          className={selected === i ? 'active' : ''}
          onClick={() => onSelect(i)}
        >
          {label}
          {badgeIndex === i && badgeCount ? <span className="pay-sub-badge">{badgeCount}</span> : null}
        </button>
      ))}
    </div>
  )
}

export function PayCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`pay-card${className ? ` ${className}` : ''}`}>{children}</section>
}

export function PaySectionTitle({ title, trailing }: { title: string; trailing?: ReactNode }) {
  return (
    <div className="pay-section-head">
      <span className="pay-section-title">{title}</span>
      {trailing}
    </div>
  )
}

export function PayAttachmentZone({ iconColor, title, subtitle }: { iconColor: string; title: string; subtitle: string }) {
  return (
    <div className="pay-attach-zone">
      <span className="pay-attach-icon" style={{ background: `${iconColor}1f`, color: iconColor }}>
        <PayIcon name="paperclip" />
      </span>
      <strong>{title}</strong>
      <p>{subtitle}</p>
    </div>
  )
}

export function PayKv({ label, value }: { label: string; value: string }) {
  return (
    <div className="pay-kv">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function PayFormCard({ title, children, onSubmit }: { title: string; children: ReactNode; onSubmit?: () => void }) {
  return (
    <PayCard className="pay-form-card">
      <h3>{title}</h3>
      {children}
      {onSubmit ? (
        <button type="button" className="pay-navy-btn full" onClick={onSubmit}>
          Submit
        </button>
      ) : null}
    </PayCard>
  )
}

export function PayField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="pay-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function PayApproveReject() {
  return (
    <div className="pay-approve-reject">
      <button type="button" className="approve">
        Approve
      </button>
      <button type="button" className="reject">
        Reject
      </button>
    </div>
  )
}

export function PayYesNo({ yes }: { yes: boolean }) {
  return <RecruitPill label={yes ? 'Yes' : 'No'} tone={yes ? 'success' : 'neutral'} />
}

export function PayActive() {
  return <RecruitPill label="Active" tone="success" />
}

export function PayTableScroll({ children }: { children: ReactNode }) {
  return <div className="pay-table-scroll">{children}</div>
}

export function PayToolbarRow({ children }: { children: ReactNode }) {
  return <PayCard className="pay-toolbar-row">{children}</PayCard>
}

export function PayAddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="pay-primary-btn" onClick={onClick}>
      {label}
    </button>
  )
}

export function PayIcon({ name, className = '' }: { name: string; className?: string }) {
  const cls = `pay-icon${className ? ` ${className}` : ''}`
  if (name === 'paperclip') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'calculator') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <rect x="4" y="2" width="16" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h8" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'trend') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M3 3v18h18M7 16l4-4 4 4 5-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'download') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return null
}

export function PayEditBtn({ onClick, label = 'Edit' }: { onClick?: () => void; label?: string }) {
  return <EditIconBtn onClick={onClick} label={label} className="pay-icon-btn" />
}
