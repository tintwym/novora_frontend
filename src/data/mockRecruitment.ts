import type {
  InterviewRow,
  LedgerRow,
  OfferRow,
  PipelineColumn,
  RequisitionRow,
} from '../types/recruitment'

export const INTERVIEW_BADGE = 5

export const REQUISITIONS: RequisitionRow[] = [
  { id: 'REQ-2023-047', position: 'HR Business Partner', department: 'HR', deptTone: 'pink', type: 'Permanent', requestedBy: 'Nina Reza', openDate: '8 Apr', targetFill: '13 May', applicants: 14, status: 'Open', statusTone: 'success' },
  { id: 'REQ-2023-051', position: 'Sr. Frontend Developer', department: 'Engineering', deptTone: 'info', type: 'Permanent', requestedBy: 'David Ng', openDate: '1 Apr', targetFill: '30 Apr', applicants: 28, status: 'In review', statusTone: 'info' },
  { id: 'REQ-2023-038', position: 'Finance Analyst', department: 'Finance', deptTone: 'success', type: 'Contract', requestedBy: 'Rachel Tan', openDate: '15 Apr', targetFill: '15 Jan', applicants: 8, status: 'Filled', statusTone: 'purple' },
  { id: 'REQ-2023-029', position: 'Operations Lead', department: 'Operations', deptTone: 'warning', type: 'Permanent', requestedBy: 'Malik Said', openDate: '20 Mar', targetFill: '20 May', applicants: 11, status: 'Open', statusTone: 'success' },
  { id: 'REQ-2023-055', position: 'Digital Marketing Lead', department: 'Marketing', deptTone: 'pink', type: 'Permanent', requestedBy: 'Kevin Lim', openDate: '25 Apr', targetFill: '25 Jan', applicants: 4, status: 'On hold', statusTone: 'warning' },
]

export const PIPELINE_COLUMNS: PipelineColumn[] = [
  {
    stage: 'Applied',
    count: 3,
    candidates: [
      { id: '1', name: 'Aisha Rahman', details: '5 yrs · BSc HRM', source: 'JobStreet', score: '92%' },
      { id: '2', name: 'Ben Loh', details: '3 yrs · MBA', source: 'LinkedIn', score: '85%' },
      { id: '3', name: 'Cindy Wong', details: '2 yrs · Diploma HRM', source: 'JobStreet', score: '74%' },
    ],
  },
  {
    stage: 'Screening',
    count: 1,
    candidates: [{ id: '4', name: 'Lena Wong', details: '5 yrs · HRBP cert', source: 'Referral', score: '92%', selected: true }],
  },
  {
    stage: 'Phone interview',
    count: 2,
    candidates: [
      { id: '5', name: 'Faris Azman', details: '4 yrs · BA Psychology', source: 'JobStreet', score: '85%' },
      { id: '6', name: 'Rajan Singh', details: '4 yrs · BSc Dev', source: 'LinkedIn', score: '88%' },
    ],
  },
  {
    stage: 'Panel interview',
    count: 1,
    candidates: [{ id: '7', name: 'Priya Kumar', details: '6 yrs · MBA', source: 'LinkedIn', score: '81%' }],
  },
  { stage: 'Offer', count: 0, candidates: [] },
  { stage: 'Hired', count: 0, candidates: [] },
]

export const INTERVIEWS: InterviewRow[] = [
  { name: 'Lena Wong', role: 'HR Business Partner', stage: 'Panel', dateTime: '14 May 2026 · 10:00 AM', format: 'In person', formatTone: 'warning', status: 'Confirmed', statusTone: 'success' },
  { name: 'Faris Azman', role: 'HR Business Partner', stage: 'Phone', dateTime: '11 May 2026 · 09:00 AM', format: 'Phone', formatTone: 'info', status: 'Pending', statusTone: 'warning' },
  { name: 'Priya Kumar', role: 'HR Business Partner', stage: 'Panel', dateTime: '15 May 2026 · 02:00 PM', format: 'Video', formatTone: 'purple', status: 'Confirmed', statusTone: 'success' },
  { name: 'Rajan Singh', role: 'Sr. Frontend Developer', stage: 'Phone', dateTime: '12 May 2026 · 11:00 AM', format: 'Phone', formatTone: 'info', status: 'No show', statusTone: 'neutral' },
]

export const OFFERS: OfferRow[] = [
  { name: 'Lena Wong', role: 'HR Business Partner', salary: 'MYR 6,500', sentDate: '6 May', expiry: '20 May 2026', status: 'Sent', statusTone: 'info', selected: true },
  { name: 'Ahmad B', role: 'Operations Lead', salary: 'MYR 5,200', sentDate: '25 Apr', expiry: '15 May 2026', status: 'Accepted', statusTone: 'success' },
  { name: 'Sara K', role: 'Finance Analyst', salary: 'MYR 4,800', sentDate: '10 Apr', expiry: '24 Apr', status: 'Declined', statusTone: 'danger' },
]

export const LEDGER_ROWS: LedgerRow[] = [
  { reqCode: 'REQ-2024-001', position: 'HR Business Partner', sector: 'HR department', recruiter: 'Maya Tan', funnel: [45, 22, 8, 2, 1], spend: 'MYR 2,400', cycleTime: '25 days', status: 'Completed', statusTone: 'success' },
  { reqCode: 'REQ-2024-012', position: 'Sr. Frontend Developer', sector: 'Engineering', recruiter: 'Zainal Abidin', funnel: [62, 30, 12, 3, 0], spend: 'MYR 3,100', cycleTime: '36 days', status: 'In Progress', statusTone: 'info' },
  { reqCode: 'REQ-2024-018', position: 'Finance Analyst', sector: 'Finance', recruiter: 'Maya Tan', funnel: [18, 10, 4, 1, 1], spend: 'MYR 1,200', cycleTime: '28 days', status: 'Completed', statusTone: 'success' },
  { reqCode: 'REQ-2024-022', position: 'Operations Lead', sector: 'Operations', recruiter: 'Zainal Abidin', funnel: [28, 14, 6, 2, 0], spend: 'MYR 1,700', cycleTime: 'Pending', status: 'In Progress', statusTone: 'info' },
  { reqCode: 'REQ-2024-031', position: 'Digital Marketing Lead', sector: 'Marketing', recruiter: 'Maya Tan', funnel: [12, 6, 2, 0, 0], spend: 'MYR 900', cycleTime: '19 days', status: 'Completed', statusTone: 'success' },
]
