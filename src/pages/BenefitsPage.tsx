import { useState } from 'react'
import {
  BenefitsDependentsTab,
  BenefitsEnrollmentTab,
  BenefitsPayrollTab,
  BenefitsReportsTab,
  BenefitsVendorTab,
  BenefitsWellnessTab,
} from '../components/benefits/BenefitsTabs'
import { BENEFIT_EMPLOYEES } from '../data/mockBenefits'
import '../styles/benefits.css'
import '../styles/recruitment.css'

const MODULE_TABS = [
  { id: 'enrollment', label: 'Enrollment & Selection' },
  { id: 'wellness', label: 'Wellness Wallets & FSA' },
  { id: 'dependents', label: 'Dependents & Beneficiaries' },
  { id: 'payroll', label: 'Payroll Integration' },
  { id: 'vendor', label: 'Vendor Management' },
  { id: 'reports', label: 'Benefits Reports & Analytics' },
] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

export function BenefitsPage() {
  const [moduleTab, setModuleTab] = useState<ModuleTab>('enrollment')
  const [employee, setEmployee] = useState<string>(BENEFIT_EMPLOYEES[0])

  return (
    <div className="ben-module">
      <nav className="ben-module-tabs" aria-label="Benefits modules">
        {MODULE_TABS.map((t) => (
          <button key={t.id} type="button" className={moduleTab === t.id ? 'active' : ''} onClick={() => setModuleTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <div className="ben-employee-bar">
        <span className="ben-employee-label">VIEWING EMPLOYEE PROFILE:</span>
        <select className="ben-employee-select" value={employee} onChange={(e) => setEmployee(e.target.value)} aria-label="Employee profile">
          {BENEFIT_EMPLOYEES.map((emp) => (
            <option key={emp} value={emp}>
              {emp}
            </option>
          ))}
        </select>
      </div>

      <div className="ben-module-body">
        {moduleTab === 'enrollment' ? <BenefitsEnrollmentTab /> : null}
        {moduleTab === 'wellness' ? <BenefitsWellnessTab /> : null}
        {moduleTab === 'dependents' ? <BenefitsDependentsTab /> : null}
        {moduleTab === 'payroll' ? <BenefitsPayrollTab /> : null}
        {moduleTab === 'vendor' ? <BenefitsVendorTab /> : null}
        {moduleTab === 'reports' ? <BenefitsReportsTab /> : null}
      </div>
    </div>
  )
}
