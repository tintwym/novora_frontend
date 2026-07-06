import type { RecruitPillTone } from './recruitment'

export type TrainingTypeRow = {
  no: number
  name: string
  description: string
  courses: string
  status: string
  statusTone: RecruitPillTone
}

export type TrainingCategoryRow = {
  no: number
  name: string
  trainingType: string
  typeTone: RecruitPillTone
  description: string
  subjects: string
}

export type TrainingCourseRow = {
  title: string
  category: string
  categoryTone: RecruitPillTone
  delivery: string
  frequency: string
  mandatory: boolean
  dueWithin: string
  status: string
  statusTone: RecruitPillTone
}

export type TrainingSubjectRow = {
  title: string
  course: string
  internalTrainer: string
  externalTrainer: string
  skill: string
  skillTone: RecruitPillTone
}

export type TrainingScheduleRow = {
  course: string
  type: string
  period: string
  days: string
  fee: string
  companyCont: string
  requestBefore: string
  status: string
  statusTone: RecruitPillTone
}

export type TrainingApprovalRow = {
  initials: string
  name: string
  avatarColor: string
  course: string
  date: string
  location: string
  approvers: { name: string; approved: boolean }[]
  status: string
  statusTone: RecruitPillTone
  processed?: boolean
}

export type TrainingAttendanceRow = {
  initials: string
  name: string
  avatarColor: string
  courseSubject: string
  scheduleDate: string
  actualDate: string
  timeIn: string
  timeOut: string
  status: string
  statusTone: RecruitPillTone
}

export type TrainingHistoryRow = {
  initials: string
  name: string
  avatarColor: string
  course: string
  days: string
  fee: string
  approvedBy: string
  approvedTone?: 'danger' | 'success' | 'muted'
  status: string
  statusTone: RecruitPillTone
}

export type TrainingRequestTrackerRow = {
  course: string
  date: string
  status: string
  statusTone: RecruitPillTone
}

export type TrainingBehalfRow = {
  initials: string
  name: string
  avatarColor: string
  course: string
  date: string
  status: string
  statusTone: RecruitPillTone
}

export type TrainingComplianceRow = {
  employee: string
  course: string
  category: string
  dueDate: string
  mandatory: boolean
  completionStatus: string
  completionTone: RecruitPillTone
  signOff: string
}

export type TrainingSkillsRow = {
  employee: string
  department: string
  program: string
  skills: string[]
  proficiency: string
  proficiencyTone: RecruitPillTone
}

export type TrainingBudgetRow = {
  vendor: string
  course: string
  paymentType: string
  basePrice: string
  contribution: string
  invoiceStatus: string
  invoiceTone: RecruitPillTone
}

export type ReportMode = 'compliance' | 'skills' | 'budget'
