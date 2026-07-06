import { useState } from 'react'
import { DEPT_PAYROLL, PAYROLL_LEDGER } from '../../data/mockPayroll'
import { RecruitIconKpi, RecruitPill } from '../recruitment/RecruitmentPrimitives'
import { PayCard, PaySubPills, PayTableScroll } from './PayrollShared'

const SUB = ['Interactive Dashboard Reports', 'Payroll Ledger']

export function PayrollReportsTab() {
  const [sub, setSub] = useState(0)

  return (
    <>
      <PaySubPills labels={SUB} selected={sub} onSelect={setSub} />
      {sub === 0 ? <ReportsDashboardView /> : <PayrollLedgerView />}
    </>
  )
}

function ReportsDashboardView() {
  return (
    <>
      <div className="pay-kpi-row">
        <RecruitIconKpi title="Gross Payout" value="MYR 60,590" subtext="Basic + Allowance + OT" icon="◎" iconColor="#2563eb" />
        <RecruitIconKpi title="Net Disbursements" value="MYR 51,778" subtext="Transferred basic sum" icon="👤" iconColor="#059669" valueTone="primary" />
        <RecruitIconKpi title="Withholding & Taxes" value="MYR 8,812" subtext="EPF + SOCSO + PCB" icon="%" iconColor="#ef4444" valueTone="danger" />
        <RecruitIconKpi title="Avg Paycheck" value="MYR 3,983" subtext="Average salary net" icon="📄" iconColor="#7c3aed" valueTone="primary" />
      </div>
      <PayCard>
        <h3>Departmental Budget & Payroll Cost Allocation Matrix</h3>
        <p className="pay-muted">Aggregate gross payouts, average basics, total deductions, and budget metrics by business division.</p>
        <PayTableScroll>
          <table className="pay-table">
            <thead>
              <tr>
                <th>DEPARTMENT UNIT</th>
                <th>STAFF HEADCOUNT</th>
                <th>AVG BASIC WAGE</th>
                <th>WITHHOLDINGS</th>
                <th>TOTAL GROSS PAID</th>
                <th>TOTAL NET PAID</th>
                <th>BUDGET STATUS</th>
              </tr>
            </thead>
            <tbody>
              {DEPT_PAYROLL.map((row) => (
                <tr key={row.department}>
                  <td><strong>{row.department}</strong></td>
                  <td>{row.staff}</td>
                  <td>{row.avgBasic}</td>
                  <td className="tone-danger"><strong>{row.withholdings}</strong></td>
                  <td>{row.gross}</td>
                  <td className="tone-success"><strong>{row.net}</strong></td>
                  <td>
                    <RecruitPill label={row.healthy ? 'Healthy Budget' : 'Review Needed'} tone={row.healthy ? 'success' : 'warning'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PayTableScroll>
      </PayCard>
    </>
  )
}

function PayrollLedgerView() {
  return (
    <PayCard>
      <div className="pay-toolbar-row inline">
        <input type="search" placeholder="Search employee ledger" className="pay-search" />
        <select defaultValue="All departments">
          <option>All departments</option>
        </select>
        <span className="pay-muted">Showing 13 of 13 entries</span>
        <button type="button" className="pay-primary-btn">Download Ledger</button>
      </div>
      <PayTableScroll>
        <table className="pay-table ledger">
          <thead>
            <tr>
              <th>EMPLOYEE NAME</th>
              <th>BASIC SALARY</th>
              <th className="tone-primary">ALLOWANCE SUM</th>
              <th className="tone-primary">OT PAYOUT</th>
              <th>GROSS SALARY</th>
              <th className="tone-danger">EPF (11%)</th>
              <th className="tone-danger">SOCSO & TAX</th>
              <th className="tone-danger">TOTAL DEDUCTIONS</th>
              <th className="tone-success">NET PAID SALARY</th>
            </tr>
          </thead>
          <tbody>
            {PAYROLL_LEDGER.map((row) => (
              <tr key={row.name}>
                <td>
                  <strong>{row.name}</strong>
                  <span className="pay-sub">{row.meta}</span>
                </td>
                <td>{row.basic}</td>
                <td className="tone-primary">{row.allowance}</td>
                <td className="tone-primary">{row.ot}</td>
                <td><strong>{row.gross}</strong></td>
                <td className="tone-danger">{row.epf}</td>
                <td className="tone-danger">{row.socsoTax}</td>
                <td className="tone-danger">{row.deductions}</td>
                <td className="tone-success"><strong>{row.net}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </PayTableScroll>
    </PayCard>
  )
}
