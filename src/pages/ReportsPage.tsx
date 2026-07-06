import { useState } from 'react'
import { CustomBuilderPanel, ReportsCenterPanel, ScheduledReportsPanel } from '../components/reports/ReportsPanels'
import type { ReportPanelId } from '../types/reports'
import { REPORT_PANELS } from '../types/reports'
import '../styles/reports.css'

export function ReportsPage() {
  const [panel, setPanel] = useState<ReportPanelId>('report_centre')

  return (
    <div className="rpt-module">
      <nav className="rpt-subnav" aria-label="Reports sections">
        {REPORT_PANELS.map((p) => (
          <button key={p.id} type="button" className={panel === p.id ? 'active' : ''} onClick={() => setPanel(p.id)}>
            {p.label}
          </button>
        ))}
      </nav>
      {panel === 'report_centre' ? <ReportsCenterPanel /> : null}
      {panel === 'scheduled' ? <ScheduledReportsPanel /> : null}
      {panel === 'custom_builder' ? <CustomBuilderPanel /> : null}
    </div>
  )
}
