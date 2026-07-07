import { useEffect, useState } from 'react'
import { PAYROLL_HISTORY, PAYROLL_PREP } from '../../data/mockPayroll'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'
import { NewPaymentDurationModal, RunPayrollConfirmModal } from './PayrollModals'
import { PayAddButton, PayCard, PayIcon, PayKv, PaySectionTitle, PaySubPills, PayTableScroll } from './PayrollShared'

const SUB = ['Payment duration', 'Payroll preparation', 'Payroll run', 'Payroll history']

export function PayrollPayManagementTab({
  initialSub = 0,
  runPayrollSignal = 0,
}: {
  initialSub?: number
  runPayrollSignal?: number
}) {
  const [sub, setSub] = useState(initialSub)
  const [durationOpen, setDurationOpen] = useState(false)
  const [runOpen, setRunOpen] = useState(false)

  useEffect(() => {
    setSub(initialSub)
  }, [initialSub])

  useEffect(() => {
    if (runPayrollSignal > 0) setRunOpen(true)
  }, [runPayrollSignal])

  return (
    <>
      <PaySubPills labels={SUB} selected={sub} onSelect={setSub} />
      {sub === 0 ? <PaymentDurationView onNew={() => setDurationOpen(true)} /> : null}
      {sub === 1 ? <PayrollPreparationView /> : null}
      {sub === 2 ? <PayrollRunView onRun={() => setRunOpen(true)} /> : null}
      {sub === 3 ? <PayrollHistoryView /> : null}
      <NewPaymentDurationModal open={durationOpen} onClose={() => setDurationOpen(false)} />
      <RunPayrollConfirmModal open={runOpen} onClose={() => setRunOpen(false)} />
    </>
  )
}

function PaymentDurationView({ onNew }: { onNew: () => void }) {
  return (
    <div className="pay-split">
      <PayCard className="pay-duration-panel">
        <div className="pay-card-head between">
          <PaySectionTitle title="Payment duration setup" />
          <button type="button" className="pay-link-btn">Edit</button>
        </div>
        <PayKv label="Duration name" value="Monthly (May 2026)" />
        <PayKv label="Period start" value="1 May 2026" />
        <PayKv label="Period end" value="31 May 2026" />
        <PayKv label="Pay date" value="31 May 2026" />
        <PayKv label="1-day basic salary based on" value="26 working days / month" />
        <RecruitPill label="Current period" tone="info" />
      </PayCard>
      <PayCard>
        <div className="pay-card-head between">
          <PaySectionTitle title="Past payment durations" />
          <PayAddButton label="+ New duration" onClick={onNew} />
        </div>
        <PayTableScroll>
          <table className="pay-table">
            <thead>
              <tr>
                <th>DURATION NAME</th>
                <th>START</th>
                <th>END</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>May 2026</td>
                <td>1 May</td>
                <td>31 May</td>
                <td><span className="pay-status-outline">Current</span></td>
              </tr>
              <tr>
                <td>Apr 2026</td>
                <td>1 Apr</td>
                <td>30 Apr</td>
                <td><RecruitPill label="Confirmed" tone="success" /></td>
              </tr>
              <tr>
                <td>Mar 2026</td>
                <td>1 Mar</td>
                <td>31 Mar</td>
                <td><RecruitPill label="Confirmed" tone="success" /></td>
              </tr>
            </tbody>
          </table>
        </PayTableScroll>
      </PayCard>
    </div>
  )
}

function PayrollPreparationView() {
  return (
    <PayCard>
      <div className="pay-card-head between">
        <div>
          <strong className="pay-log-title">MAY 2026 PRE-DISBURSEMENT CHECKLIST</strong>
          <p className="pay-muted">Verify employee data and payment classifications below before performing the final month-end payroll run.</p>
        </div>
        <PayAddButton label="Validate Roster" onClick={() => {}} />
      </div>
      <PayTableScroll>
        <table className="pay-table">
          <thead>
            <tr>
              <th>STAFF MEMBER</th>
              <th>COMPLIANCE TAXES</th>
              <th>BANKING ROUTING</th>
              <th>APPROVED CLAIMS</th>
              <th>PREPARATION STATUS</th>
            </tr>
          </thead>
          <tbody>
            {PAYROLL_PREP.map((row) => (
              <tr key={row.name}>
                <td><strong>{row.name}</strong></td>
                <td>{row.compliance}</td>
                <td>{row.banking}</td>
                <td className={row.claimsNone ? 'muted' : 'tone-success'}>
                  {row.claimsNone ? <em>{row.claims}</em> : <strong>{row.claims}</strong>}
                </td>
                <td><RecruitPill label={row.status} tone={row.tone} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </PayTableScroll>
    </PayCard>
  )
}

function PayrollRunView({ onRun }: { onRun: () => void }) {
  return (
    <PayCard className="pay-run-card">
      <span className="pay-run-icon" aria-hidden>
        <PayIcon name="calculator" />
      </span>
      <h3>EXECUTE MAY 2026 MONTH-END RUN</h3>
      <p className="pay-muted">
        Once executed, this action locks monthly calculations parameters, records progressive taxing logs, and disburses digital payslips to active employees.
      </p>
      <div className="pay-run-summary">
        <div>
          <span>Target Headcount</span>
          <strong>430 Active Staff</strong>
        </div>
        <div>
          <span>Estimated Gross Payroll Release</span>
          <strong>MYR 60,590</strong>
        </div>
        <div>
          <span>Tax & EPF Withholdings</span>
          <strong className="tone-danger">- MYR 42,912.44</strong>
        </div>
      </div>
      <button type="button" className="pay-primary-btn full" onClick={onRun}>
        Confirm & Execute Payroll Disbursement
      </button>
    </PayCard>
  )
}

function PayrollHistoryView() {
  return (
    <PayCard>
      <PaySectionTitle title="Historic completed disbursements" />
      <PayTableScroll>
        <table className="pay-table">
          <thead>
            <tr>
              <th>BILLING PERIOD</th>
              <th>DISBURSED HEADCOUNT</th>
              <th>TOTAL PAID AMOUNT</th>
              <th>RELEASED DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {PAYROLL_HISTORY.map((row) => (
              <tr key={row.period}>
                <td><strong>{row.period}</strong></td>
                <td>{row.headcount}</td>
                <td>{row.amount}</td>
                <td>{row.released}</td>
                <td><button type="button" className="pay-link-btn">Download Ledger XLS</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </PayTableScroll>
    </PayCard>
  )
}
