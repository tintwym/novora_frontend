import { useNavigate } from 'react-router-dom'
import type { PayrollTotals } from '../../types/dashboard'
import { CardHeader, DashboardCard } from './DashboardCard'

export function PayrollSummaryCard({ payroll }: { payroll: PayrollTotals }) {
  const navigate = useNavigate()

  return (
    <DashboardCard>
      <CardHeader
        title="FINANCIAL OVERVIEW"
        action={
          <button
            type="button"
            className="dash-payroll-header-btn"
            aria-label="Open payroll module"
            onClick={() => navigate('/payroll')}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path
                d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        }
      />
      <p className="dash-payroll-total">{payroll.totalPayroll}</p>
      <p className="dash-payroll-sub">Total Operational Payroll</p>
      <div className="dash-payroll-bar">
        {payroll.netPayPercent > 0 ? (
          <span className="seg-net" style={{ flex: payroll.netPayPercent }} />
        ) : null}
        {payroll.deductionsPercent > 0 ? (
          <span className="seg-ded" style={{ flex: payroll.deductionsPercent }} />
        ) : null}
        {payroll.taxesPercent > 0 ? (
          <span className="seg-tax" style={{ flex: payroll.taxesPercent }} />
        ) : null}
      </div>
      <PayrollRow color="#1e40af" label="Net Pay" value={payroll.netPay} pct={`${payroll.netPayPercent}%`} />
      <PayrollRow color="#0d9488" label="Deductions" value={payroll.deductions} pct={`${payroll.deductionsPercent}%`} />
      <PayrollRow color="#818cf8" label="Taxes" value={payroll.taxes} pct={`${payroll.taxesPercent}%`} />
      <button type="button" className="dash-audit-btn" onClick={() => navigate('/payroll')}>
        $ FINALIZE AUDIT
      </button>
    </DashboardCard>
  )
}

function PayrollRow({
  color,
  label,
  value,
  pct,
}: {
  color: string
  label: string
  value: string
  pct: string
}) {
  return (
    <div className="dash-payroll-row">
      <span className="dash-payroll-dot" style={{ background: color }} />
      <span className="dash-payroll-label">{label}</span>
      <span className="dash-payroll-value">
        {value} <em>({pct})</em>
      </span>
    </div>
  )
}
