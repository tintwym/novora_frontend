import type { ReactNode } from 'react'
import { RecruitHBar, RecruitIconKpi, RecruitKpiIcon } from '../recruitment/RecruitmentPrimitives'

export function HdIcon({ name, className = '' }: { name: string; className?: string }) {
  const cls = `hd-icon${className ? ` ${className}` : ''}`
  if (name === 'tickets') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'documents') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 2v6h6M16 13H8M16 17H8" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'analytics') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'knowledge') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'filter') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'search') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m21 21-4.35-4.35" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'document') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'paperclip') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'send') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="m22 2-7 20-4-9-9-4 20-7z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'warning') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 9v4M12 17h.01" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'book') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'chevron') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cls}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function HdCard({ children, className = '', padding }: { children: ReactNode; className?: string; padding?: string }) {
  return (
    <section className={`hd-card${className ? ` ${className}` : ''}`} style={padding ? { padding } : undefined}>
      {children}
    </section>
  )
}

export function HdSectionTitle({ title, subtitle, trailing }: { title: string; subtitle?: string; trailing?: ReactNode }) {
  return (
    <div className="hd-section-head">
      <div>
        <span className="hd-section-title">{title}</span>
        {subtitle ? <p className="hd-muted">{subtitle}</p> : null}
      </div>
      {trailing}
    </div>
  )
}

export function HdField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="hd-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function HdAvatar({ initials, tone = 'default' }: { initials: string; tone?: 'default' | 'blue' }) {
  return <span className={`hd-avatar${tone === 'blue' ? ' blue' : ''}`}>{initials}</span>
}

export function HdTableScroll({ children }: { children: ReactNode }) {
  return <div className="hd-table-scroll">{children}</div>
}

export function HdAutoRoutePill() {
  return (
    <div className="hd-auto-route">
      <span>AUTO-ROUTE RULE:</span>
      <em>ACTIVE SLA ENGINE</em>
    </div>
  )
}

export function HdKpiRow({ showProgress = false }: { showProgress?: boolean }) {
  return (
    <div className="hd-kpi-row">
      <RecruitIconKpi title="Active Tickets Log" value="5" subtext="Total reported" icon="ticket" iconColor="#2563eb" />
      <RecruitIconKpi
        title="Unassigned Open"
        value="2"
        subtext="Queue"
        icon="inbox"
        iconColor="#ea580c"
        valueTone="warning"
        trendTone="warning"
      />
      <RecruitIconKpi
        title="SLA Breached / Warning"
        value="1"
        subtext="Action Req"
        icon="alert"
        iconColor="#dc2626"
        valueTone="danger"
        trendTone="danger"
      />
      <article className="hd-resolution-kpi">
        <div className="hd-resolution-top">
          <div>
            <span className="recruit-kpi-title">Closed Resolution Rate</span>
            <strong>40%</strong>
            <span className="muted">Target 90%+</span>
          </div>
          <span className="recruit-kpi-icon" style={{ background: '#2563eb1f', color: '#2563eb' }}>
            <RecruitKpiIcon name="check" />
          </span>
        </div>
        {showProgress ? (
          <div className="hd-resolution-track">
            <span style={{ width: '40%' }} />
          </div>
        ) : null}
      </article>
    </div>
  )
}

export function HdHBar({ label, pct, color, trailing }: { label: string; pct: number; color: string; trailing: string }) {
  return <RecruitHBar label={label} value={pct} max={100} color={color} trailing={trailing} />
}

export function HdDonut({ pct, label }: { pct: number; label: string }) {
  return (
    <div className="hd-donut" style={{ background: `conic-gradient(#059669 0 ${pct}%, #e2e8f0 ${pct}% 100%)` }}>
      <div className="hd-donut-inner">
        <strong>{pct}%</strong>
        <em>{label}</em>
      </div>
    </div>
  )
}
