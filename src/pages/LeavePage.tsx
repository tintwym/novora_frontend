import { useState } from 'react'
import { HrToolbarPill } from '../components/hr/HrPrimitives'
import {
  EmployeeLeaveProfileTab,
  LeaveApprovalTab,
  LeaveAttachmentTab,
  LeaveHistoryTab,
  LeavePolicyTab,
  LeaveReportsTab,
  LeaveRequestTab,
  LeaveTypeTab,
  RequestForOthersTab,
} from '../components/leave/LeaveTabs'
import { LEAVE_APPROVAL_BADGE } from '../data/mockLeave'
import '../styles/leave.css'
import '../styles/recruitment.css'

const MODULE_TABS = [
  { id: 'type', label: 'Leave type' },
  { id: 'policy', label: 'Leave policy' },
  { id: 'attachment', label: 'Leave attachment' },
  { id: 'request', label: 'Leave request' },
  { id: 'others', label: 'Request for others' },
  { id: 'approval', label: 'Leave approval', badge: LEAVE_APPROVAL_BADGE, badgeTone: 'warning' as const },
  { id: 'history', label: 'Leave history' },
  { id: 'profile', label: 'Employee leave profile' },
  { id: 'reports', label: 'Leave reports' },
] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

export function LeavePage() {
  const [moduleTab, setModuleTab] = useState<ModuleTab>('type')

  return (
    <div className="leave-module">
      <div className="hr-tab-toolbar-row">
        <nav className="leave-module-tabs" aria-label="Leave modules">
          {MODULE_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={moduleTab === t.id ? 'active' : ''}
              onClick={() => setModuleTab(t.id)}
            >
              {t.label}
              {'badge' in t && t.badge ? (
                <span className={`leave-tab-badge${'badgeTone' in t && t.badgeTone === 'warning' ? ' warning' : ''}`}>
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="hr-module-toolbar">
          <HrToolbarPill variant="filter">
            <select className="leave-year-select" defaultValue="2026" aria-label="Year filter">
              <option>2026</option>
              <option>2025</option>
            </select>
          </HrToolbarPill>
          <HrToolbarPill variant="filter">
            <select className="leave-dept-select" defaultValue="All departments" aria-label="Department filter">
              <option>All departments</option>
              <option>Engineering</option>
              <option>HR</option>
            </select>
          </HrToolbarPill>
          <HrToolbarPill variant="export">
            Export
            <svg viewBox="0 0 24 24" aria-hidden className="leave-export-icon">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </HrToolbarPill>
          <button type="button" className="leave-new-request-btn" onClick={() => setModuleTab('request')}>
            + New leave request
          </button>
        </div>
      </div>

      <div className="leave-module-body">
        {moduleTab === 'type' ? <LeaveTypeTab /> : null}
        {moduleTab === 'policy' ? <LeavePolicyTab /> : null}
        {moduleTab === 'attachment' ? <LeaveAttachmentTab /> : null}
        {moduleTab === 'request' ? <LeaveRequestTab /> : null}
        {moduleTab === 'others' ? <RequestForOthersTab /> : null}
        {moduleTab === 'approval' ? <LeaveApprovalTab /> : null}
        {moduleTab === 'history' ? <LeaveHistoryTab /> : null}
        {moduleTab === 'profile' ? <EmployeeLeaveProfileTab /> : null}
        {moduleTab === 'reports' ? <LeaveReportsTab /> : null}
      </div>
    </div>
  )
}
