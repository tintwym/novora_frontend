import { useState } from 'react'
import { HrToolbarPill } from '../components/hr/HrPrimitives'
import {
  CandidatePipelineTab,
  InterviewsTab,
  JobPostingTab,
  JobRequisitionTab,
  OfferManagementTab,
  PreOnboardingTab,
  ReportsTab,
} from '../components/recruitment/RecruitmentTabs'
import { INTERVIEW_BADGE } from '../data/mockRecruitment'
import '../styles/recruitment.css'

const MODULE_TABS = [
  { id: 'requisition', label: 'Job Requisition' },
  { id: 'posting', label: 'Job Posting' },
  { id: 'pipeline', label: 'Candidate Pipeline' },
  { id: 'interviews', label: 'Interviews', badge: INTERVIEW_BADGE },
  { id: 'offers', label: 'Offer Management' },
  { id: 'preboarding', label: 'Pre-Onboarding' },
  { id: 'reports', label: 'Reports' },
] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

export function RecruitmentPage() {
  const [moduleTab, setModuleTab] = useState<ModuleTab>('requisition')
  const [deptFilter, setDeptFilter] = useState('All departments')

  return (
    <div className="recruit-module">
      <div className="hr-tab-toolbar-row">
        <nav className="recruit-module-tabs" aria-label="Recruitment modules">
          {MODULE_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={moduleTab === t.id ? 'active' : ''}
              onClick={() => setModuleTab(t.id)}
            >
              {t.label}
              {'badge' in t && t.badge ? <span className="recruit-tab-badge">{t.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div className="hr-module-toolbar">
          <HrToolbarPill variant="filter">
            <select
              className="recruit-dept-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              aria-label="Department filter"
            >
              <option>All departments</option>
              <option>Engineering</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Marketing</option>
              <option>Operations</option>
            </select>
          </HrToolbarPill>
          <HrToolbarPill variant="export">
            Export
            <svg viewBox="0 0 24 24" aria-hidden className="recruit-export-icon">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </HrToolbarPill>
        </div>
      </div>

      <div className="recruit-module-body">
        {moduleTab === 'requisition' ? <JobRequisitionTab /> : null}
        {moduleTab === 'posting' ? <JobPostingTab /> : null}
        {moduleTab === 'pipeline' ? <CandidatePipelineTab /> : null}
        {moduleTab === 'interviews' ? <InterviewsTab /> : null}
        {moduleTab === 'offers' ? <OfferManagementTab /> : null}
        {moduleTab === 'preboarding' ? <PreOnboardingTab /> : null}
        {moduleTab === 'reports' ? <ReportsTab /> : null}
      </div>
    </div>
  )
}
