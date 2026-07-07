import { useState, type ReactNode } from 'react'
import { EditIconBtn } from '../ui/EditIconBtn'
import {
  DEPT_LEAVE_MATRIX,
  LEAVE_APPROVALS,
  LEAVE_ATTACHMENTS,
  LEAVE_ENTITLEMENTS,
  LEAVE_HISTORY,
  LEAVE_LOGS,
  LEAVE_POLICIES,
  LEAVE_TYPES,
} from '../../data/mockLeave'
import { RecruitIconKpi, RecruitPill } from '../recruitment/RecruitmentPrimitives'
import { ConfigureLeaveTypeModal, CreateLeavePolicyModal } from './LeaveModals'

export function LeaveTypeTab() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editName, setEditName] = useState<string | undefined>()

  return (
    <>
      <LeaveCard className="leave-sub-toolbar">
        <div className="module-toolbar-main">
          <input type="search" placeholder="Search leave type..." className="leave-search" />
          <select defaultValue="All types" aria-label="Type filter">
            <option>All types</option>
            <option>Paid</option>
            <option>Unpaid</option>
          </select>
        </div>
        <div className="module-toolbar-actions">
          <button
            type="button"
            className="leave-primary-btn"
            onClick={() => {
              setEditName(undefined)
              setModalOpen(true)
            }}
          >
            + New leave type
          </button>
        </div>
      </LeaveCard>
      <LeaveCard>
        <div className="leave-table-scroll">
          <table className="leave-table">
            <thead>
              <tr>
                <th>LEAVE TYPE NAME</th>
                <th>PAID?</th>
                <th>DEDUCTION RATE</th>
                <th>HOUR BASED</th>
                <th>ATTACHMENT REQ.</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {LEAVE_TYPES.map((row) => (
                <tr key={row.name}>
                  <td>
                    <LeaveTypeDot name={row.name} color={row.color} />
                  </td>
                  <td>
                    <RecruitPill label={row.paid ? 'Yes' : 'No'} tone={row.paid ? 'success' : 'danger'} />
                  </td>
                  <td>{row.deduction}</td>
                  <td>
                    <RecruitPill label={row.hourBased ? 'Yes' : 'No'} tone={row.hourBased ? 'info' : 'neutral'} />
                  </td>
                  <td>
                    <RecruitPill label={row.attachmentReq ? 'Yes' : 'No'} tone={row.attachmentReq ? 'warning' : 'neutral'} />
                  </td>
                  <td>
                    <RecruitPill label="Active" tone="success" />
                  </td>
                  <td>
                    <EditIconBtn
                      className="leave-icon-btn"
                      onClick={() => {
                        setEditName(row.name)
                        setModalOpen(true)
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LeaveCard>
      <ConfigureLeaveTypeModal open={modalOpen} onClose={() => setModalOpen(false)} existingName={editName} />
    </>
  )
}

export function LeavePolicyTab() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <LeaveCard className="leave-sub-toolbar">
        <div className="module-toolbar-main leave-filter-group">
          <select defaultValue="All leave types">
            <option>All leave types</option>
          </select>
          <select defaultValue="All departments">
            <option>All departments</option>
          </select>
        </div>
        <div className="module-toolbar-actions">
          <button type="button" className="leave-primary-btn" onClick={() => setModalOpen(true)}>
            + New policy
          </button>
        </div>
      </LeaveCard>
      <div className="leave-policy-grid">
        {LEAVE_POLICIES.map((policy) => (
          <LeaveCard key={policy.id} className="leave-policy-card">
            <div className="leave-card-head between">
              <h3>{policy.title}</h3>
              {policy.tag ? <RecruitPill label={policy.tag} tone="success" /> : null}
            </div>
            {policy.blocks.map((block, i) => (
              <div key={`${policy.id}-${i}`} className="leave-policy-block">
                {block.title ? <h4>{block.title}</h4> : null}
                {block.rows.map((row) => (
                  <div key={row.label} className="leave-kv">
                    <span>{row.label}</span>
                    <strong className={row.highlight ? 'tone-danger' : ''}>{row.value}</strong>
                  </div>
                ))}
              </div>
            ))}
            <button type="button" className="leave-link-btn">
              Edit policy
            </button>
          </LeaveCard>
        ))}
      </div>
      <CreateLeavePolicyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

export function LeaveAttachmentTab() {
  const [selected, setSelected] = useState<number[]>([1, 3])

  function toggleAll() {
    setSelected(selected.length === LEAVE_ATTACHMENTS.length ? [] : LEAVE_ATTACHMENTS.map((r) => r.id))
  }

  return (
    <>
      <LeaveCard className="leave-sub-toolbar">
        <div className="module-toolbar-main leave-filter-group">
          <select defaultValue="All leave types">
            <option>All leave types</option>
          </select>
          <select defaultValue="All departments">
            <option>All departments</option>
          </select>
          <select defaultValue="All status">
            <option>All status</option>
          </select>
        </div>
        <div className="module-toolbar-actions leave-action-group">
          <button type="button" className="leave-outline-btn" onClick={toggleAll}>
            Select all
          </button>
          <button type="button" className="leave-tonal-btn">
            Manual attach
          </button>
        </div>
      </LeaveCard>
      <LeaveCard>
        <div className="leave-table-scroll">
          <table className="leave-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selected.length === LEAVE_ATTACHMENTS.length}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                <th>EMPLOYEE</th>
                <th>DEPARTMENT</th>
                <th>LEAVE TYPE</th>
                <th>ENTITLEMENT</th>
                <th>ATTACHED?</th>
                <th>ACTIVATION</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {LEAVE_ATTACHMENTS.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(row.id)}
                      onChange={() =>
                        setSelected((prev) =>
                          prev.includes(row.id) ? prev.filter((x) => x !== row.id) : [...prev, row.id],
                        )
                      }
                    />
                  </td>
                  <td>
                    <AvatarCell initials={row.initials} name={row.name} />
                  </td>
                  <td>{row.department}</td>
                  <td>
                    <LeaveTypeDot name={row.leaveType} color={row.color} />
                  </td>
                  <td>{row.entitlement}</td>
                  <td className={row.attached ? 'tone-success' : 'muted'}>
                    <strong>{row.attached ? 'Yes' : 'No'}</strong>
                  </td>
                  <td>
                    <RecruitPill label={row.activation} tone={row.activation === 'Manual' ? 'warning' : 'success'} />
                  </td>
                  <td>
                    <button type="button" className="leave-outline-btn sm">
                      {row.attached ? 'View' : 'Attach'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LeaveCard>
    </>
  )
}

export function LeaveRequestTab() {
  const [byDay, setByDay] = useState(true)

  return (
    <>
      <LeaveCard className="leave-sub-toolbar">
        <div className="module-toolbar-main leave-summary-pills">
          <SummaryPill label="Pending" value="1" tone="warning" />
          <SummaryPill label="Accepted" value="4" tone="success" />
          <SummaryPill label="Denied" value="1" tone="danger" />
          <SummaryPill label="Waiting for file" value="1" tone="info" />
        </div>
        <div className="module-toolbar-actions">
          <button type="button" className="leave-outline-btn">
            + New request
          </button>
        </div>
      </LeaveCard>
      <div className="leave-split request">
        <LeaveCard>
          <div className="leave-card-head between">
            <h3>Leave request form</h3>
            <div className="leave-segmented">
              <button type="button" className={byDay ? 'active' : ''} onClick={() => setByDay(true)}>
                By day
              </button>
              <button type="button" className={!byDay ? 'active' : ''} onClick={() => setByDay(false)}>
                By hour
              </button>
            </div>
          </div>
          <label className="leave-field">
            <span>Leave type *</span>
            <select defaultValue="Annual leave (12 days remaining)">
              <option>Annual leave (12 days remaining)</option>
              <option>Medical leave</option>
            </select>
          </label>
          <div className="leave-field-row">
            <label className="leave-field">
              <span>From date *</span>
              <input type="text" defaultValue="12/05/2026" />
            </label>
            <label className="leave-field">
              <span>To date *</span>
              <input type="text" defaultValue="14/05/2026" />
            </label>
          </div>
          <div className="leave-field-row three">
            <label className="leave-field">
              <span>Total days</span>
              <input type="text" defaultValue="3 days" readOnly />
            </label>
            <label className="leave-field">
              <span>First day</span>
              <select defaultValue="Full day">
                <option>Full day</option>
              </select>
            </label>
            <label className="leave-field">
              <span>Last day</span>
              <select defaultValue="Full day">
                <option>Full day</option>
              </select>
            </label>
          </div>
          <label className="leave-field">
            <span>Reason</span>
            <textarea rows={3} placeholder="Reason for leave request..." />
          </label>
          <label className="leave-checkbox">
            <input type="checkbox" defaultChecked />
            Send email notification to approver
          </label>
          <div className="leave-action-group">
            <button type="button" className="leave-outline-btn">
              Cancel
            </button>
            <button type="button" className="leave-outline-btn">
              Submit request
            </button>
          </div>
        </LeaveCard>
        <div>
          <LeaveCard>
            <h3>Leave balance overview</h3>
            <BalanceBar label="Annual leave" value={12 / 16} trailing="12 / 16 days" color="#2563eb" />
            <BalanceBar label="Medical leave" value={10 / 14} trailing="10 / 14 days" color="#059669" />
            <BalanceBar label="Emergency leave" value={2 / 3} trailing="2 / 3 days" color="#ea580c" />
            <BalanceBar label="Replacement leave" value={1} trailing="1 / 1 day" color="#7c3aed" />
          </LeaveCard>
          <LeaveCard>
            <h3>My time offs</h3>
            <table className="leave-table compact">
              <thead>
                <tr>
                  <th>LEAVE TYPE</th>
                  <th>DATE</th>
                  <th>DAYS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Annual</td>
                  <td>12–14 May</td>
                  <td>3</td>
                  <td>
                    <RecruitPill label="Pending" tone="warning" />
                  </td>
                </tr>
                <tr>
                  <td>Medical</td>
                  <td>2 May</td>
                  <td>1</td>
                  <td>
                    <RecruitPill label="Waiting..." tone="info" />
                  </td>
                </tr>
                <tr>
                  <td>Annual</td>
                  <td>21–22 Apr</td>
                  <td>2</td>
                  <td>
                    <RecruitPill label="Accepted" tone="success" />
                  </td>
                </tr>
                <tr>
                  <td>Emergency</td>
                  <td>5 Apr</td>
                  <td>1</td>
                  <td>
                    <RecruitPill label="Denied" tone="danger" />
                  </td>
                </tr>
              </tbody>
            </table>
          </LeaveCard>
        </div>
      </div>
    </>
  )
}

export function RequestForOthersTab() {
  return (
    <div className="leave-split request">
      <LeaveCard>
        <h3>Request leave on behalf</h3>
        <p className="leave-muted">Submit a leave application for another employee.</p>
        <label className="leave-field">
          <span>Employee *</span>
          <select defaultValue="">
            <option value="">-- Select employee --</option>
            <option>Raj Kumar · EMP-0048</option>
            <option>Maya Tan · EMP-0012</option>
          </select>
        </label>
        <label className="leave-field">
          <span>Leave type *</span>
          <select defaultValue="Medical leave">
            <option>Medical leave</option>
            <option>Annual leave</option>
          </select>
        </label>
        <div className="leave-field-row">
          <label className="leave-field">
            <span>From date *</span>
            <input type="text" defaultValue="01/05/2026" />
          </label>
          <label className="leave-field">
            <span>To date *</span>
            <input type="text" defaultValue="01/05/2026" />
          </label>
        </div>
        <label className="leave-field">
          <span>Reason</span>
          <textarea rows={3} placeholder="HR note or medical reason..." />
        </label>
        <button type="button" className="leave-primary-btn">
          Submit on behalf
        </button>
      </LeaveCard>
      <LeaveCard>
        <h3>Recent behalf requests</h3>
        <table className="leave-table compact">
          <thead>
            <tr>
              <th>EMPLOYEE</th>
              <th>TYPE</th>
              <th>DATE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Maya Tan</td>
              <td>Medical</td>
              <td>1 May</td>
              <td>
                <RecruitPill label="Waiting file" tone="info" />
              </td>
            </tr>
            <tr>
              <td>Raj Kumar</td>
              <td>Annual</td>
              <td>21–22 Apr</td>
              <td>
                <RecruitPill label="Accepted" tone="success" />
              </td>
            </tr>
          </tbody>
        </table>
      </LeaveCard>
    </div>
  )
}

export function LeaveApprovalTab() {
  return (
    <>
      <LeaveCard className="leave-sub-toolbar">
        <div className="module-toolbar-main leave-filter-group">
          <select defaultValue="All status">
            <option>All status</option>
          </select>
          <select defaultValue="All leave types">
            <option>All leave types</option>
          </select>
          <input type="text" defaultValue="06/05/2026" aria-label="Date filter" />
          <span className="leave-pending-pill">3 pending</span>
        </div>
        <div className="module-toolbar-actions">
          <button type="button" className="leave-link-btn">
            Reset
          </button>
        </div>
      </LeaveCard>
      <LeaveCard>
        <div className="leave-table-scroll">
          <table className="leave-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>LEAVE TYPE</th>
                <th>FROM / TO</th>
                <th>DAYS</th>
                <th>REASON</th>
                <th>APPROVED BY</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {LEAVE_APPROVALS.map((row) => (
                <tr key={row.name}>
                  <td>
                    <AvatarCell initials={row.initials} name={row.name} />
                  </td>
                  <td>
                    <RecruitPill label={row.leaveType} tone={row.typeTone} />
                  </td>
                  <td>
                    {row.from} → {row.to}
                  </td>
                  <td>{row.days}</td>
                  <td>{row.reason}</td>
                  <td>{row.approver}</td>
                  <td>
                    <RecruitPill label={row.status} tone={row.statusTone} />
                  </td>
                  <td>
                    {row.pending ? (
                      <div className="leave-action-group">
                        <button type="button" className="leave-success-btn">
                          Approve
                        </button>
                        <button type="button" className="leave-danger-outline-btn">
                          Deny
                        </button>
                      </div>
                    ) : (
                      <span className={row.actionNote ? 'tone-danger' : ''}>{row.actionNote ?? row.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LeaveCard>
    </>
  )
}

export function LeaveHistoryTab() {
  return (
    <>
      <LeaveCard className="leave-sub-toolbar">
        <div className="module-toolbar-main leave-filter-group">
          <select defaultValue="All status">
            <option>All status</option>
          </select>
          <select defaultValue="All leave types">
            <option>All leave types</option>
          </select>
          <select defaultValue="All departments">
            <option>All departments</option>
          </select>
          <input type="search" placeholder="Search employee..." />
        </div>
        <div className="module-toolbar-actions leave-action-group">
          <button type="button" className="leave-outline-btn">
            Leave card
          </button>
          <button type="button" className="leave-outline-btn">
            Generate PDF
          </button>
          <button type="button" className="leave-outline-btn">
            Export
          </button>
        </div>
      </LeaveCard>
      <LeaveCard>
        <div className="leave-table-scroll">
          <table className="leave-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>LEAVE TYPE</th>
                <th>FROM / TO</th>
                <th>DAYS</th>
                <th>REQUESTED BY</th>
                <th>APPROVED BY</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {LEAVE_HISTORY.map((row) => (
                <tr key={`${row.name}-${row.from}`}>
                  <td>
                    <AvatarCell initials={row.initials} name={row.name} />
                  </td>
                  <td>
                    <RecruitPill label={row.leaveType} tone={row.typeTone} />
                  </td>
                  <td>
                    {row.from} → {row.to}
                  </td>
                  <td>{row.days}</td>
                  <td>{row.requestedBy}</td>
                  <td>{row.approvedBy}</td>
                  <td>
                    <RecruitPill label={row.status} tone={row.statusTone} />
                  </td>
                  <td>
                    <button type="button" className="leave-link-btn">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LeaveCard>
    </>
  )
}

export function EmployeeLeaveProfileTab() {
  return (
    <>
      <LeaveCard className="leave-sub-toolbar">
        <div className="module-toolbar-main">
          <select defaultValue="Sarah Lim (EMP-0021)">
            <option>Sarah Lim (EMP-0021)</option>
            <option>Raj Kumar (EMP-0048)</option>
          </select>
        </div>
        <div className="module-toolbar-actions">
          <button type="button" className="leave-link-btn">
            Leave & time off policy
          </button>
        </div>
      </LeaveCard>
      <div className="leave-split profile">
        <div>
          <LeaveCard>
            <div className="leave-profile-head">
              <span className="leave-avatar lg">SL</span>
              <div>
                <h3>Sarah Lim Wei Ling</h3>
                <p>EMP-0021 · Engineering · Senior Developer</p>
              </div>
            </div>
            <KvLine label="Employment type" value="Permanent" />
            <KvLine label="Join date" value="12 Jan 2021" />
            <KvLine label="Service period" value="4 years 3 months" />
            <KvLine label="Leave year" value="Jan – Dec 2026" />
          </LeaveCard>
          <LeaveCard>
            <h3>Leave entitlement & balance</h3>
            <table className="leave-table compact">
              <thead>
                <tr>
                  <th>LEAVE TYPE</th>
                  <th>ENTITLED</th>
                  <th>USED</th>
                  <th>BALANCE</th>
                  <th>CARRIED FORWARD</th>
                </tr>
              </thead>
              <tbody>
                {LEAVE_ENTITLEMENTS.map((row) => (
                  <tr key={row.label}>
                    <td>
                      <LeaveTypeDot name={row.label} color={row.color} />
                    </td>
                    <td>{row.entitled}</td>
                    <td>{row.used}</td>
                    <td>{row.balance}</td>
                    <td>{row.carried}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </LeaveCard>
        </div>
        <div>
          <LeaveCard>
            <h3>Applied policies</h3>
            <PolicyLine label="Annual leave policy" status="Applied" tone="success" />
            <p className="leave-bonus-note">Service leave bonus: +2 days (3–5 yrs)</p>
            <PolicyLine label="Medical leave policy" status="Applied" tone="success" />
            <PolicyLine label="Emergency leave policy" status="Applied" tone="success" />
            <PolicyLine label="Maternity leave" status="Not attached" tone="neutral" />
            <PolicyLine label="Replacement leave" status="Manual attached" tone="success" />
            <PolicyLine label="Unpaid leave" status="Applied" tone="success" />
          </LeaveCard>
          <LeaveCard>
            <h3>Recent leave activity</h3>
            <table className="leave-table compact">
              <thead>
                <tr>
                  <th>LEAVE TYPE</th>
                  <th>DATE</th>
                  <th>DAYS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Annual</td>
                  <td>12–14 May</td>
                  <td>3</td>
                  <td>
                    <RecruitPill label="Pending" tone="warning" />
                  </td>
                </tr>
                <tr>
                  <td>Annual</td>
                  <td>21–22 Apr</td>
                  <td>2</td>
                  <td>
                    <RecruitPill label="Accepted" tone="success" />
                  </td>
                </tr>
                <tr>
                  <td>Medical</td>
                  <td>3 Mar</td>
                  <td>2</td>
                  <td>
                    <RecruitPill label="Accepted" tone="success" />
                  </td>
                </tr>
              </tbody>
            </table>
          </LeaveCard>
        </div>
      </div>
    </>
  )
}

export function LeaveReportsTab() {
  const [detail, setDetail] = useState(true)

  return (
    <>
      <div className="leave-kpi-row">
        <RecruitIconKpi title="ABSENCE OUTRATE" value="4.8%" subtext="Company-wide average" icon="clock" iconColor="#2563eb" trend="↑ +0.6% this month" />
        <RecruitIconKpi title="ACTIVE REQUESTS" value="15 active" subtext="Across all units" icon="users" iconColor="#2563eb" />
        <RecruitIconKpi title="ANNUAL TIME-OFF" value="56.5 days" subtext="18 FTEs involved" icon="clipboard" iconColor="#7c3aed" valueTone="primary" />
        <RecruitIconKpi title="MEDICAL LEAVE RATE" value="14.0 days" subtext="All Doctor-certified" icon="check" iconColor="#059669" />
      </div>
      <LeaveCard>
        <h3>Departmental Time Off & Leave Utilization Matrix</h3>
        <p className="leave-muted">Aggregated leave consumption by organizational unit.</p>
        <div className="leave-table-scroll">
          <table className="leave-table">
            <thead>
              <tr>
                <th>DEPARTMENT UNIT</th>
                <th>FTE SIZE</th>
                <th>ANNUAL USED</th>
                <th>MEDICAL TAKEN</th>
                <th>UNPAID RECORDED</th>
                <th>ACCRUED BALANCE AVG</th>
                <th>UTILIZATION ASSESSMENT</th>
              </tr>
            </thead>
            <tbody>
              {DEPT_LEAVE_MATRIX.map((row) => (
                <tr key={row.department}>
                  <td>
                    <strong>{row.department}</strong>
                  </td>
                  <td>{row.fte}</td>
                  <td>{row.annualUsed}</td>
                  <td className="tone-success">
                    <strong>{row.medicalTaken}</strong>
                  </td>
                  <td className="tone-danger">
                    <strong>{row.unpaidRecorded}</strong>
                  </td>
                  <td>{row.accruedBalance}</td>
                  <td>
                    <RecruitPill label={row.assessment} tone={row.assessmentTone} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LeaveCard>
      <LeaveCard className="leave-sub-toolbar">
        <div className="module-toolbar-main">
          <div className="leave-segmented report">
            <button type="button" className={detail ? 'active' : ''} onClick={() => setDetail(true)}>
              Detail time-off report
            </button>
            <button type="button" className={!detail ? 'active' : ''} onClick={() => setDetail(false)}>
              Summary balance report
            </button>
          </div>
          <div className="leave-filter-group">
            <input type="search" placeholder="Search staff name..." />
            <select defaultValue="All departments">
              <option>All departments</option>
            </select>
            <select defaultValue="May 2026">
              <option>May 2026</option>
            </select>
          </div>
        </div>
        <div className="module-toolbar-actions">
          <button type="button" className="leave-primary-btn">
            Export Report
          </button>
        </div>
      </LeaveCard>
      {detail ? (
        <LeaveCard>
          <div className="leave-card-head between">
            <strong className="leave-log-title">DETAILED TIME-OFF LOGS — MAY 2026</strong>
            <span className="leave-muted">Showing 8 log indices</span>
          </div>
          <div className="leave-table-scroll">
            <table className="leave-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>EMPLOYEE</th>
                  <th>DEPARTMENT</th>
                  <th>LEAVE TYPE</th>
                  <th>DAYS</th>
                  <th>DURATION</th>
                  <th>PAID OPTION</th>
                  <th>RATE BREAKDOWN</th>
                  <th>APPROVED BY</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {LEAVE_LOGS.map((row) => (
                  <tr key={row.id}>
                    <td className="tone-primary">
                      <strong>{row.id}</strong>
                    </td>
                    <td>
                      <strong>{row.employee}</strong>
                    </td>
                    <td>{row.department}</td>
                    <td>{row.leaveType}</td>
                    <td>{row.days}</td>
                    <td>{row.duration}</td>
                    <td>{row.paid}</td>
                    <td>{row.rate}</td>
                    <td>{row.approvedBy}</td>
                    <td>
                      <RecruitPill label="Approved" tone="success" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LeaveCard>
      ) : (
        <LeaveCard>
          <p className="leave-muted">Summary balance report aggregates entitlement usage by department.</p>
        </LeaveCard>
      )}
    </>
  )
}

function LeaveTypeDot({ name, color }: { name: string; color: string }) {
  return (
    <span className="leave-type-dot">
      <i style={{ background: color }} aria-hidden />
      {name}
    </span>
  )
}

function AvatarCell({ initials, name }: { initials: string; name: string }) {
  return (
    <span className="leave-avatar-cell">
      <span className="leave-avatar">{initials}</span>
      <strong>{name}</strong>
    </span>
  )
}

function SummaryPill({ label, value, tone }: { label: string; value: string; tone: 'success' | 'warning' | 'danger' | 'info' }) {
  return (
    <span className={`leave-summary-pill tone-${tone}`}>
      {label}: <strong>{value}</strong>
    </span>
  )
}

function BalanceBar({ label, value, trailing, color }: { label: string; value: number; trailing: string; color: string }) {
  return (
    <div className="leave-balance-bar">
      <div>
        <span>{label}</span>
        <em>{trailing}</em>
      </div>
      <div className="leave-balance-track">
        <span style={{ width: `${Math.round(value * 100)}%`, background: color }} />
      </div>
    </div>
  )
}

function KvLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="leave-kv">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function PolicyLine({ label, status, tone }: { label: string; status: string; tone: 'success' | 'neutral' }) {
  return (
    <div className="leave-policy-line">
      <span>{label}</span>
      <RecruitPill label={status} tone={tone} />
    </div>
  )
}

function LeaveCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`leave-card${className ? ` ${className}` : ''}`}>{children}</section>
}
