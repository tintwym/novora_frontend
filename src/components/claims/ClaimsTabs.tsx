import { useState } from 'react'
import {
  APPROVAL_CLAIMS,
  AUDIT_TRAIL,
  BUDGET_TRACKING,
  CATEGORY_SPEND,
  CLAIMS_APPROVAL_BADGE,
  DEFAULT_CLAIM_VIEW,
  DEPT_SPEND,
  FX_LOG,
  HISTORY_CLAIMS,
  NADIA_CLAIM_VIEW,
  PAYROLL_BATCH,
  POLICY_FLAGS,
  RECENT_CLAIMS,
  REPORT_CLAIMS,
  SPEND_LIMITS,
  TOP_CLAIMANTS,
  VALIDATION_RULES,
} from '../../data/mockClaims'
import type { ClaimViewData } from '../../types/claims'
import { RecruitHBar, RecruitIconKpi, RecruitPill } from '../recruitment/RecruitmentPrimitives'
import {
  ApprovalRoutingMatrixModal,
  AutoValidationRulesModal,
  EditClaimLimitModal,
} from './ClaimsModals'
import {
  ClaimAvatar,
  ClaimCard,
  ClaimField,
  ClaimLinkBtn,
  ClaimSectionTitle,
  ClaimTableScroll,
  ClaimToolbarRow,
} from './ClaimsShared'

export function ClaimsSubmitTab({ onView }: { onView: (claim: ClaimViewData) => void }) {
  return (
    <div className="claim-split submit">
      <div>
        <ClaimCard>
          <ClaimSectionTitle title="Receipt capture & OCR" trailing={<span className="claim-muted">Mobile upload · OCR scan</span>} />
          <div className="claim-upload-zone">
            <span aria-hidden>📎</span>
            <strong>Snap or upload receipt</strong>
            <p>JPG, PNG, PDF • max 10MB</p>
            <button type="button" className="claim-primary-btn">
              SCAN RECEIPT
            </button>
          </div>
        </ClaimCard>
        <ClaimCard>
          <ClaimSectionTitle title="My recent claims" />
          <ClaimTableScroll>
            <table className="claim-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>CATEGORY</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_CLAIMS.map((row) => (
                  <tr key={`${row.date}-${row.category}`}>
                    <td>{row.date}</td>
                    <td>{row.category}</td>
                    <td>
                      <strong>{row.amount}</strong>
                    </td>
                    <td>
                      <RecruitPill label={row.status} tone={row.tone} />
                    </td>
                    <td>
                      <ClaimLinkBtn label="View" onClick={() => onView(row.category === 'Transport' ? NADIA_CLAIM_VIEW : DEFAULT_CLAIM_VIEW)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ClaimTableScroll>
        </ClaimCard>
      </div>
      <ClaimCard>
        <div className="claim-card-head between">
          <ClaimSectionTitle title="Claim entry form" />
          <ClaimLinkBtn label="Claim details" />
        </div>
        <ClaimField label="Claimant employee name" required>
          <select defaultValue="">
            <option value="">Consolidated Selection (Choose employee)</option>
            <option>Sarah Lim</option>
          </select>
        </ClaimField>
        <ClaimField label="Claim category" required>
          <select defaultValue="">
            <option value="">-- Select category --</option>
            <option>Meal allowance</option>
            <option>Transport</option>
          </select>
        </ClaimField>
        <ClaimField label="Claim date" required>
          <input type="text" defaultValue="06/05/2026" />
        </ClaimField>
        <ClaimField label="Vendor / merchant">
          <input type="text" placeholder="e.g. Subway Sdn Bhd" />
        </ClaimField>
        <div className="claim-field-row">
          <ClaimField label="Currency" required>
            <select defaultValue="MYR">
              <option>MYR</option>
              <option>USD</option>
              <option>SGD</option>
            </select>
          </ClaimField>
          <ClaimField label="Amount" required>
            <input type="text" defaultValue="0.00" />
          </ClaimField>
        </div>
        <ClaimField label="MYR equiv.">
          <input type="text" defaultValue="Auto-converted" readOnly />
        </ClaimField>
        <div className="claim-fx-banner">Live exchange rate: 1 USD = 4.68 MYR • 1 SGD = 3.47 MYR • 1 EUR = 5.12 MYR (updated 1 min ago)</div>
        <ClaimField label="Project / cost centre">
          <select defaultValue="">
            <option value="">-- Select (optional) --</option>
          </select>
        </ClaimField>
        <ClaimField label="Claim description">
          <textarea rows={4} placeholder="Describe the business purpose..." />
        </ClaimField>
        <div className="claim-attach-banner">RECEIPT ATTACHMENT — Upload receipt (required for claims &gt; MYR 50)</div>
        <label className="claim-checkbox">
          <input type="checkbox" defaultChecked /> Send email notification to approver
        </label>
        <div className="claim-action-group end">
          <button type="button" className="claim-outline-btn">
            Save draft
          </button>
          <button type="button" className="claim-primary-btn">
            Submit claim
          </button>
        </div>
      </ClaimCard>
    </div>
  )
}

export function ClaimsApprovalTab({ onView }: { onView: (claim: ClaimViewData) => void }) {
  const [matrixOpen, setMatrixOpen] = useState(false)

  return (
    <>
      <ClaimToolbarRow>
        <div className="module-toolbar-main">
          <select defaultValue="All status">
            <option>All status</option>
            <option>Pending</option>
          </select>
          <select defaultValue="All categories">
            <option>All categories</option>
          </select>
          <select defaultValue="All departments">
            <option>All departments</option>
          </select>
          <input type="text" placeholder="dd/mm/yyyy" className="claim-date-input" />
          <span className="claim-count-pill warning">{CLAIMS_APPROVAL_BADGE} pending approval</span>
        </div>
        <ClaimLinkBtn label="Reset" />
      </ClaimToolbarRow>
      <ClaimCard>
        <div className="claim-card-head between">
          <strong>Approval routing rules</strong>
          <ClaimLinkBtn label="Edit rules" onClick={() => setMatrixOpen(true)} />
        </div>
        <div className="claim-rule-cards">
          <RuleCard title="Claims ≤ MYR 200" sub="Direct manager only — single approval" tag="Sequential" tone="success" />
          <RuleCard title="Claims MYR 201 – MYR 1,000" sub="Manager → Department Head" tag="Sequential" tone="warning" />
          <RuleCard title="Claims > MYR 1,000" sub="Manager → Dept Head → Finance Director" tag="Parallel with Dept Head" tone="purple" />
        </div>
      </ClaimCard>
      <ClaimCard>
        <ClaimTableScroll>
          <table className="claim-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>CATEGORY</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>APPROVAL CHAIN</th>
                <th>POLICY FLAG</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {APPROVAL_CLAIMS.map((row) => (
                <tr key={row.name}>
                  <td>
                    <ClaimAvatar initials={row.initials} name={row.name} />
                  </td>
                  <td>
                    <RecruitPill label={row.category} tone={row.categoryTone} />
                  </td>
                  <td>{row.date}</td>
                  <td>
                    <strong>{row.amount}</strong>
                    {row.foreignAmount ? <span className="claim-sub">{row.foreignAmount}</span> : null}
                  </td>
                  <td>{row.chain}</td>
                  <td>
                    <RecruitPill label={row.flag} tone={row.flagTone} />
                  </td>
                  <td>
                    <RecruitPill label={row.status} tone={row.statusTone} />
                  </td>
                  <td>
                    {row.pending ? (
                      <div className="claim-approve-reject">
                        <button type="button" className="view" onClick={() => onView(row.name === 'Nadia Chen' ? NADIA_CLAIM_VIEW : DEFAULT_CLAIM_VIEW)}>
                          View
                        </button>
                        <button type="button" className="approve">
                          Approve
                        </button>
                        <button type="button" className="reject">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <ClaimLinkBtn label="View" onClick={() => onView(NADIA_CLAIM_VIEW)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ClaimTableScroll>
      </ClaimCard>
      <ApprovalRoutingMatrixModal open={matrixOpen} onClose={() => setMatrixOpen(false)} />
    </>
  )
}

export function ClaimsPolicyTab() {
  const [limitOpen, setLimitOpen] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [editLimit, setEditLimit] = useState(SPEND_LIMITS[0])

  return (
    <>
      <div className="claim-split policy">
        <div>
          <ClaimCard>
            <div className="claim-card-head between">
              <ClaimSectionTitle title="Category spend limits" />
              <ClaimLinkBtn label="Edit limits" onClick={() => setLimitOpen(true)} />
            </div>
            <ClaimTableScroll>
              <table className="claim-table">
                <thead>
                  <tr>
                    <th>CATEGORY</th>
                    <th>DAILY LIMIT</th>
                    <th>MONTHLY CAP</th>
                    <th>RECEIPT REQ.</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {SPEND_LIMITS.map((row) => (
                    <tr key={row.category}>
                      <td>
                        <strong>{row.category}</strong>
                      </td>
                      <td>{row.daily}</td>
                      <td>{row.monthly}</td>
                      <td>
                        <RecruitPill label={row.receipt} tone={row.receiptTone} />
                      </td>
                      <td>
                        <ClaimLinkBtn
                          label="Edit"
                          onClick={() => {
                            setEditLimit(row)
                            setLimitOpen(true)
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ClaimTableScroll>
          </ClaimCard>
          <ClaimCard>
            <div className="claim-card-head between">
              <ClaimSectionTitle title="Auto-validation rules" />
              <ClaimLinkBtn label="Edit rules" onClick={() => setRulesOpen(true)} />
            </div>
            <ul className="claim-check-list">
              {VALIDATION_RULES.map((rule) => (
                <li key={rule}>
                  <input type="checkbox" defaultChecked readOnly /> {rule}
                </li>
              ))}
            </ul>
          </ClaimCard>
        </div>
        <div>
          <ClaimCard>
            <div className="claim-card-head between">
              <ClaimSectionTitle title="Policy flags — this month" />
              <RecruitPill label="8 flags" tone="danger" />
            </div>
            {POLICY_FLAGS.map((flag) => (
              <div key={flag.title} className="claim-flag-row">
                <div>
                  <span className="claim-flag-dot" style={{ background: flag.dotColor }} aria-hidden />
                  <strong>{flag.title}</strong>
                  <em>{flag.detail}</em>
                </div>
                <RecruitPill label={flag.status} tone={flag.tone} />
              </div>
            ))}
          </ClaimCard>
          <ClaimCard>
            <div className="claim-card-head between">
              <ClaimSectionTitle title="Audit trail — recent actions" />
              <ClaimLinkBtn label="Full log" />
            </div>
            {AUDIT_TRAIL.map((item) => (
              <div key={item.text} className={`claim-audit-row ${item.tone}`}>
                <i aria-hidden />
                <span>{item.text}</span>
              </div>
            ))}
          </ClaimCard>
        </div>
      </div>
      <EditClaimLimitModal
        open={limitOpen}
        onClose={() => setLimitOpen(false)}
        category={editLimit.category}
        daily={editLimit.daily}
        monthly={editLimit.monthly}
        receipt={editLimit.receipt}
      />
      <AutoValidationRulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </>
  )
}

export function ClaimsPayrollTab() {
  return (
    <div className="claim-split payroll">
      <div>
        <ClaimCard>
          <ClaimSectionTitle title="Payroll push status — May 2026" />
          <div className="claim-kv-list">
            <div>
              <span>Total approved claims</span>
              <strong className="tone-primary">MYR 378.40</strong>
            </div>
            <div>
              <span>Pushed to payroll</span>
              <strong className="tone-success">MYR 378.40</strong>
            </div>
            <div>
              <span>Awaiting push</span>
              <strong className="tone-warning">MYR 0.00</strong>
            </div>
            <div>
              <span>Payroll cut-off</span>
              <strong>25 May 2026</strong>
            </div>
            <div>
              <span>Next payroll date</span>
              <strong>31 May 2026</strong>
            </div>
            <div>
              <span>Integration status</span>
              <RecruitPill label="Connected" tone="success" />
            </div>
          </div>
        </ClaimCard>
        <ClaimCard>
          <ClaimSectionTitle title="Currency conversion log" />
          <ClaimTableScroll>
            <table className="claim-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>ORIG.</th>
                  <th>ORIG. AMT</th>
                  <th>RATE</th>
                  <th>MYR EQUIV.</th>
                </tr>
              </thead>
              <tbody>
                {FX_LOG.map((row) => (
                  <tr key={`${row.name}-${row.currency}`}>
                    <td>{row.name}</td>
                    <td>{row.currency}</td>
                    <td>{row.original}</td>
                    <td>{row.rate}</td>
                    <td>
                      <strong>{row.myr}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ClaimTableScroll>
        </ClaimCard>
      </div>
      <ClaimCard>
        <div className="claim-card-head between">
          <ClaimSectionTitle title="Claims ready for payroll batch" trailing={<RecruitPill label="0 claims" tone="warning" />} />
          <div className="claim-action-group">
            <button type="button" className="claim-outline-btn">
              Preview batch
            </button>
            <button type="button" className="claim-primary-btn">
              + Push to payroll
            </button>
          </div>
        </div>
        <ClaimTableScroll>
          <table className="claim-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>CATEGORY</th>
                <th>AMOUNT (MYR)</th>
                <th>APPROVED BY</th>
                <th>PUSH STATUS</th>
              </tr>
            </thead>
            <tbody>
              {PAYROLL_BATCH.map((row) => (
                <tr key={`${row.name}-${row.category}`}>
                  <td>
                    <ClaimAvatar initials={row.initials} name={row.name} />
                  </td>
                  <td>{row.category}</td>
                  <td>
                    <strong>{row.amount}</strong>
                  </td>
                  <td>{row.approvedBy}</td>
                  <td className="tone-success">
                    <strong>Pushed</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ClaimTableScroll>
        <div className="claim-batch-total">
          <span>Total queued for May 2026 payroll</span>
          <strong>MYR 0.00</strong>
        </div>
      </ClaimCard>
    </div>
  )
}

export function ClaimsAnalyticsTab() {
  const [reportView, setReportView] = useState(false)

  return (
    <>
      <div className="claim-analytics-toggle">
        <button type="button" className={!reportView ? 'active' : ''} onClick={() => setReportView(false)}>
          Interactive Dashboard Reports
        </button>
        <button type="button" className={reportView ? 'active' : ''} onClick={() => setReportView(true)}>
          Claims Report Generator
        </button>
      </div>
      {reportView ? <ClaimsReportGenerator /> : <ClaimsAnalyticsDashboard />}
    </>
  )
}

function ClaimsAnalyticsDashboard() {
  return (
    <>
      <div className="claim-kpi-row">
        <RecruitIconKpi title="Total Claimed — YTD" value="MYR 48,230" subtext="+12% vs last year" icon="◎" iconColor="#2563eb" trend="+12% vs last year" />
        <RecruitIconKpi title="Claimed — May 2026" value="MYR 14,820" subtext="94% of monthly budget" icon="📅" iconColor="#ea580c" trend="94% of monthly budget" />
        <RecruitIconKpi title="Policy Flags — May" value="8" subtext="4 blocked • 4 escalated" icon="⚠" iconColor="#ef4444" valueTone="danger" />
        <RecruitIconKpi title="Avg Ticket" value="MYR 284.29" subtext="Per approved claim" icon="📄" iconColor="#7c3aed" />
      </div>
      <div className="claim-split">
        <ClaimCard>
          <ClaimSectionTitle title="Spend by category — May 2026" />
          {CATEGORY_SPEND.map((row) => (
            <RecruitHBar key={row.label} label={row.label} value={row.pct} max={100} color={row.color} trailing={row.amount} />
          ))}
        </ClaimCard>
        <ClaimCard>
          <ClaimSectionTitle title="Spend by department" />
          {DEPT_SPEND.map((row) => (
            <RecruitHBar key={row.label} label={row.label} value={row.pct} max={100} color={row.color} trailing={row.amount} />
          ))}
        </ClaimCard>
      </div>
      <div className="claim-split">
        <ClaimCard>
          <ClaimSectionTitle title="Budget tracking — travel & entertainment" />
          {BUDGET_TRACKING.map((row) => (
            <div key={row.label} className="claim-budget-row">
              <div className="claim-budget-head">
                <span>{row.label}</span>
                <em>
                  {row.used} / {row.cap}
                </em>
              </div>
              <div className="claim-budget-track">
                <span style={{ width: `${row.pct}%`, background: row.color }} />
              </div>
              <small className={row.alert ? 'tone-danger' : ''}>{row.remaining}</small>
            </div>
          ))}
        </ClaimCard>
        <ClaimCard>
          <ClaimSectionTitle title="Top claimants — May 2026" />
          <ClaimTableScroll>
            <table className="claim-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>NO. CLAIMS</th>
                  <th>TOTAL (MYR)</th>
                  <th>FLAGS</th>
                </tr>
              </thead>
              <tbody>
                {TOP_CLAIMANTS.map((row) => (
                  <tr key={row.name}>
                    <td>
                      <ClaimAvatar initials={row.initials} name={row.name} />
                    </td>
                    <td>{row.claims}</td>
                    <td>
                      <strong>{row.total}</strong>
                    </td>
                    <td>
                      <RecruitPill label={row.flags} tone={row.flagTone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ClaimTableScroll>
        </ClaimCard>
      </div>
    </>
  )
}

function ClaimsReportGenerator() {
  return (
    <ClaimCard>
      <div className="claim-card-head between">
        <div>
          <strong className="claim-log-title">CLAIMS REPORT GENERATOR</strong>
          <p className="claim-muted">Filter records and compile audit sheets similar to Employee Management directory dossiers</p>
        </div>
        <div className="claim-action-group">
          <button type="button" className="claim-outline-btn">
            Print PDF Ledger
          </button>
          <button type="button" className="claim-outline-btn success">
            Download Excel
          </button>
        </div>
      </div>
      <div className="claim-filter-row">
        <select defaultValue="All Departments">
          <option>All Departments</option>
        </select>
        <select defaultValue="All Categories">
          <option>All Categories</option>
        </select>
        <select defaultValue="All Statuses">
          <option>All Statuses</option>
        </select>
        <input type="search" placeholder="e.g. Sarah" />
      </div>
      <div className="claim-kpi-row compact">
        <div>
          <span>Compiled Records</span>
          <strong>8 entries</strong>
        </div>
        <div>
          <span>Sum Ledger</span>
          <strong className="tone-primary">MYR 2274.30</strong>
        </div>
        <div>
          <span>Average Ticket</span>
          <strong>MYR 284.29</strong>
        </div>
        <div>
          <span>Policy Violations</span>
          <strong>2 infractions</strong>
        </div>
      </div>
      <ClaimTableScroll>
        <table className="claim-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>EMPLOYEE</th>
              <th>CATEGORY</th>
              <th>DATE</th>
              <th>VENDOR / MERCHANT</th>
              <th>AMOUNT (MYR)</th>
              <th>FLAG</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {REPORT_CLAIMS.map((row) => (
              <tr key={row.id}>
                <td className="tone-primary">
                  <strong>{row.id}</strong>
                </td>
                <td>
                  <strong>{row.name}</strong>
                  <span className="claim-sub">{row.department}</span>
                </td>
                <td>{row.category}</td>
                <td>{row.date}</td>
                <td>{row.vendor}</td>
                <td>
                  <strong>MYR {row.amount}</strong>
                </td>
                <td className={row.flagTone === 'danger' ? 'tone-danger' : 'tone-success'}>
                  <strong>{row.flag}</strong>
                </td>
                <td>
                  <RecruitPill label={row.status} tone={row.statusTone} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ClaimTableScroll>
    </ClaimCard>
  )
}

export function ClaimsHistoryTab({ onView }: { onView: (claim: ClaimViewData) => void }) {
  return (
    <>
      <ClaimToolbarRow>
        <div className="module-toolbar-main">
          <select defaultValue="All status">
            <option>All status</option>
          </select>
          <select defaultValue="All categories">
            <option>All categories</option>
          </select>
          <select defaultValue="All departments">
            <option>All departments</option>
          </select>
          <input type="search" placeholder="Search employee..." className="claim-search" />
        </div>
        <div className="module-toolbar-actions">
          <button type="button" className="claim-outline-btn">
            Generate PDF
          </button>
          <button type="button" className="claim-primary-btn">
            Export
          </button>
        </div>
      </ClaimToolbarRow>
      <ClaimCard>
        <ClaimTableScroll>
          <table className="claim-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>CATEGORY</th>
                <th>CLAIM DATE</th>
                <th>VENDOR</th>
                <th>AMOUNT (MYR)</th>
                <th>APPROVED BY</th>
                <th>PAYROLL MONTH</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {HISTORY_CLAIMS.map((row) => (
                <tr key={`${row.name}-${row.date}-${row.category}`}>
                  <td>
                    <ClaimAvatar initials={row.initials} name={row.name} sub={row.department} />
                  </td>
                  <td>{row.category}</td>
                  <td>{row.date}</td>
                  <td>{row.vendor}</td>
                  <td>
                    <strong>{row.amount}</strong>
                  </td>
                  <td className={row.approvedBy === 'Under review' ? 'claim-muted-cell' : ''}>{row.approvedBy}</td>
                  <td>{row.payrollMonth}</td>
                  <td>
                    <RecruitPill label={row.status} tone={row.tone} />
                  </td>
                  <td>
                    <ClaimLinkBtn label="View" onClick={() => onView(row.name === 'Nadia Chen' ? NADIA_CLAIM_VIEW : DEFAULT_CLAIM_VIEW)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ClaimTableScroll>
      </ClaimCard>
    </>
  )
}

function RuleCard({ title, sub, tag, tone }: { title: string; sub: string; tag: string; tone: 'success' | 'warning' | 'purple' }) {
  return (
    <div className="claim-rule-card">
      <div>
        <strong>{title}</strong>
        <em>{sub}</em>
      </div>
      <RecruitPill label={tag} tone={tone} />
    </div>
  )
}
