import type { RecruitPillTone } from './recruitment'

export type PerfLevelRow = {
  no: number
  name: string
  description: string
  employees: number
}

export type PerfGradeRow = {
  letter: string
  letterBg: string
  name: string
  markFrom: string
  markTo: string
  apply: boolean
  employees: number
}

export type KpiBandRow = {
  from: string
  to: string
  target: string
  targetTone?: 'success' | 'primary' | 'warning' | 'danger'
  score: string
  scoreTone: 'success' | 'primary' | 'warning' | 'danger'
}

export type EvalTypeRow = {
  name: string
  everyMonth: string
  achieveKpi: boolean
  notifyBefore: string
  traineeEval: boolean
  appraiser: string
}

export type EvalCategoryRow = {
  name: string
  kpiType: string
  typeTone: RecruitPillTone
  weight: string
  scoring: string
  measurement: string
  levels: string
}

export type SetupCategory = { label: string; checked: boolean }

export type EvalSetupCard = {
  title: string
  categories: SetupCategory[]
  settings: { label: string; value: string; positive?: boolean }[]
}

export type GrantPermissionRow = {
  initials: string
  avatarBg: string
  evaluator: string
  evalType: string
  from: string
  to: string
  pending: string
  pendingLink?: boolean
  status: string
  statusTone: RecruitPillTone
  expired?: boolean
}

export type EvaluationListRow = {
  initials: string
  avatarBg: string
  name: string
  reviewType: string
  reviewDate: string
  reviewPeriod: string
  status: string
  statusTone: RecruitPillTone
  action: string
}

export type PerfResultRow = {
  initials: string
  avatarBg: string
  name: string
  attr: string
  kpi: string
  comp: string
  attend: string
  total: string
  totalWarning?: boolean
  grade: string
  gradeBg: string
}

export type CompetencyRow = {
  name: string
  sub?: boolean
  type: string
  typeTone: RecruitPillTone
  parent: string
  definition: string
}

export type ReviewReportRow = {
  initials: string
  avatarBg: string
  name: string
  reviewType: string
  reviewPeriod: string
  total: string
  grade: string
  gradeBg: string
  appraiser: string
}

export type ScoreBreakdown = { label: string; value: number; color: string }

export type ReviewHistoryRow = { type: string; period: string; score: string; grade: string; gradeBg: string; scoreTone?: 'primary' | 'warning' }

export type TrainingRec = { label: string; mandatory: boolean }
