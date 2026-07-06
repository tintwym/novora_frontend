import { useState } from 'react'
import {
  LearningAnalyticsTab,
  LearningAssessmentsTab,
  LearningCatalogTab,
  LearningComplianceTab,
  LearningPathsTab,
} from '../components/learning/LearningTabs'
import { LrnLiveSyncPill } from '../components/learning/LearningShared'
import '../styles/learning.css'
import '../styles/recruitment.css'

const MODULE_TABS = [
  { id: 'catalog', label: 'Course Catalog & LMS' },
  { id: 'paths', label: 'Structured Learning Paths' },
  { id: 'compliance', label: 'Compliance & Certifications' },
  { id: 'assessments', label: 'Assessments & Quiz Engine' },
  { id: 'analytics', label: 'Learning Analytics' },
] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

export function LearningPage() {
  const [moduleTab, setModuleTab] = useState<ModuleTab>('catalog')

  return (
    <div className="lrn-module">
      <div className="lrn-module-head">
        <nav className="lrn-module-tabs" aria-label="Learning modules">
          {MODULE_TABS.map((t) => (
            <button key={t.id} type="button" className={moduleTab === t.id ? 'active' : ''} onClick={() => setModuleTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <LrnLiveSyncPill />
      </div>

      <div className="lrn-module-body">
        {moduleTab === 'catalog' ? <LearningCatalogTab /> : null}
        {moduleTab === 'paths' ? <LearningPathsTab /> : null}
        {moduleTab === 'compliance' ? <LearningComplianceTab /> : null}
        {moduleTab === 'assessments' ? <LearningAssessmentsTab /> : null}
        {moduleTab === 'analytics' ? <LearningAnalyticsTab /> : null}
      </div>
    </div>
  )
}
