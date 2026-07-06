import { useState } from 'react'
import { EmployeeDirectoryTab } from '../components/employees/EmployeeDirectoryTab'
import { EmployeeProfile } from '../components/employees/EmployeeProfile'
import { EmployeeWizard } from '../components/employees/EmployeeWizard'
import { OrganisationChartTab } from '../components/employees/OrganisationChartTab'
import { EmployeeReportsTab } from '../components/employees/EmployeeReportsTab'
import { HrToolbarPill } from '../components/hr/HrPrimitives'
import '../styles/employees.css'

const MODULE_TABS = [
  { id: 'profile', label: 'Employee Profile' },
  { id: 'directory', label: 'Employee Directory' },
  { id: 'org', label: 'Organisation Chart' },
  { id: 'reports', label: 'Employee Reports' },
] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

export function EmployeesPage() {
  const [moduleTab, setModuleTab] = useState<ModuleTab>('directory')
  const [deptFilter, setDeptFilter] = useState('All departments')
  const [showWizard, setShowWizard] = useState(false)

  const onProfileTab = moduleTab === 'profile'

  return (
    <div className={`emp-module${showWizard ? ' emp-module--wizard-open' : ''}`}>
      {showWizard ? (
        <EmployeeWizard onClose={() => setShowWizard(false)} onSaved={() => setModuleTab('directory')} />
      ) : (
        <>
          <div className="hr-tab-toolbar-row">
            <nav className="emp-module-tabs" aria-label="Employment modules">
              {MODULE_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={moduleTab === t.id ? 'active' : ''}
                  onClick={() => setModuleTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            <div className="hr-module-toolbar">
              {onProfileTab ? (
                <button type="button" className="emp-back-link" onClick={() => setModuleTab('directory')}>
                  ‹ Back to Employee Directory
                </button>
              ) : null}
              <HrToolbarPill variant="filter">
                <select
                  className="emp-dept-select"
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  aria-label="Department filter"
                >
                  <option>All departments</option>
                  <option>Engineering</option>
                  <option>Operations</option>
                  <option>HR</option>
                  <option>Finance</option>
                </select>
              </HrToolbarPill>
              <HrToolbarPill variant="export">
                Export
                <svg viewBox="0 0 24 24" aria-hidden className="emp-export-icon">
                  <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </HrToolbarPill>
              {onProfileTab ? (
                <>
                  <button type="button" className="emp-danger-link">
                    Delete Employee
                  </button>
                  <button type="button" className="emp-text-btn">
                    Reset Password
                  </button>
                </>
              ) : null}
            </div>
          </div>

          <div className="emp-module-body">
            {moduleTab === 'profile' ? <EmployeeProfile /> : null}
            {moduleTab === 'directory' ? (
              <EmployeeDirectoryTab
                departmentFilter={deptFilter}
                onOpenProfile={() => setModuleTab('profile')}
                onAddEmployee={() => setShowWizard(true)}
              />
            ) : null}
            {moduleTab === 'org' ? (
              <OrganisationChartTab onOpenProfile={() => setModuleTab('profile')} />
            ) : null}
            {moduleTab === 'reports' ? <EmployeeReportsTab /> : null}
          </div>
        </>
      )}
    </div>
  )
}
