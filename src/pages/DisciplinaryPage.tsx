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
  { id: 'reason', label: 'Disciplinary reason', icon: 'scales' },
  { id: 'action', label: 'Disciplinary action', icon: 'shield' },
  { id: 'setup', label: 'Disciplinary setup', icon: 'document' },
  { id: 'history', label: 'Disciplinary history', icon: 'history' },
  { id: 'reports', label: 'Disciplinary reports', icon: 'chart' },
] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

function DiscTabIcon({ name }: { name: string }) {
  if (name === 'scales') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="disc-tab-icon">
        <path d="M12 3v18M5 7h14M7 7l-3 6h6L7 7zM17 7l-3 6h6l-3-6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    )
  }
  if (name === 'shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="disc-tab-icon">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'document') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="disc-tab-icon">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'history') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="disc-tab-icon">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M3 3v5h5M12 7v5l4 2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="disc-tab-icon">
      <path d="M3 3v18h18M7 16l4-4 4 4 5-6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

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
      <div className="hr-tab-toolbar-row">
        <nav className="disc-module-tabs" aria-label="Disciplinary modules">
          {MODULE_TABS.map((t) => (
            <button key={t.id} type="button" className={moduleTab === t.id ? 'active' : ''} onClick={() => setModuleTab(t.id)}>
              <DiscTabIcon name={t.icon} />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="hr-module-toolbar">
          <HrToolbarPill variant="filter">
            <select className="disc-dept-select" defaultValue="All departments" aria-label="Department filter">
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
