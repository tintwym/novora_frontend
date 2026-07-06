import type { RecruitPillTone } from './recruitment'

export type RecentClaimRow = {
  date: string
  category: string
  amount: string
  status: string
  tone: RecruitPillTone
}

export type ApprovalClaimRow = {
  initials: string
  name: string
  category: string
  categoryTone: RecruitPillTone
  date: string
  amount: string
  foreignAmount?: string
  chain: string
  flag: string
  flagTone: RecruitPillTone
  status: string
  statusTone: RecruitPillTone
  pending: boolean
}

export type SpendLimitRow = {
  category: string
  daily: string
  monthly: string
  receipt: string
  receiptTone: RecruitPillTone
}

export type PolicyFlagRow = {
  title: string
  detail: string
  status: string
  tone: RecruitPillTone
  dotColor: string
}

export type AuditTrailRow = {
  text: string
  tone: 'success' | 'danger' | 'warning'
}

export type PayrollBatchRow = {
  initials: string
  name: string
  category: string
  amount: string
  approvedBy: string
  pushed: boolean
}

export type FxLogRow = {
  name: string
  currency: string
  original: string
  rate: string
  myr: string
}

export type ReportClaimRow = {
  id: string
  name: string
  department: string
  category: string
  date: string
  vendor: string
  amount: string
  flag: string
  flagTone: RecruitPillTone
  status: string
  statusTone: RecruitPillTone
}

export type HistoryClaimRow = {
  initials: string
  name: string
  department: string
  category: string
  date: string
  vendor: string
  amount: string
  approvedBy: string
  payrollMonth: string
  status: string
  tone: RecruitPillTone
}

export type ClaimViewData = {
  id: string
  name: string
  department: string
  status: string
  statusTone: RecruitPillTone
  date: string
  category: string
  vendor: string
  amount: string
  compliance: string
  intent: string
  receiptVendor: string
  receiptTotal: string
}

export type TopClaimantRow = {
  initials: string
  name: string
  claims: string
  total: string
  flags: string
  flagTone: RecruitPillTone
}
