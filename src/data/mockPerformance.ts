import type {
  CompetencyRow,
  EvalCategoryRow,
  EvalSetupCard,
  EvalTypeRow,
  EvaluationListRow,
  GrantPermissionRow,
  KpiBandRow,
  PerfGradeRow,
  PerfLevelRow,
  PerfResultRow,
  ReviewHistoryRow,
  ReviewReportRow,
  ScoreBreakdown,
  TrainingRec,
} from '../types/performance'

export const PERF_EVAL_BADGE = 3

export const PERF_LEVELS: PerfLevelRow[] = [
  { no: 1, name: 'Basic', description: 'Entry-level performance expectation', employees: 148 },
  { no: 2, name: 'Intermediate', description: 'Mid-level, meets most expectations', employees: 612 },
  { no: 3, name: 'Advanced', description: 'Senior-level, consistently exceeds targets', employees: 394 },
  { no: 4, name: 'Expert', description: 'Top-tier, role model for department', employees: 130 },
]

export const PERF_GRADES: PerfGradeRow[] = [
  { letter: 'A', letterBg: '#dbeafe', name: 'Excellent', markFrom: '80', markTo: '100', apply: true, employees: 186 },
  { letter: 'B', letterBg: '#d1fae5', name: 'Good', markFrom: '65', markTo: '79', apply: true, employees: 542 },
  { letter: 'C', letterBg: '#ffedd5', name: 'Satisfactory', markFrom: '50', markTo: '64', apply: true, employees: 398 },
  { letter: 'D', letterBg: '#fee2e2', name: 'Needs improvement', markFrom: '30', markTo: '49', apply: true, employees: 158 },
]

export const ATTENDANCE_KPI_BANDS: KpiBandRow[] = [
  { from: '95', to: '100', target: '100%', targetTone: 'success', score: '100', scoreTone: 'success' },
  { from: '85', to: '94', target: '85%', targetTone: 'primary', score: '85', scoreTone: 'primary' },
  { from: '70', to: '84', target: '70%', targetTone: 'warning', score: '70', scoreTone: 'warning' },
  { from: '0', to: '69', target: 'Below target', targetTone: 'danger', score: '0', scoreTone: 'danger' },
]

export const ACHIEVEMENT_KPI_BANDS: KpiBandRow[] = [
  { from: '90', to: '100', target: '100%', targetTone: 'success', score: '100', scoreTone: 'success' },
  { from: '75', to: '89', target: '80%', targetTone: 'primary', score: '80', scoreTone: 'primary' },
  { from: '60', to: '74', target: '65%', targetTone: 'warning', score: '65', scoreTone: 'warning' },
  { from: '0', to: '59', target: 'Below target', targetTone: 'danger', score: '0', scoreTone: 'danger' },
]

export const EVAL_TYPES: EvalTypeRow[] = [
  { name: '360 Performance Review', everyMonth: '12 months', achieveKpi: true, notifyBefore: '21 days', traineeEval: true, appraiser: 'Panel + HR' },
  { name: 'Mid-year appraisal', everyMonth: '6 months', achieveKpi: true, notifyBefore: '14 days', traineeEval: true, appraiser: 'Direct manager' },
  { name: 'Year-end appraisal', everyMonth: '12 months', achieveKpi: true, notifyBefore: '30 days', traineeEval: false, appraiser: 'Direct manager' },
  { name: 'Probation review', everyMonth: '3 months', achieveKpi: false, notifyBefore: '7 days', traineeEval: true, appraiser: 'HOD → HR' },
  { name: 'Quarterly KPI review', everyMonth: '3 months', achieveKpi: true, notifyBefore: '7 days', traineeEval: false, appraiser: 'Direct manager' },
]

export const EVAL_CATEGORIES: EvalCategoryRow[] = [
  { name: 'Technical skills', kpiType: 'Attribute', typeTone: 'info', weight: '25%', scoring: '1–5 rating scale', measurement: 'Measurement index', levels: '4 levels' },
  { name: 'Communication', kpiType: 'Attribute', typeTone: 'info', weight: '15%', scoring: '1–5 rating scale', measurement: 'Measurement index', levels: '4 levels' },
  { name: 'Leadership', kpiType: 'Competency', typeTone: 'purple', weight: '20%', scoring: '1–5 rating scale', measurement: 'Measurement index', levels: '4 levels' },
  { name: 'Project delivery', kpiType: 'KPI category', typeTone: 'warning', weight: '30%', scoring: '% achievement', measurement: 'Target %', levels: 'Auto-calc' },
  { name: 'Attendance', kpiType: 'Attendance KPI', typeTone: 'success', weight: '10%', scoring: '% attendance', measurement: 'Attendance %', levels: 'Auto-calc' },
]

export const EVAL_SETUPS: EvalSetupCard[] = [
  {
    title: 'Year-end appraisal — setup',
    categories: [
      { label: 'Technical skills (Attribute — 25%)', checked: true },
      { label: 'Communication (Attribute — 15%)', checked: true },
      { label: 'Leadership (Competency — 20%)', checked: true },
      { label: 'Project delivery (KPI — 30%)', checked: true },
      { label: 'Attendance (Attendance KPI — 10%)', checked: true },
    ],
    settings: [
      { label: 'Total weightage', value: '100%', positive: true },
      { label: 'Enable next period objectives', value: 'Yes', positive: true },
      { label: 'Enable training required', value: 'Yes', positive: true },
      { label: 'Enable CEP / career planning', value: 'Yes', positive: true },
      { label: 'Enable appraiser note', value: 'Yes', positive: true },
    ],
  },
  {
    title: 'Probation review — setup',
    categories: [
      { label: 'Technical skills (Attribute — 40%)', checked: true },
      { label: 'Communication (Attribute — 30%)', checked: true },
      { label: 'Leadership (Competency — 0%)', checked: false },
      { label: 'Project delivery (KPI — 0%)', checked: false },
      { label: 'Attendance (Attendance KPI — 30%)', checked: true },
    ],
    settings: [
      { label: 'Total weightage', value: '100%', positive: true },
      { label: 'Enable next period objectives', value: 'No' },
      { label: 'Enable training required', value: 'Yes', positive: true },
      { label: 'Enable CEP / career planning', value: 'No' },
      { label: 'Enable appraiser note', value: 'Yes', positive: true },
    ],
  },
]

export const SETUP_LINKED_CATEGORIES = [
  { label: 'Technical skills (Attribute · 25%)', checked: true },
  { label: 'Communication (Attribute · 15%)', checked: true },
  { label: 'Leadership (Competency · 20%)', checked: true },
  { label: 'Project delivery (KPI · 30%)', checked: true },
  { label: 'Attendance (Attendance KPI · 10%)', checked: false },
]

export const GRANT_PERMISSIONS: GrantPermissionRow[] = [
  { initials: 'DN', avatarBg: '#dbeafe', evaluator: 'David Ng', evalType: 'Year-end appraisal', from: '1 Jan 2026', to: '31 Jan 2026', pending: '8 employees', pendingLink: true, status: 'Active', statusTone: 'success' },
  { initials: 'NR', avatarBg: '#d1fae5', evaluator: 'Nina Reza', evalType: 'Year-end appraisal', from: '1 Jan 2026', to: '31 Jan 2026', pending: '5 employees', pendingLink: true, status: 'Active', statusTone: 'success' },
  { initials: 'KL', avatarBg: '#ffe4e6', evaluator: 'Kevin Lim', evalType: 'Mid-year appraisal', from: '1 Jun 2025', to: '30 Jun 2025', pending: '0 pending', status: 'Expired', statusTone: 'neutral', expired: true },
]

export const GRANT_VIEW_LIST_ROSTER = [
  { name: 'Kevin Lim', authorized: true },
  { name: 'Raymond Tan', authorized: true },
]

export const EVALUATION_LIST: EvaluationListRow[] = [
  { initials: 'SL', avatarBg: '#dbeafe', name: 'Sarah Lim', reviewType: 'Year-end appraisal', reviewDate: '15 Jan 2026', reviewPeriod: 'Jan-Dec 2025', status: 'Pending', statusTone: 'warning', action: 'Open' },
  { initials: 'RK', avatarBg: '#d1fae5', name: 'Raj Kumar', reviewType: 'Year-end appraisal', reviewDate: '15 Jan 2026', reviewPeriod: 'Jan-Dec 2025', status: 'Pending', statusTone: 'warning', action: 'Open' },
  { initials: 'AL', avatarBg: '#ede9fe', name: 'Ahmad L', reviewType: 'Probation review', reviewDate: '10 Jan 2026', reviewPeriod: 'Oct-Dec 2025', status: 'Pending', statusTone: 'warning', action: 'Open' },
  { initials: 'NC', avatarBg: '#ffe4e6', name: 'Nadia Chen', reviewType: 'Mid-year appraisal', reviewDate: '30 Jun 2025', reviewPeriod: 'Jan-Jun 2025', status: 'Completed', statusTone: 'success', action: 'Download' },
]

export const PERF_RESULTS: PerfResultRow[] = [
  { initials: 'SL', avatarBg: '#dbeafe', name: 'Sarah Lim', attr: '86.7', kpi: '90.0', comp: '82.0', attend: '97.0', total: '91.7', grade: 'A', gradeBg: '#dbeafe' },
  { initials: 'RK', avatarBg: '#d1fae5', name: 'Raj Kumar', attr: '80.0', kpi: '88.0', comp: '79.0', attend: '95.0', total: '86.2', grade: 'A', gradeBg: '#dbeafe' },
  { initials: 'NC', avatarBg: '#ffe4e6', name: 'Nadia Chen', attr: '72.0', kpi: '75.0', comp: '70.0', attend: '88.0', total: '73.5', grade: 'B', gradeBg: '#d1fae5' },
  { initials: 'MT', avatarBg: '#fce7f3', name: 'Maya Tan', attr: '65.0', kpi: '68.0', comp: '62.0', attend: '84.0', total: '67.5', grade: 'B', gradeBg: '#d1fae5' },
  { initials: 'AL', avatarBg: '#ede9fe', name: 'Ahmad L', attr: '52.0', kpi: '55.0', comp: '50.0', attend: '80.0', total: '56.5', totalWarning: true, grade: 'C', gradeBg: '#ffedd5' },
]

export const COMPETENCIES: CompetencyRow[] = [
  { name: 'Leadership', type: 'Competency', typeTone: 'purple', parent: '—', definition: 'Ability to guide, inspire and influence a team' },
  { name: 'Team motivation', sub: true, type: 'Sub-comp.', typeTone: 'info', parent: 'Leadership', definition: 'Keeping team morale and engagement high' },
  { name: 'Conflict resolution', sub: true, type: 'Sub-comp.', typeTone: 'info', parent: 'Leadership', definition: 'Handling disagreements constructively' },
  { name: 'Problem solving', type: 'Competency', typeTone: 'purple', parent: '—', definition: 'Analytical thinking and solution design' },
  { name: 'Root cause analysis', sub: true, type: 'Sub-comp.', typeTone: 'info', parent: 'Problem solving', definition: 'Identifying underlying causes of issues' },
  { name: 'Adaptability', type: 'Competency', typeTone: 'purple', parent: '—', definition: 'Ability to adjust to change effectively' },
]

export const REVIEW_REPORTS: ReviewReportRow[] = [
  { initials: 'SL', avatarBg: '#dbeafe', name: 'Sarah Lim', reviewType: 'Year-end appraisal', reviewPeriod: 'Jan–Dec 2025', total: '91.7', grade: 'A', gradeBg: '#dbeafe', appraiser: 'David Ng' },
  { initials: 'RK', avatarBg: '#d1fae5', name: 'Raj Kumar', reviewType: 'Year-end appraisal', reviewPeriod: 'Jan–Dec 2025', total: '86.2', grade: 'A', gradeBg: '#dbeafe', appraiser: 'David Ng' },
  { initials: 'NC', avatarBg: '#ffe4e6', name: 'Nadia Chen', reviewType: 'Year-end appraisal', reviewPeriod: 'Jan–Dec 2025', total: '73.5', grade: 'B', gradeBg: '#d1fae5', appraiser: 'David Ng' },
  { initials: 'MT', avatarBg: '#fce7f3', name: 'Maya Tan', reviewType: 'Year-end appraisal', reviewPeriod: 'Jan–Dec 2025', total: '67.5', grade: 'B', gradeBg: '#d1fae5', appraiser: 'David Ng' },
  { initials: 'AL', avatarBg: '#ede9fe', name: 'Ahmad L', reviewType: 'Year-end appraisal', reviewPeriod: 'Jan–Dec 2025', total: '56.5', grade: 'C', gradeBg: '#ffedd5', appraiser: 'David Ng' },
]

export const EMPLOYEE_SCORE_BREAKDOWN: ScoreBreakdown[] = [
  { label: 'Technical skills (attr.)', value: 86.7, color: '#2563eb' },
  { label: 'Project delivery (KPI)', value: 90, color: '#14b8a6' },
  { label: 'Leadership (comp.)', value: 82, color: '#7c3aed' },
  { label: 'Communication (attr.)', value: 88, color: '#f59e0b' },
  { label: 'Attendance KPI', value: 97, color: '#059669' },
]

export const EMPLOYEE_REVIEW_HISTORY: ReviewHistoryRow[] = [
  { type: 'Year-end appraisal', period: '2025', score: '91.7', grade: 'A', gradeBg: '#dbeafe' },
  { type: 'Mid-year appraisal', period: 'H1 2025', score: '87.3', grade: 'A', gradeBg: '#dbeafe' },
  { type: 'Year-end appraisal', period: '2024', score: '83.1', grade: 'A', gradeBg: '#dbeafe' },
  { type: 'Year-end appraisal', period: '2023', score: '74.5', grade: 'B', gradeBg: '#d1fae5' },
]

export const EMPLOYEE_TRAINING: TrainingRec[] = [
  { label: 'Leadership essentials', mandatory: true },
  { label: 'Agile & Scrum', mandatory: false },
]

export const VIEW_REPORT_SCORES = [
  { label: 'Technical Skills (Attribute weight)', score: '86.7/100' },
  { label: 'Project Delivery (KPI metrics success)', score: '90/100' },
  { label: 'Leadership Qualities (Competency appraisal)', score: '82/100' },
  { label: 'Attendance KPI Score', score: '97/100' },
]
