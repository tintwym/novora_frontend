import { useState } from 'react'
import { HrToolbarPill } from '../components/hr/HrPrimitives'
import {
  CheckInTab,
  DutyRosterTab,
  ManualPunchTab,
  OvertimeTab,
  ReportsTab,
  RollCallTab,
  ShiftPatternTab,
  TimesheetTab,
  UnknownSwipesTab,
} from '../components/attendance/AttendanceTabs'
import { UNKNOWN_SWIPE_BADGE } from '../data/mockAttendance'
import '../styles/attendance.css'
import '../styles/recruitment.css'

const MODULE_TABS = [
  { id: 'checkin', label: 'Check-in' },
  { id: 'roster', label: 'Duty Roster' },
  { id: 'timesheet', label: 'Timesheet' },
  { id: 'shift', label: 'Shift Pattern' },
  { id: 'rollcall', label: 'Roll Call' },
  { id: 'manual', label: 'Manual Punch' },
  { id: 'unknown', label: 'Unknown Swipes', badge: UNKNOWN_SWIPE_BADGE },
  { id: 'overtime', label: 'Overtime' },
  { id: 'reports', label: 'Reports' },
] as const

type ModuleTab = (typeof MODULE_TABS)[number]['id']

export function AttendancePage() {
  const [moduleTab, setModuleTab] = useState<ModuleTab>('checkin')

  return (
    <div className="att-module">
      <div className="hr-tab-toolbar-row">
        <nav className="att-module-tabs" aria-label="Attendance modules">
          {MODULE_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={moduleTab === t.id ? 'active' : ''}
              onClick={() => setModuleTab(t.id)}
            >
              {t.label}
              {'badge' in t && t.badge ? <span className="att-tab-badge">{t.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div className="hr-module-toolbar">
          <HrToolbarPill variant="filter">
            <select className="att-dept-select" defaultValue="All departments" aria-label="Department filter">
              <option>All departments</option>
              <option>Engineering</option>
              <option>HR</option>
              <option>Operations</option>
            </select>
          </HrToolbarPill>
          <HrToolbarPill variant="export">
            Export
            <svg viewBox="0 0 24 24" aria-hidden className="att-export-icon">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </HrToolbarPill>
          <button type="button" className="att-manual-punch-btn" onClick={() => setModuleTab('manual')}>
            + Manual punch
          </button>
        </div>
      </div>

      <div className="att-module-body">
        {moduleTab === 'checkin' ? <CheckInTab /> : null}
        {moduleTab === 'roster' ? <DutyRosterTab /> : null}
        {moduleTab === 'timesheet' ? <TimesheetTab /> : null}
        {moduleTab === 'shift' ? <ShiftPatternTab /> : null}
        {moduleTab === 'rollcall' ? <RollCallTab /> : null}
        {moduleTab === 'manual' ? <ManualPunchTab /> : null}
        {moduleTab === 'unknown' ? <UnknownSwipesTab /> : null}
        {moduleTab === 'overtime' ? <OvertimeTab /> : null}
        {moduleTab === 'reports' ? <ReportsTab /> : null}
      </div>
    </div>
  )
}
