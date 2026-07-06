export type RecruitPillTone = 'success' | 'info' | 'warning' | 'danger' | 'purple' | 'pink' | 'neutral'

export type RequisitionRow = {
  id: string
  position: string
  department: string
  deptTone: RecruitPillTone
  type: string
  requestedBy: string
  openDate: string
  targetFill: string
  applicants: number
  status: string
  statusTone: RecruitPillTone
}

export type PipelineCandidate = {
  id: string
  name: string
  details: string
  source: string
  score: string
  selected?: boolean
}

export type PipelineColumn = {
  stage: string
  count: number
  candidates: PipelineCandidate[]
}

export type InterviewRow = {
  name: string
  role: string
  stage: string
  dateTime: string
  format: string
  formatTone: 'warning' | 'info' | 'purple'
  status: string
  statusTone: RecruitPillTone
}

export type OfferRow = {
  name: string
  role: string
  salary: string
  sentDate: string
  expiry: string
  status: string
  statusTone: RecruitPillTone
  selected?: boolean
}

export type LedgerRow = {
  reqCode: string
  position: string
  sector: string
  recruiter: string
  funnel: number[]
  spend: string
  cycleTime: string
  status: string
  statusTone: RecruitPillTone
}
