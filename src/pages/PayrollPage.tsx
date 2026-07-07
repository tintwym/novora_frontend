import { useState } from 'react'
import { HrToolbarPill } from '../components/hr/HrPrimitives'
import { PayrollAllowanceTab } from '../components/payroll/PayrollAllowanceTab'
import { PayrollBonusTab } from '../components/payroll/PayrollBonusTab'
import { PayrollDeductionTab } from '../components/payroll/PayrollDeductionTab'
import { PayrollDepositTab } from '../components/payroll/PayrollDepositTab'
import { PayIcon } from '../components/payroll/PayrollShared'
import { PayrollOvertimeTab } from '../components/payroll/PayrollOvertimeTab'
import { PayrollPayManagementTab } from '../components/payroll/PayrollPayManagementTab'
import { PayrollReportsTab } from '../components/payroll/PayrollReportsTab'
import { PayrollTaxTab } from '../components/payroll/PayrollTaxTab'
import '../styles/payroll.css'
import '../styles/recruitment.css'

const PRIMARY_TABS = [
  { id: 'allowance', label: 'Allowance', icon: 'tag' },
  { id: 'bonus', label: 'Bonus', icon: 'chart' },
  { id: 'overtime', label: 'Overtime', icon: 'clock' },
  { id: 'deposit', label: 'Deposit', icon: 'layers' },
  { id: 'deduction', label: '% Deduction', icon: 'percent' },
  { id: 'tax', label: 'Tax', icon: 'document' },
  { id: 'paymgmt', label: 'Pay management', icon: 'card' },
  { id: 'reports', label: 'Payroll Reports', icon: 'reports' },
] as const

type PrimaryTab = (typeof PRIMARY_TABS)[number]['id']

function PayTabIcon({ name }: { name: string }) {
  const cls = 'pay-tab-icon'
  if (name === 'tag') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'chart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M3 3v18h18M7 16l4-4 4 4 5-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'clock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6v6l4 2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'layers') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'percent') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <circle cx="7" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m5 19 14-14" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'document') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'card') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={cls}>
        <rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M2 10h20" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cls}>
      <path d="M18 20V10M12 20V4M6 20v-6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

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
      <div className="hr-tab-toolbar-row">
        <nav className="pay-module-tabs" aria-label="Payroll modules">
          {PRIMARY_TABS.map((t) => (
            <button key={t.id} type="button" className={primaryTab === t.id ? 'active' : ''} onClick={() => setPrimaryTab(t.id)}>
              <PayTabIcon name={t.icon} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="hr-module-toolbar">
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
              <option>Finance</option>
              <option>HR</option>
              <option>Marketing</option>
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
            <PayIcon name="calculator" className="pay-run-btn-icon" />
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
