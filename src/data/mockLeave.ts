import type {
  DeptLeaveRow,
  LeaveApprovalRow,
  LeaveAttachmentRow,
  LeaveEntitlementRow,
  LeaveHistoryRow,
  LeaveLogRow,
  LeavePolicyCard,
  LeaveTypeRow,
} from '../types/leave'

export const LEAVE_APPROVAL_BADGE = 1

export const LEAVE_TYPES: LeaveTypeRow[] = [
  { name: 'Annual leave', color: '#2563eb', paid: true, deduction: 'No deduction', hourBased: false, attachmentReq: false },
  { name: 'Medical leave', color: '#059669', paid: true, deduction: 'No deduction', hourBased: false, attachmentReq: true },
  { name: 'Emergency leave', color: '#ea580c', paid: true, deduction: 'No deduction', hourBased: false, attachmentReq: false },
  { name: 'Unpaid leave', color: '#ef4444', paid: false, deduction: 'Normal rate', hourBased: false, attachmentReq: false },
  { name: 'Replacement leave', color: '#7c3aed', paid: true, deduction: 'No deduction', hourBased: false, attachmentReq: false },
  { name: 'Maternity leave', color: '#ec4899', paid: true, deduction: 'No deduction', hourBased: false, attachmentReq: true },
  { name: 'Hour leave', color: '#0d9488', paid: true, deduction: 'No deduction', hourBased: true, attachmentReq: false },
]

export const LEAVE_POLICIES: LeavePolicyCard[] = [
  {
    id: 'annual',
    title: 'Annual leave policy',
    tag: 'Yearly',
    blocks: [
      {
        title: 'Entitlement',
        rows: [
          { label: 'Allow days', value: '16 days / year' },
          { label: 'Accrual method', value: 'Monthly prorate' },
          { label: 'Carry forward days', value: '8 days max' },
          { label: 'Applicable to', value: 'All confirmed employees' },
          { label: 'Auto attach (service)', value: '12 months' },
          { label: 'Minimum working days', value: '15 days' },
        ],
      },
      {
        title: 'Service leave (additional)',
        rows: [
          { label: '3–5 years service', value: '+2 days' },
          { label: '5–10 years service', value: '+4 days' },
          { label: '10+ years service', value: '+6 days' },
        ],
      },
      {
        title: 'Holiday rules',
        rows: [
          { label: 'Count off / holidays', value: 'Excluded' },
          { label: 'Leave before public holiday', value: 'Counted' },
          { label: 'Leave after public holiday', value: 'Counted' },
          { label: 'Not allow combination with', value: 'Unpaid leave' },
        ],
      },
    ],
  },
  {
    id: 'medical',
    title: 'Medical leave policy',
    tag: 'Yearly',
    blocks: [
      {
        rows: [
          { label: 'Allow days', value: '14 days / year' },
          { label: 'Accrual method', value: 'Full upfront' },
          { label: 'Carry forward', value: 'Not allowed' },
          { label: 'Attachment required', value: 'MC / Hospital cert.', highlight: true },
          { label: 'Auto attach', value: 'On join date' },
          { label: 'Compensation allowance', value: 'Based on salary' },
        ],
      },
    ],
  },
  {
    id: 'emergency',
    title: 'Emergency & unpaid policy',
    blocks: [
      {
        rows: [
          { label: 'Emergency — allow days', value: '3 days / year' },
          { label: 'Emergency — accrual', value: 'Full upfront' },
          { label: 'Unpaid — deduction rate', value: 'Normal rate' },
          { label: 'Probation employees', value: 'Medical only' },
          { label: 'Contract employees', value: 'Annual + Medical' },
        ],
      },
    ],
  },
]

export const LEAVE_ATTACHMENTS: LeaveAttachmentRow[] = [
  { id: 0, initials: 'SL', name: 'Sarah Lim', department: 'Engineering', leaveType: 'Maternity leave', color: '#ec4899', entitlement: '60 days', attached: false, activation: 'Manual' },
  { id: 1, initials: 'RK', name: 'Raj Kumar', department: 'Engineering', leaveType: 'Annual leave', color: '#2563eb', entitlement: '16 days', attached: true, activation: 'Auto' },
  { id: 2, initials: 'MT', name: 'Maya Tan', department: 'HR', leaveType: 'Replacement leave', color: '#7c3aed', entitlement: '2 days', attached: false, activation: 'Manual' },
  { id: 3, initials: 'AL', name: 'Ahmad L', department: 'Operations', leaveType: 'Medical leave', color: '#0d9488', entitlement: '14 days', attached: true, activation: 'Auto' },
  { id: 4, initials: 'NC', name: 'Nadia Chen', department: 'Marketing', leaveType: 'Maternity leave', color: '#ec4899', entitlement: '60 days', attached: false, activation: 'Manual' },
]

export const LEAVE_APPROVALS: LeaveApprovalRow[] = [
  { initials: 'SL', name: 'Sarah Lim', leaveType: 'Annual', typeTone: 'info', from: '12 May', to: '14 May', days: '3', reason: 'Family trip', approver: 'David Ng', status: 'Pending', statusTone: 'warning', pending: true },
  { initials: 'RK', name: 'Raj Kumar', leaveType: 'Medical', typeTone: 'success', from: '2 May', to: '2 May', days: '1', reason: 'Fever', approver: 'David Ng', status: 'Accepted', statusTone: 'success' },
  { initials: 'NC', name: 'Nadia Chen', leaveType: 'Annual', typeTone: 'info', from: '5 May', to: '6 May', days: '2', reason: 'Personal', approver: 'Kevin Lim', status: 'Denied', statusTone: 'danger', actionNote: 'Peak period' },
]

export const LEAVE_HISTORY: LeaveHistoryRow[] = [
  { initials: 'SL', name: 'Sarah Lim', leaveType: 'Annual', typeTone: 'info', from: '12 May', to: '14 May', days: '3', requestedBy: 'Self', approvedBy: 'David Ng', status: 'Pending', statusTone: 'warning' },
  { initials: 'RK', name: 'Raj Kumar', leaveType: 'Medical', typeTone: 'success', from: '2 May', to: '2 May', days: '1', requestedBy: 'Self', approvedBy: 'David Ng', status: 'Accepted', statusTone: 'success' },
  { initials: 'MT', name: 'Maya Tan', leaveType: 'Medical', typeTone: 'success', from: '1 May', to: '1 May', days: '1', requestedBy: 'HR (behalf)', approvedBy: 'Nina Reza', status: 'Waiting file', statusTone: 'info' },
  { initials: 'NC', name: 'Nadia Chen', leaveType: 'Annual', typeTone: 'info', from: '5 May', to: '6 May', days: '2', requestedBy: 'Self', approvedBy: 'Kevin Lim', status: 'Denied', statusTone: 'danger' },
  { initials: 'AL', name: 'Ahmad L', leaveType: 'Unpaid', typeTone: 'neutral', from: '9 May', to: '9 May', days: '1', requestedBy: 'Self', approvedBy: 'Malik Said', status: 'Pending', statusTone: 'warning' },
  { initials: 'ZN', name: 'Zara Nor', leaveType: 'Annual', typeTone: 'info', from: '21 Apr', to: '22 Apr', days: '2', requestedBy: 'Self', approvedBy: 'Malik Said', status: 'Cancelled', statusTone: 'neutral' },
]

export const LEAVE_ENTITLEMENTS: LeaveEntitlementRow[] = [
  { label: 'Annual', color: '#2563eb', entitled: '18', used: '6', balance: '12', carried: '2' },
  { label: 'Medical', color: '#059669', entitled: '14', used: '4', balance: '10', carried: '0' },
  { label: 'Emergency', color: '#ea580c', entitled: '3', used: '1', balance: '2', carried: '0' },
  { label: 'Replacement', color: '#7c3aed', entitled: '1', used: '0', balance: '1', carried: '0' },
  { label: 'Hour leave', color: '#0d9488', entitled: '16h', used: '4h', balance: '12h', carried: '0' },
]

export const DEPT_LEAVE_MATRIX: DeptLeaveRow[] = [
  { department: 'Engineering & Dev', fte: '14 FTEs', annualUsed: '32 days', medicalTaken: '8 days', unpaidRecorded: '2 days', accruedBalance: '14 days', assessment: 'Optimal / 94.2%', assessmentTone: 'info' },
  { department: 'Human Resources (HR)', fte: '8 FTEs', annualUsed: '18 days', medicalTaken: '4 days', unpaidRecorded: '0 days', accruedBalance: '12 days', assessment: 'Excellent / 98.5%', assessmentTone: 'success' },
  { department: 'Marketing & Sales', fte: '12 FTEs', annualUsed: '28 days', medicalTaken: '6 days', unpaidRecorded: '3 days', accruedBalance: '9 days', assessment: 'Moderate / 80.0%', assessmentTone: 'warning' },
  { department: 'Finance & Audit', fte: '10 FTEs', annualUsed: '22 days', medicalTaken: '5 days', unpaidRecorded: '1 day', accruedBalance: '11 days', assessment: 'Optimal / 92.1%', assessmentTone: 'info' },
  { department: 'Operations & Admin', fte: '16 FTEs', annualUsed: '35 days', medicalTaken: '9 days', unpaidRecorded: '2 days', accruedBalance: '10 days', assessment: 'Good / 88.4%', assessmentTone: 'success' },
]

export const LEAVE_LOGS: LeaveLogRow[] = [
  { id: 'REP01', employee: 'Sarah Lim', department: 'Engineering', leaveType: 'Annual leave', days: '3', duration: '2026-05-12 to 2026-05-14', paid: 'Yes', rate: '100% payout', approvedBy: 'Raj Kumar' },
  { id: 'REP02', employee: 'Raj Kumar', department: 'Engineering', leaveType: 'Medical leave', days: '2', duration: '2026-05-08 to 2026-05-09', paid: 'Yes', rate: 'Medical allowance', approvedBy: 'Nadia Chen' },
  { id: 'REP03', employee: 'Ahmad L', department: 'Operations', leaveType: 'Emergency leave', days: '1', duration: '2026-05-06', paid: 'Yes', rate: '100% payout', approvedBy: 'Sarah Lim' },
  { id: 'REP04', employee: 'Nadia Chen', department: 'Marketing', leaveType: 'Annual leave', days: '2', duration: '2026-05-20 to 2026-05-21', paid: 'Yes', rate: '100% payout', approvedBy: 'Raj Kumar' },
  { id: 'REP05', employee: 'Jonathan Goh', department: 'Finance', leaveType: 'Unpaid leave', days: '1', duration: '2026-05-11', paid: 'No', rate: '1.5x day deducted', approvedBy: 'Maya Tan' },
  { id: 'REP06', employee: 'Elena Rostova', department: 'Product', leaveType: 'Compassionate leave', days: '2', duration: '2026-05-04 to 2026-05-05', paid: 'Yes', rate: '100% payout', approvedBy: 'David Ng' },
  { id: 'REP07', employee: 'Tariq Al-Mansoor', department: 'Operations', leaveType: 'Replacement leave', days: '1', duration: '2026-05-15', paid: 'Yes', rate: '100% payout', approvedBy: 'Sarah Lim' },
  { id: 'REP08', employee: 'Maya Tan', department: 'HR', leaveType: 'Hour leave', days: '4h', duration: '2026-05-17', paid: 'Yes', rate: 'Hourly credit', approvedBy: 'Sarah Lim' },
]

export const LEAVE_COLOR_SWATCHES = ['#2563eb', '#059669', '#ea580c', '#ef4444', '#7c3aed', '#ec4899', '#0d9488']
