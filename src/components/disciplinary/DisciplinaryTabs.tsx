import { useEffect, useState, type ReactNode } from 'react'
import { EditIconBtn } from '../ui/EditIconBtn'
import { ViewIconBtn } from '../ui/ViewIconBtn'
import {
  DEPT_DISCIPLINARY,
  DISCIPLINARY_HISTORY,
  DISCIPLINARY_LOGS,
  DISCIPLINARY_REASONS,
  RECENT_CASES,
  SUMMARY_BALANCE,
  WARNING_ACTIONS,
  WARNING_GUIDE,
  WARNING_LEVEL_OPTIONS,
} from '../../data/mockDisciplinary'
import type { DisciplinaryHistoryRow } from '../../types/disciplinary'
import { RecruitIconKpi, RecruitPill } from '../recruitment/RecruitmentPrimitives'
import {
  AddDisciplinaryReasonModal,
  AddWarningParameterModal,
  EditDisciplinaryReasonModal,
  EditWarningParameterModal,
  ViewDisciplinaryRecordModal,
} from './DisciplinaryModals'

export function DisciplinaryReasonTab({ addSignal = 0 }: { addSignal?: number }) {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editRow, setEditRow] = useState(DISCIPLINARY_REASONS[0])

  useEffect(() => {
    if (addSignal > 0) setAddOpen(true)
  }, [addSignal])

  return (
    <>
      <DiscCard className="disc-sub-toolbar">
        <input type="search" placeholder="Search reason..." className="disc-search" />
        <label className="disc-filter-label">
          Severity:
          <select defaultValue="All severity">
            <option>All severity</option>
            <option>Minor</option>
            <option>Major</option>
            <option>Gross misconduct</option>
          </select>
        </label>
      </DiscCard>
      <DiscCard>
        <div className="disc-table-scroll">
          <table className="disc-table">
            <thead>
              <tr>
                <th>REASON / OFFENCE</th>
                <th>SEVERITY LEVEL</th>
                <th>DESCRIPTION</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {DISCIPLINARY_REASONS.map((row) => (
                <tr key={row.name}>
                  <td>
                    <ReasonDot name={row.name} color={row.dotColor} />
                  </td>
                  <td>
                    <RecruitPill label={row.severity} tone={row.severityTone} />
                  </td>
                  <td>{row.description}</td>
                  <td>
                    <RecruitPill label={row.status} tone={row.statusTone} />
                  </td>
                  <td>
                    <EditIconBtn
                      className="disc-icon-btn"
                      onClick={() => {
                        setEditRow(row)
                        setEditOpen(true)
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DiscCard>
      <AddDisciplinaryReasonModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditDisciplinaryReasonModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        name={editRow.name}
        severity={editRow.severity}
        status={editRow.status}
        description={editRow.description}
      />
    </>
  )
}

export function DisciplinaryActionTab({ addSignal = 0 }: { addSignal?: number }) {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editRow, setEditRow] = useState(WARNING_ACTIONS[0])

  useEffect(() => {
    if (addSignal > 0) setAddOpen(true)
  }, [addSignal])

  return (
    <>
      <DiscCard className="disc-sub-toolbar">
        <p className="disc-muted inline">Warning parameters matrix matching standard corporate audit protocols</p>
        <label className="disc-filter-label">
          Action Type:
          <select defaultValue="All actions">
            <option>All actions</option>
            <option>Verbal</option>
            <option>Written</option>
          </select>
        </label>
      </DiscCard>
      <DiscCard>
        <div className="disc-table-scroll">
          <table className="disc-table">
            <thead>
              <tr>
                <th>LEVEL</th>
                <th>ACTION NAME</th>
                <th>ACTION TYPE</th>
                <th>DESCRIPTION</th>
                <th>PAY IMPACT</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {WARNING_ACTIONS.map((row) => (
                <tr key={row.level}>
                  <td>
                    <strong>{row.level}</strong>
                  </td>
                  <td>
                    <strong>{row.name}</strong>
                  </td>
                  <td>
                    <RecruitPill label={row.type} tone="info" />
                  </td>
                  <td>{row.description}</td>
                  <td>
                    <RecruitPill label={row.payImpact} tone={row.payTone} />
                  </td>
                  <td>
                    <EditIconBtn
                      className="disc-icon-btn"
                      onClick={() => {
                        setEditRow(row)
                        setEditOpen(true)
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DiscCard>
      <AddWarningParameterModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditWarningParameterModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        level={editRow.level}
        name={editRow.name}
        type={editRow.type}
        payImpact={editRow.payImpact}
        description={editRow.description}
      />
    </>
  )
}

export function DisciplinarySetupTab() {
  return (
    <div className="disc-split setup">
      <DiscCard>
        <h3>Disciplinary Case Form</h3>
        <p className="disc-muted">Create a formal incident log and configure standard warning actions.</p>
        <SectionPill label="Employee information" />
        <label className="disc-field">
          <span>Employee *</span>
          <select defaultValue="">
            <option value="">-- Select employee --</option>
            <option>Ahmad Luqman</option>
            <option>Zara Nor</option>
          </select>
        </label>
        <label className="disc-field">
          <span>Department</span>
          <input type="text" defaultValue="Operations" readOnly />
        </label>
        <SectionPill label="Incident details" />
        <label className="disc-field">
          <span>Disciplinary reason *</span>
          <select defaultValue="">
            <option value="">-- Select reason --</option>
            <option>Unauthorised absence</option>
          </select>
        </label>
        <div className="disc-field-row">
          <label className="disc-field">
            <span>Date of incident *</span>
            <input type="text" defaultValue="13/06/2026" />
          </label>
          <label className="disc-field">
            <span>Location / site</span>
            <input type="text" placeholder="e.g. HQ, Level 3" />
          </label>
        </div>
        <div className="disc-field-row">
          <label className="disc-field">
            <span>From time</span>
            <input type="text" defaultValue="09:00 AM" />
          </label>
          <label className="disc-field">
            <span>To time</span>
            <input type="text" defaultValue="10:00 AM" />
          </label>
        </div>
        <label className="disc-field">
          <span>Incident description *</span>
          <textarea rows={4} placeholder="Describe the incident in detail..." />
        </label>
        <label className="disc-field">
          <span>Witnesses involved (optional)</span>
          <select multiple size={3}>
            <option>Kevin Lim (EMP-0036)</option>
            <option>Siti Aminah (EMP-0122)</option>
            <option>Zara Nor (EMP-0142)</option>
          </select>
          <em className="disc-hint">Hold Ctrl/Cmd to select multiple witnesses.</em>
        </label>
        <SectionPill label="Action & follow-up" />
        <div className="disc-field-row">
          <label className="disc-field">
            <span>Level of disciplinary *</span>
            <select defaultValue="L1 — Verbal warning">
              <option>L1 — Verbal warning</option>
              <option>L2 — First written warning</option>
            </select>
          </label>
          <label className="disc-field">
            <span>Action issued by *</span>
            <select defaultValue="Nina Reza (Head of HR)">
              <option>Nina Reza (Head of HR)</option>
            </select>
          </label>
        </div>
        <div className="disc-field-row">
          <label className="disc-field">
            <span>Action date *</span>
            <input type="text" defaultValue="14/06/2026" />
          </label>
          <label className="disc-field">
            <span>If repeated, next action</span>
            <select defaultValue="First written warning">
              <option>First written warning</option>
            </select>
          </label>
        </div>
        <label className="disc-field">
          <span>Statement of future expectation</span>
          <textarea rows={3} placeholder="Describe mandatory improvements required by resource..." />
        </label>
        <SectionPill label="Supporting document" />
        <div className="disc-upload-zone">
          <DiscActionIcon name="paperclip" className="disc-upload-icon" />
          <strong>Click to attach file or drag-and-drop</strong>
          <p>Supports PDF, DOCX, PNG up to 10MB.</p>
        </div>
        <div className="disc-action-group end">
          <button type="button" className="disc-outline-btn">
            Cancel
          </button>
          <button type="button" className="disc-primary-btn">
            Save Disciplinary Case
          </button>
        </div>
      </DiscCard>
      <div>
        <DiscCard>
          <h3 className="disc-guide-title">
            <DiscActionIcon name="shield" className="disc-guide-icon" />
            Warning level guide
          </h3>
          <p className="disc-muted">Standard guidelines for issuing warning protocols.</p>
          {WARNING_GUIDE.map((g) => (
            <div key={g.level} className="disc-guide-row">
              <span>{g.level}</span>
              <div>
                <strong>{g.title}</strong>
                <em>{g.desc}</em>
              </div>
            </div>
          ))}
        </DiscCard>
        <DiscCard>
          <div className="disc-card-head between">
            <div>
              <h3>Recent cases</h3>
              <p className="disc-muted">Recent system log events.</p>
            </div>
            <span className="disc-count-pill warning">2 active</span>
          </div>
          {RECENT_CASES.map((c) => (
            <div key={c.id} className="disc-recent-row">
              <div>
                <strong>{c.id}</strong>
                <span>
                  {c.name} · {c.reason} · {c.date}
                </span>
              </div>
              <RecruitPill label={c.status} tone={c.tone} />
            </div>
          ))}
        </DiscCard>
      </div>
    </div>
  )
}

export function DisciplinaryHistoryTab() {
  const [viewOpen, setViewOpen] = useState(false)
  const [viewEmployee, setViewEmployee] = useState('Ahmad Luqman')

  return (
    <>
      <DiscCard className="disc-sub-toolbar">
        <input type="search" placeholder="Search case log by employee name..." className="disc-search wide" />
        <div className="disc-action-group">
          <select defaultValue="All Status">
            <option>All Status</option>
            <option>Pending</option>
            <option>Acknowledged</option>
            <option>Closed</option>
          </select>
          <button type="button" className="disc-outline-btn">
            Generate PDF
          </button>
        </div>
      </DiscCard>
      <DiscCard>
        <div className="disc-table-scroll">
          <table className="disc-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>REASON / OFFENCE</th>
                <th>INCIDENT DATE</th>
                <th>ACTION DATE</th>
                <th>WARNING LEVEL</th>
                <th>ACTION ISSUED BY</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {DISCIPLINARY_HISTORY.map((row) => (
                <tr key={row.name}>
                  <td>
                    <AvatarCell initials={row.initials} name={row.name} sub={row.meta} />
                  </td>
                  <td>{row.offence}</td>
                  <td>{row.incidentDate}</td>
                  <td>{row.actionDate}</td>
                  <td>
                    <span className="disc-warning-level">{row.warningLevel}</span>
                  </td>
                  <td>{row.issuedBy}</td>
                  <td>
                    <HistoryStatus row={row} />
                  </td>
                  <td>
                    <ViewIconBtn
                      className="disc-icon-btn"
                      onClick={() => {
                        setViewEmployee(row.name)
                        setViewOpen(true)
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DiscCard>
      <ViewDisciplinaryRecordModal open={viewOpen} onClose={() => setViewOpen(false)} employee={viewEmployee} />
    </>
  )
}

export function DisciplinaryReportsTab() {
  const [detail, setDetail] = useState(true)

  return (
    <>
      <div className="disc-kpi-row">
        <RecruitIconKpi title="RESOLUTION RATE" value="33%" subtext="Overall records" icon="check" iconColor="#2563eb" valueTone="primary" trend="+ 1 of 3 closed" trendTone="success" />
        <RecruitIconKpi title="ACTIVE CASES" value="2 cases" subtext="Across all units" icon="alert" iconColor="#ea580c" trend="1 pending action" trendTone="warning" />
        <RecruitIconKpi title="GROSS MISCONDUCT" value="0 critical" subtext="Overall records" icon="shield" iconColor="#ef4444" valueTone="danger" trend="Immediate attention" trendTone="danger" />
        <RecruitIconKpi title="TOTAL FILED CASES" value="3 logged" subtext="Overall records" icon="clipboard" iconColor="#7c3aed" valueTone="purple" />
      </div>
      <DiscCard>
        <div className="disc-matrix-head">
          <div>
            <h3 className="disc-matrix-title">
              <DiscActionIcon name="trend" className="disc-matrix-icon" />
              Departmental Disciplinary & Compliance Matrix
            </h3>
            <p className="disc-muted">Aggregate warning frequencies, unresolved pending investigations, and structural risk metrics by business unit.</p>
          </div>
        </div>
        <div className="disc-table-scroll">
          <table className="disc-table">
            <thead>
              <tr>
                <th>DEPARTMENT UNIT</th>
                <th>STAFF HEADCOUNT</th>
                <th>TOTAL INFRACTIONS</th>
                <th>UNDER INVESTIGATION</th>
                <th>RESOLVED CASES</th>
                <th>MOST COMMON VIOLATION</th>
                <th>ORGANIZATIONAL HEALTH</th>
              </tr>
            </thead>
            <tbody>
              {DEPT_DISCIPLINARY.map((row) => (
                <tr key={row.department}>
                  <td>
                    <strong>{row.department}</strong>
                  </td>
                  <td className="muted">{row.staff}</td>
                  <td>{row.infractions}</td>
                  <td className={row.investigating !== '0' ? 'tone-warning' : ''}>
                    <strong>{row.investigating}</strong>
                  </td>
                  <td className={row.resolved !== '0' ? 'tone-success' : ''}>
                    <strong>{row.resolved}</strong>
                  </td>
                  <td>
                    <em>{row.violation}</em>
                  </td>
                  <td>
                    <RecruitPill label="Clear / Healthy" tone="success" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DiscCard>
      <DiscCard className="disc-sub-toolbar">
        <div className="disc-segmented report">
          <button type="button" className={detail ? 'active' : ''} onClick={() => setDetail(true)}>
            Detailed infraction logs
          </button>
          <button type="button" className={!detail ? 'active' : ''} onClick={() => setDetail(false)}>
            Summary warning balance
          </button>
        </div>
        <div className="disc-filter-group">
          <input type="search" placeholder="Search staff name.." />
          <select defaultValue="All Departments">
            <option>All Departments</option>
          </select>
          <select defaultValue="All Times">
            <option>All Times</option>
          </select>
          <select defaultValue="All Warning Levels">
            {WARNING_LEVEL_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <button type="button" className="disc-primary-btn disc-export-report-btn">
            <DiscActionIcon name="export" />
            Export
          </button>
        </div>
      </DiscCard>
      {detail ? <DetailLogsPanel /> : <SummaryBalancePanel />}
    </>
  )
}

function DetailLogsPanel() {
  return (
    <DiscCard>
      <div className="disc-card-head between">
        <div>
          <strong className="disc-log-title">DETAILED DISCIPLINARY INCIDENT LOGS</strong>
          <p className="disc-muted">Chronological warning action register of verified company policy violations</p>
        </div>
        <span className="disc-muted">Showing 3 matching logs</span>
      </div>
      <div className="disc-table-scroll">
        <table className="disc-table">
          <thead>
            <tr>
              <th>CASE ID</th>
              <th>EMPLOYEE</th>
              <th>VIOLATION DETAILS</th>
              <th>INCIDENT DATE</th>
              <th>LEVEL ACTIONED</th>
              <th>ISSUED BY</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {DISCIPLINARY_LOGS.map((row) => (
              <tr key={row.caseId}>
                <td className="tone-primary">
                  <strong>{row.caseId}</strong>
                </td>
                <td>
                  <strong>{row.name}</strong>
                  <span className="disc-sub">{row.meta}</span>
                </td>
                <td>
                  <strong>{row.violation}</strong>
                  <span className="disc-sub">{row.detail}</span>
                </td>
                <td>{row.incidentDate}</td>
                <td>
                  <RecruitPill label={row.level} tone="neutral" />
                </td>
                <td>{row.issuedBy}</td>
                <td>
                  <LogStatus kind={row.statusKind} label={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DiscCard>
  )
}

function SummaryBalancePanel() {
  return (
    <DiscCard>
      <div className="disc-card-head between">
        <div>
          <strong className="disc-log-title">SUMMARY EMPLOYEE WARNING BALANCE</strong>
          <p className="disc-muted">Aggregated warning levels and critical counts of disciplinary action per employee</p>
        </div>
        <span className="disc-muted">Showing 13 staff members</span>
      </div>
      <div className="disc-table-scroll">
        <table className="disc-table">
          <thead>
            <tr>
              <th>STAFF MEMBER</th>
              <th>DEPARTMENT POSITION</th>
              <th>TALLY OF CASES</th>
              <th>PENDING RESOLUTION</th>
              <th>HIGHEST WARNING LEVEL</th>
              <th>LATEST INFRACTION TYPE</th>
              <th>TALLY EVALUATION</th>
            </tr>
          </thead>
          <tbody>
            {SUMMARY_BALANCE.map((row) => (
              <tr key={row.empId}>
                <td>
                  <strong>{row.name}</strong>
                  <span className="disc-sub">{row.empId}</span>
                </td>
                <td>
                  <strong>{row.department}</strong>
                  <span className="disc-sub">{row.role}</span>
                </td>
                <td>{row.cases}</td>
                <td className={row.pending !== '0' ? 'tone-warning' : ''}>
                  <strong>{row.pending}</strong>
                </td>
                <td>
                  {row.highest === 'None active' ? (
                    <em className="muted">{row.highest}</em>
                  ) : (
                    <RecruitPill label={row.highest} tone="info" />
                  )}
                </td>
                <td>
                  {row.latest === 'None recorded' ? (
                    <em className="muted">{row.latest}</em>
                  ) : (
                    <>
                      <strong>{row.latest}</strong>
                      {row.recorded ? <span className="disc-sub">Recorded: {row.recorded}</span> : null}
                    </>
                  )}
                </td>
                <td>
                  <button type="button" className={`disc-eval-btn${row.clear ? ' clear' : ''}`}>
                    {row.clear ? 'Clear Record' : 'Single standard warning'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DiscCard>
  )
}

function DiscActionIcon({ name, className = '' }: { name: string; className?: string }) {
  const cls = `disc-action-icon${className ? ` ${className}` : ''}`
  if (name === 'eye') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
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
  if (name === 'shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" />
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
  if (name === 'export') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return null
}

function HistoryStatus({ row }: { row: DisciplinaryHistoryRow }) {
  if (row.statusKind === 'pending') return <span className="tone-warning">{row.status}</span>
  if (row.statusKind === 'acknowledged') return <span className="disc-status-outline">{row.status}</span>
  return <span className="tone-success">{row.status}</span>
}

function LogStatus({ kind, label }: { kind: 'pending' | 'acknowledged' | 'closed'; label: string }) {
  if (kind === 'pending') return <RecruitPill label={label} tone="warning" />
  if (kind === 'acknowledged') return <span className="disc-status-outline">{label}</span>
  return <RecruitPill label={label} tone="success" />
}

function ReasonDot({ name, color }: { name: string; color: string }) {
  return (
    <span className="disc-reason-dot">
      <i style={{ background: color }} aria-hidden />
      {name}
    </span>
  )
}

function AvatarCell({ initials, name, sub }: { initials: string; name: string; sub?: string }) {
  return (
    <span className="disc-avatar-cell">
      <span className="disc-avatar">{initials}</span>
      <span>
        <strong>{name}</strong>
        {sub ? <em>{sub}</em> : null}
      </span>
    </span>
  )
}

function SectionPill({ label }: { label: string }) {
  return <span className="disc-section-pill">{label}</span>
}

function DiscCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`disc-card${className ? ` ${className}` : ''}`}>{children}</section>
}
