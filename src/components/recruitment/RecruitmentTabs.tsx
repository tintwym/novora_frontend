import { useMemo, useState } from 'react'
import {
  INTERVIEWS,
  LEDGER_ROWS,
  OFFERS,
  PIPELINE_COLUMNS,
  REQUISITIONS,
} from '../../data/mockRecruitment'
import {
  FunnelPills,
  RecruitCard,
  RecruitHBar,
  RecruitIconKpi,
  RecruitPill,
  RecruitScoreBar,
} from './RecruitmentPrimitives'
import {
  AddCandidateModal,
  DraftOfferModal,
  JobRequisitionWizard,
  ScheduleInterviewModal,
} from './RecruitmentModals'

export function JobRequisitionTab() {
  const [showWizard, setShowWizard] = useState(false)
  const [search, setSearch] = useState('')

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return REQUISITIONS
    return REQUISITIONS.filter(
      (r) =>
        r.position.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.requestedBy.toLowerCase().includes(q),
    )
  }, [search])

  return (
    <>
      {showWizard ? <JobRequisitionWizard onClose={() => setShowWizard(false)} /> : null}
      <div className="recruit-kpi-row">
        <RecruitIconKpi title="TOTAL REQUISITIONS" value="5" subtext="Active recruitment templates" icon="📋" iconColor="#2563eb" />
        <RecruitIconKpi title="ACTIVE OPEN STATUS" value="3" subtext="Awaiting fill or approval" icon="✓" iconColor="#10b981" />
        <RecruitIconKpi title="FILLED POSITIONS" value="1" subtext="Closed this quarter" icon="👥" iconColor="#8b5cf6" />
        <RecruitIconKpi title="TOTAL APPLICANTS LISTED" value="104" valueTone="primary" subtext="Across all open requisitions" icon="📈" iconColor="#f59e0b" />
      </div>
      <div className="recruit-toolbar">
        <div className="recruit-search">
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            type="search"
            placeholder="Search position titles, requesters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="recruit-toolbar-meta">Found {rows.length} requisition records template</span>
        <button type="button" className="recruit-primary-btn" onClick={() => setShowWizard(true)}>
          + New requisition
        </button>
      </div>
      <RecruitCard className="recruit-table-card">
        <table className="recruit-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>POSITION TITLE</th>
              <th>DEPARTMENT</th>
              <th>TYPE</th>
              <th>REQUESTED BY</th>
              <th>OPEN DATE</th>
              <th>TARGET FILL</th>
              <th>APPLICANTS</th>
              <th>STATUS</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td className="strong">{r.position}</td>
                <td>
                  <RecruitPill label={r.department} tone={r.deptTone} />
                </td>
                <td>{r.type}</td>
                <td>{r.requestedBy}</td>
                <td>{r.openDate}</td>
                <td className="danger">{r.targetFill}</td>
                <td>
                  <button type="button" className="recruit-link">{r.applicants}</button>
                </td>
                <td>
                  <RecruitPill label={r.status} tone={r.statusTone} />
                </td>
                <td>
                  <button type="button" className="recruit-link">
                    View ›
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </RecruitCard>
    </>
  )
}

export function JobPostingTab() {
  return (
    <div className="recruit-split">
      <RecruitCard>
        <div className="recruit-card-head">
          <div>
            <h3>Active postings template records</h3>
            <p>Published channels linked to applicant counts.</p>
          </div>
          <RecruitPill label="5 Live" tone="success" />
        </div>
        <PostingRow letter="J" title="HR Business Partner" portal="JOBSTREET PORTAL — 1,240 impressions" applicants="14 applicants" status="Live" />
        <PostingRow letter="L" title="HR Business Partner" portal="LINKEDIN JOBS — 890 impressions" applicants="8 applicants" status="Live" />
        <PostingRow letter="J" title="Sr. Frontend Dev" portal="JOBSTREET PORTAL — 2,100 impressions" applicants="28 applicants" status="Live" />
        <PostingRow letter="I" title="Finance Analyst" portal="INTERNAL PORTAL — 210 impressions" applicants="4 applicants" status="Live" />
        <PostingRow letter="L" title="Digital Mktg Lead" portal="LINKEDIN JOBS — 0 impressions" applicants="0 applicants" status="On hold" onHold />
      </RecruitCard>
      <RecruitCard>
        <h3 className="recruit-section-label">APPLICANT SOURCE BREAKDOWN %</h3>
        <RecruitHBar label="JobStreet.com" value={62} max={62} color="#2563eb" trailing="62 applicants (45%)" />
        <RecruitHBar label="LinkedIn Jobs" value={33} max={62} color="#60a5fa" trailing="33 (25%)" />
        <RecruitHBar label="Internal Referral Portal" value={26} max={62} color="#10b981" trailing="26 (18%)" />
        <RecruitHBar label="Website careers page" value={14} max={62} color="#f59e0b" trailing="14 (9%)" />
        <RecruitHBar label="Recruitment Agency partners" value={12} max={62} color="#ef4444" trailing="12 (2%)" />
      </RecruitCard>
    </div>
  )
}

function PostingRow({
  letter,
  title,
  portal,
  applicants,
  status,
  onHold,
}: {
  letter: string
  title: string
  portal: string
  applicants: string
  status: string
  onHold?: boolean
}) {
  return (
    <div className="recruit-posting-row">
      <span className="recruit-posting-avatar">{letter}</span>
      <div>
        <strong>{title}</strong>
        <span>{portal}</span>
      </div>
      <div className="recruit-posting-stats">
        <strong>{applicants}</strong>
        <span>YTD volume</span>
      </div>
      <RecruitPill label={status} tone={onHold ? 'warning' : 'success'} />
    </div>
  )
}

export function CandidatePipelineTab() {
  const [showAdd, setShowAdd] = useState(false)
  return (
    <>
      {showAdd ? <AddCandidateModal onClose={() => setShowAdd(false)} /> : null}
      <div className="recruit-toolbar">
        <select className="recruit-select-pill" defaultValue="hr">
          <option value="hr">Position: HR Business Partner</option>
          <option>All roles</option>
        </select>
        <select className="recruit-select-pill" defaultValue="all">
          <option value="all">All sources</option>
          <option>JobStreet</option>
          <option>LinkedIn</option>
        </select>
        <div className="recruit-search compact">
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input type="search" placeholder="Search candidate name..." />
        </div>
        <button type="button" className="recruit-primary-btn" onClick={() => setShowAdd(true)}>
          + Add candidate
        </button>
      </div>
      <div className="recruit-kanban">
        {PIPELINE_COLUMNS.map((col) => (
          <div key={col.stage} className="recruit-kanban-col">
            <div className="recruit-kanban-head">
              <span>{col.stage}</span>
              <em>{col.count}</em>
            </div>
            <div className="recruit-kanban-body">
              {col.candidates.length === 0 ? (
                <p className="recruit-kanban-empty">No candidates</p>
              ) : (
                col.candidates.map((c) => (
                  <div key={c.id} className={`recruit-cand-card${c.selected ? ' selected' : ''}`}>
                    <strong>{c.name}</strong>
                    <span>{c.details}</span>
                    <div>
                      <RecruitPill label={c.source} tone="neutral" />
                      <em>{c.score}</em>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export function InterviewsTab() {
  const [showSchedule, setShowSchedule] = useState(false)
  return (
    <>
      {showSchedule ? <ScheduleInterviewModal onClose={() => setShowSchedule(false)} /> : null}
      <div className="recruit-toolbar">
        <span className="recruit-upcoming-badge">5 upcoming today</span>
        <button type="button" className="recruit-primary-btn" onClick={() => setShowSchedule(true)}>
          Schedule interview
        </button>
      </div>
      <div className="recruit-split">
        <RecruitCard>
          <h3>Upcoming interviews list</h3>
          <p>Confirmed slots pending logs.</p>
          <table className="recruit-table compact">
            <thead>
              <tr>
                <th>CANDIDATE</th>
                <th>STAGE</th>
                <th>DATE / TIME</th>
                <th>FORMAT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {INTERVIEWS.map((row) => (
                <tr key={row.name + row.dateTime}>
                  <td>
                    <strong>{row.name}</strong>
                    <span>{row.role}</span>
                  </td>
                  <td>{row.stage}</td>
                  <td>{row.dateTime}</td>
                  <td className={`format-${row.formatTone}`}>{row.format}</td>
                  <td>
                    <RecruitPill label={row.status} tone={row.statusTone} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </RecruitCard>
        <RecruitCard>
          <div className="recruit-card-head">
            <h3 className="recruit-section-label">INTERVIEW SCORECARD REVIEW</h3>
            <button type="button" className="recruit-link">
              Panel rating
            </button>
          </div>
          <strong className="recruit-score-name">Lena Wong</strong>
          <span className="recruit-score-role">HR Business Partner</span>
          <RecruitScoreBar label="Communication skills" percent={90} color="#2563eb" />
          <RecruitScoreBar label="HR knowledge & expertise" percent={95} color="#10b981" />
          <RecruitScoreBar label="Analytical problem solving" percent={88} color="#1e40af" />
          <RecruitScoreBar label="Culture fit alignment" percent={92} color="#8b5cf6" />
          <RecruitScoreBar label="Leadership indicators" percent={80} color="#f59e0b" />
          <div className="recruit-recommendation">
            <div>
              <span>PANEL RECOMMENDATION</span>
              <strong>Proceed to contract offer</strong>
            </div>
            <span aria-hidden>✓</span>
          </div>
        </RecruitCard>
      </div>
    </>
  )
}

export function OfferManagementTab() {
  const [showDraft, setShowDraft] = useState(false)
  const selected = OFFERS.find((o) => o.selected) ?? OFFERS[0]
  const stages = ['Applied', 'Screened', 'Phone', 'Panel', 'Offer sent', 'Accepted', 'Hired']

  return (
    <>
      {showDraft ? <DraftOfferModal onClose={() => setShowDraft(false)} /> : null}
      <div className="recruit-toolbar end">
        <button type="button" className="recruit-outline-btn" onClick={() => setShowDraft(true)}>
          Draft offer
        </button>
        <button type="button" className="recruit-primary-btn" onClick={() => setShowDraft(true)}>
          Create offer
        </button>
      </div>
      <div className="recruit-split">
        <RecruitCard>
          <h3>Corporate offer tracker</h3>
          <p>Pending approval feedback loops.</p>
          <table className="recruit-table compact">
            <thead>
              <tr>
                <th>CANDIDATE</th>
                <th>SALARY</th>
                <th>SENT DATE</th>
                <th>EXPIRY</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {OFFERS.map((row) => (
                <tr key={row.name} className={row.selected ? 'selected' : ''}>
                  <td>
                    <strong>{row.name}</strong>
                    <span>{row.role}</span>
                  </td>
                  <td>{row.salary}</td>
                  <td>{row.sentDate}</td>
                  <td className="danger">{row.expiry}</td>
                  <td>
                    <RecruitPill label={row.status} tone={row.statusTone} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </RecruitCard>
        <RecruitCard>
          <div className="recruit-card-head">
            <h3 className="recruit-section-label">OFFER WORKFLOW STATUS</h3>
            <RecruitPill label="Awaiting accept" tone="warning" />
          </div>
          <strong className="recruit-score-name">{selected.name}</strong>
          <span className="recruit-score-role">{selected.role}</span>
          <div className="recruit-workflow-stages">
            {stages.map((s, i) => (
              <span key={s}>
                {i > 0 ? ' → ' : ''}
                <RecruitPill label={s} tone={i === 4 ? 'info' : 'neutral'} />
              </span>
            ))}
          </div>
          <dl className="recruit-offer-kv">
            <div>
              <dt>Salary Package</dt>
              <dd>MYR 6,500/mth</dd>
            </div>
            <div>
              <dt>Fixed Allowance</dt>
              <dd>MYR 650/mth</dd>
            </div>
            <div>
              <dt>Grade Level</dt>
              <dd>G-6 / Sub A</dd>
            </div>
            <div>
              <dt>Probation duration</dt>
              <dd>3 months</dd>
            </div>
          </dl>
          <div className="recruit-offer-actions">
            <button type="button" className="recruit-outline-btn">
              Preview PDF letter
            </button>
            <button type="button" className="recruit-primary-btn">
              Send reminder
            </button>
          </div>
        </RecruitCard>
      </div>
    </>
  )
}

export function PreOnboardingTab() {
  return (
    <div className="recruit-split pre">
      <div>
        <RecruitCard>
          <h3>Pre-onboarding queue list</h3>
          <p>Checklist progress logs for verified candidates.</p>
          <QueueItem name="Ahmad Bakri" role="Operations Lead" start="2 Jun 2026" progress="4/8 checklist" selected />
          <QueueItem name="Lena Wong" role="HR Business Partner" start="TBD" progress="1/8 checklist" />
        </RecruitCard>
        <RecruitCard>
          <h3 className="recruit-section-label">ONBOARDING AUDIT LOGS</h3>
          <LogLine date="8 May" text="Employment contract accepted — Ahmad Bakri" color="#10b981" />
          <LogLine date="5 May" text="Document upload request delivered — Lena Wong" color="#2563eb" />
          <LogLine date="25 Apr" text="IT Equipment assignment booked — Operations Lead" color="#2563eb" />
        </RecruitCard>
      </div>
      <RecruitCard>
        <h3 className="recruit-section-label">VERIFICATION CHECK</h3>
        <strong className="recruit-score-name">Ahmad Bakri</strong>
        <h4 className="recruit-section-label">DOCUMENT REPOSITORY</h4>
        <CheckRow label="Signed Offer" done />
        <CheckRow label="Nric Passport" done />
        <CheckRow label="Bank Details" done />
        <CheckRow label="Education Cert" done />
        <CheckRow label="Epf Member" />
        <CheckRow label="Emergency Contact" />
        <CheckRow label="Medical Cert" />
        <CheckRow label="Resignation Letter" />
        <div className="recruit-provision-box">
          <h4>IT & PAYROLL PROVISIONING TRIGGERS</h4>
          <CheckRow label="Create permanent HRMS employee account" done />
          <CheckRow label="Provision GSuite email accounts" done />
          <CheckRow label="Assign pre-configured laptop asset" done />
          <CheckRow label="Register biometric scans and keycards" />
          <CheckRow label="Enrol in monthly banking payroll roster" />
        </div>
        <button type="button" className="recruit-primary-btn full">
          Convert to actual employee staff record
        </button>
      </RecruitCard>
    </div>
  )
}

function QueueItem({
  name,
  role,
  start,
  progress,
  selected,
}: {
  name: string
  role: string
  start: string
  progress: string
  selected?: boolean
}) {
  return (
    <div className={`recruit-queue-item${selected ? ' selected' : ''}`}>
      <div>
        <strong>{name}</strong>
        <span>
          {role} · Start Date: {start}
        </span>
      </div>
      <div>
        <em>{progress}</em>
        <RecruitPill label="docs pending" tone="warning" />
      </div>
    </div>
  )
}

function LogLine({ date, text, color }: { date: string; text: string; color: string }) {
  return (
    <div className="recruit-log-line">
      <span>{date}</span>
      <i style={{ background: color }} aria-hidden />
      <p>{text}</p>
    </div>
  )
}

function CheckRow({ label, done = false }: { label: string; done?: boolean }) {
  return (
    <label className="recruit-check-row">
      <input type="checkbox" checked={done} readOnly />
      <span>{label}</span>
    </label>
  )
}

export function ReportsTab() {
  const [ledgerSearch, setLedgerSearch] = useState('')
  const ledger = useMemo(() => {
    const q = ledgerSearch.trim().toLowerCase()
    if (!q) return LEDGER_ROWS
    return LEDGER_ROWS.filter(
      (r) =>
        r.reqCode.toLowerCase().includes(q) ||
        r.position.toLowerCase().includes(q) ||
        r.recruiter.toLowerCase().includes(q),
    )
  }, [ledgerSearch])

  return (
    <>
      <div className="recruit-reports-filters">
        <label>
          <span>ANALYTICAL SECTOR</span>
          <select defaultValue="all">
            <option>All Departments - Consolidated</option>
          </select>
        </label>
        <label>
          <span>REPORTING PERIOD</span>
          <select defaultValue="q2">
            <option value="q2">Q2 2026 (1 Apr - 30 Jun)</option>
          </select>
        </label>
        <button type="button" className="recruit-outline-btn">
          Download Excel
        </button>
        <button type="button" className="recruit-primary-btn">
          Print Executive Summary
        </button>
      </div>
      <div className="recruit-kpi-row three">
        <RecruitIconKpi title="AVG. TIME TO CLOSE" value="28 days" trend="↑ 4d vs last qtr" subtext="Duration from approved REQ to candidate signed contract" icon="⏱" iconColor="#2563eb" />
        <RecruitIconKpi title="OFFER ACCEPTANCE RATE" value="82%" trend="↑ 8% from last qtr" subtext="Percent of extended contract offer packets signed by talent" icon="%" iconColor="#8b5cf6" />
        <RecruitIconKpi title="RECRUITMENT COST YTD" value="MYR 8,400" valueTone="primary" subtext="Jobboard credits + external recruitment agency payouts" icon="🔗" iconColor="#10b981" />
      </div>
      <div className="recruit-split">
        <div>
          <RecruitCard>
            <div className="recruit-card-head">
              <div>
                <h3>CANDIDATE CONVERSION WATERFALL %</h3>
                <p>Consolidated Novora recruitment metrics report overview.</p>
              </div>
              <strong>147 applicants</strong>
            </div>
            <WaterfallBar label="Applied → Screen Match" pct={88} color="#2563eb" sub="88% matched" />
            <WaterfallBar label="Screened → Phone Scheduled" pct={55} color="#6366f1" sub="55% advanced" />
            <WaterfallBar label="Phone → Panel Interview" pct={40} color="#8b5cf6" sub="40% approved" />
            <WaterfallBar label="Panel → Extended Offer" pct={35} color="#f97316" sub="35% recommended" />
            <WaterfallBar label="Offer → Hired" pct={82} color="#22c55e" sub="82% accepts offer terms" />
          </RecruitCard>
          <RecruitCard>
            <h3 className="recruit-section-label">RECRUITMENT COST DISTRIBUTION BY CHANNEL</h3>
            <RecruitHBar label="JobStreet job ads credits" value={4620} max={4620} color="#2563eb" trailing="MYR 4,620" />
            <RecruitHBar label="LinkedIn advertising search campaigns" value={2520} max={4620} color="#6366f1" trailing="MYR 2,520" />
            <RecruitHBar label="Partner Agency consultant commissions" value={1260} max={4620} color="#f97316" trailing="MYR 1,260" />
          </RecruitCard>
        </div>
        <div>
          <RecruitCard>
            <h3 className="recruit-section-label">REQUISITION PIPELINE ACTIVITY SNAPSHOT</h3>
            <p>Sector: All departments</p>
            <div className="recruit-pipeline-grid">
              <div className="blue">
                <span>OPEN REQUISITIONS</span>
                <strong>12</strong>
              </div>
              <div className="green">
                <span>FILLED THIS QUARTER</span>
                <strong>5</strong>
              </div>
              <div className="orange">
                <span>ON HOLD STATUS</span>
                <strong>2</strong>
              </div>
              <div className="red">
                <span>CANCELLED REQUIREMENTS</span>
                <strong>1</strong>
              </div>
            </div>
            <ul className="recruit-pipeline-list">
              <li>Total applicants mapped: 147 applicants</li>
              <li>Panel evaluations conducted: 38 loops</li>
              <li>Contract offer envelopes extended: 5 extended</li>
              <li>
                Employment offers signed & closed: <strong className="success">4 signed</strong>
              </li>
            </ul>
          </RecruitCard>
          <RecruitCard>
            <h3 className="recruit-section-label">AVERAGE POSITION FILLING SPEED BY DEPARTMENT (DAYS)</h3>
            <RecruitHBar label="Engineering Team" value={36} max={36} color="#94a3b8" trailing="36 days" />
            <RecruitHBar label="Finance Department" value={28} max={36} color="#94a3b8" trailing="28 days" />
            <RecruitHBar label="Human Resources Team" value={25} max={36} color="#94a3b8" trailing="25 days" />
            <RecruitHBar label="Operations Roster" value={22} max={36} color="#94a3b8" trailing="22 days" />
            <RecruitHBar label="Marketing Department" value={19} max={36} color="#94a3b8" trailing="19 days" />
          </RecruitCard>
        </div>
      </div>
      <RecruitCard className="recruit-ledger-card">
        <div className="recruit-ledger-head">
          <div>
            <h3>Analytical Record-Level Recruitment Log</h3>
            <p>Granular requisition funnel metrics, marketing channel budgets, and precise closure times</p>
          </div>
          <div className="recruit-ledger-tools">
            <div className="recruit-search compact">
              <svg viewBox="0 0 24 24" aria-hidden>
                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
              </svg>
              <input
                type="search"
                placeholder="Search role, REQ, recruiter..."
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
              />
            </div>
            <button type="button" className="recruit-outline-btn">
              Export Ledger
            </button>
          </div>
        </div>
        <table className="recruit-table">
          <thead>
            <tr>
              <th>REQ CODE</th>
              <th>JOB POSITION & SECTOR</th>
              <th>LEAD RECRUITER</th>
              <th>CONVERSION FUNNEL</th>
              <th>CHANNEL SPEND</th>
              <th>CYCLE TIME</th>
              <th>AUDITING STATUS</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((row) => (
              <tr key={row.reqCode}>
                <td>{row.reqCode}</td>
                <td>
                  <strong>{row.position}</strong>
                  <span>{row.sector}</span>
                </td>
                <td>{row.recruiter}</td>
                <td>
                  <FunnelPills counts={row.funnel} />
                </td>
                <td>{row.spend}</td>
                <td className="strong">{row.cycleTime}</td>
                <td>
                  <RecruitPill label={row.status} tone={row.statusTone} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="recruit-ledger-foot">
          <span>Displaying {ledger.length} validated recruitment channels breakdown rows.</span>
          <span className="verified">● Real-time DB Ledger Checked and Synchronized</span>
        </div>
      </RecruitCard>
    </>
  )
}

function WaterfallBar({ label, pct, color, sub }: { label: string; pct: number; color: string; sub: string }) {
  return (
    <div className="recruit-waterfall">
      <div className="recruit-waterfall-head">
        <span>{label}</span>
        <em>{sub}</em>
      </div>
      <div className="recruit-hbar-track">
        <span style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}
