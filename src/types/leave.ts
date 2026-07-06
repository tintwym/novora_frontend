import type { RecruitPillTone } from './recruitment'

export type LeaveTypeRow = {
  name: string
  color: string
  paid: boolean
  deduction: string
  hourBased: boolean
  attachmentReq: boolean
}

export type LeavePolicyBlock = {
  title?: string
  rows: { label: string; value: string; highlight?: boolean }[]
}

export type LeavePolicyCard = {
  id: string
  title: string
  tag?: string
  blocks: LeavePolicyBlock[]
}

export type LeaveAttachmentRow = {
  id: number
  initials: string
  name: string
  department: string
  leaveType: string
  color: string
  entitlement: string
  attached: boolean
  activation: 'Manual' | 'Auto'
}

export type LeaveApprovalRow = {
  initials: string
  name: string
  leaveType: string
  typeTone: RecruitPillTone
  from: string
  to: string
  days: string
  reason: string
  approver: string
  status: string
  statusTone: RecruitPillTone
  pending?: boolean
  actionNote?: string
}

export type LeaveHistoryRow = {
  initials: string
  name: string
  leaveType: string
  typeTone: RecruitPillTone
  from: string
  to: string
  days: string
  requestedBy: string
  approvedBy: string
  status: string
  statusTone: RecruitPillTone
}

export type LeaveEntitlementRow = {
  label: string
  color: string
  entitled: string
  used: string
  balance: string
  carried: string
}

export type DeptLeaveRow = {
  department: string
  fte: string
  annualUsed: string
  medicalTaken: string
  unpaidRecorded: string
  accruedBalance: string
  assessment: string
  assessmentTone: 'info' | 'success' | 'warning'
}

export type LeaveLogRow = {
  id: string
  employee: string
  department: string
  leaveType: string
  days: string
  duration: string
  paid: string
  rate: string
  approvedBy: string
}
