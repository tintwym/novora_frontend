import { useMemo, useState } from 'react'
import { reportModuleById, reportModulesForCategory } from '../../data/mockReports'
import type { ReportCategoryId, ReportModuleDefinition } from '../../types/reports'
import {
  RptCheckRow,
  RptDownloadList,
  RptExecutiveBriefing,
  RptFieldCheckRow,
  RptFormField,
  RptHeroCard,
  RptInput,
  RptInsightCard,
  RptOutlinedCard,
  RptQuickSnapshot,
  RptSectionCaption,
  RptSelect,
  showReportToast,
} from './ReportsShared'

const OVERVIEW_KPIS = [
  { value: '48', label: 'TOTAL REPORTS', sub: '10 modules activated', tone: 'primary' as const },
  { value: '12', label: 'SCHEDULED REPORTS', sub: 'Next: tomorrow 08:00', tone: 'success' as const },
  { value: '7', label: 'CUSTOM REPORTS SAVED', sub: 'By HR operations team', tone: 'navy' as const, subGreen: true },
]

const MOST_USED_REPORTS = [
  { title: 'Monthly payroll summary', tag: 'PAYROLL', description: 'Earnings, deductions, net pay by department.' },
  { title: 'Attendance detail report', tag: 'ATTENDANCE', description: 'Check-in, check-out, OT, absent per employee.' },
  { title: 'Leave balance summary', tag: 'LEAVE', description: 'Entitlement, used, balance per leave type.' },
  { title: 'Performance appraisal results', tag: 'PERFORMANCE', description: 'Scores, grades, OKR ratings.' },
]

const RECENT_ACTIVITY = [
  { title: 'Monthly payroll summary', meta: 'HR Admin · 8 May 10:20' },
  { title: 'Leave balance report', meta: 'Auto-scheduled · 1 May 00:00' },
  { title: 'Attendance summary — Apr', meta: 'Nina Rosa · 28 Apr 13:00' },
]

const ACTIVE_SCHEDULES = [
  { name: 'Monthly payroll summary', frequency: 'Monthly', focus: 'Cost Analysis & Allocations', audience: 'CFO & Executive Board', next: '1 Jun 08:00' },
  { name: 'Attendance summary', frequency: 'Monthly', focus: 'Workplace Velocity & SLA', audience: 'Operations Directors', next: '1 Jun 08:00' },
  { name: 'Leave balance report', frequency: 'Monthly', focus: 'Workforce Capacity & Burnout', audience: 'Executive Committee', next: '1 Jun 08:00' },
]

function useReportsNav() {
  const [categoryId, setCategoryId] = useState<ReportCategoryId>('all')
  const [moduleId, setModuleId] = useState('overview')
  const [moduleFilter, setModuleFilter] = useState('')

  const visibleModules = useMemo(() => reportModulesForCategory(categoryId, moduleFilter), [categoryId, moduleFilter])

  function onCategoryChange(id: string) {
    const cat = id as ReportCategoryId
    setCategoryId(cat)
    const modules = reportModulesForCategory(cat, moduleFilter)
    if (!modules.some((m) => m.id === moduleId) && modules.length > 0) {
      setModuleId(modules[0].id)
    }
  }

  function onFilterChange(v: string) {
    setModuleFilter(v)
    const modules = reportModulesForCategory(categoryId, v)
    if (!modules.some((m) => m.id === moduleId) && modules.length > 0) {
      setModuleId(modules[0].id)
    }
  }

  return { categoryId, moduleId, moduleFilter, visibleModules, setModuleId, onCategoryChange, onFilterChange }
}

function ReportsHero({ nav }: { nav: ReturnType<typeof useReportsNav> }) {
  return (
    <RptHeroCard
      categoryId={nav.categoryId}
      moduleId={nav.moduleId}
      moduleFilter={nav.moduleFilter}
      visibleModules={nav.visibleModules}
      onCategoryChange={nav.onCategoryChange}
      onModuleChange={nav.setModuleId}
      onFilterChange={nav.onFilterChange}
    />
  )
}

function AllOverviewBody() {
  return (
    <>
      <div className="rpt-overview-kpis">
        {OVERVIEW_KPIS.map((k) => (
          <article key={k.label} className={`rpt-overview-kpi tone-${k.tone}`}>
            <strong>{k.value}</strong>
            <span>{k.label}</span>
            <em className={k.subGreen ? 'positive' : ''}>{k.sub}</em>
          </article>
        ))}
      </div>
      <div className="rpt-split">
        <div>
          <RptSectionCaption>Most Used Reports</RptSectionCaption>
          <p className="rpt-muted">Highly optimized for operational audits & payroll reconciliation</p>
          <RptDownloadList items={MOST_USED_REPORTS} />
        </div>
        <div className="rpt-side-stack">
          <div className="rpt-q2-card">
            <div className="rpt-briefing-head">
              <span>Q2 EXECUTIVE SUMMARY DECK</span>
              <span className="rpt-risk-pill low">LIVE VIEW</span>
            </div>
            <small>STRATEGIC HEALTH INDEX</small>
            <p>94.8% Excellent — workforce stability, payroll accuracy, and support SLA all within target bands.</p>
            <small>CORE EXECUTIVE TARGETS</small>
            <ul>
              <li>Talent retention above 95% across critical engineering roles.</li>
              <li>Payroll accuracy at 100% with zero correction tickets this quarter.</li>
              <li>Support optimization — average resolution under 1.5 hours.</li>
            </ul>
          </div>
          <RptSectionCaption>Recent Activity</RptSectionCaption>
          <div className="rpt-activity-card">
            {RECENT_ACTIVITY.map((row) => (
              <div key={row.title} className="rpt-activity-row">
                <div>
                  <strong>{row.title}</strong>
                  <small>{row.meta}</small>
                </div>
                <button type="button" onClick={() => showReportToast('Downloading…')}>
                  Download
                </button>
              </div>
            ))}
          </div>
          <RptSectionCaption>Export Formats</RptSectionCaption>
          <div className="rpt-export-formats">
            <div className="excel">EXCEL</div>
            <div className="pdf">PDF</div>
            <div className="csv">CSV</div>
          </div>
        </div>
      </div>
    </>
  )
}

function ModuleDetailBody({ module }: { module: ReportModuleDefinition }) {
  return (
    <>
      <RptSectionCaption>Live Insights Snapshot</RptSectionCaption>
      <div className="rpt-insight-row">
        {module.insights.map((m) => (
          <RptInsightCard key={m.label} metric={m} />
        ))}
      </div>
      <div className="rpt-split">
        <div>
          <RptSectionCaption>{module.reportsSectionTitle}</RptSectionCaption>
          <RptDownloadList items={module.reports} />
        </div>
        <div className="rpt-side-stack">
          <RptSectionCaption>Quick Snapshot</RptSectionCaption>
          <RptQuickSnapshot snapshot={module.quickSnapshot} />
          <RptExecutiveBriefing briefing={module.briefing} />
        </div>
      </div>
    </>
  )
}

export function ReportsCenterPanel() {
  const nav = useReportsNav()
  const module = reportModuleById(nav.moduleId)

  return (
    <div className="rpt-panel">
      <ReportsHero nav={nav} />
      <div className="rpt-panel-body">
        {nav.moduleId === 'overview' ? <AllOverviewBody /> : module ? <ModuleDetailBody module={module} /> : null}
      </div>
    </div>
  )
}

export function ScheduledReportsPanel() {
  const nav = useReportsNav()
  const [reportType, setReportType] = useState('Monthly payroll summary (Consolidated)')
  const [frequency, setFrequency] = useState('Monthly ledger generation')
  const [deliveryTime, setDeliveryTime] = useState('08:00 AM (Early operational review)')
  const [format, setFormat] = useState('Excel Spreadsheet (.xlsx)')
  const [recipients, setRecipients] = useState('hr@novora.com, cfo@novora.com')

  return (
    <div className="rpt-panel">
      <ReportsHero nav={nav} />
      <div className="rpt-panel-body">
        <RptSectionCaption>Schedule New Report</RptSectionCaption>
        <RptOutlinedCard>
          <div className="rpt-form-grid">
            <RptFormField label="REPORT TYPE">
              <RptSelect
                value={reportType}
                onChange={setReportType}
                options={['Monthly payroll summary (Consolidated)', 'Leave balance report', 'Attendance summary']}
              />
            </RptFormField>
            <RptFormField label="FREQUENCY">
              <RptSelect value={frequency} onChange={setFrequency} options={['Monthly ledger generation', 'Weekly', 'Daily', 'Quarterly']} />
            </RptFormField>
            <RptFormField label="DELIVERY TIME">
              <RptSelect value={deliveryTime} onChange={setDeliveryTime} options={['08:00 AM (Early operational review)', '06:00 AM', '18:00 PM']} />
            </RptFormField>
            <RptFormField label="FORMAT">
              <RptSelect value={format} onChange={setFormat} options={['Excel Spreadsheet (.xlsx)', 'PDF', 'CSV']} />
            </RptFormField>
          </div>
          <RptFormField label="RECIPIENTS (EMAIL)">
            <RptInput value={recipients} onChange={setRecipients} />
          </RptFormField>
          <p className="rpt-hint">Separate multiple email addresses with a comma</p>
          <div className="rpt-form-actions">
            <button type="button" className="rpt-primary-btn" onClick={() => showReportToast('Schedule created.')}>
              + Schedule Automatic Dispatch
            </button>
          </div>
        </RptOutlinedCard>

        <RptSectionCaption>Active Schedules</RptSectionCaption>
        <div className="rpt-schedule-table-wrap">
          <table className="rpt-schedule-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Frequency</th>
                <th>Executive Focus</th>
                <th>Target Audience</th>
                <th>Next Run</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVE_SCHEDULES.map((row) => (
                <tr key={row.name}>
                  <td>
                    <strong>{row.name}</strong>
                  </td>
                  <td>{row.frequency}</td>
                  <td className="rpt-focus">{row.focus}</td>
                  <td>{row.audience}</td>
                  <td>{row.next}</td>
                  <td className="rpt-schedule-actions">
                    <button type="button" aria-label="Download" onClick={() => showReportToast('Download')}>
                      ↓
                    </button>
                    <button type="button" aria-label="Edit" onClick={() => showReportToast('Edit')}>
                      ✎
                    </button>
                    <button type="button" aria-label="Delete" onClick={() => showReportToast('Delete')}>
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function CustomBuilderPanel() {
  const nav = useReportsNav()
  const [primaryModule, setPrimaryModule] = useState('Employee management')
  const [combineAttendance, setCombineAttendance] = useState(true)
  const [combineLeave, setCombineLeave] = useState(false)
  const [combinePayroll, setCombinePayroll] = useState(false)
  const [combinePerformance, setCombinePerformance] = useState(false)
  const [dateFrom, setDateFrom] = useState('01/01/2026')
  const [dateTo, setDateTo] = useState('31/05/2026')
  const [department, setDepartment] = useState('All departments — Global Roster')
  const [employmentStatus, setEmploymentStatus] = useState('Active rosters only')
  const [sortBy, setSortBy] = useState('Employee No. Sequence')
  const [format, setFormat] = useState('Excel Spreadsheet (.xlsx)')
  const [fields, setFields] = useState<Record<string, boolean>>({
    'Employee No.': true,
    'Full Name': true,
    Department: true,
    Position: true,
  })

  return (
    <div className="rpt-panel">
      <ReportsHero nav={nav} />
      <div className="rpt-panel-body">
        <div className="rpt-builder-grid">
          <div>
            <RptSectionCaption>1. Data Source</RptSectionCaption>
            <RptOutlinedCard>
              <RptFormField label="PRIMARY MODULE">
                <RptSelect value={primaryModule} onChange={setPrimaryModule} options={['Employee management', 'Payroll', 'Attendance']} />
              </RptFormField>
              <span className="rpt-mini-label">Combine with</span>
              <RptCheckRow label="Attendance data" checked={combineAttendance} onChange={setCombineAttendance} />
              <RptCheckRow label="Leave data" checked={combineLeave} onChange={setCombineLeave} />
              <RptCheckRow label="Payroll information" checked={combinePayroll} onChange={setCombinePayroll} />
              <RptCheckRow label="Performance rankings" checked={combinePerformance} onChange={setCombinePerformance} />
            </RptOutlinedCard>
          </div>
          <div>
            <RptSectionCaption>2. Select Fields</RptSectionCaption>
            <RptOutlinedCard>
              <span className="rpt-entity-pill">EMPLOYEE</span>
              {Object.entries(fields).map(([label, checked]) => (
                <RptFieldCheckRow
                  key={label}
                  label={label}
                  checked={checked}
                  onChange={(v) => setFields((prev) => ({ ...prev, [label]: v }))}
                />
              ))}
            </RptOutlinedCard>
          </div>
          <div>
            <RptSectionCaption>3. Filters</RptSectionCaption>
            <RptOutlinedCard>
              <div className="rpt-form-grid">
                <RptFormField label="FROM DATE">
                  <RptInput value={dateFrom} onChange={setDateFrom} />
                </RptFormField>
                <RptFormField label="TO DATE">
                  <RptInput value={dateTo} onChange={setDateTo} />
                </RptFormField>
              </div>
              <RptFormField label="DEPARTMENT">
                <RptSelect value={department} onChange={setDepartment} options={['All departments — Global Roster', 'Engineering', 'Finance', 'HR']} />
              </RptFormField>
              <RptFormField label="EMPLOYMENT STATUS">
                <RptSelect value={employmentStatus} onChange={setEmploymentStatus} options={['Active rosters only', 'All', 'Resigned']} />
              </RptFormField>
            </RptOutlinedCard>
          </div>
          <div>
            <RptSectionCaption>4. Output</RptSectionCaption>
            <RptOutlinedCard>
              <RptFormField label="SORT BY">
                <RptSelect value={sortBy} onChange={setSortBy} options={['Employee No. Sequence', 'Department', 'Name']} />
              </RptFormField>
              <RptFormField label="FORMAT">
                <RptSelect value={format} onChange={setFormat} options={['Excel Spreadsheet (.xlsx)', 'PDF', 'CSV']} />
              </RptFormField>
              <button type="button" className="rpt-primary-btn rpt-run-btn" onClick={() => showReportToast('Running custom report…')}>
                ↓ Run & Export Report
              </button>
            </RptOutlinedCard>
          </div>
        </div>
        <div className="rpt-builder-foot">
          <button type="button" className="rpt-muted-btn" onClick={() => showReportToast('Reset to default')}>
            ↻ Reset to Default
          </button>
          <button type="button" className="rpt-navy-btn" onClick={() => showReportToast('Changes saved.')}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
