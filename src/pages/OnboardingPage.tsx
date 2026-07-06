import { useState } from 'react'
import { HrToolbarPill } from '../components/hr/HrPrimitives'
import {
  ExitInterviewsTab,
  KnowledgeBaseTab,
  OffboardingTab,
  PreOnboardingPortalTab,
  ReportsAnalyticsTab,
  TasksChecklistsTab,
} from '../components/onboarding/OnboardingTabs'
import '../styles/onboarding.css'

const TALENTS = ['Ahmad Wahid', 'Sarah Lim', 'John Doe'] as const

const MODULE_TABS = [
  { id: 'portal', label: 'Pre-Onboarding Portal' },
  { id: 'tasks', label: 'Tasks & Checklists' },
  { id: 'knowledge', label: 'Knowledge Base' },
  { id: 'offboarding', label: 'Offboarding & Clearance' },
  { id: 'exit', label: 'Exit Interviews' },
  { id: 'reports', label: 'Reports & Analytics' },
] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

export function OnboardingPage() {
  const [moduleTab, setModuleTab] = useState<ModuleTab>('portal')
  const [activeTalent, setActiveTalent] = useState<string>(TALENTS[0])

  return (
    <div className="onboard-module">
      <div className="onboard-tab-row">
        <nav className="onboard-module-tabs" aria-label="On/Off-boarding modules">
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
        <label className="onboard-talent-select">
          <span>ACTIVE TALENT:</span>
          <select value={activeTalent} onChange={(e) => setActiveTalent(e.target.value)}>
            {TALENTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="hr-module-subtoolbar">
        <div />
        <div className="hr-module-subtoolbar-actions">
          <HrToolbarPill variant="filter">
            <select className="onboard-dept-select" defaultValue="All departments" aria-label="Department filter">
              <option>All departments</option>
              <option>Engineering</option>
              <option>HR</option>
              <option>Operations</option>
            </select>
          </HrToolbarPill>
          <HrToolbarPill variant="export">
            Export
            <svg viewBox="0 0 24 24" aria-hidden className="onboard-export-icon">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </HrToolbarPill>
        </div>
      </div>

      <div className="onboard-module-body">
        {moduleTab === 'portal' ? <PreOnboardingPortalTab talent={activeTalent} /> : null}
        {moduleTab === 'tasks' ? <TasksChecklistsTab talent={activeTalent} /> : null}
        {moduleTab === 'knowledge' ? <KnowledgeBaseTab /> : null}
        {moduleTab === 'offboarding' ? <OffboardingTab /> : null}
        {moduleTab === 'exit' ? <ExitInterviewsTab talent={activeTalent} /> : null}
        {moduleTab === 'reports' ? <ReportsAnalyticsTab /> : null}
      </div>
    </div>
  )
}
