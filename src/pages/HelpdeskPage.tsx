import { useState } from 'react'
import { HdAutoRoutePill, HdIcon } from '../components/helpdesk/HelpdeskShared'
import {
  HelpdeskAnalyticsTab,
  HelpdeskDocumentTab,
  HelpdeskKnowledgeTab,
  HelpdeskTicketsTab,
} from '../components/helpdesk/HelpdeskTabs'
import { HELPDESK_OPEN_BADGE } from '../data/mockHelpdesk'
import '../styles/helpdesk.css'
import '../styles/recruitment.css'

const MODULE_TABS = [
  { id: 'tickets', label: 'Tickets Center & Live Chat', icon: 'tickets', badge: HELPDESK_OPEN_BADGE },
  { id: 'documents', label: 'Self-Service Document Generator', icon: 'documents' },
  { id: 'analytics', label: 'Desk Performance Analytics', icon: 'analytics' },
  { id: 'knowledge', label: 'Operational Knowledge Base', icon: 'knowledge' },
] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

export function HelpdeskPage() {
  const [moduleTab, setModuleTab] = useState<ModuleTab>('tickets')

  return (
    <div className="hd-module">
      <div className="hd-module-head">
        <nav className="hd-module-tabs" aria-label="Helpdesk modules">
          {MODULE_TABS.map((t) => (
            <button key={t.id} type="button" className={moduleTab === t.id ? 'active' : ''} onClick={() => setModuleTab(t.id)}>
              <HdIcon name={t.icon} className="hd-tab-icon" />
              {t.label}
              {'badge' in t && t.badge ? <span className="hd-tab-badge">{t.badge} Open</span> : null}
            </button>
          ))}
        </nav>
        <div className="hd-module-actions">
          <HdAutoRoutePill />
          <button type="button" className="hd-navy-btn">
            + File Inquiry Ticket
          </button>
        </div>
      </div>

      <div className={`hd-module-body${moduleTab === 'tickets' ? ' tickets' : ''}`}>
        {moduleTab === 'tickets' ? <HelpdeskTicketsTab /> : null}
        {moduleTab === 'documents' ? <HelpdeskDocumentTab /> : null}
        {moduleTab === 'analytics' ? <HelpdeskAnalyticsTab /> : null}
        {moduleTab === 'knowledge' ? <HelpdeskKnowledgeTab /> : null}
      </div>
    </div>
  )
}
