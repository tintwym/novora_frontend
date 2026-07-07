import { useState } from 'react'
import { HrToolbarPill } from '../components/hr/HrPrimitives'
import { PerfIcon } from '../components/performance/PerformanceShared'
import {
  PerformanceCompetencyTab,
  PerformanceEmployeeProfileTab,
  PerformanceEvalCategoryTab,
  PerformanceEvalSetupTab,
  PerformanceEvalTypeTab,
  PerformanceEvaluationTab,
  PerformanceGradeTab,
  PerformanceGrantTab,
  PerformanceKpiTab,
  PerformanceLevelTab,
  PerformanceResultTab,
  PerformanceReviewReportTab,
} from '../components/performance/PerformanceTabs'
import { PERF_EVAL_BADGE } from '../data/mockPerformance'
import '../styles/performance.css'
import '../styles/recruitment.css'

const MODULE_TABS = [
  { id: 'level', label: 'Perf. Level', icon: 'level' },
  { id: 'grade', label: '% Perf. Grade', icon: 'grade' },
  { id: 'kpi', label: 'KPI Setting', icon: 'kpi' },
  { id: 'evalType', label: 'Eval. Type', icon: 'evalType' },
  { id: 'evalCategory', label: 'Eval. Category', icon: 'evalCategory' },
  { id: 'evalSetup', label: 'Eval. Setup', icon: 'evalSetup' },
  { id: 'grant', label: 'Grant Permissions', icon: 'grant' },
  { id: 'evaluation', label: 'Evaluation', icon: 'evaluation', badge: PERF_EVAL_BADGE },
  { id: 'result', label: 'Perf. Result', icon: 'result' },
  { id: 'competency', label: 'Competency List', icon: 'competency' },
  { id: 'review', label: 'Review Report', icon: 'review' },
  { id: 'profile', label: 'Employee Profile', icon: 'profile' },
] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

export function PerformancePage() {
  const [moduleTab, setModuleTab] = useState<ModuleTab>('level')

  return (
    <div className="perf-module">
      <div className="perf-tab-toolbar-row">
        <nav className="perf-module-tabs" aria-label="Performance modules">
          {MODULE_TABS.map((t) => (
            <button key={t.id} type="button" className={moduleTab === t.id ? 'active' : ''} onClick={() => setModuleTab(t.id)}>
              <PerfIcon name={t.icon} className="perf-tab-icon" />
              {t.label}
              {'badge' in t && t.badge ? <span className="perf-tab-badge">{t.badge}</span> : null}
            </button>
          ))}
        </nav>
        <div className="perf-module-toolbar">
          <HrToolbarPill variant="filter">
            <select className="perf-year-select" defaultValue="2026" aria-label="Year filter">
              <option>2026</option>
              <option>2025</option>
            </select>
          </HrToolbarPill>
          <HrToolbarPill variant="filter">
            <select className="perf-dept-select" defaultValue="All departments" aria-label="Department filter">
              <option>All departments</option>
              <option>Engineering</option>
              <option>HR</option>
            </select>
          </HrToolbarPill>
          <HrToolbarPill variant="export">
            Export
            <svg viewBox="0 0 24 24" aria-hidden className="perf-export-icon">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </HrToolbarPill>
        </div>
      </div>

      <div className="perf-module-body">
        {moduleTab === 'level' ? <PerformanceLevelTab /> : null}
        {moduleTab === 'grade' ? <PerformanceGradeTab /> : null}
        {moduleTab === 'kpi' ? <PerformanceKpiTab /> : null}
        {moduleTab === 'evalType' ? <PerformanceEvalTypeTab /> : null}
        {moduleTab === 'evalCategory' ? <PerformanceEvalCategoryTab /> : null}
        {moduleTab === 'evalSetup' ? <PerformanceEvalSetupTab /> : null}
        {moduleTab === 'grant' ? <PerformanceGrantTab /> : null}
        {moduleTab === 'evaluation' ? <PerformanceEvaluationTab /> : null}
        {moduleTab === 'result' ? <PerformanceResultTab /> : null}
        {moduleTab === 'competency' ? <PerformanceCompetencyTab /> : null}
        {moduleTab === 'review' ? <PerformanceReviewReportTab /> : null}
        {moduleTab === 'profile' ? <PerformanceEmployeeProfileTab /> : null}
      </div>
    </div>
  )
}
