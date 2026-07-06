import type { ReactNode } from 'react'
import type { ReportExecutiveBriefing, ReportInsightMetric, ReportProgressBar, ReportQuickSnapshot } from '../../types/reports'

export function showReportToast(message: string) {
  window.alert(message)
}

export function RptSectionCaption({ children }: { children: ReactNode }) {
  return <h3 className="rpt-section-caption">{children}</h3>
}

export function RptHeroCard({
  categoryId,
  moduleId,
  moduleFilter,
  visibleModules,
  onCategoryChange,
  onModuleChange,
  onFilterChange,
}: {
  categoryId: string
  moduleId: string
  moduleFilter: string
  visibleModules: { id: string; label: string; icon: string }[]
  onCategoryChange: (id: string) => void
  onModuleChange: (id: string) => void
  onFilterChange: (v: string) => void
}) {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'core_hr', label: 'Core HR' },
    { id: 'financials', label: 'Financials & Benefits' },
    { id: 'talent_growth', label: 'Talent & Growth' },
    { id: 'support_engagement', label: 'Support & Engagement' },
  ]

  return (
    <section className="rpt-hero-card">
      <h2>Novora Reports Center</h2>
      <p className="rpt-hero-sub">Insights, analytics, and auto-generated data exports across all modules.</p>
      <div className="rpt-hero-filters">
        <div className="rpt-category-pills">
          {categories.map((c) => (
            <button key={c.id} type="button" className={categoryId === c.id ? 'active' : ''} onClick={() => onCategoryChange(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="rpt-module-search">
          <span aria-hidden>🔍</span>
          <input type="search" placeholder="Filter modules..." value={moduleFilter} onChange={(e) => onFilterChange(e.target.value)} aria-label="Filter modules" />
        </div>
      </div>
      <div className="rpt-module-chips">
        {visibleModules.map((m) => (
          <button key={m.id} type="button" className={moduleId === m.id ? 'active' : ''} onClick={() => onModuleChange(m.id)}>
            <span aria-hidden>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>
    </section>
  )
}

export function RptInsightCard({ metric }: { metric: ReportInsightMetric }) {
  return (
    <article className="rpt-insight-card">
      <span className="rpt-insight-label">{metric.label}</span>
      <strong>{metric.value}</strong>
      <em className={metric.subIsPositive === false ? 'neutral' : 'positive'}>{metric.sub}</em>
    </article>
  )
}

export function RptDownloadList({ items }: { items: { title: string; tag: string; description: string }[] }) {
  return (
    <div className="rpt-download-list">
      {items.map((item) => (
        <div key={item.title} className="rpt-download-row">
          <div>
            <div className="rpt-download-title">
              <strong>{item.title}</strong>
              <span className="rpt-tag">{item.tag}</span>
            </div>
            <p>{item.description}</p>
          </div>
          <button type="button" className="rpt-download-btn" aria-label={`Download ${item.title}`} onClick={() => showReportToast(`Downloading ${item.title}…`)}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

export function RptQuickSnapshot({ snapshot }: { snapshot: ReportQuickSnapshot }) {
  return (
    <div className="rpt-snapshot-card">
      <div className="rpt-kv">
        <span>{snapshot.totalRecordsLabel}</span>
        <strong>{snapshot.totalRecordsValue}</strong>
      </div>
      <div className="rpt-kv">
        <span>Last Updated</span>
        <strong className="positive">{snapshot.lastUpdated}</strong>
      </div>
      <div className="rpt-kv">
        <span>Auto-Run Status</span>
        <span className="rpt-status-pill">{snapshot.autoRunStatus}</span>
      </div>
      {snapshot.bars.length > 0 ? (
        <>
          <span className="rpt-distribution-title">{snapshot.distributionTitle}</span>
          <div className="rpt-bars">
            {snapshot.bars.map((bar) => (
              <RptProgressBar key={bar.label} bar={bar} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

export function RptProgressBar({ bar }: { bar: ReportProgressBar }) {
  return (
    <div className="rpt-bar-row">
      <div className="rpt-bar-head">
        <span>{bar.label}</span>
        <strong>{bar.detail}</strong>
      </div>
      <div className="rpt-bar-track">
        <span style={{ width: `${Math.round(bar.fraction * 100)}%`, background: bar.color }} />
      </div>
    </div>
  )
}

export function RptExecutiveBriefing({ briefing }: { briefing: ReportExecutiveBriefing }) {
  const riskClass = briefing.riskIsHigh ? 'high' : briefing.riskIsLow ? 'low' : 'medium'
  return (
    <div className="rpt-briefing-card">
      <div className="rpt-briefing-head">
        <span>
          <span aria-hidden>✦</span> EXECUTIVE BRIEFING
        </span>
        <span className={`rpt-risk-pill ${riskClass}`}>{briefing.riskLabel}</span>
      </div>
      <div className="rpt-brief-section">
        <small>STRATEGIC FOCUS DESK</small>
        <p>{briefing.strategicFocus}</p>
      </div>
      <div className="rpt-brief-section">
        <small>FINANCIAL BUDGET IMPACT</small>
        <p>{briefing.financialImpact}</p>
      </div>
      <small className="rpt-brief-directives-label">BOARD-LEVEL CORE DIRECTIVES</small>
      <ol className="rpt-directives">
        {briefing.directives.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ol>
    </div>
  )
}

export function RptFormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="rpt-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function RptSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select className="rpt-input" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}

export function RptInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input type="text" className="rpt-input" value={value} onChange={(e) => onChange(e.target.value)} />
}

export function RptCheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="rpt-check-row">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  )
}

export function RptFieldCheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className="rpt-field-check" onClick={() => onChange(!checked)}>
      <span>{label}</span>
      <span aria-hidden>{checked ? '✓' : '○'}</span>
    </button>
  )
}

export function RptOutlinedCard({ children }: { children: ReactNode }) {
  return <div className="rpt-outlined-card">{children}</div>
}
