import type {
  DeptDisciplinaryRow,
  DisciplinaryHistoryRow,
  DisciplinaryLogRow,
  DisciplinaryReason,
  SummaryBalanceRow,
  WarningAction,
} from '../types/disciplinary'

export const DISCIPLINARY_REASONS: DisciplinaryReason[] = [
  { name: 'Unauthorised absence', dotColor: '#ea580c', severity: 'Minor', severityTone: 'warning', description: 'Absent without prior approval or valid medical reason.', status: 'Active', statusTone: 'success' },
  { name: 'Insubordination', dotColor: '#ea580c', severity: 'Major', severityTone: 'warning', description: 'Refusal to follow reasonable management instructions.', status: 'Active', statusTone: 'success' },
  { name: 'Fraud / dishonesty', dotColor: '#ef4444', severity: 'Gross misconduct', severityTone: 'danger', description: 'Deliberate falsification of company records or breach of trust.', status: 'Active', statusTone: 'success' },
  { name: 'Dress code violation', dotColor: '#ea580c', severity: 'Minor', severityTone: 'warning', description: 'Non-compliance with company dress code standards.', status: 'Inactive', statusTone: 'neutral' },
]

export const WARNING_ACTIONS: WarningAction[] = [
  { level: 'L1', name: 'Verbal warning', type: 'Verbal', description: 'Informal verbal caution, not recorded on employee file permanently.', payImpact: 'No deduction', payTone: 'success' },
  { level: 'L2', name: 'First written warning', type: 'Written', description: 'Formal first written warning, filed on staff record for 6 months.', payImpact: 'No deduction', payTone: 'success' },
  { level: 'L3', name: 'Second written warning', type: 'Written', description: 'Final written warning before suspension/termination, filed for 1 year.', payImpact: 'Partial deduction', payTone: 'warning' },
  { level: 'L4', name: 'Suspension without pay', type: 'Suspension', description: 'Temporary suspension pending formal investigation, full salary deduction.', payImpact: 'Full deduction', payTone: 'danger' },
  { level: 'L5', name: 'Demotion', type: 'Grade change', description: 'Reduction in job grade and responsibilities, permanent salary adjustment.', payImpact: 'Pay review', payTone: 'danger' },
  { level: 'L6', name: 'Termination', type: 'Dismissal', description: 'Employment contract termination, reserved for gross misconduct only.', payImpact: 'Full deduction', payTone: 'danger' },
]

export const DISCIPLINARY_HISTORY: DisciplinaryHistoryRow[] = [
  { initials: 'AL', name: 'Ahmad Luqman', meta: 'EMP-0285 · Operations', offence: 'Unauthorised absence', incidentDate: '2024-05-06', actionDate: '2024-05-07', warningLevel: 'L1 — Verbal warning', issuedBy: 'Nina Reza (Head of HR)', status: 'Pending', statusKind: 'pending' },
  { initials: 'ZN', name: 'Zara Nor', meta: 'EMP-0142 · Engineering', offence: 'Persistent lateness', incidentDate: '2024-04-25', actionDate: '2024-04-28', warningLevel: 'L2 — First written warning', issuedBy: 'Malik Said (Tech Lead)', status: 'Acknowledged', statusKind: 'acknowledged' },
  { initials: 'RK', name: 'Raj Kumar', meta: 'EMP-0049 · Finance', offence: 'Dress code violation', incidentDate: '2024-03-08', actionDate: '2024-03-10', warningLevel: 'L1 — Verbal warning', issuedBy: 'David Ng (Finance Director)', status: 'Closed', statusKind: 'closed' },
]

export const DEPT_DISCIPLINARY: DeptDisciplinaryRow[] = [
  { department: 'Engineering', staff: '3 staff', infractions: '1', investigating: '0', resolved: '0', violation: 'Persistent lateness' },
  { department: 'Finance', staff: '2 staff', infractions: '1', investigating: '0', resolved: '1', violation: 'Dress code violation' },
  { department: 'HR', staff: '2 staff', infractions: '0', investigating: '0', resolved: '0', violation: 'None recorded' },
  { department: 'Marketing', staff: '2 staff', infractions: '0', investigating: '0', resolved: '0', violation: 'None recorded' },
  { department: 'Operations', staff: '4 staff', infractions: '1', investigating: '1', resolved: '0', violation: 'Unauthorised absence' },
]

export const DISCIPLINARY_LOGS: DisciplinaryLogRow[] = [
  { caseId: 'DISC-2026-001', name: 'Ahmad Luqman', meta: 'EMP-0285 · Operations', violation: 'Unauthorised absence', detail: 'Absent without prior approval.', incidentDate: '2026-05-06', level: 'L1 • Verbal warning', issuedBy: 'Nina Reza (Head of HR)', status: 'Pending', statusKind: 'pending' },
  { caseId: 'DISC-2026-002', name: 'Zara Nor', meta: 'EMP-0142 · Engineering', violation: 'Persistent lateness', detail: 'Repeated late arrivals.', incidentDate: '2026-04-25', level: 'L2 • First written warning', issuedBy: 'Malik Said (Tech Lead)', status: 'Acknowledged', statusKind: 'acknowledged' },
  { caseId: 'DISC-2026-003', name: 'Raj Kumar', meta: 'EMP-0049 · Finance', violation: 'Dress code violation', detail: 'Non-compliance with dress code.', incidentDate: '2026-03-08', level: 'L1 • Verbal warning', issuedBy: 'David Ng (Finance Director)', status: 'Closed', statusKind: 'closed' },
]

export const SUMMARY_BALANCE: SummaryBalanceRow[] = [
  { name: 'Ahmad Wahid', empId: 'EMP-0861', department: 'Operations', role: 'Chief Executive Officer', cases: '0', pending: '0', highest: 'None active', latest: 'None recorded', clear: true },
  { name: 'Sarah Lim', empId: 'EMP-0285', department: 'Engineering', role: 'Senior Developer', cases: '1', pending: '1', highest: 'L1 — Verbal warning', latest: 'Unauthorised absence', recorded: '2026-05-06', clear: false },
  { name: 'Wei Chen', empId: 'EMP-0144', department: 'Finance', role: 'Finance Analyst', cases: '1', pending: '0', highest: 'L2 — First written warning', latest: 'Persistent lateness', recorded: '2026-04-25', clear: false },
]

export const WARNING_GUIDE = [
  { level: 'L1', title: 'Verbal warning', desc: 'Informal verbal caution.' },
  { level: 'L2', title: 'First written warning', desc: 'Formal, filed for 6 months.' },
  { level: 'L3', title: 'Second written warning', desc: 'Final warning, filed for 1 year.' },
  { level: 'L4', title: 'Suspension without pay', desc: 'Temporary suspension during investigation.' },
  { level: 'L5', title: 'Demotion', desc: 'Reduction in job grade and pay.' },
  { level: 'L6', title: 'Termination', desc: 'Contract termination for gross misconduct.' },
]

export const RECENT_CASES = [
  { id: 'DISC-2026-003', name: 'Ahmad Luqman', reason: 'Unauthorised absence', date: '2026-05-06', status: 'Pending', tone: 'warning' as const },
  { id: 'DISC-2026-002', name: 'Zara Nor', reason: 'Persistent lateness', date: '2026-04-25', status: 'Acknowledged', tone: 'info' as const },
  { id: 'DISC-2026-001', name: 'Raj Kumar', reason: 'Dress code violation', date: '2026-03-18', status: 'Closed', tone: 'success' as const },
]
