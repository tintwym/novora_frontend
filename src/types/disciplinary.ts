import type { RecruitPillTone } from './recruitment'

export type DisciplinaryReason = {
  name: string
  dotColor: string
  severity: string
  severityTone: RecruitPillTone
  description: string
  status: string
  statusTone: RecruitPillTone
}

export type WarningAction = {
  level: string
  name: string
  type: string
  description: string
  payImpact: string
  payTone: RecruitPillTone
}

export type DisciplinaryHistoryRow = {
  initials: string
  name: string
  meta: string
  offence: string
  incidentDate: string
  actionDate: string
  warningLevel: string
  issuedBy: string
  status: string
  statusKind: 'pending' | 'acknowledged' | 'closed'
}

export type DisciplinaryLogRow = {
  caseId: string
  name: string
  meta: string
  violation: string
  detail: string
  incidentDate: string
  level: string
  issuedBy: string
  status: string
  statusKind: 'pending' | 'acknowledged' | 'closed'
}

export type SummaryBalanceRow = {
  name: string
  empId: string
  department: string
  role: string
  cases: string
  pending: string
  highest: string
  latest: string
  recorded?: string
  clear: boolean
}

export type DeptDisciplinaryRow = {
  department: string
  staff: string
  infractions: string
  investigating: string
  resolved: string
  violation: string
}
