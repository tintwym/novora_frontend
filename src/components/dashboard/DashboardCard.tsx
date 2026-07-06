import type { ReactNode } from 'react'

type DashboardCardProps = {
  children: ReactNode
  className?: string
}

export function DashboardCard({ children, className = '' }: DashboardCardProps) {
  return <section className={`dash-card ${className}`.trim()}>{children}</section>
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="dash-section-title">{children}</h3>
}

export function LiveBadge() {
  return (
    <span className="dash-live-badge">
      <span className="dash-live-dot" aria-hidden />
      LIVE
    </span>
  )
}

type SectionLinkProps = {
  label: string
  onClick?: () => void
}

export function SectionLink({ label, onClick }: SectionLinkProps) {
  return (
    <button type="button" className="dash-section-link" onClick={onClick}>
      {label} ›
    </button>
  )
}

export function CardHeader({
  title,
  action,
}: {
  title: string
  action?: ReactNode
}) {
  return (
    <div className="dash-card-header">
      <SectionTitle>{title}</SectionTitle>
      {action}
    </div>
  )
}
