import { useState } from 'react'
import { BenefIcon } from '../components/benefits/BenefitsShared'
import {
  BenefitsDependentsTab,
  BenefitsEnrollmentTab,
  BenefitsPayrollTab,
  BenefitsReportsTab,
  BenefitsVendorTab,
  BenefitsWellnessTab,
} from '../components/benefits/BenefitsTabs'
import { HrToolbarPill } from '../components/hr/HrPrimitives'
import { BENEFIT_EMPLOYEES } from '../data/mockBenefits'
import '../styles/benefits.css'
import '../styles/recruitment.css'

const MODULE_TABS = [
  { id: 'enrollment', label: 'Enrollment & Selection', icon: 'enrollment' },
  { id: 'wellness', label: 'Wellness Wallets & FSA', icon: 'wellness' },
  { id: 'dependents', label: 'Dependents & Beneficiaries', icon: 'dependents' },
  { id: 'payroll', label: 'Payroll Integration', icon: 'payroll' },
  { id: 'vendor', label: 'Vendor Management', icon: 'vendor' },
  { id: 'reports', label: 'Benefits Reports & Analytics', icon: 'reports' },
] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

export function BenefitsPage() {
  const [moduleTab, setModuleTab] = useState<ModuleTab>('enrollment')
  const [employee, setEmployee] = useState<string>(BENEFIT_EMPLOYEES[0])

  return (
    <div className="ben-module">
      <div className="hr-tab-toolbar-row">
        <nav className="ben-module-tabs" aria-label="Benefits modules">
          {MODULE_TABS.map((t) => (
            <button key={t.id} type="button" className={moduleTab === t.id ? 'active' : ''} onClick={() => setModuleTab(t.id)}>
              <BenefIcon name={t.icon} className="ben-tab-icon" />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="hr-module-toolbar ben-module-toolbar">
          <span className="ben-employee-label">VIEWING EMPLOYEE PROFILE:</span>
          <HrToolbarPill variant="filter">
            <select className="ben-employee-select" value={employee} onChange={(e) => setEmployee(e.target.value)} aria-label="Employee profile">
              {BENEFIT_EMPLOYEES.map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>
          </HrToolbarPill>
        </div>
      </div>

      <div className="ben-module-body">
        {moduleTab === 'enrollment' ? <BenefitsEnrollmentTab /> : null}
        {moduleTab === 'wellness' ? <BenefitsWellnessTab /> : null}
        {moduleTab === 'dependents' ? <BenefitsDependentsTab employee={employee} /> : null}
        {moduleTab === 'payroll' ? <BenefitsPayrollTab /> : null}
        {moduleTab === 'vendor' ? <BenefitsVendorTab /> : null}
        {moduleTab === 'reports' ? <BenefitsReportsTab /> : null}
      </div>
    </div>
  )
}
