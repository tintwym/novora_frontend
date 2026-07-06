import { useState } from 'react'
import { HrToolbarPill } from '../components/hr/HrPrimitives'
import { PayrollAllowanceTab } from '../components/payroll/PayrollAllowanceTab'
import { PayrollBonusTab } from '../components/payroll/PayrollBonusTab'
import { PayrollDeductionTab } from '../components/payroll/PayrollDeductionTab'
import { PayrollDepositTab } from '../components/payroll/PayrollDepositTab'
import { PayrollOvertimeTab } from '../components/payroll/PayrollOvertimeTab'
import { PayrollPayManagementTab } from '../components/payroll/PayrollPayManagementTab'
import { PayrollReportsTab } from '../components/payroll/PayrollReportsTab'
import { PayrollTaxTab } from '../components/payroll/PayrollTaxTab'
import '../styles/payroll.css'
import '../styles/recruitment.css'

const PRIMARY_TABS = [
  { id: 'allowance', label: 'Allowance' },
  { id: 'bonus', label: 'Bonus' },
  { id: 'overtime', label: 'Overtime' },
  { id: 'deposit', label: 'Deposit' },
  { id: 'deduction', label: '% Deduction' },
  { id: 'tax', label: 'Tax' },
  { id: 'paymgmt', label: 'Pay management' },
  { id: 'reports', label: 'Payroll Reports' },
] as const

type PrimaryTab = (typeof PRIMARY_TABS)[number]['id']

export function PayrollPage() {
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>('allowance')
  const [payMgmtSub, setPayMgmtSub] = useState(0)
  const [runPayrollSignal, setRunPayrollSignal] = useState(0)
  const [addSignal, setAddSignal] = useState(0)

  function handleRunPayroll() {
    setPrimaryTab('paymgmt')
    setPayMgmtSub(2)
    setRunPayrollSignal((s) => s + 1)
  }

  function handleAddForTab() {
    setAddSignal((s) => s + 1)
  }

  const showAdd =
    primaryTab === 'allowance' ||
    primaryTab === 'bonus' ||
    primaryTab === 'deposit' ||
    primaryTab === 'deduction' ||
    primaryTab === 'tax'

  const addLabels: Record<string, string> = {
    allowance: '+ New allowance type',
    bonus: '+ New bonus type',
    deposit: '+ New deposit type',
    deduction: '+ New deduction type',
    tax: '+ New tax category',
  }

  return (
    <div className="pay-module">
      <div className="pay-tab-toolbar-row">
        <nav className="pay-module-tabs" aria-label="Payroll modules">
          {PRIMARY_TABS.map((t) => (
            <button key={t.id} type="button" className={primaryTab === t.id ? 'active' : ''} onClick={() => setPrimaryTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="pay-module-toolbar">
          <HrToolbarPill variant="filter">
            <select className="pay-period-select" defaultValue="May 2026" aria-label="Period filter">
              <option>May 2026</option>
              <option>Apr 2026</option>
            </select>
          </HrToolbarPill>
          <HrToolbarPill variant="filter">
            <select className="pay-dept-select" defaultValue="All departments" aria-label="Department filter">
              <option>All departments</option>
              <option>Engineering</option>
              <option>Operations</option>
            </select>
          </HrToolbarPill>
          <HrToolbarPill variant="export">
            Export
            <svg viewBox="0 0 24 24" aria-hidden className="pay-export-icon">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </HrToolbarPill>
          {showAdd ? (
            <button type="button" className="pay-header-add-btn" onClick={handleAddForTab}>
              {addLabels[primaryTab]}
            </button>
          ) : null}
          <button type="button" className="pay-run-btn" onClick={handleRunPayroll}>
            Run payroll
          </button>
        </div>
      </div>

      <div className="pay-module-body">
        {primaryTab === 'allowance' ? <PayrollAllowanceTab addSignal={addSignal} /> : null}
        {primaryTab === 'bonus' ? <PayrollBonusTab addSignal={addSignal} /> : null}
        {primaryTab === 'overtime' ? <PayrollOvertimeTab /> : null}
        {primaryTab === 'deposit' ? <PayrollDepositTab addSignal={addSignal} /> : null}
        {primaryTab === 'deduction' ? <PayrollDeductionTab addSignal={addSignal} /> : null}
        {primaryTab === 'tax' ? <PayrollTaxTab addSignal={addSignal} /> : null}
        {primaryTab === 'paymgmt' ? (
          <PayrollPayManagementTab initialSub={payMgmtSub} runPayrollSignal={runPayrollSignal} />
        ) : null}
        {primaryTab === 'reports' ? <PayrollReportsTab /> : null}
      </div>
    </div>
  )
}
