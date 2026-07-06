import type { ReactNode } from 'react'
import { RecruitHBar, RecruitIconKpi } from '../recruitment/RecruitmentPrimitives'

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
      <em>ACTIVE RECRUITER</em>
    </div>
  )
}

export function HdKpiRow({ showProgress = false }: { showProgress?: boolean }) {
  return (
    <div className="hd-kpi-row">
      <RecruitIconKpi title="Active Tickets Log" value="5" subtext="Total reported" icon="🎫" iconColor="#2563eb" />
      <RecruitIconKpi
        title="Unassigned Open"
        value="2"
        subtext="Queue"
        icon="📥"
        iconColor="#ea580c"
        valueTone="warning"
      />
      <RecruitIconKpi
        title="SLA Breached / Warning"
        value="1"
        subtext="Action Req"
        icon="⚠"
        iconColor="#dc2626"
        valueTone="danger"
      />
      <article className="hd-resolution-kpi">
        <div className="hd-resolution-top">
          <div>
            <span className="recruit-kpi-title">Closed Resolution Rate</span>
            <strong>40%</strong>
            <span className="muted">Target 90%+</span>
          </div>
          <span className="recruit-kpi-icon" style={{ background: '#2563eb1f', color: '#2563eb' }}>
            ✓
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
