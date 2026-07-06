import { useState, type ReactNode } from 'react'
import {
  DEPT_SCOREBOARD,
  MANUAL_PUNCHES,
  OT_POLICY,
  OT_RECORDS,
  RECENT_DAY_LOGS,
  REPORT_DETAIL_ROWS,
  ROLL_CALL_ROWS,
  ROSTER_DAYS,
  ROSTER_EMPLOYEES,
  SHIFT_PATTERNS,
  TIMESHEET_ROWS,
  UNKNOWN_SWIPES,
} from '../../data/mockAttendance'
import type { RosterCellTone } from '../../types/attendance'
import { RecruitIconKpi, RecruitPill } from '../recruitment/RecruitmentPrimitives'
import {
  AddOtSetupModal,
  CreateShiftPatternModal,
  CreateTimesheetModal,
  EditTimesheetModal,
} from './AttendanceModals'

const ROSTER_TONE: Record<RosterCellTone, { bg: string; border: string; fg: string }> = {
  completed: { bg: '#d1fae5', border: '#6ee7b7', fg: '#065f46' },
  clockIn: { bg: '#dbeafe', border: '#93c5fd', fg: '#1e40af' },
  planned: { bg: '#f8fafc', border: '#cbd5e1', fg: '#475569' },
  off: { bg: '#e2e8f0', border: '#cbd5e1', fg: '#64748b' },
  leave: { bg: '#fef3c7', border: '#fcd34d', fg: '#92400e' },
  ot: { bg: '#fce7f3', border: '#f9a8d4', fg: '#9d174d' },
  night: { bg: '#ede9fe', border: '#c4b5fd', fg: '#5b21b6' },
  absent: { bg: '#fee2e2', border: '#fca5a5', fg: '#991b1b' },
}

export function CheckInTab() {
  const [checkedIn, setCheckedIn] = useState(false)
  const today = '2026-06-13'

  return (
    <div className="att-split">
      <AttCard>
        <div className="att-card-head">
          <span className="att-icon" aria-hidden>
            🕐
          </span>
          <div>
            <h3>Interactive Attendance Workstation</h3>
            <p>Secure local biometric terminal alignment.</p>
          </div>
        </div>
        <div className="att-workstation-panel">
          <span className="att-label">TODAY ({today})</span>
          <em>Checked In Server Time</em>
          <div className="att-punch-row">
            <div>
              <span>CHECK-IN</span>
              <strong>{checkedIn ? '09:02 AM' : '—'}</strong>
            </div>
            <div>
              <span>CHECK-OUT</span>
              <strong>—</strong>
            </div>
          </div>
          <p className="att-status-line">Status: {checkedIn ? 'Clocked In' : 'Not Clocked-In'}</p>
          <button type="button" className="att-primary-btn full" onClick={() => setCheckedIn(true)}>
            {checkedIn ? 'CLOCK CHECK-OUT NOW' : 'CLOCK CHECK-IN NOW'}
          </button>
          <p className="att-footnote">Matches your login email authentication: Web Console Login</p>
        </div>
      </AttCard>
      <AttCard>
        <div className="att-card-head between">
          <div>
            <h3>Recent Days Log</h3>
            <p>Your official biometric timesheet audit trail.</p>
          </div>
          <button type="button" className="att-link-btn">
            View comprehensive history
          </button>
        </div>
        {RECENT_DAY_LOGS.map((e) => (
          <div key={e.date} className="att-recent-row">
            <div>
              <span aria-hidden>📅</span>
              <div>
                <strong>{e.date}</strong>
                <em>{e.range}</em>
              </div>
            </div>
            <div className="att-recent-meta">
              <span>{e.hours}</span>
              <em>TIMESHEET MATCHED</em>
              <RecruitPill label="PRESENT" tone="success" />
            </div>
          </div>
        ))}
      </AttCard>
    </div>
  )
}

export function DutyRosterTab() {
  const [granularity, setGranularity] = useState('week')

  return (
    <>
      <AttCard className="att-roster-toolbar">
        <div className="att-roster-period">
          <strong>Roster Period: 5 – 11 May 2026</strong>
          <button type="button" aria-label="Previous week">
            ‹
          </button>
          <button type="button" aria-label="Next week">
            ›
          </button>
        </div>
        <div className="att-segmented">
          {(['week', 'day', 'month'] as const).map((g) => (
            <button key={g} type="button" className={granularity === g ? 'active' : ''} onClick={() => setGranularity(g)}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </AttCard>
      <AttCard className="att-roster-card">
        <div className="att-roster-scroll">
          <table className="att-roster-table">
            <thead>
              <tr>
                <th>EMPLOYEE CARD</th>
                {ROSTER_DAYS.map((d, i) => (
                  <th key={d} className={i >= 5 ? 'weekend' : ''}>
                    {d}
                    {i === 4 ? <em>HALF DAY</em> : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROSTER_EMPLOYEES.map((emp) => (
                <tr key={emp.name}>
                  <td>
                    <AvatarCell initials={emp.initials} name={emp.name} sub={emp.department} />
                  </td>
                  {emp.days.map((cell, i) => {
                    const s = ROSTER_TONE[cell.tone]
                    return (
                      <td key={`${emp.name}-${i}`} className={i >= 5 ? 'weekend' : ''}>
                        <div className="att-roster-cell" style={{ background: s.bg, borderColor: s.border, color: s.fg }}>
                          <strong>{cell.time}</strong>
                          {cell.status ? <span>+ {cell.status}</span> : null}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="att-legend">
          <strong>DUTY LEGEND INDICATOR VALUES</strong>
          <LegendItem label="Completed" color="#10b981" />
          <LegendItem label="Clock in / OT Active" color="#3b82f6" />
          <LegendItem label="Planned / Off" color="#94a3b8" />
          <LegendItem label="On leave / Sick" color="#f59e0b" />
          <LegendItem label="Night shift" color="#8b5cf6" />
          <LegendItem label="Absent (No swiped badge)" color="#ef4444" />
        </div>
      </AttCard>
    </>
  )
}

export function TimesheetTab() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editEmployee, setEditEmployee] = useState('Sarah Lim')

  return (
    <>
      <AttCard className="att-sub-toolbar">
        <div className="att-filter-group">
          <select defaultValue="Single shift" aria-label="Shift type">
            <option>Single shift</option>
            <option>Split shift</option>
          </select>
          <select defaultValue="Standard 9-6" aria-label="Shift pattern">
            <option>Standard 9-6</option>
            <option>Night shift</option>
          </select>
        </div>
        <div className="att-action-group">
          <button type="button" className="att-outline-btn">
            Copy timesheet
          </button>
          <button type="button" className="att-primary-btn" onClick={() => setCreateOpen(true)}>
            + Create timesheet
          </button>
        </div>
      </AttCard>
      <AttCard>
        <div className="att-table-scroll">
          <table className="att-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>DEPARTMENT</th>
                <th>ASSIGNED SHIFT</th>
                <th>DATE FROM</th>
                <th>DATE TO</th>
                <th>DUTY DAYS</th>
                <th>WORKING LOGIC</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {TIMESHEET_ROWS.map((row) => (
                <tr key={row.name}>
                  <td>
                    <AvatarCell initials={row.initials} name={row.name} />
                  </td>
                  <td className="muted">{row.department}</td>
                  <td>
                    <strong>{row.shift}</strong>
                  </td>
                  <td className="muted">{row.dateFrom}</td>
                  <td className="muted">{row.dateTo}</td>
                  <td className="muted">{row.dutyDays}</td>
                  <td className="muted">{row.workingLogic}</td>
                  <td>
                    <RecruitPill label={row.status} tone={row.statusTone} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="att-link-btn"
                      onClick={() => {
                        setEditEmployee(row.name)
                        setEditOpen(true)
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AttCard>
      <CreateTimesheetModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditTimesheetModal open={editOpen} onClose={() => setEditOpen(false)} employee={editEmployee} />
    </>
  )
}

export function ShiftPatternTab() {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <>
      <div className="att-shift-head">
        <div>
          <span className="att-label">SHIFT PATTERNS DEFINED:</span>
          <span className="att-count-pill">4 PATTERNS</span>
        </div>
        <button type="button" className="att-primary-btn" onClick={() => setCreateOpen(true)}>
          + New shift pattern
        </button>
      </div>
      <div className="att-shift-grid">
        {SHIFT_PATTERNS.map((p) => (
          <AttCard key={p.id} className="att-shift-card">
            <div className="att-card-head between">
              <h3>{p.title}</h3>
              <RecruitPill label="Active" tone="success" />
            </div>
            <div className="att-shift-kv-grid">
              <ShiftKv label="WORK HOURS" value={p.workHours} />
              <ShiftKv label="BREAK TIME" value={p.breakTime} />
              <ShiftKv label="NEAREST TIME (IN)" value={p.nearestIn} />
              <ShiftKv label="NEAREST TIME (OUT)" value={p.nearestOut} />
              <ShiftKv label="ALLOW IN OT" value={p.allowInOt} />
              <ShiftKv label="ALLOW OUT OT" value={p.allowOutOt} />
              <ShiftKv label="NIGHT SHIFT" value={p.nightShift} highlight={p.nightHighlight} />
              <ShiftKv
                label="ASSIGNED EMPLOYEES"
                value={p.assigned}
                link={p.assigned !== 'Fri only'}
              />
            </div>
            <div className="att-shift-foot">
              <button type="button" className="att-link-btn">
                Edit rules
              </button>
              <div>
                <button type="button" className="att-outline-btn sm">
                  + Assign Staff
                </button>
                <button type="button" className="att-icon-btn danger" aria-label="Delete pattern">
                  🗑
                </button>
              </div>
            </div>
          </AttCard>
        ))}
      </div>
      <CreateShiftPatternModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  )
}

export function RollCallTab() {
  return (
    <>
      <AttCard className="att-sub-toolbar">
        <div className="att-filter-group">
          <input type="text" defaultValue="05/06/2026" aria-label="Roll call date" />
        </div>
        <div className="att-roll-summary">
          <SummaryPill label="Present" value="1,148" tone="success" />
          <SummaryPill label="Absent" value="23" tone="danger" />
          <SummaryPill label="On leave" value="47" tone="warning" />
          <button type="button" className="att-outline-btn">
            Export roll call
          </button>
        </div>
      </AttCard>
      <AttCard>
        <div className="att-table-scroll">
          <table className="att-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>DEPARTMENT</th>
                <th>SHIFT</th>
                <th>CLOCK IN</th>
                <th>CLOCK OUT</th>
                <th>WORK HOURS</th>
                <th>IN OFFICE?</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {ROLL_CALL_ROWS.map((row) => (
                <tr key={row.name}>
                  <td>
                    <AvatarCell initials={row.initials} name={row.name} />
                  </td>
                  <td>{row.department}</td>
                  <td>{row.shift}</td>
                  <td>{row.clockIn}</td>
                  <td>{row.clockOut}</td>
                  <td>{row.workHours}</td>
                  <td>
                    {row.inOffice === '—' ? (
                      '—'
                    ) : (
                      <span className={row.inOfficeYes ? 'tone-success' : 'muted'}>{row.inOffice}</span>
                    )}
                  </td>
                  <td>
                    <span className={`att-status-text tone-${row.statusTone}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AttCard>
    </>
  )
}

export function ManualPunchTab() {
  return (
    <div className="att-split">
      <AttCard>
        <h3>Manual Punch Entry</h3>
        <p className="att-muted">Request paper trail or biometric bypass correction.</p>
        <label className="att-field">
          <span>Employee *</span>
          <select defaultValue="">
            <option value="">-- Select employee --</option>
            <option>Sarah Lim · EMP-0027</option>
            <option>Raj Kumar · EMP-0048</option>
          </select>
        </label>
        <label className="att-field">
          <span>Date *</span>
          <input type="text" defaultValue="05/06/2026" />
        </label>
        <label className="att-field">
          <span>Punch Type *</span>
          <select defaultValue="Clock In">
            <option>Clock In</option>
            <option>Clock Out</option>
          </select>
        </label>
        <label className="att-field">
          <span>Time (Server Time)</span>
          <input type="text" defaultValue="09:00 AM" readOnly />
        </label>
        <label className="att-field">
          <span>Reason</span>
          <select defaultValue="Fingerprint device offline">
            <option>Fingerprint device offline</option>
            <option>Forgot to swipe</option>
            <option>Remote work</option>
          </select>
        </label>
        <label className="att-field">
          <span>Remark</span>
          <textarea rows={3} placeholder="Optional note for HR record..." />
        </label>
        <div className="att-punch-actions">
          <button type="button" className="att-outline-btn">
            Clock In
          </button>
          <button type="button" className="att-danger-soft-btn">
            Clock Out
          </button>
        </div>
      </AttCard>
      <AttCard>
        <div className="att-card-head between">
          <div>
            <h3>Today&apos;s Manual Punches</h3>
            <p>Biometric verification records logged manually today.</p>
          </div>
          <span className="att-count-pill">4 RECORDS</span>
        </div>
        {MANUAL_PUNCHES.map((p) => (
          <div key={`${p.time}-${p.employee}`} className="att-manual-row">
            <strong>{p.time}</strong>
            <div>
              <strong>{p.employee}</strong>
              <span>
                {p.empId} · Type: {p.type} · Reason: {p.reason}
              </span>
            </div>
            <RecruitPill label={p.badge} tone={p.badgeTone} />
          </div>
        ))}
      </AttCard>
    </div>
  )
}

export function UnknownSwipesTab() {
  const [selected, setSelected] = useState<number[]>([0, 1, 2, 3])
  const [assignments, setAssignments] = useState<Record<number, string>>({})

  const allSelected = selected.length === UNKNOWN_SWIPES.length

  function toggleAll() {
    setSelected(allSelected ? [] : UNKNOWN_SWIPES.map((r) => r.id))
  }

  function toggleRow(id: number) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <>
      <AttCard className="att-unknown-bar">
        <div>
          <span>Unresolved Tickets:</span>
          <span className="att-unresolved-pill">4 unresolved</span>
        </div>
        <div className="att-action-group">
          <button type="button" className="att-link-btn">
            Resolve all
          </button>
          <button type="button" className="att-primary-btn">
            Resolve selected
          </button>
        </div>
      </AttCard>
      <AttCard>
        <div className="att-table-scroll">
          <table className="att-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" />
                </th>
                <th>TA NUMBER</th>
                <th>EMPLOYEE</th>
                <th>SWIPE TIME</th>
                <th>TERMINAL LOCATION</th>
                <th>FLAGGED ISSUE</th>
                <th>ASSIGN TO SHIFT</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {UNKNOWN_SWIPES.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                      aria-label={`Select ${row.taNumber}`}
                    />
                  </td>
                  <td className="tone-danger">
                    <strong>{row.taNumber}</strong>
                  </td>
                  <td>
                    {row.name === '—' ? (
                      '—'
                    ) : (
                      <AvatarCell initials={row.initials} name={row.name} />
                    )}
                  </td>
                  <td>{row.swipeTime}</td>
                  <td>{row.terminal}</td>
                  <td>
                    <RecruitPill label={row.issue} tone={row.issueTone} />
                  </td>
                  <td>
                    <select
                      value={assignments[row.id] ?? ''}
                      onChange={(e) => setAssignments({ ...assignments, [row.id]: e.target.value })}
                      aria-label="Assign shift"
                    >
                      <option value="">-- Assign --</option>
                      <option value="std">Standard</option>
                      <option value="night">Night</option>
                    </select>
                  </td>
                  <td>
                    <button type="button" className="att-outline-btn sm">
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AttCard>
    </>
  )
}

export function OvertimeTab() {
  const [otOpen, setOtOpen] = useState(false)

  return (
    <>
      <div className="att-split ot">
        <AttCard>
          <div className="att-card-head between">
            <div>
              <h3>Specific Overtime Records</h3>
              <p>Approved extra working hour datasets.</p>
            </div>
            <button type="button" className="att-outline-btn" onClick={() => setOtOpen(true)}>
              + Add OT setup
            </button>
          </div>
          <div className="att-table-scroll">
            <table className="att-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>DATE</th>
                  <th>OT START</th>
                  <th>OT END</th>
                  <th>HOURS</th>
                </tr>
              </thead>
              <tbody>
                {OT_RECORDS.map((row) => (
                  <tr key={`${row.name}-${row.date}`}>
                    <td>
                      <AvatarCell initials={row.initials} name={row.name} />
                    </td>
                    <td>{row.date}</td>
                    <td>{row.start}</td>
                    <td>{row.end}</td>
                    <td className="tone-primary">
                      <strong>{row.hours}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AttCard>
        <AttCard>
          <div className="att-card-head between">
            <div>
              <h3>OT Policy — Current Settings</h3>
              <p>Corporate compliance thresholds.</p>
            </div>
            <button type="button" className="att-outline-btn">
              Configure Rules
            </button>
          </div>
          <dl className="att-policy-list">
            {OT_POLICY.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd className={'success' in item && item.success ? 'tone-success' : ''}>{item.value}</dd>
              </div>
            ))}
          </dl>
        </AttCard>
      </div>
      <AddOtSetupModal open={otOpen} onClose={() => setOtOpen(false)} />
    </>
  )
}

export function ReportsTab() {
  const [detail, setDetail] = useState(true)

  return (
    <>
      <div className="att-kpi-row">
        <RecruitIconKpi title="Adherence Rate" value="95.8%" subtext="Across all departments" icon="👥" iconColor="#2563eb" trend="+1.2% this week" />
        <RecruitIconKpi title="Total Overtime" value="42.5 hrs" subtext="Across 18 staff" icon="🕐" iconColor="#2563eb" valueTone="primary" />
        <RecruitIconKpi title="Avg Punctuality" value="92.4%" subtext="Late margin tracking" icon="⏱" iconColor="#ef4444" trend="-0.3% late margin" />
        <RecruitIconKpi title="Total Absences" value="12 days" subtext="8 with sick leave cert" icon="📷" iconColor="#ef4444" />
      </div>
      <AttCard>
        <h3>Corporate Departmental Attendance & Compliance Scoreboard</h3>
        <p className="att-muted">Track IT checklist status, security, and asset repossessions for exiting staff</p>
        <div className="att-table-scroll">
          <table className="att-table">
            <thead>
              <tr>
                <th>DEPARTMENT UNIT</th>
                <th>STAFF SIZE</th>
                <th>AVG WORKED HOURS</th>
                <th>PUNCTUALITY SCORE</th>
                <th>APPROVED OVERTIME</th>
                <th>ABSENCE INCIDENTS</th>
                <th>COMPLIANCE RATING</th>
              </tr>
            </thead>
            <tbody>
              {DEPT_SCOREBOARD.map((row) => (
                <tr key={row.department}>
                  <td>
                    <strong>{row.department}</strong>
                  </td>
                  <td>{row.staff}</td>
                  <td>{row.avgHours}</td>
                  <td className={row.punctualityTone === 'warning' ? 'tone-warning' : 'tone-success'}>
                    <strong>{row.punctuality}</strong>
                  </td>
                  <td>{row.overtime}</td>
                  <td className="tone-danger">{row.absences}</td>
                  <td className={`tone-${row.complianceTone}`}>
                    <strong>{row.compliance}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AttCard>
      <AttCard className="att-sub-toolbar">
        <div className="att-segmented report">
          <button type="button" className={detail ? 'active' : ''} onClick={() => setDetail(true)}>
            Detail report
          </button>
          <button type="button" className={!detail ? 'active' : ''} onClick={() => setDetail(false)}>
            Summary report
          </button>
        </div>
        <div className="att-filter-group">
          <input type="search" placeholder="Search staff name..." />
          <select defaultValue="All departments">
            <option>All departments</option>
          </select>
          <select defaultValue="May 2026">
            <option>May 2026</option>
          </select>
          <button type="button" className="att-primary-btn">
            Export Report
          </button>
        </div>
      </AttCard>
      {detail ? (
        <AttCard>
          <div className="att-table-scroll">
            <table className="att-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>DATE</th>
                  <th>SHIFT</th>
                  <th>CLOCK IN</th>
                  <th>CLOCK OUT</th>
                  <th>WORK HOURS</th>
                  <th>LATE ARRIVAL</th>
                  <th>OT HOURS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {REPORT_DETAIL_ROWS.map((row) => (
                  <tr key={`${row.name}-${row.date}`}>
                    <td>
                      <AvatarCell initials={row.initials} name={row.name} />
                    </td>
                    <td>{row.date}</td>
                    <td>{row.shift}</td>
                    <td>{row.clockIn}</td>
                    <td>{row.clockOut}</td>
                    <td>{row.workHours}</td>
                    <td className={row.late !== '—' ? 'tone-danger' : ''}>{row.late}</td>
                    <td className={row.otHours !== '—' ? 'tone-primary' : ''}>{row.otHours}</td>
                    <td>
                      <RecruitPill label={row.status} tone={row.statusTone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AttCard>
      ) : (
        <AttCard>
          <p className="att-muted">Summary report aggregates by department and shift pattern.</p>
        </AttCard>
      )}
    </>
  )
}

function AvatarCell({ initials, name, sub }: { initials: string; name: string; sub?: string }) {
  return (
    <div className="att-avatar-cell">
      <span className="att-avatar">{initials}</span>
      <div>
        <strong>{name}</strong>
        {sub ? <em>{sub}</em> : null}
      </div>
    </div>
  )
}

function ShiftKv({ label, value, highlight, link }: { label: string; value: string; highlight?: boolean; link?: boolean }) {
  return (
    <div className="att-shift-kv">
      <span>{label}</span>
      {link ? (
        <button type="button" className="att-link-btn">
          {value}
        </button>
      ) : (
        <strong className={highlight ? 'tone-primary' : ''}>{value}</strong>
      )}
    </div>
  )
}

function SummaryPill({ label, value, tone }: { label: string; value: string; tone: 'success' | 'danger' | 'warning' }) {
  return (
    <span className={`att-summary-pill tone-${tone}`}>
      {label}: <strong>{value}</strong>
    </span>
  )
}

function LegendItem({ label, color }: { label: string; color: string }) {
  return (
    <span className="att-legend-item">
      <i style={{ background: color }} aria-hidden />
      {label}
    </span>
  )
}

function AttCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`att-card${className ? ` ${className}` : ''}`}>{children}</section>
}
