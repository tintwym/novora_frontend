import { type ReactNode } from 'react'
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

export function PayAttachmentZone({ icon, iconColor, title, subtitle }: { icon: string; iconColor: string; title: string; subtitle: string }) {
  return (
    <div className="pay-attach-zone">
      <span className="pay-attach-icon" style={{ background: `${iconColor}1f`, color: iconColor }}>
        {icon}
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
    <button type="button" className="pay-navy-btn" onClick={onClick}>
      {label}
    </button>
  )
}
