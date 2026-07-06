import { useState } from 'react'
import {
  EngagementManagerTab,
  EngagementPulseTab,
  EngagementReportsTab,
  EngagementSentimentTab,
  EngagementShoutOutTab,
} from '../components/engagement/EngagementTabs'
import { EngLiveSyncPill } from '../components/engagement/EngagementShared'
import '../styles/engagement.css'
import '../styles/recruitment.css'

const MODULE_TABS = [
  { id: 'pulse', label: 'Pulse & eNPS Surveys' },
  { id: 'sentiment', label: 'AI Sentiment & suggestions' },
  { id: 'shoutout', label: 'Peer Shout-Out Wall' },
  { id: 'manager', label: 'Manager Sentiment Desk' },
  { id: 'reports', label: 'Engagement Reports & Analytics' },
] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

export function EngagementPage() {
  const [moduleTab, setModuleTab] = useState<ModuleTab>('pulse')

  return (
    <div className="eng-module">
      <div className="eng-module-head">
        <nav className="eng-module-tabs" aria-label="Engagement modules">
          {MODULE_TABS.map((t) => (
            <button key={t.id} type="button" className={moduleTab === t.id ? 'active' : ''} onClick={() => setModuleTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <EngLiveSyncPill />
      </div>

      <div className="eng-module-body">
        {moduleTab === 'pulse' ? <EngagementPulseTab /> : null}
        {moduleTab === 'sentiment' ? <EngagementSentimentTab /> : null}
        {moduleTab === 'shoutout' ? <EngagementShoutOutTab /> : null}
        {moduleTab === 'manager' ? <EngagementManagerTab /> : null}
        {moduleTab === 'reports' ? <EngagementReportsTab /> : null}
      </div>
    </div>
  )
}
