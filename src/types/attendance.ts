import type { RecruitPillTone } from './recruitment'

export type RosterCellTone = 'completed' | 'clockIn' | 'planned' | 'off' | 'leave' | 'ot' | 'night' | 'absent'

export type RosterCell = {
  time: string
  status: string
  tone: RosterCellTone
}

export type RosterEmployee = {
  initials: string
  name: string
  department: string
  days: RosterCell[]
}

export type TimesheetRow = {
  initials: string
  name: string
  department: string
  shift: string
  dateFrom: string
  dateTo: string
  dutyDays: string
  workingLogic: string
  status: string
  statusTone: RecruitPillTone
}

export type ShiftPattern = {
  id: string
  title: string
  active: boolean
  workHours: string
  breakTime: string
  nearestIn: string
  nearestOut: string
  allowInOt: string
  allowOutOt: string
  nightShift: string
  nightHighlight?: boolean
  assigned: string
}

export type UnknownSwipe = {
  id: number
  taNumber: string
  initials: string
  name: string
  swipeTime: string
  terminal: string
  issue: string
  issueTone: RecruitPillTone
}

export type OtRecord = {
  initials: string
  name: string
  date: string
  start: string
  end: string
  hours: string
}

export type ManualPunchRecord = {
  time: string
  employee: string
  empId: string
  type: string
  reason: string
  badge: string
  badgeTone: RecruitPillTone
}

export type RollCallRow = {
  initials: string
  name: string
  department: string
  shift: string
  clockIn: string
  clockOut: string
  workHours: string
  inOffice: string
  inOfficeYes?: boolean
  status: string
  statusTone: RecruitPillTone
}

export type ReportDetailRow = {
  initials: string
  name: string
  date: string
  shift: string
  clockIn: string
  clockOut: string
  workHours: string
  late: string
  otHours: string
  status: string
  statusTone: RecruitPillTone
}

export type DeptScoreRow = {
  department: string
  staff: string
  avgHours: string
  punctuality: string
  punctualityTone?: 'success' | 'warning'
  overtime: string
  absences: string
  compliance: string
  complianceTone: 'success' | 'warning' | 'danger'
}

export type RecentDayLog = {
  date: string
  range: string
  hours: string
  present: boolean
}
