import { useState } from 'react'
import {
  DisciplinaryActionTab,
  DisciplinaryHistoryTab,
  DisciplinaryReasonTab,
  DisciplinaryReportsTab,
  DisciplinarySetupTab,
} from '../components/disciplinary/DisciplinaryTabs'
import { HrToolbarPill } from '../components/hr/HrPrimitives'
import '../styles/disciplinary.css'
import '../styles/recruitment.css'

const MODULE_TABS = [
  { id: 'reason', label: 'Disciplinary reason' },
  { id: 'action', label: 'Disciplinary action' },
  { id: 'setup', label: 'Disciplinary setup' },
  { id: 'history', label: 'Disciplinary history' },
  { id: 'reports', label: 'Disciplinary reports' },
] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

function primaryLabel(tab: ModuleTab): string | undefined {
  if (tab === 'reason') return '+ New reason'
  if (tab === 'action') return '+ New action'
  if (tab === 'history') return '+ New case'
  return undefined
}

export function DisciplinaryPage() {
  const [moduleTab, setModuleTab] = useState<ModuleTab>('reason')
  const [addSignal, setAddSignal] = useState(0)

  function handlePrimary() {
    if (moduleTab === 'history') setModuleTab('setup')
    else if (moduleTab === 'reason' || moduleTab === 'action') setAddSignal((s) => s + 1)
  }

  return (
    <div className="disc-module">
      <div className="disc-tab-toolbar-row">
        <nav className="disc-module-tabs" aria-label="Disciplinary modules">
          {MODULE_TABS.map((t) => (
            <button key={t.id} type="button" className={moduleTab === t.id ? 'active' : ''} onClick={() => setModuleTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="hr-module-toolbar">
          <HrToolbarPill variant="filter">
            <select className="disc-dept-select" defaultValue="All departments" aria-label="Department filter">
              <option>All departments</option>
              <option>Engineering</option>
              <option>Operations</option>
            </select>
          </HrToolbarPill>
          <HrToolbarPill variant="export">
            Export
            <svg viewBox="0 0 24 24" aria-hidden className="disc-export-icon">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </HrToolbarPill>
          {primaryLabel(moduleTab) ? (
            <button type="button" className="disc-header-primary-btn" onClick={handlePrimary}>
              {primaryLabel(moduleTab)}
            </button>
          ) : null}
        </div>
      </div>

      <div className="disc-module-body">
        {moduleTab === 'reason' ? <DisciplinaryReasonTab addSignal={addSignal} /> : null}
        {moduleTab === 'action' ? <DisciplinaryActionTab addSignal={addSignal} /> : null}
        {moduleTab === 'setup' ? <DisciplinarySetupTab /> : null}
        {moduleTab === 'history' ? <DisciplinaryHistoryTab /> : null}
        {moduleTab === 'reports' ? <DisciplinaryReportsTab /> : null}
      </div>
    </div>
  )
}
