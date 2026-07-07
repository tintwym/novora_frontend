import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import {
  ClaimsAnalyticsTab,
  ClaimsApprovalTab,
  ClaimsHistoryTab,
  ClaimsPayrollTab,
  ClaimsPolicyTab,
  ClaimsSubmitTab,
} from '../components/claims/ClaimsTabs'
import { ViewClaimModal } from '../components/claims/ClaimsModals'
import { ClaimIcon } from '../components/claims/ClaimsShared'
import { HrToolbarPill } from '../components/hr/HrPrimitives'
import { CLAIMS_APPROVAL_BADGE, DEFAULT_CLAIM_VIEW } from '../data/mockClaims'
import type { ClaimViewData } from '../types/claims'
import '../styles/claims.css'
import '../styles/recruitment.css'

const ADMIN_TABS = [
  { id: 'submit', label: 'Submit claim', icon: 'plus' },
  { id: 'approval', label: 'Approval', icon: 'check', badge: CLAIMS_APPROVAL_BADGE },
  { id: 'policy', label: 'Policy & compliance', icon: 'shield' },
  { id: 'payroll', label: 'Payroll integration', icon: 'payroll' },
  { id: 'analytics', label: 'Analytics & reports', icon: 'chart' },
  { id: 'history', label: 'Claim history', icon: 'history' },
] as const

const EMPLOYEE_TABS = [
  { id: 'submit', label: 'Submit claim', icon: 'plus' },
  { id: 'history', label: 'Claim history', icon: 'history' },
] as const

type AdminTab = (typeof ADMIN_TABS)[number]['id']
type EmployeeTab = (typeof EMPLOYEE_TABS)[number]['id']
type ModuleTab = AdminTab | EmployeeTab

export function ClaimsPage() {
  const { user } = useAuth()
  const employeeView = !user?.canAccessHrAdmin
  const tabs = employeeView ? EMPLOYEE_TABS : ADMIN_TABS

  const [moduleTab, setModuleTab] = useState<ModuleTab>('submit')
  const [viewOpen, setViewOpen] = useState(false)
  const [viewClaim, setViewClaim] = useState<ClaimViewData>(DEFAULT_CLAIM_VIEW)

  function openView(claim: ClaimViewData) {
    setViewClaim(claim)
    setViewOpen(true)
  }

  return (
    <div className="claim-module">
      <div className="hr-tab-toolbar-row">
        <nav className="claim-module-tabs" aria-label="Claims modules">
          {tabs.map((t) => (
            <button key={t.id} type="button" className={moduleTab === t.id ? 'active' : ''} onClick={() => setModuleTab(t.id)}>
              <ClaimIcon name={t.icon} className="claim-tab-icon" />
              {t.label}
              {'badge' in t && t.badge ? <span className="claim-tab-badge">{t.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div className="hr-module-toolbar">
          <HrToolbarPill variant="filter">
            <select className="claim-period-select" defaultValue="May 2026" aria-label="Period filter">
              <option>May 2026</option>
              <option>Apr 2026</option>
            </select>
          </HrToolbarPill>
          <HrToolbarPill variant="filter">
            <select className="claim-dept-select" defaultValue="All departments" aria-label="Department filter">
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
            <svg viewBox="0 0 24 24" aria-hidden className="claim-export-icon">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </HrToolbarPill>
        </div>
      </div>

      <div className="claim-module-body">
        {moduleTab === 'submit' ? <ClaimsSubmitTab onView={openView} /> : null}
        {!employeeView && moduleTab === 'approval' ? <ClaimsApprovalTab onView={openView} /> : null}
        {!employeeView && moduleTab === 'policy' ? <ClaimsPolicyTab /> : null}
        {!employeeView && moduleTab === 'payroll' ? <ClaimsPayrollTab /> : null}
        {!employeeView && moduleTab === 'analytics' ? <ClaimsAnalyticsTab /> : null}
        {moduleTab === 'history' ? <ClaimsHistoryTab onView={openView} /> : null}
      </div>

      <ViewClaimModal open={viewOpen} onClose={() => setViewOpen(false)} claim={viewClaim} />
    </div>
  )
}
