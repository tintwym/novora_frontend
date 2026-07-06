import type {
  ApprovalClaimRow,
  AuditTrailRow,
  ClaimViewData,
  FxLogRow,
  HistoryClaimRow,
  PayrollBatchRow,
  PolicyFlagRow,
  RecentClaimRow,
  ReportClaimRow,
  SpendLimitRow,
  TopClaimantRow,
} from '../types/claims'

export const CLAIMS_APPROVAL_BADGE = 4

export const RECENT_CLAIMS: RecentClaimRow[] = [
  { date: '5 May', category: 'Meal allowance', amount: 'MYR 38.50', status: 'Pending', tone: 'warning' },
  { date: '28 Apr', category: 'Hotel / stay', amount: 'MYR 450.00', status: 'Pending', tone: 'warning' },
  { date: '25 Apr', category: 'Air ticket', amount: 'USD 280.00', status: 'Pending', tone: 'warning' },
  { date: '6 May', category: 'Meal allowance', amount: 'MYR 42.00', status: 'Pending', tone: 'warning' },
  { date: '3 May', category: 'Transport', amount: 'MYR 120.00', status: 'Approved', tone: 'success' },
]

export const APPROVAL_CLAIMS: ApprovalClaimRow[] = [
  { initials: 'SL', name: 'Sarah Lim', category: 'Meal allowance', categoryTone: 'warning', date: '5 May', amount: 'MYR 38.50', chain: 'David Ng', flag: 'Clear', flagTone: 'success', status: 'Pending', statusTone: 'warning', pending: true },
  { initials: 'MT', name: 'Maya Tan', category: 'Air ticket', categoryTone: 'purple', date: '25 Apr', amount: 'MYR 1,310.40', foreignAmount: 'USD 280.00', chain: 'Nina → Ahmad W', flag: 'Flagged', flagTone: 'danger', status: 'Pending', statusTone: 'warning', pending: true },
  { initials: 'AL', name: 'Ahmad L', category: 'Meal allowance', categoryTone: 'warning', date: '6 May', amount: 'MYR 42.00', chain: 'Malik Said', flag: 'Over limit', flagTone: 'danger', status: 'Pending', statusTone: 'warning', pending: true },
  { initials: 'NC', name: 'Nadia Chen', category: 'Transport', categoryTone: 'info', date: '3 May', amount: 'MYR 120.00', chain: 'Kevin Lin', flag: 'Clear', flagTone: 'success', status: 'Approved', statusTone: 'success', pending: false },
]

export const SPEND_LIMITS: SpendLimitRow[] = [
  { category: 'Meal allowance', daily: 'MYR 30', monthly: 'MYR 600', receipt: '> MYR 15', receiptTone: 'warning' },
  { category: 'Transport', daily: 'MYR 200', monthly: 'MYR 2,000', receipt: '> MYR 50', receiptTone: 'warning' },
  { category: 'Hotel / stay', daily: 'MYR 350/night', monthly: '—', receipt: 'Always', receiptTone: 'danger' },
  { category: 'Air ticket', daily: '—', monthly: 'MYR 5,000', receipt: 'Always', receiptTone: 'danger' },
  { category: 'Mileage', daily: 'MYR 0.55/km', monthly: '—', receipt: 'MYR 0.55/km', receiptTone: 'neutral' },
  { category: 'Entertainment', daily: '—', monthly: 'MYR 1,500', receipt: 'Always', receiptTone: 'danger' },
  { category: 'Wellness', daily: '—', monthly: 'MYR 300', receipt: '> MYR 30', receiptTone: 'warning' },
]

export const VALIDATION_RULES = [
  'Flag claims exceeding daily / monthly category limits',
  'Detect duplicate submissions (same vendor + date + amount)',
  'Block claims submitted more than 30 days after receipt date',
  'Require receipt attachment for claims above threshold',
  'Auto-convert foreign currency at live exchange rate',
  'Hold claims from employees on notice period',
  'Notify HR on claims exceeding MYR 1,000',
]

export const POLICY_FLAGS: PolicyFlagRow[] = [
  { title: 'Meal limit exceeded', detail: 'Ahmad L • MYR 42.00 vs MYR 30 limit', status: 'PENDING', tone: 'warning', dotColor: '#ea580c' },
  { title: 'Duplicate submission', detail: 'Zara N • Same vendor + date as 28 Apr', status: 'BLOCKED', tone: 'danger', dotColor: '#ef4444' },
  { title: 'Late submission', detail: 'Raj K • Receipt dated 28 Feb, submitted 5 May', status: 'REVIEW', tone: 'info', dotColor: '#2563eb' },
  { title: 'Over category cap', detail: 'Maya T • Air ticket MYR 1,280 needs Finance review', status: 'ESCALATED', tone: 'purple', dotColor: '#7c3aed' },
]

export const AUDIT_TRAIL: AuditTrailRow[] = [
  { text: '6 May 10:42 · David Ng approved MYR 120.00 transport — Nadia Chen', tone: 'success' },
  { text: '6 May 09:15 · Kevin Lim rejected MYR 55.00 meal — Sarah Lim (over limit)', tone: 'danger' },
  { text: '5 May 16:30 · System flagged duplicate — Zara Nor meal submission blocked', tone: 'warning' },
  { text: '4 May 11:00 · Nina Reza approved MYR 450.00 hotel — Raj Kumar (step 1/2)', tone: 'success' },
]

export const PAYROLL_BATCH: PayrollBatchRow[] = [
  { initials: 'NC', name: 'Nadia Chen', category: 'Transport', amount: '120.00', approvedBy: 'Kevin Lin', pushed: true },
  { initials: 'SL', name: 'Sarah Lim', category: 'Wellness', amount: '180.00', approvedBy: 'David Ng', pushed: true },
  { initials: 'NC', name: 'Nadia Chen', category: 'Mileage', amount: '78.40', approvedBy: 'Kevin Lin', pushed: true },
]

export const FX_LOG: FxLogRow[] = [
  { name: 'Maya T', currency: 'USD', original: '$280.00', rate: '4.68', myr: 'MYR 1,310.40' },
  { name: 'Raj K', currency: 'SGD', original: '$130.00', rate: '3.47', myr: 'MYR 451.10' },
  { name: 'Sarah L', currency: 'EUR', original: '€45.00', rate: '5.12', myr: 'MYR 230.40' },
]

export const REPORT_CLAIMS: ReportClaimRow[] = [
  { id: 'CLM-081', name: 'Sarah Lim', department: 'Engineering', category: 'Meal allowance', date: '2026-05-05', vendor: "Nando's", amount: '38.50', flag: 'Clear', flagTone: 'success', status: 'Pending', statusTone: 'warning' },
  { id: 'CLM-082', name: 'Raj Kumar', department: 'Operations', category: 'Hotel / stay', date: '2026-05-04', vendor: 'Marriott KL', amount: '450.00', flag: 'Clear', flagTone: 'success', status: 'Approved', statusTone: 'success' },
  { id: 'CLM-083', name: 'Ahmad L', department: 'HR', category: 'Meal allowance', date: '2026-05-06', vendor: 'Subway', amount: '42.00', flag: 'Flagged / Over limit', flagTone: 'danger', status: 'Pending', statusTone: 'warning' },
]

export const HISTORY_CLAIMS: HistoryClaimRow[] = [
  { initials: 'SL', name: 'Sarah Lim', department: 'Engineering', category: 'Meal allowance', date: '5 May', vendor: "Nando's", amount: '38.50', approvedBy: 'Under review', payrollMonth: '—', status: 'Pending', tone: 'neutral' },
  { initials: 'SL', name: 'Sarah Lim', department: 'Engineering', category: 'Hotel / stay', date: '28 Apr', vendor: 'Marriott KL', amount: '450.00', approvedBy: 'Under review', payrollMonth: '—', status: 'Pending', tone: 'neutral' },
  { initials: 'NC', name: 'Nadia Chen', department: 'Marketing', category: 'Transport', date: '3 May', vendor: 'Grab', amount: '120.00', approvedBy: 'Kevin Lin', payrollMonth: 'May 2026', status: 'Pushed', tone: 'success' },
  { initials: 'SL', name: 'Sarah Lim', department: 'Engineering', category: 'Meal allowance', date: '20 Apr', vendor: "Nando's", amount: '55.00', approvedBy: 'Kevin Lin', payrollMonth: '—', status: 'Rejected', tone: 'danger' },
]

export const TOP_CLAIMANTS: TopClaimantRow[] = [
  { initials: 'MT', name: 'Maya Tan', claims: '6', total: '3,820.00', flags: '1', flagTone: 'danger' },
  { initials: 'RK', name: 'Raj Kumar', claims: '5', total: '2,410.00', flags: '0', flagTone: 'neutral' },
  { initials: 'SL', name: 'Sarah Lim', claims: '4', total: '1,650.00', flags: '1', flagTone: 'danger' },
  { initials: 'NC', name: 'Nadia Chen', claims: '3', total: '980.00', flags: '0', flagTone: 'neutral' },
]

export const CATEGORY_SPEND = [
  { label: 'Air ticket', amount: 'MYR 5,840', color: '#2563eb', pct: 100 },
  { label: 'Hotel / stay', amount: 'MYR 4,320', color: '#7c3aed', pct: 74 },
  { label: 'Transport', amount: 'MYR 2,240', color: '#059669', pct: 38 },
  { label: 'Meal', amount: 'MYR 1,820', color: '#ea580c', pct: 31 },
  { label: 'Mileage', amount: 'MYR 720', color: '#ec4899', pct: 12 },
  { label: 'Others', amount: 'MYR 480', color: '#94a3b8', pct: 8 },
]

export const DEPT_SPEND = [
  { label: 'Engineering', amount: 'MYR 6,480', color: '#2563eb', pct: 100 },
  { label: 'Operations', amount: 'MYR 4,950', color: '#059669', pct: 76 },
  { label: 'Finance', amount: 'MYR 2,700', color: '#7c3aed', pct: 42 },
  { label: 'Marketing', amount: 'MYR 1,800', color: '#ea580c', pct: 28 },
  { label: 'HR', amount: 'MYR 890', color: '#ec4899', pct: 14 },
]

export const BUDGET_TRACKING = [
  { label: 'Engineering travel budget', used: 'MYR 6,480', cap: 'MYR 10,000', pct: 65, remaining: 'MYR 3,520 remaining', color: '#2563eb' },
  { label: 'Operations travel budget', used: 'MYR 4,950', cap: 'MYR 6,000', pct: 83, remaining: 'MYR 1,050 remaining', color: '#ea580c' },
  { label: 'Finance travel budget', used: 'MYR 2,700', cap: 'MYR 4,000', pct: 68, remaining: 'MYR 1,300 remaining', color: '#7c3aed' },
  { label: 'Marketing entertainment budget', used: 'MYR 1,800', cap: 'MYR 2,000', pct: 90, remaining: 'MYR 200 remaining — alert!', color: '#ef4444', alert: true },
]

export const DEFAULT_CLAIM_VIEW: ClaimViewData = {
  id: 'CLM-001',
  name: 'Sarah Lim',
  department: 'Engineering department',
  status: 'Pending',
  statusTone: 'warning',
  date: '5 May 2026',
  category: 'Meal allowance',
  vendor: "Nando's",
  amount: 'MYR 38.50',
  compliance: 'Clear (Compliant)',
  intent: 'Project wrap-up dinner with front-end development lead.',
  receiptVendor: "NANDO'S",
  receiptTotal: '38.50',
}

export const NADIA_CLAIM_VIEW: ClaimViewData = {
  id: 'CLM-005',
  name: 'Nadia Chen',
  department: 'Marketing department',
  status: 'Approved',
  statusTone: 'success',
  date: '3 May 2026',
  category: 'Transport',
  vendor: 'Grab',
  amount: 'MYR 120.00',
  compliance: 'Clear (Compliant)',
  intent: 'Client roadshow transport.',
  receiptVendor: 'GRAB',
  receiptTotal: '120.00',
}
