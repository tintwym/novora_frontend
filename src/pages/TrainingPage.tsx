import { useState } from 'react'
import { HrToolbarPill } from '../components/hr/HrPrimitives'
import {
  TrainingApprovalTab,
  TrainingAttendanceTab,
  TrainingBehalfTab,
  TrainingCategoryTab,
  TrainingCourseTab,
  TrainingHistoryTab,
  TrainingReportsTab,
  TrainingRequestTab,
  TrainingScheduleTab,
  TrainingSubjectTab,
  TrainingTypeTab,
} from '../components/training/TrainingTabs'
import { TRAINING_APPROVAL_BADGE } from '../data/mockTraining'
import '../styles/training.css'
import '../styles/recruitment.css'

const MODULE_TABS = [
  { id: 'type', label: 'Training Type' },
  { id: 'category', label: 'Category' },
  { id: 'course', label: 'Course' },
  { id: 'subject', label: 'Subject' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'request', label: 'Training Request' },
  { id: 'behalf', label: 'Request On Behalf' },
  { id: 'approval', label: 'Approval', badge: TRAINING_APPROVAL_BADGE },
  { id: 'attendance', label: 'Attendance' },
  { id: 'history', label: 'Training History' },
  { id: 'reports', label: 'Reports' },
] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

export function TrainingPage() {
  const [moduleTab, setModuleTab] = useState<ModuleTab>('type')

  return (
    <div className="train-module">
      <div className="train-tab-toolbar-row">
        <nav className="train-module-tabs" aria-label="Training modules">
          {MODULE_TABS.map((t) => (
            <button key={t.id} type="button" className={moduleTab === t.id ? 'active' : ''} onClick={() => setModuleTab(t.id)}>
              {t.label}
              {'badge' in t && t.badge ? <span className="train-tab-badge">{t.badge}</span> : null}
            </button>
          ))}
        </nav>
        <div className="train-module-toolbar">
          <HrToolbarPill variant="export">
            Export
            <svg viewBox="0 0 24 24" aria-hidden className="train-export-icon">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </HrToolbarPill>
        </div>
      </div>

      <div className="train-module-body">
        {moduleTab === 'type' ? <TrainingTypeTab /> : null}
        {moduleTab === 'category' ? <TrainingCategoryTab /> : null}
        {moduleTab === 'course' ? <TrainingCourseTab /> : null}
        {moduleTab === 'subject' ? <TrainingSubjectTab /> : null}
        {moduleTab === 'schedule' ? <TrainingScheduleTab /> : null}
        {moduleTab === 'request' ? <TrainingRequestTab /> : null}
        {moduleTab === 'behalf' ? <TrainingBehalfTab /> : null}
        {moduleTab === 'approval' ? <TrainingApprovalTab /> : null}
        {moduleTab === 'attendance' ? <TrainingAttendanceTab /> : null}
        {moduleTab === 'history' ? <TrainingHistoryTab /> : null}
        {moduleTab === 'reports' ? <TrainingReportsTab /> : null}
      </div>
    </div>
  )
}
