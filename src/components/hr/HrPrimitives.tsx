import type { ReactNode } from 'react'

export function HrPill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'taxYes' | 'taxNo'
}) {
  return <span className={`hr-pill hr-pill-${tone}`}>{children}</span>
}

export function HrEditLink({ onClick, label = 'Edit' }: { onClick?: () => void; label?: string }) {
  return (
    <button type="button" className="hr-edit-link" onClick={onClick}>
      <svg viewBox="0 0 24 24" aria-hidden>
        <path
          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      {label}
    </button>
  )
}

export function HrCard({
  title,
  subtitle,
  trailing,
  children,
}: {
  title: string
  subtitle?: string
  trailing?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="hr-card">
      <div className="hr-card-head">
        <div>
          <h3 className="hr-card-title">{title}</h3>
          {subtitle ? <p className="hr-card-sub">{subtitle}</p> : null}
        </div>
        {trailing}
      </div>
      {children}
    </section>
  )
}

export function HrKvGrid({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="hr-kv-grid">
      {rows.map((row) => (
        <div key={row.label} className="hr-kv-row">
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function HrProgressBar({
  percent,
  color = 'blue',
  label,
  right,
}: {
  percent: number
  color?: 'blue' | 'green' | 'orange' | 'purple'
  label: string
  right?: string
}) {
  return (
    <div className="hr-progress">
      <div className="hr-progress-head">
        <span>{label}</span>
        {right ? <span className="hr-progress-right">{right}</span> : null}
      </div>
      <div className="hr-progress-track">
        <span className={`hr-progress-fill hr-progress-${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export function HrToolbarPill({
  children,
  variant = 'filter',
  onClick,
}: {
  children: ReactNode
  variant?: 'filter' | 'export'
  onClick?: () => void
}) {
  return (
    <button type="button" className={`hr-toolbar-pill hr-toolbar-pill-${variant}`} onClick={onClick}>
      {children}
    </button>
  )
}

export function HrAddButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button type="button" className="hr-add-btn" onClick={onClick}>
      + {label}
    </button>
  )
}

export function HrDataTable({
  columns,
  rows,
}: {
  columns: string[]
  rows: ReactNode[][]
}) {
  return (
    <div className="hr-table-wrap">
      <table className="hr-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i}>
              {cells.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function HrIconBtn({ label, onClick, children }: { label: string; onClick?: () => void; children: ReactNode }) {
  return (
    <button type="button" className="hr-icon-btn" aria-label={label} onClick={onClick}>
      {children}
    </button>
  )
}
