import { type CSSProperties, useMemo, useState } from 'react'
import { flattenOrgChart, mockOrgChartRoot } from '../../data/mockOrgChart'
import type { ChartLayout, OrgChartNode } from '../../types/orgChart'
import {
  DEPT_COUNT,
  DEPT_FILTERS,
  DEPT_SUMMARY,
  TOTAL_EMPLOYEES,
  deptPaletteForKey,
  deptPaletteForLabel,
  maxVisibleGrandchildren,
  showMemberCounts,
} from '../../types/orgChart'

type OrganisationChartTabProps = {
  onOpenProfile?: (employeeId: string | null) => void
}

const LAYOUTS: { id: ChartLayout; label: string }[] = [
  { id: 'concise', label: 'CONCISE' },
  { id: 'small', label: 'SMALL' },
  { id: 'standard', label: 'STANDARD' },
]

const LEGEND_DEPTS = ['Engineering', 'Finance', 'HR', 'Marketing', 'Operations']

export function OrganisationChartTab({ onOpenProfile }: OrganisationChartTabProps) {
  const [search, setSearch] = useState('')
  const [orgView, setOrgView] = useState(true)
  const [deptFilter, setDeptFilter] = useState<string>('All')
  const [layout, setLayout] = useState<ChartLayout>('standard')
  const [zoomFit, setZoomFit] = useState(true)
  const [selected, setSelected] = useState<OrgChartNode | null>(null)

  const root = useMemo(() => mockOrgChartRoot(), [])

  const visibleHeads = useMemo(() => {
    const heads = root.children ?? []
    if (deptFilter === 'All') return heads
    return heads.filter((h) => h.deptLabel === deptFilter)
  }, [root, deptFilter])

  const listRows = useMemo(() => {
    return flattenOrgChart(root)
      .filter((n) => !n.isOpenPosition)
      .filter((n) => deptFilter === 'All' || n.deptLabel === deptFilter)
      .filter((n) => nodeMatchesSearch(n, search))
  }, [root, deptFilter, search])

  return (
    <div className="org-chart-tab">
      <div className="org-chart-scroll">
        <div className="org-chart-toolbar">
          <div className="org-chart-search">
            <svg viewBox="0 0 24 24" aria-hidden>
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
            </svg>
            <input
              type="search"
              placeholder="Find person..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="org-view-toggle" role="group" aria-label="View mode">
            <button type="button" className={orgView ? 'active' : ''} onClick={() => setOrgView(true)}>
              Org view
            </button>
            <button type="button" className={!orgView ? 'active' : ''} onClick={() => setOrgView(false)}>
              List view
            </button>
          </div>
        </div>

        <div className="org-filter-panel">
          <div className="org-filter-bar">
            <span className="org-filter-label">DEPARTMENT:</span>
            {DEPT_FILTERS.map((d) => (
              <button
                key={d}
                type="button"
                className={`org-filter-chip${deptFilter === d ? ' active' : ''}${d === 'All' && deptFilter === 'All' ? ' active-all' : ''}`}
                onClick={() => setDeptFilter(d)}
              >
                {d}
              </button>
            ))}
          </div>
          <p className="org-filter-meta-center">
            {TOTAL_EMPLOYEES.toLocaleString()} employees · {DEPT_COUNT} departments
          </p>
        </div>

        {orgView ? (
          <div className="org-chart-card">
            <div className="org-chart-layout-bar">
              <span className="org-layout-label">CHART LAYOUT SIZING:</span>
              {LAYOUTS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className={`org-layout-chip${layout === l.id ? ' active' : ''}`}
                  onClick={() => setLayout(l.id)}
                >
                  {l.label}
                </button>
              ))}
              <button
                type="button"
                className={`org-zoom-badge${zoomFit ? ' on' : ''}`}
                onClick={() => setZoomFit((v) => !v)}
                aria-pressed={zoomFit}
              >
                <span aria-hidden />
                SMOOTH ZOOM FIT
              </button>
            </div>

            <div className={`org-chart-viewport org-layout-${layout}${zoomFit ? ' zoom-fit' : ''}`}>
              <div className="org-tree">
                <div className="org-tree-ceo">
                  <OrgNodeCard
                    node={root}
                    isCeo
                    selectedId={selected?.id}
                    onSelect={setSelected}
                    layout={layout}
                  />
                </div>
                {visibleHeads.length > 0 ? (
                  <>
                    <div className="org-tree-rail" aria-hidden>
                      <span className="org-tree-rail-down" />
                      <span
                        className="org-tree-rail-across"
                        style={{ '--org-cols': visibleHeads.length } as CSSProperties}
                      />
                    </div>
                    <div
                      className="org-tree-columns"
                      style={{ '--org-cols': visibleHeads.length } as CSSProperties}
                    >
                      {visibleHeads.map((head) => (
                        <DeptColumn
                          key={head.id}
                          head={head}
                          layout={layout}
                          search={search}
                          selectedId={selected?.id}
                          onSelect={setSelected}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="org-chart-empty">No departments match this filter.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="org-list-card">
            <table className="org-list-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>TITLE</th>
                  <th>DEPARTMENT</th>
                  <th>REPORTS TO</th>
                </tr>
              </thead>
              <tbody>
                {listRows.map((row) => (
                  <tr
                    key={row.id}
                    className={selected?.id === row.id ? 'selected' : ''}
                    onClick={() => setSelected(row)}
                  >
                    <td className="org-list-name">{row.name}</td>
                    <td>{row.role}</td>
                    <td>{row.deptLabel}</td>
                    <td>{row.reportsToName ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {listRows.length === 0 ? <p className="org-chart-empty">No people match your filters.</p> : null}
          </div>
        )}

        <div className="org-summary-row">
          {Object.entries(DEPT_SUMMARY).map(([label, count]) => (
            <SummaryCard key={label} label={label} count={count} accent={deptPaletteForLabel(label).accent} />
          ))}
          <SummaryCard label="Total" count={TOTAL_EMPLOYEES} accent="#1e3a5f" emphasized />
        </div>

        <div className="org-chart-footer">
          <p className="org-footnote">Click any node to view details · Dashed lines = direct reports</p>
          <div className="org-legend">
            {LEGEND_DEPTS.map((dept) => {
              const p = deptPaletteForLabel(dept)
              return (
                <span key={dept} className="org-legend-item">
                  <i style={{ background: p.cardBg, borderColor: p.border }} aria-hidden />
                  {dept}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {selected ? (
        <DetailPanel
          node={selected}
          onClose={() => setSelected(null)}
          onOpenProfile={() => {
            if (selected.isOpenPosition) return
            onOpenProfile?.(selected.id === 'sarah' ? null : selected.id)
          }}
        />
      ) : null}
    </div>
  )
}

function DeptColumn({
  head,
  layout,
  search,
  selectedId,
  onSelect,
}: {
  head: OrgChartNode
  layout: ChartLayout
  search: string
  selectedId?: string
  onSelect: (n: OrgChartNode) => void
}) {
  const maxGrand = maxVisibleGrandchildren(layout)
  const compactGrand = layout !== 'standard'
  const children = (head.children ?? []).filter((c) => nodeMatchesSearch(c, search))

  return (
    <div className="org-dept-column">
      <span className="org-col-stub" aria-hidden />
      <OrgNodeCard node={head} selectedId={selectedId} onSelect={onSelect} layout={layout} />
      {children.length > 0 ? (
        <>
          <div className="org-col-connector" aria-hidden />
          <div className={`org-children-row${layout === 'concise' ? ' stacked' : ''}`}>
            {children.map((child) => {
              const grandchildren = child.children ?? []
              const visibleGrand = grandchildren.slice(0, maxGrand)
              const extra =
                child.moreCount && child.moreCount > 0
                  ? child.moreCount
                  : Math.max(0, grandchildren.length - maxGrand)

              return (
                <div key={child.id} className="org-child-block">
                  <OrgNodeCard node={child} selectedId={selectedId} onSelect={onSelect} layout={layout} />
                  {visibleGrand.length > 0 || extra > 0 ? (
                    <div className="org-grandchildren">
                      {visibleGrand.map((g) => (
                        <OrgNodeCard
                          key={g.id}
                          node={g}
                          compact={compactGrand}
                          selectedId={selectedId}
                          onSelect={onSelect}
                          layout={layout}
                        />
                      ))}
                      {extra > 0 ? (
                        <button
                          type="button"
                          className="org-more-btn"
                          onClick={() => onSelect(child)}
                        >
                          +{extra} more members
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}

function OrgNodeCard({
  node,
  isCeo = false,
  compact = false,
  selectedId,
  onSelect,
  layout,
}: {
  node: OrgChartNode
  isCeo?: boolean
  compact?: boolean
  selectedId?: string
  onSelect: (n: OrgChartNode) => void
  layout: ChartLayout
}) {
  const palette = deptPaletteForKey(node.deptKey)
  const selected = selectedId === node.id
  const showCounts = showMemberCounts(layout) && !compact && node.memberCount != null

  if (node.isOpenPosition) {
    return (
      <button
        type="button"
        className={`org-node org-node-open${selected ? ' selected' : ''}${compact ? ' compact' : ''}`}
        onClick={() => onSelect(node)}
      >
        <span aria-hidden>+</span>
        Open position
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`org-node${isCeo ? ' ceo' : ''}${compact ? ' compact' : ''}${selected ? ' selected' : ''}`}
      style={
        isCeo
          ? undefined
          : ({
              '--org-card-bg': palette.cardBg,
              '--org-card-border': palette.border,
              '--org-card-text': palette.text,
              '--org-avatar-bg': palette.avatarBg,
              '--org-avatar-fg': palette.avatarFg,
            } as CSSProperties)
      }
      onClick={() => onSelect(node)}
    >
      <span className="org-node-avatar">{node.initials}</span>
      <span className="org-node-body">
        <strong>{node.name}</strong>
        <span>{node.role}</span>
        {showCounts ? <em>{node.memberCount} members</em> : null}
      </span>
    </button>
  )
}

function SummaryCard({
  label,
  count,
  accent,
  emphasized = false,
}: {
  label: string
  count: number
  accent: string
  emphasized?: boolean
}) {
  return (
    <div className={`org-summary-card${emphasized ? ' emphasized' : ''}`}>
      <span className="org-summary-accent" style={{ background: accent }} aria-hidden />
      <span className="org-summary-label">{label}</span>
      <strong>{count.toLocaleString()}</strong>
    </div>
  )
}

function DetailPanel({
  node,
  onClose,
  onOpenProfile,
}: {
  node: OrgChartNode
  onClose: () => void
  onOpenProfile: () => void
}) {
  const palette = deptPaletteForKey(node.deptKey)

  return (
    <div className="org-detail-panel">
      <div
        className="org-detail-avatar"
        style={{
          background: node.isOpenPosition ? undefined : palette.avatarBg,
          color: palette.avatarFg,
        }}
      >
        {node.isOpenPosition ? '+' : node.initials}
      </div>
      <div className="org-detail-body">
        <div className="org-detail-head">
          <h3>{node.isOpenPosition ? 'Open Position' : node.name}</h3>
          <span className="org-detail-status">Active</span>
          <button type="button" className="org-detail-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <p className="org-detail-role">{node.role}</p>
        <p className="org-detail-meta">
          Dept: {node.deptLabel} · Grade: {node.grade ?? '—'} · Since: {node.since ?? '—'} · Team:{' '}
          {node.team ?? '—'}
        </p>
        {!node.isOpenPosition ? (
          <button type="button" className="org-detail-profile-btn" onClick={onOpenProfile}>
            View full profile ↗
          </button>
        ) : null}
      </div>
    </div>
  )
}

function nodeMatchesSearch(node: OrgChartNode, search: string): boolean {
  const q = search.trim().toLowerCase()
  if (!q) return true
  return node.name.toLowerCase().includes(q) || node.role.toLowerCase().includes(q)
}
