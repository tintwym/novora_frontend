import type { ReactNode } from 'react'
import type { ReportExecutiveBriefing, ReportInsightMetric, ReportProgressBar, ReportQuickSnapshot } from '../../types/reports'
import { showActionToast } from '../../utils/actionToast'

export const showReportToast = showActionToast

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const RPT_ICONS: Record<string, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" {...stroke} />
      <line x1="16.5" y1="16.5" x2="21" y2="21" {...stroke} />
    </>
  ),
  spark: (
    <>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" {...stroke} />
      <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" {...stroke} />
    </>
  ),
  download: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" {...stroke} />,
  edit: (
    <>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" {...stroke} />
      <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" {...stroke} />
    </>
  ),
  trash: <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" {...stroke} />,
  reset: (
    <>
      <path d="M3 12a9 9 0 0115.5-6.5" {...stroke} />
      <path d="M18 3v4h-4" {...stroke} />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="10" {...stroke} />
      <path d="M9 12l2 2 4-4" {...stroke} />
    </>
  ),
  circle: <circle cx="12" cy="12" r="10" {...stroke} />,
  overview: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" {...stroke} />
      <rect x="14" y="3" width="7" height="7" rx="1" {...stroke} />
      <rect x="3" y="14" width="7" height="7" rx="1" {...stroke} />
      <rect x="14" y="14" width="7" height="7" rx="1" {...stroke} />
    </>
  ),
  employee: (
    <>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" {...stroke} />
      <circle cx="9" cy="7" r="4" {...stroke} />
    </>
  ),
  onboarding: (
    <>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" {...stroke} />
      <circle cx="9" cy="7" r="4" {...stroke} />
      <line x1="19" y1="8" x2="19" y2="14" {...stroke} />
      <line x1="22" y1="11" x2="16" y2="11" {...stroke} />
    </>
  ),
  attendance: (
    <>
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="M12 7v5l3 3" {...stroke} />
    </>
  ),
  leave: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" {...stroke} />
      <line x1="16" y1="2" x2="16" y2="6" {...stroke} />
      <line x1="8" y1="2" x2="8" y2="6" {...stroke} />
      <line x1="3" y1="10" x2="21" y2="10" {...stroke} />
    </>
  ),
  disciplinary: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...stroke} />
      <line x1="12" y1="8" x2="12" y2="12" {...stroke} />
    </>
  ),
  assets: (
    <>
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" {...stroke} />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" {...stroke} />
    </>
  ),
  payroll: (
    <>
      <line x1="12" y1="1" x2="12" y2="23" {...stroke} />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" {...stroke} />
    </>
  ),
  claims: (
    <>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" {...stroke} />
      <path d="M14 2v6h6M16 13H8M16 17H8" {...stroke} />
    </>
  ),
  benefits: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" {...stroke} />,
  recruitment: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" {...stroke} />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" {...stroke} />
    </>
  ),
  performance: (
    <>
      <path d="M3 3v18h18" {...stroke} />
      <path d="M7 16l4-4 4 4 5-6" {...stroke} />
    </>
  ),
  training: (
    <>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" {...stroke} />
      <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" {...stroke} />
    </>
  ),
  learning: (
    <>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" {...stroke} />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" {...stroke} />
    </>
  ),
  helpdesk: (
    <>
      <path d="M3 11h3a2 2 0 012 2v3a2 2 0 01-2 2H3v-7z" {...stroke} />
      <path d="M21 11h-3a2 2 0 00-2 2v3a2 2 0 002 2h3v-7z" {...stroke} />
      <path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z" {...stroke} />
    </>
  ),
  engagement: (
    <>
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" {...stroke} />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
    </>
  ),
}

export function RptIcon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`rpt-icon${className ? ` ${className}` : ''}`}>
      {RPT_ICONS[name] ?? RPT_ICONS.overview}
    </svg>
  )
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
          <RptIcon name="search" className="rpt-search-icon" />
          <input type="search" placeholder="Filter modules..." value={moduleFilter} onChange={(e) => onFilterChange(e.target.value)} aria-label="Filter modules" />
        </div>
      </div>
      <div className="rpt-module-chips">
        {visibleModules.map((m) => (
          <button key={m.id} type="button" className={moduleId === m.id ? 'active' : ''} onClick={() => onModuleChange(m.id)}>
            <RptIcon name={m.icon} className="rpt-chip-icon" />
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
        <span className="rpt-briefing-title">
          <RptIcon name="spark" className="rpt-briefing-spark" />
          EXECUTIVE BRIEFING
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
    <button type="button" className={`rpt-field-check${checked ? ' is-checked' : ''}`} onClick={() => onChange(!checked)}>
      <span>{label}</span>
      <RptIcon name={checked ? 'check' : 'circle'} className="rpt-field-check-icon" />
    </button>
  )
}

export function RptOutlinedCard({ children }: { children: ReactNode }) {
  return <div className="rpt-outlined-card">{children}</div>
}
